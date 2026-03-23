'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, Plus, Users, Settings as Gear } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MoreMenu from './MoreMenu';

const navItems = [
  { name: 'Dashboard', icon: Home, path: '/dashboard' },
  { name: 'Neu', icon: Plus, path: '/inspection/new', primary: true },
  { name: 'Team', icon: Users, path: '/dashboard/team' },
  { name: 'Menü', icon: Gear, path: 'menu' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  return (
    <>
      {/* Mobile: Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-white/10 z-[99999] px-6 flex items-center justify-between pb-safe bg-[#050505] shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const isButton = item.path === 'menu';
          
          if (item.primary) {
            return (
              <Link key={item.path} href={item.path}>
                <motion.div 
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-900 flex items-center justify-center text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] -mt-6 border-4 border-[#050505] cursor-pointer"
                >
                  <item.icon size={20} />
                </motion.div>
              </Link>
            );
          }

          if (isButton) {
            return (
              <button
                key={item.name}
                onClick={() => setIsMenuOpen(true)}
                className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors cursor-pointer"
              >
                <item.icon size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span>
              </button>
            );
          }

          return (
            <Link key={item.path} href={item.path}>
              <div className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${isActive ? 'text-red-500' : 'text-gray-500'}`}>
                <item.icon size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Desktop: Mini Sidebar Navigation */}
      <aside className={`hidden lg:flex fixed left-0 top-0 bottom-0 w-24 flex-col items-center py-8 border-r border-white/10 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#050505] shadow-2xl' : 'bg-transparent'}`}>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-900 flex items-center justify-center mb-16 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
            <span className="text-white font-black text-xl">R</span>
        </div>

        <div className="flex-1 flex flex-col gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const isButton = item.path === 'menu';

            if (item.primary) {
              return (
                <Link key={item.path} href={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] cursor-pointer"
                  >
                    <item.icon size={24} />
                  </motion.div>
                </Link>
              );
            }

            if (isButton) {
              return (
                <button
                  key={item.name}
                  onClick={() => setIsMenuOpen(true)}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-all group cursor-pointer"
                >
                  <item.icon size={24} className="group-hover:rotate-45 transition-transform" />
                </button>
              );
            }

            return (
              <Link key={item.path} href={item.path}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${isActive ? 'bg-red-600/10 text-red-500 shadow-[0_4px_10px_rgba(239,68,68,0.1)]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                  <item.icon size={24} />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10 cursor-pointer hover:border-red-500 transition-colors bg-white/5 p-1 flex items-center justify-center">
            <img src="/fire.png" alt="Fire Icon" className="w-full h-full object-contain" />
        </div>
      </aside>

      <MoreMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
