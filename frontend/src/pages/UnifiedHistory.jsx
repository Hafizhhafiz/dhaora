import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  Clock, 
  Eye, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown, 
  AlertCircle,
  FileText,
  CameraOff
} from 'lucide-react';
import { getUnifiedSessions, getUnifiedStats } from '../api/client';
import { formatNumber, formatDateTimeId } from '../utils/formatters';
import ImageWithFallback from '../components/ImageWithFallback';

export default function UnifiedHistory() {
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState('all');
  const [showSynthetic, setShowSynthetic] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' | 'asc'
  const [dateFilter, setDateFilter] = useState('all'); // 'all' | 'today' | '7days' | '30days'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    async function loadHistory() {
      setLoading(true);
      try {
        const [sess, st] = await Promise.all([
          getUnifiedSessions(150),
          getUnifiedStats()
        ]);
        if (sess && sess.sessions) {
          // Deduplicate rows with exact same timestamp + module + title
          const seen = new Set();
          const deduped = [];
          for (const s of sess.sessions) {
            const key = `${s.created_at}_${s.module}_${s.title}`;
            if (!seen.has(key)) {
              seen.add(key);
              deduped.push(s);
            }
          }
          setSessions(deduped);
        }
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
    // 1. Synthetic filter
    const isSynth = s.is_synthetic ?? (
      s.title.toLowerCase().includes('synth_') ||
      s.title.toLowerCase().includes('blank') ||
      s.title.toLowerCase().includes('sample_test')
    );
    if (!showSynthetic && isSynth) return false;

    // 2. Module filter
    const matchesModule = filterModule === 'all' || s.module === filterModule;

    // 3. Search query
    const matchesSearch = 
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.session_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.summary && s.summary.toLowerCase().includes(searchTerm.toLowerCase()));

    // 4. Date filter
    let matchesDate = true;
    if (dateFilter !== 'all' && s.created_at) {
      const sessDate = new Date(s.created_at);
      const now = new Date();
      const diffDays = (now - sessDate) / (1000 * 60 * 60 * 24);
      if (dateFilter === 'today') matchesDate = diffDays <= 1;
      else if (dateFilter === '7days') matchesDate = diffDays <= 7;
      else if (dateFilter === '30days') matchesDate = diffDays <= 30;
    }

    return matchesModule && matchesSearch && matchesDate;
  }).sort((a, b) => {
    const timeA = new Date(a.created_at || 0).getTime();
    const timeB = new Date(b.created_at || 0).getTime();
    return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
  });

  const totalItems = filteredSessions.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedSessions = filteredSessions.slice(startIndex, startIndex + pageSize);

  const exportToJson = () => {
    const blob = new Blob([JSON.stringify(filteredSessions, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dhaora_audit_history_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  // Helper to format friendly user titles
  const getFriendlyTitle = (s) => {
    if (s.module === 'fishguard') {
      const cleanName = s.title.replace('FishGuard: ', '');
      if (cleanName.startsWith('synth_val') || cleanName.startsWith('blank')) {
        return { main: 'Sampel Validasi Sintetis', sub: cleanName };
      }
      return { main: `Tangkapan Ikan (${cleanName})`, sub: cleanName };
    }
    if (s.module === 'bycatch') {
      return { main: s.title, sub: s.summary };
    }
    return { main: s.title, sub: s.session_id };
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-teal-50 text-[#0E6E7E] border border-teal-200 font-mono">
              Audit Trail Terpadu
            </span>
            <span className="text-xs text-slate-500">Pencatatan Multi-Store Read-Only</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B1220] flex items-center gap-2.5 tracking-tight">
            <Clock className="w-6 h-6 text-[#0E6E7E]" />
            <span>Arsip & Riwayat Analisis <span className="font-serif-italic font-normal">Lintas Modul.</span></span>
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 max-w-2xl leading-relaxed">
            Pencarian terintegrasi mengagregasikan basis data pendaratan FishGuard CV, evaluasi kepatuhan ByCatch AI, dan telemetri CatchForecast.
          </p>
        </div>

        <button
          onClick={exportToJson}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-[#0B1220] text-xs font-medium shadow-sm transition-all self-start md:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#0E6E7E]" />
          <span>Ekspor JSON</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari ID sesi, judul, alat tangkap, atau kata kunci..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-2 text-xs text-[#0B1220] placeholder-slate-400 focus:outline-none focus:border-[#0E6E7E] font-sans"
            />
          </div>

          {/* Module Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 lg:pb-0">
            {[
              { id: 'all', label: 'Semua Modul' },
              { id: 'fishguard', label: 'FishGuard CV' },
              { id: 'bycatch', label: 'ByCatch Audit' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setFilterModule(m.id);
                  setCurrentPage(1);
                }}
                className={`py-1.5 px-4 rounded-full border text-xs whitespace-nowrap transition-all cursor-pointer font-medium ${
                  filterModule === m.id
                    ? 'bg-teal-50 border-teal-300 text-[#0E6E7E]'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Controls: Date, Sort, Synthetic Toggle */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Date filter */}
            <div className="flex items-center gap-1.5 text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-[#0E6E7E]" />
              <select
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-slate-50 border border-slate-200 rounded-full px-3 py-1 text-slate-700 focus:outline-none focus:border-[#0E6E7E] cursor-pointer"
              >
                <option value="all">Semua Waktu</option>
                <option value="today">Hari Ini</option>
                <option value="7days">7 Hari Terakhir</option>
                <option value="30days">30 Hari Terakhir</option>
              </select>
            </div>

            {/* Sort Order */}
            <button
              onClick={() => setSortOrder(o => o === 'desc' ? 'asc' : 'desc')}
              className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 px-3 py-1 rounded-full text-slate-700 cursor-pointer"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-[#0E6E7E]" />
              <span>{sortOrder === 'desc' ? 'Terbaru Dahulu' : 'Terlama Dahulu'}</span>
            </button>
          </div>

          {/* Toggle Sesi Uji */}
          <label className="flex items-center gap-2 text-slate-700 bg-slate-50 px-3.5 py-1 rounded-full border border-slate-200 cursor-pointer select-none hover:bg-slate-100">
            <input 
              type="checkbox"
              checked={showSynthetic}
              onChange={(e) => {
                setShowSynthetic(e.target.checked);
                setCurrentPage(1);
              }}
              className="rounded text-[#0E6E7E] focus:ring-0 cursor-pointer"
            />
            <span>Tampilkan Sesi Uji Sistem</span>
          </label>
        </div>
      </div>

      {/* Table of Sessions */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-16 text-center text-slate-500 text-xs flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-[#0E6E7E] border-t-transparent rounded-full animate-spin" />
            <span>Memuat data riwayat sesi gabungan...</span>
          </div>
        ) : paginatedSessions.length === 0 ? (
          <div className="p-16 text-center text-slate-500 text-xs flex flex-col items-center justify-center">
            <AlertCircle className="w-10 h-10 text-slate-400 mb-3" />
            <p className="font-semibold text-[#0B1220]">Tidak ada riwayat analisis yang sesuai.</p>
            <p className="text-slate-500 mt-1 max-w-sm">
              Coba ganti filter modul atau aktifkan opsi "Tampilkan Sesi Uji Sistem".
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">ID Sesi</th>
                    <th className="py-3.5 px-4">Waktu</th>
                    <th className="py-3.5 px-4">Modul</th>
                    <th className="py-3.5 px-4">Ringkasan Analisis</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedSessions.map((s, idx) => {
                    const titleInfo = getFriendlyTitle(s);
                    const isSynth = s.is_synthetic ?? (
                      s.title.toLowerCase().includes('synth_') ||
                      s.title.toLowerCase().includes('blank')
                    );
                    const hasValidImage = s.has_image || Boolean(s.image_url);

                    return (
                      <tr key={s.session_id || idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 font-mono text-[#0E6E7E] font-semibold text-[11px] tabular-nums">
                          {s.session_id}
                        </td>
                        <td className="py-3 px-4 text-slate-600 text-[11px] whitespace-nowrap">
                          {formatDateTimeId(s.created_at)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border font-mono ${
                            s.module === 'fishguard'
                              ? 'bg-teal-50 text-[#0E6E7E] border-teal-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            {s.module.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-[#0B1220] flex items-center gap-2">
                            <span>{titleInfo.main}</span>
                            {isSynth && (
                              <span className="text-[9px] px-2 py-0.2 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-mono font-medium">
                                Uji Sistem
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 truncate max-w-md">
                            {s.summary || titleInfo.sub}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {hasValidImage ? (
                            <button
                              onClick={() => setSelectedSession(s)}
                              className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0B1220] border border-slate-200 inline-flex items-center gap-1.5 text-[11px] font-medium transition-all cursor-pointer shadow-sm"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#0E6E7E]" />
                              <span>Visual</span>
                            </button>
                          ) : (
                            <span 
                              className="inline-flex items-center gap-1 text-[11px] text-slate-400 italic bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-200 cursor-not-allowed"
                              title="Citra hasil tidak disimpan di server"
                            >
                              <CameraOff className="w-3 h-3 text-slate-400" />
                              <span>Tanpa Citra</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <div>
                Menampilkan <span className="text-[#0B1220] font-mono font-semibold tabular-nums">{totalItems === 0 ? 0 : startIndex + 1}</span> - <span className="text-[#0B1220] font-mono font-semibold tabular-nums">{Math.min(startIndex + pageSize, totalItems)}</span> dari <span className="text-[#0E6E7E] font-mono font-semibold tabular-nums">{formatNumber(totalItems)}</span> sesi
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={validCurrentPage <= 1}
                  className="p-1.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-[#0B1220] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                  title="Halaman Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-mono text-slate-700 tabular-nums font-medium">
                  {validCurrentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={validCurrentPage >= totalPages}
                  className="p-1.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-[#0B1220] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                  title="Halaman Selanjutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Visual Modal Detail */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-bold text-[#0B1220]">{selectedSession.title}</h4>
                <p className="text-xs text-slate-500 font-mono">
                  ID: {selectedSession.session_id} | {formatDateTimeId(selectedSession.created_at)}
                </p>
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                className="text-slate-400 hover:text-[#0B1220] p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 min-h-60 max-h-96 flex items-center justify-center">
              <ImageWithFallback 
                src={selectedSession.image_url} 
                hasImage={selectedSession.has_image || Boolean(selectedSession.image_url)}
                isSynthetic={selectedSession.is_synthetic}
                alt="Hasil Analisis" 
                className="max-h-96 object-contain" 
                containerClassName="h-60 w-full"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
              {selectedSession.summary}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
