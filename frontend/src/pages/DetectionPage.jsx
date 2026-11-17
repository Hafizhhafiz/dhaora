import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, 
  Scan, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Sliders, 
  Fish, 
  Calculator, 
  FileText,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  Camera,
  CameraOff,
  X
} from 'lucide-react';
import { detectFish } from '../api/client';

export default function DetectionPage({ setActiveTab, setSelectedAnalysis, healthInfo }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [confidence, setConfidence] = useState(0.25);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      setError("Gagal mengakses kamera perangkat: " + (err.message || "Izin ditolak atau kamera tidak ditemukan"));
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `camera_${Date.now()}.jpg`, { type: "image/jpeg" });
        stopCamera();
        handleFileChange(file);
      }
    }, "image/jpeg", 0.95);
  };

  const handleFileChange = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Hanya file citra (JPG, PNG, WebP) yang diizinkan.');
      return;
    }
    setError(null);
    setSelectedFile(file);
    setResult(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const loadSampleImage = async (filename, label) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/static/samples/${filename}`);
      if (!res.ok) {
        // Fallback to direct backend port 8000
        const directRes = await fetch(`http://127.0.0.1:8000/static/samples/${filename}`);
        if (!directRes.ok) throw new Error("Gagal mengambil citra sampel dari server");
        const blob = await directRes.blob();
        const file = new File([blob], filename, { type: "image/jpeg" });
        handleFileChange(file);
        return;
      }
      const blob = await res.blob();
      const file = new File([blob], filename, { type: "image/jpeg" });
      handleFileChange(file);
    } catch (err) {
      setError(err.message || 'Gagal memuat berkas sampel');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    try {
      setLoading(true);
      setError(null);
      const data = await detectFish(selectedFile, confidence);
      setResult(data);
      if (setSelectedAnalysis) {
        setSelectedAnalysis(data);
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat memproses deteksi YOLO');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Scan className="w-5 h-5 text-cyan-400" /> Fish Detection & Classification
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Unggah citra spesimen ikan pelagis kecil untuk inferensi objek menggunakan Ultralytics YOLO.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
            Target MVP: <strong className="text-cyan-400">R. brachysoma</strong>, <strong className="text-yellow-400">S. leptolepis</strong>, <strong className="text-orange-400">U. sulphureus</strong>
          </span>
        </div>
      </div>

      {/* Model Integrity & Training Status Banner */}
      {((result?.model_mode || healthInfo?.model_mode) === "CUSTOM_SPECIES_MODEL") ? (
        <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/70 text-cyan-200 text-xs flex items-start gap-3 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-cyan-300">Status Model Aktif:</span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-cyan-900/80 border border-cyan-700 text-cyan-200 font-semibold">
                CUSTOM_SPECIES_MODEL
              </span>
            </div>
            <p className="text-cyan-200/90 leading-relaxed">
              Bobot model kustom (<code>fishguard_yolo.pt</code>) aktif untuk 3 spesies target MVP 
              (<em>Rastrelliger brachysoma</em>, <em>Selaroides leptolepis</em>, <em>Upeneus sulphureus</em>). 
              Sesuai kaidah integritas ilmiah, rekomendasi operasional ambang batas confidence adalah <strong>&ge; 0.50</strong> guna menekan false positive spesies simpatrik non-target.
            </p>
          </div>
        </div>
      ) : (!healthInfo && !result) ? (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 text-xs flex items-center gap-3">
          <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
          <span>Menghubungkan ke backend dan memverifikasi status model AI...</span>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/70 text-amber-200 text-xs flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-300">Status Validasi Model:</span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-900/80 border border-amber-700 text-amber-200 font-semibold">
                {result?.model_mode || healthInfo?.model_mode || "MODEL_NOT_TRAINED"}
              </span>
            </div>
            <p className="text-amber-200/90 leading-relaxed">
              Bobot khusus 3 spesies target MVP (<code>fishguard_yolo.pt</code>) belum terdeteksi. 
              Sesuai kaidah integritas ilmiah, sistem <strong>tidak memalsukan hasil klasifikasi</strong> sebagai spesies target 
              dan tidak mencampurkan proposal heuristik OpenCV ke dalam deteksi YOLO.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: Upload & Controls | Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload & Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Live Camera Viewfinder or Upload Area */}
          {isCameraActive ? (
            <div className="rounded-2xl p-4 bg-slate-950 border-2 border-cyan-500/80 shadow-lg space-y-3">
              <div className="relative rounded-xl overflow-hidden bg-black max-h-64 flex items-center justify-center">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-56 object-cover"
                />
                {/* 90-degree orthogonal guideline crosshair */}
                <div className="absolute inset-0 pointer-events-none border border-cyan-400/30 m-4 rounded flex items-center justify-center">
                  <div className="w-8 h-8 border-t-2 border-b-2 border-l-2 border-r-2 border-cyan-400/70" />
                  <span className="absolute bottom-2 text-[10px] text-cyan-300/80 bg-slate-950/80 px-2 py-0.5 rounded">
                    Arahkan kamera 90° tegak lurus di atas ikan
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="flex-1 py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-500/20"
                >
                  <Camera className="w-4 h-4" /> Ambil Foto (Snap)
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 border border-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" /> Batal
                </button>
              </div>
            </div>
          ) : (
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !loading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[220px] ${
                isDragOver
                  ? 'border-cyan-400 bg-cyan-950/20'
                  : selectedFile
                  ? 'border-slate-700 bg-slate-900/60'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/70'
              }`}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => handleFileChange(e.target.files[0])}
              />

              {previewUrl ? (
                <div className="space-y-3 w-full">
                  <div className="relative rounded-lg overflow-hidden border border-slate-700 max-h-52 mx-auto">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-48 object-contain bg-slate-950"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] text-slate-300 font-mono">
                      Citra Siap Deteksi
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 truncate max-w-xs mx-auto">
                    {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </p>
                  <span className="text-[11px] text-cyan-400 hover:underline">
                    Klik untuk mengganti gambar
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto text-cyan-400">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">
                      Klik atau Seret Foto Ikan ke Sini
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Mendukung JPG, PNG, atau WebP
                    </p>
                  </div>

                  {/* Direct Camera Button */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        startCamera();
                      }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-600/90 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      <Camera className="w-4 h-4" /> Buka Kamera Device Langsung
                    </button>
                  </div>

                  <div className="text-[10px] text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800 max-w-xs mx-auto mt-2">
                    Tips: Gunakan pencahayaan merata dan posisi kamera tegak lurus (ortogonal).
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Test Sample Images */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
            <span className="text-[11px] text-slate-400 block mb-2 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Coba Langsung dengan Citra Sampel Uji:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => loadSampleImage('sample_test_01.jpg', 'Multi-Spesies')}
                className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-cyan-950/40 hover:border-cyan-700 text-cyan-300 border border-slate-700 text-[11px] transition-all cursor-pointer font-medium text-center truncate"
              >
                Sampel 1 (Multi)
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => loadSampleImage('sample_test_02.jpg', 'Stainless')}
                className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-yellow-950/40 hover:border-yellow-700 text-yellow-300 border border-slate-700 text-[11px] transition-all cursor-pointer font-medium text-center truncate"
              >
                Sampel 2 (Meja)
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => loadSampleImage('sample_test_03.jpg', 'Es Batu')}
                className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-orange-950/40 hover:border-orange-700 text-orange-300 border border-slate-700 text-[11px] transition-all cursor-pointer font-medium text-center truncate"
              >
                Sampel 3 (Es)
              </button>
            </div>
          </div>

          {/* Model Controls */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Ambang Batas Confidence
              </span>
              <span className="font-mono text-cyan-400 font-bold bg-slate-800 px-2 py-0.5 rounded">
                {(confidence * 100).toFixed(0)}%
              </span>
            </div>
            <input 
              type="range"
              min="0.10"
              max="0.90"
              step="0.05"
              value={confidence}
              onChange={(e) => setConfidence(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Sensitif (10%)</span>
              <span>Seimbang (25%)</span>
              <span>Ketat (90%)</span>
            </div>

            {/* Actions */}
            <div className="pt-2 flex gap-3">
              <button
                disabled={!selectedFile || loading}
                onClick={handleAnalyze}
                className="flex-1 py-2.5 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Menjalankan YOLO...
                  </>
                ) : (
                  <>
                    <Scan className="w-4 h-4" />
                    Analisis Sekarang
                  </>
                )}
              </button>

              <button
                disabled={loading || (!selectedFile && !result)}
                onClick={handleReset}
                className="py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs border border-slate-700 transition-all cursor-pointer"
                title="Reset"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Inference Results & Annotations (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {result ? (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-5">
              {/* Result Header & Model Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Hasil Deteksi Objek
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    ID Analisis: <span className="font-mono text-cyan-400">{result.id}</span> | Waktu Inferensi: <span className="font-mono text-slate-300">{result.inference_time_ms} ms</span>
                  </p>
                </div>
                <div>
                  <span className="text-[10px] px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                    {result.model_version}
                  </span>
                </div>
              </div>

              {/* Annotated Image View */}
              <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                <img 
                  src={result.result_image_url} 
                  alt="Hasil Deteksi YOLO" 
                  className="w-full max-h-[380px] object-contain mx-auto"
                />
                <div className="absolute top-2 right-2 px-2.5 py-1 rounded bg-slate-900/90 backdrop-blur-md border border-slate-700 text-[11px] text-slate-200">
                  Total Objek: <strong className="text-cyan-400">{result.total_count}</strong>
                </div>
              </div>

              {/* Species Summary Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/60 text-center">
                  <span className="text-[10px] text-cyan-300 font-medium uppercase tracking-wider block">Kembung</span>
                  <span className="text-xl font-bold text-cyan-400">{result.brachysoma_count ?? result.kembung_count ?? 0}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {result.composition_percentages?.brachysoma ?? result.composition_percentages?.kembung ?? 0}%
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-yellow-950/40 border border-yellow-800/60 text-center">
                  <span className="text-[10px] text-yellow-300 font-medium uppercase tracking-wider block">Selar</span>
                  <span className="text-xl font-bold text-yellow-400">{result.leptolepis_count ?? result.layang_count ?? 0}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {result.composition_percentages?.leptolepis ?? result.composition_percentages?.layang ?? 0}%
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-orange-950/40 border border-orange-800/60 text-center">
                  <span className="text-[10px] text-orange-300 font-medium uppercase tracking-wider block">Kuniran</span>
                  <span className="text-xl font-bold text-orange-400">{result.sulphureus_count ?? 0}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {result.composition_percentages?.sulphureus ?? 0}%
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 text-center">
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">Total Tangkapan</span>
                  <span className="text-xl font-bold text-white">{result.total_count}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">100%</span>
                </div>
              </div>

              {/* Detections List Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-300">Rincian Bounding Box</h4>
                <div className="max-h-48 overflow-y-auto border border-slate-800 rounded-lg">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2 px-3">No</th>
                        <th className="py-2 px-3">Nama Spesies</th>
                        <th className="py-2 px-3">Taksonomi</th>
                        <th className="py-2 px-3">Confidence</th>
                        <th className="py-2 px-3 font-mono">BBox [x1,y1,x2,y2]</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {result.detections.map((d, i) => (
                        <tr key={i} className="hover:bg-slate-800/40">
                          <td className="py-1.5 px-3 font-mono text-slate-500">{i + 1}</td>
                          <td className="py-1.5 px-3 font-semibold text-slate-200 capitalize">
                            {d.class_name}
                          </td>
                          <td className="py-1.5 px-3 italic text-slate-400">{d.scientific_name}</td>
                          <td className="py-1.5 px-3 font-mono font-medium text-cyan-400">
                            {(d.confidence * 100).toFixed(1)}%
                          </td>
                          <td className="py-1.5 px-3 font-mono text-[10px] text-slate-400">
                            [{d.box.map(b => Math.round(b)).join(', ')}]
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Diagnostic Notes */}
              {result.notes && result.notes.length > 0 && (
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <span className="font-semibold text-slate-300 block">Catatan Sistem:</span>
                  {result.notes.map((note, idx) => (
                    <p key={idx}>• {note}</p>
                  ))}
                </div>
              )}

              {/* Next Step: Jump to Counting & Catch Composition */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    if (setSelectedAnalysis) setSelectedAnalysis(result);
                    setActiveTab('counting');
                  }}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <Calculator className="w-4 h-4" />
                  Lanjutkan ke Penghitungan & Komposisi
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[350px] rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col items-center justify-center p-8 text-center text-slate-500">
              <Fish className="w-12 h-12 opacity-30 mb-3" />
              <p className="text-sm font-medium text-slate-400">Belum Ada Analisis yang Dijalankan</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Pilih foto ikan pelagis di panel kiri dan klik "Analisis Sekarang" untuk mendeteksi objek dengan model YOLO.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
