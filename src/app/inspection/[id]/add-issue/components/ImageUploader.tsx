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
    <div className="space-y-4">
      <label className="block text-xs font-black uppercase tracking-widest text-zinc-400">
        Fotos (Mangeldokumentation)
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {previews.map((preview, i) => (
            <motion.div 
              key={preview}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              layout
              className="aspect-square relative rounded-2xl overflow-hidden border border-white/10 group shadow-2xl"
            >
              <img src={preview} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <button 
                type="button"
                onClick={() => onRemoveImage(i)}
                className="absolute top-2 right-2 bg-black/60 backdrop-blur-md p-1.5 rounded-full text-white hover:bg-red-600 transition-colors pointer-events-auto"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        <motion.label 
          whileHover={{ scale: 0.98, borderColor: 'rgba(239, 68, 68, 0.4)' }}
          whileTap={{ scale: 0.95 }}
          className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:bg-red-500/5 transition-all text-zinc-500 hover:text-red-500 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="bg-zinc-900/50 p-3 rounded-full mb-2 border border-white/5">
            <Plus size={24} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-center px-2">Foto Hinzufügen</span>
          <input type="file" multiple accept="image/*" onChange={onAddImages} className="hidden" />
        </motion.label>
      </div>
    </div>
  );
}
