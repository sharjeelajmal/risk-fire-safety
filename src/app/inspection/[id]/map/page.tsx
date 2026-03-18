'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { TransformWrapper } from 'react-zoom-pan-pinch';
import Navbar from '@/components/navigation/Navbar';
import MapHeader from './components/MapHeader';
import MapFooter from './components/MapFooter';
import MapHint from './components/MapHint';
import MapTools from './components/MapTools';
import MapContent from './components/MapContent';

interface Issue {
  _id: string;
  x: number;
  y: number;
  issueNumber: string;
  floorPlanId: string;
}

interface FloorPlan {
  id: string;
  name: string;
  url: string;
}

interface InspectionData {
  _id: string;
  ort: string;
  auftraggeber: string;
  floorPlans: FloorPlan[];
  issues: Issue[];
}

export default function InteractiveMapPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<InspectionData | null>(null);
  const [activeFloorPlanId, setActiveFloorPlanId] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchInspection = async () => {
      try {
        const res = await fetch(`/api/inspections/${params.id}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
          // Set active floor plan if none is selected
          if (json.floorPlans && json.floorPlans.length > 0 && !activeFloorPlanId) {
            setActiveFloorPlanId(json.floorPlans[0].id);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchInspection();
  }, [params.id]);

  const activeFloorPlan = data?.floorPlans.find(fp => fp.id === activeFloorPlanId);
  const filteredIssues = data?.issues.filter(issue => issue.floorPlanId === activeFloorPlanId) || [];

  const handleMapClick = (x: number, y: number) => {
    router.push(`/inspection/${params.id}/add-issue?x=${x.toFixed(2)}&y=${y.toFixed(2)}&floorPlanId=${activeFloorPlanId}`);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-t-2 border-red-600 animate-spin"></div>
    </div>
  );

  if (!data) return <div className="p-20 text-center">Data not found</div>;

  return (
    <TransformWrapper
      initialScale={1}
      minScale={0.5}
      maxScale={10}
      centerOnInit
      limitToBounds={false}
      doubleClick={{ disabled: true }}
      wheel={{ step: 0.1, smoothStep: 0.01 }}
    >
      <div className="h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden">
        {/* Premium Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-mesh-premium opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-900/5 to-black/80"></div>
          <div className="absolute inset-0 noise-overlay opacity-[0.03]"></div>
        </div>
        
        <Navbar />
        
        <div className="relative z-[60]">
          <MapHeader title={data.auftraggeber} />
          
          {/* Floor Plan Selector */}
          {data.floorPlans.length > 1 && (
            <div className="absolute top-20 md:top-24 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2 bg-black/40 backdrop-blur-xl p-1 md:p-1.5 rounded-xl md:rounded-2xl border border-white/5 shadow-2xl">
              {data.floorPlans.map((fp) => (
                <button
                  key={fp.id}
                  onClick={() => setActiveFloorPlanId(fp.id)}
                  className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeFloorPlanId === fp.id
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'text-gray-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {fp.name}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <MapContent 
          mapRef={mapRef}
          floorPlanUrl={activeFloorPlan?.url || ''}
          issues={filteredIssues}
          imageError={imageError}
          setImageError={setImageError}
          onMapClick={handleMapClick}
        />

        <MapHint />
        <MapTools />
        <MapFooter inspectionId={params.id as string} />
      </div>
    </TransformWrapper>
  );
}