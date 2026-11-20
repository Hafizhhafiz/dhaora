import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  ExternalLink, 
  Download, 
  Clock, 
  Layers,
  Database,
  Eye
} from 'lucide-react';
import { getUnifiedSessions, getUnifiedStats } from '../api/client';

export default function UnifiedHistory() {
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    async function loadHistory() {
      setLoading(true);
      try {
        const [sess, st] = await Promise.all([
          getUnifiedSessions(100),
          getUnifiedStats()
        ]);
        if (sess && sess.sessions) setSessions(sess.sessions);
        if (st) setStats(st);
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  const filteredSessions = sessions.filter((s) => {
    const matchesModule = filterModule === 'all' || s.module === filterModule;
    const matchesSearch = 
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.session_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.summary && s.summary.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesModule && matchesSearch;
  });

  const exportToJson = () => {
    const blob = new Blob([JSON.stringify(filteredSessions, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dhaora_audit_history_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0d1629] via-[#101b33] to-[#0d1629] border border-[#1e293b] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Multi-Store Audit Trail
            </span>
            <span className="text-xs text-slate-400">Integritas Data Riset Tanpa Modifikasi</span>
          </div>
          <h2 className="text-xl font-bold text-white">Arsip & Riwayat Analisis Terpadu</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Pencarian dan penelusuran riwayat analisis yang mengagregasikan basis data lokal DHAORA dengan database historis FishGuard dan ByCatch secara read-only.
          </p>
        </div>

        <button
          onClick={exportToJson}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f172a] hover:bg-[#1a2948] border border-[#1e293b] text-cyan-300 text-xs font-semibold shadow-md transition-all self-start md:self-auto"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Ekspor JSON</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari ID sesi, judul, atau kata kunci..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#080d1a] border border-[#1e293b] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Module Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'Semua Modul' },
            { id: 'fishguard', label: 'FishGuard CV' },
            { id: 'bycatch', label: 'ByCatch Audit' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setFilterModule(m.id)}
              className={`py-1.5 px-3 rounded-lg border text-xs whitespace-nowrap transition-all ${
                filterModule === m.id
                  ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-200 font-bold'
                  : 'bg-[#080d1a] border-[#1e293b] text-slate-400 hover:text-slate-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table of Sessions */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Memuat riwayat sesi gabungan...
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Tidak ada riwayat analisis yang sesuai kriteria pencarian.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#090f1d] text-slate-400 border-b border-[#1e293b] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">ID Sesi</th>
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">Modul</th>
                  <th className="py-3 px-4">Judul & Ringkasan</th>
                  <th className="py-3 px-4">Sumber Database</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]">
                {filteredSessions.map((s, idx) => (
                  <tr key={idx} className="hover:bg-[#131e36]/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-cyan-300 font-semibold">
                      {s.session_id}
                    </td>
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {s.created_at ? s.created_at.slice(0, 19).replace('T', ' ') : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        s.module === 'fishguard'
                          ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      }`}>
                        {s.module.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-200">{s.title}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-md">{s.summary}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {s.source}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {s.image_url ? (
                        <button
                          onClick={() => setSelectedSession(s)}
                          className="p-1.5 rounded-lg bg-[#080d1a] hover:bg-cyan-950 text-cyan-400 border border-[#1e293b] inline-flex items-center gap-1 text-[11px]"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Visual</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Visual Modal Detail */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl max-w-2xl w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
              <div>
                <h4 className="text-sm font-bold text-white">{selectedSession.title}</h4>
                <p className="text-xs text-slate-400">ID: {selectedSession.session_id} | {selectedSession.created_at}</p>
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-[#1e293b] bg-black max-h-96 flex items-center justify-center">
              <img src={selectedSession.image_url} alt="Hasil Deteksi" className="max-h-96 object-contain" />
            </div>

            <div className="p-3 rounded-xl bg-[#090f1d] border border-[#1e293b] text-xs text-slate-300">
              {selectedSession.summary}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
