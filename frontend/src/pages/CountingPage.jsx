import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Fish, 
  PieChart as PieIcon, 
  Layers, 
  Scale, 
  ArrowRight, 
  Info,
  CheckCircle2,
  BarChart3
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { getStatistics, getHistory } from '../api/client';
import { formatNumber, formatPercent } from '../utils/formatters';

export default function CountingPage({ setActiveTab, setSelectedAnalysis }) {
  const [stats, setStats] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [s, h] = await Promise.all([getStatistics(), getHistory(15)]);
        setStats(s);
        setHistoryList(h);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalFish = stats?.total_fish_detected || 0;
  const brachysoma = stats?.total_brachysoma ?? stats?.total_kembung ?? 0;
  const leptolepis = stats?.total_leptolepis ?? stats?.total_layang ?? 0;
  const sulphureus = stats?.total_sulphureus ?? 0;
  const other = stats?.total_other || 0;

  const brachysomaPct = totalFish > 0 ? (brachysoma / totalFish) * 100 : 0;
  const leptolepisPct = totalFish > 0 ? (leptolepis / totalFish) * 100 : 0;
  const sulphureusPct = totalFish > 0 ? (sulphureus / totalFish) * 100 : 0;
  const otherPct = totalFish > 0 ? (other / totalFish) * 100 : 0;

  const pieData = [
    { name: 'Kembung Perempuan (R. brachysoma)', value: brachysoma, color: '#0ea5e9' },
    { name: 'Selar Kuning (S. leptolepis)', value: leptolepis, color: '#eab308' },
    { name: 'Kuniran (U. sulphureus)', value: sulphureus, color: '#f97316' },
    { name: 'Lainnya / Non-Target', value: other, color: '#64748b' },
  ].filter(i => i.value > 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Title */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Calculator className="w-5 h-5 text-cyan-400" /> Penghitungan Ikan & Komposisi Tangkapan
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Agregasi kuantitatif individu ikan hasil inferensi citra pendaratan Teluk Banten (PPN Karangantu, WPPNRI 712).
          </p>
        </div>
        <button
          onClick={() => setActiveTab('detection')}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer transition-all self-start md:self-auto"
        >
          Unggah Citra Baru <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Numerical Cards (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-800/40 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
              Kembung Perempuan
            </span>
            <div className="p-2 rounded-lg bg-cyan-900/40 text-cyan-400">
              <Fish className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{formatNumber(brachysoma)}</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-semibold">
              {formatPercent(brachysomaPct, 1)}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 italic">Rastrelliger brachysoma</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-800/40 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
              Selar Kuning
            </span>
            <div className="p-2 rounded-lg bg-amber-900/40 text-amber-400">
              <Fish className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{formatNumber(leptolepis)}</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300 font-semibold">
              {formatPercent(leptolepisPct, 1)}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 italic">Selaroides leptolepis</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950/40 border border-orange-800/40 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-orange-300">
              Ikan Kuniran
            </span>
            <div className="p-2 rounded-lg bg-orange-900/40 text-orange-400">
              <Fish className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{formatNumber(sulphureus)}</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-orange-950 border border-orange-800 text-orange-300 font-semibold">
              {formatPercent(sulphureusPct, 1)}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 italic">Upeneus sulphureus</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Seluruh Ikan
            </span>
            <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{formatNumber(totalFish)}</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
              100%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1.5">Dari {formatNumber(stats?.total_analyses || 0)} sesi analisis</p>
        </div>
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Pie Distribution with Centered Total in Donut */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
              <PieIcon className="w-4 h-4 text-cyan-400" /> Rasio Spesies Tangkapan
            </h3>
            <p className="text-xs text-slate-400 mb-4">Proporsi 3 spesies target MVP dalam survei lapang Karangantu</p>
          </div>
          
          <div className="relative flex-1 min-h-[260px] flex items-center justify-center">
            {pieData.length === 0 ? (
              <span className="text-xs text-slate-500">Belum ada data tangkapan</span>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={105}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((e, idx) => (
                      <Cell key={`cell-${idx}`} fill={e.color} />
                    ))}
                  </Pie>
                  {/* Centered Total Label inside Donut */}
                  <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontSize="26" fontWeight="bold">
                    {formatNumber(totalFish)}
                  </text>
                  <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" fill="#94a3b8" fontSize="11" fontWeight="500">
                    Total Ekor
                  </text>
                  <Tooltip 
                    formatter={(val, name) => [`${formatNumber(val)} ekor (${formatPercent((val / (totalFish || 1)) * 100, 1)})`, name]}
                    contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '10px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Clean Segment Legend Grid */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-slate-300 truncate">{item.name.split(' (')[0]}</span>
                <span className="text-xs font-mono font-bold text-white ml-auto">{formatNumber(item.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fisheries Biological Context */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
              <Scale className="w-4 h-4 text-emerald-400" /> Relevansi Pengelolaan Perikanan
            </h3>
            <p className="text-xs text-slate-400 mb-4">Pemanfaatan data cacah untuk konservasi & estimasi kuota tangkap</p>
            
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 leading-relaxed">
                <span className="font-semibold text-cyan-400 block mb-1">Pencatatan Hasil Tangkapan (Catch Documentation):</span>
                Data cacah otomatis mengurangi beban pencatatan manual di PPN Karangantu / TPI Teluk Banten, meminimalisir kesalahan pelaporan (under-reporting) pada pendaratan armada skala kecil.
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 leading-relaxed">
                <span className="font-semibold text-emerald-400 block mb-1">Pemantauan Dinamika Komposisi Spesies:</span>
                Pergeseran rasio kelimpahan antara <em className="text-cyan-300">R. brachysoma</em>, <em className="text-amber-300">S. leptolepis</em>, dan <em className="text-orange-300">U. sulphureus</em> memberikan indikasi musiman dan tekanan eksploitasi perikanan skala kecil Teluk Banten.
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/50 text-xs text-blue-300 flex items-center gap-2 mt-4">
            <Info className="w-4 h-4 shrink-0 text-blue-400" />
            <span>Penghitungan saat ini dioperasikan pada citra statis multi-individu (static frame counting) sesuai ruang lingkup MVP.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
