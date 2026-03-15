'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Save, ChevronLeft, Trash2 } from 'lucide-react';
import Navbar from '@/components/navigation/Navbar';
import ImageUploader from '../../add-issue/components/ImageUploader';
import CustomSelect from '../../add-issue/components/CustomSelect';

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

  const [formData, setFormData] = useState({
    location: '',
    responsibleContractor: '',
    description: '',
    measures: '',
    priority: '1',
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
              location: issue.location,
              responsibleContractor: issue.responsibleContractor,
              description: issue.description,
              measures: issue.measures,
              priority: issue.priority,
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

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setNewImages(prev => [...prev, ...selectedFiles]);
      setNewPreviews(prev => [...prev, ...selectedFiles.map(file => URL.createObjectURL(file))]);
    }
  };

  const removeExistingImage = (url: string) => {
    setExistingImages(prev => prev.filter(img => img !== url));
  };

  const removeNewImage = (i: number) => {
    setNewImages(prev => prev.filter((_, idx) => idx !== i));
    setNewPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        body: JSON.stringify({ ...formData, images: uploadedUrls }),
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
    <div className="min-h-screen bg-[#050505] text-white flex flex-col pt-20 pb-32 lg:pb-12">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6">
        <div className="mb-12">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-6 group cursor-pointer"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">Zurück</span>
          </button>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2 uppercase">Mangel bearbeiten</h1>
          <p className="text-zinc-500 font-medium italic">Aktualisieren Sie die Details zu diesem Mangel.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
          {/* Image Section */}
          <div className="space-y-4">
            <label className="block text-xs font-black uppercase tracking-widest text-zinc-400">Bilder</label>
            
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {existingImages.map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group">
                    <img src={url} className="w-full h-full object-cover" alt="Existing" />
                    <button 
                      type="button"
                      onClick={() => removeExistingImage(url)}
                      className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 size={14} />
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
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-widest text-zinc-400">Standortbereich</label>
              <input 
                required 
                type="text" 
                value={formData.location} 
                onChange={(e) => setFormData({...formData, location: e.target.value})} 
                placeholder="z.B. Flur 1. OG" 
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-red-500/50 transition-all text-sm shadow-xl" 
              />
            </div>
            <CustomSelect 
              label="Unternehmer" 
              options={CONTRACTOR_OPTIONS} 
              value={formData.responsibleContractor} 
              onChange={(val) => setFormData({...formData, responsibleContractor: val})} 
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-widest text-zinc-400">Mängel / Beschreibung</label>
            <textarea 
              required 
              rows={4} 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
              placeholder="Was ist der Mangel?" 
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-red-500/50 transition-all text-sm resize-none shadow-xl" 
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-widest text-zinc-400">Massnahmen</label>
            <textarea 
              required 
              rows={3} 
              value={formData.measures} 
              onChange={(e) => setFormData({...formData, measures: e.target.value})} 
              placeholder="Was muss getan werden?" 
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-red-500/50 transition-all text-sm resize-none shadow-xl" 
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-widest text-zinc-400">Priorität</label>
            <div className="flex flex-wrap gap-4">
              {['1', '2', '3', 'n/a'].map(v => (
                <button 
                  key={v} 
                  type="button" 
                  onClick={() => setFormData({...formData, priority: v as any})} 
                  className={`flex-1 min-w-[80px] py-4 rounded-2xl border-2 transition-all font-black text-xs ${formData.priority === v ? 'bg-red-500/10 text-red-500 border-red-500/50 scale-105' : 'bg-transparent border-white/5 text-zinc-600'}`}
                >
                  {v === 'n/a' ? 'N/A' : `STUFE ${v}`}
                </button>
              ))}
            </div>
          </div>

          <motion.button 
            disabled={loading} 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            className={`w-full py-5 rounded-full font-black uppercase tracking-[3px] flex items-center justify-center gap-3 cursor-pointer ${loading ? 'bg-zinc-800 text-zinc-500' : 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-xl'}`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <><span className="text-xs">Aktualisieren</span><Save size={18} /></>
            )}
          </motion.button>
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
