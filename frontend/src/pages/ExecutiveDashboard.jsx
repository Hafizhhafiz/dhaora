import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Compass, 
  Fish, 
  Activity, 
  Waves, 
  Anchor, 
  ShieldCheck, 
  Cpu,
  Info,
  HelpCircle
} from 'lucide-react';
import { getTelemetry, getSpeciesCatalog, getBycatchMetrics } from '../api/client';
import { formatNumber, formatPercent, formatPrecision, formatWeight, formatDensity } from '../utils/formatters';

export default function ExecutiveDashboard() {
  const [telemetry, setTelemetry] = useState(null);
  const [speciesList, setSpeciesList] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const [t, s, m] = await Promise.all([
          getTelemetry(),
          getSpeciesCatalog(),
          getBycatchMetrics()
        ]);
        if (t) setTelemetry(t);
        if (s && s.species) setSpeciesList(s.species);
        if (m) setMetrics(m);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
    }
    loadStats();
  }, []);

  const landingVolumeData = [
    { name: 'Kembung Perempuan', sci: 'R. brachysoma', volume: 33305, pct: 18.36, color: '#0E6E7E' },
    { name: 'Kuniran / Pepetek', sci: 'U. sulphureus', volume: 23838, pct: 13.14, color: '#EA580C' },
    { name: 'Selar Kuning', sci: 'S. leptolepis', volume: 19902, pct: 10.97, color: '#D97706' },
    { name: '20 Komoditas Lainnya', sci: 'Spesies Campuran', volume: 104332, pct: 57.53, color: '#94A3B8' },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Executive Header (#0A1A2F Dark Contrast Block) */}
      <div className="bg-[#0A1A2F] text-white border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-teal-300 border border-white/15 font-mono">
              Executive Marine Intelligence
            </span>
            <span className="text-xs text-slate-300 font-medium">PIPP KKP Karangantu 2026 & ML Telemetri</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Dashboard Eksekutif <span className="font-serif-italic font-normal">Kelautan Teluk Banten.</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Sintesis data pendaratan perikanan skala kecil, pemodelan habitat prediksi tangkapan machine learning (resolusi 1 km²), dan indikator bioekonomi kelautan Teluk Banten (WPPNRI 712).
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 border border-white/15 rounded-2xl px-4 py-3 text-xs shrink-0 shadow-sm">
          <Anchor className="w-5 h-5 text-teal-300" />
          <div>
            <div className="font-bold text-white">PPN Karangantu</div>
            <div className="text-[10px] text-slate-300 font-mono">Pusat Armada &lt; 10 GT</div>
          </div>
        </div>
      </div>

      {/* 4 Key Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider">Pendaratan 3 Spesies:</span>
            <Fish className="w-4 h-4 text-[#0E6E7E]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1220] font-mono tabular-nums">
            {formatNumber(77045)} <span className="text-xs font-normal text-slate-500">kg</span>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-1.5 tabular-nums">
            {formatPercent(42.48)} dari seluruh tangkapan pelabuhan
          </p>
        </div>

        {/* Akurasi Model Spasial with Tooltip */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider">Akurasi Model Spasial:</span>
            <div className="flex items-center gap-1.5">
              <button 
                type="button"
                onClick={() => setActiveTooltip(activeTooltip === 'r2' ? null : 'r2')}
                className="text-slate-400 hover:text-[#0E6E7E] cursor-pointer"
                title="Informasi Metodologi"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono tabular-nums">
            R² ≥ {formatPrecision(0.999, 3)}
          </div>
          <p className="text-xs text-slate-600 mt-1.5">
            Random Forest (Latensi 0,32 ms)
          </p>

          {activeTooltip === 'r2' && (
            <div className="absolute top-full left-0 right-0 mt-2 z-20 p-4 bg-white border border-slate-200 rounded-2xl text-xs text-slate-700 shadow-xl">
              <div className="font-bold text-[#0B1220] mb-1">Metodologi R²:</div>
              Dievaluasi menggunakan 10-Fold Cross Validation pada dataset oseanografi MUR SST, Batimetri ETOPO1, dan data historis logbook PPN Karangantu (798 sel grid Teluk Banten).
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider">Domain Grid Resolusi:</span>
            <Compass className="w-4 h-4 text-[#0E6E7E]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1220] font-mono tabular-nums">
            {formatNumber(798)} <span className="text-xs font-normal text-slate-500">km²</span>
          </div>
          <p className="text-xs text-slate-600 mt-1.5">
            798 sel laut Teluk Banten (1 km²)
          </p>
        </div>

        {/* Indeks Keberlanjutan with Tooltip */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider">Indeks Keberlanjutan:</span>
            <div className="flex items-center gap-1.5">
              <button 
                type="button"
                onClick={() => setActiveTooltip(activeTooltip === 'sustain' ? null : 'sustain')}
                className="text-slate-400 hover:text-[#0E6E7E] cursor-pointer"
                title="Informasi Indeks"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
              <ShieldCheck className="w-4 h-4 text-[#0E6E7E]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0E6E7E] font-mono tabular-nums">
            {metrics?.sustainability_index ? metrics.sustainability_index.split(' ')[0] : 'B+'}
          </div>
          <p className="text-xs text-slate-600 mt-1.5">
            Status: {metrics?.sustainability_index ? metrics.sustainability_index : 'Moderat Terkendali'}
          </p>

          {activeTooltip === 'sustain' && (
            <div className="absolute top-full left-0 right-0 mt-2 z-20 p-4 bg-white border border-slate-200 rounded-2xl text-xs text-slate-700 shadow-xl">
              <div className="font-bold text-[#0B1220] mb-1">Indeks Bioekonomi B+:</div>
              Rasio tangkapan non-ETP terhadap total tangkapan pendaratan, sesuai standar indikator perikanan berkelanjutan FAO dan Permen-KP No. 36/2023.
            </div>
          )}
        </div>
      </div>

      {/* Middle Grid: Landing Volumes & Bioeconomics (Equal Height Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Landing Volume Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#0B1220]">Komposisi Pendaratan Aktual PPN Karangantu 2026</h3>
                <p className="text-xs text-slate-500">Total Akumulasi Seluruh Spesies: {formatWeight(181377, 0)}</p>
              </div>
              <BarChart3 className="w-5 h-5 text-[#0E6E7E] shrink-0" />
            </div>

            <div className="space-y-3 mt-4">
              {landingVolumeData.map((d, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-bold text-[#0B1220]">{d.name}</span>
                      <span className="text-[11px] text-slate-500 italic ml-2">({d.sci})</span>
                    </div>
                    <div className="font-mono tabular-nums">
                      <span className="text-[#0B1220] font-bold">{formatWeight(d.volume, 0)}</span>
                      <span className="text-xs text-slate-600 font-semibold ml-2">({formatPercent(d.pct, 2)})</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${d.pct}%`, backgroundColor: d.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
            *Ketiga spesies target MVP menyumbang hampir separuh ({formatPercent(42.48)}) pendaratan ekonomi perikanan rakyat di Serang.
          </p>
        </div>

        {/* Oceanographic Telemetry Summary (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#0B1220]">Telemetri Lingkungan Oseanografi</h3>
                <p className="text-xs text-slate-500">Satelit Resolusi Tinggi Teluk Banten</p>
              </div>
              <Waves className="w-5 h-5 text-[#0E6E7E] shrink-0" />
            </div>

            {telemetry ? (
              <div className="space-y-3 mt-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-600 font-medium">Suhu Muka Laut Rerata (MUR SST):</div>
                    <div className="text-base font-bold text-[#0B1220] font-mono tabular-nums mt-0.5">
                      {formatNumber(telemetry?.sea_surface_temperature?.mean_celsius ?? 29.84, 2)} °C
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 font-mono tabular-nums">
                    {formatNumber(telemetry?.sea_surface_temperature?.min_celsius ?? 29.21, 2)} - {formatNumber(telemetry?.sea_surface_temperature?.max_celsius ?? 30.45, 2)} °C
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-600 font-medium">Gradien Thermal Front (Sobel):</div>
                    <div className="text-base font-bold text-[#0B1220] font-mono tabular-nums mt-0.5">
                      {formatNumber(telemetry?.thermal_front?.mean_gradient ?? 0.165, 3)} °C/km
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 font-mono tabular-nums">
                    Puncak: {formatNumber(telemetry?.thermal_front?.peak_gradient ?? 0.482, 3)} °C/km
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-600 font-medium">Kedalaman Rerata (ETOPO1):</div>
                    <div className="text-base font-bold text-[#0B1220] font-mono tabular-nums mt-0.5">
                      {formatNumber(telemetry?.bathymetry?.mean_depth_m ?? 9.7, 1)} m
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 font-mono tabular-nums">
                    Maks: {formatNumber(telemetry?.bathymetry?.max_depth_m ?? 22.8, 1)} m
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-slate-400 text-xs py-10 text-center">Memuat data telemetri oseanografi...</div>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
            Pemisahan niche habitat terbukti secara empiris: spesies pelagis berkorelasi dengan front termal permukaan, sedangkan spesies kuniran terkonsentrasi pada substrat demersal.
          </div>
        </div>
      </div>

      {/* Species Models Performance Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#0B1220]">Evaluasi Model Prediksi Spasial (Random Forest Multi-Target)</h3>
            <p className="text-xs text-slate-500">Validasi silang spasial grid 1 km² Teluk Banten (WPPNRI 712)</p>
          </div>
          <Cpu className="w-5 h-5 text-[#0E6E7E] shrink-0" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {speciesList.length > 0 ? (
            speciesList.map((sp) => (
              <div 
                key={sp.species_id} 
                className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 relative overflow-hidden shadow-sm"
              >
                <div 
                  className="absolute top-0 left-0 right-0 h-1" 
                  style={{ backgroundColor: sp.accent_color || '#0E6E7E' }} 
                />
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-[#0B1220] text-sm">{sp.local_name}</h4>
                    <span className="text-xs text-slate-500 italic">{sp.scientific_name}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">
                    {sp.category}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-500 block">R² Score:</span>
                    <span className="font-mono font-bold text-emerald-700 text-sm tabular-nums">
                      {formatPrecision(sp.spatial_r2_score, 4)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Rerata Tangkapan:</span>
                    <span className="font-mono font-bold text-[#0B1220] text-sm tabular-nums">
                      {formatDensity(sp.mean_catch_kg_per_sqkm, 2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Total Estimasi:</span>
                    <span className="font-mono font-bold text-[#0E6E7E] text-sm tabular-nums">
                      {formatWeight(sp.total_predicted_catch_kg, 0)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Alat Tangkap Standar:</span>
                    <span className="text-xs text-slate-700 font-medium truncate block">
                      {sp.standard_gear?.split('/')[0]}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-xs text-slate-400 py-6">Memuat parameter model spesies...</div>
          )}
        </div>
      </div>
    </div>
  );
}
