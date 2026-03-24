'use client';

import { useState, useEffect } from 'react';
interface ReviewHeaderProps {
  inspection: {
    datum: string | Date;
    auftraggeber: string;
    teilnehmer: string;
    documentType: string;
    participantsList: { name: string; role: string }[];
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
    <div className="avoid-page-break border-b-2 md:border-b-4 border-red-600 pb-6 md:pb-8 mb-6 md:mb-12 flex flex-col md:flex-row justify-between items-start gap-4 md:gap-0">
      <div className="space-y-4 w-full md:w-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter text-black break-words">
            {inspection.documentType === 'Catalog of measures' ? 'Massnahmenkatalog' : 'QS Protokoll'}
          </h1>
          <img 
            src="/blacklogo.jpeg" 
            alt="Logo" 
            className="w-[150px] h-[54px] object-contain"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 pt-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400">Datum</label>
            <p className="text-sm font-bold text-zinc-900">{formattedDate}</p>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400">Auftraggeber</label>
            <p className="text-sm font-bold text-zinc-900 break-words">{inspection.auftraggeber}</p>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Teilnehmer</label>
            <div className="space-y-1">
              {Array.isArray(inspection.participantsList) && inspection.participantsList.length > 0 ? (
                inspection.participantsList.map((p, i) => (
                  <p key={i} className="text-sm font-bold text-zinc-900 break-words">
                    {p.name} {p.role && p.role.trim() !== '' ? <span className="text-zinc-400 font-medium text-xs ml-1">— {p.role.trim()}</span> : null}
                  </p>
                ))
              ) : typeof (inspection as any).participants === 'string' && (inspection as any).participants ? (
                <p className="text-sm font-bold text-zinc-900 break-words">{(inspection as any).participants}</p>
              ) : (
                <p className="text-sm font-bold text-zinc-900">-</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400">Erstellt von</label>
            <p className="text-sm font-bold text-zinc-900 break-words">Robin Furrer</p>
          </div>
        </div>
      </div>

      <div className="w-full md:w-auto flex md:block justify-start">
        <div className="bg-black text-white px-4 py-3 rounded-xl inline-block min-w-[120px] shadow-lg">
          <span className="block text-[9px] font-black tracking-widest uppercase opacity-50">Bericht Nr.</span>
          <span className="text-sm md:text-base font-black">#{reportNumber}</span>
        </div>
      </div>
    </div>
  );
}
