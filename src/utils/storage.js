// LocalStorage utilities for the mental health chatbot

export const STORAGE_KEYS = {
    USER_ACCOUNT: 'conner_userAccount',
    CHAT_HISTORY: 'conner_chatHistory',
    CONVERSATION_SESSIONS: 'conner_conversationSessions',
    CURRENT_SESSION: 'conner_currentSession',
    CURRENT_USER: 'conner_currentUser',
    SESSION_SETTINGS: 'conner_sessionSettings',
    LAST_LOGIN: 'conner_lastLogin'
};

// Default session settings
export const DEFAULT_SETTINGS = {
    darkMode: false,
    messageLimit: 100,
    contextWindowSize: 10,
    aiPersonality: 'supportive', // supportive, reflective, logical
    typingSpeed: 50
};

// User account management
export const saveUserAccount = (userData) => {
    try {
        const accountData = {
            name: userData.name,
            email: userData.email,
            // For demo purposes only; do NOT store plaintext passwords in production
            password: userData.password || null,
            joinedDate: userData.joinedDate || new Date().toISOString(),
            preferences: userData.preferences || {}
        };
        localStorage.setItem(STORAGE_KEYS.USER_ACCOUNT, JSON.stringify(accountData));
        return true;
    } catch (error) {
        console.error('Error saving user account:', error);
        return false;
    }
};

export const getUserAccount = () => {
    try {
        const accountData = localStorage.getItem(STORAGE_KEYS.USER_ACCOUNT);
        return accountData ? JSON.parse(accountData) : null;
    } catch (error) {
        console.error('Error getting user account:', error);
        return null;
    }
};

// Chat history management
export const saveChatHistory = (messages) => {
    try {
        localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(messages));
        return true;
    } catch (error) {
        console.error('Error saving chat history:', error);
        return false;
    }
};

export const getChatHistory = () => {
    try {
        const history = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
        return history ? JSON.parse(history) : [];
    } catch (error) {
        console.error('Error getting chat history:', error);
        return [];
    }
};

export const addMessageToHistory = (role, content) => {
    try {
        const history = getChatHistory();
        const newMessage = {
            role,
            content,
            timestamp: new Date().toISOString()
        };
        history.push(newMessage);
        saveChatHistory(history);
        return newMessage;
    } catch (error) {
        console.error('Error adding message to history:', error);
        return null;
    }
};

export const clearChatHistory = () => {
    try {
        localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
        return true;
    } catch (error) {
        console.error('Error clearing chat history:', error);
        return false;
    }
};

export const clearAllConversationSessions = () => {
    try {
        localStorage.removeItem(STORAGE_KEYS.CONVERSATION_SESSIONS);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
        return true;
    } catch (error) {
        console.error('Error clearing conversation sessions:', error);
        return false;
    }
};

// Session settings management
export const saveSessionSettings = (settings) => {
    try {
        const currentSettings = getSessionSettings();
        const updatedSettings = { ...currentSettings, ...settings };
        localStorage.setItem(STORAGE_KEYS.SESSION_SETTINGS, JSON.stringify(updatedSettings));
        return true;
    } catch (error) {
        console.error('Error saving session settings:', error);
        return false;
    }
};

export const getSessionSettings = () => {
    try {
        const settings = localStorage.getItem(STORAGE_KEYS.SESSION_SETTINGS);
        return settings ? { ...DEFAULT_SETTINGS, ...JSON.parse(settings) } : DEFAULT_SETTINGS;
    } catch (error) {
        console.error('Error getting session settings:', error);
        return DEFAULT_SETTINGS;
    }
};


// Last login tracking
export const updateLastLogin = () => {
    try {
        localStorage.setItem(STORAGE_KEYS.LAST_LOGIN, new Date().toISOString());
        return true;
    } catch (error) {
        console.error('Error updating last login:', error);
        return false;
    }
};

export const getLastLogin = () => {
    try {
        return localStorage.getItem(STORAGE_KEYS.LAST_LOGIN);
    } catch (error) {
        console.error('Error getting last login:', error);
        return null;
    }
};

// Export chat history
export const exportChatHistory = (format = 'json') => {
    try {
        const history = getChatHistory();
        const userAccount = getUserAccount();
        const timestamp = new Date().toISOString().split('T')[0];

        if (format === 'json') {
            const data = {
                user: userAccount,
                chatHistory: history,
                exportedAt: new Date().toISOString()
            };
            return JSON.stringify(data, null, 2);
        } else if (format === 'txt') {
            let text = `Conner Mental Health Chat Export\n`;
            text += `User: ${userAccount?.name || 'Unknown'}\n`;
            text += `Exported: ${new Date().toLocaleString()}\n\n`;

            history.forEach(msg => {
                const timestamp = new Date(msg.timestamp).toLocaleString();
                text += `[${timestamp}] ${msg.role.toUpperCase()}: ${msg.content}\n\n`;
            });

            return text;
        }
    } catch (error) {
        console.error('Error exporting chat history:', error);
        return null;
    }
};

// Get context window for AI
export const getContextWindow = (windowSize = 10) => {
    try {
        const history = getChatHistory();

        // Get the last N messages (no system prompt needed - backend handles it)
        const recentMessages = history.slice(-windowSize);

        return recentMessages;
    } catch (error) {
        console.error('Error getting context window:', error);
        return [];
    }
};

// Check if user is logged in
export const isUserLoggedIn = () => {
    try {
        const currentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        return Boolean(currentUser);
    } catch (error) {
        return false;
    }
};

// Clear all data (logout)
export const clearAllData = () => {
    try {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        return true;
    } catch (error) {
        console.error('Error clearing all data:', error);
        return false;
    }
};

// Session user helpers (login/logout)
export const setCurrentUser = (email) => {
    try {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, email || '');
        return true;
    } catch (e) {
        return false;
    }
};

export const getCurrentUserEmail = () => {
    try {
        return localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    } catch (e) {
        return null;
    }
};

export const clearCurrentUser = () => {
    try {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        return true;
    } catch (e) {
        return false;
    }
};

// Conversation session management
export const saveConversationSession = (sessionData) => {
    try {
        const sessions = getConversationSessions();
        const sessionId = sessionData.id || `session_${Date.now()}`;

        const session = {
            id: sessionId,
            title: sessionData.title || (sessions.find(s => s.id === sessionId)?.title) || 'New Conversation',
            messages: sessionData.messages || [],
            createdAt: sessionData.createdAt || sessions.find(s => s.id === sessionId)?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messageCount: sessionData.messages?.length || 0
        };

        // Update or add session
        const existingIndex = sessions.findIndex(s => s.id === sessionId);
        if (existingIndex >= 0) {
            sessions[existingIndex] = session;
        } else {
            sessions.push(session);
        }

        // Keep only last 50 sessions
        if (sessions.length > 50) {
            sessions.splice(0, sessions.length - 50);
        }

        localStorage.setItem(STORAGE_KEYS.CONVERSATION_SESSIONS, JSON.stringify(sessions));
        return sessionId;
    } catch (error) {
        console.error('Error saving conversation session:', error);
        return null;
    }
};

export const getConversationSessions = () => {
    try {
        const sessions = localStorage.getItem(STORAGE_KEYS.CONVERSATION_SESSIONS);
        return sessions ? JSON.parse(sessions) : [];
    } catch (error) {
        console.error('Error getting conversation sessions:', error);
        return [];
    }
};

export const getConversationSession = (sessionId) => {
    try {
        const sessions = getConversationSessions();
        return sessions.find(session => session.id === sessionId) || null;
    } catch (error) {
        console.error('Error getting conversation session:', error);
        return null;
    }
};

export const deleteConversationSession = (sessionId) => {
    try {
        const sessions = getConversationSessions();
        const filteredSessions = sessions.filter(session => session.id !== sessionId);
        localStorage.setItem(STORAGE_KEYS.CONVERSATION_SESSIONS, JSON.stringify(filteredSessions));
        return true;
    } catch (error) {
        console.error('Error deleting conversation session:', error);
        return false;
    }
};

export const setCurrentSession = (sessionId) => {
    try {
        localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, sessionId);
        return true;
    } catch (error) {
        console.error('Error setting current session:', error);
        return false;
    }
};

export const getCurrentSession = () => {
    try {
        return localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
    } catch (error) {
        console.error('Error getting current session:', error);
        return null;
    }
};
