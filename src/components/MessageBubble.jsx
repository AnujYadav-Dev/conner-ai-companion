import React from "react";
import { motion } from "framer-motion";
import { Bot, Copy } from "lucide-react";
import toast from "../utils/toast.js";

const MessageBubble = ({ message, isTyping = false }) => {
  const isUser = message.role === "user";
  const isError = message.isError;

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isTyping) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-start mb-4"
      >
        <div className="flex items-start space-x-4 max-w-3xl">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
            <img src="/conner.svg" alt="Conner" className="w-8 h-8" />
          </div>
          <div className="message-bubble message-assistant">
            <div className="typing-indicator">
              <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
                Conner is typing
              </span>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex mb-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex items-start space-x-4 max-w-3xl ${
          isUser ? "flex-row-reverse space-x-reverse" : ""
        }`}
      >
        {/* Avatar */}
        <div
          className={`
          w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm
          ${isUser ? "bg-blue-500" : isError ? "bg-red-500" : ""}
        `}
        >
          {isUser ? (
            <img src="/user.svg" alt="User" className="w-8 h-8" />
          ) : (
            <img src="/conner.svg" alt="Conner" className="w-8 h-8" />
          )}
        </div>

        {/* Message content */}
        <div
          className={`
          message-bubble
          ${
            isUser
              ? "message-user"
              : isError
              ? "message-error"
              : "message-assistant"
          }
          ${
            isError
              ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
              : ""
          }
        `}
        >
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="whitespace-pre-wrap m-0 leading-relaxed">
              {message.content}
            </p>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div
              className={`
              text-xs opacity-70
              ${isUser ? "text-gray-500 dark:text-gray-400" : ""}
              ${isError ? "text-red-600 dark:text-red-400" : ""}
            `}
            >
              {formatTime(message.timestamp)}
            </div>
            {message.content && (
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(message.content);
                    toast.success("Copied!");
                  } catch (e) {
                    toast.error("Failed to copy");
                  }
                }}
                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Copy message"
              >
                <Copy className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
