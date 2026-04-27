/*
  geminiService.ts
  - Thin wrapper around the Google GenAI (Gemini) client used by the chat widget.
  - Exposes a single `sendMessageToGemini` utility which accepts a message history and a new message.
  - The service injects a system instruction focused on the Shenzhen Metro to bias responses.
*/
import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

// Lazily initialize the Gemini client using the environment API key
const initializeAI = () => {
    if (!ai && process.env.API_KEY) {
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
};

// Simple chat message shape used by the UI
export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

// Send a message to Gemini and return the text response.
// - `history` should contain prior chat messages (optional).
// - `newMessage` is the user's current message.
// - `context` is an optional string injected into the system prompt to provide additional situational data.
export const sendMessageToGemini = async (
    history: ChatMessage[],
    newMessage: string,
    context?: string
): Promise<string> => {
    const aiInstance = initializeAI();
    if (!aiInstance) {
        // Return a friendly error string that the UI can display when the API key is missing
        return "Error: API Key not configured. Please set process.env.API_KEY.";
    }

    try {
        // System instruction biases the assistant toward Shenzhen Metro domain knowledge
        const systemInstruction = `You are an expert guide for the Shenzhen Metro system.\n` +
        `You help users navigate, find station details, and plan trips.\n` +
        `Keep answers concise and helpful.\n` +
        `If the user asks about a specific station, provide details about its location, lines, nearby landmarks, and transfer information.` +
        `${context ? `\nCurrent Context: ${context}` : ''}`;

        const chat = aiInstance.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction,
            },
            // Map the simple history shape into the client's expected format
            history: history.map(h => ({
                role: h.role,
                parts: [{ text: h.text }]
            }))
        });

        const result = await chat.sendMessage({ message: newMessage });
        // The API returns a result object; unwrap the text or provide a fallback
        return result.text || "I couldn't generate a response.";
    } catch (error) {
        // Log detailed error for developers and return a safe user-facing message
        console.error("Gemini API Error:", error);
        return "Sorry, I encountered an error while processing your request.";
    }
};