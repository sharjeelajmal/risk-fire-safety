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
  priority: '1' | '2' | '3';
  images: string[];
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
    <div className="space-y-12">
      <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-8 flex items-center gap-3">
        <span className="w-8 h-[2px] bg-red-600"></span>
        Detaillierte Mängelliste
      </h2>

      {issues.length === 0 ? (
        <div className="p-12 border-2 border-dashed border-zinc-100 rounded-3xl text-center">
          <p className="text-zinc-400 font-bold uppercase tracking-widest">Keine Mängel erfasst.</p>
        </div>
      ) : (
        issues.map((issue) => (
          <div key={issue.issueNumber} style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }} className="border-l-4 border-red-600 pl-8 py-2 mb-8 relative group/card">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-4xl font-black text-zinc-200 block mb-1">#{issue.issueNumber}</span>
                <h3 className="text-xl font-black uppercase tracking-tight text-zinc-900">{issue.location}</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 mr-4 transition-all">
                  <button 
                    onClick={() => router.push(`/inspection/${params.id}/edit-issue/${issue._id}`)}
                    className="p-2 rounded-xl bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-all border border-zinc-200 cursor-pointer flex items-center gap-2"
                    title="Bearbeiten"
                  >
                    <Pencil size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Edit</span>
                  </button>
                   <button 
                    onClick={() => issue._id && handleDeleteTrigger(issue._id)}
                    className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all border border-red-100 cursor-pointer flex items-center gap-2"
                    title="Löschen"
                  >
                    <Trash2 size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Delete</span>
                  </button>
                </div>
                <div className={`px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest ${
                  issue.priority === '3' ? 'bg-red-100 text-red-600' : 
                  issue.priority === '2' ? 'bg-orange-100 text-orange-600' : 
                  'bg-green-100 text-green-600'
                }`}>
                  Priorität {issue.priority}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Problembeschreibung</label>
                  <p className="text-sm text-zinc-600 leading-relaxed font-medium">{issue.description}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Massnahmen</label>
                  <p className="text-sm text-zinc-600 leading-relaxed font-medium italic">{issue.measures}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Verantwortlicher Unternehmer</label>
                  <p className="text-sm font-black text-zinc-900 uppercase tracking-wide">{issue.responsibleContractor}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {issue.images?.map((url, i) => (
                  <div key={i} className="w-[calc(50%-6px)] aspect-square rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200">
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
            
            <div className="h-[1px] w-full bg-zinc-100 mt-12"></div>
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
