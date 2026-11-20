import React, { useState } from 'react';
import { 
  Compass, 
  LogIn, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles,
  Award
} from 'lucide-react';
import { loginUser } from '../api/client';

export default function LoginPage({ onLoginSuccess, onBackToLanding, onGuestAccess }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDemoRole, setSelectedDemoRole] = useState('admin');

  const demoAccounts = [
    {
      id: 'admin',
      role: 'Administrator',
      username: 'admin',
      password: 'admin123',
      desc: 'Akses Penuh Konfigurasi & Audit Terpadu',
      badgeColor: 'border-purple-600 bg-purple-950/70 text-purple-300'
    },
    {
      id: 'peneliti',
      role: 'Peneliti (UPI)',
      username: 'peneliti',
      password: 'dhaora2026',
      desc: 'Akses Analisis WebGIS & Riset Komputer Visi',
      badgeColor: 'border-cyan-600 bg-cyan-950/70 text-cyan-300'
    },
    {
      id: 'nelayan',
      role: 'Enumerator / Nelayan',
      username: 'nelayan',
      password: 'nelayan123',
      desc: 'Pencatatan Trip Nelayan & Skrining Bycatch',
      badgeColor: 'border-emerald-600 bg-emerald-950/70 text-emerald-300'
    }
  ];

  const handleSelectDemo = (acc) => {
    setSelectedDemoRole(acc.id);
    setUsername(acc.username);
    setPassword(acc.password);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Harap masukkan username dan password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await loginUser(username, password);
      if (response && response.user) {
        onLoginSuccess(response.user);
      } else {
        throw new Error('Data pengguna tidak ditemukan');
      }
    } catch (err) {
      setError(err.message || 'Login gagal. Periksa kembali kredensial Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060b17] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-cyan-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Back button */}
      <div className="w-full max-w-md mb-6">
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda Publik</span>
        </button>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative z-10">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white mb-3">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-xl font-black text-white tracking-wide">
            Masuk ke DHAORA
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Platform AI Kelautan Terpadu • WPPNRI 712
          </p>
        </div>

        {/* Demo Account Quick-Fill Pills */}
        <div className="mb-6">
          <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Pilih Akun Demo (1-Klik):
          </label>
          <div className="grid grid-cols-3 gap-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => handleSelectDemo(acc)}
                className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                  selectedDemoRole === acc.id
                    ? `${acc.badgeColor} ring-1 ring-cyan-400 shadow-md`
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-[11px] font-bold truncate">{acc.role}</div>
                <div className="text-[9px] text-slate-400 font-mono truncate">{acc.username}</div>
              </button>
            ))}
          </div>
          {selectedDemoRole && (
            <p className="text-[10px] text-cyan-400/90 mt-1.5 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>
                {demoAccounts.find(a => a.id === selectedDemoRole)?.desc}
              </span>
            </p>
          )}
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-800/80 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setSelectedDemoRole(null);
                }}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono"
                placeholder="Contoh: admin"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setSelectedDemoRole(null);
                }}
                className="w-full pl-9 pr-10 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Masuk Sekarang</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-slate-900 px-2 text-slate-500">atau</span>
          </div>
        </div>

        {/* Guest Access Button */}
        <button
          type="button"
          onClick={onGuestAccess}
          className="w-full py-2 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Lanjut sebagai Tamu (Guest Mode)</span>
        </button>

        {/* Affiliation footer */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
          <p className="text-[10px] text-slate-500">
            Sistem Terpadu ASIK VOL VI • UPI Kampus di Serang
          </p>
        </div>
      </div>
    </div>
  );
}