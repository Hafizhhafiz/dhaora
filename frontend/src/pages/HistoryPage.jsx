import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Search, 
  RefreshCw, 
  AlertCircle, 
  Calculator, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  ShieldAlert,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { getHistory } from '../api/client';
import { formatNumber, formatDateTimeId } from '../utils/formatters';
import ImageWithFallback from '../components/ImageWithFallback';

export default function HistoryPage({ setActiveTab, setSelectedAnalysis }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecies, setFilterSpecies] = useState('all');
  const [showSynthetic, setShowSynthetic] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await getHistory(100);
      setHistory(data);
    } catch (err) {
      console.error('Gagal memuat riwayat:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const filteredHistory = history.filter(item => {
    // 1. Synthetic test filter
    const isSynth = item.is_synthetic ?? (
      item.filename.toLowerCase().includes('synth_') ||
      item.filename.toLowerCase().includes('blank') ||
      item.filename.toLowerCase().includes('sample_test') ||
      item.filename.toLowerCase().includes('test_pipeline')
    );
    if (!showSynthetic && isSynth) return false;

    // 2. Search query filter
    const matchesSearch = item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    // 3. Species breakdown filter
    const bCount = item.brachysoma_count ?? item.kembung_count ?? 0;
    const lCount = item.leptolepis_count ?? item.layang_count ?? 0;
    const sCount = item.sulphureus_count ?? 0;

    if (filterSpecies === 'brachysoma') return bCount > 0;
    if (filterSpecies === 'leptolepis') return lCount > 0;
    if (filterSpecies === 'sulphureus') return sCount > 0;
    return true;
  });

  // Pagination calculation
  const totalItems = filteredHistory.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedItems = filteredHistory.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-mono">
              FishGuard CV Store
            </span>
            <span className="text-xs text-slate-400">Pendaratan & Estimasi Panjang</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" /> Riwayat Analisis Citra & Biometrik
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Daftar rekaman inferensi citra ikan di PPN Karangantu, pencacahan individu, dan estimasi panjang morfometrik terkalibrasi ArUco 50mm.
          </p>
        </div>
        <button
          onClick={loadHistory}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-2 transition-all cursor-pointer self-start md:self-auto shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          <span>Segarkan Data</span>
        </button>
      </div>

      {/* Filters & Controls Bar */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Cari nama file, ID rekaman, atau kata kunci..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <select
              value={filterSpecies}
              onChange={(e) => {
                setFilterSpecies(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="all">Semua Spesies</option>
              <option value="brachysoma">Mengandung R. brachysoma (Kembung)</option>
              <option value="leptolepis">Mengandung S. leptolepis (Selar)</option>
              <option value="sulphureus">Mengandung U. sulphureus (Pepetek)</option>
            </select>
          </div>

          {/* Toggle Synthetic / Test Sessions */}
          <label className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 cursor-pointer select-none hover:border-slate-700">
            <input 
              type="checkbox"
              checked={showSynthetic}
              onChange={(e) => {
                setShowSynthetic(e.target.checked);
                setCurrentPage(1);
              }}
              className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <span>Tampilkan Sesi Uji ({formatNumber(history.filter(h => h.is_synthetic).length)})</span>
          </label>
        </div>
      </div>

      {/* Table Section */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
            <span>Memuat arsip riwayat inferensi dari database lokal...</span>
          </div>
        ) : paginatedItems.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center">
            <AlertCircle className="w-10 h-10 text-slate-600 mb-3" />
            <p className="font-semibold text-slate-300">Tidak ada data riwayat yang cocok.</p>
            <p className="text-slate-500 mt-1 max-w-sm">
              Coba sesuaikan kata kunci pencarian atau aktifkan opsi "Tampilkan Sesi Uji" untuk melihat rekaman pengujian otomatis.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto -mx-5 px-5">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="pb-3 px-3">Pratinjau Citra</th>
                    <th className="pb-3 px-3">Identitas & File</th>
                    <th className="pb-3 px-3">Waktu Analisis</th>
                    <th className="pb-3 px-3 text-center">Cacah Total</th>
                    <th className="pb-3 px-3 text-center">Kembung</th>
                    <th className="pb-3 px-3 text-center">Selar</th>
                    <th className="pb-3 px-3 text-center">Pepetek</th>
                    <th className="pb-3 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {paginatedItems.map((row) => {
                    const hasValidImage = row.has_result_image || row.has_image;
                    const imageUrl = row.result_image_url || row.image_url;

                    return (
                      <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3">
                          <div className="w-14 h-12">
                            <ImageWithFallback
                              src={imageUrl}
                              hasImage={hasValidImage}
                              isSynthetic={row.is_synthetic}
                              alt={row.filename}
                              className="w-14 h-12 object-cover rounded border border-slate-700 bg-slate-950"
                              containerClassName="w-14 h-12"
                            />
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-200 flex items-center gap-2">
                            <span>{row.filename}</span>
                            {row.is_synthetic && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60 font-mono font-medium">
                                Uji Sistem
                              </span>
                            )}
                          </div>
                          <div className="font-mono text-[10px] text-cyan-400/90 mt-0.5">
                            ID: {row.id}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-300 text-[11px] whitespace-nowrap">
                          {formatDateTimeId(row.timestamp)}
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-white font-mono">
                          {formatNumber(row.total_count)}
                        </td>
                        <td className="py-3 px-3 text-center text-cyan-300 font-semibold font-mono">
                          {formatNumber(row.brachysoma_count ?? row.kembung_count ?? 0)}
                        </td>
                        <td className="py-3 px-3 text-center text-yellow-300 font-semibold font-mono">
                          {formatNumber(row.leptolepis_count ?? row.layang_count ?? 0)}
                        </td>
                        <td className="py-3 px-3 text-center text-orange-300 font-semibold font-mono">
                          {formatNumber(row.sulphureus_count ?? 0)}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => {
                              if (setSelectedAnalysis) setSelectedAnalysis(row);
                              setActiveTab('counting');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-950/80 text-cyan-300 border border-slate-700 hover:border-cyan-700/60 text-[11px] font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                          >
                            <Calculator className="w-3.5 h-3.5" />
                            <span>Detail</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <div>
                Menampilkan <span className="text-white font-mono font-semibold">{totalItems === 0 ? 0 : startIndex + 1}</span> - <span className="text-white font-mono font-semibold">{Math.min(startIndex + pageSize, totalItems)}</span> dari <span className="text-cyan-400 font-mono font-semibold">{formatNumber(totalItems)}</span> rekaman
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={validCurrentPage <= 1}
                  className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title="Halaman Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-mono text-slate-200">
                  {validCurrentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={validCurrentPage >= totalPages}
                  className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title="Halaman Selanjutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
