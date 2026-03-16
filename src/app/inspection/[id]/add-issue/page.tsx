'use client';

import { useState, Suspense } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import Navbar from '@/components/navigation/Navbar';
import FormHeader from './components/FormHeader';
import ImageUploader from './components/ImageUploader';
import CustomSelect from './components/CustomSelect';

const CONTRACTOR_OPTIONS = [
  { label: 'Architekt', value: 'Architect' },
  { label: 'Fachplaner', value: 'specialist planner' },
  { label: 'Installateur', value: 'installer' },
  { label: 'Eigentümer-Nutzergruppe', value: 'owner-user group' },
  { label: 'Bauleiter', value: 'site manager' },
  { label: 'Elektriker', value: 'electrician' },
  { label: 'QS Brandschutz', value: 'QS fire protection' },
  { label: 'Gesamtleiter', value: 'overall manager' },
];

const STATUS_OPTIONS = [
  { label: 'Open', value: 'Open' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Documentation', value: 'Documentation' },
  { label: 'n/a', value: 'n/a' },
];

function AddIssueForm() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    location: '',
    responsibleContractor: '',
    description: '',
    measures: '',
    priority: '1',
    status: 'Open',
    floorPlanId: searchParams.get('floorPlanId') || '',
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...selectedFiles]);
      setPreviews(prev => [...prev, ...selectedFiles.map(file => URL.createObjectURL(file))]);
    }
  };

  const removeImage = (i: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== i));
    setPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const uploadedUrls: string[] = [];
      for (const img of images) {
        const reader = new FileReader();
        const b64Promise = new Promise<string>((res) => { reader.onload = () => res(reader.result as string); reader.readAsDataURL(img); });
        const res = await fetch('/api/upload', { method: 'POST', body: JSON.stringify({ image: await b64Promise }) });
        if (res.ok) uploadedUrls.push((await res.json()).url);
      }
      const result = await fetch(`/api/inspections/${params.id}/issues`, {
        method: 'POST',
        body: JSON.stringify({ 
          ...formData, 
          x: parseFloat(searchParams.get('x') || '0'), 
          y: parseFloat(searchParams.get('y') || '0'), 
          images: uploadedUrls,
          floorPlanId: formData.floorPlanId 
        }),
      });
      if (result.ok) router.push(`/inspection/${params.id}/map`);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col pt-16 md:pt-20 pb-24 md:pb-12">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto w-full px-3 md:px-6">
        <FormHeader x={searchParams.get('x')} y={searchParams.get('y')} />
        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-8">
          <ImageUploader previews={previews} onAddImages={handleImageChange} onRemoveImage={removeImage} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-1.5 md:space-y-2">
              <label className="block text-[10px] md:text-xs font-black uppercase tracking-widest text-zinc-400">Standortbereich</label>
              <input required type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="z.B. Flur 1. OG" className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl md:rounded-2xl px-4 md:px-5 py-3 md:py-4 focus:outline-none focus:border-red-500/50 transition-all text-[13px] md:text-sm shadow-xl" />
            </div>
            <CustomSelect label="Unternehmer" options={CONTRACTOR_OPTIONS} value={formData.responsibleContractor} onChange={(val) => setFormData({...formData, responsibleContractor: val})} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <CustomSelect label="Status" options={STATUS_OPTIONS} value={formData.status} onChange={(val) => setFormData({...formData, status: val})} required />
             <div className="space-y-1.5 md:space-y-2">
              <label className="block text-[10px] md:text-xs font-black uppercase tracking-widest text-zinc-400">Priorität</label>
              <div className="flex gap-1.5 md:gap-2">
                {['1', '2', '3', 'n/a'].map(v => (
                  <button key={v} type="button" onClick={() => setFormData({...formData, priority: v as any})} className={`flex-1 py-2.5 md:py-3 rounded-lg md:rounded-xl border transition-all font-black text-[9px] md:text-[10px] tracking-widest ${formData.priority === v ? 'bg-red-500/10 text-red-500 border-red-500/50' : 'bg-[#0a0a0a] border-white/5 text-zinc-600'}`}>
                    {v === 'n/a' ? 'N/A' : v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1.5 md:space-y-2">
            <label className="block text-[10px] md:text-xs font-black uppercase tracking-widest text-zinc-400">Problembeschreibung</label>
            <textarea required rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Was ist der Mangel?" className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl md:rounded-2xl px-4 md:px-5 py-3 md:py-4 focus:outline-none focus:border-red-500/50 transition-all text-[13px] md:text-sm resize-none shadow-xl" />
          </div>
          <div className="space-y-1.5 md:space-y-2">
            <label className="block text-[10px] md:text-xs font-black uppercase tracking-widest text-zinc-400">Massnahmen</label>
            <textarea required rows={3} value={formData.measures} onChange={(e) => setFormData({...formData, measures: e.target.value})} placeholder="Was muss getan werden?" className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl md:rounded-2xl px-4 md:px-5 py-3 md:py-4 focus:outline-none focus:border-red-500/50 transition-all text-[13px] md:text-sm resize-none shadow-xl" />
          </div>

          <motion.button disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`w-full py-3.5 md:py-5 rounded-full font-black uppercase tracking-widest md:tracking-[3px] flex items-center justify-center gap-2 md:gap-3 cursor-pointer ${loading ? 'bg-zinc-800 text-zinc-500' : 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-xl'}`}>
            {loading ? <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><span className="text-[10px] md:text-xs">Speichern</span><Save className="w-4 h-4 md:w-4.5 md:h-4.5" /></>}
          </motion.button>
        </form>
      </main>
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>
    </div>
  );
}

export default function AddIssuePage() {
  return <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center"><div className="w-12 h-12 rounded-full border-t-2 border-red-600 animate-spin"></div></div>}><AddIssueForm /></Suspense>;
}