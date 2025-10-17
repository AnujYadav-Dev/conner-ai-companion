import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  getUserAccount,
  getChatHistory,
  getSessionSettings,
  saveChatHistory,
  saveSessionSettings,
  clearChatHistory,
  clearAllConversationSessions,
  saveConversationSession,
  getConversationSessions,
  getConversationSession,
  setCurrentSession,
  getCurrentSession,
} from "../utils/storage.js";
import { initializeConner, isConnerInitialized } from "../utils/conner.js";

const AppContext = createContext();

// Action types
const ACTIONS = {
  SET_USER: "SET_USER",
  SET_CHAT_HISTORY: "SET_CHAT_HISTORY",
  ADD_MESSAGE: "ADD_MESSAGE",
  SET_CURRENT_CHAT: "SET_CURRENT_CHAT",
  SET_CURRENT_SESSION: "SET_CURRENT_SESSION",
  SET_SESSION_LIST: "SET_SESSION_LIST",
  SET_LOADING: "SET_LOADING",
  SET_SIDEBAR_OPEN: "SET_SIDEBAR_OPEN",
  SET_DARK_MODE: "SET_DARK_MODE",
  SET_SETTINGS_OPEN: "SET_SETTINGS_OPEN",
  SET_HELP_OPEN: "SET_HELP_OPEN",
  SET_AI_MODE: "SET_AI_MODE",
  CLEAR_CHAT: "CLEAR_CHAT",
  CLEAR_ALL_CHAT_DATA: "CLEAR_ALL_CHAT_DATA",
  NEW_CHAT: "NEW_CHAT",
};

// Initial state
const initialState = {
  user: null,
  chatHistory: [],
  currentChat: null,
  isLoading: false,
  sidebarOpen: true,
  darkMode: false,
  settingsOpen: false,
  helpOpen: false,
  recentChats: [],
  sessionList: [],
  currentSessionId: null,
  aiMode: "supportive",
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_USER:
      return { ...state, user: action.payload };

    case ACTIONS.SET_CHAT_HISTORY:
      return { ...state, chatHistory: action.payload };

    case ACTIONS.ADD_MESSAGE: {
      const newHistory = [...state.chatHistory, action.payload];
      return { ...state, chatHistory: newHistory };
    }

    case ACTIONS.SET_CURRENT_CHAT:
      return { ...state, currentChat: action.payload };

    case ACTIONS.SET_SESSION_LIST:
      return { ...state, sessionList: action.payload };

    case ACTIONS.SET_CURRENT_SESSION:
      return {
        ...state,
        currentSessionId: action.payload.sessionId,
        chatHistory: action.payload.messages || [],
      };

    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case ACTIONS.SET_SIDEBAR_OPEN:
      return { ...state, sidebarOpen: action.payload };

    case ACTIONS.SET_DARK_MODE:
      return { ...state, darkMode: action.payload };

    case ACTIONS.SET_SETTINGS_OPEN:
      return { ...state, settingsOpen: action.payload };

    case ACTIONS.SET_HELP_OPEN:
      return { ...state, helpOpen: action.payload };

    case ACTIONS.SET_AI_MODE:
      return { ...state, aiMode: action.payload };

    case ACTIONS.CLEAR_CHAT:
      return { ...state, chatHistory: [], currentChat: null };

    case ACTIONS.CLEAR_ALL_CHAT_DATA:
      clearAllConversationSessions();
      return {
        ...state,
        chatHistory: [],
        currentChat: null,
        sessionList: [],
        currentSessionId: null,
      };

    case ACTIONS.NEW_CHAT: {
      // Only archive old chat if it's an unsaved (new) chat
      if (
        !state.currentSessionId &&
        state.chatHistory &&
        state.chatHistory.length > 0
      ) {
        const title = state.chatHistory[0]?.content?.slice(0, 30) || "Chat";
        saveConversationSession({ title, messages: state.chatHistory });
      }
      setCurrentSession(null);
      return {
        ...state,
        chatHistory: [],
        currentSessionId: null,
        currentChat: null,
      };
    }
    default:
      return state;
  }
};

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load initial data
  useEffect(() => {
    const loadInitialData = () => {
      const user = getUserAccount();
      const chatHistory = getChatHistory();
      const settings = getSessionSettings();
      const sessions = getConversationSessions();
      const aiMode = settings.aiPersonality || "supportive";
      // Always start on 'home'
      dispatch({ type: ACTIONS.SET_SESSION_LIST, payload: sessions });
      if (user) {
        dispatch({ type: ACTIONS.SET_USER, payload: user });
      }
      dispatch({ type: ACTIONS.SET_AI_MODE, payload: aiMode });
      // DO NOT restore previous chat session; always show home
      dispatch({ type: ACTIONS.SET_CHAT_HISTORY, payload: [] });
      dispatch({
        type: ACTIONS.SET_CURRENT_SESSION,
        payload: { sessionId: null, messages: [] },
      });
      dispatch({ type: ACTIONS.SET_DARK_MODE, payload: settings.darkMode });
      if (settings.darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };
    loadInitialData();
  }, []);

  // Save chat history and current session when it changes
  useEffect(() => {
    if (!state.chatHistory || state.chatHistory.length === 0) return;
    if (state.chatHistory && state.chatHistory.length > 0) {
      saveChatHistory(state.chatHistory);
      if (state.currentSessionId) {
        saveConversationSession({
          id: state.currentSessionId,
          messages: state.chatHistory,
        });
      } else {
        // Prevent duplicate session after reload: only create a new session if there is not already one with same message list
        const existingSessions = getConversationSessions();
        const found = existingSessions.find(
          (session) =>
            session.messages.length === state.chatHistory.length &&
            session.messages.every(
              (msg, idx) =>
                JSON.stringify(msg) === JSON.stringify(state.chatHistory[idx])
            )
        );
        if (found) {
          setCurrentSession(found.id);
          dispatch({
            type: ACTIONS.SET_CURRENT_SESSION,
            payload: { sessionId: found.id, messages: found.messages },
          });
        } else {
          const newSessionId = saveConversationSession({
            messages: state.chatHistory,
            title:
              state.chatHistory[0]?.content?.slice(0, 30) || "Conversation",
          });
          if (newSessionId) {
            setCurrentSession(newSessionId);
            dispatch({
              type: ACTIONS.SET_CURRENT_SESSION,
              payload: { sessionId: newSessionId, messages: state.chatHistory },
            });
          }
        }
      }
    }
  }, [state.chatHistory, state.currentSessionId]);

  // Reload session list when a new session is started
  useEffect(() => {
    const sessions = getConversationSessions();
    dispatch({ type: ACTIONS.SET_SESSION_LIST, payload: sessions });
  }, [state.chatHistory]);

  // Context value
  const value = {
    ...state,
    dispatch,
    actions: ACTIONS,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export default AppContext;
