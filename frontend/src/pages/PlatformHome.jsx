import React from 'react';
import { 
  Fish, 
  ShieldCheck, 
  Compass, 
  ArrowRight, 
  Database, 
  Layers, 
  Anchor, 
  Map, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { formatNumber } from '../utils/formatters';

export default function PlatformHome({ setActiveModule, setActiveTab, healthInfo, bycatchHealth }) {
  const isFgHealthy = healthInfo?.status === 'healthy';
  const isBcHealthy = bycatchHealth?.status === 'healthy';

  return (
    <div className="space-y-8 animate-fadeIn text-[#0B1220]">
      
      {/* 1. Header Banner (Clean Editorial Card) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-7 sm:p-10 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          
          <div className="space-y-3.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-[#0E6E7E] text-xs font-semibold uppercase tracking-wider">
              <span>Platform Terpadu • ASIK VOL VI</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0B1220] tracking-tight">
              Dashboard Analitika <span className="font-serif-italic font-normal">dan Riset Maritim.</span>
            </h1>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl">
              Integrasi tiga pilar kecerdasan buatan kelautan: Pemodelan habitat spasial (CatchForecast AI WebGIS), inspeksi morfometri visi komputer (FishGuard AI), serta audit mitigasi tangkapan sampingan & kepatuhan regulasi (ByCatch AI).
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-600">
              <span className="flex items-center gap-1.5 bg-[#F6F6F3] px-3 py-1.5 rounded-full border border-slate-200 font-medium">
                <Anchor className="w-3.5 h-3.5 text-[#0E6E7E]" />
                <span>Zona: PPN Karangantu, Teluk Banten (WPPNRI 712)</span>
              </span>
              <span className="flex items-center gap-1.5 bg-[#F6F6F3] px-3 py-1.5 rounded-full border border-slate-200 font-medium">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Multi-Store SQLite & Data Mart Oseanografi</span>
              </span>
            </div>
          </div>

          {/* Quick Engine Telemetry Box */}
          <div className="w-full lg:w-72 bg-[#F8F9FA] border border-slate-200 rounded-2xl p-5 space-y-3 shrink-0">
            <div className="text-xs font-bold text-[#0B1220] uppercase tracking-wider flex items-center justify-between pb-2 border-b border-slate-200">
              <span>Status Multi-Engine</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Aktif
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">WebGIS (Spasial):</span>
                <span className="font-mono text-slate-900 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 798 Grid (1 km²)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">FishGuard (CV):</span>
                <span className="font-mono text-slate-900 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> YOLOv8n Siap
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">ByCatch (ETP):</span>
                <span className="font-mono text-slate-900 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> FAO + Permen-KP
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Three Module Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Module 1: CatchForecast AI */}
        <div className="bg-white rounded-3xl border border-slate-200 hover:border-slate-300 transition-all p-7 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-[#5B5FC7]">
                <Map className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Siap & Terverifikasi
              </span>
            </div>

            <h2 className="text-lg font-bold text-[#0B1220] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#5B5FC7]" />
              CatchForecast AI
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1 mb-3">
              WebGIS Spasial & Estimasi Tangkapan Oseanografi
            </p>

            <p className="text-xs text-slate-600 leading-relaxed mb-5">
              Peta interaktif resolusi 1 km² Teluk Banten (798 grid sel laut). Mengintegrasikan suhu permukaan laut MUR SST, batimetri ETOPO1, dan model regresi spasial untuk estimasi 3 spesies target.
            </p>

            <div className="space-y-2 mb-6 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span>Resolusi Grid:</span>
                <span className="font-mono font-medium text-slate-900">1 km² (798 Sel Laut)</span>
              </div>
              <div className="flex justify-between">
                <span>Algoritma:</span>
                <span className="font-mono font-medium text-[#5B5FC7]">Random Forest Regressor</span>
              </div>
              <div className="flex justify-between">
                <span>Data Pendukung:</span>
                <span className="font-mono font-medium text-slate-900">MUR SST + ETOPO1</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveModule('catchforecast');
              setActiveTab('webgis');
            }}
            className="w-full py-2.5 px-4 rounded-full bg-[#EBF4F6] hover:bg-[#D8ECF0] text-[#0E6E7E] text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Buka WebGIS Spasial</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Module 2: FishGuard AI */}
        <div className="bg-white rounded-3xl border border-slate-200 hover:border-slate-300 transition-all p-7 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-[#0D9488]">
                <Fish className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Siap & Terverifikasi
              </span>
            </div>

            <h2 className="text-lg font-bold text-[#0B1220] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0D9488]" />
              FishGuard AI
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1 mb-3">
              Deteksi, Pencacahan & Kalibrasi Metrik Panjang
            </p>

            <p className="text-xs text-slate-600 leading-relaxed mb-5">
              Studio visi komputer: Deteksi YOLO otomatis pada 3 target spesies ikan lokal, penghitungan densitas meja sortir, dan estimasi panjang fisik terkalibrasi penanda optik ArUco 50 mm.
            </p>

            <div className="space-y-2 mb-6 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span>Model AI:</span>
                <span className="font-mono font-medium text-slate-900">YOLOv8n Custom Weights</span>
              </div>
              <div className="flex justify-between">
                <span>Kalibrasi Optik:</span>
                <span className="font-mono font-medium text-[#0D9488]">ArUco Marker 50 mm</span>
              </div>
              <div className="flex justify-between">
                <span>Mode Input:</span>
                <span className="font-mono font-medium text-slate-900">Kamera Device + Berkas</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveModule('fishguard');
              setActiveTab('detection');
            }}
            className="w-full py-2.5 px-4 rounded-full bg-[#0E6E7E] hover:bg-[#085461] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>Buka Studio Deteksi</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Module 3: ByCatch AI */}
        <div className="bg-white rounded-3xl border border-slate-200 hover:border-slate-300 transition-all p-7 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-[#0284C7]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Siap & Terverifikasi
              </span>
            </div>

            <h2 className="text-lg font-bold text-[#0B1220] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
              ByCatch AI
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1 mb-3">
              Mitigasi Tangkapan Sampingan & Skrining Biota ETP
            </p>

            <p className="text-xs text-slate-600 leading-relaxed mb-5">
              Instrumen kepatuhan alat tangkap: Skrining selektivitas alat tangkap sesuai Permen-KP 36/2023, klasifikasi peran tangkapan (Target, Bycatch, Discard) berbasis standar FAO, dan verifikasi IUCN/CITES.
            </p>

            <div className="space-y-2 mb-6 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span>Mesin Regulasi:</span>
                <span className="font-mono font-medium text-slate-900">FAO Code + Permen-KP 36</span>
              </div>
              <div className="flex justify-between">
                <span>Database Konservasi:</span>
                <span className="font-mono font-medium text-[#0284C7]">IUCN Red List + CITES</span>
              </div>
              <div className="flex justify-between">
                <span>Logbook Digital:</span>
                <span className="font-mono font-medium text-slate-900">Audit Trip Nelayan</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveModule('bycatch');
              setActiveTab('bycatch-detect');
            }}
            className="w-full py-2.5 px-4 rounded-full bg-[#EBF4F6] hover:bg-[#D8ECF0] text-[#0E6E7E] text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Buka Modul ByCatch</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
