import React, { useState } from 'react';
import { 
  Menu, 
  Cpu, 
  Sparkles, 
  LogOut, 
  User, 
  Globe, 
  ChevronRight, 
  Info,
  Layers,
  Map,
  Fish,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function Navbar({ 
  activeModule, 
  activeTab, 
  healthInfo, 
  bycatchHealth,
  onOpenDrawer,
  currentUser,
  onLogout,
  onNavigateLanding,
  onToggleMobileSidebar
}) {
  const [showEngineDetails, setShowEngineDetails] = useState(false);

  const getBreadcrumb = () => {
    if (activeModule === 'home') {
      return { module: 'DHAORA Platform', page: 'Dashboard Terpadu', icon: Layers };
    }
    if (activeModule === 'catchforecast') {
      return { module: 'CatchForecast AI', page: 'WebGIS Spasial Teluk Banten', icon: Map };
    }
    if (activeModule === 'executive') {
      return { module: 'Executive Intelligence', page: 'Dashboard Eksekutif', icon: Layers };
    }
    if (activeModule === 'unified-history') {
      return { module: 'Audit Log', page: 'Riwayat Terpadu Sesi', icon: Layers };
    }
    if (activeModule === 'about') {
      return { module: 'Dokumentasi', page: 'Arsitektur & Landasan Ilmiah', icon: Info };
    }

    if (activeModule === 'bycatch') {
      let pageName = 'Screening Tangkapan';
      if (activeTab === 'bycatch-roles') pageName = 'Mesin Aturan FAO';
      if (activeTab === 'bycatch-conservation') pageName = 'Status Konservasi ETP';
      if (activeTab === 'bycatch-trips') pageName = 'Logbook Trip Pendaratan';
      return { module: 'ByCatch AI', page: pageName, icon: ShieldCheck };
    }

    // fishguard
    let pageName = 'Deteksi & Klasifikasi';
    if (activeTab === 'dashboard') pageName = 'Ringkasan CV';
    if (activeTab === 'counting') pageName = 'Penghitungan Ikan';
    if (activeTab === 'measurement') pageName = 'Estimasi Panjang ArUco';
    if (activeTab === 'history') pageName = 'Riwayat Analisis CV';
    if (activeTab === 'dataset') pageName = 'Dataset & Taksonomi';
    return { module: 'FishGuard AI', page: pageName, icon: Fish };
  };

  const getEngineInfo = () => {
    if (activeModule === 'catchforecast') {
      return 'Random Forest (R² ≥ 0,999) + MUR SST + ETOPO1';
    }
    if (activeModule === 'bycatch') {
      return 'YOLO11n + FAO Rule Engine + Permen-KP 36';
    }
    if (activeModule === 'fishguard') {
      return 'YOLOv8n + OpenCV ArUco (50 mm Kalibrasi)';
    }
    return 'DHAORA Multi-Agent Unified Gateway';
  };

  const breadcrumb = getBreadcrumb();
  const Icon = breadcrumb.icon;

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Hamburger & Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 lg:hidden cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400 shrink-0">
            <Icon className="w-4 h-4" />
          </div>

          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold truncate">
            <span className="text-slate-400 hidden sm:inline truncate">{breadcrumb.module}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 hidden sm:inline shrink-0" />
            <span className="text-slate-100 font-bold truncate">{breadcrumb.page}</span>
          </div>
        </div>
      </div>

      {/* Right: Actions, Engine Info Popover, User Session */}
      <div className="flex items-center gap-2 sm:gap-3 text-xs shrink-0">
        {onNavigateLanding && (
          <button
            onClick={onNavigateLanding}
            title="Kembali ke Landing Page Publik"
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-medium transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Beranda Publik</span>
          </button>
        )}

        {onOpenDrawer && (
          <button
            onClick={onOpenDrawer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600/30 to-blue-600/30 hover:from-cyan-600/50 hover:to-blue-600/50 text-cyan-200 border border-cyan-500/40 font-semibold transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Quick Analysis</span>
          </button>
        )}

        {/* Engine Status Tooltip/Popover */}
        <div className="relative">
          <button
            onClick={() => setShowEngineDetails(!showEngineDetails)}
            className="hidden md:flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-700/80 text-slate-300 font-medium cursor-pointer transition-colors"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-[11px] font-mono text-cyan-300 hidden lg:inline">
              Engine Aktif
            </span>
          </button>

          {showEngineDetails && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-700 p-3.5 shadow-2xl z-50 text-xs space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-cyan-400" /> Spesifikasi Engine
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Online
                </span>
              </div>
              <p className="text-slate-300 font-mono text-[11px] leading-relaxed">
                {getEngineInfo()}
              </p>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                WPPNRI 712 • PPN Karangantu, Teluk Banten
              </div>
            </div>
          )}
        </div>

        {/* User Session Profile Pill */}
        {currentUser ? (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="flex items-center gap-2 bg-slate-800/90 py-1 px-2.5 rounded-xl border border-slate-700">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-[10px] font-black text-white shrink-0">
                {currentUser.avatar || 'US'}
              </div>
              <div className="text-left hidden md:block">
                <div className="text-xs font-bold text-slate-200 leading-tight truncate max-w-[120px]">
                  {currentUser.full_name || currentUser.username}
                </div>
                <div className="text-[10px] text-cyan-400 font-medium leading-tight">
                  {currentUser.role || 'Pengguna'}
                </div>
              </div>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                title="Keluar / Logout"
                className="p-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-200 border border-red-800/50 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <button
              onClick={onNavigateLanding}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 font-medium transition-all cursor-pointer"
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
