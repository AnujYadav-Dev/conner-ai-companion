import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  Download,
  Trash2,
  Menu,
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import {
  clearChatHistory,
  exportChatHistory,
  clearCurrentUser,
} from "../utils/storage.js";
import toast from "../utils/toast.js";

const Header = () => {
  const { user, darkMode, dispatch, actions, sidebarOpen } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    dispatch({ type: actions.SET_DARK_MODE, payload: newDarkMode });

    // Apply to document
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Save to localStorage
    const settings = JSON.parse(
      localStorage.getItem("conner_sessionSettings") || "{}"
    );
    localStorage.setItem(
      "conner_sessionSettings",
      JSON.stringify({
        ...settings,
        darkMode: newDarkMode,
      })
    );
  };

  const openSettings = () => {
    dispatch({ type: actions.SET_SETTINGS_OPEN, payload: true });
  };

  const handleLogout = () => {
    // End session only; keep stored account for future logins
    clearCurrentUser();
    dispatch({ type: actions.SET_USER, payload: null });
    setShowProfileMenu(false);
  };

  const handleExportChat = () => {
    const jsonData = exportChatHistory("json");
    const txtData = exportChatHistory("txt");

    // Create and download files
    const jsonBlob = new Blob([jsonData], { type: "application/json" });
    const jsonUrl = URL.createObjectURL(jsonBlob);
    const jsonLink = document.createElement("a");
    jsonLink.href = jsonUrl;
    jsonLink.download = `conner-chat-${
      new Date().toISOString().split("T")[0]
    }.json`;
    jsonLink.click();

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
    setShowProfileMenu(false);
  };

  const handleClearChat = () => {
    // Soft confirm via toast hint and immediate action (no blocking confirm)
    clearChatHistory();
    dispatch({ type: actions.CLEAR_CHAT });
    toast.info("Chat cleared.");
    setShowProfileMenu(false);
  };

  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 right-0 left-0 z-30 bg-white/90 dark:bg-dark-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm"
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Sidebar toggle + App name */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() =>
              dispatch({
                type: actions.SET_SIDEBAR_OPEN,
                payload: !sidebarOpen,
              })
            }
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden md:flex md:items-center md:gap-3">
            <div className="w-8 h-8  rounded-xl flex items-center justify-center shadow-sm">
              <img src="/conner.svg" alt="Conner" className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Conner
            </h1>
          </div>
        </div>

        {/* Center - Welcome message (mobile only) */}
        <div className="lg:hidden">
          {user && (
            <div className="text-center">
              <h1 className="text-lg font-semibold ml-4 text-gray-900 dark:text-white">
                Hello, {user.name.split(" ")[0]}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {/* How are you feeling today? */}
              </p>
            </div>
          )}
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-3">
          {/* Dark mode toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </motion.button>

          {/* Settings button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openSettings}
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </motion.button>

          {/* User avatar with dropdown */}
          {user && (
            <div className="relative" ref={profileMenuRef}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center cursor-pointer shadow-sm"
                title={user.name}
              >
                <span className="text-white font-medium text-sm">
                  {getUserInitials()}
                </span>
              </motion.div>

              {/* Profile dropdown menu */}
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>

                    <button
                      onClick={handleExportChat}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export Chat</span>
                    </button>

                    <button
                      onClick={handleClearChat}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Clear Chat</span>
                    </button>

                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
