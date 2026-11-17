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
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, healthInfo }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'detection', label: 'Fish Detection', icon: Scan },
    { id: 'counting', label: 'Fish Counting', icon: Calculator },
    { id: 'measurement', label: 'Length Estimation', icon: Ruler },
    { id: 'history', label: 'Analysis History', icon: Clock },
    { id: 'dataset', label: 'Dataset Info', icon: Database },
    { id: 'about', label: 'About & System', icon: Info },
  ];

  return (
    <aside className="w-64 bg-slate-900/95 border-r border-slate-800 flex flex-col h-screen sticky top-0 backdrop-blur-md select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white">
          <Waves className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-1.5">
            FishGuard <span className="text-cyan-400 font-extrabold text-xs px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60">AI</span>
          </h1>
          <p className="text-[11px] text-slate-400">Fisheries Monitoring ASIK V</p>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
          Menu Utama
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* System Status Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/50">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Model AI
          </span>
          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
            healthInfo?.status === 'healthy' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60' : 'bg-amber-950 text-amber-400 border border-amber-800/60'
          }`}>
            {healthInfo?.status === 'healthy' ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Online
              </>
            ) : 'Connecting...'}
          </span>
        </div>
        <div className={`text-[11px] truncate font-mono bg-slate-900 p-1.5 rounded border ${
          healthInfo?.model_mode === 'CUSTOM_SPECIES_MODEL'
            ? 'text-cyan-400 border-cyan-800/60 font-semibold'
            : healthInfo?.status === 'healthy'
            ? 'text-amber-400 border-amber-800/60'
            : 'text-slate-500 border-slate-800/80'
        }`}>
          {healthInfo ? (healthInfo.model_mode || 'MODEL_NOT_TRAINED') : 'Menghubungkan...'}
        </div>
        <div className="mt-2 text-[10px] text-slate-400 text-center">
          Prodi SIK - UPI Kampus Serang
        </div>
      </div>
    </aside>
  );
}
