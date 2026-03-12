'use client';

import { motion } from 'framer-motion';
import { ClipboardList, Calendar, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const mockDrafts = [
  { id: 1, location: 'Hotel Nufenen', date: '12 Maart 2026', status: 'Draft' },
  { id: 2, location: 'City Mall Center', date: '10 Maart 2026', status: 'In Progress' },
];

export default function DraftsSection() {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
            <ClipboardList size={20} />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Recent Drafts</h2>
        </div>
        <span className="text-[10px] font-black uppercase tracking-[3px] text-gray-500">{mockDrafts.length} Adhoori Reports</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockDrafts.map((draft, idx) => (
          <motion.div
            key={draft.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-premium p-6 rounded-[32px] hover:border-amber-500/30 transition-all group relative overflow-hidden"
          >
            <div className="card-shine opacity-30"></div>
            <div className="relative z-10 flex flex-col h-full justify-between gap-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin size={14} className="text-amber-500" />
                    <span className="text-sm font-medium">{draft.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar size={14} />
                    <span className="text-xs">{draft.date}</span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-widest">
                  {draft.status}
                </span>
              </div>

              <Link href={`/inspection/${draft.id}`}>
                <button className="w-full py-4 rounded-2xl bg-white/5 group-hover:bg-amber-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
                  Continue Inspection
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </motion.div>
        ))}
        {mockDrafts.length === 0 && (
          <div className="col-span-2 py-12 text-center glass-premium rounded-[32px] border-dashed border-white/10">
            <p className="text-gray-500 font-medium italic">Geen concepten gevonden...</p>
          </div>
        )}
      </div>
    </section>
  );
}
