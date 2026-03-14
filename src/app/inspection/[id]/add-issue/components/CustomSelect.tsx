'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export default function CustomSelect({
  label,
  options,
  value,
  onChange,
  placeholder = 'Wählen...',
  required = false
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="space-y-2 relative">
      <label className="block text-xs font-black uppercase tracking-widest text-zinc-400">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#0a0a0a] border ${isOpen ? 'border-red-500/50' : 'border-white/10'} rounded-2xl px-5 py-4 flex items-center justify-between cursor-pointer transition-all shadow-xl group hover:border-white/20`}
      >
        <span className={`${!selectedOption ? 'text-zinc-600' : 'text-white'} text-sm truncate uppercase font-bold tracking-wide`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-zinc-500 group-hover:text-white transition-colors"
        >
          <ChevronDown size={18} />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute left-0 right-0 top-full mt-2 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 overflow-hidden max-h-60 overflow-y-auto backdrop-blur-3xl"
            >
              <div className="p-2 space-y-1">
                {options.map((option) => {
                  const isSelected = option.value === value;
                  return (
                    <motion.div
                      key={option.value}
                      whileHover={{ x: 4, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                      }}
                      className={`px-4 py-3 rounded-xl cursor-pointer flex items-center justify-between group/opt ${
                        isSelected ? 'bg-red-500/10 text-red-500' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span className="text-sm font-bold uppercase tracking-wider transition-colors">
                        {option.label}
                      </span>
                      {isSelected && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <Check size={16} />
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
