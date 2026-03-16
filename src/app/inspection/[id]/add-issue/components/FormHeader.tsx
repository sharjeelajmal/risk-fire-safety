'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FormHeaderProps {
  x: string | null;
  y: string | null;
}

export default function FormHeader({ x, y }: FormHeaderProps) {
  const router = useRouter();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 md:mb-8"
    >
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-1.5 md:gap-2 text-zinc-400 hover:text-white transition-colors mb-3 md:mb-4 group cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] md:text-sm font-black uppercase tracking-widest">Zurück zur Karte</span>
      </button>
      
      <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight flex items-center gap-2 md:gap-3">
         Problem <span className="text-red-500">Meldung</span>
      </h1>
      <p className="text-zinc-500 mt-1 md:mt-2 flex items-center gap-1.5 md:gap-2 text-[10px] md:text-sm italic font-medium">
        <AlertCircle size={12} className="md:w-3.5 md:h-3.5" /> COORDINATES: {x}%, {y}%
      </p>
    </motion.div>
  );
}
