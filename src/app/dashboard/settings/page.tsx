'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Settings, 
  Mail, 
  Lock, 
  Bell, 
  FileText, 
  Save, 
  ChevronRight,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import Navbar from '@/components/navigation/Navbar';
import Header from '@/components/dashboard/Header';

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: ''
  });

  const [appSettings, setAppSettings] = useState({
    showPdfLogo: true,
    notifications: true,
    darkMode: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' }); // type: 'success' | 'error'

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/users/me');
        if (res.ok) {
          const data = await res.json();
          setProfile(prev => ({ 
            ...prev, 
            name: data.name, 
            email: data.email 
          }));
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage({ text: '', type: '' });
    
    try {
      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          password: profile.newPassword
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: 'Profil erfolgreich aktualisiert', type: 'success' });
        // Clear password fields
        setProfile(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
      } else {
        setMessage({ text: data.error || 'Update fehlgeschlagen', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Ein unerwarteter Fehler ist aufgetreten', type: 'error' });
    } finally {
      setSaving(false);
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-x-hidden pb-24 lg:pb-0 font-sans">
      <div className="noise-overlay text-white"></div>
      <div className="bg-mesh-premium"></div>
      
      <Navbar />
      <Header />

      <main className="lg:ml-24 pt-48 lg:pt-52 p-6 lg:p-12 min-h-screen relative z-10">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Page Heading */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-[22px] bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500 shadow-xl shadow-red-600/5">
                <Settings size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Einstellungen</h1>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[3px]">Profil & App-Präferenzen</p>
              </div>
            </div>

            <AnimatePresence>
              {message.text && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`flex items-center gap-3 px-6 py-3 rounded-2xl border ${
                    message.type === 'success' 
                      ? 'bg-green-500/10 border-green-500/20 text-green-500' 
                      : 'bg-red-500/10 border-red-500/20 text-red-500'
                  }`}
                >
                  {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                  <span className="text-xs font-bold uppercase tracking-wider">{message.text}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Section 1: Mein Profil */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-premium rounded-[40px] p-8 sm:p-10 border border-white/5 relative overflow-hidden group"
            >
              <div className="card-shine opacity-10"></div>
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-zinc-400">
                    <User size={20} />
                  </div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">Mein Profil</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Vollständiger Name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white text-sm outline-none focus:border-red-600/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">E-Mail Adresse</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white text-sm outline-none focus:border-red-600/50 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-zinc-400">
                      <Shield size={20} />
                    </div>
                    <h2 className="text-lg font-black text-white uppercase tracking-tight">Passwort ändern</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Aktuelles Passwort</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-red-600/50 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Neues Passwort</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Neues Passwort (optional)"
                          value={profile.newPassword}
                          onChange={(e) => setProfile({ ...profile, newPassword: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-red-600/50 transition-all pr-14"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 2: App-Einstellungen */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-premium rounded-[40px] p-8 sm:p-10 border border-white/5 relative overflow-hidden"
            >
              <div className="card-shine opacity-10"></div>
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-zinc-400">
                    <Settings size={20} />
                  </div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">App-Einstellungen</h2>
                </div>

                <div className="space-y-4">
                  {/* Toggle: PDF-Logo */}
                  <div className="flex items-center justify-between p-6 rounded-[28px] bg-white/5 border border-white/5 hover:border-red-600/20 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center text-red-500">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">Standard-PDF-Logo anzeigen</p>
                        <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mt-0.5">Logo auf Berichten einblenden</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setAppSettings({ ...appSettings, showPdfLogo: !appSettings.showPdfLogo })}
                      className={`w-12 h-6 rounded-full transition-all relative ${appSettings.showPdfLogo ? 'bg-red-600' : 'bg-zinc-800'} cursor-pointer`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${appSettings.showPdfLogo ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>

                  {/* Toggle: Notifications */}
                  <div className="flex items-center justify-between p-6 rounded-[28px] bg-white/5 border border-white/5 hover:border-red-600/20 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center text-red-500">
                        <Bell size={20} />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">Benachrichtigungen</p>
                        <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mt-0.5">Echtzeit-Systemupdates</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setAppSettings({ ...appSettings, notifications: !appSettings.notifications })}
                      className={`w-12 h-6 rounded-full transition-all relative ${appSettings.notifications ? 'bg-red-600' : 'bg-zinc-800'} cursor-pointer`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${appSettings.notifications ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Save Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-end pt-4"
            >
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-12 py-5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-[2px] text-xs transition-all flex items-center justify-center gap-3 cursor-pointer shadow-xl shadow-red-600/20 active:scale-[0.98] disabled:opacity-50 min-w-[200px]"
              >
                {saving ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                      <Save size={18} />
                    </motion.div>
                    Speichert...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Speichern
                  </>
                )}
              </button>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
