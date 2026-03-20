'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, Plus } from 'lucide-react';

interface CreatableMultiSelectProps {
  values: string[];
  onChange: (values: string[]) => void;
  options: string[];
  placeholder?: string;
  label?: string;
  icon?: React.ReactNode;
  listType?: 'auftraggeber' | 'participants' | 'functions' | 'notes';
  error?: boolean;
  errorText?: string;
}

export default function CreatableMultiSelect({
  values,
  onChange,
  options: defaultOptions,
  placeholder = 'Wählen oder tippen...',
  label,
  icon,
  listType,
  error,
  errorText = 'Dieses Feld wird benötigt'
}: CreatableMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dbOptions, setDbOptions] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load from DB
  useEffect(() => {
    if (listType) {
      const fetchLists = async () => {
        try {
          const res = await fetch('/api/users/me/lists');
          if (res.ok) {
            const data = await res.json();
            if (data[listType]) setDbOptions(data[listType]);
          }
        } catch (e) {
          console.error('Error loading DB options', e);
        }
      };
      fetchLists();
    }
  }, [listType]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allOptions = Array.from(new Set([...defaultOptions, ...dbOptions]));
  const filteredOptions = allOptions.filter(opt =>
    opt.toLowerCase().includes(search.toLowerCase()) && !values.includes(opt)
  );

  const handleSelect = async (val: string) => {
    if (!values.includes(val)) {
      onChange([...values, val]);

      if (listType && !defaultOptions.includes(val) && !dbOptions.includes(val)) {
        try {
          const res = await fetch('/api/users/me/lists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: listType, item: val })
          });
          if (res.ok) {
            const updatedLists = await res.json();
            setDbOptions(updatedLists[listType]);
          }
        } catch (e) {
          console.error('Error saving to DB', e);
        }
      }
    }
    setSearch('');
  };

  const handleRemove = (val: string) => {
    onChange(values.filter(v => v !== val));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && search.trim()) {
      e.preventDefault();
      handleSelect(search.trim());
    }
  };

  return (
    <div className="space-y-2 md:space-y-3 relative" ref={containerRef}>
      {label && (
        <label className={`text-[9px] md:text-[10px] uppercase font-black tracking-[2px] ml-2 transition-colors ${error ? 'text-red-500' : 'text-gray-500'}`}>
          {label}
        </label>
      )}

      <div className="space-y-3">
        {/* Selected Pills */}
        {values.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {values.map((val) => (
                <motion.div
                  key={val}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="bg-red-600/10 border border-red-500/30 rounded-full px-3 py-1.5 flex items-center gap-2"
                >
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-red-500">{val}</span>
                  <button
                    type="button"
                    onClick={() => handleRemove(val)}
                    className="text-red-500/50 hover:text-red-500 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <div className="relative group">
          {icon && (
            <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors z-10 ${error ? 'text-red-500' : 'text-gray-500 group-focus-within:text-red-500'}`}>
              {icon}
            </div>
          )}
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`w-full bg-white/5 border rounded-xl md:rounded-2xl py-3.5 md:py-5 ${icon ? 'pl-12 md:pl-14' : 'px-5 md:px-6'} pr-12 outline-none transition-all font-bold text-sm md:text-lg ${
              error
                ? 'border-red-500 ring-2 ring-red-500/20 bg-red-500/5'
                : 'border-white/10 focus:border-red-500/50 focus:bg-white/[0.08]'
            }`}
          />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
          >
            <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.ul
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute left-0 right-0 top-[calc(100%+8px)] z-[999999] max-h-[240px] overflow-y-auto bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl custom-scrollbar py-2 pb-4 pointer-events-auto flex flex-col"
              >
                {filteredOptions.length > 0 && filteredOptions.map((opt, i) => (
                  <motion.li
                    key={i}
                    onMouseDown={(e) => { e.preventDefault(); handleSelect(opt); }}
                    className="w-full text-left px-5 py-3.5 hover:bg-white/10 transition-colors font-bold text-sm border-b border-white/5 last:border-0 flex items-center justify-between group cursor-pointer shrink-0 text-white"
                  >
                    {opt}
                    <Plus size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500" />
                  </motion.li>
                ))}

                {search && !allOptions.find(o => o.toLowerCase() === search.toLowerCase()) && (
                  <motion.li
                    onMouseDown={(e) => { e.preventDefault(); handleSelect(search.trim()); }}
                    className="w-full text-left px-5 py-3.5 hover:bg-white/10 transition-colors font-bold text-sm text-red-500 italic border-t border-white/5 cursor-pointer shrink-0"
                  >
                    &ldquo;{search}&rdquo; neu hinzufügen...
                  </motion.li>
                )}

                {filteredOptions.length === 0 && !search && (
                  <li className="px-5 py-3.5 text-gray-500 text-sm font-bold italic shrink-0">
                    Keine weiteren Optionen
                  </li>
                )}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-[10px] md:text-xs font-bold ml-2 animate-pulse">
          {errorText}
        </p>
      )}
    </div>
  );
}
