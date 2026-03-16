'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function ActionHero() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-12 gap-6 relative z-10">
      <div>
        <h1 className="text-3xl md:text-5xl font-black text-white leading-none tracking-tighter mb-2 md:mb-3 uppercase">
          Dashboard
        </h1>
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
            <p className="text-gray-500 text-[10px] md:text-xs font-black uppercase tracking-[2px] md:tracking-[3px]">Systemstatus: Betriebsbereit</p>
        </div>
      </div>
      
      <Link href="/inspection/new">
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255, 36, 0, 0.4)' }}
          whileTap={{ scale: 0.95 }}
          className="btn-premium px-6 py-4 md:px-10 md:py-5 rounded-2xl md:rounded-[2rem] flex items-center gap-3 text-sm md:text-lg cursor-pointer group w-full md:w-auto justify-center"
        >
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-90 transition-transform">
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <span>Neue Inspektion Starten</span>
        </motion.button>
      </Link>
    </div>
  );
}
