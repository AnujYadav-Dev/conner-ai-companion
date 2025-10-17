import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Heart,
  MessageCircle,
  Shield,
  Brain,
  Settings,
  Download,
  Trash2,
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

const HelpModal = () => {
  const { helpOpen, dispatch, actions } = useApp();

  if (!helpOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={() =>
          dispatch({ type: actions.SET_HELP_OPEN, payload: false })
        }
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10  rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Welcome to Conner
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Your AI mental health companion
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  dispatch({ type: actions.SET_HELP_OPEN, payload: false })
                }
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            {/* What is Conner */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-primary-500" />
                What is Conner?
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Conner is your AI-powered mental health companion designed to
                  provide emotional support, help you process your thoughts, and
                  offer gentle guidance during difficult times. Think of me as a
                  non-judgmental friend who's always here to listen and help you
                  reflect.
                </p>
              </div>
            </div>

            {/* How to Use */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-primary-500" />
                How to Use Conner
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Start a Conversation
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click on the suggestion buttons or type your thoughts
                    directly. There's no wrong way to start - just share what's
                    on your mind.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Be Open and Honest
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    The more you share, the better I can understand and support
                    you. Your conversations are private and secure.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Take Your Time
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    There's no rush. Take breaks when you need them, and come
                    back whenever you're ready to continue.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Ask Questions
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Feel free to ask me anything about your thoughts, feelings,
                    or situations you're dealing with.
                  </p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-primary-500" />
                Features & Tools
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl p-4 border border-primary-200 dark:border-primary-800">
                  <div className="w-4 h-4 bg-blue-500 rounded-lg flex items-center justify-center mb-3">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Smart Conversations
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    AI-powered responses that adapt to your emotional state and
                    provide personalized support.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-accent-50 to-accent-100 dark:from-accent-900/20 dark:to-accent-800/20 rounded-xl p-4 border border-accent-200 dark:border-accent-800">
                  <div className="w-4 h-4 bg-accent-500 rounded-lg flex items-center justify-center mb-3">
                    <Download className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Export & Save
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Download your conversations to keep a record of your mental
                    health journey.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                  <div className="w-4 h-4 bg-gray-500 rounded-lg flex items-center justify-center mb-3">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Privacy First
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    All your data stays on your device. No cloud storage, no
                    external sharing.
                  </p>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-accent-500" />
                Important Notes
              </h3>
              <div className="bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-xl p-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-accent-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>
                        I'm not a replacement for professional help.
                      </strong>{" "}
                      If you're experiencing a mental health crisis, please
                      contact a mental health professional or emergency
                      services.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-accent-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Your privacy is protected.</strong> All
                      conversations are stored locally on your device and never
                      shared.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-accent-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Take breaks when needed.</strong> Mental health is
                      a journey, and it's okay to step away and return later.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Getting Started */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Ready to Get Started?
              </h3>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-4">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Try starting with one of these simple prompts:
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    "I'm feeling anxious about work",
                    "I had a difficult day",
                    "I want to talk about my relationships",
                    "I'm struggling with motivation",
                  ].map((prompt, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-lg p-3 text-sm text-gray-700 dark:text-gray-300 border border-primary-200 dark:border-primary-700"
                    >
                      "{prompt}"
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Remember: You're not alone, and it's okay to not be okay.
              </p>
              <button
                onClick={() =>
                  dispatch({ type: actions.SET_HELP_OPEN, payload: false })
                }
                className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
              >
                Start Chatting
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HelpModal;
