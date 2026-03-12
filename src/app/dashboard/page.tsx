'use client';

import Navbar from '@/components/navigation/Navbar';
import Header from '@/components/dashboard/Header';
import ActionHero from '@/components/dashboard/ActionHero';
import DraftsSection from '@/components/dashboard/DraftsSection';
import CompletedInspections from '@/components/dashboard/CompletedInspections';

export default function DashboardPage() {
  return (
    <div className="relative min-h-screen bg-[#050505] overflow-x-hidden pb-24 lg:pb-0">
      {/* Background Decor */}
      <div className="noise-overlay"></div>
      <div className="bg-mesh-premium"></div>
      <div className="red-curve-top opacity-30"></div>
      
      <Navbar />
      <Header />

      <main className="lg:ml-24 pt-48 lg:pt-52 p-6 lg:p-12 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-16">
          <ActionHero />
          
          <div className="space-y-20 pb-20">
            <DraftsSection />
            <CompletedInspections />
          </div>
        </div>
      </main>

      {/* Decorative Blur Blobs */}
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-red-900/5 blur-[120px] rounded-full z-0 pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-red-600/5 blur-[100px] rounded-full z-0 pointer-events-none" />
    </div>
  );
}