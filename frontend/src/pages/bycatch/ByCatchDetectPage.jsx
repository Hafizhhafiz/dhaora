import React, { useState } from 'react';
import { 
  Upload, 
  Scan, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Layers, 
  Tag, 
  Anchor, 
  FileCheck, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { detectByCatch } from '../../api/client';

export default function ByCatchDetectPage({ bycatchHealth }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [targetSpecies, setTargetSpecies] = useState("kembung_perempuan; selar_kuning");
  const [fishingGear, setFishingGear] = useState("Jaring Insang / Gillnet");
  const [catchHandling, setCatchHandling] = useState("retained");
  const [confidence, setConfidence] = useState(0.25);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const sampleImages = [
    { name: "Sample 01: Pendaratan Multi-Spesies", path: "/static/samples/sample_test_01.jpg" },
    { name: "Sample 02: Pendaratan Selar Kuning", path: "/static/samples/sample_test_02.jpg" },
    { name: "Sample 03: Pendaratan Kuniran", path: "/static/samples/sample_test_03.jpg" },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleLoadSample = async (samplePath) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(samplePath);
      const blob = await res.blob();
      const file = new File([blob], samplePath.split('/').pop(), { type: "image/jpeg" });
      setSelectedFile(file);
      setPreviewUrl(samplePath);
      setResult(null);
    } catch (err) {
      setError("Gagal memuat sampel gambar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRunDetection = async () => {
    if (!selectedFile) {
      setError("Silakan pilih gambar terlebih dahulu.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await detectByCatch(
        selectedFile,
        targetSpecies,
        fishingGear,
        catchHandling,
        confidence
      );
      setResult(data);
    } catch (err) {
      setError(err.message || "Gagal melakukan deteksi ByCatch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
            <span>Deteksi ByCatch & Evaluasi Peran Tangkapan</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Inferensi YOLO11n terpadu dengan Mesin Aturan FAO untuk memisahkan Target Catch dari ByCatch secara operasional.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-400 font-mono">
            Model: {bycatchHealth?.active_model_metadata?.architecture || "YOLO11n"} (Ready)
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: Controls vs Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Context Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* 1. Trip Operational Context Card */}
          <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Anchor className="w-4 h-4 text-cyan-400" />
              <span>Konteks Operasional Trip Nelayan</span>
            </h2>

            {/* Target Species Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Spesies Target Trip (Koma / Titik Koma Pisah)
              </label>
              <input
                type="text"
                value={targetSpecies}
                onChange={(e) => setTargetSpecies(e.target.value)}
                placeholder="Contoh: selar_kuning; kembung_perempuan"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setTargetSpecies("kembung_perempuan; selar_kuning")}
                  className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  Kembung & Selar
                </button>
                <button
                  type="button"
                  onClick={() => setTargetSpecies("selar_kuning")}
                  className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  Hanya Selar
                </button>
                <button
                  type="button"
                  onClick={() => setTargetSpecies("tongkol; cakalang")}
                  className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  Tongkol (Lain)
                </button>
              </div>
            </div>

            {/* Fishing Gear Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Alat Tangkap (Fishing Gear)
              </label>
              <select
                value={fishingGear}
                onChange={(e) => setFishingGear(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Jaring Insang / Gillnet">Jaring Insang (Gillnet)</option>
                <option value="Rawai Dasar / Bottom Longline">Rawai Dasar (Bottom Longline)</option>
                <option value="Pukat Cincin / Purse Seine">Pukat Cincin (Purse Seine)</option>
                <option value="Bagan Tancap / Lift Net">Bagan Tancap (Lift Net)</option>
                <option value="Pancing Ulur / Handline">Pancing Ulur (Handline)</option>
              </select>
            </div>

            {/* Catch Handling */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Penanganan Tangkapan (Catch Handling)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCatchHandling("retained")}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                    catchHandling === "retained"
                      ? "bg-amber-950/60 border-amber-600 text-amber-300 font-semibold"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  Disimpan (Retained)
                </button>
                <button
                  type="button"
                  onClick={() => setCatchHandling("discarded")}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                    catchHandling === "discarded"
                      ? "bg-red-950/60 border-red-600 text-red-300 font-semibold"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  Dibuang (Discarded)
                </button>
              </div>
            </div>

            {/* Confidence Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Ambang Confidence:</span>
                <span className="text-cyan-400 font-mono font-semibold">{(confidence * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.90"
                step="0.05"
                value={confidence}
                onChange={(e) => setConfidence(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>

          {/* 2. Upload / Sample Selection Card */}
          <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Unggah Citra Tangkapan</span>
            </h2>

            <label className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-950/50">
              <Upload className="w-7 h-7 text-slate-400 mb-2" />
              <span className="text-xs text-slate-300 font-medium">Klik untuk memilih file citra</span>
              <span className="text-[10px] text-slate-500 mt-0.5">JPG, PNG, atau WebP (Maks. 15 MB)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* Quick Sample Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium">Atau gunakan sampel citra uji:</div>
              <div className="flex flex-col gap-1.5">
                {sampleImages.map((samp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleLoadSample(samp.path)}
                    className="text-left text-xs px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer truncate"
                  >
                    {samp.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleRunDetection}
              disabled={loading || !selectedFile}
              className={`w-full py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                loading || !selectedFile
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memproses Deteksi & Aturan FAO...</span>
                </>
              ) : (
                <>
                  <Scan className="w-4 h-4" />
                  <span>Jalankan Screening ByCatch</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Visual Result & Evaluation Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Image Viewer */}
          <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Visualisasi Deteksi & Bounding Box</span>
              </h2>
              {result && (
                <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                  ID: {result.analysis_id}
                </span>
              )}
            </div>

            <div className="relative min-h-[320px] max-h-[460px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800/80 flex items-center justify-center">
              {result?.result_image_url ? (
                <img
                  src={result.result_image_url}
                  alt="ByCatch Detection Result"
                  className="max-h-[460px] w-auto object-contain"
                />
              ) : previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Upload Preview"
                  className="max-h-[460px] w-auto object-contain opacity-80"
                />
              ) : (
                <div className="text-center p-6 text-slate-500 text-xs">
                  <Scan className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p>Unggah atau pilih sampel citra untuk memulai screening</p>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs pt-2 border-t border-slate-800/80 font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" />
                Target Catch
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block" />
                Bycatch (Retained)
              </span>
              <span className="flex items-center gap-1.5 text-red-400">
                <span className="w-2.5 h-2.5 rounded bg-red-500 inline-block" />
                Bycatch (Discarded)
              </span>
            </div>
          </div>

          {/* Results Summary & Breakdown */}
          {result && (
            <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 animate-fadeIn">
              <h2 className="text-sm font-semibold text-slate-200 flex items-center justify-between">
                <span>Ringkasan Evaluasi Tangkapan Sampingan</span>
                <span className="text-xs font-mono text-cyan-400">
                  Rasio Bycatch: {result.summary.bycatch_ratio_percent}%
                </span>
              </h2>

              {/* Stat Counters */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase">Total Ekor</div>
                  <div className="text-xl font-bold text-slate-100">{result.total_detected}</div>
                </div>
                <div className="bg-emerald-950/40 p-3 rounded-lg border border-emerald-800/60 text-center">
                  <div className="text-[10px] text-emerald-400 uppercase">Target Catch</div>
                  <div className="text-xl font-bold text-emerald-300">{result.summary.target_count}</div>
                </div>
                <div className="bg-amber-950/40 p-3 rounded-lg border border-amber-800/60 text-center">
                  <div className="text-[10px] text-amber-400 uppercase">ByCatch</div>
                  <div className="text-xl font-bold text-amber-300">{result.summary.bycatch_count}</div>
                </div>
              </div>

              {/* Detections List */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-semibold text-slate-300">Rincian Individu & Status Konservasi:</div>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {result.detections.map((det, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                        det.catch_role.is_target
                          ? "bg-slate-950/80 border-emerald-800/50"
                          : "bg-slate-950/80 border-amber-800/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-slate-200">
                          {det.common_name} <span className="italic text-slate-400 font-normal">({det.scientific_name})</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          det.catch_role.is_target
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                            : "bg-amber-950 text-amber-400 border border-amber-800"
                        }`}>
                          {det.catch_role.catch_role.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400">
                        Aturan: <span className="text-cyan-400 font-mono">{det.catch_role.rule_id}</span> — {det.catch_role.evidence}
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1 text-[10px] font-mono">
                        <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                          IUCN: <strong className="text-cyan-400">{det.conservation.iucn_category}</strong>
                        </span>
                        <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                          CITES: <strong className="text-cyan-400">{det.conservation.cites_appendix}</strong>
                        </span>
                        <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                          KKP: <strong className="text-cyan-400">{det.conservation.national_protection}</strong>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-[10px] text-slate-500 leading-relaxed">
                {result.disclaimer}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
