import React, { useState, useEffect, useRef } from 'react';
import { 
  Scan, 
  Upload, 
  Camera, 
  CameraOff, 
  X, 
  Trash2,
  RotateCcw,
  Ruler, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  ShieldCheck 
} from 'lucide-react';
import { detectFish, measureLength, getFishguardStatus } from '../api/client';

export default function FishguardStudio() {
  const [statusInfo, setStatusInfo] = useState(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [confidence, setConfidence] = useState(0.25);

  // Live Camera Device States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [detectResult, setDetectResult] = useState(null);
  const [measureResult, setMeasureResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        const st = await getFishguardStatus();
        if (st) setStatusInfo(st);
      } catch (err) {
        console.error('Failed to init FishGuard studio status:', err);
      }
    }
    init();

    // Clean up camera on unmount
    return () => {
      stopCamera();
    };
  }, []);

  // --- Device Camera Controls ---
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
        const capturedFile = new File([blob], `camera_${Date.now()}.jpg`, { type: "image/jpeg" });
        stopCamera();
        setFile(capturedFile);
        setPreviewUrl(URL.createObjectURL(capturedFile));
        setDetectResult(null);
        setMeasureResult(null);
        setError(null);
      }
    }, "image/jpeg", 0.95);
  };

  const handleFileUpload = (e) => {
    const f = e.target.files[0];
    if (f) {
      stopCamera();
      setFile(f);
      setPreviewUrl(URL.createObjectURL(f));
      setDetectResult(null);
      setMeasureResult(null);
      setError(null);
    }
  };

  const handleResetPhoto = () => {
    stopCamera();
    setFile(null);
    setPreviewUrl(null);
    setDetectResult(null);
    setMeasureResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExecute = async () => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      } else {
        throw new Error('Ambil foto dengan kamera atau unggah berkas terlebih dahulu.');
      }
      formData.append('confidence', confidence);

      const dRes = await detectFish(formData);
      setDetectResult(dRes);

      // Also calculate calibrated measurement
      const mRes = await measureLength({
        image_url: dRes.result_image_url,
        marker_size_cm: 5.0
      });
      setMeasureResult(mRes);
    } catch (err) {
      setError(err.message || 'Gagal memproses analisis citra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5">
      {/* Studio Header Banner */}
      <div className="bg-gradient-to-r from-[#0d1629] via-[#101b33] to-[#0d1629] border border-[#1e293b] rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Computer Vision Studio
            </span>
            <span className="text-xs text-slate-400">Phase 11.7.2 Pre-Flight Ready</span>
          </div>
          <h2 className="text-xl font-bold text-white">FishGuard AI — Deteksi & Biometrik Ikan</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Sistem otomatis identifikasi 3 spesies target dominan PPN Karangantu (*Rastrelliger brachysoma*, *Selaroides leptolepis*, *Upeneus sulphureus*), penghitungan kelimpahan numerik, dan estimasi panjang fisik berbasis marker ArUco 50 mm.
          </p>
        </div>

        {/* Status Pill */}
        <div className="bg-[#080d1a] border border-[#1e293b] rounded-xl p-3 text-xs min-w-[220px]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-400">Status Model:</span>
            <span className="text-emerald-400 font-semibold font-mono">Aktif (Inference OK)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Kalibrasi Penanda:</span>
            <span className="text-cyan-400 font-semibold">ArUco DICT_4X4_50</span>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Controls & Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Action Bar (Camera + Upload + Delete) */}
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Live Camera Button */}
              {!isCameraActive ? (
                <button
                  type="button"
                  onClick={startCamera}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Buka Kamera Device</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopCamera}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  <CameraOff className="w-4 h-4" />
                  <span>Matikan Kamera</span>
                </button>
              )}

              {/* Upload file button */}
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  fileInputRef.current?.click();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#131e36] hover:bg-[#1e293b] text-slate-200 border border-[#1e293b] font-semibold text-xs shadow-sm transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>{file ? 'Ganti File Foto' : 'Unggah File Foto'}</span>
              </button>
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload} 
                className="hidden" 
              />
            </div>

            {/* Hapus / Reset Foto Button */}
            {previewUrl && (
              <button
                type="button"
                onClick={handleResetPhoto}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all cursor-pointer"
                title="Hapus foto yang diambil dan reset hasil"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Foto</span>
              </button>
            )}
          </div>

          {/* Interactive Image Canvas / Live Camera Viewfinder */}
          <div className="bg-[#080d1a] border border-[#1e293b] rounded-2xl overflow-hidden shadow-2xl relative min-h-[420px] flex items-center justify-center">
            {isCameraActive ? (
              /* Live Camera Viewfinder */
              <div className="relative w-full h-full min-h-[440px] bg-black flex flex-col items-center justify-center">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full max-h-[500px] object-cover"
                />

                {/* 90-degree orthogonal guideline crosshair */}
                <div className="absolute inset-0 pointer-events-none border border-cyan-400/30 m-6 rounded-2xl flex items-center justify-center">
                  <div className="w-20 h-20 border-t-2 border-b-2 border-l-2 border-r-2 border-cyan-400/80 rounded" />
                  <span className="absolute bottom-4 text-[11px] text-cyan-300 font-medium bg-slate-950/90 px-3.5 py-1 rounded-full border border-cyan-500/30 shadow-xl">
                    Arahkan kamera 90° tegak lurus di atas ikan & ArUco
                  </span>
                </div>

                {/* Camera Capture Floating Bar */}
                <div className="absolute bottom-4 left-4 right-4 flex gap-2.5">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="flex-1 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/30 transition-all"
                  >
                    <Camera className="w-4 h-4" /> Ambil Foto (Snap)
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer transition-all"
                  >
                    <X className="w-4 h-4" /> Batal
                  </button>
                </div>
              </div>
            ) : previewUrl ? (
              <div className="relative w-full h-full flex items-center justify-center p-2">
                <img
                  src={detectResult ? detectResult.result_image_url : previewUrl}
                  alt="Fish Preview"
                  className="max-h-[520px] w-auto object-contain rounded-xl"
                />
                
                {/* Floating delete button on top-right of image */}
                <button
                  type="button"
                  onClick={handleResetPhoto}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-200 text-xs font-semibold shadow-lg flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer"
                  title="Hapus foto ini"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus Foto</span>
                </button>
              </div>
            ) : (
              <div className="text-slate-400 text-xs flex flex-col items-center gap-3 p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#0f172a] border border-[#1e293b] flex items-center justify-center text-cyan-400 shadow-inner">
                  <Camera className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-200">Kamera atau Foto Belum Dimuat</div>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    Klik <strong>"Buka Kamera Device"</strong> di atas untuk memotret langsung ikan dengan webcam/kamera HP, atau klik <strong>"Unggah File Foto"</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* Confidence Slider Overlay (Bottom) - Only show when not in camera mode and image is ready */}
            {!isCameraActive && previewUrl && (
              <div className="absolute bottom-3 left-3 right-3 bg-[#0c1424]/90 border border-[#1e293b] rounded-xl p-3 backdrop-blur-md flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-slate-400 whitespace-nowrap">Ambang Batas (Conf):</span>
                  <input
                    type="range"
                    min="0.1"
                    max="0.9"
                    step="0.05"
                    value={confidence}
                    onChange={(e) => setConfidence(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <span className="font-mono text-cyan-300 font-bold w-10 text-right">{confidence}</span>
                </div>

                <button
                  onClick={handleExecute}
                  disabled={loading || !file}
                  className="py-2 px-5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-900/40 flex items-center gap-1.5 disabled:opacity-50 transition-all whitespace-nowrap cursor-pointer"
                >
                  {loading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Scan className="w-3.5 h-3.5" />
                  )}
                  <span>{loading ? 'Menganalisis...' : 'Jalankan Analisis'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Analytics & Measurement Results (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Counts & Composition Card */}
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Komposisi Tangkapan</h3>
                <p className="text-[11px] text-slate-400">Pencacahan Multi-Individu & Proporsi</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-cyan-400 font-mono">
                  {detectResult ? detectResult.total_count : 0}
                </span>
                <span className="text-[11px] text-slate-400 block -mt-1">Total Ekor</span>
              </div>
            </div>

            {/* Species Count Breakdown */}
            <div className="space-y-2.5">
              {[
                { 
                  name: 'Kembung perempuan', 
                  sci: 'Rastrelliger brachysoma', 
                  cnt: detectResult?.species_counts?.kembung_perempuan || 0,
                  pct: detectResult?.composition_percentages?.kembung_perempuan || 0,
                  color: 'bg-[#38bdf8]'
                },
                { 
                  name: 'Selar kuning', 
                  sci: 'Selaroides leptolepis', 
                  cnt: detectResult?.species_counts?.selar_kuning || 0,
                  pct: detectResult?.composition_percentages?.selar_kuning || 0,
                  color: 'bg-[#f59e0b]'
                },
                { 
                  name: 'Kuniran', 
                  sci: 'Upeneus sulphureus', 
                  cnt: detectResult?.species_counts?.kuniran || 0,
                  pct: detectResult?.composition_percentages?.kuniran || 0,
                  color: 'bg-[#f97316]'
                },
              ].map((sp, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#090f1d] border border-[#1e293b] text-xs">
                  <div className="flex justify-between items-start mb-1.5">
                    <div>
                      <div className="font-bold text-slate-200 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${sp.color}`} />
                        {sp.name}
                      </div>
                      <div className="text-[10px] text-slate-400 italic">{sp.sci}</div>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-white text-sm">{sp.cnt}</span>
                      <span className="text-[10px] text-slate-400 ml-1">({sp.pct}%)</span>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-[#1e293b] h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${sp.color}`}
                      style={{ width: `${sp.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {detectResult && (
              <div className="text-[11px] text-slate-400 flex justify-between pt-1 font-mono">
                <span>Latensi Inferensi:</span>
                <span className="text-cyan-300 font-semibold">{detectResult.inference_ms} ms</span>
              </div>
            )}
          </div>

          {/* Biometric Measurement Card */}
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-5 shadow-lg space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-cyan-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Estimasi Panjang Fisik (TL)</h3>
                  <p className="text-[11px] text-slate-400">Kalibrasi Metrik Optik ArUco 50 mm</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Terkalibrasi
              </span>
            </div>

            {measureResult ? (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-[#090f1d] border border-[#1e293b]">
                    <div className="text-[10px] text-slate-400">Total Length:</div>
                    <div className="text-base font-extrabold text-cyan-300 font-mono mt-0.5">
                      {measureResult.total_length_cm} <span className="text-xs">cm</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#090f1d] border border-[#1e293b]">
                    <div className="text-[10px] text-slate-400">Fork Length:</div>
                    <div className="text-base font-bold text-slate-200 font-mono mt-0.5">
                      {measureResult.fork_length_cm} <span className="text-xs">cm</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#090f1d] border border-[#1e293b]">
                    <div className="text-[10px] text-slate-400">Standard Length:</div>
                    <div className="text-base font-bold text-slate-200 font-mono mt-0.5">
                      {measureResult.standard_length_cm} <span className="text-xs">cm</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#090f1d] border border-[#1e293b] space-y-1 text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Penanda Skala:</span>
                    <span className="text-slate-200 font-semibold">{measureResult.marker_type}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Rasio Piksel ke Sentimeter:</span>
                    <span className="text-cyan-300 font-mono">{measureResult.scale_pixels_per_cm} px/cm</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Margin Ketidakpastian:</span>
                    <span className="text-amber-300 font-mono">±{measureResult.uncertainty_margin_cm} cm</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                Jalankan analisis citra untuk menghitung kalibrasi panjang spesimen.
              </p>
            )}

            {/* Scientific Rigor Alert */}
            <div className="p-3 rounded-xl bg-[#0c1424] border border-[#1e293b] text-[10px] text-slate-400 space-y-1">
              <div className="font-semibold text-slate-300 flex items-center gap-1">
                <Info className="w-3 h-3 text-cyan-400" /> Catatan Protokol Laboratorium
              </div>
              <p>
                Ketinggian rig kamera lensa 35mm dikunci pada H = 90.0 cm (FoV 60.4 cm). Sesuai Kaidah Integritas Riset ASIK V, akurasi biometrik terus divalidasi terhadap data fisik jangka sorong.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
