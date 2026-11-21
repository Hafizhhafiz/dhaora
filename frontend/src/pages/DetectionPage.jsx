import React, { useState, useRef, useEffect } from 'react';
import { 
  Scan, 
  UploadCloud, 
  Camera, 
  CameraOff,
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Sliders, 
  Calculator, 
  ArrowRight,
  Fish,
  Maximize2,
  X,
  Info,
  AlertTriangle
} from 'lucide-react';
import { detectFish } from '../api/client';
import { formatNumber, formatPercent } from '../utils/formatters';

export default function DetectionPage({ setActiveTab, setSelectedAnalysis, healthInfo }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [confidence, setConfidence] = useState(0.50);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState("environment");

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  // Stop camera stream on unmount
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
        const capturedFile = new File([blob], `capture_${Date.now()}.jpg`, { type: "image/jpeg" });
        stopCamera();
        handleFileChange(capturedFile);
      }
    }, "image/jpeg", 0.95);
  };

  const handleFileChange = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Hanya berkas citra (JPG, PNG, WebP) yang didukung.');
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
    if (!selectedFile) {
      setError('Silakan pilih citra spesimen terlebih dahulu.');
      return;
    }

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
    <div className="space-y-6 animate-fadeIn text-[#0B1220]">
      
      {/* Header Info */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0B1220] flex items-center gap-2.5">
            <Scan className="w-5 h-5 text-[#0E6E7E]" /> Deteksi & Klasifikasi Ikan <span className="font-serif-italic font-normal text-slate-500">(FishGuard AI)</span>
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Inferensi visi komputer berbasis YOLO untuk identifikasi dan klasifikasi spesimen ikan pelagis Teluk Banten.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3.5 py-1.5 rounded-full bg-slate-50 text-slate-700 border border-slate-200 font-medium">
            Target MVP: <strong className="text-[#0E6E7E]">R. brachysoma</strong>, <strong className="text-[#0D9488]">S. leptolepis</strong>, <strong className="text-[#5B5FC7]">U. sulphureus</strong>
          </span>
        </div>
      </div>

      {/* Model Integrity & Status Banner */}
      {((result?.model_mode || healthInfo?.model_mode) === "CUSTOM_SPECIES_MODEL") ? (
        <div className="p-4 rounded-2xl bg-[#EBF4F6] border border-[#9FD0D8] text-[#0B1220] text-xs flex items-start gap-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-[#0E6E7E] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#0E6E7E]">Status Model Terpasang:</span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white border border-[#9FD0D8] text-[#0E6E7E] font-semibold">
                CUSTOM_SPECIES_MODEL (fishguard_yolo.pt)
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Model telah terkalibrasi untuk 3 takson target (<em>Rastrelliger brachysoma</em>, <em>Selaroides leptolepis</em>, <em>Upeneus sulphureus</em>). 
              Rekomendasi ambang batas keyakinan (confidence): <strong>&ge; 0,50 (50%)</strong> guna meminimalkan false positive.
            </p>
          </div>
        </div>
      ) : (!healthInfo && !result) ? (
        <div className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-600 text-xs flex items-center gap-3">
          <RefreshCw className="w-4 h-4 animate-spin text-[#0E6E7E]" />
          <span>Menghubungkan ke layanan backend dan memverifikasi bobot model AI...</span>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-800">Status Validasi Model:</span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white border border-amber-300 text-amber-800 font-semibold">
                {result?.model_mode || healthInfo?.model_mode || "MODEL_STANDAR_YOLO"}
              </span>
            </div>
            <p className="text-amber-800 leading-relaxed">
              Bobot khusus 3 spesies target (<code>fishguard_yolo.pt</code>) belum aktif. Sistem beroperasi dalam mode inferensi standar.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. WIDESCREEN CAMERA VIEW CARD */}
      {isCameraActive && (
        <div className="rounded-3xl p-5 sm:p-7 bg-white border border-slate-200 shadow-md space-y-4 animate-fadeIn">
          {/* Top Camera Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                LIVE VIEW — KAMERA PERANGKAT
              </span>
              <span className="text-xs text-slate-600 font-medium hidden md:inline">
                Mode Pengambilan Citra Lapangan Terkalibrasi
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={toggleFacingMode}
                className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-all cursor-pointer font-medium"
                title="Ganti Arah Kamera"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#0E6E7E]" />
                <span>Kamera: {cameraFacing === 'environment' ? 'Belakang (Utama)' : 'Depan (Swafoto)'}</span>
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center gap-1 transition-all cursor-pointer font-medium"
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
                  Posisikan kamera 90° tegak lurus di atas spesimen
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
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#0E6E7E] shrink-0" />
              <span>Gunakan pencahayaan merata dan letakkan penanda kalibrasi 50 mm di bidang datar yang sama.</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={stopCamera}
                className="flex-1 sm:flex-none py-2.5 px-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={capturePhoto}
                className="flex-1 sm:flex-none py-2.5 px-8 rounded-full bg-[#0E6E7E] hover:bg-[#085461] text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors"
              >
                <Camera className="w-4 h-4" />
                <span>Ambil Foto (Snap Citra)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MAIN GRID: INPUT & RESULTS */}
      {!isCameraActive && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Input Card (6 cols) */}
          <div className="lg:col-span-6 space-y-5">
            {/* Direct Camera Button */}
            <button
              type="button"
              onClick={startCamera}
              className="w-full py-4 px-5 rounded-2xl bg-[#EBF4F6] border border-[#9FD0D8] hover:bg-[#D8ECF0] text-[#0E6E7E] font-bold text-xs sm:text-sm flex items-center justify-between shadow-xs transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#0E6E7E] text-white flex items-center justify-center shadow-xs">
                  <Camera className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-[#0B1220] font-bold text-sm">
                    Buka Kamera Perangkat (Live Viewfinder)
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Ambil foto langsung spesimen ikan dengan guideline ortogonal 90°
                  </div>
                </div>
              </div>
              <Maximize2 className="w-4 h-4 text-[#0E6E7E] shrink-0 opacity-70 group-hover:opacity-100 transition-opacity hidden sm:block" />
            </button>

            {/* Dropzone Upload Area */}
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !loading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[260px] bg-white ${
                isDragOver
                  ? 'border-[#0E6E7E] bg-[#EBF4F6]/50'
                  : selectedFile
                  ? 'border-slate-300'
                  : 'border-slate-200 hover:border-[#0E6E7E]'
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
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-h-72 sm:max-h-80 mx-auto bg-slate-50 flex items-center justify-center">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-64 sm:h-72 object-contain"
                    />
                    <div className="absolute bottom-2.5 left-2.5 px-3 py-1 rounded-lg bg-white/95 text-xs text-slate-700 font-mono border border-slate-200 shadow-xs">
                      Citra Siap Dianalisis
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 font-medium truncate max-w-sm mx-auto">
                    {selectedFile.name} ({formatNumber((selectedFile.size / 1024), 1)} KB)
                  </p>
                  <span className="text-xs text-[#0E6E7E] hover:underline font-semibold block">
                    Klik atau seret citra baru untuk mengganti
                  </span>
                </div>
              ) : (
                <div className="space-y-3.5 py-4">
                  <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-[#0E6E7E]">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-[#0B1220]">
                      Klik atau Seret Berkas Citra ke Sini
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Mendukung format JPG, PNG, atau WebP (Maks. 25 MB)
                    </p>
                  </div>
                  <div className="text-[11px] text-slate-500 bg-slate-50 px-4 py-2 rounded-full border border-slate-200 max-w-sm mx-auto mt-2">
                    Tips: Foto ikan dengan pencahayaan merata dan posisi ortogonal tegak lurus.
                  </div>
                </div>
              )}
            </div>

            {/* Quick Test Sample Images */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 text-xs space-y-3">
              <span className="text-xs text-slate-700 font-semibold flex items-center gap-1.5">
                <Fish className="w-3.5 h-3.5 text-[#0E6E7E]" /> Sampel Citra Uji Siap Pakai:
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => loadSampleImage('sample_test_01.jpg', 'Multi-Spesies')}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all cursor-pointer group"
                >
                  <div className="text-[10px] text-slate-400 font-mono">Sampel #01</div>
                  <div className="text-xs font-semibold text-[#0B1220] truncate mt-0.5">Multi-Spesies</div>
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => loadSampleImage('sample_test_02.jpg', 'Meja Stainless')}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all cursor-pointer group"
                >
                  <div className="text-[10px] text-slate-400 font-mono">Sampel #02</div>
                  <div className="text-xs font-semibold text-[#0B1220] truncate mt-0.5">Meja Logam</div>
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => loadSampleImage('sample_test_03.jpg', 'Latar Es')}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all cursor-pointer group"
                >
                  <div className="text-[10px] text-slate-400 font-mono">Sampel #03</div>
                  <div className="text-xs font-semibold text-[#0B1220] truncate mt-0.5">Latar Es Batu</div>
                </button>
              </div>
            </div>

            {/* Model Controls Card with Sticky Submit */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs sticky top-20">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#0B1220] flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#0E6E7E]" /> Ambang Batas Keyakinan (Confidence)
                </span>
                <span className="font-mono text-[#0E6E7E] font-bold bg-[#EBF4F6] px-2.5 py-0.5 rounded-full border border-[#9FD0D8] tabular-nums">
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

              <div className="flex justify-between text-[11px] text-slate-500">
                <span className={confidence < 0.40 ? "text-amber-600 font-semibold" : ""}>Sensitif (10%-35%)</span>
                <span className={confidence >= 0.40 && confidence <= 0.65 ? "text-[#0E6E7E] font-bold" : ""}>Seimbang (50% Rekomendasi)</span>
                <span className={confidence > 0.65 ? "text-emerald-700 font-semibold" : ""}>Ketat (75%-90%)</span>
              </div>

              {confidence < 0.50 && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                  <span>Ambang batas di bawah 0,50 dapat memicu false positive pada spesimen non-target.</span>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex gap-3">
                <button
                  disabled={!selectedFile || loading}
                  onClick={handleAnalyze}
                  className={`flex-1 py-3 px-5 rounded-full font-semibold text-xs tracking-wide transition-all flex items-center justify-center gap-2 ${
                    !selectedFile || loading
                      ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                      : "bg-[#0E6E7E] hover:bg-[#085461] text-white shadow-xs cursor-pointer"
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
                  className="py-3 px-3.5 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-600 text-xs border border-slate-200 transition-colors cursor-pointer"
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

          {/* Right Column: Results & Annotations (6 cols) */}
          <div className="lg:col-span-6 space-y-5">
            {loading ? (
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5 animate-pulse">
                <div className="h-6 w-1/3 bg-slate-200 rounded"></div>
                <div className="h-72 w-full bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 text-xs">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#0E6E7E] mr-2" />
                  Mengekstrak fitur visual & proposal bounding box...
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div className="h-14 bg-slate-100 rounded-xl"></div>
                  <div className="h-14 bg-slate-100 rounded-xl"></div>
                  <div className="h-14 bg-slate-100 rounded-xl"></div>
                  <div className="h-14 bg-slate-100 rounded-xl"></div>
                </div>
              </div>
            ) : result ? (
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
                {/* Result Header & Model Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                  <div>
                    <h3 className="text-base font-bold text-[#0B1220] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Hasil Deteksi & Klasifikasi
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      ID Sesi: <span className="font-mono text-[#0E6E7E]">{result.id}</span> • Inferensi: <span className="font-mono text-slate-700 tabular-nums">{formatNumber(result.inference_time_ms, 0)} ms</span>
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                      {result.model_version || "YOLOv8n"}
                    </span>
                  </div>
                </div>

                {/* Annotated Image View */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                  <img 
                    src={result.result_image_url} 
                    alt="Hasil Deteksi YOLO" 
                    className="w-full max-h-[420px] object-contain mx-auto"
                  />
                  <div className="absolute top-2.5 right-2.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm border border-slate-200 text-xs text-[#0B1220] shadow-xs">
                    Total Individu: <strong className="text-[#0E6E7E] font-mono ml-1">{result.total_count}</strong>
                  </div>
                </div>

                {/* Species Summary Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-[#EBF4F6] border border-[#9FD0D8] text-center">
                    <span className="text-[10px] text-[#0E6E7E] font-bold uppercase tracking-wider block">Kembung</span>
                    <span className="text-2xl font-bold text-[#0E6E7E] tabular-nums">{result.brachysoma_count ?? result.kembung_count ?? 0}</span>
                    <span className="text-[11px] text-slate-600 block mt-0.5 tabular-nums">
                      {formatPercent(result.composition_percentages?.brachysoma ?? result.composition_percentages?.kembung ?? 0, 1)}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                    <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">Selar</span>
                    <span className="text-2xl font-bold text-amber-700 tabular-nums">{result.leptolepis_count ?? result.layang_count ?? 0}</span>
                    <span className="text-[11px] text-slate-600 block mt-0.5 tabular-nums">
                      {formatPercent(result.composition_percentages?.leptolepis ?? result.composition_percentages?.layang ?? 0, 1)}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 text-center">
                    <span className="text-[10px] text-orange-800 font-bold uppercase tracking-wider block">Kuniran</span>
                    <span className="text-2xl font-bold text-orange-700 tabular-nums">{result.sulphureus_count ?? 0}</span>
                    <span className="text-[11px] text-slate-600 block mt-0.5 tabular-nums">
                      {formatPercent(result.composition_percentages?.sulphureus ?? 0, 1)}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Total Tangkapan</span>
                    <span className="text-2xl font-bold text-[#0B1220] tabular-nums">{result.total_count}</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">100%</span>
                  </div>
                </div>

                {/* Detections List Table */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-700">Rincian Bounding Box & Taksonomi</h4>
                  <div className="max-h-52 overflow-y-auto border border-slate-200 rounded-2xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 sticky top-0">
                        <tr>
                          <th className="py-2.5 px-3">No</th>
                          <th className="py-2.5 px-3">Spesies</th>
                          <th className="py-2.5 px-3">Nama Ilmiah</th>
                          <th className="py-2.5 px-3">Keyakinan</th>
                          <th className="py-2.5 px-3 font-mono">BBox [x1, y1, x2, y2]</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {result.detections.map((d, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-mono text-slate-400">{i + 1}</td>
                            <td className="py-2 px-3 font-semibold text-[#0B1220] capitalize">
                              {d.class_name}
                            </td>
                            <td className="py-2 px-3 italic text-slate-500">{d.scientific_name}</td>
                            <td className="py-2 px-3 font-mono font-medium text-[#0E6E7E] tabular-nums">
                              {formatPercent(d.confidence * 100, 1)}
                            </td>
                            <td className="py-2 px-3 font-mono text-[10px] text-slate-500 tabular-nums">
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
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                    <span className="font-semibold text-slate-700 block">Catatan Sistem:</span>
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
                    className="px-5 py-2.5 rounded-full bg-[#0E6E7E] hover:bg-[#085461] text-white font-semibold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
                  >
                    <Calculator className="w-4 h-4" />
                    Lanjutkan ke Penghitungan & Komposisi
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Informative Empty State */
              <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-10 flex flex-col items-center justify-center text-center shadow-xs">
                <div className="w-16 h-16 rounded-full bg-[#EBF4F6] flex items-center justify-center text-[#0E6E7E] mb-4">
                  <Fish className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-[#0B1220] mb-1">
                  Panel Analisis Siap Menerima Citra
                </h3>
                <p className="text-xs text-slate-600 max-w-md mb-6 leading-relaxed">
                  Gunakan kamera perangkat atau unggah foto spesimen ikan di sebelah kiri untuk mendeteksi objek dengan model YOLO.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-lg text-left">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="w-6 h-6 rounded-full bg-[#0E6E7E] text-white flex items-center justify-center text-xs font-bold font-mono mb-2">1</div>
                    <div className="text-xs font-bold text-[#0B1220]">Kamera / File</div>
                    <div className="text-[11px] text-slate-500 mt-1">Buka kamera langsung atau pilih citra dari berkas.</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="w-6 h-6 rounded-full bg-[#0E6E7E] text-white flex items-center justify-center text-xs font-bold font-mono mb-2">2</div>
                    <div className="text-xs font-bold text-[#0B1220]">Ambang Confidence</div>
                    <div className="text-[11px] text-slate-500 mt-1">Gunakan rekomendasi 50% untuk hasil seimbang.</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="w-6 h-6 rounded-full bg-[#0E6E7E] text-white flex items-center justify-center text-xs font-bold font-mono mb-2">3</div>
                    <div className="text-xs font-bold text-[#0B1220]">Inferensi YOLO</div>
                    <div className="text-[11px] text-slate-500 mt-1">Dapatkan deteksi multi-objek dan komposisi jenis instan.</div>
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
