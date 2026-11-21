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
  ExternalLink,
  Sparkles,
  Sliders,
  ChevronDown,
  X,
  Plus
} from 'lucide-react';
import { detectByCatch } from '../../api/client';
import { formatNumber, formatPercent } from '../../utils/formatters';

const AVAILABLE_SPECIES_OPTIONS = [
  { id: 'kembung_perempuan', name: 'Kembung Perempuan', scientific: 'R. brachysoma' },
  { id: 'selar_kuning', name: 'Selar Kuning', scientific: 'S. leptolepis' },
  { id: 'kuniran', name: 'Ikan Kuniran', scientific: 'U. sulphureus' },
  { id: 'tongkol', name: 'Tongkol Lisong', scientific: 'Auxis rochei' },
  { id: 'tembang', name: 'Ikan Tembang', scientific: 'Sardinella fimbriata' }
];

export default function ByCatchDetectPage({ bycatchHealth }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedTargetSpecies, setSelectedTargetSpecies] = useState(['kembung_perempuan', 'selar_kuning']);
  const [fishingGear, setFishingGear] = useState("Jaring Insang / Gillnet");
  const [catchHandling, setCatchHandling] = useState("retained");
  const [confidence, setConfidence] = useState(0.50);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const sampleImages = [
    { name: "Sampel 01: Multi-Spesies", tag: "3 Spesies Target", path: "/static/samples/sample_test_01.jpg" },
    { name: "Sampel 02: Pendaratan Selar", tag: "S. leptolepis", path: "/static/samples/sample_test_02.jpg" },
    { name: "Sampel 03: Pendaratan Kuniran", tag: "U. sulphureus", path: "/static/samples/sample_test_03.jpg" },
  ];

  const toggleSpecies = (id) => {
    if (selectedTargetSpecies.includes(id)) {
      if (selectedTargetSpecies.length === 1) return; // Keep at least one
      setSelectedTargetSpecies(selectedTargetSpecies.filter(s => s !== id));
    } else {
      setSelectedTargetSpecies([...selectedTargetSpecies, id]);
    }
  };

  const handleApplyPreset = (speciesArr) => {
    setSelectedTargetSpecies(speciesArr);
  };

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
      const targetSpeciesString = selectedTargetSpecies.join('; ');
      const data = await detectByCatch(
        selectedFile,
        targetSpeciesString,
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
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-teal-50 text-[#0E6E7E] border border-teal-200 font-mono">
              ByCatch AI & FAO Rules
            </span>
            <span className="text-xs text-slate-500">Permen-KP 36/2023 & IUCN/CITES</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0B1220] tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-[#0E6E7E]" />
            <span>Deteksi ByCatch & <span className="font-serif-italic font-normal">Evaluasi Peran Tangkapan.</span></span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Inferensi YOLO terpadu dengan Mesin Aturan FAO & Permen-KP 36/2023 untuk membedakan Target Catch dari ByCatch.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 font-mono font-medium">
            Model: {bycatchHealth?.active_model_metadata?.architecture || "YOLO11n"} (Siap)
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: Controls vs Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Context Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* 1. Trip Operational Context Card */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold text-[#0B1220] flex items-center gap-2">
              <Anchor className="w-4 h-4 text-[#0E6E7E]" />
              <span>Konteks Operasional Trip Nelayan</span>
            </h2>

            {/* Target Species Multi-Select Chips */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">
                  Target Spesies Trip (Pilih Spesies)
                </label>
                <span className="text-[11px] text-slate-500 font-mono">
                  {selectedTargetSpecies.length} terpilih
                </span>
              </div>

              {/* Species Chips */}
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_SPECIES_OPTIONS.map((sp) => {
                  const isSelected = selectedTargetSpecies.includes(sp.id);
                  return (
                    <button
                      key={sp.id}
                      type="button"
                      onClick={() => toggleSpecies(sp.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-teal-50 border-teal-300 text-[#0E6E7E] font-medium shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <span>{sp.name}</span>
                      <span className="text-[10px] italic text-slate-500">({sp.scientific})</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#0E6E7E] shrink-0 ml-0.5" />}
                    </button>
                  );
                })}
              </div>

              {/* 1-Click Presets */}
              <div className="pt-1 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-slate-500 font-medium mr-1">Preset Cepat:</span>
                <button
                  type="button"
                  onClick={() => handleApplyPreset(['kembung_perempuan', 'selar_kuning'])}
                  className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 cursor-pointer"
                >
                  Kembung & Selar
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset(['selar_kuning'])}
                  className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 cursor-pointer"
                >
                  Hanya Selar
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset(['kembung_perempuan', 'selar_kuning', 'kuniran'])}
                  className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 cursor-pointer"
                >
                  Pelagis Kecil (3 Jenis)
                </button>
              </div>
            </div>

            {/* Fishing Gear Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Alat Penangkapan Ikan (API)
              </label>
              <div className="relative">
                <select
                  value={fishingGear}
                  onChange={(e) => setFishingGear(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0B1220] focus:outline-none focus:border-[#0E6E7E] appearance-none pr-9 cursor-pointer"
                >
                  <option value="Jaring Insang / Gillnet">Jaring Insang (Gillnet)</option>
                  <option value="Rawai Dasar / Bottom Longline">Rawai Dasar (Bottom Longline)</option>
                  <option value="Pukat Cincin / Purse Seine">Pukat Cincin (Purse Seine)</option>
                  <option value="Bagan Tancap / Lift Net">Bagan Tancap (Lift Net)</option>
                  <option value="Pancing Ulur / Handline">Pancing Ulur (Handline)</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Catch Handling */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Penanganan Hasil Tangkapan (Catch Handling)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCatchHandling("retained")}
                  className={`py-2 px-3 rounded-full text-xs font-medium border text-center transition-all cursor-pointer ${
                    catchHandling === "retained"
                      ? "bg-amber-50 border-amber-300 text-amber-800 font-semibold"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Disimpan (Retained)
                </button>
                <button
                  type="button"
                  onClick={() => setCatchHandling("discarded")}
                  className={`py-2 px-3 rounded-full text-xs font-medium border text-center transition-all cursor-pointer ${
                    catchHandling === "discarded"
                      ? "bg-rose-50 border-rose-300 text-rose-800 font-semibold"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Dibuang (Discarded)
                </button>
              </div>
            </div>

            {/* Confidence Slider */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex justify-between text-xs">
                <span className="text-slate-700 font-semibold flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#0E6E7E]" /> Ambang Keyakinan:
                </span>
                <span className="text-[#0E6E7E] font-mono font-bold bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200 tabular-nums">
                  {formatPercent(confidence * 100, 0)}
                </span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.90"
                step="0.05"
                value={confidence}
                onChange={(e) => setConfidence(parseFloat(e.target.value))}
                className="w-full accent-[#0E6E7E] cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Sensitif (10%-35%)</span>
                <span className="text-[#0E6E7E] font-semibold">Seimbang (50% Rekomendasi)</span>
                <span>Ketat (75%-90%)</span>
              </div>
            </div>
          </div>

          {/* 2. Upload & Quick Sample Selection Card */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4 shadow-sm sticky top-20">
            <h2 className="text-sm font-bold text-[#0B1220] flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#0E6E7E]" />
              <span>Unggah Citra Tangkapan</span>
            </h2>

            <label className="border-2 border-dashed border-slate-200 hover:border-[#0E6E7E] rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50">
              <Upload className="w-6 h-6 text-[#0E6E7E] mb-2" />
              <span className="text-xs text-[#0B1220] font-semibold">Klik untuk memilih berkas citra</span>
              <span className="text-[10px] text-slate-500 mt-0.5">JPG, PNG, atau WebP (Maks. 15 MB)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* Quick Sample Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-700 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0E6E7E]" /> Sampel Citra Uji:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {sampleImages.map((samp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleLoadSample(samp.path)}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all cursor-pointer group"
                  >
                    <div className="text-[10px] text-slate-500 font-mono">Uji #0{idx + 1}</div>
                    <div className="text-xs font-semibold text-[#0B1220] truncate mt-0.5">{samp.name.split(': ')[1]}</div>
                    <div className="text-[10px] text-[#0E6E7E] truncate mt-0.5">{samp.tag}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                onClick={handleRunDetection}
                disabled={loading || !selectedFile}
                className={`w-full py-3 rounded-full font-medium text-xs flex items-center justify-center gap-2 transition-all ${
                  loading || !selectedFile
                    ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                    : "bg-[#0E6E7E] hover:bg-[#0b5865] text-white shadow-sm cursor-pointer"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Mengevaluasi Deteksi & Aturan FAO...</span>
                  </>
                ) : (
                  <>
                    <Scan className="w-4 h-4" />
                    <span>Jalankan Screening ByCatch</span>
                  </>
                )}
              </button>
              {!selectedFile && (
                <p className="text-[11px] text-center text-slate-500 mt-2">
                  Pilih atau unggah citra spesimen tangkapan terlebih dahulu
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Visual Result & Evaluation Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Image Viewer */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#0B1220] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#0E6E7E]" />
                <span>Visualisasi Deteksi & Bounding Box</span>
              </h2>
              {result && (
                <span className="text-[10px] font-mono bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 text-slate-700">
                  ID: {result.analysis_id}
                </span>
              )}
            </div>

            <div className="relative min-h-[300px] max-h-[440px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center">
              {result?.result_image_url ? (
                <img
                  src={result.result_image_url}
                  alt="ByCatch Detection Result"
                  className="max-h-[440px] w-auto object-contain"
                />
              ) : previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Upload Preview"
                  className="max-h-[440px] w-auto object-contain opacity-90"
                />
              ) : (
                <div className="text-center p-8 text-slate-400 text-xs flex flex-col items-center">
                  <Scan className="w-10 h-10 mb-3 text-slate-500 opacity-60" />
                  <p className="font-medium text-slate-300">Belum Ada Citra yang Dianalisis</p>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                    Unggah atau pilih sampel citra tangkapan di sebelah kiri untuk menjalankan inferensi ByCatch.
                  </p>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                Target Catch
              </span>
              <span className="flex items-center gap-1.5 text-amber-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                Bycatch (Retained)
              </span>
              <span className="flex items-center gap-1.5 text-rose-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                Bycatch (Discarded)
              </span>
            </div>
          </div>

          {/* Results Summary & Breakdown */}
          {result && (
            <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4 shadow-sm animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-[#0B1220] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Ringkasan Evaluasi Tangkapan Sampingan</span>
                </h3>
                <span className="text-xs font-mono font-bold text-[#0E6E7E] bg-teal-50 border border-teal-200 px-3 py-0.5 rounded-full tabular-nums">
                  Rasio Bycatch: {formatPercent(result.summary.bycatch_ratio_percent, 1)}
                </span>
              </div>

              {/* Stat Counters */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Total Ekor</div>
                  <div className="text-2xl font-bold text-[#0B1220] mt-1 font-mono tabular-nums">{formatNumber(result.total_detected)}</div>
                </div>
                <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 text-center">
                  <div className="text-[10px] text-emerald-800 uppercase font-semibold">Target Catch</div>
                  <div className="text-2xl font-bold text-emerald-700 mt-1 font-mono tabular-nums">{formatNumber(result.summary.target_count)}</div>
                </div>
                <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 text-center">
                  <div className="text-[10px] text-amber-800 uppercase font-semibold">ByCatch</div>
                  <div className="text-2xl font-bold text-amber-700 mt-1 font-mono tabular-nums">{formatNumber(result.summary.bycatch_count)}</div>
                </div>
              </div>

              {/* Detections List */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-semibold text-slate-700">Rincian Individu & Status Perlindungan:</div>
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {result.detections.map((det, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                        det.catch_role.is_target
                          ? "bg-emerald-50/30 border-emerald-200"
                          : "bg-amber-50/30 border-amber-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-[#0B1220]">
                          {det.common_name} <span className="italic text-slate-500 font-normal">({det.scientific_name})</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          det.catch_role.is_target
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}>
                          {det.catch_role.catch_role.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-600">
                        Aturan FAO: <span className="text-[#0E6E7E] font-mono font-semibold">{det.catch_role.rule_id}</span> — {det.catch_role.evidence}
                      </div>

                      <div className="flex flex-wrap gap-2 pt-0.5 text-[10px] font-mono">
                        <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-700">
                          IUCN: <strong className="text-[#0E6E7E]">{det.conservation.iucn_category}</strong>
                        </span>
                        <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-700">
                          CITES: <strong className="text-[#0E6E7E]">{det.conservation.cites_appendix}</strong>
                        </span>
                        <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-700">
                          KKP: <strong className="text-[#0E6E7E]">{det.conservation.national_protection}</strong>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-500 leading-relaxed">
                {result.disclaimer}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
