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
    <header className="fixed top-0 left-0 md:left-24 right-0 h-16 md:h-24 bg-[#050505] border-b border-white/10 shadow-lg z-50 px-4 md:px-12 flex items-center">
      <div className="flex-1 flex items-center justify-start">
        <Link href="/dashboard">
          <motion.div 
            whileHover={{ x: -4 }}
            className="flex items-center gap-1.5 md:gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer group"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:text-red-500" />
            <span className="font-bold text-[10px] md:text-sm uppercase tracking-widest hidden md:inline">Zurück</span>
          </motion.div>
        </Link>
      </div>

      <div className="text-center">
          <h1 className="text-base md:text-xl font-black uppercase tracking-[2px] md:tracking-[4px] text-white leading-none mb-1">{title}</h1>
          <p className="text-[8px] md:text-[10px] text-gray-500 font-black uppercase tracking-[1px] md:tracking-[2px]">Karte</p>
      </div>

      <div className="flex-1 flex justify-end">
        <div className="w-10 h-10 lg:hidden"></div> {/* Mobile Spacer */}
      </div>
    </header>
  );
}
