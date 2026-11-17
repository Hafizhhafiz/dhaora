import React, { useState, useEffect } from 'react';
import { 
  Scan, 
  Fish, 
  BarChart3, 
  PieChart as PieIcon, 
  Clock, 
  ArrowUpRight, 
  Layers, 
  AlertCircle,
  Sparkles,
  ChevronRight,
  Calculator
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import StatCard from '../components/StatCard';
import { getStatistics } from '../api/client';

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
    { name: 'Kembung Perempuan (R. brachysoma)', value: brachysomaCount, color: '#0ea5e9' },
    { name: 'Selar Kuning (S. leptolepis)', value: leptolepisCount, color: '#eab308' },
    { name: 'Kuniran (U. sulphureus)', value: sulphureusCount, color: '#f97316' },
    { name: 'Lainnya / Baseline', value: otherCount, color: '#94a3b8' },
  ].filter(item => item.value > 0);

  const speciesBarData = [
    { species: 'R. brachysoma', count: brachysomaCount },
    { species: 'S. leptolepis', count: leptolepisCount },
    { species: 'U. sulphureus', count: sulphureusCount },
    { species: 'Lainnya', count: otherCount },
  ];

  return (
    <div className="space-y-6">
      {/* Banner / Hero */}
      <div className="relative rounded-2xl p-6 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-cyan-900/40 shadow-xl overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-cyan-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Inovasi Pemantauan Perikanan Skala Kecil Teluk Banten — ASIK V
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            FishGuard AI Dashboard
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Sistem terintegrasi Computer Vision & Artificial Intelligence untuk identifikasi 3 target spesies MVP 
            (<em>Rastrelliger brachysoma</em>, <em>Selaroides leptolepis</em>, <em>Upeneus sulphureus</em>), 
            penghitungan otomatis hasil tangkapan, dan analisis komposisi spesies pendaratan di PPN Karangantu.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={() => setActiveTab('detection')}
              className="px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs tracking-wide shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Scan className="w-4 h-4" /> Mulai Deteksi Ikan
            </button>
            <button
              onClick={() => setActiveTab('counting')}
              className="px-4 py-2.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs tracking-wide flex items-center gap-2 transition-all cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-cyan-400" /> Penghitungan & Komposisi
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Citra Dianalisis"
          value={loading ? '...' : stats?.total_analyses || 0}
          subtitle="Sesi foto tersimpan di SQLite"
          icon={Layers}
          color="blue"
        />
        <StatCard
          title="Total Ikan Terdeteksi"
          value={loading ? '...' : totalFish}
          subtitle="Akumulasi individu"
          icon={Fish}
          color="cyan"
        />
        <StatCard
          title="Kembung Perempuan"
          value={loading ? '...' : brachysomaCount}
          subtitle="Rastrelliger brachysoma"
          icon={Fish}
          color="cyan"
          trend={totalFish > 0 ? `${((brachysomaCount / totalFish) * 100).toFixed(1)}%` : '0%'}
        />
        <StatCard
          title="Selar Kuning & Kuniran"
          value={loading ? '...' : (leptolepisCount + sulphureusCount)}
          subtitle="S. leptolepis + U. sulphureus"
          icon={Fish}
          color="emerald"
          trend={totalFish > 0 ? `${(((leptolepisCount + sulphureusCount) / totalFish) * 100).toFixed(1)}%` : '0%'}
        />
      </div>

      {/* Analytics Charts & Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Composition Chart */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-cyan-400" /> Komposisi Spesies Tangkapan
              </h3>
              <p className="text-xs text-slate-400">Rasio kelimpahan perikanan MVP</p>
            </div>
          </div>
          <div className="flex-1 min-h-[220px] flex items-center justify-center">
            {chartData.length === 0 ? (
              <div className="text-center text-slate-500 text-xs py-10">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                Belum ada data tangkapan.<br />Silakan jalankan deteksi pertama.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend 
                    formatter={(value) => <span className="text-xs text-slate-300">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Species Comparison Bar */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" /> Distribusi Spesies MVP
              </h3>
              <p className="text-xs text-slate-400">Jumlah individu menurut taksonomi terkunci</p>
            </div>
          </div>
          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={speciesBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="species" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scientific Context & Field Notes */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" /> Spesies Target MVP (Terkunci)
              </h3>
            </div>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <span className="font-semibold text-cyan-400 block">Class 0: Kembung Perempuan</span>
                <em>Rastrelliger brachysoma</em> (Scombridae). Ciri: badan lebih tebal/dalam, moncong pendek bulat.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <span className="font-semibold text-yellow-400 block">Class 1: Selar Kuning</span>
                <em>Selaroides leptolepis</em> (Carangidae). Ciri: garis pita kuning emas khas sepanjang sisi tubuh.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <span className="font-semibold text-orange-400 block">Class 2: Kuniran</span>
                <em>Upeneus sulphureus</em> (Mullidae). Ciri: sungut dagu putih, sirip ekor polos tanpa garis gelap.
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-800 mt-3 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Fokus MVP: Deteksi & Counting</span>
            <button 
              onClick={() => setActiveTab('dataset')}
              className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Info Dataset <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Analyses Table */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" /> Riwayat Analisis Terbaru
            </h3>
            <p className="text-xs text-slate-400">Data hasil inferensi aktual dari server</p>
          </div>
          <button
            onClick={() => setActiveTab('history')}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer font-medium"
          >
            Lihat Semua <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {stats?.latest_analyses?.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            Belum ada rekaman analisis di database lokal.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-medium">
                  <th className="pb-3 px-3">Pratinjau</th>
                  <th className="pb-3 px-3">File / Waktu</th>
                  <th className="pb-3 px-3">Total Ikan</th>
                  <th className="pb-3 px-3">R. brachysoma</th>
                  <th className="pb-3 px-3">S. leptolepis</th>
                  <th className="pb-3 px-3">U. sulphureus</th>
                  <th className="pb-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {stats?.latest_analyses?.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-3">
                      <img 
                        src={row.result_image_url || row.image_url} 
                        alt={row.filename} 
                        className="w-12 h-10 object-cover rounded border border-slate-700 bg-slate-950"
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-slate-200">{row.filename}</div>
                      <div className="text-[10px] text-slate-500">{row.timestamp}</div>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-white">{row.total_count}</td>
                    <td className="py-2.5 px-3 text-cyan-400 font-medium">{row.brachysoma_count ?? row.kembung_count ?? 0}</td>
                    <td className="py-2.5 px-3 text-yellow-400 font-medium">{row.leptolepis_count ?? row.layang_count ?? 0}</td>
                    <td className="py-2.5 px-3 text-orange-400 font-medium">{row.sulphureus_count ?? 0}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => {
                          if (setSelectedAnalysis) setSelectedAnalysis(row);
                          setActiveTab('counting');
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-900/40 text-cyan-400 border border-slate-700 hover:border-cyan-600 transition-colors text-[11px] cursor-pointer"
                      >
                        Detail Komposisi
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
