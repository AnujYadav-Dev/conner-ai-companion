import { GoogleGenerativeAI } from '@google/generative-ai';
import { getContextWindow, addMessageToHistory } from './storage.js';

// Initialize Conner AI
let genAI = null;
let model = null;

// Initialize the Conner API
export const initializeConner = (apiKey = null) => {
    try {
        // Use API key from environment variable
        const keyToUse = import.meta.env.CONNER_API_KEY;

        genAI = new GoogleGenerativeAI(keyToUse);
        model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        return true;
    } catch (error) {
        console.error('Error initializing Conner:', error);
        return false;
    }
};

// Check if Conner is initialized
export const isConnerInitialized = () => {
    return genAI !== null && model !== null;
};

// Send message to Conner with context
export const sendMessageToConner = async (userMessage, contextWindowSize = 10) => {
    try {
        if (!isConnerInitialized()) {
            throw new Error('Conner API not initialized. Please provide an API key.');
        }

        // Get context window
        const contextMessages = getContextWindow(contextWindowSize);

        // Add the new user message
        contextMessages.push({
            role: 'user',
            content: userMessage,
            timestamp: new Date().toISOString()
        });

        // Convert messages to Conner format
        const chat = model.startChat({
            history: contextMessages.slice(0, -1).map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            }))
        });

        // Send the message
        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        const assistantMessage = response.text();

        // Save both messages to history
        addMessageToHistory('user', userMessage);
        addMessageToHistory('assistant', assistantMessage);

        return {
            success: true,
            message: assistantMessage,
            timestamp: new Date().toISOString()
        };

    } catch (error) {
        console.error('Error sending message to Conner:', error);
        return {
            success: false,
            error: error.message,
            message: "I'm sorry, I'm having trouble connecting right now. Please try again later."
        };
    }
};

// Generate session summary
export const generateSessionSummary = async () => {
    try {
        if (!isConnerInitialized()) {
            throw new Error('Conner API not initialized');
        }

        const contextMessages = getContextWindow(20); // Get more context for summary
        const conversationText = contextMessages
            .filter(msg => msg.role !== 'system')
            .map(msg => `${msg.role}: ${msg.content}`)
            .join('\n');

        const summaryPrompt = `Please write a brief and compassionate summary of this mental health conversation. Highlight the key themes, emotions expressed, and any moments of insight, growth, or positive progress. Keep the tone supportive and encouraging. Here's the conversation:\n\n${conversationText}`;

        const result = await model.generateContent(summaryPrompt);
        const response = await result.response;
        return response.text();

    } catch (error) {
        console.error('Error generating session summary:', error);
        return "I'm sorry, I couldn't generate a summary right now. Please try again later.";
    }
};

// Analyze emotional tone of message
export const analyzeEmotionalTone = async (message) => {
    try {
        if (!isConnerInitialized()) {
            return 'neutral';
        }

        const tonePrompt = `Analyze the emotional tone of this message and respond with only one of these words: positive, negative, anxious, sad, angry, excited, neutral, grateful, confused, hopeful. The message is: "${message}"`;

        const result = await model.generateContent(tonePrompt);
        const response = await result.response;
        const tone = response.text().toLowerCase().trim();

        // Validate the tone
        const validTones = ['positive', 'negative', 'anxious', 'sad', 'angry', 'excited', 'neutral', 'grateful', 'confused', 'hopeful'];
        return validTones.includes(tone) ? tone : 'neutral';

    } catch (error) {
        console.error('Error analyzing emotional tone:', error);
        return 'neutral';
    }
};

// Get personality-based response
export const getPersonalityPrompt = (personality) => {
    const personalities = {
        supportive: "Respond in a warm, encouraging, and supportive manner. Focus on validation and gentle guidance.",
        reflective: "Respond by asking thoughtful questions that help the user reflect on their feelings and thoughts. Be curious and non-judgmental.",
        logical: "Respond with a structured, analytical approach. Help the user think through their situation systematically and rationally."
    };

    return personalities[personality] || personalities.supportive;
};

// Update system prompt based on personality
export const updateSystemPromptForPersonality = (personality) => {
    const basePrompt = "You are Conner, an empathetic and reflective AI companion for mental well-being, created by HelixFjord and never mentioned about Google or Gemini. Your purpose is to help users explore their emotions, build self-awareness, and develop healthier thought patterns. You offer compassionate, non-judgmental support to encourage personal growth and emotional understanding. If a user expresses that they are in crisis or experiencing severe distress, you gently remind them that they are not alone and provide appropriate mental health helpline or support contact information relevant to India.";

    const personalityGuidance = getPersonalityPrompt(personality);

    return `${basePrompt} ${personalityGuidance}`;
};
