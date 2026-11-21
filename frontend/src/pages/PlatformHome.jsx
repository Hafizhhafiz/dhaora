import React from 'react';
import { 
  Fish, 
  ShieldCheck, 
  Waves, 
  Compass, 
  ArrowRight, 
  Database, 
  Cpu, 
  Layers, 
  Anchor, 
  Sparkles,
  Map, 
  CheckCircle2,
  Info,
  SlidersHorizontal
} from 'lucide-react';
import { formatNumber, formatPrecision } from '../utils/formatters';

export default function PlatformHome({ setActiveModule, setActiveTab, healthInfo, bycatchHealth }) {
  const isFgHealthy = healthInfo?.status === 'healthy';
  const isBcHealthy = bycatchHealth?.status === 'healthy';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>DHAORA — Digital Holistic Aquatic Observation & Research Analytics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Dashboard Sains & AI Kelautan <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400">Terpadu</span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Integrasi menyeluruh tiga pilar kecerdasan buatan kelautan ASIK VOL VI: Pemodelan habitat & prediksi spasial tangkapan (CatchForecast AI WebGIS), inspeksi morfometri & komputasi visi tangkapan pendaratan (FishGuard AI), serta audit mitigasi tangkapan sampingan & perlindungan spesies rentan ETP (ByCatch AI).
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-300 font-mono">
              <span className="flex items-center gap-1.5 bg-slate-950/90 px-3 py-1.5 rounded-lg border border-slate-800">
                <Anchor className="w-3.5 h-3.5 text-cyan-400" />
                <span>Zona: PPN Karangantu, Teluk Banten (WPPNRI 712)</span>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-950/90 px-3 py-1.5 rounded-lg border border-slate-800">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>Unified Multi-Store SQLite & Data Mart</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto min-w-[240px]">
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-2.5 shadow-lg">
              <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Status Multi-Engine</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">WebGIS (Spasial):</span>
                <span className="text-purple-300 font-semibold font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Aktif (1 km²)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">FishGuard (CV):</span>
                <span className="text-cyan-300 font-semibold font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> YOLOv8n Siap
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">ByCatch (ETP):</span>
                <span className="text-blue-300 font-semibold font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> YOLO11n + FAO
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Module Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Module 1: CatchForecast AI */}
        <div className="relative flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/60 transition-all duration-200 p-6 shadow-lg group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-800/60 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform shadow-md">
              <Map className="w-6 h-6" />
            </div>
            {/* Standard Green Status Chip */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 border border-emerald-800/60 text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Siap & Terverifikasi
            </span>
          </div>

          <h2 className="text-xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
            CatchForecast AI
          </h2>
          <p className="text-xs text-purple-300/90 font-medium mb-3">
            WebGIS Spasial & Estimasi Tangkapan Oseanografi
          </p>

          <p className="text-xs text-slate-300 leading-relaxed mb-4 flex-1">
            Peta interaktif resolusi 1 km² Teluk Banten (798 grid sel laut). Mengintegrasikan MUR SST 1km, gradien termal Sobel, batimetri ETOPO1, dan model Random Forest (R² ≥ 0,999) untuk estimasi spasial 3 spesies target.
          </p>

          <div className="space-y-2 mb-6 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
            <div className="flex justify-between">
              <span>Resolusi Grid:</span>
              <span className="text-slate-100 font-mono font-medium">1 km² (798 Sel Laut)</span>
            </div>
            <div className="flex justify-between">
              <span>Algoritma Champion:</span>
              <span className="text-purple-300 font-mono font-medium">Random Forest Regressor</span>
            </div>
            <div className="flex justify-between">
              <span>Fitur Spasial:</span>
              <span className="text-slate-100 font-mono font-medium">4 Basemap + Telemetri</span>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveModule('catchforecast');
              setActiveTab('webgis');
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-purple-600/60 text-xs font-bold transition-all cursor-pointer shadow-md hover:border-purple-400"
          >
            <span>Buka WebGIS Spasial</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Module 2: FishGuard AI */}
        <div className="relative flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 transition-all duration-200 p-6 shadow-lg group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform shadow-md">
              <Fish className="w-6 h-6" />
            </div>
            {/* Standard Green Status Chip */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 border border-emerald-800/60 text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Siap & Terverifikasi
            </span>
          </div>

          <h2 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
            FishGuard AI
          </h2>
          <p className="text-xs text-cyan-300/90 font-medium mb-3">
            Deteksi, Pencacahan & Kalibrasi Metrik Panjang
          </p>

          <p className="text-xs text-slate-300 leading-relaxed mb-4 flex-1">
            Studio computer vision lengkap: Deteksi real-time webcam/video/unggah, klasifikasi 3 spesies target MVP PPN Karangantu, pencacahan densitas meja sortir, dan estimasi panjang optik ArUco 50 mm.
          </p>

          <div className="space-y-2 mb-6 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
            <div className="flex justify-between">
              <span>Model Intelejen:</span>
              <span className="text-slate-100 font-mono font-medium">YOLOv8n Custom Weights</span>
            </div>
            <div className="flex justify-between">
              <span>Kalibrasi Optik:</span>
              <span className="text-cyan-300 font-mono font-medium">ArUco Marker 50 mm (2D)</span>
            </div>
            <div className="flex justify-between">
              <span>Fitur Deteksi:</span>
              <span className="text-slate-100 font-mono font-medium">Webcam + Video + Foto</span>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveModule('fishguard');
              setActiveTab('detection');
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-200 border border-cyan-600/60 text-xs font-bold transition-all cursor-pointer shadow-md hover:border-cyan-400"
          >
            <span>Buka Studio FishGuard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Module 3: ByCatch AI */}
        <div className="relative flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/60 transition-all duration-200 p-6 shadow-lg group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            {/* Standard Green Status Chip */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 border border-emerald-800/60 text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Siap & Terverifikasi
            </span>
          </div>

          <h2 className="text-xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
            ByCatch AI
          </h2>
          <p className="text-xs text-blue-300/90 font-medium mb-3">
            Mitigasi Tangkapan Sampingan & Skrining Biota ETP
          </p>

          <p className="text-xs text-slate-300 leading-relaxed mb-4 flex-1">
            Engine kepatuhan alat tangkap: Skrining selektivitas alat tangkap sesuai Permen-KP 36/2023, klasifikasi peran tangkapan (Target, Bycatch, Discard) berbasis standar FAO, dan verifikasi status IUCN/CITES.
          </p>

          <div className="space-y-2 mb-6 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
            <div className="flex justify-between">
              <span>Mesin Aturan:</span>
              <span className="text-slate-100 font-mono font-medium">FAO Code + Permen-KP 36</span>
            </div>
            <div className="flex justify-between">
              <span>Database Konservasi:</span>
              <span className="text-blue-300 font-mono font-medium">IUCN Red List + CITES</span>
            </div>
            <div className="flex justify-between">
              <span>Logbook Digital:</span>
              <span className="text-slate-100 font-mono font-medium">Audit Sesi Trip Nelayan</span>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveModule('bycatch');
              setActiveTab('bycatch-detect');
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-950/80 hover:bg-blue-900 text-blue-200 border border-blue-600/60 text-xs font-bold transition-all cursor-pointer shadow-md hover:border-blue-400"
          >
            <span>Buka Modul ByCatch</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
}
