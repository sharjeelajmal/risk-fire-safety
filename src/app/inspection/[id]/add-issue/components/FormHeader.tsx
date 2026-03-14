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
      className="mb-8"
    >
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4 group cursor-pointer"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium uppercase tracking-wider">Zurück zur Karte</span>
      </button>
      
      <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight flex items-center gap-3">
         Problem <span className="text-red-500">Meldung</span>
      </h1>
      <p className="text-zinc-500 mt-2 flex items-center gap-2 text-sm italic">
        <AlertCircle size={14} /> COORDINATES: {x}%, {y}%
      </p>
    </motion.div>
  );
}
