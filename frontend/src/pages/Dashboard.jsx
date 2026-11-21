import React, { useState, useEffect } from 'react';
import { 
  Scan, 
  Fish, 
  BarChart3, 
  PieChart as PieIcon, 
  Clock, 
  Layers, 
  AlertCircle,
  Sparkles,
  Calculator
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import StatCard from '../components/StatCard';
import { getStatistics } from '../api/client';
import { formatNumber, formatPercent } from '../utils/formatters';

export default function Dashboard({ setActiveTab, setSelectedAnalysis }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await getStatistics();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Gagal memuat statistik dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalFish = stats?.total_fish_detected || 0;
  const brachysomaCount = stats?.total_brachysoma ?? stats?.total_kembung ?? 0;
  const leptolepisCount = stats?.total_leptolepis ?? stats?.total_layang ?? 0;
  const sulphureusCount = stats?.total_sulphureus ?? 0;
  const otherCount = stats?.total_other || 0;

  const chartData = [
    { name: 'Kembung Perempuan', value: brachysomaCount, color: '#0E6E7E' },
    { name: 'Selar Kuning', value: leptolepisCount, color: '#D97706' },
    { name: 'Kuniran (Pepetek)', value: sulphureusCount, color: '#EA580C' },
    { name: 'Lainnya / Baseline', value: otherCount, color: '#94A3B8' },
  ].filter(item => item.value > 0);

  const speciesBarData = [
    { species: 'R. brachysoma', count: brachysomaCount },
    { species: 'S. leptolepis', count: leptolepisCount },
    { species: 'U. sulphureus', count: sulphureusCount },
    { species: 'Lainnya', count: otherCount },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner / Contrast Dark Block (#0A1A2F) */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-[#0A1A2F] text-white border border-slate-800 shadow-sm overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-teal-300 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FishGuard AI — Computer Vision Suite</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Identifikasi Spesies & <span className="font-serif-italic font-normal">Pencacahan Biometrik.</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed">
            Sistem inferensi Computer Vision untuk identifikasi 3 target spesies MVP 
            (<em>Rastrelliger brachysoma</em>, <em>Selaroides leptolepis</em>, <em>Upeneus sulphureus</em>), 
            penghitungan kuantitatif individu, dan analisis komposisi pendaratan di PPN Karangantu (WPPNRI 712).
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('detection')}
              className="px-5 py-2.5 rounded-full bg-[#0E6E7E] hover:bg-[#0b5865] text-white font-medium text-xs tracking-wide shadow-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Scan className="w-4 h-4" /> Mulai Deteksi Ikan
            </button>
            <button
              onClick={() => setActiveTab('counting')}
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 font-medium text-xs tracking-wide flex items-center gap-2 transition-all cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-teal-300" /> Penghitungan & Komposisi
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Citra Dianalisis"
          value={loading ? '...' : formatNumber(stats?.total_analyses || 0)}
          subtitle="Sesi foto tersimpan di SQLite"
          icon={Layers}
          color="teal"
        />
        <StatCard
          title="Total Ikan Terdeteksi"
          value={loading ? '...' : formatNumber(totalFish)}
          subtitle="Akumulasi individu"
          icon={Fish}
          color="teal"
        />
        <StatCard
          title="Kembung Perempuan"
          value={loading ? '...' : formatNumber(brachysomaCount)}
          subtitle="Rastrelliger brachysoma"
          icon={Fish}
          color="teal"
          trend={totalFish > 0 ? formatPercent(brachysomaCount / totalFish, 1, true) : '0%'}
        />
        <StatCard
          title="Selar Kuning & Kuniran"
          value={loading ? '...' : formatNumber(leptolepisCount + sulphureusCount)}
          subtitle="S. leptolepis + U. sulphureus"
          icon={Fish}
          color="amber"
          trend={totalFish > 0 ? formatPercent((leptolepisCount + sulphureusCount) / totalFish, 1, true) : '0%'}
        />
      </div>

      {/* Analytics Charts & Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Composition Chart with Centered Total */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#0B1220] flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-[#0E6E7E]" /> Komposisi Spesies Tangkapan
              </h3>
              <p className="text-xs text-slate-500">Rasio kelimpahan perikanan MVP</p>
            </div>
          </div>
          <div className="flex-1 min-h-[240px] flex items-center justify-center relative">
            {chartData.length === 0 ? (
              <div className="text-center text-slate-400 text-xs py-10">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                Belum ada data tangkapan.<br />Silakan jalankan deteksi pertama.
              </div>
            ) : (
              <div className="relative w-full h-[240px]">
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="45%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val) => [formatNumber(val) + ' ekor', 'Jumlah']}
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', color: '#0B1220' }}
                    />
                    <Legend 
                      verticalAlign="bottom"
                      formatter={(value) => <span className="text-xs text-slate-600">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Label for Donut */}
                <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <div className="text-xs text-slate-400 font-medium">Total</div>
                  <div className="text-base font-extrabold text-[#0B1220] tabular-nums">{formatNumber(totalFish)}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Species Comparison Bar */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#0B1220] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#0E6E7E]" /> Distribusi Spesies MVP
              </h3>
              <p className="text-xs text-slate-500">Jumlah individu menurut taksonomi terkunci</p>
            </div>
          </div>
          <div className="flex-1 min-h-[240px]">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={speciesBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="species" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} tickFormatter={(val) => formatNumber(val)} />
                <Tooltip 
                  formatter={(val) => [formatNumber(val) + ' ekor', 'Individu']}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', color: '#0B1220' }}
                />
                <Bar dataKey="count" fill="#0E6E7E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scientific Context & Field Notes */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-[#0B1220] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#0E6E7E]" /> Spesies Target MVP (Terkunci)
              </h3>
            </div>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-[#0B1220] block mb-0.5">Class 0: Kembung Perempuan</span>
                <em>Rastrelliger brachysoma</em> (Scombridae). Ciri: badan tebal/dalam, moncong tumpul bulat.
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-[#0B1220] block mb-0.5">Class 1: Selar Kuning</span>
                <em>Selaroides leptolepis</em> (Carangidae). Ciri: garis pita kuning emas khas sepanjang sisi tubuh.
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-[#0B1220] block mb-0.5">Class 2: Kuniran / Pepetek</span>
                <em>Upeneus sulphureus</em> (Mullidae). Ciri: sepasang sungut dagu, sirip punggung dengan corak kuning-jingga.
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            *Taksonomi terkunci untuk verifikasi AI model pada baseline evaluasi PPN Karangantu.
          </div>
        </div>
      </div>
    </div>
  );
}
