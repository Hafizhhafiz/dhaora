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
import { formatNumber, formatPercent } from '../utils/formatters';

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
    <div className="fixed inset-y-0 right-0 w-full sm:w-[500px] md:w-[620px] lg:w-[680px] bg-white border-l border-slate-200 shadow-2xl z-40 flex flex-col backdrop-blur-xl animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-[#F6F6F3]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-teal-50 text-[#0E6E7E] border border-teal-200 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0B1220]">Quick Analysis Dock</h3>
            <p className="text-[11px] text-slate-500">Uji Cepat Computer Vision & Kalibrasi Biometrik</p>
          </div>
        </div>
        <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="p-1.5 rounded-full text-slate-400 hover:text-[#0B1220] hover:bg-slate-200 transition-colors cursor-pointer"
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
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0E6E7E] hover:bg-[#0b5865] text-white font-medium text-xs shadow-sm transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Buka Kamera Device</span>
              </button>
            ) : (
              <button
                onClick={stopCamera}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs shadow-sm transition-all cursor-pointer"
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
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-[#0B1220] border border-slate-200 font-medium text-xs shadow-sm transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4 text-[#0E6E7E]" />
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
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-medium transition-all cursor-pointer"
              title="Hapus foto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus</span>
            </button>
          )}
        </div>

        {/* Live Camera Viewfinder or Previews */}
        {isCameraActive ? (
          <div className="rounded-2xl overflow-hidden border border-slate-300 bg-black relative flex flex-col items-center justify-center min-h-[320px] shadow-lg">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-72 sm:h-96 md:h-[420px] object-cover"
            />
            <div className="absolute inset-0 pointer-events-none border border-white/30 m-4 rounded-xl flex items-center justify-center">
              <div className="w-16 h-16 border-2 border-white/80 rounded-lg" />
              <div className="absolute w-28 h-0.5 bg-white/40" />
              <div className="absolute h-28 w-0.5 bg-white/40" />
              <span className="absolute bottom-3 text-xs font-medium text-white bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 shadow">
                Arahkan 90° tegak lurus ortogonal
              </span>
            </div>
            <div className="p-3 w-full bg-[#0A1A2F] border-t border-slate-800 flex gap-3">
              <button
                onClick={capturePhoto}
                className="flex-1 py-2.5 px-4 rounded-full bg-[#0E6E7E] hover:bg-[#0b5865] text-white font-medium text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-all"
              >
                <Camera className="w-4 h-4" /> Ambil Foto (Snap)
              </button>
              <button
                onClick={stopCamera}
                className="py-2.5 px-4 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs cursor-pointer transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        ) : previewUrl ? (
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 aspect-video relative flex items-center justify-center">
            <img 
              src={detectionResult ? detectionResult.result_image_url : previewUrl} 
              alt="Preview" 
              className="max-h-full max-w-full object-contain"
            />
            {detectionResult && (
              <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-700 text-white backdrop-blur-sm">
                YOLO Terdeteksi ({formatNumber(detectionResult.total_count)} ekor)
              </span>
            )}
            <button
              onClick={handleResetPhoto}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white text-xs shadow-md transition-all cursor-pointer"
              title="Hapus foto ini"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="border border-dashed border-slate-300 rounded-2xl p-8 text-center text-xs text-slate-500 flex flex-col items-center gap-2.5 bg-[#F6F6F3]">
            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400">
              <Camera className="w-5 h-5" />
            </div>
            <span>Klik "Buka Kamera Device" atau "Unggah Berkas" untuk memuat foto ikan</span>
          </div>
        )}

        {/* Action Button */}
        {!isCameraActive && previewUrl && (
          <button
            onClick={handleRunInference}
            disabled={loading || !file}
            className="w-full py-2.5 px-4 rounded-full bg-[#0E6E7E] hover:bg-[#0b5865] text-white font-medium text-xs shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
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
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Result Summary */}
        {detectionResult && (
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-bold text-[#0B1220]">Hasil Pencacahan Komposit</span>
              <span className="text-xs font-mono text-[#0E6E7E] font-bold tabular-nums">
                {formatNumber(detectionResult.total_count)} Ekor
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  Kembung perempuan (<em>R. brachysoma</em>):
                </span>
                <span className="font-mono font-medium text-[#0B1220] tabular-nums">
                  {formatNumber(detectionResult.species_counts.kembung_perempuan)} ({formatPercent(detectionResult.composition_percentages.kembung_perempuan)})
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Selar kuning (<em>S. leptolepis</em>):
                </span>
                <span className="font-mono font-medium text-[#0B1220] tabular-nums">
                  {formatNumber(detectionResult.species_counts.selar_kuning)} ({formatPercent(detectionResult.composition_percentages.selar_kuning)})
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  Kuniran (<em>U. sulphureus</em>):
                </span>
                <span className="font-mono font-medium text-[#0B1220] tabular-nums">
                  {formatNumber(detectionResult.species_counts.kuniran)} ({formatPercent(detectionResult.composition_percentages.kuniran)})
                </span>
              </div>
            </div>

            {/* ArUco Length Estimate Box */}
            {measureResult && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5 font-medium text-[#0B1220]">
                    <Ruler className="w-3.5 h-3.5 text-[#0E6E7E]" /> Estimasi Panjang (TL):
                  </span>
                  <span className="font-mono text-[#0B1220] font-bold tabular-nums">
                    {formatNumber(measureResult.total_length_cm)} cm
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1 flex justify-between tabular-nums">
                  <span>Skala: {formatNumber(measureResult.scale_pixels_per_cm)} px/cm</span>
                  <span>Margin: ±{formatNumber(measureResult.uncertainty_margin_cm)} cm</span>
                </div>
              </div>
            )}

            {/* Deep Studio Link */}
            <button
              onClick={() => {
                stopCamera();
                onNavigateTab('fishguard', 'detection');
              }}
              className="w-full mt-2 pt-2 text-center text-xs text-[#0E6E7E] hover:underline flex items-center justify-center gap-1.5 border-t border-slate-100 cursor-pointer font-medium"
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
