'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Map,
  Calendar as CalendarIcon,
  User,
  Building,
  ArrowRight,
  Loader2,
  X,
  ChevronRight,
  CheckCircle2,
  Pencil,
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/navigation/Navbar';
import CreatableSingleSelect from '@/components/ui/CreatableSingleSelect';

// Reuse the same calendar component pattern from new/page.tsx
const CustomCalendar = ({ selectedDate, onChange }: { selectedDate: string; onChange: (date: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = selectedDate ? new Date(selectedDate + 'T00:00:00') : new Date();
    return d;
  });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const firstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();
  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  const selectDate = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    onChange(`${year}-${month}-${d}`);
    setIsOpen(false);
  };

  const days: (number | null)[] = [];
  const totalDays = daysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  const startOffset = firstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let d = 1; d <= totalDays; d++) days.push(d);

  const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

  return (
    <div className="relative" ref={containerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-3.5 md:py-5 pl-10 md:pl-14 pr-4 focus-within:border-red-500/50 outline-none transition-all font-bold text-sm md:text-lg cursor-pointer flex items-center justify-between group"
      >
        <div className="flex items-center gap-3 md:gap-4">
          <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-red-500 transition-colors w-4 h-4 md:w-5 md:h-5" />
          <span>{selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Datum wählen'}</span>
        </div>
        <ChevronRight className={`text-gray-600 transition-transform w-4 h-4 md:w-[18px] md:h-[18px] ${isOpen ? 'rotate-90' : ''}`} />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-4 glass-premium rounded-[2rem] p-6 z-[999999] border border-white/10 shadow-2xl overflow-visible"
          >
            <div className="flex items-center justify-between mb-6">
              <button type="button" onClick={handlePrevMonth} className="p-2 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-colors"><ChevronLeft size={20} /></button>
              <h4 className="font-black uppercase tracking-widest text-sm text-white">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h4>
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
                      className={`w-full h-full rounded-xl text-xs font-bold transition-all ${
                        selectedDate === `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                          ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                          : 'text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >{day}</motion.button>
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

function EditDetailsContent() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const clientOptions = ['Musterfirma AG', 'Immobilien Verwaltung GmbH', 'Swiss Property Management', 'City Real Estate'];
  const noteOptions = [
    'Sämtliche im Protokoll festgehaltenen Sachverhalte sind auf vergleichbare Fälle zu übertragen.',
    'Die im Protokoll aufgeführten Mängel werden durch uns lediglich dokumentiert. Die Behebung sowie die Abmeldung der erledigten Mängel liegen bei den Verantwortlichen.',
    'Die brandschutztechnische Abnahme erfolgt nach Behebung der Mängel.',
    'Der Brandschutzplan ist entsprechend zu aktualisieren.'
  ];

  const defaultNotes = [
    'Sämtliche im Protokoll festgehaltenen Sachverhalte sind auf vergleichbare Fälle zu übertragen.',
    'Die im Protokoll aufgeführten Mängel werden durch uns lediglich dokumentiert. Die Behebung sowie die Abmeldung der erledigten Mängel liegen bei den Verantwortlichen.'
  ];

  const [formData, setFormData] = useState({
    datum: '',
    auftraggeber: '',
    teilnehmer: '',
    documentType: 'Catalog of measures' as 'Catalog of measures' | 'QS protocol',
    participants: [{ name: '', role: '' }],
    generalNotes: [] as string[],
  });
  const [customNote, setCustomNote] = useState('');

  // Load existing inspection data
  useEffect(() => {
    const fetchInspection = async () => {
      try {
        const res = await fetch(`/api/inspections/${id}`);
        if (res.ok) {
          const data = await res.json();
          // Format date to YYYY-MM-DD
          let datum = '';
          if (data.datum) {
            const d = new Date(data.datum);
            datum = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          }
          setFormData({
            datum,
            auftraggeber: data.auftraggeber || '',
            teilnehmer: data.teilnehmer || '',
            documentType: data.documentType || 'Catalog of measures',
            participants: data.participantsList?.length > 0
              ? data.participantsList
              : [{ name: '', role: '' }],
            generalNotes: data.generalNotes || [],
          });
        }
      } catch (err) {
        console.error('Error fetching inspection:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInspection();
  }, [id]);

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
      setFormData(prev => ({ ...prev, generalNotes: [...prev.generalNotes, customNote.trim()] }));
      setCustomNote('');
    }
  };

  const addParticipant = () => {
    setFormData(prev => ({ ...prev, participants: [...prev.participants, { name: '', role: '' }] }));
  };

  const updateParticipant = (index: number, field: 'name' | 'role', value: string) => {
    const newParticipants = [...formData.participants];
    newParticipants[index][field] = value;
    setFormData(prev => ({ ...prev, participants: newParticipants }));
  };

  const removeParticipant = (index: number) => {
    if (formData.participants.length > 1) {
      setFormData(prev => ({ ...prev, participants: prev.participants.filter((_, i) => i !== index) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, boolean> = {};
    if (!formData.auftraggeber.trim()) newErrors.auftraggeber = true;
    if (!formData.datum) newErrors.datum = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSaving(true);
    try {
      const validParticipants = formData.participants.filter(p => p.name.trim());
      const res = await fetch(`/api/inspections/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          datum: formData.datum,
          auftraggeber: formData.auftraggeber,
          teilnehmer: formData.teilnehmer,
          documentType: formData.documentType,
          participants: validParticipants,
          generalNotes: formData.generalNotes,
        }),
      });

      if (res.ok) {
        router.push(`/inspection/${id}/review`);
      } else {
        const err = await res.json();
        alert(`Fehler: ${err.error || 'Unbekannter Fehler'}`);
      }
    } catch (error) {
      console.error(error);
      alert('Speichern fehlgeschlagen. Überprüfen Sie Ihre Verbindung.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-t-2 border-red-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden relative">
      <div className="noise-overlay"></div>
      <div className="bg-mesh-premium opacity-50"></div>

      <Navbar />

      {/* Header */}
      <header className="fixed top-0 left-0 lg:left-24 right-0 h-16 md:h-24 glass-premium border-b border-white/5 z-50 px-4 md:px-12 flex items-center">
        <div className="flex-1 flex items-center justify-start">
          <Link href={`/inspection/${id}/review`}>
            <motion.div
              whileHover={{ x: -4 }}
              className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors cursor-pointer group"
            >
              <ChevronLeft className="group-hover:text-red-500 w-5 h-5 md:w-6 md:h-6" />
              <span className="font-bold text-xs md:text-sm uppercase tracking-widest hidden md:inline">Zurück</span>
            </motion.div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Pencil className="w-4 h-4 text-red-500" />
          <h1 className="text-sm md:text-xl font-black uppercase tracking-[2px] md:tracking-[4px] text-white truncate max-w-[180px] md:max-w-none text-center">
            Details bearbeiten
          </h1>
        </div>

        <div className="flex-1 flex justify-end">
          <div className="w-8 h-8 lg:hidden"></div>
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
          <div className="glass-premium rounded-2xl md:rounded-[3rem] p-4 md:p-12 border border-white/5 space-y-6 md:space-y-8">
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

          {/* Basic Details */}
          <div className="glass-premium rounded-2xl md:rounded-[3rem] p-4 md:p-12 border border-white/5 space-y-8 md:space-y-10 overflow-visible! relative z-60">
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
                          icon={<User className="w-4 h-4" />}
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
                          icon={<Building className="w-4 h-4" />}
                          placeholder="Funktion"
                          value={p.role}
                          onChange={(val) => updateParticipant(index, 'role', val)}
                          options={['Architekt', 'Bauleiter', 'Eigentümer', 'Fachplaner', 'Installateur']}
                          listType="functions"
                        />
                      </div>
                      {formData.participants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeParticipant(index)}
                          className="p-3 md:p-4 rounded-xl bg-red-600/10 text-red-500 hover:bg-red-600/20 transition-colors"
                        >
                          <X className="w-4 h-4" />
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
                  onChange={(val) => setFormData({ ...formData, teilnehmer: val })}
                  options={[]}
                  listType="participants"
                />
              </div>
            </div>
          </div>

          {/* General Notes */}
          <div className="glass-premium rounded-2xl md:rounded-[3rem] p-4 md:p-12 border border-white/5 space-y-8 md:space-y-10 overflow-visible! relative z-60 pb-20 md:pb-32">
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

          {/* Fixed Footer */}
          <div className="fixed bottom-16 md:bottom-20 lg:bottom-0 left-0 right-0 lg:left-24 h-24 md:h-32 glass-premium border-t border-white/5 z-50 flex items-center justify-center px-4 md:px-8">
            <motion.button
              whileHover={!saving ? { scale: 1.02 } : {}}
              whileTap={!saving ? { scale: 0.98 } : {}}
              disabled={saving}
              className="w-full max-w-2xl bg-gradient-to-r from-red-600 to-red-900 py-4 md:py-6 rounded-xl md:rounded-[2rem] flex items-center justify-center gap-3 md:gap-4 text-white font-black uppercase tracking-[2px] md:tracking-[3px] text-xs md:text-base shadow-[0_20px_50px_rgba(239,68,68,0.3)] hover:shadow-[0_30px_70px_rgba(239,68,68,0.5)] transition-all cursor-pointer disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5 md:w-6 md:h-6" />
                  <span>Wird gespeichert...</span>
                </>
              ) : (
                <>
                  <span>Änderungen speichern</span>
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </>
              )}
            </motion.button>
          </div>
        </motion.form>
      </main>
    </div>
  );
}

export default function EditDetailsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-t-2 border-red-600 animate-spin" />
      </div>
    }>
      <EditDetailsContent />
    </Suspense>
  );
}
