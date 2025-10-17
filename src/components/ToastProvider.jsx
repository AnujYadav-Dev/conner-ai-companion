import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, AlertTriangle, X } from "lucide-react";
import toastBus from "../utils/toast.js";

const typeStyles = {
  success: {
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-200 dark:border-green-800",
    text: "text-green-700 dark:text-green-200",
    icon: (
      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-300" />
    ),
  },
  error: {
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    text: "text-red-700 dark:text-red-200",
    icon: <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-300" />,
  },
  info: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-700 dark:text-blue-200",
    icon: <Info className="w-5 h-5 text-blue-600 dark:text-blue-300" />,
  },
};

const ToastProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    return toastBus.subscribe((evt) => {
      if (evt.action === "add") {
        const item = {
          id: evt.id,
          type: evt.type,
          message: evt.message,
        };
        setItems((prev) => [...prev, item]);
        if (evt.duration > 0) {
          setTimeout(() => toastBus.dismiss(evt.id), evt.duration);
        }
      } else if (evt.action === "remove") {
        setItems((prev) => prev.filter((t) => t.id !== evt.id));
      }
    });
  }, []);

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4 z-[1000] space-y-2 w-[90vw] max-w-sm">
        <AnimatePresence>
          {items.map((t) => {
            const s = typeStyles[t.type] || typeStyles.info;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                className={`flex items-start gap-3 p-3 rounded-xl border shadow-sm ${s.bg} ${s.border}`}
              >
                <div className="mt-0.5">{s.icon}</div>
                <div className={`text-sm ${s.text} flex-1`}>{t.message}</div>
                <button
                  className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10"
                  onClick={() => toastBus.dismiss(t.id)}
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ToastProvider;
