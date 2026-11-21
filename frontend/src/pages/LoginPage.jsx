import React, { useState } from 'react';
import { 
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
  Info
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
      desc: 'Akses penuh konfigurasi sistem, telemetri, dan audit terpadu.',
      badgeColor: 'border-purple-600 bg-purple-950/70 text-purple-300'
    },
    {
      id: 'peneliti',
      role: 'Peneliti (UPI)',
      username: 'peneliti',
      password: 'dhaora2026',
      desc: 'Akses pemodelan WebGIS, dataset riset, dan analisis komputer visi.',
      badgeColor: 'border-cyan-600 bg-cyan-950/70 text-cyan-300'
    },
    {
      id: 'nelayan',
      role: 'Enumerator / Nelayan',
      username: 'nelayan',
      password: 'nelayan123',
      desc: 'Pencatatan trip pendaratan Karangantu dan skrining cepat ByCatch.',
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
      setError('Harap masukkan nama pengguna dan kata sandi.');
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
      <div className="w-full max-w-md mb-4">
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda Publik</span>
        </button>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-slate-900/95 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative z-10">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-2 rounded-2xl bg-white/5 border border-white/10 shadow-md mb-3">
            <img 
              src="/logotulisan.webp" 
              alt="DHAORA Logo" 
              className="h-12 w-auto object-contain cursor-pointer"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/logo-dhaora.webp';
              }}
            />
          </div>
          <h2 className="text-xl font-black text-white tracking-wide">
            Masuk ke DHAORA Platform
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Integrated Marine AI & WebGIS Platform • ASIK VOL VI
          </p>
        </div>

        {/* Demo Account Quick-Fill Cards (Full Labels, Not Truncated) */}
        <div className="mb-5 space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
              Pilih Akun Demo (1-Klik):
            </label>
            <span className="text-[10px] text-cyan-400 font-mono font-medium">Data Teruji</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => handleSelectDemo(acc)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedDemoRole === acc.id
                    ? `${acc.badgeColor} ring-1 ring-cyan-400 shadow-md`
                    : 'border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="text-xs font-bold leading-tight">{acc.role}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">{acc.username}</div>
              </button>
            ))}
          </div>

          {selectedDemoRole && (
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span>{demoAccounts.find(a => a.id === selectedDemoRole)?.desc}</span>
            </div>
          )}

          <div className="p-2.5 rounded-xl bg-blue-950/30 border border-blue-800/40 text-[11px] text-blue-300 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 shrink-0 text-blue-400" />
            <span>Akun demo disediakan untuk evaluasi & pengujian sistem. Data bersifat contoh dan aman.</span>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Nama Pengguna (Username)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setSelectedDemoRole(null);
                }}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                placeholder="Contoh: admin"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Kata Sandi (Password)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setSelectedDemoRole(null);
                }}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
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
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-900 px-3 text-slate-400 font-medium">atau</span>
          </div>
        </div>

        {/* Guest Access Button */}
        <button
          type="button"
          onClick={onGuestAccess}
          className="w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Eksplorasi Tanpa Akun (Mode Tamu)</span>
        </button>

        {/* Affiliation footer */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
          <p className="text-xs text-slate-400">
            Sistem Terpadu ASIK VOL VI • Universitas Pendidikan Indonesia
          </p>
        </div>
      </div>
    </div>
  );
}
