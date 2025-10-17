import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Download, Trash2, Settings, Heart, Bot } from "lucide-react";
import {
  getChatHistory,
  addMessageToHistory,
  clearChatHistory,
  exportChatHistory,
} from "../utils/storage.js";
import { sendMessageToConner, isConnerInitialized } from "../utils/conner.js";
import toast from "../utils/toast.js";
import TypingIndicator from "./TypingIndicator.jsx";

const Chat = ({ user, onSettings, onLogout }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load chat history on component mount
  useEffect(() => {
    const history = getChatHistory();
    setMessages(history);

    // Check if Conner is initialized
    if (!isConnerInitialized()) {
      setShowApiKeyModal(true);
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");

    // Add user message to UI immediately
    const userMsg = {
      role: "user",
      content: userMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Check if Conner is initialized
      if (!isConnerInitialized()) {
        throw new Error("Conner API not initialized");
      }

      // Send to Conner
      const response = await sendMessageToConner(userMessage);

      if (response.success) {
        const assistantMsg = {
          role: "assistant",
          content: response.message,
          timestamp: response.timestamp,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error(response.error || "Failed to get response");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMsg = {
        role: "assistant",
        content:
          "I'm sorry, I'm having trouble connecting right now. Please make sure your API key is correct and try again.",
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleClearChat = () => {
    clearChatHistory();
    setMessages([]);
  };

  const handleExportChat = () => {
    const jsonData = exportChatHistory("json");
    const txtData = exportChatHistory("txt");

    // Create and download JSON file
    const jsonBlob = new Blob([jsonData], { type: "application/json" });
    const jsonUrl = URL.createObjectURL(jsonBlob);
    const jsonLink = document.createElement("a");
    jsonLink.href = jsonUrl;
    jsonLink.download = `conner-chat-${
      new Date().toISOString().split("T")[0]
    }.json`;
    jsonLink.click();

    // Create and download TXT file
    const txtBlob = new Blob([txtData], { type: "text/plain" });
    const txtUrl = URL.createObjectURL(txtBlob);
    const txtLink = document.createElement("a");
    txtLink.href = txtUrl;
    txtLink.download = `conner-chat-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    txtLink.click();

    URL.revokeObjectURL(jsonUrl);
    URL.revokeObjectURL(txtUrl);
  };

  const handleApiKeySubmit = async (e) => {
    e.preventDefault();
    if (apiKey.trim()) {
      try {
        // Initialize Conner with the API key
        const { initializeConner } = await import("../utils/conner.js");
        if (initializeConner(apiKey.trim())) {
          setShowApiKeyModal(false);
          setApiKey("");
        } else {
          toast.error("Invalid API key. Please check and try again.");
        }
      } catch (error) {
        console.error("Error initializing Conner:", error);
        toast.error("Error initializing Conner. Please try again.");
      }
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Conner
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your mental health companion
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportChat}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Export Chat"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={handleClearChat}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Clear Chat"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onSettings}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={`${message.timestamp}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                  message.role === "user"
                    ? "flex-row-reverse space-x-reverse"
                    : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === "user" ? "bg-blue-500" : ""
                  }`}
                >
                  {message.role === "user" ? (
                    <img src="/user.svg" alt="User" className="w-8 h-8" />
                  ) : (
                    <img src="/conner.svg" alt="Conner" className="w-8 h-8" />
                  )}
                </div>

                <div
                  className={`px-4 py-2 rounded-2xl shadow-sm ${
                    message.role === "user"
                      ? "bg-primary-500 text-white"
                      : message.isError
                      ? "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800"
                      : "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      message.role === "user"
                        ? "text-primary-100"
                        : message.isError
                        ? "text-red-600 dark:text-red-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4"
      >
        <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share your thoughts with Conner..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              rows="1"
              style={{ minHeight: "48px", maxHeight: "120px" }}
            />
          </div>
          <motion.button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-3 rounded-lg hover:from-primary-600 hover:to-secondary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </form>
      </motion.div>

      {/* API Key Modal */}
      {/* {showApiKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Conner API Key Required
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              To use Conner, you need to provide your Conner API key. Get one
              from{" "}
              <a
                href="https://makersuite.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 hover:text-primary-600 underline"
              >
                Google AI Studio
              </a>
            </p>
            <form onSubmit={handleApiKeySubmit}>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Conner API key"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4"
                required
              />
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Continue
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )} */}
    </div>
  );
};

export default Chat;
