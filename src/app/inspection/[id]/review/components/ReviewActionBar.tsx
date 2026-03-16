'use client';

import { ChevronLeft, FileDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { InspectionPDF } from '@/components/InspectionPDF';

interface ReviewActionBarProps {
  inspection: any;
}

export default function ReviewActionBar({ inspection }: ReviewActionBarProps) {
  const router = useRouter();

  if (!inspection) return null;

  const fileName = `Inspektionsbericht_${(inspection.ort || 'Bericht').replace(/\s+/g, '_')}.pdf`;

  return (
    <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-3 md:px-4 pointer-events-none">
      <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-3xl p-2 md:p-4 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-1.5 md:gap-2 text-zinc-400 hover:text-white transition-colors px-3 md:px-4 py-2 group cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Zurück</span>
        </button>

        <PDFDownloadLink
          document={<InspectionPDF data={inspection} />}
          fileName={fileName}
          className="flex items-center gap-2 md:gap-3 bg-gradient-to-r from-red-600 to-red-800 text-white px-4 md:px-8 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-black uppercase tracking-widest md:tracking-[2px] shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          {({ loading }) => (
            loading ? (
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="text-[9px] md:text-xs">Export...</span>
              </div>
            ) : (
              <>
                <span className="text-[9px] md:text-xs">Download</span>
                <FileDown className="w-4 h-4 md:w-[18px] md:h-[18px]" />
              </>
            )
          )}
        </PDFDownloadLink>
      </div>
    </div>
  );
}
