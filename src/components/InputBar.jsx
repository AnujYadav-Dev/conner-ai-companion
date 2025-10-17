import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, SlidersHorizontal } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { sendToConner } from "../utils/conner-client.js";
import { getContextWindow } from "../utils/storage.js";
import { saveSessionSettings } from "../utils/storage.js";

const INPUT_MODES = [
  { label: "Supportive", value: "supportive" },
  { label: "Reflective", value: "reflective" },
  { label: "Logical", value: "logical" },
];

const InputBar = () => {
  const { dispatch, actions, chatHistory, isLoading, aiMode } = useApp();
  const [message, setMessage] = useState("");
  const [toolsOpen, setToolsOpen] = useState(false);
  const textareaRef = useRef(null);
  const toolsRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // Close tools popover on click outside
  useEffect(() => {
    function handleClick(e) {
      if (toolsRef.current && !toolsRef.current.contains(e.target)) {
        setToolsOpen(false);
      }
    }
    if (toolsOpen) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [toolsOpen]);

  const handleModeChange = (mode) => {
    dispatch({ type: actions.SET_AI_MODE, payload: mode });
    saveSessionSettings({ aiPersonality: mode });
    setToolsOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    const userMessage = message.trim();
    setMessage("");
    const userMsg = {
      role: "user",
      content: userMessage,
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: actions.ADD_MESSAGE, payload: userMsg });
    dispatch({ type: actions.SET_LOADING, payload: true });
    try {
      const contextWindow = getContextWindow(10);
      const response = await sendToConner(userMessage, contextWindow);
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
          "I'm sorry, I'm having trouble connecting right now. Please make sure your API key is correct and try again.",
        timestamp: new Date().toISOString(),
        isError: true,
      };
      dispatch({ type: actions.ADD_MESSAGE, payload: errorMsg });
    } finally {
      dispatch({ type: actions.SET_LOADING, payload: false });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="input-bar sticky bottom-0 p-4 md:p-5 bg-transparent"
    >
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto relative "
        autoComplete="off"
      >
        {/* Main Conner-like input area */}
        <div
          className="relative flex items-center w-full rounded-3xl border border-gray-700/70 dark:border-gray-800 bg-dark-900/80 dark:bg-dark-900 shadow-xl px-4 md:px-8 py-3 focus-within:ring-2 focus-within:ring-primary-500"
          style={{ minHeight: 66 }}
        >
          {/* Tools Button/Dropdown */}
          <div ref={toolsRef} className="relative">
            <button
              type="button"
              aria-label="Open Tools"
              className="flex items-center gap-1 text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg px-1 py-1 mr-2"
              tabIndex={0}
              onClick={() => setToolsOpen((v) => !v)}
            >
              <SlidersHorizontal className="w-5 h-5" />
              {/* <span className="text-sm font-medium hidden sm:block">Tools</span> */}
            </button>
            {/* Dropdown popover for AI Mode selection */}
            <AnimatePresence>
              {toolsOpen && (
                <motion.div
                  key="tools-menu"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 bottom-full z-20 w-52 sm:w-56 bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-3 mb-2 border border-gray-200 dark:border-gray-800"
                >
                  <div className="mb-2 font-semibold text-xs text-gray-400 pl-1">
                    Select Model Type
                  </div>
                  <div className="space-y-1">
                    {INPUT_MODES.map((m) => (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() => handleModeChange(m.value)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-base font-medium transition-all border border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-500 ${
                          aiMode === m.value
                            ? "bg-blue-500 text-white shadow text-lg"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-800"
                        }`}
                        tabIndex={0}
                      >
                        <span>{m.label}</span>
                        {aiMode === m.value && (
                          <span className="ml-auto text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/60 text-primary-800 dark:text-primary-100 font-semibold">
                            Active
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Textarea - styled like Conner */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Conner"
            className="flex-1 bg-transparent outline-none border-none text-base md:text-lg text-white placeholder-gray-400 resize-none min-h-[1.7em] max-h-36 font-normal px-0 py-1"
            rows={1}
            disabled={isLoading}
            tabIndex={0}
            style={{ overflow: "hidden" }}
          />

          {/* Send Button - large right pill */}
          <motion.button
            type="submit"
            disabled={!message.trim() || isLoading}
            // whileHover={{ scale: 1.05 }}
            // whileTap={{ scale: 0.97 }}
            className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 text-white rounded-full w-12 h-12 flex items-center justify-center shadow transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none border-none"
            aria-label="Send"
            tabIndex={0}
          >
            <Send className="w-6 h-6" />
          </motion.button>
        </div>
        {/* Helper text */}
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Coneer can make mistakes, so double-check it
          </p>
        </div>
      </form>
    </motion.div>
  );
};

export default InputBar;
