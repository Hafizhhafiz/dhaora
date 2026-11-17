import React from 'react';
import { Anchor, ShieldAlert, Cpu, Sparkles } from 'lucide-react';

export default function Navbar({ activeTab, healthInfo }) {
  const getTabTitle = () => {
    switch(activeTab) {
      case 'dashboard': return 'Executive Fisheries Dashboard';
      case 'detection': return 'Fish Detection & Classification';
      case 'counting': return 'Fish Counting & Composition Analysis';
      case 'measurement': return 'Computer Vision Length Estimation';
      case 'history': return 'Analyses Repository & Audit Log';
      case 'dataset': return 'Dataset Pipeline & Taxonomy Standard';
      case 'about': return 'Project Architecture & About FishGuard';
      default: return 'FishGuard AI';
    }
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Anchor className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-semibold text-slate-100 tracking-tight">
            {getTabTitle()}
          </h2>
        </div>
        <span className="hidden md:inline-block text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60">
          Teluk Banten Study Zone
        </span>
      </div>

      <div className="flex items-center gap-3 text-xs">
        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-300 font-medium hidden sm:inline">Engine:</span>
          <span className="text-cyan-400 font-semibold">Ultralytics YOLO + OpenCV</span>
        </div>
      </div>
    </header>
  );
}
