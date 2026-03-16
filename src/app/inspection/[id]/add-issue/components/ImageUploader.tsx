'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';

interface ImageUploaderProps {
  previews: string[];
  onAddImages: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
}

export default function ImageUploader({
  previews,
  onAddImages,
  onRemoveImage
}: ImageUploaderProps) {
  return (
    <div className="space-y-3 md:space-y-4">
      <label className="block text-[10px] md:text-xs font-black uppercase tracking-widest text-zinc-400">
        Fotos (Dokumentation)
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        <AnimatePresence mode="popLayout">
          {previews.map((preview, i) => (
            <motion.div 
              key={preview}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              layout
              className="aspect-square relative rounded-xl md:rounded-2xl overflow-hidden border border-white/10 group shadow-2xl"
            >
              <img src={preview} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <button 
                type="button"
                onClick={() => onRemoveImage(i)}
                className="absolute top-1.5 md:top-2 right-1.5 md:right-2 bg-black/60 backdrop-blur-md p-1 md:p-1.5 rounded-lg md:rounded-full text-white hover:bg-red-600 transition-colors pointer-events-auto"
              >
                <X className="w-3 h-3 md:w-3.5 md:h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        <motion.label 
          whileHover={{ scale: 0.98, borderColor: 'rgba(239, 68, 68, 0.4)' }}
          whileTap={{ scale: 0.95 }}
          className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl md:rounded-2xl cursor-pointer hover:bg-red-500/5 transition-all text-zinc-500 hover:text-red-500 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="bg-zinc-900/50 p-2 md:p-3 rounded-full mb-1.5 md:mb-2 border border-white/5">
            <Plus className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-center px-1 md:px-2">Hinzufügen</span>
          <input type="file" multiple accept="image/*" onChange={onAddImages} className="hidden" />
        </motion.label>
      </div>
    </div>
  );
}
