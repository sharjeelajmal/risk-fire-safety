'use client';

import { useState } from 'react';
import { ChevronLeft, FileDown, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { InspectionPDF } from '@/components/InspectionPDF';

interface ReviewActionBarProps {
  inspection: any;
}

export default function ReviewActionBar({ inspection }: ReviewActionBarProps) {
  const router = useRouter();

  const [downloading, setDownloading] = useState(false);
  const fileName = `Inspektionsbericht_${(inspection.ort || 'Bericht').replace(/\s+/g, '_')}.pdf`;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Dynamic imports to save bundle size and prevent eager rendering lag
      const { pdf } = await import('@react-pdf/renderer');
      const { InspectionPDF: PDFDoc } = await import('@/components/InspectionPDF');
      
      const blob = await pdf(<PDFDoc data={inspection} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('PDF-Export fehlgeschlagen. Bitte versuchen Sie es erneut.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-3 md:px-4 pointer-events-none">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl md:rounded-3xl p-3 md:p-4 flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 shadow-[0_20px_80px_rgba(0,0,0,0.9)] pointer-events-auto w-full">
        <button 
          onClick={() => router.back()}
          className="flex items-center justify-center gap-1.5 md:gap-2 text-zinc-400 hover:text-white transition-colors px-3 md:px-4 py-2 group cursor-pointer w-full sm:w-auto"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Zurück</span>
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-4 w-full sm:w-auto">
          <button
            onClick={() => router.push(`/inspection/${inspection._id}/edit-details`)}
            className="flex items-center justify-center gap-1.5 md:gap-2 text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all px-3 md:px-4 py-3 md:py-2 rounded-xl md:rounded-2xl group cursor-pointer w-full sm:w-auto"
          >
            <Pencil className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-400 group-hover:text-red-300 transition-colors" />
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Details bearbeiten</span>
          </button>

          <button
            onClick={() => router.push(`/inspection/${inspection._id}/map`)}
            className="flex items-center justify-center gap-1.5 md:gap-2 text-zinc-400 hover:text-white bg-white/5 sm:bg-transparent border border-white/5 hover:border-white/20 px-3 md:px-4 py-3 md:py-2 rounded-xl md:rounded-2xl group cursor-pointer w-full sm:w-auto transition-all"
          >
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">+ Mangel hinzufügen</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center justify-center gap-2 md:gap-3 bg-gradient-to-r from-red-600 to-red-800 text-white px-4 md:px-8 py-3.5 md:py-3 rounded-xl md:rounded-2xl font-black uppercase tracking-widest md:tracking-[2px] shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer w-full sm:w-auto disabled:opacity-50"
          >
            {downloading ? (
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="text-[9px] md:text-xs">Export...</span>
              </div>
            ) : (
              <>
                <span className="text-[9px] md:text-xs">Download</span>
                <FileDown className="w-4 h-4 md:w-[18px] md:h-[18px]" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
