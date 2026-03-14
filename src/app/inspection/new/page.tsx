'use client';

import { useState, useRef, useEffect } from 'react';
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

// Custom Modern Animated Calendar Component
const CustomCalendar = ({ selectedDate, onChange }: { selectedDate: string, onChange: (date: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  const selectDate = (day: number) => {
    // Correctly create a local date string to avoid UTC shift
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

  return (
    <div className="relative" ref={containerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-4 focus-within:border-red-500/50 focus-within:bg-white/[0.08] outline-none transition-all font-bold text-lg cursor-pointer flex items-center justify-between group"
      >
        <div className="flex items-center gap-4">
          <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-red-500 transition-colors" size={20} />
          <span>{new Date(selectedDate + 'T00:00:00').toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
        <ChevronRight size={18} className={`text-gray-600 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-4 glass-premium rounded-[2rem] p-6 z-[999] border border-white/10 shadow-2xl overflow-visible"
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
                        ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                        : 'text-gray-400 hover:bg-white/10 hover:text-white'
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
    ort: '',
    datum: getLocalDate(),
    auftraggeber: '',
    teilnehmer: 'Robin Furrer',
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return alert('Bitte laden Sie zuerst den Grundriss hoch!');

    setLoading(true);
    try {
      const data = new FormData();
      data.append('ort', formData.ort);
      data.append('datum', formData.datum);
      data.append('auftraggeber', formData.auftraggeber);
      data.append('teilnehmer', formData.teilnehmer);
      data.append('floorPlan', image);

      const res = await fetch('/api/inspections', {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        const result = await res.json();
        router.push(`/inspection/${result.id}/map`);
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
      <div className="noise-overlay"></div>
      <div className="bg-mesh-premium opacity-50"></div>

      <Navbar />

      {/* Header */}
      <header className="fixed top-0 left-0 lg:left-24 right-0 h-24 glass-premium border-b border-white/5 z-50 px-6 md:px-12 flex items-center">
        <div className="flex-1 flex items-center justify-start">
          <Link href="/dashboard">
            <motion.div
              whileHover={{ x: -4 }}
              className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors cursor-pointer group"
            >
              <ChevronLeft size={24} className="group-hover:text-red-500" />
              <span className="font-bold text-sm uppercase tracking-widest hidden md:inline">Zurück</span>
            </motion.div>
          </Link>
        </div>
        
        <h1 className="text-xl font-black uppercase tracking-[4px] text-white truncate max-w-[200px] md:max-w-none text-center">
          Neue Inspektion
        </h1>
        
        <div className="flex-1 flex justify-end">
          <div className="w-10 h-10 lg:hidden"></div> {/* Mobile Spacer */}
        </div>
      </header>

      <main className="lg:pl-24 pt-32 pb-32 px-6 md:px-12 lg:px-20 relative z-10 min-h-screen flex flex-col items-center">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-12 w-full max-w-5xl"
        >
          {/* Stap 1: Basic Details */}
          <div className="glass-premium rounded-[3rem] p-6 md:p-12 border border-white/5 space-y-10 !overflow-visible relative z-20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-600/10 flex items-center justify-center text-red-500">
                <Building size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter leading-none text-white">Gebäudedetails</h2>
                <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mt-1">Schritt 1: Basisinformationen</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 !overflow-visible">
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-black tracking-[2px] text-gray-500 ml-2">Locatie (Ort)</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors z-10">
                    <Building size={20} />
                  </div>
                  <input
                    required
                    type="text"
                    placeholder="z.B. Hotel Nufenen"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-4 focus:border-red-500/50 focus:bg-white/[0.08] outline-none transition-all font-bold text-lg"
                    value={formData.ort}
                    onChange={(e) => setFormData({ ...formData, ort: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3 relative !overflow-visible z-50">
                <label className="text-[10px] uppercase font-black tracking-[2px] text-gray-500 ml-2">Datum</label>
                <CustomCalendar
                  selectedDate={formData.datum}
                  onChange={(date) => setFormData({ ...formData, datum: date })}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase font-black tracking-[2px] text-gray-500 ml-2">Opdrachtgeber</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors z-10">
                    <User size={20} />
                  </div>
                  <input
                    required
                    type="text"
                    placeholder="Namen des Auftraggebers eingeben..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-4 focus:border-red-500/50 focus:bg-white/[0.08] outline-none transition-all font-bold text-lg"
                    value={formData.auftraggeber}
                    onChange={(e) => setFormData({ ...formData, auftraggeber: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase font-black tracking-[2px] text-gray-500 ml-2">Inspecteur (Deelnemer)</label>
                <div className="relative group grayscale opacity-50">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10">
                    <User size={20} />
                  </div>
                  <input
                    required
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-4 outline-none font-bold text-lg cursor-not-allowed"
                    value={formData.teilnehmer}
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stap 2: Map Upload */}
          <div className="glass-premium rounded-[3rem] p-6 md:p-12 border border-white/5 space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-600/10 flex items-center justify-center text-red-500">
                <Map size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter leading-none text-white">Grundriss (Karte)</h2>
                <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mt-1">Schritt 2: Plan hochladen</p>
              </div>
            </div>

            {!preview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-[16/9] bg-white/[0.02] rounded-[3rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-6 group hover:border-red-500/50 hover:bg-red-500/[0.02] transition-all cursor-pointer"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-red-600/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform"
                >
                  <Upload size={40} />
                </motion.div>
                <div className="text-center px-4">
                  <p className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">Grundriss hochladen</p>
                  <p className="text-gray-500 text-[10px] font-black mt-2 uppercase tracking-[3px]">JPG, PNG (MAX. 10MB)</p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            ) : (
              <div className="relative glass-premium rounded-[3rem] overflow-hidden border border-white/10 group">
                <img src={preview} alt="Map Preview" className="w-full h-auto object-cover max-h-[500px]" />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { setImage(null); setPreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                    className="bg-red-600 text-white flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-2xl transition-transform cursor-pointer"
                  >
                    <X size={20} />
                    Ersetzen
                  </motion.button>
                </div>
                <div className="absolute top-6 right-6 flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl">
                  <CheckCircle2 size={14} />
                  Ausgewählt
                </div>
              </div>
            )}
          </div>

          {/* Fixed Footer Action */}
          <div className="fixed bottom-20 lg:bottom-0 left-0 right-0 lg:left-24 h-32 glass-premium border-t border-white/5 z-50 flex items-center justify-center px-6 md:px-8">
            <motion.button
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              disabled={loading || !image}
              className="w-full max-w-2xl bg-gradient-to-r from-red-600 to-red-900 py-6 rounded-[2rem] flex items-center justify-center gap-4 text-white font-black uppercase tracking-[3px] shadow-[0_20px_50px_rgba(239,68,68,0.3)] hover:shadow-[0_30px_70px_rgba(239,68,68,0.5)] transition-all cursor-pointer disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  <span>Inspektion wird erstellt...</span>
                </>
              ) : (
                <>
                  <span>Inspektion starten</span>
                  <ArrowRight size={20} />
                </>
              )}
            </motion.button>
          </div>
        </motion.form>
      </main>
    </div>
  );
}