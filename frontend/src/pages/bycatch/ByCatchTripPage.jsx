import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  PlusCircle, 
  Database, 
  Calendar, 
  Anchor, 
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { getByCatchRecords, createByCatchTrip } from '../../api/client';
import { formatNumber } from '../../utils/formatters';

export default function ByCatchTripPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New trip form state
  const [landingDate, setLandingDate] = useState(new Date().toISOString().split('T')[0]);
  const [vesselTripId, setVesselTripId] = useState("TRIP-KM-BARUNA-04");
  const [fishingGear, setFishingGear] = useState("Jaring Insang / Gillnet");
  const [targetSpecies, setTargetSpecies] = useState("Selaroides leptolepis");
  const [detectedSpecies, setDetectedSpecies] = useState("Upeneus sulphureus");
  const [catchRole, setCatchRole] = useState("incidental_non_target_retained");
  const [catchHandling, setCatchHandling] = useState("retained");
  const [notes, setNotes] = useState("Hasil tangkapan pendaratan dermaga Karangantu");
  const [submitting, setSubmitting] = useState(false);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getByCatchRecords(50);
      setData(res);
    } catch (err) {
      setError(err.message || "Gagal memuat catatan trip ByCatch.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await createByCatchTrip({
        landing_date: landingDate,
        vessel_trip_id: vesselTripId,
        fishing_gear: fishingGear,
        target_species: targetSpecies,
        detected_species: detectedSpecies,
        catch_role: catchRole,
        catch_handling: catchHandling,
        notes: notes
      });
      setShowAddModal(false);
      await fetchRecords();
    } catch (err) {
      alert("Gagal menyimpan trip: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-teal-50 text-[#0E6E7E] border border-teal-200 font-mono">
              ByCatch Trip Log
            </span>
            <span className="text-xs text-slate-500">Monitoring Pendaratan Kapal</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0B1220] tracking-tight flex items-center gap-2.5">
            <ClipboardList className="w-6 h-6 text-[#0E6E7E]" />
            <span>Pencatatan Trip & <span className="font-serif-italic font-normal">Monitoring ByCatch.</span></span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Basis data log pendaratan nelayan tersimpan terpisah pada <code className="text-[#0E6E7E] font-mono">bycatch/data/app.sqlite</code>.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchRecords}
            className="p-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer border border-slate-200 shadow-sm"
            title="Muat Ulang Data"
          >
            <RefreshCw className={`w-4 h-4 text-[#0E6E7E] ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0E6E7E] hover:bg-[#0b5865] text-white text-xs font-medium transition-all cursor-pointer shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Catat Trip Baru</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Summary Stat Cards */}
      {data?.summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Citra Pendaratan</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1220] mt-1 tabular-nums">{formatNumber(data.summary.total_images || 0)}</div>
          </div>
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Deteksi AI</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0E6E7E] mt-1 tabular-nums">{formatNumber(data.summary.total_detections || 0)}</div>
          </div>
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Catatan Trip Terdaftar</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1220] mt-1 tabular-nums">{formatNumber(data.summary.total_catch_records || 0)}</div>
          </div>
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Status Basis Data</div>
            <div className="text-xs font-mono text-emerald-700 mt-2 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> WAL Mode Active
            </div>
          </div>
        </div>
      )}

      {/* Records Table */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#0B1220] flex items-center gap-2">
            <Database className="w-4 h-4 text-[#0E6E7E]" />
            <span>Daftar Riwayat Tangkapan & ByCatch Terkini</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono tabular-nums">
            {formatNumber(data?.records?.length || 0)} rekaman ditampilkan
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">ID Trip / Kapal</th>
                <th className="py-3 px-4">Alat Tangkap</th>
                <th className="py-3 px-4">Target Trip</th>
                <th className="py-3 px-4">Spesies Terdata</th>
                <th className="py-3 px-4">Peran Tangkapan</th>
                <th className="py-3 px-4">Penanganan</th>
                <th className="py-3 px-4">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {data?.records?.map((row) => (
                <tr key={row.record_id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 px-4 text-slate-500 whitespace-nowrap">{row.landing_date}</td>
                  <td className="py-2.5 px-4 font-semibold text-[#0B1220] whitespace-nowrap">{row.vessel_trip_id || "-"}</td>
                  <td className="py-2.5 px-4 text-slate-700 whitespace-nowrap">{row.fishing_gear}</td>
                  <td className="py-2.5 px-4 text-[#0E6E7E] whitespace-nowrap">{row.target_species || "-"}</td>
                  <td className="py-2.5 px-4 text-[#0B1220] italic whitespace-nowrap">{row.detected_species}</td>
                  <td className="py-2.5 px-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      row.catch_role === 'target' 
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {row.catch_role.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 capitalize text-slate-700 whitespace-nowrap">{row.catch_handling}</td>
                  <td className="py-2.5 px-4 text-slate-500 font-sans text-xs max-w-xs truncate">{row.notes || "-"}</td>
                </tr>
              ))}
              {(!data?.records || data.records.length === 0) && !loading && (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-slate-400 font-sans">
                    Belum ada rekaman trip ByCatch yang tercatat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Trip Record */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-[#0B1220] flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-[#0E6E7E]" />
              <span>Catat Trip Pendaratan Baru</span>
            </h3>

            <form onSubmit={handleCreateTrip} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">Tanggal Pendaratan</label>
                  <input
                    type="date"
                    value={landingDate}
                    onChange={(e) => setLandingDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[#0B1220] focus:outline-none focus:border-[#0E6E7E]"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">ID Kapal / Trip</label>
                  <input
                    type="text"
                    value={vesselTripId}
                    onChange={(e) => setVesselTripId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[#0B1220] focus:outline-none focus:border-[#0E6E7E]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-medium">Alat Tangkap</label>
                <input
                  type="text"
                  value={fishingGear}
                  onChange={(e) => setFishingGear(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[#0B1220] focus:outline-none focus:border-[#0E6E7E]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">Target Spesies Trip</label>
                  <input
                    type="text"
                    value={targetSpecies}
                    onChange={(e) => setTargetSpecies(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[#0B1220] focus:outline-none focus:border-[#0E6E7E]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">Spesies Teridentifikasi</label>
                  <input
                    type="text"
                    value={detectedSpecies}
                    onChange={(e) => setDetectedSpecies(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[#0B1220] focus:outline-none focus:border-[#0E6E7E]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">Peran Tangkapan</label>
                  <select
                    value={catchRole}
                    onChange={(e) => setCatchRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[#0B1220] focus:outline-none focus:border-[#0E6E7E]"
                  >
                    <option value="target">Target Catch</option>
                    <option value="incidental_non_target_retained">Incidental Retained Bycatch</option>
                    <option value="discarded_non_target">Discarded Bycatch</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">Penanganan</label>
                  <select
                    value={catchHandling}
                    onChange={(e) => setCatchHandling(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[#0B1220] focus:outline-none focus:border-[#0E6E7E]"
                  >
                    <option value="retained">Retained (Simpan)</option>
                    <option value="discarded">Discarded (Buang)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-medium">Catatan Operasional</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[#0B1220] h-16 focus:outline-none focus:border-[#0E6E7E]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-full bg-[#0E6E7E] hover:bg-[#0b5865] text-white font-medium cursor-pointer"
                >
                  {submitting ? "Menyimpan..." : "Simpan Catatan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
