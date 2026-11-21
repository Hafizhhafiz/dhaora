import React from 'react';
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
  ExternalLink, 
  CheckCircle2, 
  ShieldAlert, 
  Ruler, 
  BarChart3, 
  Anchor, 
  Award,
  Globe2,
  Cpu,
  ChevronRight,
  Database
} from 'lucide-react';

export default function LandingPage({ onLoginClick, onExploreGuest }) {
  return (
    <div className="min-h-screen bg-[#060b17] text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/logotulisan.webp" 
              alt="DHAORA Logo" 
              className="h-10 w-auto object-contain cursor-pointer"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/logo-dhaora.webp';
              }}
            />
            <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 font-mono font-semibold">
              ASIK VOL VI
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <a href="#pilar" className="hover:text-cyan-400 transition-colors">Pilar Sistem</a>
            <a href="#webgis" className="hover:text-cyan-400 transition-colors">CatchForecast GIS</a>
            <a href="#fishguard" className="hover:text-cyan-400 transition-colors">FishGuard CV</a>
            <a href="#bycatch" className="hover:text-cyan-400 transition-colors">ByCatch ETP</a>
            <a href="#institusi" className="hover:text-cyan-400 transition-colors">Riset & Institusi</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExploreGuest}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer border border-transparent hover:border-slate-700"
            >
              Mode Tamu
            </button>
            <button
              onClick={onLoginClick}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk Akun</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Ambient Light Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-700/50 text-cyan-300 text-xs font-medium mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>WPPNRI 712 • PPN Karangantu, Teluk Banten</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Platform AI Terpadu Observasi & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400">Analitika Perikanan Maritim</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Integrasi mutakhir pemodelan spasial daerah penangkapan ikan (WebGIS), Computer Vision morfometrik ikan terkalibrasi ArUco (FishGuard), dan skrining kepatuhan spesies rentan ETP (ByCatch AI).
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onLoginClick}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-xl shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk ke Dashboard Sistem</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={onExploreGuest}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 hover:border-slate-600 shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Eksplorasi Mode Demo / Tamu</span>
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">798</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Sel Grid Spasial 1 km²</div>
              <div className="text-[10px] text-slate-500">Teluk Banten (0.01° x 0.01°)</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">R² ≥ 0.999</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Random Forest Precision</div>
              <div className="text-[10px] text-slate-500">MUR SST + ETOPO1 Bathymetry</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">50 mm</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Kalibrasi Marker ArUco</div>
              <div className="text-[10px] text-slate-500">Estimasi Panjang Morfometrik</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">100%</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Kepatuhan Standar FAO</div>
              <div className="text-[10px] text-slate-500">Permen-KP 36/2023 & IUCN</div>
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
            <p className="text-slate-400 text-sm mt-3">
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
                  <span className="text-xs text-slate-400">WebGIS Spasial</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">CatchForecast AI</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Sistem Informasi Geografis prediktif memetakan 798 sel grid Teluk Banten dengan estimasi Catch Per Unit Effort (CPUE kg/trip) berbasis Random Forest Regression.
                </p>
                <ul className="space-y-2 text-xs text-slate-400 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>Resolusi spasial 0.01° (~1.1 km per grid)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>Data MUR SST, ETOPO1, Jarak Pantai</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>3 Spesies: Tongkol, Kembung, Rajungan</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={onExploreGuest}
                className="w-full py-2.5 rounded-lg text-xs font-semibold bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-700/50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
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
                  <span className="text-xs text-slate-400">Computer Vision</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">FishGuard AI</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Analisis visual hasil tangkapan di tempat pendaratan: deteksi multi-objek instan, penghitungan densitas ikan, dan estimasi panjang morfometrik terkalibrasi.
                </p>
                <ul className="space-y-2 text-xs text-slate-400 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>YOLOv8 Real-time Detection & Counting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Kalibrasi ArUco 50mm (Akurasi Tinggi)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Adaptif Substrat Es Curah & Stainless</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={onExploreGuest}
                className="w-full py-2.5 rounded-lg text-xs font-semibold bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-200 border border-cyan-700/50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
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
                  <span className="text-xs text-slate-400">Konservasi & Audit</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">ByCatch AI</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Pusat mitigasi tangkapan sampingan dan perlindungan biota langka: klasifikasi kepatuhan alat tangkap sesuai Permen-KP No. 36/2023 dan status perlindungan ETP.
                </p>
                <ul className="space-y-2 text-xs text-slate-400 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Standar Klasifikasi FAO & Permen-KP 36</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Skrining Biota ETP (Penyu, Hiu, Pari, Mamalia)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Logbook Trip Pendaratan & Jejak Audit</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={onExploreGuest}
                className="w-full py-2.5 rounded-lg text-xs font-semibold bg-blue-950/60 hover:bg-blue-900/60 text-blue-200 border border-blue-700/50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Buka Modul Konservasi</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Alur Operasional Terintegrasi</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              Dari Satelit Hingga Dermaga PPN Karangantu
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold text-sm mb-3">
                01
              </div>
              <h4 className="font-bold text-white text-sm mb-1.5">Telemetri Satelit</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Data MUR SST dan kedalaman laut ETOPO1 Teluk Banten diolah untuk memetakan habitat potensial ikan.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-purple-950 text-purple-400 flex items-center justify-center font-bold text-sm mb-3">
                02
              </div>
              <h4 className="font-bold text-white text-sm mb-1.5">Pendaratan & Foto</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hasil tangkapan kapal nelayan di PPN Karangantu difoto bersama kalibrator fiducial ArUco 50 mm.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-sm mb-3">
                03
              </div>
              <h4 className="font-bold text-white text-sm mb-1.5">Pemrosesan AI Vision</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                YOLOv8 mendeteksi taksonomi, menghitung kuantitas, dan menghitung estimasi panjang secara otomatis.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-blue-950 text-blue-400 flex items-center justify-center font-bold text-sm mb-3">
                04
              </div>
              <h4 className="font-bold text-white text-sm mb-1.5">Audit & Log Terpadu</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Skrining kepatuhan bycatch, penyimpanan logbook trip, dan visualisasi dashboard eksekutif.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Collaboration & Credentials */}
      <section id="institusi" className="py-16 bg-slate-900/60 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800/80 to-slate-900 border border-slate-700/80 rounded-2xl p-8 sm:p-10 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/60 text-cyan-300 text-xs font-semibold mb-4">
                  <Award className="w-3.5 h-3.5" />
                  <span>Landasan Riset & Pengabdian Akademik</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Program Studi Sistem Informasi Kelautan
                </h3>
                <p className="text-sm text-cyan-400 font-medium mt-1">
                  Universitas Pendidikan Indonesia (UPI) Kampus di Serang
                </p>
                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  Platform DHAORA (ASIK VOL VI) dikembangkan untuk mendukung digitalisasi perikanan skala kecil, keberlanjutan stok ikan pelagis dan demersal, serta perlindungan spesies rentan di Wilayah Pengelolaan Perikanan Negara Republik Indonesia (WPPNRI 712).
                </p>

                <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-400 font-mono">
                  <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">
                    🏛️ UPI Kampus di Serang
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">
                    🌊 WPPNRI 712 Teluk Banten
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">
                    ⚓ PPN Karangantu Banten
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
                <button
                  onClick={onLoginClick}
                  className="px-6 py-3 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Masuk ke Akun Anda</span>
                </button>
                <button
                  onClick={onExploreGuest}
                  className="px-6 py-3 rounded-xl font-medium text-xs bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Mulai Eksplorasi Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#040710] border-t border-slate-800/80 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img 
              src="/logo-dhaora.webp" 
              alt="DHAORA" 
              className="w-6 h-6 object-contain" 
            />
            <span className="font-bold text-slate-300">DHAORA / ASIK VOL VI</span>
            <span>• Integrated Marine AI Platform</span>
          </div>
          <div className="text-center sm:text-right">
            Hak Cipta © 2026 Tim Peneliti Sistem Informasi Kelautan UPI Serang.
          </div>
        </div>
      </footer>
    </div>
  );
}