'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Save, ChevronLeft, Trash2 } from 'lucide-react';
import Navbar from '@/components/navigation/Navbar';
import ImageUploader from '../../add-issue/components/ImageUploader';
import CustomSelect from '../../add-issue/components/CustomSelect';
import CreatableMultiSelect from '@/components/ui/CreatableMultiSelect';

const CONTRACTOR_OPTIONS = [
  { label: 'Architekt', value: 'Architect' },
  { label: 'Fachplaner', value: 'specialist planner' },
  { label: 'Installateur', value: 'installer' },
  { label: 'Eigentümer / Nutzer', value: 'owner-user group' },
  { label: 'Bauleiter', value: 'site manager' },
  { label: 'Elektriker', value: 'electrician' },
  { label: 'QS Brandschutz', value: 'QS fire protection' },
  { label: 'Gesamtleiter', value: 'overall manager' },
];

const STATUS_OPTIONS = [
  { label: 'Offen', value: 'Offen' },
  { label: 'in Arbeit', value: 'in Arbeit' },
  { label: 'abgeschlossen', value: 'abgeschlossen' },
  { label: 'N/A', value: 'N/A' },
];

const MEASURE_OPTIONS = [
  'Brandschutzabschottung erstellen',
  'Leitungen nachisolieren',
  'Brandschutzklappe einbauen',
  'Fugen abdichten'
];

function EditIssueForm() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  // Existing images from DB (URLs)
  const [existingImages, setExistingImages] = useState<string[]>([]);
  // New images selected from local file system
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [pdfFlags, setPdfFlags] = useState<boolean[]>([]);

  const [formData, setFormData] = useState({
    issueNumber: '',
    location: '',
    responsibleContractor: [] as string[],
    description: '',
    measures: [] as string[],
    priority: '1',
    category: '',
    status: 'Offen',
    floorPlanId: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/inspections/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          const issue = data.issues.find((i: any) => i._id === params.issueId);
          if (issue) {
            setFormData({
              issueNumber: issue.issueNumber || '',
              location: issue.location || '',
              responsibleContractor: issue.responsibleContractor ? issue.responsibleContractor.split(', ').filter(Boolean) : [],
              description: issue.description || '',
              measures: issue.measures ? issue.measures.split(', ').filter(Boolean) : [],
               priority: issue.priority || '1',
               category: issue.category || '',
               status: issue.status || 'Offen',
               floorPlanId: issue.floorPlanId || '',
            });
            setExistingImages(issue.images || []);
          }
        }
      } catch (err) {
        console.error('Error fetching issue:', err);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [params.id, params.issueId]);

  const handleNewImageChange = (files: File[]) => {
    setNewImages(prev => [...prev, ...files]);
    setNewPreviews(prev => [...prev, ...files.map(file => URL.createObjectURL(file))]);
    setPdfFlags(prev => [...prev, ...files.map(file => file.type === 'application/pdf')]);
  };

  const removeExistingImage = (url: string) => {
    setExistingImages(prev => prev.filter(img => img !== url));
  };

  const removeNewImage = (i: number) => {
    setNewImages(prev => prev.filter((_, idx) => idx !== i));
    setNewPreviews(prev => prev.filter((_, idx) => idx !== i));
    setPdfFlags(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Relaxed Validation
    const hasExistingImages = existingImages.length > 0;
    const hasNewImages = newImages.length > 0;
    const hasDescription = formData.description.trim().length > 0;
    const hasMeasures = formData.measures.length > 0;

    // Mandatory Category
    if (!formData.category) {
      alert('Bitte wählen Sie eine Kategorie aus.');
      setLoading(false);
      return;
    }

    // Only error if everything is empty
    if (!hasExistingImages && !hasNewImages && !hasDescription && !hasMeasures) {
      alert('Bitte geben Sie mindestens ein Bild, eine Beschreibung oder eine Massnahme an.');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const uploadedUrls: string[] = [...existingImages];
      
      // Upload new images
      for (const img of newImages) {
        const reader = new FileReader();
        const b64Promise = new Promise<string>((res) => {
          reader.onload = () => res(reader.result as string);
          reader.readAsDataURL(img);
        });
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: JSON.stringify({ image: await b64Promise }),
        });
        if (res.ok) {
          const data = await res.json();
          uploadedUrls.push(data.url);
        }
      }

      const result = await fetch(`/api/inspections/${params.id}/issues/${params.issueId}`, {
        method: 'PATCH',
        body: JSON.stringify({ 
          ...formData, 
          responsibleContractor: formData.responsibleContractor.join(', '),
          measures: formData.measures.join(', '),
          images: uploadedUrls 
        }),
      });

      if (result.ok) {
        router.push(`/inspection/${params.id}/review`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-t-2 border-red-600 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col pt-16 md:pt-20 pb-24 md:pb-12">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto w-full px-3 md:px-6">
        <div className="mb-8 md:mb-12">
          <button 
            onClick={() => router.push(`/inspection/${params.id}/review`)}
            className="flex items-center gap-1.5 md:gap-2 text-zinc-500 hover:text-white transition-colors mb-4 md:mb-6 group cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Zurück</span>
          </button>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white mb-1 md:mb-2 uppercase">Mangel bearbeiten</h1>
          <p className="text-[11px] md:text-sm text-zinc-500 font-medium italic">Details aktualisieren.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-8">
          <div className="space-y-1.5 md:space-y-2">
            <label className="block text-[10px] md:text-xs font-black uppercase tracking-widest text-zinc-400">Mangel-Nummer</label>
            <input type="text" value={formData.issueNumber} onChange={(e) => setFormData({...formData, issueNumber: e.target.value})} placeholder="z.B. 1, 2024-01A" className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl md:rounded-2xl px-4 md:px-5 py-3 md:py-4 focus:outline-none focus:border-red-500/50 transition-all text-[13px] md:text-sm shadow-xl" />
          </div>
          {/* Image Section */}
          <div className="space-y-3 md:space-y-4">
            <label className="block text-[10px] md:text-xs font-black uppercase tracking-widest text-zinc-400">Bilder</label>
            
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-2 md:mb-4">
                {existingImages.map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden group">
                    <img src={url} className="w-full h-full object-cover" alt="Existing" />
                    <button 
                      type="button"
                      onClick={() => removeExistingImage(url)}
                      className="absolute top-1.5 md:top-2 right-1.5 md:right-2 p-1.5 md:p-2 bg-red-600 text-white rounded-lg md:rounded-xl md:opacity-0 md:group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* New Images Uploader */}
            <ImageUploader 
              previews={newPreviews} 
              onAddImages={handleNewImageChange} 
              onRemoveImage={removeNewImage} 
              isPdf={(i: number) => pdfFlags[i] ?? false}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-1.5 md:space-y-2">
              <label className="block text-[10px] md:text-xs font-black uppercase tracking-widest text-zinc-400">Standortbereich</label>
              <input 
                type="text" 
                value={formData.location} 
                onChange={(e) => setFormData({...formData, location: e.target.value})} 
                placeholder="z.B. Flur 1. OG" 
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl md:rounded-2xl px-4 md:px-5 py-3 md:py-4 focus:outline-none focus:border-red-500/50 transition-all text-[13px] md:text-sm shadow-xl" 
              />
            </div>
            <CreatableMultiSelect
                label="Unternehmer"
                values={formData.responsibleContractor}
                onChange={(vals) => setFormData({...formData, responsibleContractor: vals})}
                options={CONTRACTOR_OPTIONS.map(o => o.label)}
                placeholder="Unternehmer auswählen..."
            />
          </div>

          <div className="space-y-1.5 md:space-y-2">
            <label className="block text-[10px] md:text-xs font-black uppercase tracking-widest text-zinc-400">Kategorie (Zwingend)</label>
            <div className="flex flex-wrap gap-2">
              {[
                'Baulicher Brandschutz',
                'Technischer Brandschutz',
                'Organisatorischer Brandschutz',
                'Abwehrender Brandschutz',
                'Allgemeines'
              ].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormData({...formData, category: cat})}
                  className={`px-4 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${
                    formData.category === cat 
                      ? 'bg-white text-black border-white' 
                      : 'bg-[#0a0a0a] border-white/10 text-zinc-500 hover:border-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 md:space-y-2">
            <label className="block text-[10px] md:text-xs font-black uppercase tracking-widest text-zinc-400">Mängel / Beschreibung</label>
            <textarea 
              rows={4} 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
              placeholder="Was ist der Mangel?" 
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl md:rounded-2xl px-4 md:px-5 py-3 md:py-4 focus:outline-none focus:border-red-500/50 transition-all text-[13px] md:text-sm resize-none shadow-xl" 
            />
          </div>

          <div className="space-y-1.5 md:space-y-2">
            <label className="block text-[10px] md:text-xs font-black uppercase tracking-widest text-zinc-400">Massnahmen</label>
            <CreatableMultiSelect
                values={formData.measures}
                onChange={(vals) => setFormData({...formData, measures: vals})}
                options={MEASURE_OPTIONS}
                placeholder="Massnahmen auswählen oder tippen..."
                dropdownDirection="up"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <CustomSelect 
              label="Status" 
              options={STATUS_OPTIONS} 
              value={formData.status} 
              onChange={(val) => setFormData({...formData, status: val})} 
            />
            <div className="space-y-1.5 md:space-y-2">
              <label className="block text-[10px] md:text-xs font-black uppercase tracking-widest text-zinc-400">Priorität</label>
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-2">
                {['1', '2', '3', '4', 'n/a'].map(v => (
                  <button 
                    key={v} 
                    type="button" 
                    onClick={() => setFormData({...formData, priority: v as any})} 
                    className={`py-2 px-1 rounded-lg border transition-all font-black text-[9px] tracking-tight text-center flex items-center justify-center min-h-[40px] ${
                      formData.priority === v 
                        ? 'bg-red-500/10 text-red-500 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' 
                        : 'bg-[#0a0a0a] border-white/5 text-zinc-500 hover:border-white/20'
                    }`}
                  >
                    {v === 'n/a' ? 'N/A' : `Priorität ${v}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2 w-full mt-4">
            <button
              type="button"
              onClick={() => router.push(`/inspection/${params.id}/map`)}
              className="flex-1 h-10 rounded-full font-black uppercase tracking-widest text-zinc-500 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-[10px] cursor-pointer"
            >
              Abbrechen
            </button>
            <motion.button 
              disabled={loading} 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              className={`flex-2 h-10 rounded-full font-black uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer ${loading ? 'bg-zinc-800 text-zinc-500' : 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-xl'}`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <><span className="text-[10px]">Aktualisieren</span><Save className="w-3.5 h-3.5" /></>
              )}
            </motion.button>
          </div>
        </form>
      </main>
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>
    </div>
  );
}

export default function EditIssuePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center"><div className="w-12 h-12 rounded-full border-t-2 border-red-600 animate-spin"></div></div>}>
      <EditIssueForm />
    </Suspense>
  );
}
