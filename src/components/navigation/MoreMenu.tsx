'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, ChevronRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface MoreMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MoreMenu({ isOpen, onClose }: MoreMenuProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      onClose();
    } catch (err) {
      console.error('Logout failed:', err);
      router.push('/login');
      onClose();
    }
  };

  const menuItems = [
    { name: 'Mein Profil', icon: User, desc: 'Passwort & E-Mail aktualisieren' },
    { name: 'App-Einstellungen', icon: Settings, desc: 'PDF-Logo & Standardeinstellungen' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Menu Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 lg:left-24 lg:right-auto lg:top-1/2 lg:-translate-y-1/2 lg:bottom-auto lg:w-96 glass-premium rounded-t-[2rem] md:rounded-t-[3rem] lg:rounded-[3rem] p-6 lg:p-8 pb-10 lg:pb-8 z-[70] border-t lg:border border-white/10"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">Mehr Optionen</h3>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 mb-8">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href="/dashboard/settings"
                  onClick={onClose}
                  className="w-full p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-red-600/10 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-colors">
                      <item.icon size={18} />
                    </div>
                    <div className="text-left">
                      <p className="text-white font-bold text-xs md:text-sm tracking-wide">{item.name}</p>
                      <p className="text-gray-500 text-[9px] md:text-[10px] uppercase font-black tracking-widest leading-none">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>

            <button
              onClick={handleLogout}
              className="w-full p-4 md:p-5 rounded-xl md:rounded-2xl bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white transition-all flex items-center justify-center gap-3 font-black text-[10px] md:text-xs uppercase tracking-[2px] cursor-pointer"
            >
              <LogOut size={16} />
              Abmelden
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
