'use client';

import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { theme } from '@/lib/theme';

interface MapHeaderProps {
  title: string;
}

export default function MapHeader({ title }: MapHeaderProps) {
  return (
    <header className="fixed top-0 left-0 lg:left-24 right-0 h-20 lg:h-24 glass-premium border-b border-white/5 z-50 px-6 md:px-12 flex items-center">
      <div className="flex-1 flex items-center justify-start">
        <Link href="/dashboard">
          <motion.div 
            whileHover={{ x: -4 }}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer group"
          >
            <ChevronLeft size={24} className="group-hover:text-red-500" />
            <span className="font-bold text-sm uppercase tracking-widest hidden md:inline">Zurück</span>
          </motion.div>
        </Link>
      </div>

      <div className="text-center">
          <h1 className="text-xl font-black uppercase tracking-[4px] text-white leading-none mb-1">{title}</h1>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-[2px]">Interaktive Karte</p>
      </div>

      <div className="flex-1 flex justify-end">
        <div className="w-10 h-10 lg:hidden"></div> {/* Mobile Spacer */}
      </div>
    </header>
  );
}
