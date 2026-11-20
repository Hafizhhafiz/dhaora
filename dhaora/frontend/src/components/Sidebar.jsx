import React from 'react';
import { 
  Map, 
  Scan, 
  ShieldCheck, 
  BarChart3, 
  History, 
  Compass, 
  Activity, 
  Anchor,
  Layers,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, healthInfo, isDrawerOpen, setIsDrawerOpen }) {
  const menuItems = [
    { 
      id: 'webgis', 
      label: 'Peta Spasial & WebGIS', 
      desc: 'Prediksi Tangkapan 1 km² Teluk Banten', 
      icon: Map,
      badge: 'Main View'
    },
    { 
      id: 'fishguard', 
      label: 'Studio FishGuard CV', 
      desc: 'Deteksi, Cacah & Estimasi Panjang', 
      icon: Scan,
      badge: 'YOLOv8'
    },
    { 
      id: 'bycatch', 
      label: 'Pusat Konservasi ByCatch', 
      desc: 'Audit Alat Tangkap & IUCN Red List', 
      icon: ShieldCheck,
      badge: 'Permen-KP'
    },
    { 
      id: 'dashboard', 
      label: 'Dashboard Eksekutif', 
      desc: 'Pendaratan PIPP 2026 & Bioekonomi MSY', 
      icon: BarChart3 
    },
    { 
      id: 'history', 
      label: 'Arsip & Riwayat Terpadu', 
      desc: 'Log Analisis Multi-Modul', 
      icon: History 
    },
  ];

  return (
    <aside className="w-72 bg-[#080d1a] border-r border-[#1e293b] flex flex-col h-screen sticky top-0 select-none z-30 shadow-2xl">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#1e293b] bg-gradient-to-b from-[#0d1629] to-[#080d1a]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-900/40 text-white border border-cyan-400/30">
            <Anchor className="w-6 h-6 text-cyan-200 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-wider text-white font-sans">
                DHAORA
              </h1>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                HUB
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-tight">
              Marine AI & WebGIS Teluk Banten
            </p>
          </div>
        </div>

        {/* Study Domain Pill */}
        <div className="mt-3.5 px-3 py-1.5 rounded-lg bg-[#0f172a] border border-[#1e293b] flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Compass className="w-3.5 h-3.5 text-cyan-400" /> WPPNRI 712
          </span>
          <span className="text-slate-400">PPN Karangantu</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          Modul Terintegrasi
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-start gap-3.5 p-3 rounded-xl text-left transition-all duration-200 group relative ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-950/60 to-blue-950/40 text-white border border-cyan-500/40 shadow-lg shadow-cyan-950/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0f172a]/70 border border-transparent'
              }`}
            >
              <div className={`p-2 rounded-lg mt-0.5 transition-colors ${
                isActive ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30' : 'bg-[#131e36] text-slate-400 group-hover:text-cyan-300'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-sm font-semibold truncate ${isActive ? 'text-cyan-200' : 'text-slate-200'}`}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                      isActive 
                        ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/30' 
                        : 'bg-[#1e293b] text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {item.desc}
                </p>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Quick Drawer Action in WebGIS */}
      {activeTab === 'webgis' && (
        <div className="p-3 border-t border-[#1e293b] bg-[#0c1424]">
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            {isDrawerOpen ? 'Tutup Quick Analysis Dock' : 'Buka Quick Analysis Dock'}
          </button>
        </div>
      )}

      {/* Gateway Status Footer */}
      <div className="p-4 border-t border-[#1e293b] bg-[#090f1d] text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/20" />
            <span className="font-semibold text-slate-300 text-[11px]">Gateway 8000</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">ASIK Vol. VI</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">
          Prodi SIK — UPI Kampus di Serang
        </p>
      </div>
    </aside>
  );
}
