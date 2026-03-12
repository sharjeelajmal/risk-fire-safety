'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  MapPin, 
  LayoutDashboard, 
  FileCheck, 
  Loader2, 
  ZoomIn, 
  ZoomOut, 
  Maximize2 
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Issue {
  _id: string;
  x: number;
  y: number;
  description?: string;
}

interface InspectionData {
  _id: string;
  ort: string;
  floorPlanUrl: string;
  issues: Issue[];
}

export default function InteractiveMapPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<InspectionData | null>(null);
  const [imageError, setImageError] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchInspection = async () => {
      try {
        const res = await fetch(`/api/inspections/${params.id}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        } else {
          console.error('Failed to fetch inspection');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchInspection();
  }, [params.id]);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;

    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Redirect to add issue with coordinates
    router.push(`/inspection/${params.id}/add-issue?x=${x.toFixed(2)}&y=${y.toFixed(2)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6">
        <div className="bg-mesh-premium opacity-50"></div>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full border-t-2 border-red-600 border-r-2 border-transparent"
        ></motion.div>
        <p className="text-gray-500 font-black uppercase tracking-[4px] animate-pulse">Kaart Laden...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 text-red-500">Oeps! Inspectie Niet Gevonden</h2>
        <p className="text-gray-400 mb-8 font-bold">Het lijkt erop dat deze inspectie niet bestaat of is verwijderd.</p>
        <Link href="/dashboard">
          <button className="btn-premium px-10 py-5 rounded-2xl cursor-pointer">Terug naar Dashboard</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden">
      <div className="noise-overlay"></div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-24 glass-premium border-b border-white/5 z-50 px-8 flex items-center justify-between">
        <Link href="/dashboard">
          <motion.div 
            whileHover={{ x: -4 }}
            className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors cursor-pointer group"
          >
            <ChevronLeft size={24} className="group-hover:text-red-500" />
            <span className="font-bold text-sm uppercase tracking-widest">Dashboard</span>
          </motion.div>
        </Link>
        <div className="text-center">
            <h1 className="text-xl font-black uppercase tracking-[4px] text-white leading-none mb-1">{data.ort}</h1>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[2px]">Interactieve Kaart</p>
        </div>
        <div className="w-32 hidden md:block"></div>
      </header>

      {/* Map Content */}
      <main className="flex-1 mt-24 mb-32 flex items-center justify-center p-4 md:p-8 relative z-10 overflow-auto">
        <div className="max-w-7xl w-full h-full flex items-center justify-center">
            <div 
                ref={mapRef}
                onClick={handleMapClick}
                className="relative cursor-crosshair group shadow-[0_50px_100px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden border border-white/5"
            >
                {imageError ? (
                  <div className="bg-white/5 w-[800px] h-[600px] flex items-center justify-center text-gray-500 font-black uppercase tracking-widest text-center p-12">
                     Fout bij het laden van het bouwplan.<br/>Controleer de Cloudinary URL.
                  </div>
                ) : (
                  <img 
                    src={data.floorPlanUrl} 
                    alt="Floor Plan" 
                    className="max-w-full max-h-[75vh] object-contain select-none"
                    onError={() => setImageError(true)}
                  />
                )}

                {/* Grid Overlay (Subtle) */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] opacity-50 group-hover:opacity-100 transition-opacity"></div>

                {/* Existing Issue Pins */}
                {(data.issues || []).map((issue, index) => (
                    <motion.div
                        key={issue._id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="absolute w-10 h-10 -ml-5 -mt-10 flex items-center justify-center z-20 pointer-events-none"
                        style={{ left: `${issue.x}%`, top: `${issue.y}%` }}
                    >
                        <div className="relative group/pin pointer-events-auto cursor-pointer">
                            <motion.div 
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="text-red-600 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                            >
                                <MapPin size={32} fill="currentColor" />
                            </motion.div>
                            
                            {/* Simple tooltip or Number */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-0.5 text-[8px] font-black text-white">
                                {index + 1}
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Interaction Feedback Overlay */}
                <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/[0.02] transition-colors pointer-events-none"></div>
            </div>
        </div>
      </main>

      {/* Floating Action Hint */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-36 left-1/2 -translate-x-1/2 z-40 bg-white/10 backdrop-blur-3xl px-8 py-4 rounded-full border border-white/10 flex items-center gap-4 shadow-2xl pointer-events-none"
      >
        <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white animate-bounce">
            <LayoutDashboard size={16} />
        </div>
        <p className="text-xs font-black uppercase tracking-[2px] text-white">Tik ergens op de kaart om een issue toe te voegen</p>
      </motion.div>

      {/* Bottom Footer Action Bar */}
      <footer className="fixed bottom-0 left-0 right-0 h-32 glass-premium border-t border-white/5 z-50 flex items-center justify-between px-6 md:px-12">
        <Link href="/dashboard">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white px-8 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all border border-white/10 cursor-pointer"
          >
            <ChevronLeft size={18} />
            Dashboard
          </motion.button>
        </Link>

        <Link href={`/inspection/${params.id}/review`}>
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(239, 68, 68, 0.2)' }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-900 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all cursor-pointer shadow-xl"
          >
            Review & Afronden
            <FileCheck size={18} />
          </motion.button>
        </Link>
      </footer>

      {/* Map Tools (Optional Polish) */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-40">
          {[ZoomIn, ZoomOut, Maximize2].map((Icon, i) => (
            <motion.button 
                key={i}
                whileHover={{ scale: 1.1, x: -5 }}
                className="w-14 h-14 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:bg-red-600/20 transition-all cursor-pointer shadow-2xl"
            >
                <Icon size={20} />
            </motion.button>
          ))}
      </div>
    </div>
  );
}