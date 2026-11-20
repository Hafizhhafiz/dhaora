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
  Map,
  BarChart3,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

export default function PlatformHome({ setActiveModule, setActiveTab, healthInfo, bycatchHealth }) {
  const isFgHealthy = healthInfo?.status === 'healthy';
  const isBcHealthy = bycatchHealth?.status === 'healthy';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-800/40 p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/60 border border-cyan-700/60 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>DHAORA — Digital Holistic Aquatic Observation & Research Analytics</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Platform Sains & AI Kelautan <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400">Terpadu</span>
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Integrasi menyeluruh tiga pilar kecerdasan buatan kelautan ASIK VOL VI: Pemodelan habitat & prediksi spasial tangkapan (CatchForecast AI WebGIS), inspeksi morfometri & komputasi visi tangkapan pendaratan (FishGuard AI), serta audit mitigasi tangkapan sampingan & perlindungan spesies rentan ETP (ByCatch AI).
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 bg-slate-950/60 px-2.5 py-1 rounded-md border border-slate-800">
                <Anchor className="w-3.5 h-3.5 text-cyan-400" />
                Zona Operasional: PPN Karangantu, Teluk Banten (WPPNRI 712)
              </span>
              <span className="flex items-center gap-1.5 bg-slate-950/60 px-2.5 py-1 rounded-md border border-slate-800">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                Unified Multi-Store SQLite & Data Mart
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 min-w-[240px]">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2.5 shadow-lg">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Status Multi-Engine</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">WebGIS (Spasial):</span>
                <span className="text-purple-400 font-semibold font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-purple-400" /> Aktif (1 km²)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">FishGuard (CV):</span>
                <span className="text-cyan-400 font-semibold font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-cyan-400" /> YOLOv8n Ready
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">ByCatch (ETP):</span>
                <span className="text-blue-400 font-semibold font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-blue-400" /> YOLO11n + FAO
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Module Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Module 1: CatchForecast AI */}
        <div className="relative flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 transition-all duration-200 p-6 shadow-lg group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-800/60 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
              <Map className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-950/80 border border-purple-800/60 text-purple-400">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
              Selesai & Terverifikasi
            </span>
          </div>

          <h2 className="text-xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
            CatchForecast AI
          </h2>
          <p className="text-xs text-purple-300/80 font-medium mb-3">
            WebGIS Spasial & Estimasi Tangkapan Oseanografi
          </p>

          <p className="text-xs text-slate-300 leading-relaxed mb-4 flex-1">
            Peta interaktif resolusi 1 km² Teluk Banten (798 grid sel laut). Mengintegrasikan MUR SST 1km, gradien termal Sobel, batimetri ETOPO1, dan model Random Forest (R² ≥ 0.999) untuk estimasi spasial 3 spesies target.
          </p>

          <div className="space-y-2 mb-6 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
            <div className="flex justify-between">
              <span>Resolusi Grid:</span>
              <span className="text-slate-200 font-mono font-medium">1 km² (798 Sel Laut)</span>
            </div>
            <div className="flex justify-between">
              <span>Algoritma Champion:</span>
              <span className="text-purple-300 font-mono font-medium">Random Forest Regressor</span>
            </div>
            <div className="flex justify-between">
              <span>Fitur Spasial:</span>
              <span className="text-slate-200 font-mono font-medium">4 Basemap + Telemetri</span>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveModule('catchforecast');
              setActiveTab('webgis');
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-semibold transition-all cursor-pointer group-hover:border-purple-400"
          >
            <span>Buka WebGIS Spasial</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Module 2: FishGuard AI */}
        <div className="relative flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all duration-200 p-6 shadow-lg group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <Fish className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              CV Suite Aktif
            </span>
          </div>

          <h2 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
            FishGuard AI
          </h2>
          <p className="text-xs text-cyan-300/80 font-medium mb-3">
            Deteksi, Pencacahan & Kalibrasi Metrik Panjang
          </p>

          <p className="text-xs text-slate-300 leading-relaxed mb-4 flex-1">
            Studio computer vision lengkap: Deteksi real-time webcam/video/unggah, klasifikasi 3 spesies target MVP PPN Karangantu, pencacahan densitas meja sortir, dan estimasi panjang optik ArUco 50 mm.
          </p>

          <div className="space-y-2 mb-6 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
            <div className="flex justify-between">
              <span>Model Intelejen:</span>
              <span className="text-slate-200 font-mono font-medium">YOLOv8n Custom Weights</span>
            </div>
            <div className="flex justify-between">
              <span>Kalibrasi Optik:</span>
              <span className="text-cyan-300 font-mono font-medium">ArUco Marker 50 mm (2D)</span>
            </div>
            <div className="flex justify-between">
              <span>Fitur Deteksi:</span>
              <span className="text-slate-200 font-mono font-medium">Webcam + Video + Foto</span>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveModule('fishguard');
              setActiveTab('detection');
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-all cursor-pointer group-hover:border-cyan-400"
          >
            <span>Buka Studio FishGuard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Module 3: ByCatch AI */}
        <div className="relative flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 transition-all duration-200 p-6 shadow-lg group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-950/80 border border-blue-800/60 text-blue-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
              Konservasi Aktif
            </span>
          </div>

          <h2 className="text-xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
            ByCatch AI
          </h2>
          <p className="text-xs text-blue-300/80 font-medium mb-3">
            Skrining Spesies Rentan ETP & Kepatuhan Regulasi
          </p>

          <p className="text-xs text-slate-300 leading-relaxed mb-4 flex-1">
            Mitigasi tangkapan sampingan & perlindungan spesies ETP berbasis Permen-KP 36/2023 dan IUCN Red List. Dilengkapi mesin aturan FAO peran tangkapan dan logbook trip nelayan Karangantu.
          </p>

          <div className="space-y-2 mb-6 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
            <div className="flex justify-between">
              <span>Model Skrining:</span>
              <span className="text-slate-200 font-mono font-medium">YOLO11n Conservation</span>
            </div>
            <div className="flex justify-between">
              <span>Rule Engine:</span>
              <span className="text-blue-300 font-mono font-medium">FAO Guidelines + Permen-KP</span>
            </div>
            <div className="flex justify-between">
              <span>Profil Spesies:</span>
              <span className="text-slate-200 font-mono font-medium">IUCN Red List & CITES</span>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveModule('bycatch');
              setActiveTab('bycatch-detect');
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-semibold transition-all cursor-pointer group-hover:border-blue-400"
          >
            <span>Buka Pusat ByCatch</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>

      {/* Cross-Module Operational Quick Links */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/90 border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" /> Modul Operasional & Laporan Lintas Sistem
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Akses cepat metrik eksekutif terintegrasi, riwayat audit lengkap, atau landasan ilmiah platform.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setActiveModule('executive');
                setActiveTab('executive');
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
            >
              <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Dashboard Eksekutif</span>
            </button>
            <button
              onClick={() => {
                setActiveModule('unified-history');
                setActiveTab('unified-history');
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span>Riwayat Terpadu Sesi</span>
            </button>
            <button
              onClick={() => {
                setActiveModule('about');
                setActiveTab('about');
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>Landasan Ilmiah</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
