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
  AlertCircle
} from 'lucide-react';

export default function Sidebar({ 
  activeModule, 
  setActiveModule, 
  activeTab, 
  setActiveTab, 
  healthInfo, 
  bycatchHealth 
}) {
  const isFgHealthy = healthInfo?.status === 'healthy';
  const isBcHealthy = bycatchHealth?.status === 'healthy';

  // Submenu items per active module
  const fishguardSubMenu = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'detection', label: 'Deteksi & Klasifikasi', icon: Scan },
    { id: 'counting', label: 'Penghitungan Ikan', icon: Calculator },
    { id: 'measurement', label: 'Estimasi Panjang ArUco', icon: Ruler },
    { id: 'history', label: 'Riwayat Analisis', icon: Clock },
    { id: 'dataset', label: 'Dataset & Taksonomi', icon: Database },
  ];

  const bycatchSubMenu = [
    { id: 'bycatch-detect', label: 'ByCatch Screening', icon: ShieldCheck },
    { id: 'bycatch-roles', label: 'Mesin Aturan FAO', icon: Calculator },
    { id: 'bycatch-conservation', label: 'Status Konservasi', icon: ShieldAlert },
    { id: 'bycatch-trips', label: 'Pencatatan Trip & Log', icon: ClipboardList },
  ];

  const oceansenseSubMenu = [
    { id: 'oceansense-roadmap', label: 'Roadmap Oseanografi', icon: Waves },
  ];

  return (
    <aside className="w-64 bg-slate-900/95 border-r border-slate-800 flex flex-col h-screen sticky top-0 backdrop-blur-md select-none shrink-0">
      
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
            ASIK <span className="text-cyan-400 font-extrabold text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60">VOL VI</span>
          </h1>
          <p className="text-[10px] text-slate-400 truncate">Sains Informasi Kelautan UPI</p>
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
          <span>Beranda Platform ASIK</span>
        </button>

        {/* Level 1: Modules Selection */}
        <div className="space-y-1">
          <div className="px-3 pb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Pilih Modul AI
          </div>

          {/* Module 1: FishGuard AI */}
          <button
            onClick={() => {
              setActiveModule('fishguard');
              if (!fishguardSubMenu.some(m => m.id === activeTab)) {
                setActiveTab('dashboard');
              }
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeModule === 'fishguard'
                ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-800/80 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Fish className={`w-4 h-4 ${activeModule === 'fishguard' ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span className="font-semibold">FishGuard AI</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
              Aktif
            </span>
          </button>

          {/* Module 2: ByCatch AI */}
          <button
            onClick={() => {
              setActiveModule('bycatch');
              if (!bycatchSubMenu.some(m => m.id === activeTab)) {
                setActiveTab('bycatch-detect');
              }
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeModule === 'bycatch'
                ? 'bg-blue-950/70 text-blue-300 border border-blue-800/80 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className={`w-4 h-4 ${activeModule === 'bycatch' ? 'text-blue-400' : 'text-slate-400'}`} />
              <span className="font-semibold">ByCatch AI</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
              Aktif
            </span>
          </button>

          {/* Module 3: OceanSense AI (Planned) */}
          <button
            onClick={() => {
              setActiveModule('oceansense');
              setActiveTab('oceansense-roadmap');
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeModule === 'oceansense'
                ? 'bg-slate-800 text-slate-200 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Waves className={`w-4 h-4 ${activeModule === 'oceansense' ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>OceanSense AI</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800/60 font-mono">
              Planned
            </span>
          </button>
        </div>

        {/* Level 2: Sub-Navigation based on Active Module */}
        {activeModule === 'fishguard' && (
          <div className="space-y-1 pt-2 border-t border-slate-800">
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
          <div className="space-y-1 pt-2 border-t border-slate-800">
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

        {activeModule === 'oceansense' && (
          <div className="space-y-1 pt-2 border-t border-slate-800">
            <div className="px-3 pb-1 text-[10px] font-bold tracking-wider text-amber-400 uppercase">
              Submenu OceanSense
            </div>
            {oceansenseSubMenu.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Common: System About */}
        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={() => {
              setActiveModule('about');
              setActiveTab('about');
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeModule === 'about'
                ? 'bg-slate-800 text-slate-200 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Tentang & Arsitektur</span>
          </button>
        </div>

      </div>

      {/* Dual Engine Status Footer */}
      <div className="p-3.5 border-t border-slate-800 bg-slate-950/60 text-[10px] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">FishGuard:</span>
          <span className="text-cyan-400 font-mono font-semibold">
            {healthInfo?.model_mode === 'CUSTOM_SPECIES_MODEL' ? 'YOLOv8n (Custom)' : 'Online'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">ByCatch:</span>
          <span className="text-blue-400 font-mono font-semibold">
            {bycatchHealth?.model_status === 'ready' ? 'YOLO11n + FAO' : 'Connecting'}
          </span>
        </div>
        <div className="text-[9px] text-slate-400 text-center pt-1 border-t border-slate-800/60">
          PPN Karangantu, Teluk Banten
        </div>
      </div>

    </aside>
  );
}
