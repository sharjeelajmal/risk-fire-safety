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
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchInspection();
  }, [params.id]);

  const handleMapClick = (x: number, y: number) => {
    router.push(`/inspection/${params.id}/add-issue?x=${x.toFixed(2)}&y=${y.toFixed(2)}`);
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
        <MapHeader title={data.ort} />
        
        <MapContent 
          mapRef={mapRef}
          floorPlanUrl={data.floorPlanUrl}
          issues={data.issues}
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