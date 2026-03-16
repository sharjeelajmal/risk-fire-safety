'use client';

import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import DeleteConfirmModal from '@/components/modals/DeleteConfirmModal';

interface Issue {
  _id?: string;
  issueNumber: number;
  location: string;
  responsibleContractor: string;
  description: string;
  measures: string;
  priority: '1' | '2' | '3' | 'n/a';
  images: string[];
  status: 'Open' | 'Completed' | 'Documentation' | 'n/a';
}

export default function ReviewIssuesList({ issues }: { issues: Issue[] }) {
  const router = useRouter();
  const params = useParams();

  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [issueToDelete, setIssueToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteTrigger = (issueId: string) => {
    setIssueToDelete(issueId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!issueToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/inspections/${params.id}/issues/${issueToDelete}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        window.location.reload();
      } else {
        alert('Fehler beim Löschen des Mangels.');
      }
    } catch (err) {
      console.error(err);
      alert('Ein Fehler ist aufgetreten.');
    } finally {
      setIsDeleting(false);
      setIssueToDelete(null);
    }
  };

  return (
    <div className="space-y-8 md:space-y-12">
      <h2 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 md:mb-8 flex items-center gap-2 md:gap-3">
        <span className="w-6 md:w-8 h-[2px] bg-red-600"></span>
        Detaillierte Mängelliste
      </h2>

      {issues.length === 0 ? (
        <div className="p-8 md:p-12 border-2 border-dashed border-zinc-100 rounded-2xl md:rounded-3xl text-center">
          <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Keine Mängel erfasst.</p>
        </div>
      ) : (
        issues.map((issue) => (
          <div key={issue.issueNumber} style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }} className="border-l-2 md:border-l-4 border-red-600 pl-4 md:pl-8 py-1 md:py-2 mb-6 md:mb-8 relative group/card">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4 md:mb-6">
              <div>
                <span className="text-2xl md:text-4xl font-black text-zinc-200 block md:mb-1">#{issue.issueNumber}</span>
                <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-zinc-900">{issue.location}</h3>
              </div>
              <div className="flex flex-wrap items-center gap-2 md:gap-4">
                <div className="flex items-center gap-2 transition-all">
                  <button 
                    onClick={() => router.push(`/inspection/${params.id}/edit-issue/${issue._id}`)}
                    className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-all border border-zinc-200 cursor-pointer flex items-center gap-2"
                    title="Bearbeiten"
                  >
                    <Pencil className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest hidden sm:inline">Edit</span>
                  </button>
                   <button 
                    onClick={() => issue._id && handleDeleteTrigger(issue._id)}
                    className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all border border-red-100 cursor-pointer flex items-center gap-2"
                    title="Löschen"
                  >
                    <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest hidden sm:inline">Delete</span>
                  </button>
                </div>
                <div className={`px-2.5 md:px-4 py-1 md:py-2 rounded-full font-black text-[8px] md:text-[10px] uppercase tracking-widest ${
                  issue.priority === '3' ? 'bg-red-100 text-red-600' : 
                  issue.priority === '2' ? 'bg-orange-100 text-orange-600' : 
                  issue.priority === '1' ? 'bg-green-100 text-green-600' :
                  'bg-zinc-100 text-zinc-600'
                }`}>
                  P{issue.priority}
                </div>
                <div className="px-2.5 md:px-4 py-1 md:py-2 rounded-full font-black text-[8px] md:text-[10px] uppercase tracking-widest bg-zinc-900 text-white shadow-lg">
                  {issue.status || 'Open'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mb-6 md:mb-8">
              <div className="space-y-4 md:space-y-6">
                <div>
                  <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-0.5 md:mb-1">Problembeschreibung</label>
                  <p className="text-xs md:text-sm text-zinc-600 leading-relaxed font-medium">{issue.description}</p>
                </div>
                <div>
                  <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-0.5 md:mb-1">Massnahmen</label>
                  <p className="text-xs md:text-sm text-zinc-600 leading-relaxed font-medium italic">{issue.measures}</p>
                </div>
                <div>
                  <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-0.5 md:mb-1">Verantwortlichkeit</label>
                  <p className="text-[10px] md:text-sm font-black text-zinc-900 uppercase tracking-wide">{issue.responsibleContractor}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 md:gap-3">
                {issue.images?.map((url, i) => (
                  <div key={i} className="w-full sm:w-[calc(50%-6px)] aspect-square rounded-xl md:rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200">
                    <img 
                      src={url} 
                      alt={`Issue ${issue.issueNumber} photo ${i+1}`} 
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="h-[1px] w-full bg-zinc-100 mt-6 md:mt-12"></div>
          </div>
        ))
      )}

      {/* Custom Delete Modal */}
      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Mangel löschen"
        message="Sind Sie sicher, dass Sie diesen Mangel dauerhaft löschen möchten? Dieser Vorgang kann nicht rückgängig gemacht werden."
        loading={isDeleting}
      />
    </div>
  );
}
