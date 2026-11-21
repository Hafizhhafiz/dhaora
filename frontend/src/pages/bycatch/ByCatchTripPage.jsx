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
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <ClipboardList className="w-5 h-5 text-blue-400" />
            <span>Pencatatan Trip & Monitoring Tangkapan Sampingan</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Basis data log pendaratan nelayan tersimpan terpisah pada <code className="text-cyan-400 font-mono">bycatch/data/app.sqlite</code>.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchRecords}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer border border-slate-700"
            title="Muat Ulang Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-blue-600/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Catat Trip Baru</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Summary Stat Cards */}
      {data?.summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-sm">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Citra Pendaratan</div>
            <div className="text-2xl font-bold text-slate-100 mt-1">{formatNumber(data.summary.total_images || 0)}</div>
          </div>
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-sm">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Deteksi AI</div>
            <div className="text-2xl font-bold text-cyan-400 mt-1">{formatNumber(data.summary.total_detections || 0)}</div>
          </div>
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-sm">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Catatan Trip Terdaftar</div>
            <div className="text-2xl font-bold text-blue-400 mt-1">{formatNumber(data.summary.total_catch_records || 0)}</div>
          </div>
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-sm">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Status Basis Data</div>
            <div className="text-xs font-mono text-emerald-400 mt-2 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> WAL Mode Active
            </div>
          </div>
        </div>
      )}

      {/* Records Table */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Daftar Riwayat Tangkapan & ByCatch Terkini</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {formatNumber(data?.records?.length || 0)} rekaman ditampilkan
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-300 uppercase tracking-wider text-[11px] border-b border-slate-800">
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
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {data?.records?.map((row) => (
                <tr key={row.record_id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-4 text-slate-400 whitespace-nowrap">{row.landing_date}</td>
                  <td className="py-2.5 px-4 font-semibold text-slate-200 whitespace-nowrap">{row.vessel_trip_id || "-"}</td>
                  <td className="py-2.5 px-4 text-slate-300 whitespace-nowrap">{row.fishing_gear}</td>
                  <td className="py-2.5 px-4 text-cyan-400 whitespace-nowrap">{row.target_species || "-"}</td>
                  <td className="py-2.5 px-4 text-slate-100 italic whitespace-nowrap">{row.detected_species}</td>
                  <td className="py-2.5 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      row.catch_role === 'target' 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {row.catch_role.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 capitalize text-slate-300 whitespace-nowrap">{row.catch_handling}</td>
                  <td className="py-2.5 px-4 text-slate-400 font-sans text-xs max-w-xs truncate">{row.notes || "-"}</td>
                </tr>
              ))}
              {(!data?.records || data.records.length === 0) && !loading && (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-slate-500 font-sans">
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
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-scaleUp">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-blue-400" />
              <span>Catat Trip Pendaratan Baru</span>
            </h3>

            <form onSubmit={handleCreateTrip} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300">Tanggal Pendaratan</label>
                  <input
                    type="date"
                    value={landingDate}
                    onChange={(e) => setLandingDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300">ID Kapal / Trip</label>
                  <input
                    type="text"
                    value={vesselTripId}
                    onChange={(e) => setVesselTripId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300">Alat Tangkap</label>
                <input
                  type="text"
                  value={fishingGear}
                  onChange={(e) => setFishingGear(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300">Target Spesies Trip</label>
                  <input
                    type="text"
                    value={targetSpecies}
                    onChange={(e) => setTargetSpecies(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300">Spesies Teridentifikasi</label>
                  <input
                    type="text"
                    value={detectedSpecies}
                    onChange={(e) => setDetectedSpecies(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300">Peran Tangkapan</label>
                  <select
                    value={catchRole}
                    onChange={(e) => setCatchRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                  >
                    <option value="target">Target Catch</option>
                    <option value="incidental_non_target_retained">Incidental Retained Bycatch</option>
                    <option value="discarded_non_target">Discarded Bycatch</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300">Penanganan</label>
                  <select
                    value={catchHandling}
                    onChange={(e) => setCatchHandling(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                  >
                    <option value="retained">Retained (Simpan)</option>
                    <option value="discarded">Discarded (Buang)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300">Catatan Operasional</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 h-16"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold cursor-pointer"
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
