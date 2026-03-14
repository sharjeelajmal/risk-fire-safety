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
  { label: 'Elektro Schneider GmbH', value: 'Elektro Schneider GmbH' },
  { label: 'Trockenbau Meister', value: 'Trockenbau Meister' },
  { label: 'Sanitär Müller & Söhne', value: 'Sanitär Müller & Söhne' },
  { label: 'Bauleitung', value: 'Bauleitung' },
  { label: 'Externer Prüfer', value: 'Externer Prüfer' },
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
        body: JSON.stringify({ ...formData, x: parseFloat(searchParams.get('x') || '0'), y: parseFloat(searchParams.get('y') || '0'), images: uploadedUrls }),
      });
      if (result.ok) router.push(`/inspection/${params.id}/map`);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col pt-20 pb-32 lg:pb-12">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6">
        <FormHeader x={searchParams.get('x')} y={searchParams.get('y')} />
        <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
          <ImageUploader previews={previews} onAddImages={handleImageChange} onRemoveImage={removeImage} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-widest text-zinc-400">Standortbereich</label>
              <input required type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="z.B. Flur 1. OG" className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-red-500/50 transition-all text-sm shadow-xl" />
            </div>
            <CustomSelect label="Unternehmer" options={CONTRACTOR_OPTIONS} value={formData.responsibleContractor} onChange={(val) => setFormData({...formData, responsibleContractor: val})} required />
          </div>
          <div className="space-y-2"><label className="block text-xs font-black uppercase tracking-widest text-zinc-400">Mängel / Beschreibung</label>
            <textarea required rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Was ist der Mangel?" className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-red-500/50 transition-all text-sm resize-none shadow-xl" />
          </div>
          <div className="space-y-2"><label className="block text-xs font-black uppercase tracking-widest text-zinc-400">Sofortmaßnahmen</label>
            <textarea required rows={3} value={formData.measures} onChange={(e) => setFormData({...formData, measures: e.target.value})} placeholder="Was muss getan werden?" className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-red-500/50 transition-all text-sm resize-none shadow-xl" />
          </div>
          <div className="space-y-2"><label className="block text-xs font-black uppercase tracking-widest text-zinc-400">Priorität</label>
            <div className="flex gap-4">
              {['1', '2', '3'].map(v => (
                <button key={v} type="button" onClick={() => setFormData({...formData, priority: v as any})} className={`flex-1 py-4 rounded-2xl border-2 transition-all font-black text-xs ${formData.priority === v ? 'bg-red-500/10 text-red-500 border-red-500/50 scale-105' : 'bg-transparent border-white/5 text-zinc-600'}`}>STUFE {v}</button>
              ))}
            </div>
          </div>
          <motion.button disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`w-full py-5 rounded-full font-black uppercase tracking-[3px] flex items-center justify-center gap-3 cursor-pointer ${loading ? 'bg-zinc-800 text-zinc-500' : 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-xl'}`}>
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><span className="text-xs">Speichern</span><Save size={18} /></>}
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