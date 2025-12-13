import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

const initializeAI = () => {
    if (!ai && process.env.API_KEY) {
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
};

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export const sendMessageToGemini = async (
    history: ChatMessage[],
    newMessage: string,
    context?: string
): Promise<string> => {
    const aiInstance = initializeAI();
    if (!aiInstance) {
        return "Error: API Key not configured. Please set process.env.API_KEY.";
    }

    try {
        const systemInstruction = `You are an expert guide for the Shenzhen Metro system. 
        You help users navigate, find station details, and plan trips. 
        Keep answers concise and helpful. 
        If the user asks about a specific station, provide details about its location, lines, nearby landmarks, and transfer information.
        ${context ? `Current Context: ${context}` : ''}`;

        const chat = aiInstance.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction,
            },
            history: history.map(h => ({
                role: h.role,
                parts: [{ text: h.text }]
            }))
        });

        const result = await chat.sendMessage({ message: newMessage });
        return result.text || "I couldn't generate a response.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Sorry, I encountered an error while processing your request.";
    }
};