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
    { name: 'Kembung Perempuan (R. brachysoma)', value: brachysoma, color: '#0E6E7E' },
    { name: 'Selar Kuning (S. leptolepis)', value: leptolepis, color: '#D97706' },
    { name: 'Kuniran (U. sulphureus)', value: sulphureus, color: '#EA580C' },
    { name: 'Lainnya / Non-Target', value: other, color: '#94A3B8' },
  ].filter(i => i.value > 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Title */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#0E6E7E] text-xs font-medium mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>Pencacahan Multi-Individu</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B1220] tracking-tight">
            Penghitungan Ikan & <span className="font-serif-italic font-normal">Komposisi Tangkapan.</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Agregasi kuantitatif individu ikan hasil inferensi citra pendaratan Teluk Banten (PPN Karangantu, WPPNRI 712).
          </p>
        </div>
        <button
          onClick={() => setActiveTab('detection')}
          className="px-5 py-2.5 rounded-full bg-[#0E6E7E] hover:bg-[#0b5865] text-white font-medium text-xs flex items-center gap-2 shadow-sm cursor-pointer transition-all self-start md:self-auto"
        >
          Unggah Citra Baru <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Numerical Cards (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Kembung Perempuan
            </span>
            <div className="w-8 h-8 rounded-full bg-teal-50 text-[#0E6E7E] flex items-center justify-center">
              <Fish className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#0B1220] tracking-tight tabular-nums">{formatNumber(brachysoma)}</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-teal-50 text-[#0E6E7E] border border-teal-200 tabular-nums">
              {formatPercent(brachysomaPct, 1)}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1.5 italic">Rastrelliger brachysoma</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Selar Kuning
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
              <Fish className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#0B1220] tracking-tight tabular-nums">{formatNumber(leptolepis)}</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 tabular-nums">
              {formatPercent(leptolepisPct, 1)}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1.5 italic">Selaroides leptolepis</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Ikan Kuniran
            </span>
            <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-700 flex items-center justify-center">
              <Fish className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#0B1220] tracking-tight tabular-nums">{formatNumber(sulphureus)}</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-50 text-orange-800 border border-orange-200 tabular-nums">
              {formatPercent(sulphureusPct, 1)}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1.5 italic">Upeneus sulphureus</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Seluruh Ikan
            </span>
            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#0B1220] tracking-tight tabular-nums">{formatNumber(totalFish)}</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              100%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1.5">Dari {formatNumber(stats?.total_analyses || 0)} sesi analisis</p>
        </div>
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Pie Distribution with Centered Total in Donut */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0B1220] flex items-center gap-2 mb-1">
              <PieIcon className="w-4 h-4 text-[#0E6E7E]" /> Rasio Spesies Tangkapan
            </h3>
            <p className="text-xs text-slate-500 mb-4">Proporsi 3 spesies target MVP dalam survei lapang Karangantu</p>
          </div>
          
          <div className="relative flex-1 min-h-[260px] flex items-center justify-center">
            {pieData.length === 0 ? (
              <span className="text-xs text-slate-400">Belum ada data tangkapan</span>
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
                  <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" fill="#0B1220" fontSize="26" fontWeight="bold">
                    {formatNumber(totalFish)}
                  </text>
                  <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" fill="#64748b" fontSize="11" fontWeight="500">
                    Total Ekor
                  </text>
                  <Tooltip 
                    formatter={(val, name) => [`${formatNumber(val)} ekor (${formatPercent((val / (totalFish || 1)) * 100, 1)})`, name]}
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', color: '#0B1220' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Clean Segment Legend Grid */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-slate-700 truncate">{item.name.split(' (')[0]}</span>
                <span className="text-xs font-mono font-bold text-[#0B1220] ml-auto tabular-nums">{formatNumber(item.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fisheries Biological Context */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0B1220] flex items-center gap-2 mb-1">
              <Scale className="w-4 h-4 text-[#0E6E7E]" /> Relevansi Pengelolaan Perikanan
            </h3>
            <p className="text-xs text-slate-500 mb-4">Pemanfaatan data cacah untuk konservasi & estimasi kuota tangkap</p>
            
            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 leading-relaxed">
                <span className="font-bold text-[#0B1220] block mb-1">Pencatatan Hasil Tangkapan (Catch Documentation):</span>
                Data cacah otomatis mengurangi beban pencatatan manual di PPN Karangantu / TPI Teluk Banten, meminimalisir kesalahan pelaporan (under-reporting) pada pendaratan armada skala kecil.
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 leading-relaxed">
                <span className="font-bold text-[#0B1220] block mb-1">Pemantauan Dinamika Komposisi Spesies:</span>
                Pergeseran rasio kelimpahan antara <em>R. brachysoma</em>, <em>S. leptolepis</em>, dan <em>U. sulphureus</em> memberikan indikasi musiman dan tekanan eksploitasi perikanan skala kecil Teluk Banten.
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-200 text-xs text-teal-900 flex items-center gap-2.5 mt-4">
            <Info className="w-4 h-4 shrink-0 text-[#0E6E7E]" />
            <span>Penghitungan saat ini dioperasikan pada citra statis multi-individu (static frame counting) sesuai ruang lingkup MVP.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
