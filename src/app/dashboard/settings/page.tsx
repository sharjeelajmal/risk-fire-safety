'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Settings,
  Mail,
  Lock,
  Bell,
  FileText,
  Save,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
  X,
  Search,
  Pencil,
  Check,
  Trash2,
  List,
} from 'lucide-react';
import Navbar from '@/components/navigation/Navbar';
import Header from '@/components/dashboard/Header';

// ─────────────────────────────────────────────────────────────────────────────
// Stammdaten Modal Component
// ─────────────────────────────────────────────────────────────────────────────
interface StammdatenModalProps {
  isOpen: boolean;
  onClose: () => void;
  customLists: Record<string, string[]>;
  onListsChange: (lists: Record<string, string[]>) => void;
}

const LIST_TABS = [
  { key: 'auftraggeber', label: 'Auftraggeber', icon: <User size={16} /> },
  { key: 'participants', label: 'Teilnehmer', icon: <User size={16} /> },
  { key: 'functions', label: 'Funktionen', icon: <Shield size={16} /> },
  { key: 'notes', label: 'Hinweise', icon: <FileText size={16} /> },
];

function StammdatenModal({ isOpen, onClose, customLists, onListsChange }: StammdatenModalProps) {
  const [activeTab, setActiveTab] = useState('auftraggeber');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState<{ key: string; idx: number; val: string } | null>(null);
  const [addingValue, setAddingValue] = useState('');
  const [saving, setSaving] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingItem) editInputRef.current?.focus();
  }, [editingItem]);

  // Reset on tab change
  useEffect(() => {
    setSearchQuery('');
    setAddingValue('');
    setEditingItem(null);
  }, [activeTab]);

  const currentList: string[] = customLists[activeTab] || [];
  const filteredList = currentList.filter(item =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = async () => {
    const trimmed = addingValue.trim();
    if (!trimmed) return;
    setSaving(true);
    try {
      const res = await fetch('/api/users/me/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: activeTab, item: trimmed }),
      });
      if (res.ok) {
        const data = await res.json();
        onListsChange(data);
        setAddingValue('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: string) => {
    setSaving(true);
    try {
      const res = await fetch('/api/users/me/lists', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: activeTab, item }),
      });
      if (res.ok) {
        const data = await res.json();
        onListsChange(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleEditSave = async () => {
    if (!editingItem) return;
    const newVal = editingItem.val.trim();
    const oldVal = currentList[editingItem.idx];
    if (!newVal || newVal === oldVal) { setEditingItem(null); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/users/me/lists', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: activeTab, oldItem: oldVal, newItem: newVal }),
      });
      if (res.ok) {
        const data = await res.json();
        onListsChange(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
      setEditingItem(null);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-sm"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          className="w-full sm:max-w-2xl h-[92vh] sm:h-auto sm:max-h-[90vh] flex flex-col glass-premium rounded-t-[28px] sm:rounded-[32px] border border-white/10 shadow-2xl !overflow-visible"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500">
                <List size={18} />
              </div>
              <div>
                <h2 className="text-base font-black text-white uppercase tracking-tight">Listen verwalten</h2>
                <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">Stammdaten bearbeiten</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-red-600/10 text-zinc-400 hover:text-red-400 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 px-3 pt-4 shrink-0">
            {LIST_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2 px-1 rounded-xl text-[8px] sm:text-[9px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 min-w-0 ${
                  activeTab === tab.key
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                    : 'bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="shrink-0">{tab.icon}</span>
                <span className="truncate">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="px-4 pt-3 shrink-0">
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Suche..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white outline-none focus:border-red-600/50 transition-all font-medium"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1.5 scrollbar-premium">
            {filteredList.length === 0 && (
              <div className="py-12 text-center text-zinc-600 text-xs font-bold uppercase tracking-widest">
                {searchQuery ? 'Keine Treffer gefunden' : 'Noch keine Einträge'}
              </div>
            )}

            <AnimatePresence mode="popLayout">
              {filteredList.map((item, idx) => {
                const originalIdx = currentList.indexOf(item);
                const isEditing = editingItem?.key === activeTab && editingItem?.idx === originalIdx;

                return (
                  <motion.div
                    key={item}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 group hover:border-white/10 transition-all"
                  >
                    {/* Number badge */}
                    <span className="w-6 h-6 shrink-0 rounded-lg bg-white/5 flex items-center justify-center text-[9px] font-black text-zinc-600">
                      {idx + 1}
                    </span>

                    {/* Item content / edit input */}
                    {isEditing ? (
                      <input
                        ref={editInputRef}
                        value={editingItem!.val}
                        onChange={(e) => setEditingItem({ ...editingItem!, val: e.target.value })}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleEditSave(); if (e.key === 'Escape') setEditingItem(null); }}
                        className="flex-1 bg-white/5 border border-red-500/50 rounded-lg px-3 py-1.5 text-xs text-white outline-none font-medium"
                      />
                    ) : (
                      <span className="flex-1 text-xs text-zinc-300 font-medium leading-relaxed">{item}</span>
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleEditSave}
                            disabled={saving}
                            className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                          >
                            <Check size={13} />
                          </button>
                          <button
                            onClick={() => setEditingItem(null)}
                            className="p-1.5 rounded-lg bg-white/5 text-zinc-500 hover:bg-white/10 transition-colors"
                          >
                            <X size={13} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingItem({ key: activeTab, idx: originalIdx, val: item })}
                            className="p-1.5 rounded-lg sm:opacity-0 sm:group-hover:opacity-100 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-all"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            disabled={saving}
                            className="p-1.5 rounded-lg sm:opacity-0 sm:group-hover:opacity-100 bg-red-600/10 text-red-400 hover:bg-red-600/20 transition-all"
                          >
                            <Trash2 size={13} />
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Add new item */}
          <div className="px-3 pb-5 pt-3 border-t border-white/5 shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={addingValue}
                onChange={(e) => setAddingValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
                placeholder="Neuen Eintrag hinzufügen..."
                className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-red-600/50 transition-all font-medium"
              />
              <button
                onClick={handleAdd}
                disabled={saving || !addingValue.trim()}
                className="shrink-0 px-3 sm:px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-red-600/20"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                <span className="hidden sm:inline">Hinzufügen</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Settings Page
// ─────────────────────────────────────────────────────────────────────────────
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
  const [message, setMessage] = useState({ text: '', type: '' });

  const [customLists, setCustomLists] = useState<Record<string, string[]>>({
    auftraggeber: [],
    participants: [],
    functions: [],
    notes: []
  });

  const [isStammdatenModalOpen, setIsStammdatenModalOpen] = useState(false);

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
        setProfile(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
      } else {
        setMessage({ text: data.error || 'Update fehlgeschlagen', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Ein unerwarteter Fehler ist aufgetreten', type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  // Total count across all lists for the badge
  const totalListItems = Object.values(customLists).reduce((sum, arr) => sum + arr.length, 0);

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
                          type={showPassword ? 'text' : 'password'}
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
              className="glass-premium rounded-[32px] md:rounded-[40px] p-5 md:p-10 border border-white/5 relative !overflow-visible z-[60]"
            >
              <div className="card-shine opacity-10"></div>
              <div className="relative z-10 space-y-6 md:space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 text-zinc-400">
                      <FileText className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">Stammdaten</h2>
                      <p className="text-[8px] md:text-[10px] text-zinc-500 uppercase font-black tracking-widest">Dropdown-Listen anpassen</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsStammdatenModalOpen(true)}
                    className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-red-600/20 active:scale-[0.98]"
                  >
                    <List size={15} />
                    Listen verwalten
                    {totalListItems > 0 && (
                      <span className="bg-white/20 px-2 py-0.5 rounded-full text-[9px]">{totalListItems}</span>
                    )}
                  </button>
                </div>

                {/* Summary chips */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {LIST_TABS.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => { setIsStammdatenModalOpen(true); }}
                      className="flex flex-col items-start p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-red-600/20 hover:bg-white/5 transition-all text-left group"
                    >
                      <div className="flex items-center gap-2 text-zinc-500 group-hover:text-red-400 transition-colors mb-1">
                        {tab.icon}
                        <span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
                      </div>
                      <span className="text-xl font-black text-white">{customLists[tab.key]?.length || 0}</span>
                      <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">Einträge</span>
                    </button>
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

      {/* Stammdaten Modal */}
      <StammdatenModal
        isOpen={isStammdatenModalOpen}
        onClose={() => setIsStammdatenModalOpen(false)}
        customLists={customLists}
        onListsChange={setCustomLists}
      />
    </div>
  );
}
