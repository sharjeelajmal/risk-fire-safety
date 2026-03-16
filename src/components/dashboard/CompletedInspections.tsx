import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCheck, Calendar, MapPin, Download, Eye, User, Loader2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import DeleteConfirmModal from '../modals/DeleteConfirmModal';

interface CompletedInspectionsProps {
  searchQuery: string;
}

export default function CompletedInspections({ searchQuery }: CompletedInspectionsProps) {
  const [completed, setCompleted] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCompleted = async () => {
    try {
      const res = await fetch('/api/inspections');
      if (res.ok) {
        const data = await res.json();
        const filtered = data.filter((ins: any) => ins.status === 'Completed');
        setCompleted(filtered);
      }
    } catch (err) {
      console.error('Error fetching completed inspections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompleted();
  }, []);

  const handleDeleteTrigger = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/inspections/${itemToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchCompleted();
        setIsDeleteModalOpen(false);
      } else {
        alert('Fehler beim Löschen der Inspektion');
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  // Filter based on search query
  const filteredCompleted = completed.filter(report => {
    const query = searchQuery.toLowerCase();
    const ort = report.ort?.toLowerCase() || '';
    const kunde = report.auftraggeber?.toLowerCase() || '';
    const date = new Date(report.datum).toLocaleDateString('de-DE').toLowerCase();
    return ort.includes(query) || kunde.includes(query) || date.includes(query);
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredCompleted.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCompleted = filteredCompleted.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-zinc-500 gap-4">
        <Loader2 className="animate-spin text-green-500" size={32} />
        <p className="text-xs font-black uppercase tracking-widest animate-pulse">Lade Berichte...</p>
      </div>
    );
  }

  return (
    <section className="relative">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-[20px] bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20 shadow-lg shadow-green-500/5">
            <FileCheck className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">Berichte</h2>
            <p className="text-zinc-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">{completed.length} Abgeschlossen</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 md:space-y-4 mb-8 md:mb-10">
        <AnimatePresence mode="popLayout">
          {currentCompleted.map((report, idx) => (
            <motion.div
              key={report._id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-premium relative p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 hover:bg-white/[0.03] transition-all border border-white/5 active:scale-[0.99]"
            >
              <div className="flex items-center gap-4 md:gap-6 flex-1 w-full">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-[24px] bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 shadow-xl shadow-green-500/5">
                  <FileCheck className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 md:gap-x-12 gap-y-2 md:gap-y-4 flex-1">
                  <div className="space-y-0.5 md:space-y-1">
                    <p className="text-[9px] md:text-[10px] text-zinc-500 uppercase font-black tracking-widest">Standort</p>
                    <p className="text-zinc-100 font-black uppercase text-xs md:text-sm tracking-tight line-clamp-1">{report.ort}</p>
                  </div>
                  <div className="space-y-0.5 md:space-y-1">
                    <p className="text-[9px] md:text-[10px] text-zinc-500 uppercase font-black tracking-widest">Kunde</p>
                    <div className="flex items-center gap-1.5 md:gap-2 text-zinc-300 font-bold text-xs md:text-sm line-clamp-1">
                      <User className="text-green-500 w-3 h-3 md:w-3.5 md:h-3.5" />
                      {report.auftraggeber}
                    </div>
                  </div>
                  <div className="space-y-0.5 md:space-y-1">
                    <p className="text-[9px] md:text-[10px] text-zinc-500 uppercase font-black tracking-widest">Datum</p>
                    <div className="flex items-center gap-1.5 md:gap-2 text-zinc-500 font-black uppercase text-[9px] md:text-[10px] tracking-widest">
                      <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5" />
                      {new Date(report.datum).toLocaleDateString('de-DE')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
                <Link href={`/inspection/${report._id}/review`} className="flex-1 md:flex-none">
                  <button className="w-full flex items-center justify-center gap-2 px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 text-white font-black uppercase text-[9px] md:text-[10px] tracking-widest transition-all cursor-pointer shadow-xl">
                    <Eye className="w-4 h-4 md:w-4.5 md:h-4.5" />
                    Anzeigen
                  </button>
                </Link>
                <div className="flex-1 md:flex-none flex gap-2 md:gap-3">
                  <Link href={`/inspection/${report._id}/review`} className="flex-1">
                    <button className="w-full h-full flex items-center justify-center gap-2 px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl bg-green-500/10 border border-green-500/20 hover:bg-green-500 text-green-500 hover:text-black font-black uppercase text-[9px] md:text-[10px] tracking-widest transition-all cursor-pointer shadow-xl">
                      <Download className="w-4 h-4 md:w-4.5 md:h-4.5" />
                    </button>
                  </Link>
                  <button 
                    onClick={(e) => handleDeleteTrigger(report._id, e)}
                    className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer shadow-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4 md:w-4.5 md:h-4.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredCompleted.length === 0 && (
          <div className="py-20 text-center glass-premium rounded-[40px] border-dashed border-white/10">
            <p className="text-zinc-600 font-black uppercase tracking-[0.2em] text-xs">Keine Berichte gefunden</p>
          </div>
        )}
      </div>

      {/* Pagination UI */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pb-12">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-12 h-12 rounded-2xl font-black transition-all cursor-pointer ${currentPage === i + 1 ? 'bg-green-500 text-black shadow-lg shadow-green-500/20' : 'bg-white/5 border border-white/10 text-zinc-500 hover:bg-white/10'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all cursor-pointer"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Custom Delete Modal */}
      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Inspektion löschen"
        message="Sind Sie sicher, dass Sie diese Inspektion dauerhaft löschen möchten? Dieser Vorgang kann nicht rückgängig gemacht werden."
        loading={isDeleting}
      />
    </section>
  );
}
