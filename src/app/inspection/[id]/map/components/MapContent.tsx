import { TransformComponent } from 'react-zoom-pan-pinch';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { RefObject } from 'react';

interface Issue {
  _id: string;
  x: number;
  y: number;
  floorPlanId: string;
}

interface MapContentProps {
  mapRef: RefObject<HTMLDivElement | null>;
  floorPlanUrl: string;
  issues: Issue[];
  imageError: boolean;
  setImageError: (error: boolean) => void;
  onMapClick: (x: number, y: number) => void;
}

export default function MapContent({
  mapRef,
  floorPlanUrl,
  issues,
  imageError,
  setImageError,
  onMapClick,
}: MapContentProps) {
  const handleMapClick = (e: React.MouseEvent) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    onMapClick(x, y);
  };

  return (
    <main className="lg:pl-24 flex-1 w-full min-h-0 relative z-10 bg-[#050505] touch-none flex flex-col overflow-hidden">
      <TransformComponent
        wrapperClass="!w-full !h-full !flex-1"
        contentClass="min-h-full min-w-full flex items-center justify-center"
      >
        <div 
          ref={mapRef}
          onClick={handleMapClick}
          className="relative cursor-crosshair group shadow-[0_0_100px_rgba(0,0,0,0.8)] rounded-lg md:rounded-2xl border border-white/5 bg-zinc-900/40 select-none"
        >
          {imageError ? (
            <div className="w-[300px] h-[300px] md:w-[800px] md:h-[600px] flex items-center justify-center text-gray-500 font-bold uppercase tracking-widest text-center p-6 text-xs md:text-sm">
               Grundriss-Fehler<br/>URL prüfen
            </div>
          ) : (
            <img 
              src={floorPlanUrl} 
              alt="Floor Plan" 
              draggable={false}
              className="block w-auto h-auto max-w-[95vw] max-h-[70vh] md:max-h-[80vh] object-contain select-none pointer-events-none transition-shadow"
              onError={() => setImageError(true)}
            />
          )}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] opacity-50 transition-opacity"></div>

          {(issues || []).map((issue, index) => (
            <motion.div
              key={issue._id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="absolute w-8 h-8 md:w-10 md:h-10 -ml-4 -mt-8 md:-ml-5 md:-mt-10 flex items-center justify-center z-20 pointer-events-none"
              style={{ left: `${issue.x}%`, top: `${issue.y}%` }}
            >
              <div className="relative group/pin pointer-events-auto cursor-pointer">
                <motion.div 
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-red-500 drop-shadow-[0_0_100px_rgba(239,68,68,0.5)]"
                >
                  <MapPin size={24} className="md:w-8 md:h-8" fill="currentColor" />
                </motion.div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-0.5 text-[8px] md:text-[10px] font-black text-white">
                  {index + 1}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </TransformComponent>
    </main>
  );
}
