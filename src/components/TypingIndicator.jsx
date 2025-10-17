import React from "react";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";

const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="flex items-start space-x-2">
        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>

        <div className="bg-white dark:bg-gray-700 px-4 py-2 rounded-2xl shadow-sm">
          <div className="flex items-center space-x-1">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Conner is thinking
            </span>
            <div className="flex space-x-1">
              <motion.div
                className="w-2 h-2 bg-gray-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
              />
              <motion.div
                className="w-2 h-2 bg-gray-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-2 h-2 bg-gray-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;
