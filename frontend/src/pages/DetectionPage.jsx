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
  Sparkles, 
  Camera, 
  X,
  ArrowRight,
  Info,
  ImageIcon,
  Check,
  AlertTriangle,
  Maximize2
} from 'lucide-react';
import { detectFish } from '../api/client';
import { formatNumber, formatPercent } from '../utils/formatters';

export default function DetectionPage({ setActiveTab, setSelectedAnalysis, healthInfo }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  // Default aligned with operational recommendation: 0.50 (50%)
  const [confidence, setConfidence] = useState(0.50);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState("environment");

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async (facing = cameraFacing) => {
    try {
      setError(null);
      stopCamera();
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
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

  const toggleFacingMode = () => {
    const nextFacing = cameraFacing === "environment" ? "user" : "environment";
    setCameraFacing(nextFacing);
    startCamera(nextFacing);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 1920;
    canvas.height = videoRef.current.videoHeight || 1080;
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
      setError('Hanya berkas citra (JPG, PNG, WebP) yang diizinkan.');
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
        throw new Error("Gagal mengambil citra sampel dari server");
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
    <div className="space-y-6 animate-fadeIn">
      {/* Header Info */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Scan className="w-5 h-5 text-cyan-400" /> Deteksi & Klasifikasi Ikan (FishGuard AI)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Inferensi Computer Vision berbasis YOLO untuk identifikasi dan klasifikasi spesimen ikan pelagis kecil Teluk Banten.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-medium">
            Target MVP: <strong className="text-cyan-400">R. brachysoma</strong>, <strong className="text-amber-400">S. leptolepis</strong>, <strong className="text-orange-400">U. sulphureus</strong>
          </span>
        </div>
      </div>

      {/* Model Integrity & Status Banner */}
      {((result?.model_mode || healthInfo?.model_mode) === "CUSTOM_SPECIES_MODEL") ? (
        <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/70 text-cyan-200 text-xs flex items-start gap-3 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-cyan-300">Status Model Terpasang:</span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-cyan-900/80 border border-cyan-700 text-cyan-200 font-semibold">
                CUSTOM_SPECIES_MODEL (fishguard_yolo.pt)
              </span>
            </div>
            <p className="text-cyan-200/90 leading-relaxed">
              Model telah terkalibrasi untuk 3 takson target (<em>Rastrelliger brachysoma</em>, <em>Selaroides leptolepis</em>, <em>Upeneus sulphureus</em>). 
              Rekomendasi operasional ambang batas confidence: <strong>&ge; 0,50 (50%)</strong> guna meminimalkan false positive.
            </p>
          </div>
        </div>
      ) : (!healthInfo && !result) ? (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 text-xs flex items-center gap-3">
          <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
          <span>Menghubungkan ke layanan backend dan memverifikasi bobot model AI...</span>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/70 text-amber-200 text-xs flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-300">Status Validasi Model:</span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-900/80 border border-amber-700 text-amber-200 font-semibold">
                {result?.model_mode || healthInfo?.model_mode || "MODEL_STANDAR_YOLO"}
              </span>
            </div>
            <p className="text-amber-200/90 leading-relaxed">
              Bobot khusus 3 spesies target (<code>fishguard_yolo.pt</code>) belum aktif. Sistem beroperasi dalam mode inferensi standar tanpa pemalsuan kelas klasifikasi.
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

      {/* 1. WIDESCREEN CAMERA VIEW CARD (Expanded to Full Width when Camera is Active) */}
      {isCameraActive && (
        <div className="rounded-3xl p-5 sm:p-6 bg-slate-950 border-2 border-cyan-500/90 shadow-2xl shadow-cyan-500/25 space-y-4 animate-fadeIn">
          {/* Top Camera Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-700/80 text-red-300 text-xs font-mono font-bold shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                LIVE VIEW — KAMERA PERANGKAT
              </span>
              <span className="text-xs text-cyan-300 font-medium hidden md:inline">
                Mode Pengambilan Citra Lapangan Terkalibrasi
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={toggleFacingMode}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer font-medium"
                title="Ganti Arah Kamera"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Kamera: {cameraFacing === 'environment' ? 'Belakang (Utama)' : 'Depan (Swafoto)'}</span>
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 transition-all cursor-pointer font-medium"
              >
                <X className="w-4 h-4" /> Batal
              </button>
            </div>
          </div>

          {/* Expansive Widescreen Viewfinder Frame */}
          <div className="relative rounded-2xl overflow-hidden bg-black w-full min-h-[380px] sm:min-h-[460px] md:min-h-[540px] flex items-center justify-center border border-slate-800 shadow-inner">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-[380px] sm:h-[460px] md:h-[540px] object-cover"
            />

            {/* Framing HUD: Corner Brackets & Orthogonal Guidelines */}
            <div className="absolute inset-4 sm:inset-8 pointer-events-none border border-cyan-400/25 rounded-2xl flex flex-col justify-between p-4">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 border-t-2 border-l-2 border-cyan-400" />
                <div className="px-3 py-1 rounded-full bg-slate-950/80 border border-slate-700 text-[10px] text-slate-300 font-mono">
                  Resolusi Full HD • 90° Ortogonal
                </div>
                <div className="w-10 h-10 border-t-2 border-r-2 border-cyan-400" />
              </div>
              
              {/* Center Crosshair with Leveling Marker */}
              <div className="self-center flex flex-col items-center">
                <div className="w-20 h-20 border-2 border-cyan-400/60 rounded-full flex items-center justify-center relative">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
                  <div className="absolute w-32 h-[1px] bg-cyan-400/50" />
                  <div className="absolute h-32 w-[1px] bg-cyan-400/50" />
                </div>
                <span className="text-xs text-cyan-200 font-semibold bg-slate-950/90 px-3.5 py-1.5 rounded-full border border-cyan-800/80 mt-3 shadow-lg">
                  Posisikan kamera 90° tegak lurus di atas ikan
                </span>
              </div>

              {/* Lower guide for ArUco 50mm marker placement */}
              <div className="flex justify-between items-end">
                <div className="w-10 h-10 border-b-2 border-l-2 border-cyan-400" />
                <div className="px-3.5 py-1.5 rounded-xl bg-slate-950/90 border border-cyan-700/60 text-xs text-cyan-300 font-mono shadow-md flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded bg-cyan-400 inline-block" />
                  Area Target Marker ArUco 50 mm
                </div>
                <div className="w-10 h-10 border-b-2 border-r-2 border-cyan-400" />
              </div>
            </div>
          </div>

          {/* Bottom Actions Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Gunakan pencahayaan merata pada ikan pelagis dan letakkan marker kalibrasi di bidang datar yang sama.</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={stopCamera}
                className="flex-1 sm:flex-none py-3.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 cursor-pointer transition-all"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={capturePhoto}
                className="flex-1 sm:flex-none py-3.5 px-9 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 cursor-pointer shadow-xl shadow-cyan-500/30 transition-all transform hover:-translate-y-0.5"
              >
                <Camera className="w-5 h-5 text-slate-950" />
                <span>Ambil Foto (Snap Citra)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MAIN GRID: WIDE DETECTION CARD (6 cols) & RESULTS CARD (6 cols) */}
      {!isCameraActive && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: WIDE Detection Input Card (6 cols) */}
          <div className="lg:col-span-6 space-y-5">
            {/* Direct Camera Button - Wide & Prominent */}
            <button
              type="button"
              onClick={startCamera}
              className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-cyan-950/90 via-slate-900 to-blue-950/80 border-2 border-cyan-500/60 hover:border-cyan-400 text-cyan-200 font-bold text-sm flex items-center justify-between shadow-xl shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 text-slate-950 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <Camera className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-white font-extrabold text-sm group-hover:text-cyan-300 transition-colors">
                    Buka Kamera Perangkat (Live Viewfinder)
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Ambil foto langsung spesimen ikan dengan guideline ortogonal 90°
                  </div>
                </div>
              </div>
              <Maximize2 className="w-4 h-4 text-cyan-400 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity hidden sm:block" />
            </button>

            {/* Dropzone Upload Area */}
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !loading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[260px] ${
                isDragOver
                  ? 'border-cyan-400 bg-cyan-950/20'
                  : selectedFile
                  ? 'border-slate-700 bg-slate-900/70'
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
                <div className="space-y-4 w-full">
                  <div className="relative rounded-2xl overflow-hidden border border-slate-700 max-h-72 sm:max-h-80 mx-auto bg-slate-950 flex items-center justify-center">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-64 sm:h-72 object-contain"
                    />
                    <div className="absolute bottom-2.5 left-2.5 px-3 py-1 rounded-lg bg-slate-950/90 text-xs text-slate-200 font-mono border border-slate-700">
                      Citra Siap Dianalisis
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 font-medium truncate max-w-sm mx-auto">
                    {selectedFile.name} ({formatNumber((selectedFile.size / 1024), 1)} KB)
                  </p>
                  <span className="text-xs text-cyan-400 hover:underline font-semibold block">
                    Klik atau seret citra baru untuk mengganti
                  </span>
                </div>
              ) : (
                <div className="space-y-3.5 py-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800/80 flex items-center justify-center mx-auto text-cyan-400 shadow-sm border border-slate-700/80">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-white">
                      Klik atau Seret Berkas Citra ke Sini
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Mendukung format JPG, PNG, atau WebP (Maks. 25 MB)
                    </p>
                  </div>
                  <div className="text-[11px] text-slate-400 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 max-w-sm mx-auto mt-2">
                    Tips: Foto ikan dengan pencahayaan merata dan posisi ortogonal tegak lurus.
                  </div>
                </div>
              )}
            </div>

            {/* Quick Test Sample Images - Uniform Card Style */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-3">
              <span className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Sampel Citra Uji Siap Pakai:
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => loadSampleImage('sample_test_01.jpg', 'Multi-Spesies')}
                  className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-left transition-all cursor-pointer group"
                >
                  <div className="text-[10px] text-slate-500 group-hover:text-cyan-400 font-mono">Sampel #01</div>
                  <div className="text-xs font-semibold text-slate-200 truncate mt-0.5">Multi-Spesies</div>
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => loadSampleImage('sample_test_02.jpg', 'Meja Stainless')}
                  className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-left transition-all cursor-pointer group"
                >
                  <div className="text-[10px] text-slate-500 group-hover:text-cyan-400 font-mono">Sampel #02</div>
                  <div className="text-xs font-semibold text-slate-200 truncate mt-0.5">Meja Logam</div>
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => loadSampleImage('sample_test_03.jpg', 'Latar Es')}
                  className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-left transition-all cursor-pointer group"
                >
                  <div className="text-[10px] text-slate-500 group-hover:text-cyan-400 font-mono">Sampel #03</div>
                  <div className="text-xs font-semibold text-slate-200 truncate mt-0.5">Latar Es Batu</div>
                </button>
              </div>
            </div>

            {/* Model Controls Card with Sticky Submit */}
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-sm sticky top-20">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Ambang Batas Confidence (Keyakinan)
                </span>
                <span className="font-mono text-cyan-400 font-bold bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-700">
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
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />

              <div className="flex justify-between text-[11px] text-slate-400">
                <span className={confidence < 0.40 ? "text-amber-400 font-medium" : ""}>Sensitif (10%-35%)</span>
                <span className={confidence >= 0.40 && confidence <= 0.65 ? "text-cyan-400 font-bold" : ""}>Seimbang (50% Rekomendasi)</span>
                <span className={confidence > 0.65 ? "text-emerald-400 font-medium" : ""}>Ketat (75%-90%)</span>
              </div>

              {confidence < 0.50 && (
                <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-xs text-amber-300 flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Ambang batas di bawah rekomendasi (0,50) dapat memicu false positive pada spesies non-target.</span>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex gap-3">
                <button
                  disabled={!selectedFile || loading}
                  onClick={handleAnalyze}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-2 ${
                    !selectedFile || loading
                      ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                      : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 cursor-pointer"
                  }`}
                  title={!selectedFile ? "Pilih atau unggah citra terlebih dahulu" : "Jalankan inferensi YOLO"}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Memproses Inferensi YOLO...
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
                  className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs border border-slate-700 transition-all cursor-pointer"
                  title="Reset Input Citra"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {!selectedFile && (
                <p className="text-[11px] text-center text-slate-500">
                  Pilih atau unggah citra spesimen tangkapan terlebih dahulu
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Inference Results & Annotations (6 cols) */}
          <div className="lg:col-span-6 space-y-5">
            {loading ? (
              <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-md space-y-5 animate-pulse">
                <div className="h-6 w-1/3 bg-slate-800 rounded"></div>
                <div className="h-72 w-full bg-slate-800/60 rounded-2xl flex items-center justify-center text-slate-500 text-xs">
                  <RefreshCw className="w-6 h-6 animate-spin text-cyan-400 mr-2" />
                  Mengekstrak fitur visual & proposal bounding box...
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div className="h-14 bg-slate-800/50 rounded-xl"></div>
                  <div className="h-14 bg-slate-800/50 rounded-xl"></div>
                  <div className="h-14 bg-slate-800/50 rounded-xl"></div>
                  <div className="h-14 bg-slate-800/50 rounded-xl"></div>
                </div>
              </div>
            ) : result ? (
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-md space-y-5">
                {/* Result Header & Model Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Hasil Deteksi & Klasifikasi
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      ID Sesi: <span className="font-mono text-cyan-400">{result.id}</span> • Inferensi: <span className="font-mono text-slate-200">{formatNumber(result.inference_time_ms, 0)} ms</span>
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                      {result.model_version || "YOLOv8n"}
                    </span>
                  </div>
                </div>

                {/* Annotated Image View */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950">
                  <img 
                    src={result.result_image_url} 
                    alt="Hasil Deteksi YOLO" 
                    className="w-full max-h-[420px] object-contain mx-auto"
                  />
                  <div className="absolute top-2.5 right-2.5 px-3 py-1 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700 text-xs text-slate-200">
                    Total Individu: <strong className="text-cyan-400 font-mono ml-1">{result.total_count}</strong>
                  </div>
                </div>

                {/* Species Summary Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-800/60 text-center">
                    <span className="text-[10px] text-cyan-300 font-medium uppercase tracking-wider block">Kembung</span>
                    <span className="text-2xl font-bold text-cyan-400">{result.brachysoma_count ?? result.kembung_count ?? 0}</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {formatPercent(result.composition_percentages?.brachysoma ?? result.composition_percentages?.kembung ?? 0, 1)}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-800/60 text-center">
                    <span className="text-[10px] text-amber-300 font-medium uppercase tracking-wider block">Selar</span>
                    <span className="text-2xl font-bold text-amber-400">{result.leptolepis_count ?? result.layang_count ?? 0}</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {formatPercent(result.composition_percentages?.leptolepis ?? result.composition_percentages?.layang ?? 0, 1)}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-orange-950/40 border border-orange-800/60 text-center">
                    <span className="text-[10px] text-orange-300 font-medium uppercase tracking-wider block">Kuniran</span>
                    <span className="text-2xl font-bold text-orange-400">{result.sulphureus_count ?? 0}</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {formatPercent(result.composition_percentages?.sulphureus ?? 0, 1)}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700 text-center">
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">Total Tangkapan</span>
                    <span className="text-2xl font-bold text-white">{result.total_count}</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">100%</span>
                  </div>
                </div>

                {/* Detections List Table */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-300">Rincian Bounding Box & Taksonomi</h4>
                  <div className="max-h-52 overflow-y-auto border border-slate-800 rounded-2xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 sticky top-0">
                        <tr>
                          <th className="py-2.5 px-3">No</th>
                          <th className="py-2.5 px-3">Spesies</th>
                          <th className="py-2.5 px-3">Nama Ilmiah</th>
                          <th className="py-2.5 px-3">Keyakinan</th>
                          <th className="py-2.5 px-3 font-mono">BBox [x1, y1, x2, y2]</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {result.detections.map((d, i) => (
                          <tr key={i} className="hover:bg-slate-800/40">
                            <td className="py-2 px-3 font-mono text-slate-500">{i + 1}</td>
                            <td className="py-2 px-3 font-semibold text-slate-200 capitalize">
                              {d.class_name}
                            </td>
                            <td className="py-2 px-3 italic text-slate-400">{d.scientific_name}</td>
                            <td className="py-2 px-3 font-mono font-medium text-cyan-400">
                              {formatPercent(d.confidence * 100, 1)}
                            </td>
                            <td className="py-2 px-3 font-mono text-[10px] text-slate-400">
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
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 space-y-1">
                    <span className="font-semibold text-slate-300 block">Catatan Sistem:</span>
                    {result.notes.map((note, idx) => (
                      <p key={idx}>• {note}</p>
                    ))}
                  </div>
                )}

                {/* Next Step Action */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      if (setSelectedAnalysis) setSelectedAnalysis(result);
                      setActiveTab('counting');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
                  >
                    <Calculator className="w-4 h-4" />
                    Lanjutkan ke Penghitungan & Komposisi
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Informative Empty State with 1-2-3 Steps */
              <div className="rounded-3xl bg-slate-900/50 border border-slate-800 p-8 sm:p-10 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-cyan-950/40 border border-cyan-800/50 flex items-center justify-center text-cyan-400 mb-4 shadow-lg shadow-cyan-500/10">
                  <Fish className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">
                  Panel Analisis Siap Menerima Citra
                </h3>
                <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
                  Gunakan kamera perangkat atau unggah foto spesimen ikan di sebelah kiri untuk mendeteksi objek dengan model YOLO.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-lg text-left">
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <div className="w-6 h-6 rounded-lg bg-cyan-950 text-cyan-300 flex items-center justify-center text-xs font-bold font-mono mb-2">1</div>
                    <div className="text-xs font-semibold text-slate-200">Kamera / File</div>
                    <div className="text-[11px] text-slate-400 mt-1">Buka kamera langsung atau pilih citra dari berkas.</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <div className="w-6 h-6 rounded-lg bg-cyan-950 text-cyan-300 flex items-center justify-center text-xs font-bold font-mono mb-2">2</div>
                    <div className="text-xs font-semibold text-slate-200">Ambang Confidence</div>
                    <div className="text-[11px] text-slate-400 mt-1">Gunakan rekomendasi 50% untuk hasil seimbang.</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <div className="w-6 h-6 rounded-lg bg-cyan-950 text-cyan-300 flex items-center justify-center text-xs font-bold font-mono mb-2">3</div>
                    <div className="text-xs font-semibold text-slate-200">Inferensi YOLO</div>
                    <div className="text-[11px] text-slate-400 mt-1">Dapatkan deteksi multi-objek dan komposisi jenis instan.</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
