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
      return { module: 'DHAORA Platform', page: 'Dashboard', icon: Layers };
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
    <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Mobile Hamburger & Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 rounded-xl text-slate-600 hover:text-[#0B1220] hover:bg-slate-100 lg:hidden cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-[#0E6E7E] shrink-0">
            <Icon className="w-4 h-4" />
          </div>

          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold truncate">
            <span className="text-slate-500 hidden sm:inline truncate">{breadcrumb.module}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 hidden sm:inline shrink-0" />
            <span className="text-[#0B1220] font-bold truncate">{breadcrumb.page}</span>
          </div>
        </div>
      </div>

      {/* Right: Actions, Engine Info Popover, User Session */}
      <div className="flex items-center gap-2 sm:gap-3 text-xs shrink-0">
        {onNavigateLanding && (
          <button
            onClick={onNavigateLanding}
            title="Kembali ke Beranda Publik"
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#0E6E7E]" />
            <span>Beranda Publik</span>
          </button>
        )}

        {onOpenDrawer && (
          <button
            onClick={onOpenDrawer}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0E6E7E] hover:bg-[#085461] text-white font-medium shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Quick Analysis</span>
          </button>
        )}

        {/* Engine Status Tooltip/Popover */}
        <div className="relative">
          <button
            onClick={() => setShowEngineDetails(!showEngineDetails)}
            className="hidden md:flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full border border-slate-200 text-slate-700 font-medium cursor-pointer transition-colors"
          >
            <Cpu className="w-3.5 h-3.5 text-[#0E6E7E] shrink-0" />
            <span className="text-[11px] font-mono text-slate-700 hidden lg:inline">
              Engine Aktif
            </span>
          </button>

          {showEngineDetails && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 p-4 shadow-xl z-50 text-xs space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-[#0B1220] flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-[#0E6E7E]" /> Spesifikasi Engine
                </span>
                <span className="text-[10px] text-emerald-700 font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Online
                </span>
              </div>
              <p className="text-slate-600 font-mono text-[11px] leading-relaxed">
                {getEngineInfo()}
              </p>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                WPPNRI 712 • PPN Karangantu, Teluk Banten
              </div>
            </div>
          )}
        </div>

        {/* User Session Profile Pill */}
        {currentUser ? (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="flex items-center gap-2 bg-slate-50 py-1 px-3 rounded-full border border-slate-200">
              <div className="w-6 h-6 rounded-full bg-[#0E6E7E] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                {currentUser.avatar || 'US'}
              </div>
              <div className="text-left hidden md:block">
                <div className="text-xs font-bold text-[#0B1220] leading-tight truncate max-w-[120px]">
                  {currentUser.full_name || currentUser.username}
                </div>
                <div className="text-[10px] text-slate-500 font-medium leading-tight">
                  {currentUser.role || 'Pengguna'}
                </div>
              </div>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                title="Keluar / Logout"
                className="p-1.5 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <button
              onClick={onNavigateLanding}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0E6E7E] hover:bg-[#085461] text-white font-medium transition-all cursor-pointer shadow-xs"
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
