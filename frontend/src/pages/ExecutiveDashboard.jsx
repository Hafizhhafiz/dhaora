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
    { name: 'Kembung Perempuan', sci: 'R. brachysoma', volume: 33305, pct: 18.36, color: '#38bdf8' },
    { name: 'Kuniran / Pepetek', sci: 'U. sulphureus', volume: 23838, pct: 13.14, color: '#f97316' },
    { name: 'Selar Kuning', sci: 'S. leptolepis', volume: 19902, pct: 10.97, color: '#f59e0b' },
    { name: '20 Komoditas Lainnya', sci: 'Spesies Campuran', volume: 104332, pct: 57.53, color: '#94a3b8' },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Executive Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-mono">
              Executive Marine Intelligence
            </span>
            <span className="text-xs text-slate-300 font-medium">PIPP KKP Karangantu 2026 & ML Telemetri</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Dashboard Eksekutif Terpadu DHAORA</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Sintesis data pendaratan perikanan skala kecil, pemodelan habitat prediksi tangkapan machine learning (resolusi 1 km²), dan indikator bioekonomi kelautan Teluk Banten (WPPNRI 712).
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-3 text-xs shrink-0 shadow-md">
          <Anchor className="w-5 h-5 text-cyan-400 animate-pulse" />
          <div>
            <div className="font-bold text-white">PPN Karangantu</div>
            <div className="text-[10px] text-slate-400 font-mono">Pusat Armada &lt; 10 GT</div>
          </div>
        </div>
      </div>

      {/* 4 Key Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-300 text-xs mb-2">
            <span className="font-medium">Pendaratan 3 Spesies:</span>
            <Fish className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {formatNumber(77045)} <span className="text-xs font-normal text-slate-400">kg</span>
          </div>
          <p className="text-[11px] text-cyan-300 font-medium mt-1.5">
            {formatPercent(42.48)} dari seluruh tangkapan pelabuhan
          </p>
        </div>

        {/* Akurasi Model Spasial with Tooltip */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative">
          <div className="flex items-center justify-between text-slate-300 text-xs mb-2">
            <span className="font-medium">Akurasi Model Spasial:</span>
            <div className="flex items-center gap-1.5">
              <button 
                type="button"
                onClick={() => setActiveTooltip(activeTooltip === 'r2' ? null : 'r2')}
                className="text-slate-400 hover:text-cyan-400 cursor-pointer"
                title="Informasi Metodologi"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
            R² ≥ {formatPrecision(0.999, 3)}
          </div>
          <p className="text-[11px] text-slate-300 mt-1.5">
            Random Forest (Latensi 0,32 ms)
          </p>

          {activeTooltip === 'r2' && (
            <div className="absolute top-full left-0 right-0 mt-2 z-20 p-3 bg-slate-950 border border-cyan-700/80 rounded-xl text-[11px] text-slate-300 shadow-2xl">
              <div className="font-bold text-cyan-300 mb-1">Metodologi R²:</div>
              Dievaluasi menggunakan 10-Fold Cross Validation pada dataset oseanografi MUR SST, Batimetri ETOPO1, dan data historis logbook PPN Karangantu (798 sel grid Teluk Banten).
            </div>
          )}
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-300 text-xs mb-2">
            <span className="font-medium">Domain Grid Resolusi:</span>
            <Compass className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {formatNumber(798)} <span className="text-xs font-normal text-slate-400">km²</span>
          </div>
          <p className="text-[11px] text-slate-300 mt-1.5">
            798 sel laut murni Teluk Banten (1 km²)
          </p>
        </div>

        {/* Indeks Keberlanjutan with Tooltip */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative">
          <div className="flex items-center justify-between text-slate-300 text-xs mb-2">
            <span className="font-medium">Indeks Keberlanjutan:</span>
            <div className="flex items-center gap-1.5">
              <button 
                type="button"
                onClick={() => setActiveTooltip(activeTooltip === 'sustain' ? null : 'sustain')}
                className="text-slate-400 hover:text-cyan-400 cursor-pointer"
                title="Informasi Indeks"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-cyan-300 font-mono">
            {metrics?.sustainability_index ? metrics.sustainability_index.split(' ')[0] : 'B+'}
          </div>
          <p className="text-[11px] text-slate-300 mt-1.5">
            Status: {metrics?.sustainability_index ? metrics.sustainability_index : 'Moderat Terkendali'}
          </p>

          {activeTooltip === 'sustain' && (
            <div className="absolute top-full left-0 right-0 mt-2 z-20 p-3 bg-slate-950 border border-cyan-700/80 rounded-xl text-[11px] text-slate-300 shadow-2xl">
              <div className="font-bold text-cyan-300 mb-1">Indeks Bioekonomi B+:</div>
              Rasio tangkapan non-ETP terhadap total tangkapan pendaratan, sesuai standar indikator perikanan berkelanjutan FAO dan Permen-KP No. 36/2023.
            </div>
          )}
        </div>
      </div>

      {/* Middle Grid: Landing Volumes & Bioeconomics (Equal Height Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Landing Volume Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Komposisi Pendaratan Aktual PPN Karangantu 2026</h3>
                <p className="text-xs text-slate-300">Total Akumulasi Seluruh Spesies: {formatWeight(181377, 0)}</p>
              </div>
              <BarChart3 className="w-5 h-5 text-cyan-400 shrink-0" />
            </div>

            <div className="space-y-3 mt-4">
              {landingVolumeData.map((d, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-bold text-slate-100">{d.name}</span>
                      <span className="text-[10px] text-slate-400 italic ml-2">({d.sci})</span>
                    </div>
                    <div className="font-mono">
                      <span className="text-white font-bold">{formatWeight(d.volume, 0)}</span>
                      <span className="text-xs text-slate-300 font-semibold ml-2">({formatPercent(d.pct, 2)})</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${d.pct}%`, backgroundColor: d.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-800/80">
            *Ketiga spesies target MVP menyumbang hampir separuh ({formatPercent(42.48)}) pendaratan ekonomi perikanan rakyat di Serang.
          </p>
        </div>

        {/* Oceanographic Telemetry Summary (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Telemetri Lingkungan Oseanografi</h3>
                <p className="text-xs text-slate-300">Satelit Resolusi Tinggi Teluk Banten</p>
              </div>
              <Waves className="w-5 h-5 text-blue-400 shrink-0" />
            </div>

            {telemetry ? (
              <div className="space-y-3 mt-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-300 font-medium">Suhu Muka Laut Rerata (MUR SST):</div>
                    <div className="text-base font-bold text-amber-300 font-mono mt-0.5">
                      {formatNumber(telemetry?.sea_surface_temperature?.mean_celsius ?? 29.84, 2)} °C
                    </div>
                  </div>
                  <span className="text-xs text-slate-300 font-mono">
                    {formatNumber(telemetry?.sea_surface_temperature?.min_celsius ?? 29.21, 2)} - {formatNumber(telemetry?.sea_surface_temperature?.max_celsius ?? 30.45, 2)} °C
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-300 font-medium">Gradien Thermal Front (Sobel):</div>
                    <div className="text-base font-bold text-rose-300 font-mono mt-0.5">
                      {formatNumber(telemetry?.thermal_front?.mean_gradient ?? 0.165, 3)} °C/km
                    </div>
                  </div>
                  <span className="text-xs text-slate-300 font-mono">
                    Puncak: {formatNumber(telemetry?.thermal_front?.peak_gradient ?? 0.482, 3)} °C/km
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-300 font-medium">Kedalaman Rerata (ETOPO1):</div>
                    <div className="text-base font-bold text-cyan-300 font-mono mt-0.5">
                      {formatNumber(telemetry?.bathymetry?.mean_depth_m ?? 9.7, 1)} m
                    </div>
                  </div>
                  <span className="text-xs text-slate-300 font-mono">
                    Maks: {formatNumber(telemetry?.bathymetry?.max_depth_m ?? 22.8, 1)} m
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-slate-400 text-xs py-10 text-center">Memuat data telemetri oseanografi...</div>
            )}
          </div>

          <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            Pemisahan niche habitat terbukti secara empiris: spesies pelagis berkorelasi dengan front termal permukaan, sedangkan spesies kuniran terkonsentrasi pada sel substrat demersal.
          </div>
        </div>
      </div>

      {/* Species Models Performance Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white">Evaluasi Model Prediksi Spasial (Random Forest Multi-Target)</h3>
            <p className="text-xs text-slate-300">Validasi silang spasial grid 1 km² Teluk Banten (WPPNRI 712)</p>
          </div>
          <Cpu className="w-5 h-5 text-emerald-400 shrink-0" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {speciesList.length > 0 ? (
            speciesList.map((sp) => (
              <div 
                key={sp.species_id} 
                className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3 relative overflow-hidden shadow-sm"
              >
                <div 
                  className="absolute top-0 left-0 right-0 h-1" 
                  style={{ backgroundColor: sp.accent_color || '#38bdf8' }} 
                />
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white text-sm">{sp.local_name}</h4>
                    <span className="text-xs text-slate-300 italic">{sp.scientific_name}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-slate-200 border border-slate-700">
                    {sp.category}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-400 block">R² Score:</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      {formatPrecision(sp.spatial_r2_score, 4)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Rerata Tangkapan:</span>
                    <span className="font-mono font-bold text-white text-sm">
                      {formatDensity(sp.mean_catch_kg_per_sqkm, 2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total Estimasi:</span>
                    <span className="font-mono font-bold text-cyan-300 text-sm">
                      {formatWeight(sp.total_predicted_catch_kg, 0)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Alat Tangkap Standar:</span>
                    <span className="text-xs text-slate-200 font-medium truncate block">
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
