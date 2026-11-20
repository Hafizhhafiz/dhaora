import React from 'react';
import { 
  LayoutDashboard, 
  Scan, 
  Calculator, 
  Ruler, 
  Clock, 
  Database, 
  Info,
  Waves, 
  Fish,
  ShieldCheck, 
  ShieldAlert,
  Home,
  Compass,
  ClipboardList,
  AlertCircle,
  MapPin,
  Map,
  BarChart3,
  Layers,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ 
  activeModule, 
  setActiveModule, 
  activeTab, 
  setActiveTab, 
  healthInfo, 
  bycatchHealth,
  onOpenDrawer
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
    { id: 'bycatch-trips', label: 'Pencatatan Trip & Log', icon: ClipboardList },
  ];

  return (
    <aside className="w-64 bg-slate-900/95 border-r border-slate-800 flex flex-col h-screen sticky top-0 backdrop-blur-md select-none shrink-0 z-20">
      
      {/* Brand Header */}
      <div 
        onClick={() => {
          setActiveModule('home');
          setActiveTab('home');
        }}
        className="p-4 border-b border-slate-800 flex items-center gap-3 cursor-pointer hover:bg-slate-800/40 transition-colors"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white shrink-0">
          <Compass className="w-5 h-5 animate-pulse" />
        </div>
        <div className="min-w-0">
          <h1 className="text-base font-bold text-white tracking-wide flex items-center gap-1.5 truncate">
            DHAORA <span className="text-cyan-400 font-extrabold text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60">ASIK VI</span>
          </h1>
          <p className="text-[10px] text-slate-400 truncate">Integrated Marine AI Platform</p>
        </div>
      </div>

      {/* Main Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        
        {/* Level 1: Platform Hub */}
        <button
          onClick={() => {
            setActiveModule('home');
            setActiveTab('home');
          }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeModule === 'home'
              ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Home className="w-4 h-4 text-cyan-400" />
          <span>Beranda Platform Terpadu</span>
        </button>

        {/* Level 1: Modules Selection */}
        <div className="space-y-1">
          <div className="px-3 pb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Modul Kelautan Utama
          </div>

          {/* Module 1: CatchForecast AI (WebGIS) */}
          <button
            onClick={() => {
              setActiveModule('catchforecast');
              setActiveTab('webgis');
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeModule === 'catchforecast'
                ? 'bg-gradient-to-r from-purple-900/40 to-blue-900/30 text-purple-200 border border-purple-500/40 font-semibold'
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
              setActiveModule('fishguard');
              if (!fishguardSubMenu.some(m => m.id === activeTab)) {
                setActiveTab('detection');
              }
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeModule === 'fishguard'
                ? 'bg-gradient-to-r from-cyan-900/40 to-blue-900/30 text-cyan-200 border border-cyan-500/40 font-semibold'
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
              setActiveModule('bycatch');
              if (!bycatchSubMenu.some(m => m.id === activeTab)) {
                setActiveTab('bycatch-detect');
              }
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeModule === 'bycatch'
                ? 'bg-gradient-to-r from-blue-900/40 to-indigo-900/30 text-blue-200 border border-blue-500/40 font-semibold'
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
          <div className="space-y-1 pt-2 border-t border-slate-800 animate-in fade-in duration-200">
            <div className="px-3 pb-1 text-[10px] font-bold tracking-wider text-cyan-400 uppercase">
              Submenu FishGuard AI
            </div>
            {fishguardSubMenu.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30'
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
          <div className="space-y-1 pt-2 border-t border-slate-800 animate-in fade-in duration-200">
            <div className="px-3 pb-1 text-[10px] font-bold tracking-wider text-blue-400 uppercase">
              Submenu ByCatch AI
            </div>
            {bycatchSubMenu.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
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
            Analisis & Operasional
          </div>

          <button
            onClick={() => {
              setActiveModule('executive');
              setActiveTab('executive');
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeModule === 'executive'
                ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Dashboard Eksekutif</span>
          </button>

          <button
            onClick={() => {
              setActiveModule('unified-history');
              setActiveTab('unified-history');
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeModule === 'unified-history'
                ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Riwayat Terpadu Sesi</span>
          </button>

          <button
            onClick={() => {
              setActiveModule('about');
              setActiveTab('about');
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
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

      {/* Triple Engine Status Footer */}
      <div className="p-3.5 border-t border-slate-800 bg-slate-950/70 text-[10px] space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">WebGIS (RF):</span>
          <span className="text-purple-400 font-mono font-semibold">
            Ready (1 km²)
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">FishGuard (CV):</span>
          <span className="text-cyan-400 font-mono font-semibold">
            {healthInfo?.model_mode === 'CUSTOM_SPECIES_MODEL' ? 'YOLOv8n (Custom)' : 'YOLOv8n Ready'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">ByCatch (ETP):</span>
          <span className="text-blue-400 font-mono font-semibold">
            {bycatchHealth?.model_status === 'ready' ? 'YOLO11n + FAO' : 'Active'}
          </span>
        </div>
        <div className="text-[9px] text-slate-400 text-center pt-1 border-t border-slate-800/60">
          WPPNRI 712 • PPN Karangantu, Teluk Banten
        </div>
      </div>

    </aside>
  );
}
