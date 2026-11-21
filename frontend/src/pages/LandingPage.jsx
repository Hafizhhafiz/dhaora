import React, { useState } from 'react';
import { 
  Compass, 
  Map, 
  Fish, 
  ShieldCheck, 
  ArrowRight, 
  LogIn, 
  Layers, 
  CheckCircle2, 
  Ruler, 
  Database,
  Info,
  ChevronRight,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { formatNumber, formatPercent } from '../utils/formatters';

export default function LandingPage({ onLoginClick, onExploreGuest }) {
  const [activeTabPreview, setActiveTabPreview] = useState('catchforecast');

  return (
    <div className="min-h-screen bg-[#F6F6F3] text-[#0B1220] font-sans selection:bg-[#0E6E7E]/15 selection:text-[#0E6E7E]">
      
      {/* 1. TOP NAVBAR (Sticky, Editorial Light Translucent) */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Left: Brand Logo & Identifier */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-[#0E6E7E] rounded-lg">
              <img 
                src="/logotulisan.webp" 
                alt="DHAORA Logo" 
                className="h-8 w-auto object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/logo-dhaora.webp';
                }}
              />
            </a>
            <span className="hidden sm:inline-block text-xs font-mono text-slate-500 tracking-wider pl-2 border-l border-slate-300">
              ASIK VOL VI
            </span>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-600">
            <a href="#modul" className="hover:text-[#0E6E7E] transition-colors">Pilar Sistem</a>
            <a href="#catchforecast" className="hover:text-[#0E6E7E] transition-colors">CatchForecast</a>
            <a href="#fishguard" className="hover:text-[#0E6E7E] transition-colors">FishGuard</a>
            <a href="#bycatch" className="hover:text-[#0E6E7E] transition-colors">ByCatch</a>
            <a href="#tentang" className="hover:text-[#0E6E7E] transition-colors">Riset & Institusi</a>
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={onExploreGuest}
              className="text-xs font-medium text-slate-600 hover:text-[#0E6E7E] px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Mode Tamu
            </button>
            <button
              onClick={onLoginClick}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold border border-slate-300 hover:border-[#0E6E7E] text-[#0B1220] hover:text-[#0E6E7E] bg-white transition-all cursor-pointer shadow-sm hover:shadow"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION (Foto Full-Bleed dengan Overlay Gelap Tipis & Editorial Heading) */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden">
        {/* Background Photo */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero-teluk-banten.webp" 
            alt="Pemandangan Oseanografi Teluk Banten WPPNRI 712" 
            className="w-full h-full object-cover"
            loading="eager"
          />
          {/* Subtle Dark Editorial Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A2F]/95 via-[#0A1A2F]/75 to-[#0A1A2F]/50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-white">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9FD0D8]" />
            <span>WPPNRI 712 • Teluk Banten & PPN Karangantu</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Intelijen Perikanan <span className="font-serif-italic font-normal text-[#E2F1F3]">Teluk Banten.</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-200/90 max-w-2xl mx-auto leading-relaxed font-normal">
            Platform analitika terintegrasi observasi oseanografi, visi komputer deteksi spesimen, dan kepatuhan konservasi perikanan tangkap perairan Banten.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onLoginClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full text-sm font-semibold bg-white text-[#0B1220] hover:bg-slate-100 transition-all shadow-md cursor-pointer"
            >
              <span>Masuk ke Dashboard</span>
              <ArrowRight className="w-4 h-4 text-[#0E6E7E]" />
            </button>
            <button
              onClick={onExploreGuest}
              className="w-full sm:w-auto text-sm font-medium text-white/90 hover:text-white px-5 py-3 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              Coba Mode Tamu →
            </button>
          </div>
        </div>
      </section>

      {/* 3. BARIS STATISTIK SISTEM (Angka Besar Tanpa Kotak) */}
      <section className="bg-white border-b border-slate-200/80 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0B1220] tabular-nums">
                798
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Sel Grid Pemodelan
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0B1220] tabular-nums">
                3
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Spesies Target Utama
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0B1220] tabular-nums">
                1 km²
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Resolusi Spasial Grid
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0B1220] tabular-nums">
                712
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Wilayah Pengelolaan (WPPNRI)
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. SEKSI TIGA MODUL SISTEM */}
      <section id="modul" className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/60 text-[#0E6E7E] text-xs font-semibold uppercase tracking-wider mb-3">
            Modul Sistem
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0B1220]">
            Tiga modul, <span className="font-serif-italic font-normal">satu platform.</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Arsitektur modular yang menggabungkan kecerdasan geospasial kelautan, pengenalan citra spesimen tangkapan, dan instrumen kepatuhan perikanan berkelanjutan.
          </p>
        </div>

        {/* 3 Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          
          {/* Card 1: CatchForecast AI */}
          <div id="catchforecast" className="bg-white rounded-3xl border border-slate-200 overflow-hidden flex flex-col transition-all hover:border-slate-300 hover:shadow-sm">
            <div className="h-52 bg-slate-100 relative overflow-hidden">
              <img 
                src="/images/catchforecast-preview.webp" 
                alt="WebGIS Spasial CatchForecast AI" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-[#0B1220] shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#5B5FC7]" />
                  CatchForecast AI
                </span>
              </div>
            </div>
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-lg font-bold text-[#0B1220]">
                  Pemodelan Daerah Tangkapan
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  WebGIS interaktif 798 sel grid 1 km² memetakan estimasi densitas tangkapan (kg/km²) berbasis suhu permukaan laut MUR SST dan batimetri ETOPO1.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={onExploreGuest}
                  className="w-full py-2.5 px-4 rounded-full text-xs font-semibold text-[#0E6E7E] bg-[#EBF4F6] hover:bg-[#D8ECF0] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Buka Modul WebGIS</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: FishGuard AI (Modul Tengah Lebih Menonjol) */}
          <div id="fishguard" className="bg-white rounded-3xl border-2 border-[#0E6E7E]/30 overflow-hidden flex flex-col transition-all hover:shadow-md relative">
            <div className="h-52 bg-slate-100 relative overflow-hidden">
              <img 
                src="/images/fishguard-preview.webp" 
                alt="Computer Vision FishGuard AI" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-xs font-medium text-[#0B1220] shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#0D9488]" />
                  FishGuard AI
                </span>
              </div>
            </div>
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-lg font-bold text-[#0B1220]">
                  Visi Komputer & Morfometrik
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Deteksi YOLO otomatis pada 3 target spesies ikan lokal, penghitungan kuantitas, dan estimasi panjang fisik terkalibrasi penanda optik ArUco 50 mm.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={onExploreGuest}
                  className="w-full py-2.5 px-4 rounded-full text-xs font-semibold text-white bg-[#0E6E7E] hover:bg-[#085461] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Buka Modul Deteksi</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: ByCatch AI */}
          <div id="bycatch" className="bg-white rounded-3xl border border-slate-200 overflow-hidden flex flex-col transition-all hover:border-slate-300 hover:shadow-sm">
            <div className="h-52 bg-slate-100 relative overflow-hidden">
              <img 
                src="/images/bycatch-preview.webp" 
                alt="Audit Kepatuhan ByCatch AI" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-[#0B1220] shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
                  ByCatch AI
                </span>
              </div>
            </div>
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-lg font-bold text-[#0B1220]">
                  Skrining Konservasi & ETP
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Penyaringan kepatuhan regulasi alat tangkap Permen-KP 36/2023 dan status konservasi spesies rentan ETP merujuk taksonomi resmi FAO dan CITES.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={onExploreGuest}
                  className="w-full py-2.5 px-4 rounded-full text-xs font-semibold text-[#0E6E7E] bg-[#EBF4F6] hover:bg-[#D8ECF0] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Buka Modul ByCatch</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. SEKSI TENTANG & ARSITEKTUR (BENTO GRID 3 KARTU) */}
      <section id="tentang" className="py-20 lg:py-28 bg-[#FFFFFF] border-t border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-[#0E6E7E] text-xs font-semibold uppercase tracking-wider mb-3">
                Riset & Institusi
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0B1220]">
                Landasan ilmiah <span className="font-serif-italic font-normal">dan kolaborasi.</span>
              </h2>
            </div>
            <p className="text-sm text-slate-600 max-w-md leading-relaxed">
              Dikembangkan oleh Universitas Pendidikan Indonesia (UPI Kampus di Serang) bekerja sama dengan Pelabuhan Perikanan Nusantara (PPN) Karangantu.
            </p>
          </div>

          {/* Bento Grid (3 Cards) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Card 1: Dark Contrast Block (5 cols) */}
            <div className="lg:col-span-5 bg-[#0A1A2F] text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#9FD0D8]">
                  Kerangka Terpadu
                </span>
                <h3 className="text-2xl font-bold mt-2 leading-snug">
                  Mendukung Tata Kelola Perikanan Berkelanjutan
                </h3>
                <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  Sistem dirancang sebagai instrumen pendukung keputusan bagi peneliti, pengelola pelabuhan, dan enumerator perikanan untuk mendokumentasikan dinamika stok sumber daya hayati laut.
                </p>
              </div>

              <div className="pt-8 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={onLoginClick}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-semibold bg-white text-[#0B1220] hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Masuk Akun
                </button>
                <button
                  onClick={onExploreGuest}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-medium text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 transition-colors cursor-pointer"
                >
                  Eksplorasi Tamu
                </button>
              </div>
            </div>

            {/* Card 2: Visual Snapshot Peta (4 cols) */}
            <div className="lg:col-span-4 bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 relative min-h-[300px]">
              <img 
                src="/images/catchforecast-preview.webp" 
                alt="Peta Prediksi Tangkapan" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/80 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#0B1220]">Peta Prediksi Tangkapan</div>
                  <div className="text-[11px] text-slate-500">Esri Oseanografi & Batimetri • Resolusi 1 km²</div>
                </div>
                <Compass className="w-4 h-4 text-[#0E6E7E]" />
              </div>
            </div>

            {/* Card 3: Komposisi Spesies Target (3 cols) */}
            <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-7 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-[#0B1220] mb-1">
                  Komposisi Spesies Target
                </div>
                <div className="text-[11px] text-slate-500 mb-5">
                  Distribusi tangkapan Teluk Banten
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                      <span>R. brachysoma (Kembung)</span>
                      <span className="tabular-nums font-semibold">28,1%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-[#0E6E7E]" style={{ width: '28.1%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                      <span>S. leptolepis (Selar)</span>
                      <span className="tabular-nums font-semibold">46,9%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-[#0D9488]" style={{ width: '46.9%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                      <span>U. sulphureus (Kuniran)</span>
                      <span className="tabular-nums font-semibold">23,5%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-[#5B5FC7]" style={{ width: '23.5%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                      <span>Spesies Lainnya</span>
                      <span className="tabular-nums font-semibold">1,5%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-slate-300" style={{ width: '1.5%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500">
                Data audit pendaratan PPN Karangantu
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. METODOLOGI & GLOSARIUM SAINTIFIK */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10">
          <div className="max-w-2xl mb-8">
            <h3 className="text-xl font-bold text-[#0B1220]">
              Catatan Metodologi & Glosarium Ilmiah
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Penjelasan parameter pengukuran, sumber data oseanografi, dan metodologi verifikasi teknis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-[#F6F6F3] border border-slate-200/80 space-y-2">
              <div className="text-xs font-bold text-[#0E6E7E]">Koefisien Determinasi R² ≥ 0,999</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Diukur dari kalibrasi kurva regresi spasial suhu permukaan laut (MUR SST) dan batimetri terhadap data deret waktu tangkapan historis PPN Karangantu (2021–2025).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F6F6F3] border border-slate-200/80 space-y-2">
              <div className="text-xs font-bold text-[#0E6E7E]">Penanda Kalibrasi ArUco 50 mm</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Penanda optik persegi 50 mm yang diposisikan sejajar spesimen ikan untuk konversi rasio piksel ke sentimeter fisik (px/cm) tegak lurus ortogonal 90°.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F6F6F3] border border-slate-200/80 space-y-2">
              <div className="text-xs font-bold text-[#0E6E7E]">Spesies ETP & Permen-KP 36/2023</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Spesies terancam, dilindungi, dan rentan (*Endangered, Threatened, Protected*) merujuk daftar merah IUCN, appendiks CITES, dan regulasi alat tangkap Kementerian Kelautan dan Perikanan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER FORMAL (Institusi, Sumber Data, Hak Cipta) */}
      <footer className="bg-white border-t border-slate-200 py-12 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <img src="/logo-dhaora.webp" alt="DHAORA" className="h-6 w-auto" />
                <span className="font-bold text-[#0B1220] tracking-tight text-sm">DHAORA</span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                Digital Holistic Aquatic Observation & Research Analytics — Platform AI dan WebGIS terpadu perikanan maritim Teluk Banten.
              </p>
            </div>

            <div>
              <div className="font-semibold text-[#0B1220] mb-2.5">Institusi Riset</div>
              <ul className="space-y-1.5 text-slate-500">
                <li>Universitas Pendidikan Indonesia (UPI Kampus di Serang)</li>
                <li>Pelabuhan Perikanan Nusantara (PPN) Karangantu</li>
                <li>Wilayah Pengelolaan Perikanan WPPNRI 712</li>
              </ul>
            </div>

            <div>
              <div className="font-semibold text-[#0B1220] mb-2.5">Sumber Data Oseanografi</div>
              <ul className="space-y-1.5 text-slate-500">
                <li>MUR SST (GHRSST / JPL NASA)</li>
                <li>ETOPO1 Global Relief NOAA</li>
                <li>Permen-KP No. 36 Tahun 2023</li>
                <li>IUCN Red List & CITES Appendices</li>
              </ul>
            </div>

            <div>
              <div className="font-semibold text-[#0B1220] mb-2.5">Akses Sistem</div>
              <ul className="space-y-1.5 text-slate-500">
                <li>
                  <button onClick={onLoginClick} className="hover:text-[#0E6E7E] transition-colors cursor-pointer">
                    Masuk Akun Pengguna
                  </button>
                </li>
                <li>
                  <button onClick={onExploreGuest} className="hover:text-[#0E6E7E] transition-colors cursor-pointer">
                    Mode Tamu / Eksplorasi
                  </button>
                </li>
                <li>
                  <span className="text-slate-400">Kompetisi ASIK VOL VI 2026</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
            <div>
              © 2026 DHAORA • ASIK VOL VI. Hak cipta dilindungi undang-undang.
            </div>
            <div className="font-mono text-slate-400">
              v2.0.0-editorial
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
