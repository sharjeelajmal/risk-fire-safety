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
    <div className="fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-3 md:px-4 pointer-events-none">
      <div className="bg-[#0a0a0a]/90 backdrop-blur-md border border-white/10 rounded-xl md:rounded-2xl p-2 flex flex-col sm:flex-row items-center justify-center gap-2 shadow-[0_20px_80px_rgba(0,0,0,0.9)] pointer-events-auto w-full">
        <button 
          onClick={() => router.back()}
          className="flex items-center justify-center gap-1.5 text-zinc-400 font-bold hover:text-white transition-colors px-3 py-1.5 group cursor-pointer w-full sm:w-auto h-9"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] uppercase tracking-widest">Zurück</span>
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => router.push(`/inspection/${inspection._id}/edit-details`)}
            className="flex items-center justify-center gap-1.5 text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all px-3 py-1.5 rounded-lg group cursor-pointer w-full sm:w-auto h-9"
          >
            <Pencil className="w-3.5 h-3.5 text-red-400 group-hover:text-red-300 transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-widest">Details bearbeiten</span>
          </button>

          <button
            onClick={() => router.push(`/inspection/${inspection._id}/map`)}
            className="flex items-center justify-center gap-1.5 text-zinc-400 hover:text-white bg-white/5 sm:bg-transparent border border-white/5 hover:border-white/20 px-3 py-1.5 rounded-lg group cursor-pointer w-full sm:w-auto transition-all h-9"
          >
            <span className="text-[10px] font-black uppercase tracking-widest">+ Mangel hinzufügen</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-800 text-white px-5 rounded-lg font-black uppercase tracking-widest shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer w-full sm:w-auto h-9 disabled:opacity-50"
          >
            {downloading ? (
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="text-[9px]">Export...</span>
              </div>
            ) : (
              <>
                <span className="text-[9px]">Download</span>
                <FileDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
