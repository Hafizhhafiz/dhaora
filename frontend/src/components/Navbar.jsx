import React from 'react';
import { Anchor, ShieldAlert, Cpu, Sparkles, Fish, ShieldCheck, Waves, Map, BarChart3, Clock, Info, LogOut, User, Globe } from 'lucide-react';

export default function Navbar({ 
  activeModule, 
  activeTab, 
  healthInfo, 
  bycatchHealth,
  onOpenDrawer,
  currentUser,
  onLogout,
  onNavigateLanding
}) {
  const getTabTitle = () => {
    if (activeModule === 'home') return 'DHAORA — Unified Fisheries & Marine Platform';
    if (activeModule === 'catchforecast') return 'CatchForecast AI — WebGIS Prediksi Spasial Teluk Banten';
    if (activeModule === 'executive') return 'Executive Marine Intelligence — Ringkasan Eksekutif';
    if (activeModule === 'unified-history') return 'Unified Audit History — Log Terpadu Lintas Modul';
    if (activeModule === 'about') return 'Arsitektur Sistem & Landasan Ilmiah ASIK VOL VI';

    if (activeModule === 'bycatch') {
      switch(activeTab) {
        case 'bycatch-detect': return 'ByCatch AI — Screening Tangkapan & Kepatuhan Alat Tangkap';
        case 'bycatch-roles': return 'ByCatch AI — Simulasi Peran Tangkapan FAO & Permen-KP 36/2023';
        case 'bycatch-conservation': return 'ByCatch AI — Profil Status Konservasi (IUCN / CITES / KKP)';
        case 'bycatch-trips': return 'ByCatch AI — Logbook & Pencatatan Trip Pendaratan Nelayan';
        default: return 'ByCatch AI — Pusat Konservasi & Mitigasi Tangkapan Sampingan';
      }
    }

    switch(activeTab) {
      case 'dashboard': return 'FishGuard AI — Metrik & Ringkasan Computer Vision';
      case 'detection': return 'FishGuard AI — Studio Deteksi & Klasifikasi Ikan Real-time';
      case 'counting': return 'FishGuard AI — Engine Pencacahan & Kerapatan Ikan';
      case 'measurement': return 'FishGuard AI — Estimasi Panjang Morfometrik Kalibrasi ArUco 50mm';
      case 'history': return 'FishGuard AI — Riwayat Analisis Citra & Ekspor Data';
      case 'dataset': return 'FishGuard AI — Standar Taksonomi & Penjelajah Dataset';
      default: return 'FishGuard AI — Sistem Pemantauan Pendaratan Perikanan Skala Kecil';
    }
  };

  const getModuleBadge = () => {
    if (activeModule === 'home') {
      return { label: 'Platform Terpadu', color: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60' };
    }
    if (activeModule === 'catchforecast') {
      return { label: 'Modul 1: CatchForecast AI', color: 'bg-purple-950/80 text-purple-300 border-purple-800/60' };
    }
    if (activeModule === 'fishguard') {
      return { label: 'Modul 2: FishGuard AI', color: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60' };
    }
    if (activeModule === 'bycatch') {
      return { label: 'Modul 3: ByCatch AI', color: 'bg-blue-950/80 text-blue-300 border-blue-800/60' };
    }
    if (activeModule === 'executive') {
      return { label: 'Eksekutif', color: 'bg-amber-950/80 text-amber-300 border-amber-800/60' };
    }
    return { label: 'Sistem Terpadu', color: 'bg-slate-800 text-slate-300 border-slate-700' };
  };

  const getEngineInfo = () => {
    if (activeModule === 'catchforecast') {
      return 'Random Forest (R² ≥ 0.999) + MUR SST + ETOPO1';
    }
    if (activeModule === 'bycatch') {
      return 'YOLO11n + FAO Rule Engine + IUCN/CITES';
    }
    if (activeModule === 'fishguard') {
      return 'YOLOv8n + OpenCV ArUco (50mm Calibrated)';
    }
    return 'DHAORA Multi-Agent Unified Gateway';
  };

  const badge = getModuleBadge();

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <img src="/logo-dhaora.webp" alt="DHAORA" className="w-5 h-5 object-contain shrink-0" />
          <h2 className="text-sm md:text-base font-semibold text-slate-100 tracking-tight truncate">
            {getTabTitle()}
          </h2>
        </div>
        <span className={`hidden sm:inline-block text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${badge.color}`}>
          {badge.label}
        </span>
        <span className="hidden lg:inline-block text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60 font-mono">
          Teluk Banten (WPPNRI 712)
        </span>
      </div>

      <div className="flex items-center gap-3 text-xs shrink-0">
        {onNavigateLanding && (
          <button
            onClick={onNavigateLanding}
            title="Kembali ke Landing Page Publik"
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 font-medium transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Beranda Publik</span>
          </button>
        )}

        {onOpenDrawer && (
          <button
            onClick={onOpenDrawer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600/30 to-blue-600/30 hover:from-cyan-600/50 hover:to-blue-600/50 text-cyan-200 border border-cyan-500/40 font-medium transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Quick Analysis</span>
          </button>
        )}

        <div className="hidden lg:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-300 font-medium">Engine:</span>
          <span className="text-cyan-400 font-semibold font-mono text-[11px]">
            {getEngineInfo()}
          </span>
        </div>

        {/* User Session Profile Pill */}
        {currentUser ? (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="flex items-center gap-2 bg-slate-800/90 py-1 px-2.5 rounded-lg border border-slate-700">
              <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-[10px] font-black text-white">
                {currentUser.avatar || 'US'}
              </div>
              <div className="text-left hidden md:block">
                <div className="text-[11px] font-bold text-slate-200 leading-tight truncate max-w-[120px]">
                  {currentUser.full_name || currentUser.username}
                </div>
                <div className="text-[9px] text-cyan-400 font-medium leading-tight">
                  {currentUser.role || 'Pengguna'}
                </div>
              </div>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                title="Keluar / Logout"
                className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-200 border border-red-800/50 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <button
              onClick={onNavigateLanding}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 font-medium transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Masuk</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
