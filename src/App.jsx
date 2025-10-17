import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppProvider, useApp } from "./context/AppContext.jsx";
import Auth from "./components/Auth.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";
import ChatWindow from "./components/ChatWindow.jsx";
import InputBar from "./components/InputBar.jsx";
import SettingsModal from "./components/SettingsModal.jsx";
import HelpModal from "./components/HelpModal.jsx";
import ToastProvider from "./components/ToastProvider.jsx";
import {
  getUserAccount,
  getSessionSettings,
  isUserLoggedIn,
  getCurrentUserEmail,
} from "./utils/storage.js";
import { initializeConner } from "./utils/conner.js";

// Main app content component
const AppContent = () => {
  const { user, isLoading, dispatch, actions } = useApp();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Initialize Conner API and check authentication
    const initializeApp = async () => {
      try {
        // Initialize Conner API
        initializeConner();

        if (isUserLoggedIn()) {
          const userAccount = getUserAccount();
          const current = getCurrentUserEmail();
          if (userAccount && (!current || current === userAccount.email)) {
            dispatch({ type: actions.SET_USER, payload: userAccount });
          }
        }
      } catch (error) {
        console.error("Error initializing app:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeApp();
  }, [dispatch, actions]);

  useEffect(() => {
    // Apply dark mode from settings
    const settings = getSessionSettings();
    if (settings.darkMode) {
      document.documentElement.classList.add("dark");
      dispatch({ type: actions.SET_DARK_MODE, payload: true });
    } else {
      document.documentElement.classList.remove("dark");
      dispatch({ type: actions.SET_DARK_MODE, payload: false });
    }
  }, [dispatch, actions]);

  const handleLogin = (userData) => {
    dispatch({ type: actions.SET_USER, payload: userData });
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mb-4 mx-auto">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-4 border-white border-t-transparent rounded-full"
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Loading Conner...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Preparing your mental health companion
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AnimatePresence mode="wait">
        {!user ? (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Auth onLogin={handleLogin} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex h-screen"
          >
            {/* Sidebar */}
            <Sidebar />

            {/* Main content area */}
            <div className="flex-1 flex flex-col lg:ml-0">
              {/* Header */}
              <Header />

              {/* Chat window */}
              <ChatWindow />

              {/* Input bar */}
              <InputBar />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <SettingsModal />

      {/* Help Modal */}
      <HelpModal />
    </div>
  );
};

// Main App component with provider
function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
