'use client';

import { motion } from 'framer-motion';
import { FileCheck, Calendar, MapPin, Download, Eye, User } from 'lucide-react';

const mockCompleted = [
  { id: 101, location: 'Zurich Airport', date: '05 Maart 2026', client: 'Flughafen AG', status: 'Completed' },
  { id: 102, location: 'Grand Hotel Les Trois Rois', date: '01 Maart 2026', client: 'Luxury Group', status: 'Completed' },
];

export default function CompletedInspections() {
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20">
            <FileCheck size={20} />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Completed Inspections</h2>
        </div>
      </div>

      <div className="space-y-4">
        {mockCompleted.map((report, idx) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-premium relative p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-6 flex-1">
              <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-500">
                <FileCheck size={28} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2 flex-1">
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Location</p>
                  <p className="text-white font-bold truncate">{report.location}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Client</p>
                  <div className="flex items-center gap-2 text-white font-bold">
                    <User size={12} className="text-green-500" />
                    {report.client}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Datum</p>
                  <div className="flex items-center gap-2 text-gray-400 font-medium italic text-xs">
                    <Calendar size={12} />
                    {report.date}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs transition-all cursor-pointer">
                <Eye size={16} />
                View Details
              </button>
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white font-bold text-xs border border-green-500/20 transition-all cursor-pointer">
                <Download size={16} />
                PDF
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
