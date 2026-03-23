'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, FileCheck } from 'lucide-react';
import Link from 'next/link';

interface MapFooterProps {
  inspectionId: string;
}
export default function MapFooter({ inspectionId }: MapFooterProps) {
  return (
    <footer className="fixed bottom-20 md:bottom-12 left-0 right-0 flex justify-center px-3 md:px-0 z-50 pointer-events-none">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md h-12 md:h-16 bg-[#0a0a0a] rounded-full border border-white/10 p-1 md:p-2 flex items-center justify-between shadow-[0_20px_60px_rgba(0,0,0,0.8)] pointer-events-auto gap-1 md:gap-2"
      >
        <Link href="/dashboard" className="flex-1 h-full">
          <motion.button 
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
            whileTap={{ scale: 0.95 }}
            className="w-full h-full flex items-center justify-center gap-1.5 md:gap-2 text-white/60 hover:text-white rounded-full font-bold uppercase tracking-widest text-[8px] md:text-xs transition-all cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span>Dashboard</span>
          </motion.button>
        </Link>

        {/* Separator */}
        <div className="w-px h-5 md:h-6 bg-white/10"></div>

        <Link href={`/inspection/${inspectionId}/review`} className="flex-[1.4] h-full">
          <motion.button 
            whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(239, 68, 68, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            className="w-full h-full flex items-center justify-center gap-1.5 md:gap-2 bg-linear-to-r from-red-600 to-red-800 text-white rounded-full font-black uppercase tracking-widest text-[8px] md:text-xs transition-all cursor-pointer shadow-lg border border-red-500/30"
          >
            <span>Überprüfen</span>
            <FileCheck className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </motion.button>
        </Link>
      </motion.div>
    </footer>
  );
}
