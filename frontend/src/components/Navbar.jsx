import React from 'react';
import { Anchor, ShieldAlert, Cpu, Sparkles, Fish, ShieldCheck, Waves, Map, BarChart3, Clock, Info } from 'lucide-react';

export default function Navbar({ 
  activeModule, 
  activeTab, 
  healthInfo, 
  bycatchHealth,
  onOpenDrawer 
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
          <Anchor className="w-5 h-5 text-cyan-400 shrink-0" />
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
        {onOpenDrawer && (
          <button
            onClick={onOpenDrawer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600/30 to-blue-600/30 hover:from-cyan-600/50 hover:to-blue-600/50 text-cyan-200 border border-cyan-500/40 font-medium transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Quick Analysis</span>
          </button>
        )}

        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-300 font-medium hidden md:inline">Engine:</span>
          <span className="text-cyan-400 font-semibold font-mono text-[11px]">
            {getEngineInfo()}
          </span>
        </div>
      </div>
    </header>
  );
}
