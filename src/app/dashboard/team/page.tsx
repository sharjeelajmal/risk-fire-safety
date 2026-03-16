'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Trash2, Mail, Shield, User, Loader2, X, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Navbar from '@/components/navigation/Navbar';
import Header from '@/components/dashboard/Header';
import DeleteConfirmModal from '@/components/modals/DeleteConfirmModal';

export default function TeamPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'inspector' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await fetchUsers();
        setIsAddModalOpen(false);
        setFormData({ name: '', email: '', password: '', role: 'inspector' });
      } else {
        const data = await res.json();
        setFormError(data.error || 'Fehler beim Erstellen des Benutzers');
      }
    } catch (err) {
      setFormError('Ein unerwarteter Fehler ist aufgetreten');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteTrigger = (user: any) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/users/${userToDelete._id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchUsers();
        setIsDeleteModalOpen(false);
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-x-hidden pb-24 lg:pb-0 font-sans">
      <div className="noise-overlay text-white"></div>
      <div className="bg-mesh-premium"></div>
      
      <Navbar />
      <Header />

      <main className="lg:ml-24 pt-32 md:pt-52 p-4 md:p-12 min-h-screen relative z-10">
        <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
          {/* Top Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl md:rounded-[22px] bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500 shadow-xl shadow-red-600/5">
                <Users className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase">Team-Verwaltung</h1>
                <p className="text-zinc-500 text-[8px] md:text-[10px] font-black uppercase tracking-[2px] md:tracking-[3px]">{users.length} Benutzer</p>
              </div>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full md:w-auto px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest md:tracking-[2px] text-[10px] md:text-xs transition-all flex items-center justify-center gap-2 md:gap-3 cursor-pointer shadow-xl shadow-red-600/20"
            >
              <UserPlus className="w-4 h-4 md:w-[18px] md:h-[18px]" />
              Hinzufügen
            </button>
          </div>

          {/* Users List */}
          <div className="space-y-4">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-zinc-500 gap-4">
                <Loader2 className="animate-spin text-red-500" size={32} />
                <p className="text-xs font-black uppercase tracking-widest animate-pulse">Lade Team-Daten...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {users.map((user, idx) => (
                    <motion.div
                      key={user._id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.05 }}
                      className="glass-premium p-5 md:p-6 rounded-[28px] md:rounded-[32px] border border-white/5 hover:border-red-600/20 transition-all group relative overflow-hidden"
                    >
                       <div className="card-shine opacity-20"></div>
                       <div className="relative z-10 space-y-4 md:space-y-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3 md:gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400">
                              <User className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <div>
                              <p className="text-white font-black uppercase text-[13px] md:text-sm tracking-tight">{user.name}</p>
                              <div className="flex items-center gap-1.5 md:gap-2 px-1.5 py-0.5 rounded-md md:rounded-lg bg-red-600/10 border border-red-600/20 text-red-500 text-[7px] md:text-[8px] font-black uppercase tracking-widest w-fit mt-0.5 md:mt-1">
                                <Shield className="w-2 h-2 md:w-2 md:h-2" />
                                {user.role}
                              </div>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleDeleteTrigger(user)}
                            className="p-2.5 md:p-3 rounded-lg md:rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all cursor-pointer shadow-lg shadow-red-500/5 md:group-hover:scale-110"
                          >
                            <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2.5 md:gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/[0.03] border border-white/5">
                          <Mail className="w-3 h-3 md:w-3.5 md:h-3.5 text-zinc-500" />
                          <span className="text-[11px] md:text-xs text-zinc-400 font-medium truncate">{user.email}</span>
                        </div>
                       </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {users.length === 0 && (
                  <div className="col-span-full py-20 text-center glass-premium rounded-[40px] border-dashed border-white/10">
                    <p className="text-zinc-600 font-black uppercase tracking-[0.2em] text-xs">Keine Benutzer gefunden</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add User Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !formLoading && setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[32px] md:rounded-[40px] p-6 md:p-10 shadow-[0_0_80px_rgba(239,68,68,0.1)] overflow-hidden"
            >
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-red-600/5 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6 md:mb-8">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500">
                      <UserPlus className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">Neuer Benutzer</h2>
                  </div>
                  <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-600 hover:text-white transition-colors cursor-pointer">
                    <X className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </div>

                <form onSubmit={handleAddUser} className="space-y-4 md:space-y-6">
                  {formError && (
                    <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 md:gap-3 text-red-500 text-[11px] md:text-xs font-bold font-black uppercase tracking-tight">
                      <AlertCircle className="w-4 h-4" />
                      {formError}
                    </div>
                  )}

                  <div className="space-y-3 md:space-y-4">
                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-3 md:ml-4">Vollständiger Name</label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Z.B. Robin Schmid"
                        className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-3.5 md:py-4 text-white text-[13px] md:text-sm outline-none focus:border-red-600/50 transition-all placeholder:text-zinc-600 uppercase font-bold tracking-wide"
                      />
                    </div>
                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-3 md:ml-4">E-Mail Adresse</label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@rfs.gmbh"
                        className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-3.5 md:py-4 text-white text-[13px] md:text-sm outline-none focus:border-red-600/50 transition-all placeholder:text-zinc-600"
                      />
                    </div>
                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-3 md:ml-4">Passwort</label>
                      <div className="relative">
                        <input
                          required
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="••••••••"
                          className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-3.5 md:py-4 text-white text-[13px] md:text-sm outline-none focus:border-red-600/50 transition-all placeholder:text-zinc-600 pr-12 md:pr-14"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 p-2 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4 md:w-[18px] md:h-[18px]" /> : <Eye className="w-4 h-4 md:w-[18px] md:h-[18px]" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={formLoading}
                    type="submit"
                    className="w-full py-4 md:py-5 rounded-xl md:rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest md:tracking-[2px] text-[10px] md:text-xs transition-all flex items-center justify-center gap-2 md:gap-3 cursor-pointer shadow-xl shadow-red-600/20 disabled:opacity-50 mt-2 md:mt-4 active:scale-[0.98]"
                  >
                    {formLoading ? <Loader2 className="animate-spin w-4 h-4 md:w-4.5 md:h-4.5" /> : 'Benutzer Erstellen'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Benutzer Löschen"
        message={`Sind Sie sicher, dass Sie ${userToDelete?.name} dauerhaft löschen möchten? Dieser Benutzer hat keinen Zugriff mehr auf das System.`}
        loading={isDeleting}
      />
    </div>
  );
}
