import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini, ChatMessage } from '../services/geminiService';

interface ChatWidgetProps {
    defaultOpen?: boolean;
    context?: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ defaultOpen = false, context }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: 'Hello! I am your Shenzhen Metro AI guide. Ask me anything about stations, lines, or travel routes!' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMsg = inputValue.trim();
        setInputValue('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsLoading(true);

        try {
            // Filter history to last 10 messages to keep context window manageable
            const history = messages.slice(-10);
            const response = await sendMessageToGemini(history, userMsg, context);
            setMessages(prev => [...prev, { role: 'model', text: response }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 left-6 z-[9999] font-sans">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-transform transform hover:scale-105"
                    title="Ask AI Assistant"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                </button>
            )}

            {isOpen && (
                <div className="flex flex-col w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
                                <path d="M12 2a10 10 0 0 1 10 10H12V2z"></path>
                                <path d="M12 12L2.1 11.9"></path>
                            </svg>
                            <span className="font-semibold">Metro AI Assistant</span>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-blue-700 rounded-full transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                                    msg.role === 'user' 
                                        ? 'bg-blue-600 text-white rounded-br-none' 
                                        : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-none'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white text-gray-500 border border-gray-100 shadow-sm rounded-2xl rounded-bl-none px-4 py-3 text-sm flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-100">
                        <div className="relative">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Ask about routes, stations..."
                                className="w-full pl-4 pr-10 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                disabled={isLoading}
                            />
                            <button 
                                type="submit" 
                                disabled={!inputValue.trim() || isLoading}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;