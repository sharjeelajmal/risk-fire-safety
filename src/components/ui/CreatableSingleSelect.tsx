'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, X } from 'lucide-react';

interface CreatableSingleSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  label?: string;
  icon?: React.ReactNode;
}

export default function CreatableSingleSelect({
  value,
  onChange,
  options,
  placeholder = 'Wählen oder tippen...',
  label,
  icon
}: CreatableSingleSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (val: string) => {
    onChange(val);
    setSearch('');
    setIsOpen(false);
  };

  return (
    <div className="space-y-2 md:space-y-3 relative active-z-override" ref={containerRef}>
      {label && (
        <label className="text-[9px] md:text-[10px] uppercase font-black tracking-[2px] text-gray-500 ml-2">
          {label}
        </label>
      )}
      
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors z-10">
            {icon}
          </div>
        )}
        <input
          type="text"
          value={isOpen ? search : value}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
            onChange(e.target.value);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-3.5 md:py-5 ${icon ? 'pl-12 md:pl-14' : 'px-5 md:px-6'} pr-12 focus:border-red-500/50 focus:bg-white/[0.08] outline-none transition-all font-bold text-sm md:text-lg`}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
        >
          <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (filteredOptions.length > 0 || search) && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 mt-2 glass-premium rounded-2xl border border-white/10 shadow-2xl z-[100] max-h-60 overflow-y-auto overflow-x-hidden custom-scrollbar"
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelect(opt)}
                    className="w-full text-left px-5 py-3.5 hover:bg-white/10 transition-colors font-bold text-sm md:text-base border-b border-white/5 last:border-0"
                  >
                    {opt}
                  </button>
                ))
              ) : search ? (
                <div className="px-5 py-3.5 text-gray-500 text-sm font-bold italic">
                  "{search}" als neuen Wert verwenden
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
