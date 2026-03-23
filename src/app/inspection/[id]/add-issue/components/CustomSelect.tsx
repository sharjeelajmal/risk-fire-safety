'use client';

import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width
      });
    }
  };

  useLayoutEffect(() => {
    if (isOpen) {
      updateCoords();
      window.addEventListener('scroll', updateCoords, true);
      window.addEventListener('resize', updateCoords);
    }
    return () => {
      window.removeEventListener('scroll', updateCoords, true);
      window.removeEventListener('resize', updateCoords);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current && !containerRef.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dropdownMenu = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          style={{
            position: 'fixed',
            top: coords.top,
            left: coords.left,
            width: coords.width,
          }}
          className="z-[1000000] bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden max-h-60 overflow-y-auto md:backdrop-blur-3xl"
        >
          <div className="p-1.5 md:p-2 space-y-1">
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
                  className={`px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl cursor-pointer flex items-center justify-between group/opt ${
                    isSelected ? 'bg-red-500/10 text-red-500' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <span className="text-[12px] md:text-sm font-black uppercase tracking-widest transition-colors">
                    {option.label}
                  </span>
                  {isSelected && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Check className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      <label className="block text-xs font-black uppercase tracking-widest text-zinc-400">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div 
        ref={triggerRef}
        onClick={() => {
          if (!isOpen) updateCoords();
          setIsOpen(!isOpen);
        }}
        className={`w-full bg-[#0a0a0a] border ${isOpen ? 'border-red-500/50' : 'border-white/10'} rounded-xl md:rounded-2xl px-4 md:px-5 py-3 md:py-4 flex items-center justify-between cursor-pointer transition-all shadow-xl group hover:border-white/20`}
      >
        <span className={`${!selectedOption ? 'text-zinc-600' : 'text-white'} text-[13px] md:text-sm truncate uppercase font-bold tracking-wide`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-zinc-500 group-hover:text-white transition-colors"
        >
          <ChevronDown className="w-4 h-4 md:w-[18px] md:h-[18px]" />
        </motion.div>
      </div>

      {mounted && createPortal(dropdownMenu, document.body)}
    </div>
  );
}
