'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  loading?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  loading = false,
}: DeleteConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-[380px] bg-[#0a0a0a] border border-white/10 rounded-[32px] p-8 shadow-[0_0_80px_rgba(220,38,38,0.2)] overflow-hidden m-auto"
          >
            {/* Background Decor */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-red-600/10 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-6 shadow-2xl shadow-red-500/10">
                <AlertTriangle size={32} />
              </div>

              {/* Text */}
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3">{title}</h3>
              <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-8 px-2">{message}</p>

              {/* Actions */}
              <div className="flex flex-col gap-4 w-full">
                <button
                  type="button"
                  disabled={loading}
                  onClick={onConfirm}
                  className="w-full py-5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-[2px] text-xs transition-all flex items-center justify-center gap-3 cursor-pointer shadow-xl shadow-red-600/20 disabled:opacity-50 active:scale-[0.98]"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Löschen bestätigen</span>
                      <Trash2 size={16} />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={onClose}
                  className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white font-black uppercase tracking-[2px] text-xs transition-all cursor-pointer active:scale-[0.98]"
                >
                  Abbrechen
                </button>
              </div>
            </div>

            {/* Close Cross */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="absolute top-8 right-8 p-3 text-zinc-600 hover:text-white hover:bg-white/5 rounded-2xl transition-all cursor-pointer z-50 group"
            >
              <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
