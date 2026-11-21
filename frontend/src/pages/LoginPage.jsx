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
  Info
} from 'lucide-react';
import { loginUser } from '../api/client';

export default function LoginPage({ onLoginSuccess, onBackToLanding, onGuestAccess }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState('admin');

  const demoRoles = [
    {
      id: 'admin',
      role: 'Administrator',
      username: 'admin',
      password: 'admin123',
      desc: 'Konfigurasi sistem, audit terpadu, dan manajemen modul.'
    },
    {
      id: 'peneliti',
      role: 'Peneliti (UPI)',
      username: 'peneliti',
      password: 'dhaora2026',
      desc: 'WebGIS oseanografi, dataset taksonomi, dan analisis AI.'
    },
    {
      id: 'nelayan',
      role: 'Enumerator / Nelayan',
      username: 'nelayan',
      password: 'nelayan123',
      desc: 'Pencatatan trip pendaratan Karangantu dan skrining ByCatch.'
    }
  ];

  const handleSelectDemoRole = (roleItem) => {
    setSelectedRole(roleItem.id);
    setUsername(roleItem.username);
    setPassword(roleItem.password);
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
    <div className="min-h-screen bg-[#F6F6F3] text-[#0B1220] flex items-center justify-center p-4 sm:p-6 lg:p-8 selection:bg-[#0E6E7E]/15 selection:text-[#0E6E7E]">
      
      {/* Main Container Card (Two Columns Split) */}
      <div className="max-w-5xl w-full bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* Left Column: Editorial Photo & Quote (5 cols on lg) */}
        <div className="lg:col-span-5 relative bg-[#0A1A2F] text-white p-8 sm:p-10 flex flex-col justify-between overflow-hidden">
          {/* Background Photo */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/pendaratan-karangantu.webp" 
              alt="Pendaratan Ikan Karangantu" 
              className="w-full h-full object-cover"
              loading="eager"
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A2F]/95 via-[#0A1A2F]/80 to-[#0A1A2F]/55" />
          </div>

          {/* Top Brand Logo */}
          <div className="relative z-10">
            <button
              onClick={onBackToLanding}
              className="inline-flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer group mb-6"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>Kembali ke Beranda</span>
            </button>

            <div className="flex items-center gap-2.5">
              <img src="/logo-dhaora.webp" alt="DHAORA" className="h-7 w-auto" />
              <span className="font-bold tracking-tight text-white text-base">DHAORA</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                ASIK VOL VI
              </span>
            </div>
          </div>

          {/* Center Quote in Editorial Serif Italic */}
          <div className="relative z-10 my-8">
            <p className="font-serif-italic text-2xl sm:text-3xl text-slate-100 leading-snug font-normal">
              “Observasi presisi untuk keberlanjutan perikanan Teluk Banten.”
            </p>
            <p className="mt-3 text-xs text-slate-300/80 leading-relaxed">
              Pelabuhan Perikanan Nusantara Karangantu & Universitas Pendidikan Indonesia
            </p>
          </div>

          {/* Bottom Metrology Pill */}
          <div className="relative z-10 text-[11px] text-slate-400 font-mono">
            WPPNRI 712 • PPN KARANGANTU SERANG
          </div>
        </div>

        {/* Right Column: Clean White Form & Demo Role Selector (7 cols on lg) */}
        <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
          
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#0B1220]">
              Masuk ke Platform
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
              Pilih peran akun demo di bawah atau masukkan kredensial terdaftar Anda.
            </p>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Demo Roles Selector (No passwords shown) */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">
                  Pilih Akun Demo (Simulasi)
                </label>
                <span className="text-[11px] text-slate-500 italic">
                  Akun demo, data bersifat contoh
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {demoRoles.map((roleItem) => {
                  const isSelected = selectedRole === roleItem.id;
                  return (
                    <button
                      key={roleItem.id}
                      type="button"
                      onClick={() => handleSelectDemoRole(roleItem)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-[#0E6E7E] bg-[#EBF4F6] text-[#0B1220] shadow-xs' 
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold whitespace-normal">
                          {roleItem.role}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0E6E7E] shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                        {roleItem.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="username" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nama Pengguna (Username)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-[#0B1220] focus:outline-none focus:ring-2 focus:ring-[#0E6E7E] focus:border-[#0E6E7E] transition-all"
                    placeholder="Masukkan nama pengguna"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Kata Sandi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-[#0B1220] focus:outline-none focus:ring-2 focus:ring-[#0E6E7E] focus:border-[#0E6E7E] transition-all"
                    placeholder="Masukkan kata sandi"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button (Pill shape) */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#0E6E7E] hover:bg-[#085461] transition-all shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <span>Memverifikasi akun...</span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Masuk ke Dashboard</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Bottom Guest Option & Disclaimer */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <span>Tidak memiliki akun terdaftar?</span>
            <button
              onClick={onGuestAccess}
              className="text-[#0E6E7E] hover:text-[#085461] font-semibold hover:underline underline-offset-4 cursor-pointer"
            >
              Lanjut sebagai Tamu (Mode Eksplorasi) →
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
