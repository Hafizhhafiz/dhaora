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
  Cpu
} from 'lucide-react';
import { getTelemetry, getSpeciesCatalog, getBycatchMetrics } from '../api/client';

export default function ExecutiveDashboard() {
  const [telemetry, setTelemetry] = useState(null);
  const [speciesList, setSpeciesList] = useState([]);
  const [metrics, setMetrics] = useState(null);

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
    { name: 'Kuniran', sci: 'U. sulphureus', volume: 23838, pct: 13.14, color: '#f97316' },
    { name: 'Selar Kuning', sci: 'S. leptolepis', volume: 19902, pct: 10.97, color: '#f59e0b' },
    { name: '20 Komoditas Lain', sci: 'Spesies Campuran', volume: 104332, pct: 57.53, color: '#64748b' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Executive Header */}
      <div className="bg-gradient-to-r from-[#0d1629] via-[#101b33] to-[#0d1629] border border-[#1e293b] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Executive Marine Intelligence
            </span>
            <span className="text-xs text-slate-400">PIPP KKP Karangantu 2026 & ML Telemetri</span>
          </div>
          <h2 className="text-xl font-bold text-white">Dashboard Terpadu DHAORA</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Sintesis data pendaratan perikanan skala kecil, pemodelan habitat prediksi tangkapan machine learning (resolusi 1 km²), dan indikator bioekonomi kelautan Teluk Banten (WPPNRI 712).
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#080d1a] border border-[#1e293b] rounded-xl px-4 py-3 text-xs">
          <Anchor className="w-5 h-5 text-cyan-400 animate-pulse" />
          <div>
            <div className="font-bold text-white">PPN Karangantu</div>
            <div className="text-[10px] text-slate-400">Pusat Armada &lt; 10 GT</div>
          </div>
        </div>
      </div>

      {/* 4 Key Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Pendaratan 3 Spesies Target:</span>
            <Fish className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            77.045 <span className="text-xs font-normal text-slate-400">kg</span>
          </div>
          <p className="text-[11px] text-cyan-300 mt-1">
            42,48% dari seluruh tangkapan pelabuhan
          </p>
        </div>

        <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Akurasi Model Spasial:</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">
            R² ≥ 0,999
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Random Forest Champion (Latensi 0.32 ms)
          </p>
        </div>

        <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Domain Grid Resolusi Tinggi:</span>
            <Compass className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            798 <span className="text-xs font-normal text-slate-400">km²</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            798 sel laut murni Teluk Banten (1 km²)
          </p>
        </div>

        <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Indeks Keberlanjutan:</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-300 font-mono">
            {metrics?.sustainability_index ? metrics.sustainability_index.split(' ')[0] : 'B+'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Status: {metrics?.sustainability_index ? metrics.sustainability_index : 'Moderat Terkendali'}
          </p>
        </div>
      </div>

      {/* Middle Grid: Landing Volumes & Bioeconomics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Landing Volume Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-[#0f172a] border border-[#1e293b] rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Komposisi Pendaratan Aktual PPN Karangantu 2026</h3>
              <p className="text-[11px] text-slate-400">Total Akumulasi Seluruh Spesies: 181.377 kg</p>
            </div>
            <BarChart3 className="w-5 h-5 text-cyan-400" />
          </div>

          <div className="space-y-3">
            {landingVolumeData.map((d, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[#090f1d] border border-[#1e293b] text-xs">
                <div className="flex justify-between items-center mb-1.5">
                  <div>
                    <span className="font-bold text-slate-200">{d.name}</span>
                    <span className="text-[10px] text-slate-400 italic ml-2">({d.sci})</span>
                  </div>
                  <div className="font-mono">
                    <span className="text-white font-bold">{d.volume.toLocaleString()} kg</span>
                    <span className="text-[10px] text-slate-400 ml-1.5">({d.pct}%)</span>
                  </div>
                </div>
                <div className="w-full bg-[#1e293b] h-2 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${d.pct}%`, backgroundColor: d.color }} />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed pt-2">
            *Ketiga spesies target MVP menyumbang hampir separuh pendaratan ekonomi perikanan rakyat di Serang.
          </p>
        </div>

        {/* Oceanographic Telemetry Summary (5 cols) */}
        <div className="lg:col-span-5 bg-[#0f172a] border border-[#1e293b] rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Telemetri Lingkungan Oseanografi</h3>
              <p className="text-[11px] text-slate-400">Satelit Resolusi Tinggi Teluk Banten</p>
            </div>
            <Waves className="w-5 h-5 text-blue-400" />
          </div>

          {telemetry ? (
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[#090f1d] border border-[#1e293b] flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400">Suhu Muka Laut Rerata (MUR SST):</div>
                  <div className="text-sm font-bold text-amber-300 font-mono mt-0.5">
                    {telemetry?.sea_surface_temperature?.mean_celsius ?? 29.84} °C
                  </div>
                </div>
                <span className="text-[10px] text-slate-400">
                  Rentang: {telemetry?.sea_surface_temperature?.min_celsius ?? 29.21} - {telemetry?.sea_surface_temperature?.max_celsius ?? 30.45} °C
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#090f1d] border border-[#1e293b] flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400">Gradien Thermal Front (Sobel):</div>
                  <div className="text-sm font-bold text-rose-300 font-mono mt-0.5">
                    {telemetry?.thermal_front?.mean_gradient ?? 0.165} °C/km
                  </div>
                </div>
                <span className="text-[10px] text-slate-400">
                  Puncak: {telemetry?.thermal_front?.peak_gradient ?? 0.482} °C/km
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#090f1d] border border-[#1e293b] flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400">Kedalaman Rerata (ETOPO1):</div>
                  <div className="text-sm font-bold text-cyan-300 font-mono mt-0.5">
                    {telemetry?.bathymetry?.mean_depth_m ?? 9.7} m
                  </div>
                </div>
                <span className="text-[10px] text-slate-400">
                  Maksimum: {telemetry?.bathymetry?.max_depth_m ?? 22.8} m
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0c1424] border border-[#1e293b] text-[11px] text-slate-400">
                Pemisahan niche habitat terbukti secara empiris: spesies pelagis berkorelasi dengan front termal permukaan, sedangkan spesies kuniran terkonsentrasi pada sel substrat demersal.
              </div>
            </div>
          ) : (
            <div className="text-slate-400 text-xs py-4 text-center">Memuat data telemetri oseanografi...</div>
          )}
        </div>
      </div>

      {/* Species Models Performance Section */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
          <div>
            <h3 className="text-sm font-bold text-white">Evaluasi Model Prediksi Spasial (Random Forest Multi-Target)</h3>
            <p className="text-[11px] text-slate-400">Validasi silang spasial grid 1 km² Teluk Banten (WPPNRI 712)</p>
          </div>
          <Cpu className="w-5 h-5 text-emerald-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {speciesList.length > 0 ? (
            speciesList.map((sp) => (
              <div 
                key={sp.species_id} 
                className="bg-[#090f1d] border border-[#1e293b] rounded-xl p-4 space-y-3 relative overflow-hidden"
              >
                <div 
                  className="absolute top-0 left-0 right-0 h-1" 
                  style={{ backgroundColor: sp.accent_color || '#38bdf8' }} 
                />
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white text-sm">{sp.local_name}</h4>
                    <span className="text-[11px] text-slate-400 italic">{sp.scientific_name}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {sp.category}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#1e293b]/60">
                  <div>
                    <span className="text-[10px] text-slate-400 block">R² Score:</span>
                    <span className="font-mono font-bold text-emerald-400">{sp.spatial_r2_score}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Rerata Tangkapan:</span>
                    <span className="font-mono font-bold text-white">{sp.mean_catch_kg_per_sqkm} <span className="text-[9px] text-slate-400">kg/km²</span></span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total Estimasi:</span>
                    <span className="font-mono font-bold text-cyan-300">{sp.total_predicted_catch_kg?.toLocaleString()} kg</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Alat Tangkap:</span>
                    <span className="text-[11px] text-slate-300 truncate block">{sp.standard_gear?.split('/')[0]}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-xs text-slate-400 py-4">Memuat parameter model spesies...</div>
          )}
        </div>
      </div>
    </div>
  );
}
