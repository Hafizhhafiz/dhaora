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
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`w-64 bg-white border-r border-slate-200 flex flex-col h-screen fixed lg:sticky top-0 z-50 select-none shrink-0 transition-transform duration-200 ${
        isMobileOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full lg:translate-x-0'
      }`}>
        
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div 
            onClick={() => handleNavClick('home', 'home')}
            className="flex items-center gap-3 cursor-pointer group min-w-0"
          >
            <div className="p-1 rounded-xl bg-slate-50 border border-slate-200 shrink-0">
              <img 
                src="/logo-dhaora.webp" 
                alt="DHAORA" 
                className="w-7 h-7 object-contain" 
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-[#0B1220] tracking-tight flex items-center gap-1.5 truncate">
                DHAORA <span className="text-slate-500 font-medium text-[10px] font-mono">ASIK VI</span>
              </h1>
              <p className="text-[11px] text-slate-500 truncate">Integrated Marine AI</p>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 lg:hidden cursor-pointer"
            aria-label="Tutup menu navigasi"
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
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-[#0E6E7E] hover:bg-slate-50 transition-all cursor-pointer border border-slate-200"
            >
              <Globe className="w-4 h-4 text-[#0E6E7E]" />
              <span>Beranda Publik</span>
            </button>
          )}

          {/* Level 1: Platform Hub - Dashboard */}
          <button
            onClick={() => handleNavClick('home', 'home')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeModule === 'home'
                ? 'bg-[#EBF4F6] text-[#0E6E7E] border border-[#9FD0D8]'
                : 'text-slate-700 hover:text-[#0B1220] hover:bg-slate-50'
            }`}
          >
            <Home className="w-4 h-4 text-[#0E6E7E]" />
            <span>Dashboard</span>
          </button>

          {/* Level 1: Modules Selection */}
          <div className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Modul Kelautan
            </div>

            {/* Module 1: CatchForecast AI (WebGIS) */}
            <button
              onClick={() => handleNavClick('catchforecast', 'webgis')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeModule === 'catchforecast'
                  ? 'bg-slate-100 text-[#0B1220] font-bold border-l-2 border-[#5B5FC7]'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#5B5FC7]" />
                <Map className="w-4 h-4 text-slate-500" />
                <span>CatchForecast AI</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
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
                  ? 'bg-slate-100 text-[#0B1220] font-bold border-l-2 border-[#0D9488]'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#0D9488]" />
                <Fish className="w-4 h-4 text-slate-500" />
                <span>FishGuard AI</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
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
                  ? 'bg-slate-100 text-[#0B1220] font-bold border-l-2 border-[#0284C7]'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
                <ShieldCheck className="w-4 h-4 text-slate-500" />
                <span>ByCatch AI</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                ETP
              </span>
            </button>
          </div>

          {/* Dynamic Submenu for Active Module */}
          {activeModule === 'fishguard' && (
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <div className="px-3 pb-1 text-[10px] font-bold tracking-wider text-[#0D9488] uppercase">
                Fitur FishGuard AI
              </div>
              {fishguardSubMenu.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick('fishguard', item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#EBF4F6] text-[#0E6E7E] font-semibold'
                        : 'text-slate-600 hover:text-[#0B1220] hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0E6E7E]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {activeModule === 'bycatch' && (
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <div className="px-3 pb-1 text-[10px] font-bold tracking-wider text-[#0284C7] uppercase">
                Fitur ByCatch AI
              </div>
              {bycatchSubMenu.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick('bycatch', item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#EBF4F6] text-[#0E6E7E] font-semibold'
                        : 'text-slate-600 hover:text-[#0B1220] hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0E6E7E]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Global Executive Analytics & Cross-Module Features */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <div className="px-3 pb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Analisis & Log
            </div>

            <button
              onClick={() => handleNavClick('executive', 'executive')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeModule === 'executive'
                  ? 'bg-slate-100 text-[#0B1220] font-semibold'
                  : 'text-slate-600 hover:text-[#0B1220] hover:bg-slate-50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
              <span>Dashboard Eksekutif</span>
            </button>

            <button
              onClick={() => handleNavClick('unified-history', 'unified-history')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeModule === 'unified-history'
                  ? 'bg-slate-100 text-[#0B1220] font-semibold'
                  : 'text-slate-600 hover:text-[#0B1220] hover:bg-slate-50'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Riwayat Terpadu Sesi</span>
            </button>

            <button
              onClick={() => handleNavClick('about', 'about')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeModule === 'about'
                  ? 'bg-slate-100 text-[#0B1220] font-semibold'
                  : 'text-slate-600 hover:text-[#0B1220] hover:bg-slate-50'
              }`}
            >
              <Info className="w-3.5 h-3.5 text-slate-500" />
              <span>Tentang & Arsitektur</span>
            </button>
          </div>

        </div>

        {/* User Session Quick Profile */}
        {currentUser && (
          <div className="px-3 py-2.5 border-t border-slate-200 bg-[#F8F9FA] flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#0E6E7E] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                {currentUser.avatar || 'US'}
              </div>
              <div className="min-w-0 truncate">
                <div className="text-xs font-bold text-[#0B1220] truncate">
                  {currentUser.full_name || currentUser.username}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {currentUser.role || 'Pengguna'}
                </div>
              </div>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                title="Keluar / Logout"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Unified Status Footer */}
        <div className="p-3 border-t border-slate-200 bg-white text-[11px] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Status Sistem:</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Siap & Aktif
            </span>
          </div>
          <div className="text-[10px] text-slate-400 text-center pt-1 border-t border-slate-100 font-mono">
            WPPNRI 712 • PPN Karangantu
          </div>
        </div>

      </aside>
    </>
  );
}
