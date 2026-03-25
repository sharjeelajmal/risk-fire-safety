'use client';

import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Upload,
  Map,
  Calendar as CalendarIcon,
  User,
  Building,
  ArrowRight,
  Loader2,
  X,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/navigation/Navbar';
import CreatableSingleSelect from '@/components/ui/CreatableSingleSelect';
import { FileText } from 'lucide-react';

// Custom Modern Animated Calendar Component
const CustomCalendar = ({ selectedDate, onChange }: { selectedDate: string, onChange: (date: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 16,
        left: rect.left,
        width: rect.width
      });
    }
  };

  useLayoutEffect(() => {
    if (isOpen) {
      updateCoords();
      // window.addEventListener('scroll', updateCoords, true); // Removed redundant scroll listener
      window.addEventListener('resize', updateCoords);
    }
    return () => {
      // window.removeEventListener('scroll', updateCoords, true);
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

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  const selectDate = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    const dateStr = `${year}-${month}-${d}`;

    onChange(dateStr);
    setIsOpen(false);
  };

  const days = [];
  const totalDays = daysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  const startOffset = firstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());

  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let d = 1; d <= totalDays; d++) days.push(d);

  const monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

  const calendarDropdown = (
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
          className="z-[1000000] glass-premium rounded-[2rem] p-6 border border-white/10 shadow-2xl overflow-visible"
        >
          <div className="flex items-center justify-between mb-6">
            <button type="button" onClick={handlePrevMonth} className="p-2 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-colors"><ChevronLeft size={20} /></button>
            <h4 className="font-black uppercase tracking-widest text-sm text-white">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h4>
            <button type="button" onClick={handleNextMonth} className="p-2 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-colors"><ChevronRight size={20} /></button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(d => (
              <div key={d} className="text-center text-[10px] font-black text-gray-600 uppercase py-2">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => (
              <div key={i} className="aspect-square flex items-center justify-center">
                {day && (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => selectDate(day)}
                    className={`w-full h-full rounded-xl text-xs font-bold transition-all ${selectedDate === `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                      : 'hover:bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {day}
                  </motion.button>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative" ref={containerRef}>
      <div
        ref={triggerRef}
        onClick={() => {
          if (!isOpen) updateCoords();
          setIsOpen(!isOpen);
        }}
        className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-3.5 md:py-5 pl-10 md:pl-14 pr-4 focus-within:border-red-500/50 focus-within:bg-white/[0.08] outline-none transition-all font-bold text-sm md:text-lg cursor-pointer flex items-center justify-between group"
      >
        <div className="flex items-center gap-3 md:gap-4">
          <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-red-500 transition-colors w-4 h-4 md:w-5 md:h-5" />
          <span>{new Date(selectedDate + 'T00:00:00').toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
        <ChevronRight className={`text-gray-600 transition-transform w-4 h-4 md:w-[18px] md:h-[18px] ${isOpen ? 'rotate-90' : ''}`} />
      </div>

      {mounted && createPortal(calendarDropdown, document.body)}
    </div>
  );
};


export default function NewInspectionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const getLocalDate = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  const [formData, setFormData] = useState({
    datum: getLocalDate(),
    auftraggeber: '',
    parentTitle: '',
    teilnehmer: 'Robin Furrer',
    documentType: 'Catalog of measures' as 'Catalog of measures' | 'QS protocol',
    participants: [{ name: '', role: '' }],
    generalNotes: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [customNote, setCustomNote] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  const clientOptions = ['Musterfirma AG', 'Immobilien Verwaltung GmbH', 'Swiss Property Management', 'City Real Estate'];
  const noteOptions = [
    'Sämtliche im Protokoll festgehaltenen Sachverhalte sind auf vergleichbare Fälle zu übertragen.',
    'Die im Protokoll aufgeführten Mängel werden durch uns lediglich dokumentiert. Die Behebung sowie die Abmeldung der erledigten Mängel liegen bei den Verantwortlichen.',
    'Die brandschutztechnische Abnahme erfolgt nach Behebung der Mängel.',
    'Der Brandschutzplan ist entsprechend zu aktualisieren.'
  ];
  const [floorPlans, setFloorPlans] = useState<{ id: string, name: string, file: File | null, preview: string | null }[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultNotes = [
    'Sämtliche im Protokoll festgehaltenen Sachverhalte sind auf vergleichbare Fälle zu übertragen.',
    'Die im Protokoll aufgeführten Mängel werden durch uns lediglich dokumentiert. Die Behebung sowie die Abmeldung der erledigten Mängel liegen bei den Verantwortlichen.'
  ];

  const handleNoteToggle = (note: string) => {
    setFormData(prev => ({
      ...prev,
      generalNotes: prev.generalNotes.includes(note)
        ? prev.generalNotes.filter(n => n !== note)
        : [...prev.generalNotes, note]
    }));
  };

  const addCustomNote = () => {
    if (customNote.trim()) {
      setFormData(prev => ({
        ...prev,
        generalNotes: [...prev.generalNotes, customNote.trim()]
      }));
      setCustomNote('');
    }
  };

  // Participant Handlers
  const addParticipant = () => {
    setFormData(prev => ({
      ...prev,
      participants: [...prev.participants, { name: '', role: '' }]
    }));
  };

  const updateParticipant = (index: number, field: 'name' | 'role', value: string) => {
    const newParticipants = [...formData.participants];
    newParticipants[index][field] = value;
    setFormData(prev => ({ ...prev, participants: newParticipants }));
  };

  const removeParticipant = (index: number) => {
    if (formData.participants.length > 1) {
      setFormData(prev => ({
        ...prev,
        participants: prev.participants.filter((_, i) => i !== index)
      }));
    }
  };

  // Floor Plan Handlers
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let files: FileList | null = null;
    
    if ('target' in e && (e.target as HTMLInputElement).files) {
      files = (e.target as HTMLInputElement).files;
    } else if ('dataTransfer' in e) {
      files = (e as React.DragEvent).dataTransfer.files;
    }

    if (files) {
      const newPlans = Array.from(files).map(file => ({
        id: (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).substring(2)),
        name: file.name.split('.')[0], // Default name from filename
        file: file,
        preview: file.type.includes('pdf') ? 'pdf' : URL.createObjectURL(file)
      }));
      setFloorPlans(prev => [...prev, ...newPlans]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleImagesChange(e);
  };

  const updateFloorPlanName = (index: number, name: string) => {
    const newPlans = [...floorPlans];
    newPlans[index].name = name;
    setFloorPlans(newPlans);
  };

  const removeFloorPlan = (index: number) => {
    setFloorPlans(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, boolean> = {};

    if (!formData.datum) newErrors.datum = true;
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      const firstError = Object.keys(newErrors)[0];
      const element = document.getElementsByName(firstError)[0] || document.querySelector(`[label="${firstError}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      const data = new FormData();
      data.append('datum', formData.datum);
      data.append('auftraggeber', formData.auftraggeber);
      data.append('parentTitle', formData.parentTitle);
      data.append('teilnehmer', formData.teilnehmer);
      data.append('documentType', formData.documentType);
      
      // Filter out empty participants
      const validParticipants = formData.participants.filter(p => p.name.trim());
      data.append('participants', JSON.stringify(validParticipants));
      
      data.append('generalNotes', JSON.stringify(formData.generalNotes));
      
      // Floor Plans Data (IDs and Names)
      const floorPlansMeta = floorPlans.map(fp => ({ id: fp.id, name: fp.name }));
      data.append('floorPlansData', JSON.stringify(floorPlansMeta));

      // Append Files
      floorPlans.forEach((fp, index) => {
        if (fp.file) {
          data.append(`file_${index}`, fp.file);
        }
      });

      const res = await fetch('/api/inspections', {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        const result = await res.json();
        if (floorPlans.length > 0) {
          router.push(`/inspection/${result.id}/map`);
        } else {
          router.push(`/inspection/${result.id}/review`);
        }
      } else {
        const errData = await res.json();
        alert(`Fehler: ${errData.error || 'Unbekannter Fehler'}`);
      }
    } catch (error) {
      console.error(error);
      alert('Erstellen der Inspektion fehlgeschlagen. Überprüfen Sie Ihre Verbindung.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden relative">
      <div className="noise-overlay hidden md:block"></div>
      <div className="bg-mesh-premium opacity-50 hidden md:block"></div>

      <Navbar />

      {/* Header */}
      <header className="fixed top-0 left-0 lg:left-24 right-0 h-16 md:h-24 bg-[#050505] border-b border-white/10 shadow-lg z-50 px-4 md:px-12 flex items-center">
        <div className="flex-1 flex items-center justify-start">
          <Link href="/dashboard">
            <motion.div
              whileHover={{ x: -4 }}
              className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors cursor-pointer group"
            >
              <ChevronLeft className="group-hover:text-red-500 w-5 h-5 md:w-6 md:h-6" />
              <span className="font-bold text-xs md:text-sm uppercase tracking-widest hidden md:inline">Zurück</span>
            </motion.div>
          </Link>
        </div>
        
        <h1 className="text-sm md:text-xl font-black uppercase tracking-[2px] md:tracking-[4px] text-white truncate max-w-[180px] md:max-w-none text-center">
          Neue Inspektion
        </h1>
        
        <div className="flex-1 flex justify-end">
          <div className="w-8 h-8 lg:hidden"></div> {/* Mobile Spacer */}
        </div>
      </header>

      <main className="lg:pl-24 pt-24 md:pt-32 pb-32 px-4 md:px-12 lg:px-20 relative z-10 min-h-screen flex flex-col items-center">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-6 md:space-y-12 w-full max-w-5xl"
        >
          {/* Document Type Selection */}
          <div className="bg-[#0a0a0a] border border-white/10 md:glass-premium rounded-2xl md:rounded-[3rem] p-4 md:p-12 space-y-6 md:space-y-8">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-red-600/10 flex items-center justify-center text-red-500">
                <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-none text-white">Dokumenttyp</h2>
                <p className="text-gray-500 text-[9px] md:text-[10px] uppercase font-black tracking-widest mt-1">Bericht auswählen</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {['Catalog of measures', 'QS protocol'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, documentType: type as any })}
                  className={`py-4 md:py-6 px-6 md:px-8 rounded-xl md:rounded-2xl border-2 transition-all font-black text-xs md:text-sm uppercase tracking-widest flex items-center justify-between ${
                    formData.documentType === type 
                      ? 'bg-red-600/10 border-red-500 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]' 
                      : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'
                  }`}
                >
                  {type === 'Catalog of measures' ? 'Massnahmenkatalog' : 'QS Protokoll'}
                  {formData.documentType === type && <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-red-500" />}
                </button>
              ))}
            </div>
          </div>

          {/* Overarching Title Input */}
          <div className="bg-[#0a0a0a] border border-white/10 md:glass-premium rounded-2xl md:rounded-[3rem] p-4 md:p-12 space-y-6 md:space-y-8">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-red-600/10 flex items-center justify-center text-red-500">
                <FileText className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-none text-white">Objektbezeichung</h2>
                <p className="text-gray-500 text-[9px] md:text-[10px] uppercase font-black tracking-widest mt-1">Übergeordneter Titel</p>
              </div>
            </div>

            <div className="relative group">
              <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors w-5 h-5 md:w-6 md:h-6" />
              <input
                type="text"
                value={formData.parentTitle}
                onChange={(e) => setFormData({ ...formData, parentTitle: e.target.value })}
                placeholder="Übergeordneter Titel..."
                className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-3.5 md:py-5 pl-12 md:pl-14 pr-6 outline-none focus:border-red-500/50 focus:bg-white/[0.08] transition-all font-bold text-sm md:text-lg"
              />
            </div>
          </div>

          {/* Stap 1: Basic Details */}
          <div className="bg-[#0a0a0a] border border-white/10 md:glass-premium rounded-2xl md:rounded-[3rem] p-4 md:p-12 space-y-8 md:space-y-10 overflow-visible! relative z-60">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-red-600/10 flex items-center justify-center text-red-500">
                <Building className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-none text-white">Gebäudedetails</h2>
                <p className="text-gray-500 text-[9px] md:text-[10px] uppercase font-black tracking-widest mt-1">Basisinformationen</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 !overflow-visible">

              <div className="space-y-2 md:space-y-3 relative !overflow-visible z-50">
                <label className={`text-[9px] md:text-[10px] uppercase font-black tracking-[2px] ml-2 transition-colors ${errors.datum ? 'text-red-500' : 'text-gray-500'}`}>Datum</label>
                <div className={errors.datum ? 'ring-2 ring-red-500 rounded-2xl' : ''}>
                  <CustomCalendar
                    selectedDate={formData.datum}
                    onChange={(date) => {
                      setFormData({ ...formData, datum: date });
                      if (errors.datum) setErrors(prev => ({ ...prev, datum: false }));
                    }}
                  />
                </div>
                {errors.datum && <p className="text-red-500 text-[10px] md:text-xs font-bold ml-2 animate-pulse">Dieses Feld wird benötigt</p>}
              </div>

              <div className="space-y-2 md:space-y-3">
                <CreatableSingleSelect
                  label="Auftraggeber"
                  icon={<User className="w-4 h-4 md:w-5 md:h-5" />}
                  value={formData.auftraggeber}
                  onChange={(val) => {
                    setFormData({ ...formData, auftraggeber: val });
                    if (errors.auftraggeber) setErrors(prev => ({ ...prev, auftraggeber: false }));
                  }}
                  options={clientOptions}
                  placeholder="Auftraggeber auswählen oder tippen..."
                  listType="auftraggeber"
                  error={errors.auftraggeber}
                />
              </div>

              <div className="space-y-4 md:space-y-6 md:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-[9px] md:text-[10px] uppercase font-black tracking-[2px] text-gray-500 ml-2">Teilnehmer</label>
                  <button
                    type="button"
                    onClick={addParticipant}
                    className="text-[9px] md:text-[10px] uppercase font-black tracking-widest text-red-500 hover:text-red-400 transition-colors flex items-center gap-2"
                  >
                    + Hinzufügen
                  </button>
                </div>
                <div className="space-y-3 md:space-y-4">
                  {formData.participants.map((p, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 items-start bg-white/[0.02] p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/5">
                      <div className="flex-1">
                        <CreatableSingleSelect
                          label=""
                          icon={<User className="w-4 h-4 md:w-4.5 md:h-4.5" />}
                          placeholder="Name"
                          value={p.name}
                          onChange={(val) => updateParticipant(index, 'name', val)}
                          options={[]}
                          listType="participants"
                        />
                      </div>
                      <div className="flex-1">
                        <CreatableSingleSelect
                          label=""
                          icon={<Building className="w-4 h-4 md:w-4.5 md:h-4.5" />}
                          placeholder="Funktion"
                          value={p.role}
                          onChange={(val) => updateParticipant(index, 'role', val)}
                          options={['Architekt', 'Bauleiter', 'Eigentümer / Nutzer', 'Fachplaner', 'Installateur']}
                          listType="functions"
                        />
                      </div>
                        {formData.participants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeParticipant(index)}
                            className="p-3 md:p-4 rounded-xl bg-red-600/10 text-red-500 hover:bg-red-600/20 transition-colors"
                          >
                            <X className="w-4 h-4 md:w-4.5 md:h-4.5" />
                          </button>
                        )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 md:space-y-3">
                <CreatableSingleSelect
                  label="Erstellt von"
                  icon={<User className="w-[18px] h-[18px] md:w-5 md:h-5" />}
                  placeholder="Name des Erstellers"
                  value={formData.teilnehmer}
                  onChange={(val) => setFormData(prev => ({ ...prev, teilnehmer: val }))}
                  options={[]}
                  listType="participants"
                />
              </div>
            </div>
          </div>

          {/* New Section: General Notes */}
          <div className="bg-[#0a0a0a] border border-white/10 md:glass-premium rounded-2xl md:rounded-[3rem] p-4 md:p-12 space-y-8 md:space-y-10 overflow-visible! relative z-60 pb-20 md:pb-32">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-red-600/10 flex items-center justify-center text-red-500">
                <Building className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-none text-white">Hinweise</h2>
                <p className="text-gray-500 text-[9px] md:text-[10px] uppercase font-black tracking-widest mt-1">Zusätzliche Bemerkungen</p>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              {defaultNotes.map((note, index) => (
                <div 
                  key={index} 
                  onClick={() => handleNoteToggle(note)}
                  className={`p-4 md:p-6 rounded-xl md:rounded-2xl border transition-all cursor-pointer flex items-center gap-3 md:gap-4 ${
                    formData.generalNotes.includes(note)
                      ? 'bg-red-600/10 border-red-500 text-white'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <div className={`w-5 h-5 md:w-6 md:h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    formData.generalNotes.includes(note) ? 'bg-red-600 border-red-600' : 'border-white/20'
                  }`}>
                    {formData.generalNotes.includes(note) && <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />}
                  </div>
                  <p className="text-xs md:text-sm font-bold flex-1 leading-relaxed">{note}</p>
                </div>
              ))}

              <div className="mt-2 space-y-3 md:space-y-4 !overflow-visible">
                <CreatableSingleSelect
                  label="Eigene Notiz hinzufügen"
                  placeholder="Hinweis auswählen oder neu tippen..."
                  value={customNote}
                  onChange={(val) => setCustomNote(val)}
                  options={noteOptions}
                  listType="notes"
                />
                <button
                  type="button"
                  onClick={addCustomNote}
                  className="w-full px-6 md:px-8 py-4 bg-red-600 text-white font-black uppercase tracking-widest text-[10px] md:text-xs rounded-xl md:rounded-2xl hover:bg-red-700 transition-colors shadow-xl text-center"
                >
                  Hinweis zur Liste hinzufügen
                </button>
              </div>
                
                {formData.generalNotes.filter(n => !defaultNotes.includes(n)).length > 0 && (
                  <div className="pt-4 space-y-3">
                    <p className="text-[10px] uppercase font-black tracking-[2px] text-red-500 ml-2">Benutzerdefinierte Notizen:</p>
                    {formData.generalNotes
                      .filter(note => !defaultNotes.includes(note))
                      .map((note, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                          <p className="text-sm font-bold text-white pr-4">{note}</p>
                          <button 
                            type="button"
                            onClick={() => handleNoteToggle(note)}
                            className="text-gray-500 hover:text-red-500 transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

          {/* Stap 2: Map Upload */}
          <div className="bg-[#0a0a0a] border border-white/10 md:glass-premium rounded-2xl md:rounded-[3rem] p-4 md:p-12 space-y-8 md:space-y-10">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-red-600/10 flex items-center justify-center text-red-500">
                <Map className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-none text-white">Grundriss</h2>
                <p className="text-gray-500 text-[9px] md:text-[10px] uppercase font-black tracking-widest mt-1">Plan hochladen</p>
              </div>
            </div>

            <div className="space-y-8">
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`w-full py-8 md:py-12 bg-white/[0.02] rounded-2xl md:rounded-[3rem] border-2 border-dashed flex flex-col items-center justify-center gap-4 md:gap-6 group hover:border-red-500/50 hover:bg-red-500/[0.02] transition-all cursor-pointer relative ${
                  isDragging ? 'border-red-500 bg-red-500/10' : 'border-white/10'
                }`}
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-12 h-12 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-red-600/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform"
                >
                  <Upload className="w-6 h-6 md:w-8 md:h-8" />
                </motion.div>
                <div className="text-center px-4">
                  <p className="text-sm md:text-xl font-black uppercase tracking-tight text-white">Pläne hochladen</p>
                  <p className="text-gray-500 text-[8px] md:text-[10px] font-black mt-2 uppercase tracking-[2px] md:tracking-[3px]">JPG, PNG, PDF (Mehrere oder Drag & Drop)</p>
                </div>
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*,application/pdf"
                  onChange={handleImagesChange}
                />
              </div>

              {floorPlans.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {floorPlans.map((plan, index) => (
                    <div key={plan.id} className="bg-[#0a0a0a] border border-white/10 md:glass-premium rounded-3xl overflow-hidden flex flex-col">
                      <div className="relative aspect-[16/9] bg-black flex items-center justify-center">
                        {plan.preview === 'pdf' ? (
                          <div className="flex flex-col items-center gap-3 text-red-500">
                            <FileText className="w-12 h-12 md:w-20 md:h-20" />
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">PDF Dokument</span>
                          </div>
                        ) : (
                          <img src={plan.preview!} alt={plan.name} className="w-full h-full object-contain min-h-[150px] md:min-h-[200px]" />
                        )}
                        <button
                          type="button"
                          onClick={() => removeFloorPlan(index)}
                          className="absolute top-2 md:top-4 right-2 md:right-4 p-1.5 md:p-2 rounded-lg md:rounded-xl bg-black/60 backdrop-blur-md text-white hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4 md:w-4.5 md:h-4.5" />
                        </button>
                      </div>
                      <div className="p-3 md:p-6 space-y-2 md:space-y-3">
                        <label className="text-[9px] md:text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">Plan Bezeichnung</label>
                        <input
                          required
                          type="text"
                          placeholder="z.B. Erdgeschoss"
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 md:py-4 px-4 md:px-5 focus:border-red-500/50 outline-none transition-all font-bold text-xs md:text-sm"
                          value={plan.name}
                          onChange={(e) => updateFloorPlanName(index, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Fixed Footer Action */}
          <div className="fixed bottom-16 md:bottom-20 lg:bottom-0 left-0 right-0 lg:left-24 h-16 md:h-20 bg-[#050505]/90 backdrop-blur-md border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] z-[999] flex items-center justify-center px-4 md:px-8">
            <motion.button
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              disabled={loading}
              className="w-full max-w-lg bg-gradient-to-r from-red-600 to-red-900 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 md:gap-3 text-white font-black uppercase tracking-widest text-[10px] md:text-sm shadow-[0_20px_50px_rgba(239,68,68,0.3)] hover:shadow-[0_30px_70px_rgba(239,68,68,0.5)] transition-all cursor-pointer disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-[10px] md:text-xs">Wird erstellt...</span>
                </>
              ) : (
                <>
                  <span className="text-[10px] md:text-xs">Inspektion starten</span>
                  <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </>
              )}
            </motion.button>
          </div>
        </motion.form>
      </main>
    </div>
  );
}