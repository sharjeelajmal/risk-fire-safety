'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Loader2, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/dashboard');
      } else {
        setError(data.error || 'Anmeldung fehlgeschlagen');
      }
    } catch (err) {
      setError('Etwas ist schief gelaufen. Bitte versuchen Sie es erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050505] overflow-x-hidden flex flex-col lg:flex-row font-['Outfit']">
      <div className="noise-overlay"></div>
      <div className="bg-mesh-premium"></div>

      {/* Background Blobs (Premium) */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-red-900/20 blur-[120px] rounded-full z-0"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 20, repeat: Infinity, delay: 2 }}
        className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-red-600/10 blur-[150px] rounded-full z-0"
      />

      {/* Left Branding Side (60%) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="hidden lg:flex lg:w-3/5 relative flex-col justify-between p-20 z-10"
      >
        <div className="space-y-12 relative z-20">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex items-center"
          >
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="w-[150px] h-[54px] object-contain" 
            />
          </motion.div>

          <div className="space-y-6">
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-8xl font-black text-white leading-[0.95] tracking-[-4px]"
            >
              BRAND <br />
              <span className="branding-gradient-text">SCHUTZ</span>
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-gray-400 text-xl max-w-lg font-light leading-relaxed"
            >
              Mehr als <span className="text-white font-bold">15 Jahre</span> der absolute Standard im Risikomanagement und Brandschutz. Ihr Portal für Präzisionsinspektionen.
            </motion.p>
          </div>
        </div>

        <div className="relative z-20 flex items-center gap-12">
          <div className="flex -space-x-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-12 h-12 rounded-full border-2 border-[#050505] bg-gray-800 flex items-center justify-center text-[10px] text-white overflow-hidden">
                <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
              </div>
            ))}
            <div className="w-12 h-12 rounded-full border-2 border-[#050505] bg-red-600 flex items-center justify-center text-[10px] text-white font-bold">
              +1k
            </div>
          </div>
          <p className="text-gray-500 text-xs font-medium tracking-wide">
            Vertraut von <span className="text-white">Hunderten</span> <br /> professioneller Inspektoren.
          </p>
        </div>

        <div className="absolute top-0 right-0 h-full w-[1px] bg-gradient-to-b from-transparent via-red-500/20 to-transparent"></div>
      </motion.div>

      {/* Right Login Side (40%) */}
      <div className="flex-1 lg:w-2/5 flex items-center justify-center p-4 sm:p-8 relative z-10">
        <div className="red-curve-top"></div>
        <div className="red-curve-bottom"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="glass-premium rounded-[32px] sm:rounded-[48px] p-6 sm:p-12">
            <div className="noise-overlay"></div>
            <div className="card-shine"></div>

            <div className="mb-8 sm:mb-12 relative z-20 text-center lg:text-left">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-6 sm:mb-8 mx-auto lg:ml-0"
              >
                <ShieldCheck size={32} className="sm:w-10 sm:h-10 drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]" />
              </motion.div>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-3">Willkommen Zurück</h2>
              <p className="text-gray-500 text-xs sm:text-base font-medium">Melden Sie sich mit Ihren gesicherten Daten an</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 relative z-20">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold"
                  >
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 uppercase tracking-[3px] font-bold ml-1">Benutzername</label>
                <input
                  type="email"
                  placeholder="Geben Sie Ihre E-Mail-Adresse ein"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full ghost-input"
                  disabled={isLoading}
                  autoComplete="off"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 uppercase tracking-[3px] font-bold ml-1">Passwort</label>
                <div className="relative group/pass">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full ghost-input pr-12"
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer z-30"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="pt-4 sm:pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-premium py-4 sm:py-5 rounded-xl sm:rounded-2xl flex items-center justify-center gap-3 cursor-pointer group disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <span className="text-[10px] sm:text-xs">Authentifizieren</span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <Lock size={18} className="text-white/50 group-hover:text-white" />
                      </motion.div>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-4">
                <button
                  type="button"
                  className="text-gray-600 text-xs hover:text-white transition-all cursor-pointer font-bold tracking-widest uppercase py-2"
                >
                  Benötigen Sie Hilfe beim Einloggen?
                </button>
              </div>
            </form>

            <div className="mt-16 text-center relative z-20">
              <p className="text-[#333] text-[9px] uppercase tracking-[4px] font-black">
                RFS &copy; MMXXVI
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
