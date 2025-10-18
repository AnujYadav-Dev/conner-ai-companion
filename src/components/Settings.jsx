import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  Moon,
  Sun,
  Download,
  Trash2,
  Palette,
  Brain,
  Save,
} from "lucide-react";
import {
  getSessionSettings,
  saveSessionSettings,
  exportChatHistory,
  clearChatHistory,
} from "../utils/storage.js";
import toast from "../utils/toast.js";

const Settings = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    darkMode: false,
    messageLimit: 100,
    contextWindowSize: 10,
    aiPersonality: "supportive",
    typingSpeed: 50,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const currentSettings = getSessionSettings();
      setSettings(currentSettings);
    }
  }, [isOpen]);

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);

    try {
      // Save session settings
      saveSessionSettings(settings);

      // Apply dark mode immediately
      if (settings.darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      // Show success feedback
      setTimeout(() => {
        setIsSaving(false);
        onClose();
      }, 500);
    } catch (error) {
      console.error("Error saving settings:", error);
      setIsSaving(false);
    }
  };

  const handleExportData = () => {
    const jsonData = exportChatHistory("json");
    const txtData = exportChatHistory("txt");

    // Create and download JSON file
    const jsonBlob = new Blob([jsonData], { type: "application/json" });
    const jsonUrl = URL.createObjectURL(jsonBlob);
    const jsonLink = document.createElement("a");
    jsonLink.href = jsonUrl;
    jsonLink.download = `conner-data-${
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

    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 3000);
  };

  const handleClearData = () => {
    clearChatHistory();
    toast.info("All data cleared.");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Settings
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Appearance */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Appearance
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Dark Mode
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Switch between light and dark themes
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleSettingChange("darkMode", !settings.darkMode)
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.darkMode
                      ? "bg-blue-500"
                      : "bg-gray-200 dark:bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.darkMode ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* AI Personality */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              AI Personality
            </h3>

            <div className="space-y-3">
              {[
                {
                  value: "supportive",
                  label: "Supportive",
                  description: "Warm, encouraging, and validating",
                },
                {
                  value: "reflective",
                  label: "Reflective",
                  description: "Thoughtful questions and deep insights",
                },
                {
                  value: "logical",
                  label: "Logical",
                  description: "Structured, analytical approach",
                },
              ].map((personality) => (
                <label
                  key={personality.value}
                  className="flex items-start space-x-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="aiPersonality"
                    value={personality.value}
                    checked={settings.aiPersonality === personality.value}
                    onChange={(e) =>
                      handleSettingChange("aiPersonality", e.target.value)
                    }
                    className="mt-1 text-blue-500 focus:ring-blue-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {personality.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {personality.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Chat Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Chat Settings
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Context Window Size
                </label>
                <select
                  value={settings.contextWindowSize}
                  onChange={(e) =>
                    handleSettingChange(
                      "contextWindowSize",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value={5}>5 messages</option>
                  <option value={10}>10 messages</option>
                  <option value={15}>15 messages</option>
                  <option value={20}>20 messages</option>
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Number of previous messages to include for context
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message Limit
                </label>
                <input
                  type="number"
                  value={settings.messageLimit}
                  onChange={(e) =>
                    handleSettingChange(
                      "messageLimit",
                      parseInt(e.target.value)
                    )
                  }
                  min="10"
                  max="1000"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Maximum number of messages to keep in history
                </p>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Data Management
            </h3>

            <div className="space-y-3">
              <button
                onClick={handleExportData}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Chat History</span>
              </button>

              <button
                onClick={handleClearData}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All Data</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {showExportSuccess && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-green-600 dark:text-green-400"
              >
                Data exported successfully!
              </motion.div>
            )}
            <div className="flex space-x-3 ml-auto">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <motion.button
                onClick={handleSaveSettings}
                disabled={isSaving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Settings</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
