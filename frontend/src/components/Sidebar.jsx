import React from 'react';
import { 
  LayoutDashboard, 
  Scan, 
  Calculator, 
  Ruler, 
  Clock, 
  Database, 
  Info,
  Fish,
  ShieldCheck, 
  ShieldAlert,
  Home,
  Map,
  BarChart3,
  Globe,
  LogOut,
  X,
  CheckCircle2
} from 'lucide-react';

export default function Sidebar({ 
  activeModule, 
  setActiveModule, 
  activeTab, 
  setActiveTab, 
  healthInfo, 
  bycatchHealth,
  onNavigateLanding,
  currentUser,
  onLogout,
  isMobileOpen,
  onCloseMobile
}) {
  const isFgHealthy = healthInfo?.status === 'healthy';
  const isBcHealthy = bycatchHealth?.status === 'healthy';

  // Submenu items per active module
  const fishguardSubMenu = [
    { id: 'dashboard', label: 'Ringkasan & Metrik CV', icon: LayoutDashboard },
    { id: 'detection', label: 'Deteksi & Klasifikasi', icon: Scan },
    { id: 'counting', label: 'Penghitungan Ikan', icon: Calculator },
    { id: 'measurement', label: 'Estimasi Panjang ArUco', icon: Ruler },
    { id: 'history', label: 'Riwayat Analisis CV', icon: Clock },
    { id: 'dataset', label: 'Dataset & Taksonomi', icon: Database },
  ];

  const bycatchSubMenu = [
    { id: 'bycatch-detect', label: 'ByCatch Screening', icon: ShieldCheck },
    { id: 'bycatch-roles', label: 'Mesin Aturan FAO', icon: Calculator },
    { id: 'bycatch-conservation', label: 'Status Konservasi ETP', icon: ShieldAlert },
    { id: 'bycatch-trips', label: 'Pencatatan Trip & Log', icon: Clock },
  ];

  const handleNavClick = (module, tab) => {
    setActiveModule(module);
    if (tab) setActiveTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`w-64 bg-slate-900/95 border-r border-slate-800 flex flex-col h-screen fixed lg:sticky top-0 z-50 backdrop-blur-md select-none shrink-0 transition-transform duration-300 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div 
            onClick={() => handleNavClick('home', 'home')}
            className="flex items-center gap-3 cursor-pointer group min-w-0"
          >
            <div className="p-1.5 rounded-xl bg-white/5 border border-white/10 shadow-sm shrink-0 group-hover:border-cyan-500/50 transition-colors">
              <img 
                src="/logo-dhaora.webp" 
                alt="DHAORA" 
                className="w-8 h-8 rounded-lg object-contain" 
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5 truncate">
                DHAORA <span className="text-cyan-400 font-extrabold text-[9px] px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60 font-mono">ASIK VI</span>
              </h1>
              <p className="text-[10px] text-slate-400 truncate">Integrated Marine AI</p>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Navigation Scroll Area */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          
          {/* Navigation to Public Landing */}
          {onNavigateLanding && (
            <button
              onClick={() => {
                onNavigateLanding();
                if (onCloseMobile) onCloseMobile();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-300 hover:bg-slate-800/70 transition-all cursor-pointer border border-slate-800 hover:border-slate-700"
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Beranda Publik</span>
            </button>
          )}

          {/* Level 1: Platform Hub - Renamed to "Dashboard" */}
          <button
            onClick={() => handleNavClick('home', 'home')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeModule === 'home'
                ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Home className="w-4 h-4 text-cyan-400" />
            <span>Dashboard</span>
          </button>

          {/* Level 1: Modules Selection */}
          <div className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Modul Kelautan Utama
            </div>

            {/* Module 1: CatchForecast AI (WebGIS) */}
            <button
              onClick={() => handleNavClick('catchforecast', 'webgis')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeModule === 'catchforecast'
                  ? 'bg-purple-900/40 text-purple-200 border border-purple-500/40 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Map className={`w-4 h-4 ${activeModule === 'catchforecast' ? 'text-purple-400' : 'text-slate-400'}`} />
                <span>CatchForecast AI</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/60 font-mono">
                WebGIS
              </span>
            </button>

            {/* Module 2: FishGuard AI */}
            <button
              onClick={() => {
                const tab = fishguardSubMenu.some(m => m.id === activeTab) ? activeTab : 'detection';
                handleNavClick('fishguard', tab);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeModule === 'fishguard'
                  ? 'bg-cyan-900/40 text-cyan-200 border border-cyan-500/40 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Fish className={`w-4 h-4 ${activeModule === 'fishguard' ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>FishGuard AI</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-mono">
                CV Suite
              </span>
            </button>

            {/* Module 3: ByCatch AI */}
            <button
              onClick={() => {
                const tab = bycatchSubMenu.some(m => m.id === activeTab) ? activeTab : 'bycatch-detect';
                handleNavClick('bycatch', tab);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeModule === 'bycatch'
                  ? 'bg-blue-900/40 text-blue-200 border border-blue-500/40 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className={`w-4 h-4 ${activeModule === 'bycatch' ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>ByCatch AI</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/60 font-mono">
                ETP
              </span>
            </button>
          </div>

          {/* Dynamic Submenu for Active Module */}
          {activeModule === 'fishguard' && (
            <div className="space-y-1 pt-2 border-t border-slate-800 animate-fadeIn">
              <div className="px-3 pb-1 text-[10px] font-bold tracking-wider text-cyan-400 uppercase">
                Fitur FishGuard AI
              </div>
              {fishguardSubMenu.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick('fishguard', item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {activeModule === 'bycatch' && (
            <div className="space-y-1 pt-2 border-t border-slate-800 animate-fadeIn">
              <div className="px-3 pb-1 text-[10px] font-bold tracking-wider text-blue-400 uppercase">
                Fitur ByCatch AI
              </div>
              {bycatchSubMenu.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick('bycatch', item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Global Executive Analytics & Cross-Module Features */}
          <div className="space-y-1 pt-2 border-t border-slate-800">
            <div className="px-3 pb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Analisis & Log Terpadu
            </div>

            <button
              onClick={() => handleNavClick('executive', 'executive')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeModule === 'executive'
                  ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Dashboard Eksekutif</span>
            </button>

            <button
              onClick={() => handleNavClick('unified-history', 'unified-history')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeModule === 'unified-history'
                  ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Riwayat Terpadu Sesi</span>
            </button>

            <button
              onClick={() => handleNavClick('about', 'about')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeModule === 'about'
                  ? 'bg-slate-800 text-slate-200 border border-slate-700 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>Tentang & Arsitektur</span>
            </button>
          </div>

        </div>

        {/* User Session Quick Profile */}
        {currentUser && (
          <div className="px-3 py-2.5 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-[10px] font-black text-white shrink-0">
                {currentUser.avatar || 'US'}
              </div>
              <div className="min-w-0 truncate">
                <div className="text-xs font-bold text-slate-200 truncate">
                  {currentUser.full_name || currentUser.username}
                </div>
                <div className="text-[10px] text-cyan-400 truncate">
                  {currentUser.role || 'Pengguna'}
                </div>
              </div>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                title="Keluar / Logout"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Unified Status Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-[10px] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Status Sistem:</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Siap & Aktif
            </span>
          </div>
          <div className="text-[9px] text-slate-500 text-center pt-1 border-t border-slate-800/60 font-mono">
            WPPNRI 712 • PPN Karangantu
          </div>
        </div>

      </aside>
    </>
  );
}
