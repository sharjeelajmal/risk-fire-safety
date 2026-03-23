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
    <header className="h-16 md:h-24 bg-[#050505] border-b border-white/10 shadow-lg fixed top-0 right-0 left-0 lg:left-24 z-40 px-4 md:px-8 flex items-center justify-between">
      {/* Left Side: Logo and Text */}
      <div className="flex items-center gap-3 md:gap-4">
        <div className="flex items-center group cursor-pointer">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="w-[150px] h-[54px] object-contain"
          />
        </div>
      </div>

      {/* Right Side: Profile and Logout */}
      <div className="flex items-center gap-3 md:gap-8">
        <div className="hidden sm:flex items-center gap-3 md:gap-4 p-1.5 md:p-2 rounded-xl md:rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group">
          <div className="text-right">
            <p className="text-white text-[12px] md:text-sm font-black tracking-tight leading-none mb-0.5 md:mb-1 group-hover:text-red-500 transition-colors">Robin Furrer</p>
            <div className="flex items-center gap-1.5 md:gap-2 justify-end">
              <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <p className="text-gray-500 text-[8px] md:text-[9px] uppercase font-black tracking-widest">Jetzt Aktiv</p>
            </div>
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 p-1 shadow-xl group-hover:scale-105 transition-transform overflow-hidden">
             <img src="/fire.png" alt="User Icon" className="w-full h-full object-contain" />
          </div>
        </div>

        <div className="h-8 md:h-10 w-[1px] bg-white/10 mx-1 md:mx-2 hidden sm:block"></div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="flex items-center gap-2 md:gap-3 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl transition-all cursor-pointer font-black text-[10px] md:text-xs uppercase tracking-widest border border-red-500/20 shadow-lg"
        >
          <LogOut className="w-3.5 h-3.5 md:w-4.5 md:h-4.5" />
          <span className="hidden lg:inline">Abmelden</span>
        </motion.button>
      </div>
    </header>
  );
}
