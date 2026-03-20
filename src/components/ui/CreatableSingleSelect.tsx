'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';

interface CreatableSingleSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  label?: string;
  icon?: React.ReactNode;
  listType?: 'auftraggeber' | 'participants' | 'functions' | 'notes';
  error?: boolean;
  errorText?: string;
}

export default function CreatableSingleSelect({
  value,
  onChange,
  options: defaultOptions,
  placeholder = 'Wählen oder tippen...',
  label,
  icon,
  listType,
  error,
  errorText = 'Dieses Feld wird benötigt'
}: CreatableSingleSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dbOptions, setDbOptions] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load options from DB
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

  // Close on outside click
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
    opt.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = async (val: string) => {
    onChange(val);

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

    setSearch('');
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearch('');
    setIsOpen(false);
  };

  const handleOpen = () => {
    setSearch(value || '');
    setIsOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setSearch(newVal);
    onChange(newVal);
    if (!isOpen) setIsOpen(true);
  };

  return (
    <div className="space-y-2 md:space-y-3 relative" ref={containerRef}>
      {label && (
        <label className={`text-[9px] md:text-[10px] uppercase font-black tracking-[2px] ml-2 transition-colors ${error ? 'text-red-500' : 'text-gray-500'}`}>
          {label}
        </label>
      )}

      <div className="relative group">
        {icon && (
          <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors z-10 ${error ? 'text-red-500' : 'text-gray-500 group-focus-within:text-red-500'}`}>
            {icon}
          </div>
        )}
        <input
          type="text"
          value={isOpen ? search : value}
          onChange={handleInputChange}
          onFocus={handleOpen}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full bg-white/5 border rounded-xl md:rounded-2xl py-3.5 md:py-5 ${icon ? 'pl-12 md:pl-14' : 'px-5 md:px-6'} pr-20 outline-none transition-all font-bold text-sm md:text-lg ${
            error
              ? 'border-red-500 ring-2 ring-red-500/20 bg-red-500/5'
              : 'border-white/10 focus:border-red-500/50 focus:bg-white/[0.08]'
          }`}
        />

        {value && !isOpen && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500 transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={() => isOpen ? (() => { setIsOpen(false); setSearch(''); })() : handleOpen()}
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
                  className={`w-full text-left px-5 py-3.5 hover:bg-white/10 transition-colors font-bold text-sm border-b border-white/5 last:border-0 cursor-pointer shrink-0 ${value === opt ? 'text-red-500 bg-red-500/5' : 'text-white'}`}
                >
                  {opt}
                </motion.li>
              ))}

              {search && !allOptions.find(o => o.toLowerCase() === search.toLowerCase()) && (
                <motion.li
                  onMouseDown={(e) => { e.preventDefault(); handleSelect(search); }}
                  className="w-full text-left px-5 py-3.5 hover:bg-white/10 transition-colors font-bold text-sm text-red-500 italic border-t border-white/5 cursor-pointer shrink-0"
                >
                  &ldquo;{search}&rdquo; als neuen Wert hinzufügen
                </motion.li>
              )}

              {filteredOptions.length === 0 && !search && (
                <li className="px-5 py-3.5 text-gray-500 text-sm font-bold italic shrink-0">
                  Keine Optionen verfügbar
                </li>
              )}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <p className="text-red-500 text-[10px] md:text-xs font-bold ml-2 animate-pulse">
          {errorText}
        </p>
      )}
    </div>
  );
}
