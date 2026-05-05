import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";

export default function DeleteConfirmationModal({ isOpen, onConfirm, onCancel, isDeleting = false }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-96 rounded-lg bg-slate-950 border border-white/20 shadow-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">Delete Comment?</h3>
            </div>

            <p className="text-sm text-slate-300 mb-6">
              This action cannot be undone. The comment will be permanently deleted.
            </p>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onCancel}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 text-sm font-medium text-slate-300 hover:bg-white/10 disabled:opacity-50"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-500 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
              >
                <motion.div
                  animate={isDeleting ? { rotate: 360 } : {}}
                  transition={{ duration: 1, repeat: isDeleting ? Infinity : 0 }}
                >
                  <Trash2 size={16} />
                </motion.div>
                {isDeleting ? "Deleting..." : "Delete"}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
