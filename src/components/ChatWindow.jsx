import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../context/AppContext.jsx";
import MessageBubble from "./MessageBubble.jsx";
import { sendMessageToConner, isConnerInitialized } from "../utils/conner.js";

const ChatWindow = () => {
  const { user, chatHistory, isLoading, sidebarOpen, dispatch, actions } =
    useApp();

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isLoading]);

  const getGreetingMessage = () => {
    const hour = new Date().getHours();
    let greeting = "Good morning";

    if (hour >= 12 && hour < 17) {
      greeting = "Good afternoon";
    } else if (hour >= 17) {
      greeting = "Good evening";
    }

    return `${greeting}, ${user?.name?.split(" ")[0] || "there"}`;
  };

  const getMotivationalMessage = () => {
    const messages = [
      "How are you feeling today?",
      "What's on your mind?",
      "I'm here to listen and support you.",
      "Take a moment to reflect on your thoughts.",
      "You're doing great by reaching out.",
      "What would you like to talk about?",
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  };

  const handleSuggestionClick = async (suggestion) => {
    if (isLoading) return;

    const userMsg = {
      role: "user",
      content: suggestion,
      timestamp: new Date().toISOString(),
    };

    dispatch({ type: actions.ADD_MESSAGE, payload: userMsg });
    dispatch({ type: actions.SET_LOADING, payload: true });

    try {
      if (!isConnerInitialized()) {
        throw new Error("Conner API not initialized");
      }

      const response = await sendMessageToConner(suggestion);

      if (response.success) {
        const assistantMsg = {
          role: "assistant",
          content: response.message,
          timestamp: response.timestamp,
        };
        dispatch({ type: actions.ADD_MESSAGE, payload: assistantMsg });
      } else {
        throw new Error(response.error || "Failed to get response");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMsg = {
        role: "assistant",
        content:
          "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date().toISOString(),
        isError: true,
      };
      dispatch({ type: actions.ADD_MESSAGE, payload: errorMsg });
    } finally {
      dispatch({ type: actions.SET_LOADING, payload: false });
    }
  };

  return (
    <div className="chat-area flex-1 flex flex-col overflow-hidden">
      {/* Main chat content */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-6 pb-20 mt-20"
        style={{
          paddingLeft: sidebarOpen ? "0" : "1rem",
          paddingRight: "1rem",
        }}
      >
        <div className="max-w-3xl mx-auto">
          {/* Welcome message when no chat history */}
          {chatHistory.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20  rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <img src="/conner.svg" alt="Conner" className="w-12 h-12" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold text-gray-900 dark:text-white mb-3"
              >
                {getGreetingMessage()}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-600 dark:text-gray-400 mb-10"
              >
                {getMotivationalMessage()}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap justify-center gap-3"
              >
                {[
                  "I'm feeling anxious",
                  "I need to talk",
                  "I'm having a tough day",
                  "I want to reflect",
                ].map((suggestion, index) => (
                  <motion.button
                    key={suggestion}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-5 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Chat messages */}
          <AnimatePresence>
            {chatHistory.map((message, index) => (
              <MessageBubble
                key={`${message.timestamp}-${index}`}
                message={message}
              />
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isLoading && <MessageBubble message={{}} isTyping={true} />}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
