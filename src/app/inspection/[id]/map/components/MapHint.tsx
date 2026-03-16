'use client';

import { motion } from 'framer-motion';
import { LayoutDashboard } from 'lucide-react';

export default function MapHint() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-36 md:bottom-40 left-1/2 -translate-x-1/2 z-[100] bg-black/40 backdrop-blur-3xl px-4 md:px-8 py-2.5 md:py-4 rounded-2xl md:rounded-3xl border border-white/10 flex items-center justify-center gap-2 md:gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-none w-[90%] md:w-auto overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-transparent opacity-50"></div>
      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-red-600 flex items-center justify-center text-white animate-bounce">
          <LayoutDashboard className="w-3.5 h-3.5 md:w-4 md:h-4" />
      </div>
      <p className="text-[9px] md:text-xs font-black uppercase tracking-widest text-white text-center">Tippen, um Mangel hinzuzufügen</p>
    </motion.div>
  );
}
