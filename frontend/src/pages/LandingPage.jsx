import React, { useState } from 'react';
import { 
  Compass, 
  Map, 
  Fish, 
  ShieldCheck, 
  ArrowRight, 
  LogIn, 
  Activity, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Ruler, 
  BarChart3, 
  Anchor, 
  ChevronRight,
  Database,
  Info,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { formatNumber, formatPercent } from '../utils/formatters';

export default function LandingPage({ onLoginClick, onExploreGuest }) {
  const [activeTooltip, setActiveTooltip] = useState(null);

  return (
    <div className="min-h-screen bg-[#060b17] text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1 rounded-xl bg-white/5 border border-white/10 shadow-sm flex items-center justify-center">
              <img 
                src="/logotulisan.webp" 
                alt="DHAORA Logo" 
                className="h-9 w-auto object-contain cursor-pointer"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/logo-dhaora.webp';
                }}
              />
            </div>
            <span className="hidden sm:inline-block text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 font-mono font-bold">
              ASIK VOL VI
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs text-slate-300 font-medium">
            <a href="#pilar" className="hover:text-cyan-400 transition-colors">Tiga Pilar AI</a>
            <a href="#webgis" className="hover:text-cyan-400 transition-colors">CatchForecast GIS</a>
            <a href="#fishguard" className="hover:text-cyan-400 transition-colors">FishGuard CV</a>
            <a href="#bycatch" className="hover:text-cyan-400 transition-colors">ByCatch ETP</a>
            <a href="#glosarium" className="hover:text-cyan-400 transition-colors">Glosarium Maritim</a>
          </div>

          <div className="flex items-center gap-3">
            {/* Outline button for Guest Mode */}
            <button
              onClick={onExploreGuest}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500 transition-all cursor-pointer shadow-sm"
            >
              Mode Tamu
            </button>
            <button
              onClick={onLoginClick}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk Akun</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-24">
        {/* Ambient Light Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-cyan-600/15 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[450px] h-[350px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-700/60 text-cyan-300 text-xs font-semibold mb-6 backdrop-blur-sm shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>WPPNRI 712 • PPN Karangantu, Teluk Banten</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Platform AI Terpadu Observasi & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400">Analitika Perikanan Maritim</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Integrasi mutakhir pemodelan spasial daerah penangkapan ikan (WebGIS), Computer Vision morfometrik ikan terkalibrasi ArUco (FishGuard AI), dan skrining kepatuhan spesies rentan ETP (ByCatch AI).
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onLoginClick}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-xl shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk ke Dashboard Sistem</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={onExploreGuest}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-slate-700 hover:border-cyan-400 shadow-lg transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Mode Demo / Tamu (Eksplorasi)</span>
            </button>
          </div>

          {/* Product Visual Mockup Card (CatchForecast WebGIS + FishGuard CV) */}
          <div className="mt-12 max-w-5xl mx-auto rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-950/90 border border-slate-700/80 p-3 sm:p-5 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 px-2 text-xs text-slate-400">
              <div className="flex items-center gap-2 font-mono">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                <span className="ml-2 font-bold text-slate-300">dhaora.my.id • Live Marine Intelligence Console</span>
              </div>
              <div className="hidden sm:flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-[10px] font-mono">
                  SST + ETOPO1
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-950/80 border border-purple-800 text-purple-300 text-[10px] font-mono">
                  YOLOv8 + ArUco
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
              {/* Left Mockup: WebGIS Spasial Teluk Banten */}
              <div className="md:col-span-7 rounded-xl bg-slate-950 border border-slate-800 p-4 text-left relative overflow-hidden flex flex-col justify-between min-h-[240px]">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">CatchForecast AI</span>
                    <h4 className="text-sm font-bold text-white">798 Grid Spasial Teluk Banten</h4>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-300">
                    Resolusi 1 km²
                  </span>
                </div>

                {/* Simulated Heatmap Matrix */}
                <div className="my-3 grid grid-cols-8 gap-1.5 opacity-90">
                  {Array.from({ length: 32 }).map((_, i) => {
                    const intensity = (i * 17) % 5;
                    const colors = [
                      'bg-purple-900/40 border-purple-800/40',
                      'bg-indigo-700/60 border-indigo-500/50',
                      'bg-blue-600/70 border-blue-400/60',
                      'bg-cyan-500/80 border-cyan-300/80',
                      'bg-emerald-500/90 border-emerald-300'
                    ];
                    return (
                      <div 
                        key={i} 
                        className={`h-6 rounded border ${colors[intensity]} flex items-center justify-center text-[9px] font-mono text-white/90`}
                      >
                        {20 + intensity * 6}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-900">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    PPN Karangantu (6.018°S, 106.160°E)
                  </span>
                  <span className="font-mono text-cyan-300">CPUE: 42,48 kg/km²</span>
                </div>
              </div>

              {/* Right Mockup: FishGuard CV Bounding Box */}
              <div className="md:col-span-5 rounded-xl bg-slate-950 border border-slate-800 p-4 text-left relative flex flex-col justify-between min-h-[240px]">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">FishGuard AI Studio</span>
                    <h4 className="text-sm font-bold text-white">Deteksi & Estimasi ArUco</h4>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
                    50 mm Marker
                  </span>
                </div>

                {/* Simulated Bounding Box Visualization */}
                <div className="my-3 p-3 rounded-lg bg-slate-900/80 border border-cyan-500/60 relative">
                  <div className="flex items-center justify-between text-xs font-semibold text-cyan-300 mb-1">
                    <span>R. brachysoma (Kembung)</span>
                    <span className="font-mono text-cyan-400">94,2%</span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-mono">
                    Panjang Morfometrik: <strong className="text-white">18,4 cm</strong>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                    <span>Anotasi YOLO: Terverifikasi</span>
                    <span className="text-emerald-400 font-bold">Target Catch</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-900">
                  <span className="text-slate-300 font-semibold">Skrining ByCatch:</span>
                  <span className="text-amber-400 font-mono font-semibold">0 Biota ETP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid with Tooltips */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto text-left">
            {/* Stat 1 */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-sm relative group hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <div className="text-3xl font-extrabold text-cyan-400 font-mono">798</div>
                <Info className="w-4 h-4 text-slate-500 hover:text-cyan-400 cursor-pointer" />
              </div>
              <div className="text-xs text-slate-200 mt-2 font-bold">Sel Grid Spasial 1 km²</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Pemodelan Teluk Banten (0.01° x 0.01°)</div>
            </div>

            {/* Stat 2 */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-sm relative group hover:border-purple-800/80 transition-all">
              <div className="flex items-center justify-between">
                <div className="text-3xl font-extrabold text-purple-400 font-mono">R² ≥ 0,999</div>
                <Info className="w-4 h-4 text-slate-500 hover:text-purple-400 cursor-pointer" />
              </div>
              <div className="text-xs text-slate-200 mt-2 font-bold">Random Forest Precision</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Validasi silang ETOPO1 & MUR SST</div>
            </div>

            {/* Stat 3 */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-sm relative group hover:border-emerald-800/80 transition-all">
              <div className="flex items-center justify-between">
                <div className="text-3xl font-extrabold text-emerald-400 font-mono">50 mm</div>
                <Info className="w-4 h-4 text-slate-500 hover:text-emerald-400 cursor-pointer" />
              </div>
              <div className="text-xs text-slate-200 mt-2 font-bold">Kalibrasi Marker ArUco</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Morfometrik panjang tanpa kontak fisik</div>
            </div>

            {/* Stat 4 */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-sm relative group hover:border-amber-800/80 transition-all">
              <div className="flex items-center justify-between">
                <div className="text-3xl font-extrabold text-amber-400 font-mono">100%</div>
                <Info className="w-4 h-4 text-slate-500 hover:text-amber-400 cursor-pointer" />
              </div>
              <div className="text-xs text-slate-200 mt-2 font-bold">Kepatuhan Standar FAO</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Aturan Permen-KP 36/2023 & IUCN/CITES</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pillars Architecture Section */}
      <section id="pilar" className="py-16 bg-slate-900/40 border-y border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Arsitektur Terintegrasi</span>
            <h2 className="text-3xl font-extrabold text-white mt-2">
              Tiga Pilar Kecerdasan Buatan Kelautan
            </h2>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              DHAORA menggabungkan pemodelan oseanografi berbasis satelit dengan visi komputer di dermaga pendaratan untuk memantau siklus perikanan dari laut hingga pelabuhan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1: CatchForecast AI */}
            <div id="webgis" className="rounded-2xl bg-slate-900/90 border border-purple-900/40 p-6 flex flex-col justify-between hover:border-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-950/30 group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-700/50 flex items-center justify-center text-purple-400 mb-5 group-hover:scale-105 transition-transform">
                  <Map className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/60">
                    MODUL 1
                  </span>
                  <span className="text-xs text-slate-400 font-medium">WebGIS Spasial</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">CatchForecast AI</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Sistem Informasi Geografis prediktif memetakan 798 sel grid Teluk Banten dengan estimasi Catch Per Unit Effort (CPUE kg/trip) berbasis Random Forest Regression.
                </p>
                <ul className="space-y-2 text-xs text-slate-400 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>Resolusi spasial 0,01° (~1,1 km per grid)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>Data MUR SST, ETOPO1, Jarak Pantai</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>3 Spesies: Tongkol, Kembung, Rajungan</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={onExploreGuest}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-700/50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Buka WebGIS Spasial</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pillar 2: FishGuard AI */}
            <div id="fishguard" className="rounded-2xl bg-slate-900/90 border border-cyan-900/40 p-6 flex flex-col justify-between hover:border-cyan-500/50 transition-all hover:shadow-xl hover:shadow-cyan-950/30 group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-700/50 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-105 transition-transform">
                  <Fish className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                    MODUL 2
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Computer Vision</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">FishGuard AI</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Analisis visual hasil tangkapan di tempat pendaratan: deteksi multi-objek instan, penghitungan densitas ikan, dan estimasi panjang morfometrik terkalibrasi.
                </p>
                <ul className="space-y-2 text-xs text-slate-400 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>YOLO Real-time Detection & Counting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Kalibrasi ArUco 50 mm (Akurasi Tinggi)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Adaptif Substrat Es Curah & Stainless</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={onExploreGuest}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-200 border border-cyan-700/50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Buka Computer Vision</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pillar 3: ByCatch AI */}
            <div id="bycatch" className="rounded-2xl bg-slate-900/90 border border-blue-900/40 p-6 flex flex-col justify-between hover:border-blue-500/50 transition-all hover:shadow-xl hover:shadow-blue-950/30 group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-700/50 flex items-center justify-center text-blue-400 mb-5 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/60">
                    MODUL 3
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Konservasi & Audit</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">ByCatch AI</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Pusat mitigasi tangkapan sampingan dan perlindungan biota langka: klasifikasi kepatuhan alat tangkap sesuai Permen-KP No. 36/2023 dan status perlindungan ETP.
                </p>
                <ul className="space-y-2 text-xs text-slate-400 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Standar Klasifikasi FAO & Permen-KP 36</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Skrining Biota ETP (Penyu, Hiu, Pari, Mamalia)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Logbook Trip Pendaratan & Jejak Audit</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={onExploreGuest}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-blue-950/60 hover:bg-blue-900/60 text-blue-200 border border-blue-700/50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Buka Modul Konservasi</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Maritime Glossary / Definisi Istilah */}
      <section id="glosarium" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Dasar Keilmuan & Glosarium</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              Panduan Singkat Istilah Teknis Maritim
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              Penjelasan ringkas bagi enumerator, peneliti, dan pengambil kebijakan di lapangan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <ShieldCheck className="w-4 h-4" /> Spesies ETP
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Endangered, Threatened, & Protected:</strong> Spesies laut terancam punah atau dilindungi undang-undang nasional (Permen-KP) dan konvensi internasional (IUCN Red List & CITES).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Ruler className="w-4 h-4" /> Marker ArUco (50 mm)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Pola fiducial visual presisi tinggi 50 × 50 mm yang diletakkan di samping ikan untuk kalibrasi piksel ke sentimeter secara otomatis pada sudut ortogonal.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <Activity className="w-4 h-4" /> Morfometrik Ikan
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Pengukuran dimensi fisik tubuh organisme ikan (seperti panjang total / TL dan panjang standar / SL) yang digunakan untuk estimasi biomassa dan struktur umur stok.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Compass className="w-4 h-4" /> WPPNRI 712
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Wilayah Pengelolaan Perikanan Negara Republik Indonesia 712:</strong> Mencakup perairan Laut Jawa, termasuk perairan Teluk Banten dan PPN Karangantu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-10 bg-slate-950 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-1 rounded-lg bg-white/5 border border-white/10">
              <img src="/logo-dhaora.webp" alt="DHAORA" className="w-6 h-6 object-contain" />
            </div>
            <span>DHAORA — Integrated Marine AI & WebGIS Platform (ASIK VOL VI)</span>
          </div>
          <div className="text-slate-400 text-center md:text-right">
            Universitas Pendidikan Indonesia (UPI) • PPN Karangantu, Serang, Banten
          </div>
        </div>
      </footer>
    </div>
  );
}
