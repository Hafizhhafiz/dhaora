import React, { useState, useEffect } from 'react';
import { Clock, Search, RefreshCw, AlertCircle, Calculator } from 'lucide-react';
import { getHistory } from '../api/client';

export default function HistoryPage({ setActiveTab, setSelectedAnalysis }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecies, setFilterSpecies] = useState('all');

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await getHistory(100);
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    const bCount = item.brachysoma_count ?? item.kembung_count ?? 0;
    const lCount = item.leptolepis_count ?? item.layang_count ?? 0;
    const sCount = item.sulphureus_count ?? 0;

    if (filterSpecies === 'brachysoma') return bCount > 0;
    if (filterSpecies === 'leptolepis') return lCount > 0;
    if (filterSpecies === 'sulphureus') return sCount > 0;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" /> Repository & Riwayat Analisis
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Daftar lengkap rekaman inferensi citra, pencacahan individu, dan komposisi spesies di database lokal SQLite.
          </p>
        </div>
        <button
          onClick={loadHistory}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input 
            type="text"
            placeholder="Cari berdasarkan nama file atau ID analisis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900/80 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filterSpecies}
            onChange={(e) => setFilterSpecies(e.target.value)}
            className="text-xs bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Semua Sampel</option>
            <option value="brachysoma">Mengandung R. brachysoma</option>
            <option value="leptolepis">Mengandung S. leptolepis</option>
            <option value="sulphureus">Mengandung U. sulphureus</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" /> Memuat data riwayat...
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
            Tidak ada data riwayat yang cocok dengan pencarian.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-semibold">
                <tr>
                  <th className="pb-3 px-3">Pratinjau Hasil</th>
                  <th className="pb-3 px-3">ID & File</th>
                  <th className="pb-3 px-3">Waktu Analisis</th>
                  <th className="pb-3 px-3">Cacah Total</th>
                  <th className="pb-3 px-3">R. brachysoma</th>
                  <th className="pb-3 px-3">S. leptolepis</th>
                  <th className="pb-3 px-3">U. sulphureus</th>
                  <th className="pb-3 px-3">Model Engine</th>
                  <th className="pb-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredHistory.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3">
                      <a href={row.result_image_url || row.image_url} target="_blank" rel="noreferrer">
                        <img 
                          src={row.result_image_url || row.image_url} 
                          alt={row.filename} 
                          className="w-14 h-11 object-cover rounded border border-slate-700 bg-slate-950 hover:scale-105 transition-transform"
                        />
                      </a>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-200">{row.filename}</div>
                      <div className="font-mono text-[10px] text-cyan-400">ID: {row.id}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                      {row.timestamp}
                    </td>
                    <td className="py-3 px-3 font-bold text-white">{row.total_count}</td>
                    <td className="py-3 px-3 text-cyan-400 font-semibold">{row.brachysoma_count ?? row.kembung_count ?? 0}</td>
                    <td className="py-3 px-3 text-yellow-400 font-semibold">{row.leptolepis_count ?? row.layang_count ?? 0}</td>
                    <td className="py-3 px-3 text-orange-400 font-semibold">{row.sulphureus_count ?? 0}</td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {row.model_mode === 'CUSTOM_SPECIES_MODEL' ? 'Custom YOLO' : 'Baseline YOLO'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          if (setSelectedAnalysis) setSelectedAnalysis(row);
                          setActiveTab('counting');
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-950 text-cyan-400 hover:text-cyan-300 border border-slate-700 hover:border-cyan-700 text-[11px] transition-all cursor-pointer inline-flex items-center gap-1"
                      >
                        <Calculator className="w-3.5 h-3.5" /> Detail
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
