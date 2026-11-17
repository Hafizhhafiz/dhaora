import React from 'react';
import { Anchor, ShieldAlert, Cpu, Sparkles, Fish, ShieldCheck, Waves } from 'lucide-react';

export default function Navbar({ activeModule, activeTab, healthInfo, bycatchHealth }) {
  const getTabTitle = () => {
    if (activeModule === 'home') return 'Platform Unified Hub';
    if (activeModule === 'oceansense') return 'Pemodelan Oseanografi & Penginderaan Jauh';
    if (activeModule === 'about') return 'Project Architecture & Governance';

    if (activeModule === 'bycatch') {
      switch(activeTab) {
        case 'bycatch-detect': return 'ByCatch Screening & Deteksi Tangkapan';
        case 'bycatch-roles': return 'Mesin Aturan Peran Tangkapan FAO';
        case 'bycatch-conservation': return 'Status Konservasi (IUCN / CITES / KKP)';
        case 'bycatch-trips': return 'Pencatatan Trip Nelayan & Log Pendaratan';
        default: return 'ByCatch AI';
      }
    }

    switch(activeTab) {
      case 'dashboard': return 'Executive Fisheries Dashboard';
      case 'detection': return 'Fish Detection & Classification';
      case 'counting': return 'Fish Counting & Composition Analysis';
      case 'measurement': return 'Computer Vision Length Estimation';
      case 'history': return 'Analyses Repository & Audit Log';
      case 'dataset': return 'Dataset Pipeline & Taxonomy Standard';
      default: return 'FishGuard AI';
    }
  };

  const getModuleBadge = () => {
    if (activeModule === 'home') {
      return { label: 'ASIK VOL VI', color: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60' };
    }
    if (activeModule === 'fishguard') {
      return { label: 'Modul 1: FishGuard AI', color: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60' };
    }
    if (activeModule === 'bycatch') {
      return { label: 'Modul 2: ByCatch AI', color: 'bg-blue-950/80 text-blue-300 border-blue-800/60' };
    }
    if (activeModule === 'oceansense') {
      return { label: 'Modul 3: OceanSense (Planned)', color: 'bg-amber-950/80 text-amber-300 border-amber-800/60' };
    }
    return { label: 'System Info', color: 'bg-slate-800 text-slate-300 border-slate-700' };
  };

  const getEngineInfo = () => {
    if (activeModule === 'bycatch') {
      return 'Ultralytics YOLO11n + FAO Rule Engine + IUCN/CITES';
    }
    if (activeModule === 'oceansense') {
      return 'CMEMS / Sentinel-3 Remote Sensing (Roadmap)';
    }
    return 'Ultralytics YOLOv8n + OpenCV ArUco (50mm)';
  };

  const badge = getModuleBadge();

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <Anchor className="w-5 h-5 text-cyan-400 shrink-0" />
          <h2 className="text-base font-semibold text-slate-100 tracking-tight truncate">
            {getTabTitle()}
          </h2>
        </div>
        <span className={`hidden sm:inline-block text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${badge.color}`}>
          {badge.label}
        </span>
        <span className="hidden lg:inline-block text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60 font-mono">
          Teluk Banten Study Zone
        </span>
      </div>

      <div className="flex items-center gap-3 text-xs shrink-0">
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
