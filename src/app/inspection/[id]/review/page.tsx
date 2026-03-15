'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import ReviewHeader from './components/ReviewHeader';
import ReviewFloorPlan from './components/ReviewFloorPlan';
import ReviewIssuesList from './components/ReviewIssuesList';
import ReviewActionBar from './components/ReviewActionBar';
import { Plus } from 'lucide-react';
import Link from 'next/link';

function ReviewContent() {
  const params = useParams();
  const [inspection, setInspection] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/inspections/${params.id}`)
      .then(res => res.json())
      .then(data => { setInspection(data); setLoading(false); });
  }, [params.id]);

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><div className="w-12 h-12 rounded-full border-t-2 border-red-600 animate-spin"></div></div>;
  if (!inspection) return <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">Error: Inspection not found</div>;

  return (
    <div className="min-h-screen bg-zinc-100 py-6 md:py-12 px-2 sm:px-4 pb-40">
      <div 
        id="pdf-content" 
        className="w-[794px] mx-auto bg-white shadow-2xl p-10 font-sans text-black printable-content"
      >
        {/* PAGE 1: COVER PAGE */}
        <div className="border-b-4 border-zinc-100 pb-12 mb-12">
          <ReviewHeader inspection={inspection} />
        </div>

        {/* PAGE 2+: CONTENT */}
        <div className="space-y-12">
          {inspection.floorPlanUrl ? (
            <ReviewFloorPlan floorPlanUrl={inspection.floorPlanUrl} issues={inspection.issues || []} />
          ) : (
            <div className="mb-12 p-10 bg-zinc-50 rounded-3xl border border-zinc-100 flex flex-col items-center justify-center gap-6">
              <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-600">
                <Plus size={32} />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-black uppercase tracking-tight text-zinc-900">Kein Grundriss vorhanden</h3>
              </div>
            </div>
          )}

          {/* Hinweis Section (General Notes) */}
          {inspection.generalNotes && inspection.generalNotes.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-red-600"></span>
                Hinweis
              </h2>
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 space-y-3">
                {inspection.generalNotes.map((note: string, idx: number) => (
                  <div key={idx} className="flex gap-3">
                    <span className="text-red-600 font-black">•</span>
                    <p className="text-sm text-zinc-700 font-medium leading-relaxed">{note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Priority Legend */}
          <div className="mb-12">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-red-600"></span>
              Prioritätenlegende
            </h2>
            <div className="flex flex-wrap gap-4">
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 w-[calc(50%-8px)]">
                <span className="block text-[8px] font-black text-red-600 uppercase mb-1">Stufe 1</span>
                <p className="text-[10px] font-bold text-zinc-900">Sofortmassnahmen</p>
              </div>
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 w-[calc(50%-8px)]">
                <span className="block text-[8px] font-black text-orange-600 uppercase mb-1">Stufe 2</span>
                <p className="text-[10px] font-bold text-zinc-900">Kurzfristige Massnahmen (3 – 6 Monate)</p>
              </div>
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 w-[calc(50%-8px)]">
                <span className="block text-[8px] font-black text-green-600 uppercase mb-1">Stufe 3</span>
                <p className="text-[10px] font-bold text-zinc-900">Mittelfristige Massnahmen (12 – 24 Monate)</p>
              </div>
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 w-[calc(50%-8px)]">
                <span className="block text-[8px] font-black text-zinc-400 uppercase mb-1">Stufe 4</span>
                <p className="text-[10px] font-bold text-zinc-900">Langfristige Massnahmen (2 – 5 Jahre)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-12 border-t border-zinc-100">
          <ReviewIssuesList issues={inspection.issues || []} />
        </div>
      </div>

      <ReviewActionBar inspection={inspection} />
    </div>
  );
}

export default function ReviewPage() {
  return <Suspense><ReviewContent /></Suspense>;
}