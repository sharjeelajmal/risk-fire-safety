'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import ReviewHeader from './components/ReviewHeader';
import ReviewFloorPlan from './components/ReviewFloorPlan';
import ReviewIssuesList from './components/ReviewIssuesList';
import ReviewActionBar from './components/ReviewActionBar';

function ReviewContent() {
  const params = useParams();
  const [inspection, setInspection] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetch(`/api/inspections/${params.id}`)
      .then(res => res.json())
      .then(data => { setInspection(data); setLoading(false); });
  }, [params.id]);

  const generatePDF = async () => {
    if (typeof window === 'undefined') return;
    
    const element = document.getElementById('pdf-content');
    if (!element) {
      alert('Content element not found');
      return;
    }

    setIsGenerating(true);
    
    try {
      console.log('Starting PDF generation...');
      // Small delay to ensure all images/styles are settled
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // @ts-ignore
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default || html2pdfModule;
      
      if (!html2pdf) {
        throw new Error('html2pdf library could not be loaded');
      }

      const fileName = `Inspektionsbericht_${inspection.ort.replace(/\s+/g, '_')}.pdf`;
      
      const opt = {
        margin: [10, 10, 10, 10],
        filename: fileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 1.5, 
          useCORS: true,
          logging: true,
          letterRendering: true, // Often helps when used with font-variant-ligatures: none
          windowWidth: 1200
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err: any) {
      console.error('PDF Generation Error:', err);
      alert(`Fehler beim Generieren der PDF: ${err.message || 'Unbekannter Fehler'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><div className="w-12 h-12 rounded-full border-t-2 border-red-600 animate-spin"></div></div>;
  if (!inspection) return <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">Error: Inspection not found</div>;

  return (
    <div className="min-h-screen bg-zinc-100 py-6 md:py-12 px-2 sm:px-4 pb-40">
      <div 
        id="pdf-content" 
        className="max-w-[210mm] mx-auto bg-white shadow-2xl overflow-hidden min-h-[297mm] p-6 sm:p-10 md:p-[20mm] font-sans text-zinc-900 printable-content"
      >
        <ReviewHeader inspection={inspection} />
        <ReviewFloorPlan floorPlanUrl={inspection.floorPlanUrl} issues={inspection.issues || []} />
        <ReviewIssuesList issues={inspection.issues || []} />
        
        <div className="mt-20 pt-8 border-t border-zinc-100 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 sm:gap-0">
          <div className="space-y-1">
            <p className="text-[8px] font-black uppercase tracking-widest text-zinc-300">Bericht generiert am</p>
            <p className="text-[10px] font-bold text-zinc-500">{new Date().toLocaleString('de-DE')}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs font-black uppercase tracking-widest text-zinc-900">Risk Fire Safety & Solutions</p>
            <p className="text-[10px] text-zinc-400">Handelend onder naam van RFS</p>
          </div>
        </div>
      </div>

      <ReviewActionBar onGeneratePDF={generatePDF} isGenerating={isGenerating} />
      
      <style jsx global>{`
        @media print {
          body { background: white !important; margin: 0; padding: 0; }
          .printable-content { box-shadow: none !important; margin: 0 !important; width: 100% !important; max-width: none !important; }
        }
        
        /* Ultimate Fix for html2canvas Range/Offset Errors */
        #pdf-content {
          color: #000000 !important;
          background-color: #ffffff !important;
          -webkit-print-color-adjust: exact;
          font-family: Arial, Helvetica, sans-serif !important;
          line-height: 1.2 !important;
          text-rendering: geometricPrecision !important;
        }
        
        #pdf-content *, 
        #pdf-content *:before, 
        #pdf-content *:after {
          box-shadow: none !important;
          text-shadow: none !important;
          ring: none !important;
          outline: none !important;
          backdrop-filter: none !important;
          letter-spacing: normal !important;
          text-transform: none !important; 
          transition: none !important;
          font-family: Arial, Helvetica, sans-serif !important;
          line-height: 1.2 !important;
          font-variant-ligatures: none !important; /* Fix for ligatures causing range errors */
          font-feature-settings: "liga" 0 !important;
        }

        /* Essential UI Colors (Hex only) */
        #pdf-content .text-red-600 { color: #dc2626 !important; }
        #pdf-content .bg-red-600 { background-color: #dc2626 !important; }
        #pdf-content .border-red-600 { border-color: #dc2626 !important; }
        #pdf-content .bg-red-100 { background-color: #fee2e2 !important; }
        
        #pdf-content .text-black { color: #000000 !important; }
        #pdf-content .bg-black { background-color: #000000 !important; }
        #pdf-content .text-white { color: #ffffff !important; }
        #pdf-content .bg-white { background-color: #ffffff !important; }
        
        #pdf-content .text-zinc-900 { color: #18181b !important; }
        #pdf-content .text-zinc-600 { color: #52525b !important; }
        #pdf-content .text-zinc-500 { color: #71717a !important; }
        #pdf-content .text-zinc-400 { color: #a1a1aa !important; }
        #pdf-content .text-zinc-300 { color: #d4d4d8 !important; }
        #pdf-content .text-zinc-200 { color: #e4e4e7 !important; }
        
        #pdf-content .bg-zinc-50 { background-color: #fafafa !important; }
        #pdf-content .bg-zinc-100 { background-color: #f4f4f5 !important; }
        #pdf-content .border-zinc-100 { border-color: #f4f4f5 !important; }
        #pdf-content .border-zinc-200 { border-color: #e4e4e7 !important; }
        
        #pdf-content .text-orange-600 { color: #ea580c !important; }
        #pdf-content .bg-orange-100 { background-color: #ffedd5 !important; }
        #pdf-content .text-green-600 { color: #16a34a !important; }
        #pdf-content .bg-green-100 { background-color: #dcfce7 !important; }
        
        .page-break-inside-avoid { page-break-inside: avoid; break-inside: avoid; }
      `}</style>
    </div>
  );
}

export default function ReviewPage() {
  return <Suspense><ReviewContent /></Suspense>;
}