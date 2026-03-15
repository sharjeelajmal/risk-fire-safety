'use client';

import { useState } from 'react';
import Navbar from '@/components/navigation/Navbar';
import Header from '@/components/dashboard/Header';
import ActionHero from '@/components/dashboard/ActionHero';
import DraftsSection from '@/components/dashboard/DraftsSection';
import CompletedInspections from '@/components/dashboard/CompletedInspections';
import { Search } from 'lucide-react';

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-x-hidden pb-24 lg:pb-0 font-sans">
      {/* Background Decor */}
      <div className="noise-overlay text-white"></div>
      <div className="bg-mesh-premium"></div>
      <div className="red-curve-top opacity-30"></div>
      
      <Navbar />
      <Header />

      <main className="lg:ml-24 pt-48 lg:pt-52 p-6 lg:p-12 min-h-screen relative z-10">
        <div className="max-w-7xl mx-auto space-y-16">
          <ActionHero />
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-red-500">
              <Search size={20} />
            </div>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Suchen nach Standort, Auftraggeber oder Datum..."
              className="w-full bg-white/5 border border-white/10 rounded-[2rem] pl-16 pr-8 py-6 text-white text-sm outline-none focus:border-red-500/50 focus:bg-white/10 transition-all placeholder:text-zinc-600 shadow-2xl backdrop-blur-xl"
            />
          </div>

          <div className="space-y-20 pb-20">
            <DraftsSection searchQuery={searchQuery} />
            <CompletedInspections searchQuery={searchQuery} />
          </div>
        </div>
      </main>

      {/* Decorative Blur Blobs */}
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-red-900/5 blur-[120px] rounded-full z-0 pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-red-600/5 blur-[100px] rounded-full z-0 pointer-events-none" />
    </div>
  );
}