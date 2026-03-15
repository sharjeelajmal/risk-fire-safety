'use client';

import { useState, useEffect } from 'react';
interface ReviewHeaderProps {
  inspection: {
    ort: string;
    datum: string | Date;
    auftraggeber: string;
    teilnehmer: string;
    documentType: string;
    participants: string;
  };
}

export default function ReviewHeader({ inspection }: ReviewHeaderProps) {
  const [reportNumber, setReportNumber] = useState<string>('');

  useEffect(() => {
    setReportNumber(`#${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  }, []);

  const dateObj = new Date(inspection.datum);
  const formattedDate = dateObj.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div className="avoid-page-break border-b-4 border-red-600 pb-8 mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-start gap-6 md:gap-0">
      <div className="space-y-4 w-full md:w-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter text-black break-words">
            {inspection.documentType === 'Catalog of measures' ? 'Massnahmenkatalog' : 'QS Protokoll'}
          </h1>
          <p className="text-zinc-500 font-medium tracking-widest text-[10px] sm:text-xs mt-1">
            RISK FIRE SAFETY & SOLUTIONS
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 pt-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400">Standort / Projekt</label>
            <p className="text-sm font-bold text-zinc-900 break-words">{inspection.ort}</p>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400">Datum</label>
            <p className="text-sm font-bold text-zinc-900">{formattedDate}</p>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400">Auftraggeber</label>
            <p className="text-sm font-bold text-zinc-900 break-words">{inspection.auftraggeber}</p>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400">Teilnehmer</label>
            <p className="text-sm font-bold text-zinc-900 break-words">{inspection.participants || '-'}</p>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400">Erstellt von</label>
            <p className="text-sm font-bold text-zinc-900 break-words">Robin Furrer</p>
          </div>
        </div>
      </div>

      <div className="w-full md:w-auto flex md:block justify-start">
        <div className="bg-black text-white px-6 py-4 rounded-xl inline-block min-w-[140px] shadow-lg">
          <span className="block text-[10px] font-black tracking-widest uppercase opacity-50">Bericht Nr.</span>
          <span className="text-xl md:text-2xl font-black">#{reportNumber}</span>
        </div>
      </div>
    </div>
  );
}
