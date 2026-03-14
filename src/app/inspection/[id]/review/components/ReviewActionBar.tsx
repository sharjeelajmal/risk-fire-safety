'use client';

import { ChevronLeft, FileDown, Printer } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ReviewActionBarProps {
  onGeneratePDF: () => void;
  isGenerating: boolean;
}

export default function ReviewActionBar({ onGeneratePDF, isGenerating }: ReviewActionBarProps) {
  const router = useRouter();

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 pointer-events-none">
      <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors px-4 py-2 group cursor-pointer"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Zurück</span>
        </button>

        <button 
          onClick={onGeneratePDF}
          disabled={isGenerating}
          className={`flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-800 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-[2px] shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer ${
            isGenerating ? 'opacity-50 cursor-wait' : ''
          }`}
        >
          {isGenerating ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <span className="text-xs">PDF Generieren</span>
              <FileDown size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
