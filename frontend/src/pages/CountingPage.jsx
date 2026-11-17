import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Fish, 
  PieChart as PieIcon, 
  Layers, 
  Scale, 
  ArrowRight, 
  Info 
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { getStatistics, getHistory } from '../api/client';

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

  const brachysomaPct = totalFish > 0 ? ((brachysoma / totalFish) * 100).toFixed(1) : '0';
  const leptolepisPct = totalFish > 0 ? ((leptolepis / totalFish) * 100).toFixed(1) : '0';
  const sulphureusPct = totalFish > 0 ? ((sulphureus / totalFish) * 100).toFixed(1) : '0';
  const otherPct = totalFish > 0 ? ((other / totalFish) * 100).toFixed(1) : '0';

  const pieData = [
    { name: 'Kembung Perempuan (R. brachysoma)', value: brachysoma, color: '#0ea5e9' },
    { name: 'Selar Kuning (S. leptolepis)', value: leptolepis, color: '#eab308' },
    { name: 'Kuniran (U. sulphureus)', value: sulphureus, color: '#f97316' },
    { name: 'Lainnya / Non-Target', value: other, color: '#94a3b8' },
  ].filter(i => i.value > 0);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-cyan-400" /> Fish Counting & Catch Composition
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Penghitungan agregat individu perikanan tangkap skala kecil Teluk Banten dari citra statis untuk 3 spesies target MVP.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('detection')}
          className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer transition-all self-start md:self-auto"
        >
          Unggah Citra Baru <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Numerical Cards (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-800/40 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-300">
              Kembung Perempuan
            </span>
            <div className="p-2 rounded-lg bg-cyan-900/40 text-cyan-400">
              <Fish className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{brachysoma}</span>
            <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
              {brachysomaPct}%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 italic">Rastrelliger brachysoma</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-yellow-950/40 border border-yellow-800/40 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-yellow-300">
              Selar Kuning
            </span>
            <div className="p-2 rounded-lg bg-yellow-900/40 text-yellow-400">
              <Fish className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{leptolepis}</span>
            <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-yellow-950 border border-yellow-800 text-yellow-300">
              {leptolepisPct}%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 italic">Selaroides leptolepis</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950/40 border border-orange-800/40 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-orange-300">
              Ikan Kuniran
            </span>
            <div className="p-2 rounded-lg bg-orange-900/40 text-orange-400">
              <Fish className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{sulphureus}</span>
            <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-orange-950 border border-orange-800 text-orange-300">
              {sulphureusPct}%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 italic">Upeneus sulphureus</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Total Seluruh Ikan
            </span>
            <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{totalFish}</span>
            <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
              100%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">Dari {stats?.total_analyses || 0} sesi tangkapan</p>
        </div>
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Distribution */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
            <PieIcon className="w-4 h-4 text-cyan-400" /> Rasio Spesies Tangkapan
          </h3>
          <p className="text-xs text-slate-400 mb-4">Proporsi 3 spesies target MVP dalam survei lapang</p>
          
          <div className="flex-1 min-h-[240px] flex items-center justify-center">
            {pieData.length === 0 ? (
              <span className="text-xs text-slate-500">Belum ada data tangkapan</span>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((e, idx) => (
                      <Cell key={`cell-${idx}`} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend formatter={(v) => <span className="text-xs text-slate-300">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Fisheries Biological Context */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
              <Scale className="w-4 h-4 text-emerald-400" /> Relevansi Pengelolaan Perikanan
            </h3>
            <p className="text-xs text-slate-400 mb-4">Pemanfaatan data cacah untuk konservasi & estimasi kuota tangkap</p>
            
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="font-semibold text-cyan-400 block mb-1">Pencatatan Hasil Tangkapan (Catch Documentation):</span>
                Data cacah otomatis mengurangi beban pencatatan manual di PPN Karangantu / TPI Teluk Banten, meminimalisir kesalahan pelaporan (under-reporting).
              </div>
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="font-semibold text-emerald-400 block mb-1">Pemantauan Dinamika Komposisi Spesies:</span>
                Pergeseran rasio kelimpahan antara <em className="text-cyan-300">R. brachysoma</em>, <em className="text-yellow-300">S. leptolepis</em>, dan <em className="text-orange-300">U. sulphureus</em> memberikan indikasi musiman dan tekanan eksploitasi perikanan skala kecil Teluk Banten.
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-800/40 text-[11px] text-blue-300 flex items-center gap-2 mt-4">
            <Info className="w-4 h-4 shrink-0" />
            Catatan: Penghitungan saat ini dioperasikan pada citra statis multi-individu (static frame counting) sesuai ruang lingkup MVP.
          </div>
        </div>
      </div>
    </div>
  );
}
