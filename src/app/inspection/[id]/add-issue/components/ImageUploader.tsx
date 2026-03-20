'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, FileText, Upload } from 'lucide-react';

interface ImageUploaderProps {
  previews: string[];
  onAddImages: (files: File[]) => void;
  onRemoveImage: (index: number) => void;
  isPdf?: (index: number) => boolean;
}

export default function ImageUploader({
  previews,
  onAddImages,
  onRemoveImage,
  isPdf,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const files = Array.from(fileList);
    if (files.length > 0) onAddImages(files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    // Reset so same file can be re-selected
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-3 md:space-y-4">
      <label className="block text-[10px] md:text-xs font-black uppercase tracking-widest text-zinc-400">
        Fotos & Dokumente (Dokumentation)
      </label>

      {/* Drag & Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`w-full py-6 md:py-8 rounded-xl md:rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
          isDragging
            ? 'border-red-500 bg-red-500/10 scale-[1.01]'
            : 'border-white/10 hover:border-red-500/40 hover:bg-red-500/5'
        }`}
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isDragging ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-zinc-500'}`}>
          <Upload className="w-5 h-5" />
        </div>
        <div className="text-center">
          <p className={`text-xs font-black uppercase tracking-widest transition-colors ${isDragging ? 'text-red-400' : 'text-zinc-500'}`}>
            {isDragging ? 'Hier ablegen...' : 'Klicken oder Drag & Drop'}
          </p>
          <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-1">
            JPG, PNG, PDF
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,application/pdf"
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <AnimatePresence mode="popLayout">
            {previews.map((preview, i) => {
              const fileIsPdf = isPdf ? isPdf(i) : preview === 'pdf';
              return (
                <motion.div
                  key={preview + i}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  layout
                  className="aspect-square relative rounded-xl md:rounded-2xl overflow-hidden border border-white/10 group shadow-2xl bg-zinc-900"
                >
                  {fileIsPdf ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-red-400">
                      <FileText className="w-8 h-8 md:w-10 md:h-10" />
                      <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest opacity-60">PDF</span>
                    </div>
                  ) : (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => onRemoveImage(i)}
                    className="absolute top-1.5 md:top-2 right-1.5 md:right-2 bg-black/60 backdrop-blur-md p-1 md:p-1.5 rounded-lg md:rounded-full text-white hover:bg-red-600 transition-colors pointer-events-auto"
                  >
                    <X className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
