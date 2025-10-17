import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Plus,
  Settings,
  HelpCircle,
  Menu,
  X,
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { Save, PenSquare, Trash2, Check } from "lucide-react";
import {
  saveConversationSession,
  deleteConversationSession,
  getConversationSessions,
} from "../utils/storage.js";
import toast from "../utils/toast.js";

const Sidebar = () => {
  const {
    sidebarOpen,
    dispatch,
    actions,
    user,
    sessionList,
    currentSessionId,
    chatHistory,
  } = useApp();

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  const handleNewChat = () => {
    dispatch({ type: actions.NEW_CHAT });
    setShowMobileMenu(false);
  };
  const refreshSessions = () => {
    const sessions = getConversationSessions();
    dispatch({ type: actions.SET_SESSION_LIST, payload: sessions });
  };
  const handleDeleteSession = (id) => {
    deleteConversationSession(id);
    toast.info("Conversation deleted.");
    refreshSessions();
  };
  const handleStartRename = (s) => {
    setRenamingId(s.id);
    setRenameValue(s.title || "Conversation");
  };
  const handleConfirmRename = (id) => {
    const trimmed = renameValue.trim();
    if (!trimmed) {
      setRenamingId(null);
      return;
    }
    saveConversationSession({ id, title: trimmed });
    setRenamingId(null);
    toast.success("Conversation renamed.");
    refreshSessions();
  };
  const openHelp = () => {
    dispatch({ type: actions.SET_HELP_OPEN, payload: true });
    setShowMobileMenu(false);
  };
  const toggleSidebar = () => {
    dispatch({ type: actions.SET_SIDEBAR_OPEN, payload: !sidebarOpen });
  };
  const openSettings = () => {
    dispatch({ type: actions.SET_SETTINGS_OPEN, payload: true });
    setShowMobileMenu(false);
  };
  const handleSessionClick = (s) => {
    if (currentSessionId !== s.id) {
      dispatch({
        type: actions.SET_CURRENT_SESSION,
        payload: { sessionId: s.id, messages: s.messages },
      });
    }
    setShowMobileMenu(false);
  };
  // Sessions sorted by updatedAt desc
  const sessions = [...(sessionList || [])].sort(
    (a, b) => new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf()
  );

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setShowMobileMenu(false)}
          />
        )}
      </AnimatePresence>
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: sidebarOpen || showMobileMenu ? 0 : -320,
          width: sidebarOpen || showMobileMenu ? 320 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`
          fixed lg:relative top-0 left-0 h-full z-50 lg:z-auto
          sidebar overflow-hidden
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10  rounded-xl flex items-center justify-center shadow-sm">
                <img src="/conner.svg" alt="Conner" className="w-8 h-8" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Conner
              </h1>
            </div>
            <button
              onClick={() => {
                setShowMobileMenu(false);
                dispatch({ type: actions.SET_SIDEBAR_OPEN, payload: false });
              }}
              className="lg:hidden p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* New Chat Button */}
          <div className="px-6 py-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNewChat}
              className="w-full btn-primary bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center space-x-3 py-3"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">New Chat</span>
            </motion.button>
          </div>
          {/* Saved Sessions List */}
          <div className="flex-1 overflow-y-auto px-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
              Conversations
            </h3>
            <div className="space-y-2">
              <AnimatePresence>
                {sessions.length > 0 ? (
                  sessions.map((s, idx) => (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: idx * 0.03 }}
                      className={`chat-item flex items-center space-x-3 px-3 py-3 rounded-xl select-none ${
                        currentSessionId === s.id
                          ? "active border border-primary-500 dark:border-primary-500 bg-primary-50/60 dark:bg-primary-950/30"
                          : ""
                      }`}
                      onClick={(e) => {
                        const el = e.target;
                        if (
                          el &&
                          typeof el.closest === "function" &&
                          el.closest("[data-action]")
                        )
                          return;
                        handleSessionClick(s);
                      }}
                    >
                      <MessageCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        {renamingId === s.id ? (
                          <input
                            autoFocus
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleConfirmRename(s.id);
                              if (e.key === "Escape") setRenamingId(null);
                            }}
                            className="w-full text-sm px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        ) : (
                          <p className="text-sm text-gray-900 dark:text-gray-100 truncate font-medium">
                            {s.title || "Conversation"}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {s.updatedAt
                            ? new Date(s.updatedAt).toLocaleString()
                            : ""}
                        </p>
                      </div>
                      <div
                        className="flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {renamingId === s.id ? (
                          <>
                            <button
                              data-action
                              onClick={() => handleConfirmRename(s.id)}
                              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              data-action
                              onClick={() => setRenamingId(null)}
                              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              data-action
                              onClick={() => handleStartRename(s)}
                              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                              title="Rename"
                            >
                              <PenSquare className="w-4 h-4" />
                            </button>
                            <button
                              data-action
                              onClick={() => handleDeleteSession(s.id)}
                              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="w-4 h-4 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No saved conversations
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
            <button
              onClick={openSettings}
              className="w-full btn-secondary flex items-center justify-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
            <button
              onClick={openHelp}
              className="w-full btn-secondary flex items-center justify-center space-x-2"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Help</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Sidebar toggle moved to Header */}
    </>
  );
};

export default Sidebar;
