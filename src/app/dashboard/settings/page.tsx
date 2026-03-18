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
  Loader2,
  Plus,
  X
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
  const [isMaster, setIsMaster] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' }); // type: 'success' | 'error'

  const [customLists, setCustomLists] = useState<Record<string, string[]>>({
    auftraggeber: [],
    participants: [],
    functions: [],
    notes: []
  });

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
          setIsMaster(!!data.isMaster);
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
      } finally {
        setLoading(false);
      }
    };
    const fetchLists = async () => {
      try {
        const res = await fetch('/api/users/me/lists');
        if (res.ok) {
          const data = await res.json();
          setCustomLists(data);
        }
      } catch (err) {
        console.error('Failed to fetch lists:', err);
      }
    };
    fetchUser();
    fetchLists();
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

  const handleAddListItem = async (type: string, item: string) => {
    if (!item.trim()) return;
    try {
      const res = await fetch('/api/users/me/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, item: item.trim() })
      });
      if (res.ok) {
        const data = await res.json();
        setCustomLists(data);
      } else {
        const errorData = await res.json();
        alert(`Fehler beim Speichern: ${errorData.error || 'Serverfehler'}`);
      }
    } catch (err) {
      console.error('Error adding item:', err);
      alert('Ein technischer Fehler ist aufgetreten. Bitte prüfen Sie die Verbindung.');
    }
  };

  const handleDeleteListItem = async (type: string, item: string) => {
    try {
      const res = await fetch('/api/users/me/lists', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, item })
      });
      if (res.ok) {
        const data = await res.json();
        setCustomLists(data);
      } else {
        const errorData = await res.json();
        alert(`Fehler beim Löschen: ${errorData.error || 'Serverfehler'}`);
      }
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Ein technischer Fehler ist aufgetreten.');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-x-hidden pb-24 lg:pb-0 font-sans">
      <div className="noise-overlay text-white"></div>
      <div className="bg-mesh-premium"></div>
      
      <Navbar />
      <Header />

      <main className="lg:ml-24 pt-32 md:pt-52 p-4 md:p-12 min-h-screen relative z-10">
        <div className="max-w-4xl mx-auto space-y-8 md:space-y-12">
          {/* Page Heading */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl md:rounded-[22px] bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500 shadow-xl shadow-red-600/5">
                <Settings className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase">Einstellungen</h1>
                <p className="text-zinc-500 text-[8px] md:text-[10px] font-black uppercase tracking-[2px] md:tracking-[3px]">Profil & App-Präferenzen</p>
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
              className="glass-premium rounded-[32px] md:rounded-[40px] p-5 md:p-10 border border-white/5 relative overflow-hidden group"
            >
              <div className="card-shine opacity-10"></div>
              <div className="relative z-10 space-y-6 md:space-y-8">
                <div className="flex items-center gap-3 md:gap-4 mb-1 md:mb-2">
                  <div className="p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 text-zinc-400">
                    <User className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">Mein Profil</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-3 md:ml-4">Vollständiger Name</label>
                    <div className="relative">
                      <User size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 md:w-4 md:h-4 md:left-6" />
                      <input
                        type="text"
                        disabled={isMaster}
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className={`w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl pl-12 md:pl-14 pr-5 md:pr-6 py-3.5 md:py-4 text-white text-[13px] md:text-sm outline-none transition-all ${isMaster ? 'cursor-not-allowed opacity-50' : 'focus:border-red-600/50'}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-3 md:ml-4">E-Mail Adresse</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 md:w-4 md:h-4 md:left-6" />
                      <input
                        type="email"
                        disabled={isMaster}
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className={`w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl pl-12 md:pl-14 pr-5 md:pr-6 py-3.5 md:py-4 text-white text-[13px] md:text-sm outline-none transition-all ${isMaster ? 'cursor-not-allowed opacity-50' : 'focus:border-red-600/50'}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 md:pt-6 border-t border-white/5 space-y-6 md:space-y-8">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 text-zinc-400">
                      <Shield className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <h2 className="text-base md:text-lg font-black text-white uppercase tracking-tight">Passwort ändern</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-3 md:ml-4">Aktuelles Passwort</label>
                      <input
                        type="password"
                        disabled={isMaster}
                        placeholder="••••••••"
                        className={`w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-3.5 md:py-4 text-white text-[13px] md:text-sm outline-none transition-all ${isMaster ? 'cursor-not-allowed opacity-50' : 'focus:border-red-600/50'}`}
                      />
                    </div>
                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-3 md:ml-4">Neues Passwort</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          disabled={isMaster}
                          placeholder="Neues Passwort (optional)"
                          value={profile.newPassword}
                          onChange={(e) => setProfile({ ...profile, newPassword: e.target.value })}
                          className={`w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-3.5 md:py-4 text-white text-[13px] md:text-sm outline-none transition-all pr-12 md:pr-14 ${isMaster ? 'cursor-not-allowed opacity-50' : 'focus:border-red-600/50'}`}
                        />
                        <button
                          type="button"
                          disabled={isMaster}
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 p-2 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                  {isMaster && (
                    <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold uppercase tracking-widest">
                      Master-Admin Profil kann nicht über das Dashboard geändert werden.
                    </div>
                  )}
                </div>
              </div>
            </motion.section>

            {/* Section 2: App-Einstellungen */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-premium rounded-[32px] md:rounded-[40px] p-5 md:p-10 border border-white/5 relative overflow-hidden"
            >
              <div className="card-shine opacity-10"></div>
              <div className="relative z-10 space-y-6 md:space-y-8">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 text-zinc-400">
                    <Settings className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">App-Einstellungen</h2>
                </div>

                <div className="space-y-3 md:space-y-4">
                  {/* Toggle: PDF-Logo */}
                  <div className="flex items-center justify-between p-4 md:p-6 rounded-2xl md:rounded-[28px] bg-white/5 border border-white/5 hover:border-red-600/20 transition-all group">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-red-600/10 flex items-center justify-center text-red-500">
                        <FileText className="w-4 h-4 md:w-5 md:h-5" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-[13px] md:text-sm">Standard-PDF-Logo</p>
                        <p className="text-[8px] md:text-[10px] text-zinc-500 uppercase font-black tracking-widest mt-0.5">Logo einblenden</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setAppSettings({ ...appSettings, showPdfLogo: !appSettings.showPdfLogo })}
                      className={`w-10 h-5 md:w-12 md:h-6 rounded-full transition-all relative ${appSettings.showPdfLogo ? 'bg-red-600' : 'bg-zinc-800'} cursor-pointer`}
                    >
                      <div className={`absolute top-0.5 md:top-1 w-4 h-4 bg-white rounded-full transition-all ${appSettings.showPdfLogo ? 'left-5.5 md:left-7' : 'left-0.5 md:left-1'}`} />
                    </button>
                  </div>

                  {/* Toggle: Notifications */}
                  <div className="flex items-center justify-between p-4 md:p-6 rounded-2xl md:rounded-[28px] bg-white/5 border border-white/5 hover:border-red-600/20 transition-all group">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-red-600/10 flex items-center justify-center text-red-500">
                        <Bell className="w-4 h-4 md:w-5 md:h-5" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-[13px] md:text-sm">Benachrichtigungen</p>
                        <p className="text-[8px] md:text-[10px] text-zinc-500 uppercase font-black tracking-widest mt-0.5">Systemupdates</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setAppSettings({ ...appSettings, notifications: !appSettings.notifications })}
                      className={`w-10 h-5 md:w-12 md:h-6 rounded-full transition-all relative ${appSettings.notifications ? 'bg-red-600' : 'bg-zinc-800'} cursor-pointer`}
                    >
                      <div className={`absolute top-0.5 md:top-1 w-4 h-4 bg-white rounded-full transition-all ${appSettings.notifications ? 'left-5.5 md:left-7' : 'left-0.5 md:left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 3: Stammdaten Management */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-premium rounded-[32px] md:rounded-[40px] p-5 md:p-10 border border-white/5 relative overflow-hidden"
            >
              <div className="card-shine opacity-10"></div>
              <div className="relative z-10 space-y-6 md:space-y-8">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 text-zinc-400">
                    <FileText className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">Stammdaten</h2>
                    <p className="text-[8px] md:text-[10px] text-zinc-500 uppercase font-black tracking-widest">Dropdown-Listen anpassen</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { key: 'auftraggeber', label: 'Auftraggeber', icon: <User size={16} /> },
                    { key: 'participants', label: 'Teilnehmer', icon: <User size={16} /> },
                    { key: 'functions', label: 'Funktionen', icon: <Shield size={16} /> },
                    { key: 'notes', label: 'Hinweise', icon: <FileText size={16} /> }
                  ].map((list) => (
                    <div key={list.key} className="space-y-4 p-5 md:p-6 rounded-[24px] bg-white/5 border border-white/5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-zinc-300">
                          {list.icon}
                          <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">{list.label}</span>
                        </div>
                        <span className="text-[8px] font-black text-zinc-500 bg-white/5 px-2 py-1 rounded-full uppercase tracking-tighter">
                          {customLists[list.key]?.length || 0} Einträge
                        </span>
                      </div>

                      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 scrollbar-premium">
                        {customLists[list.key]?.map((item: string) => (
                          <div key={item} className="flex items-center justify-between py-2 px-3 bg-white/[0.02] border border-white/5 rounded-xl group hover:border-red-600/30 transition-all">
                            <span className="text-xs text-zinc-400 font-medium">{item}</span>
                            <button 
                              onClick={() => handleDeleteListItem(list.key as any, item)}
                              className="p-1.5 text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="relative pt-2 flex gap-2">
                        <input
                          type="text"
                          id={`input-${list.key}`}
                          placeholder="Neu hinzufügen..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const input = e.target as HTMLInputElement;
                              handleAddListItem(list.key as any, input.value);
                              input.value = '';
                            }
                          }}
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-[11px] outline-none focus:border-red-600/50 transition-all"
                        />
                        <button 
                          onClick={() => {
                            const input = document.getElementById(`input-${list.key}`) as HTMLInputElement;
                            if (input) {
                              handleAddListItem(list.key as any, input.value);
                              input.value = '';
                            }
                          }}
                          className="p-2.5 rounded-xl bg-red-600/10 text-red-500 hover:bg-red-600/20 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Save Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-end pt-2 md:pt-4"
            >
              {!isMaster && (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full md:w-auto px-8 md:px-12 py-3.5 md:py-5 rounded-xl md:rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest md:tracking-[2px] text-[10px] md:text-xs transition-all flex items-center justify-center gap-2 md:gap-3 cursor-pointer shadow-xl shadow-red-600/20 active:scale-[0.98] disabled:opacity-50 min-w-[160px] md:min-w-[200px]"
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
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
