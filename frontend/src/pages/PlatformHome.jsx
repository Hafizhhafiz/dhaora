import React from 'react';
import { 
  Fish, 
  ShieldCheck, 
  Waves, 
  Compass, 
  ArrowRight, 
  Database, 
  Cpu, 
  Activity, 
  Layers, 
  ExternalLink,
  Anchor,
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function PlatformHome({ setActiveModule, setActiveTab, healthInfo, bycatchHealth }) {
  const isFgHealthy = healthInfo?.status === 'healthy';
  const isBcHealthy = bycatchHealth?.status === 'healthy';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-800/40 p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/60 border border-cyan-700/60 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>ASIK VOL VI — Unified Marine & Fisheries Intelligence Platform</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Sains Informasi Kelautan <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Terpadu</span>
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Platform komputasi visi terintegrasi untuk pemantauan perikanan berkelanjutan, identifikasi spesies tangkapan target (FishGuard AI), mitigasi tangkapan sampingan & perlindungan konservasi (ByCatch AI), serta observasi oseanografi penginderaan jauh (OceanSense AI).
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 bg-slate-950/60 px-2.5 py-1 rounded-md border border-slate-800">
                <Anchor className="w-3.5 h-3.5 text-cyan-400" />
                Zona Operasional: PPN Karangantu, Teluk Banten
              </span>
              <span className="flex items-center gap-1.5 bg-slate-950/60 px-2.5 py-1 rounded-md border border-slate-800">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                Isolasi Dual-Database SQLite Terjamin
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 min-w-[220px]">
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Status Sistem Terpadu
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">FishGuard Engine:</span>
                <span className={`font-semibold flex items-center gap-1 ${isFgHealthy ? 'text-emerald-400' : 'text-amber-400'}`}>
                  <span className={`w-2 h-2 rounded-full ${isFgHealthy ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  {isFgHealthy ? 'Aktif (YOLOv8)' : 'Connecting'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">ByCatch Engine:</span>
                <span className={`font-semibold flex items-center gap-1 ${isBcHealthy ? 'text-cyan-400' : 'text-amber-400'}`}>
                  <span className={`w-2 h-2 rounded-full ${isBcHealthy ? 'bg-cyan-400 animate-pulse' : 'bg-amber-400'}`} />
                  {isBcHealthy ? 'Aktif (YOLO11n)' : 'Connecting'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">OceanSense:</span>
                <span className="text-slate-400 font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">
                  Planned (Riset)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Module Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Module 1: FishGuard AI */}
        <div className="relative flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all duration-200 p-6 shadow-lg group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <Fish className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Modul Aktif
            </span>
          </div>

          <h2 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
            Modul 1: FishGuard AI
          </h2>
          <p className="text-xs text-slate-400 font-medium mb-3">
            Deteksi, Klasifikasi & Kalibrasi Metrik Panjang Ikan
          </p>

          <p className="text-xs text-slate-300 leading-relaxed mb-4 flex-1">
            Fokus pada identifikasi 3 spesies target MVP PPN Karangantu (Kembung Perempuan, Selar Kuning, Kuniran), penghitungan jumlah ekor otomatis, serta estimasi Total Length (TL) terkalibrasi penanda optik ArUco 50 mm.
          </p>

          <div className="space-y-2 mb-6 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
            <div className="flex justify-between">
              <span>Model Intelejen:</span>
              <span className="text-slate-200 font-mono font-medium">YOLOv8n Custom (6.19 MB)</span>
            </div>
            <div className="flex justify-between">
              <span>Metode Kalibrasi:</span>
              <span className="text-slate-200 font-mono font-medium">ArUco Marker 50 mm (CV)</span>
            </div>
            <div className="flex justify-between">
              <span>Database Log:</span>
              <span className="text-slate-200 font-mono font-medium">fishguard_history.db</span>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveModule('fishguard');
              setActiveTab('detection');
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-all duration-150 shadow-md shadow-cyan-600/20 cursor-pointer"
          >
            <span>Buka Deteksi FishGuard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Module 2: ByCatch AI */}
        <div className="relative flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 transition-all duration-200 p-6 shadow-lg group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Modul Aktif
            </span>
          </div>

          <h2 className="text-xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
            Modul 2: ByCatch AI
          </h2>
          <p className="text-xs text-slate-400 font-medium mb-3">
            Mitigasi Bycatch & Evaluasi Status Perlindungan Spesies
          </p>

          <p className="text-xs text-slate-300 leading-relaxed mb-4 flex-1">
            Mengevaluasi peran tangkapan (Target vs Tangkapan Sampingan) berdasarkan konteks operasional trip nelayan sesuai kerangka kerja FAO. Terintegrasi langsung dengan basis data otoritatif IUCN Red List v4, CITES Species+, dan Regulasi Perlindungan KKP RI.
          </p>

          <div className="space-y-2 mb-6 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
            <div className="flex justify-between">
              <span>Model Intelejen:</span>
              <span className="text-slate-200 font-mono font-medium">YOLO11n ByCatch (5.23 MB)</span>
            </div>
            <div className="flex justify-between">
              <span>Mesin Aturan:</span>
              <span className="text-slate-200 font-mono font-medium">FAO Contextual Rule Engine</span>
            </div>
            <div className="flex justify-between">
              <span>Registri Konservasi:</span>
              <span className="text-slate-200 font-mono font-medium">IUCN / CITES / JDIH KKP</span>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveModule('bycatch');
              setActiveTab('bycatch-detect');
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all duration-150 shadow-md shadow-blue-600/20 cursor-pointer"
          >
            <span>Buka ByCatch Screening</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Module 3: OceanSense AI (Planned / In Research) */}
        <div className="relative flex flex-col rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 shadow-lg group opacity-90 hover:opacity-100 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400">
              <Waves className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/70 border border-amber-800/60 text-amber-300">
              <Clock className="w-3.5 h-3.5" />
              Planned / Dalam Riset
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-200 mb-1">
            Modul 3: OceanSense AI
          </h2>
          <p className="text-xs text-slate-400 font-medium mb-3">
            Oseanografi & Penginderaan Jauh Satelit
          </p>

          <p className="text-xs text-slate-400 leading-relaxed mb-4 flex-1">
            Modul pemodelan oseanografi berbasis citra satelit (Sentinel-3 OLCI/SLSTR & MODIS Aqua). Direncanakan untuk ekstraksi Suhu Permukaan Laut (SPL/SST), konsentrasi Klorofil-a, serta deteksi front termal & upwelling Teluk Banten.
          </p>

          <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-300/90 mb-6 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>Sesuai integritas ilmiah, modul ini tidak menampilkan telemetri sintesis. Halaman riset mendokumentasikan spesifikasi sensor dan arsitektur pengolahan citra satelit.</span>
          </div>

          <button
            onClick={() => {
              setActiveModule('oceansense');
              setActiveTab('oceansense-roadmap');
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all duration-150 border border-slate-700/60 cursor-pointer"
          >
            <span>Lihat Roadmap Penelitian</span>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </button>
        </div>

      </div>

      {/* Architecture & Governance Footer Banner */}
      <div className="rounded-xl bg-slate-900/50 border border-slate-800 p-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <Cpu className="w-5 h-5 text-cyan-400 shrink-0" />
          <div>
            <span className="font-semibold text-slate-200">Arsitektur Terdistribusi ASIK VOL VI:</span> Backend FastAPI (:8000) melayani layanan inferensi independen dengan database terisolasi (`fishguard_history.db` & `app.sqlite`).
          </div>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] shrink-0 text-slate-500">
          <span>Prodi Sains Informasi Kelautan</span>
          <span>•</span>
          <span>UPI Kampus Serang</span>
        </div>
      </div>
    </div>
  );
}
