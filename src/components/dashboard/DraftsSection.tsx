import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, Calendar, MapPin, ArrowRight, Loader2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import DeleteConfirmModal from '../modals/DeleteConfirmModal';

interface DraftsSectionProps {
  searchQuery: string;
}

export default function DraftsSection({ searchQuery }: DraftsSectionProps) {
  const [drafts, setDrafts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDrafts = async () => {
    try {
      const res = await fetch('/api/inspections');
      if (res.ok) {
        const data = await res.json();
        const filtered = data.filter((ins: any) => 
          ins.status === 'Draft' || ins.status === 'In Progress'
        );
        setDrafts(filtered);
      }
    } catch (err) {
      console.error('Error fetching drafts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
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
        await fetchDrafts();
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
  const filteredDrafts = drafts.filter(draft => {
    const query = searchQuery.toLowerCase();
    const ort = draft.ort?.toLowerCase() || '';
    const kunde = draft.auftraggeber?.toLowerCase() || '';
    const date = new Date(draft.datum).toLocaleDateString('de-DE').toLowerCase();
    return ort.includes(query) || kunde.includes(query) || date.includes(query);
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredDrafts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDrafts = filteredDrafts.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-zinc-500 gap-4">
        <Loader2 className="animate-spin text-amber-500" size={32} />
        <p className="text-xs font-black uppercase tracking-widest animate-pulse">Lade Entwürfe...</p>
      </div>
    );
  }

  return (
    <section className="mb-12 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-[20px] bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-lg shadow-amber-500/5">
            <ClipboardList size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">Kürzliche Entwürfe</h2>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{drafts.length} Unvollständig</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <AnimatePresence mode="popLayout">
          {currentDrafts.map((draft, idx) => (
            <motion.div
              key={draft._id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-premium p-6 rounded-[32px] hover:border-amber-500/30 transition-all group relative overflow-hidden"
            >
              <div className="card-shine opacity-30"></div>
              <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-zinc-100">
                      <MapPin size={14} className="text-amber-500" />
                      <span className="text-sm font-black uppercase tracking-tight">{draft.ort}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500">
                      <Calendar size={14} />
                      <span className="text-xs font-bold tracking-widest uppercase">{new Date(draft.datum).toLocaleDateString('de-DE')}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                      {draft.status}
                    </span>
                    <button 
                      onClick={(e) => handleDeleteTrigger(draft._id, e)}
                      className="p-2 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all cursor-pointer shadow-lg shadow-red-500/5 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <Link href={`/inspection/${draft._id}/review`}>
                  <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/5 group-hover:bg-amber-500 group-hover:border-amber-400 group-hover:text-black text-white font-black uppercase tracking-[2px] text-xs transition-all flex items-center justify-center gap-3 cursor-pointer shadow-xl">
                    Fortsetzen
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredDrafts.length === 0 && (
          <div className="col-span-full py-20 text-center glass-premium rounded-[40px] border-dashed border-white/10">
            <p className="text-zinc-600 font-black uppercase tracking-[0.2em] text-xs">Keine Entwürfe gefunden</p>
          </div>
        )}
      </div>

      {/* Pagination UI */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mb-12">
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
                className={`w-12 h-12 rounded-2xl font-black transition-all cursor-pointer ${currentPage === i + 1 ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-white/5 border border-white/10 text-zinc-500 hover:bg-white/10'}`}
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
