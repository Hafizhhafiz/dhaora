import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Scan, 
  Upload, 
  Camera, 
  CameraOff, 
  Trash2,
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Ruler, 
  ArrowRight
} from 'lucide-react';
import { detectFish, measureLength } from '../api/client';

export default function WebGisDrawer({ isOpen, onClose, onNavigateTab }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detectionResult, setDetectionResult] = useState(null);
  const [measureResult, setMeasureResult] = useState(null);
  const [error, setError] = useState(null);

  // Live Camera State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // --- Camera Operations ---
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
      setError("Gagal mengakses kamera: " + (err.message || "Izin ditolak atau kamera tidak ditemukan"));
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
        const capturedFile = new File([blob], `snap_${Date.now()}.jpg`, { type: "image/jpeg" });
        stopCamera();
        setFile(capturedFile);
        setPreviewUrl(URL.createObjectURL(capturedFile));
        setDetectionResult(null);
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
      setDetectionResult(null);
      setMeasureResult(null);
      setError(null);
    }
  };

  const handleResetPhoto = () => {
    stopCamera();
    setFile(null);
    setPreviewUrl(null);
    setDetectionResult(null);
    setMeasureResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRunInference = async () => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      } else {
        throw new Error('Ambil foto dengan kamera atau unggah berkas terlebih dahulu.');
      }
      formData.append('confidence', 0.25);

      const res = await detectFish(formData);
      setDetectionResult(res);

      // Automatically trigger length calibration estimate
      const meas = await measureLength({
        image_url: res.result_image_url,
        marker_size_cm: 5.0
      });
      setMeasureResult(meas);
    } catch (err) {
      setError(err.message || 'Gagal menjalankan inferensi');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[500px] md:w-[620px] lg:w-[680px] bg-[#0c1424]/98 border-l border-[#1e293b] shadow-2xl z-40 flex flex-col backdrop-blur-xl animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-[#1e293b] flex items-center justify-between bg-[#080d1a]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Quick Analysis Dock</h3>
            <p className="text-[11px] text-slate-400">Uji Cepat Computer Vision & Konservasi</p>
          </div>
        </div>
        <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1e293b] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Actions Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {!isCameraActive ? (
              <button
                onClick={startCamera}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Buka Kamera Device</span>
              </button>
            ) : (
              <button
                onClick={stopCamera}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <CameraOff className="w-4 h-4" />
                <span>Tutup Kamera</span>
              </button>
            )}

            <button
              onClick={() => {
                stopCamera();
                fileInputRef.current?.click();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#131e36] hover:bg-[#1e293b] text-slate-200 border border-[#1e293b] font-semibold text-xs shadow-sm transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Unggah Berkas</span>
            </button>
            <input 
              ref={fileInputRef} 
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload} 
              className="hidden" 
            />
          </div>

          {previewUrl && (
            <button
              onClick={handleResetPhoto}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all cursor-pointer"
              title="Hapus foto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus</span>
            </button>
          )}
        </div>

        {/* Live Camera Viewfinder or Previews */}
        {isCameraActive ? (
          <div className="rounded-2xl overflow-hidden border-2 border-cyan-500/80 bg-black relative flex flex-col items-center justify-center min-h-[320px] shadow-2xl">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-72 sm:h-96 md:h-[420px] object-cover"
            />
            <div className="absolute inset-0 pointer-events-none border border-cyan-400/30 m-4 rounded-xl flex items-center justify-center">
              <div className="w-16 h-16 border-2 border-cyan-400/80 rounded-lg" />
              <div className="absolute w-28 h-0.5 bg-cyan-400/40" />
              <div className="absolute h-28 w-0.5 bg-cyan-400/40" />
              <span className="absolute bottom-3 text-xs font-medium text-cyan-300 bg-slate-950/85 px-3 py-1 rounded-full border border-cyan-500/40 shadow">
                Arahkan 90° tegak lurus ortogonal
              </span>
            </div>
            <div className="p-3 w-full bg-[#080d1a] border-t border-[#1e293b] flex gap-3">
              <button
                onClick={capturePhoto}
                className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
              >
                <Camera className="w-4 h-4" /> Ambil Foto (Snap)
              </button>
              <button
                onClick={stopCamera}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs cursor-pointer transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        ) : previewUrl ? (
          <div className="rounded-xl overflow-hidden border border-[#1e293b] bg-black/40 aspect-video relative flex items-center justify-center">
            <img 
              src={detectionResult ? detectionResult.result_image_url : previewUrl} 
              alt="Preview" 
              className="max-h-full max-w-full object-contain"
            />
            {detectionResult && (
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/80 text-white backdrop-blur-sm">
                YOLO Terdeteksi ({detectionResult.total_count} ikan)
              </span>
            )}
            <button
              onClick={handleResetPhoto}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-200 text-xs shadow-md transition-all cursor-pointer"
              title="Hapus foto ini"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="border border-dashed border-[#1e293b] rounded-xl p-6 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
            <Camera className="w-6 h-6 text-slate-600" />
            <span>Klik "Buka Kamera" atau "Unggah" untuk memuat foto ikan</span>
          </div>
        )}

        {/* Action Button */}
        {!isCameraActive && previewUrl && (
          <button
            onClick={handleRunInference}
            disabled={loading || !file}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-900/30 flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Scan className="w-4 h-4" />
            )}
            <span>{loading ? 'Memproses Inferensi...' : 'Jalankan Deteksi Cepat'}</span>
          </button>
        )}

        {error && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Result Summary */}
        {detectionResult && (
          <div className="p-3.5 rounded-xl bg-[#0f172a] border border-[#1e293b] space-y-3">
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-2">
              <span className="text-xs font-bold text-slate-200">Hasil Pencacahan</span>
              <span className="text-xs font-mono text-cyan-400 font-bold">
                {detectionResult.total_count} Ekor
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
                  Kembung perempuan:
                </span>
                <span className="font-mono font-semibold">
                  {detectionResult.species_counts.kembung_perempuan} ({detectionResult.composition_percentages.kembung_perempuan}%)
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                  Selar kuning:
                </span>
                <span className="font-mono font-semibold">
                  {detectionResult.species_counts.selar_kuning} ({detectionResult.composition_percentages.selar_kuning}%)
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#f97316]" />
                  Kuniran:
                </span>
                <span className="font-mono font-semibold">
                  {detectionResult.species_counts.kuniran} ({detectionResult.composition_percentages.kuniran}%)
                </span>
              </div>
            </div>

            {/* ArUco Length Estimate Box */}
            {measureResult && (
              <div className="p-2.5 rounded-lg bg-[#080d1a] border border-[#1e293b] text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                    <Ruler className="w-3.5 h-3.5" /> Estimasi Panjang (TL):
                  </span>
                  <span className="font-mono text-white font-bold">
                    {measureResult.total_length_cm} cm
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                  <span>Skala: {measureResult.scale_pixels_per_cm} px/cm</span>
                  <span>Margin: ±{measureResult.uncertainty_margin_cm} cm</span>
                </div>
              </div>
            )}

            {/* Deep Studio Link */}
            <button
              onClick={() => {
                stopCamera();
                onNavigateTab('fishguard');
              }}
              className="w-full mt-2 py-2 text-center text-xs text-cyan-400 hover:text-cyan-300 flex items-center justify-center gap-1.5 border-t border-[#1e293b] pt-2 cursor-pointer"
            >
              <span>Buka di Studio Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
