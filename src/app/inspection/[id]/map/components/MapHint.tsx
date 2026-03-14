'use client';

import { motion } from 'framer-motion';
import { LayoutDashboard } from 'lucide-react';

export default function MapHint() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-44 lg:bottom-40 left-1/2 -translate-x-1/2 z-[100] bg-black/40 backdrop-blur-3xl px-6 lg:px-8 py-3 lg:py-4 rounded-3xl border border-white/10 flex items-center justify-center gap-3 lg:gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-none w-[85%] lg:w-auto overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-transparent opacity-50"></div>
      <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-red-600 flex items-center justify-center text-white animate-bounce">
          <LayoutDashboard size={14} />
      </div>
      <p className="text-[10px] lg:text-xs font-black uppercase tracking-[1px] lg:tracking-[2px] text-white">Tippen Sie auf die Karte, um ein Problem hinzuzufügen</p>
    </motion.div>
  );
}
