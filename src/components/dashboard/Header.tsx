'use client';

import { motion } from 'framer-motion';
import { LogOut, User, Bell, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      // Fallback: forcefully redirect anyway
      router.push('/login');
    }
  };

  return (
    <header className="h-24 glass-premium border-b border-white/5 fixed top-0 right-0 left-0 lg:left-24 z-40 px-8 flex items-center justify-between">
      {/* Left Side: Logo and Text */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-900 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.3)] group-hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] transition-all">
            <ShieldCheck className="text-white" size={28} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-white font-black text-xl tracking-tighter leading-none">RFS</h1>
            <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[2px]">Risk Fire Safety</p>
          </div>
        </div>
      </div>

      {/* Right Side: Profile and Logout */}
      <div className="flex items-center gap-8">
        <div className="hidden sm:flex items-center gap-4 p-2 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group">
          <div className="text-right">
            <p className="text-white text-sm font-black tracking-tight leading-none mb-1 group-hover:text-red-500 transition-colors">Robin Furrer</p>
            <div className="flex items-center gap-2 justify-end">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <p className="text-gray-500 text-[9px] uppercase font-black tracking-widest">Jetzt Aktiv</p>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 p-1 shadow-xl group-hover:scale-105 transition-transform overflow-hidden">
             <img src="/logo.png" alt="Logo" className="w-full h-full object-cover rounded-xl" />
          </div>
        </div>

        <div className="h-10 w-[1px] bg-white/10 mx-2 hidden md:block"></div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="flex items-center gap-3 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-6 py-3 rounded-2xl transition-all cursor-pointer font-black text-xs uppercase tracking-widest border border-red-500/20 shadow-lg"
        >
          <LogOut size={18} />
          <span className="hidden lg:inline">Abmelden</span>
        </motion.button>
      </div>
    </header>
  );
}
