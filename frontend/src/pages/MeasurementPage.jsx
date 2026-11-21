import React, { useState, useEffect } from 'react';
import { 
  Ruler, 
  Target, 
  Sliders, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Layers, 
  Image as ImageIcon,
  Sparkles,
  Info,
  RefreshCw
} from 'lucide-react';
import { measureFishLength, getHistory } from '../api/client';
import { formatNumber } from '../utils/formatters';

export default function MeasurementPage({ selectedAnalysis, setSelectedAnalysis }) {
  const [historyItems, setHistoryItems] = useState([]);
  const [currentImage, setCurrentImage] = useState(selectedAnalysis?.image_url || null);
  const [currentAnalysisId, setCurrentAnalysisId] = useState(selectedAnalysis?.id || null);

  // Calibration settings
  const [calibrationMode, setCalibrationMode] = useState('pixels_per_cm'); // 'pixels_per_cm' or 'marker_reference'
  const [pixelsPerCm, setPixelsPerCm] = useState(25.0); // e.g. 25 px = 1 cm
  const [markerRefLength, setMarkerRefLength] = useState(10.0); // 10 cm reference
  const [markerWidthPx, setMarkerWidthPx] = useState(250); // pixels of marker
  const [isCalibratedChecked, setIsCalibratedChecked] = useState(true);

  // Measurement State
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadHist() {
      try {
        const hist = await getHistory(10);
        setHistoryItems(hist);
        if (!currentImage && hist.length > 0) {
          setCurrentImage(hist[0].image_url);
          setCurrentAnalysisId(hist[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadHist();
  }, []);

  useEffect(() => {
    if (selectedAnalysis) {
      setCurrentImage(selectedAnalysis.image_url);
      setCurrentAnalysisId(selectedAnalysis.id);
    }
  }, [selectedAnalysis]);

  const handleMeasure = async () => {
    if (!currentImage) {
      setError('Silakan pilih citra terlebih dahulu dari riwayat atau upload baru.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Compute scale
      let calculatedScale = null;
      if (isCalibratedChecked) {
        if (calibrationMode === 'pixels_per_cm') {
          calculatedScale = parseFloat(pixelsPerCm);
        } else if (calibrationMode === 'marker_reference') {
          if (markerRefLength > 0 && markerWidthPx > 0) {
            calculatedScale = markerWidthPx / markerRefLength;
          }
        }
      }

      const payload = {
        image_path: currentImage,
        calibration: {
          mode: calibrationMode,
          pixels_per_cm: calculatedScale,
          reference_length_cm: calibrationMode === 'marker_reference' ? parseFloat(markerRefLength) : null,
          marker_box: calibrationMode === 'marker_reference' ? [50, 50, 50 + markerWidthPx, 90] : null
        },
        auto_contour: true
      };

      const resp = await measureFishLength(payload, currentAnalysisId);
      setResult(resp);
    } catch (err) {
      setError(err.message || 'Gagal memproses estimasi panjang');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#0E6E7E] text-xs font-medium mb-2">
            <Ruler className="w-3.5 h-3.5" />
            <span>Biometrik & Morfometri Ikan</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B1220] tracking-tight">
            Estimasi Panjang Ikan & <span className="font-serif-italic font-normal">Kalibrasi Digital.</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Modul estimasi Total Length (TL) berbasis segmentasi morfologi kontur OpenCV dan kalibrasi piksel-ke-sentimeter.
          </p>
        </div>
        <div className="text-xs font-mono px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700">
          Metode: <strong className="text-[#0E6E7E]">L(cm) = Jarak(px) / Skala(px/cm)</strong>
        </div>
      </div>

      {/* Mandatory Calibration Requirement Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-amber-900">Pemberitahuan Metodologi Ilmiah:</span>
          <p className="text-amber-800 leading-relaxed">
            Bounding Box YOLO tidak dapat digunakan untuk mengukur panjang aktual tanpa kalibrasi. Pengukuran Total Length (TL) 
            memerlukan sudut kamera 90° (ortogonal) serta acuan skala metrik (papan ukur/marker terverifikasi) pada bidang yang sama dengan ikan.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          {error}
        </div>
      )}

      {/* Main Interface: Calibration Setup | Visual Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Calibration Parameters & Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Image Selection */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-[#0B1220] uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-[#0E6E7E]" /> Pilih Sampel Citra
            </h3>
            
            {historyItems.length > 0 ? (
              <div className="space-y-2">
                <label className="text-xs text-slate-500 block">Pilih dari rekaman deteksi:</label>
                <select
                  value={currentAnalysisId || ''}
                  onChange={(e) => {
                    const found = historyItems.find(h => h.id === e.target.value);
                    if (found) {
                      setCurrentAnalysisId(found.id);
                      setCurrentImage(found.image_url);
                      setResult(null);
                    }
                  }}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#0B1220] focus:outline-none focus:border-[#0E6E7E]"
                >
                  {historyItems.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.filename} ({h.timestamp}) — {h.total_count} ikan
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Belum ada rekaman di database. Jalankan deteksi terlebih dahulu pada tab "Fish Detection".
              </p>
            )}

            {currentImage && (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 mt-3">
                <img 
                  src={currentImage} 
                  alt="Current Selected" 
                  className="w-full h-36 object-contain"
                />
              </div>
            )}
          </div>

          {/* Calibration Control Box */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-[#0B1220] uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-[#0E6E7E]" /> Konfigurasi Skala
              </h3>
              <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer font-medium">
                <input 
                  type="checkbox"
                  checked={isCalibratedChecked}
                  onChange={(e) => setIsCalibratedChecked(e.target.checked)}
                  className="rounded text-[#0E6E7E] focus:ring-[#0E6E7E]"
                />
                <span>Skala Aktif</span>
              </label>
            </div>

            {isCalibratedChecked ? (
              <div className="space-y-4 text-xs">
                {/* Mode Selector */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setCalibrationMode('pixels_per_cm')}
                    className={`py-2 px-3 rounded-full border text-center transition-all font-medium ${
                      calibrationMode === 'pixels_per_cm'
                        ? 'bg-teal-50 text-[#0E6E7E] border-teal-300'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Rasio Piksel / CM
                  </button>
                  <button
                    onClick={() => setCalibrationMode('marker_reference')}
                    className={`py-2 px-3 rounded-full border text-center transition-all font-medium ${
                      calibrationMode === 'marker_reference'
                        ? 'bg-teal-50 text-[#0E6E7E] border-teal-300'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Marker Referensi
                  </button>
                </div>

                {calibrationMode === 'pixels_per_cm' ? (
                  <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <label className="text-slate-700 font-medium block">
                      Skala Piksel per Sentimeter (px/cm):
                    </label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number"
                        min="1"
                        max="500"
                        step="0.5"
                        value={pixelsPerCm}
                        onChange={(e) => setPixelsPerCm(parseFloat(e.target.value) || 1)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-[#0B1220] font-mono tabular-nums"
                      />
                      <span className="text-slate-500 text-xs">px/cm</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block">
                      Contoh: Pada jarak kamera 30 cm ortogonal, 1 cm penggaris setara dengan ~25 piksel.
                    </span>
                  </div>
                ) : (
                  <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <label className="text-slate-700 font-medium block mb-1">Panjang Marker Fisik (cm):</label>
                      <input 
                        type="number"
                        min="1"
                        max="100"
                        step="0.5"
                        value={markerRefLength}
                        onChange={(e) => setMarkerRefLength(parseFloat(e.target.value) || 1)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-[#0B1220] font-mono tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="text-slate-700 font-medium block mb-1">Panjang Marker pada Citra (px):</label>
                      <input 
                        type="number"
                        min="10"
                        max="2000"
                        value={markerWidthPx}
                        onChange={(e) => setMarkerWidthPx(parseInt(e.target.value) || 10)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-[#0B1220] font-mono tabular-nums"
                      />
                    </div>
                    <div className="text-[11px] text-[#0E6E7E] font-mono tabular-nums font-medium">
                      Skala Terhitung: {(markerWidthPx / markerRefLength).toFixed(2)} px/cm
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-50 text-slate-500 text-xs border border-slate-200">
                Kalibrasi dinonaktifkan. Sistem hanya akan menghitung jarak Euclidean dalam piksel (px) tanpa klaim konversi metrik.
              </div>
            )}

            {/* Run Button */}
            <button
              disabled={loading || !currentImage}
              onClick={handleMeasure}
              className="w-full py-2.5 px-4 rounded-full bg-[#0E6E7E] hover:bg-[#0b5865] disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium text-xs tracking-wide shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Menghitung Kontur & Panjang...
                </>
              ) : (
                <>
                  <Target className="w-4 h-4" /> Hitung Total Length (TL)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Visual Caliper Overlay & Metric Results (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {result ? (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
              {/* Result Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-[#0B1220] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Hasil Pengukuran Panjang
                  </h3>
                  <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                    Status Validasi: <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      result.validation_status === 'VALIDATED' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                      result.validation_status === 'LIMITED' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                      'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>{result.validation_status || result.confidence_level}</span>
                  </p>
                </div>
                {result.total_length_cm && (
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#0B1220] font-mono tabular-nums">
                      {formatNumber(result.total_length_cm)} {result.uncertainty_cm ? <span className="text-xs font-normal text-slate-500 font-sans">± {formatNumber(result.uncertainty_cm)}</span> : null} <span className="text-sm font-normal text-slate-500">cm</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Measured Image */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900">
                <img 
                  src={result.measured_image_url} 
                  alt="Visualisasi Kaliper Panjang" 
                  className="w-full max-h-[380px] object-contain mx-auto"
                />
              </div>

              {/* Metric Breakdown Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Total Length (TL)</span>
                  <span className="text-xl font-bold text-[#0B1220] font-mono tabular-nums">
                    {result.total_length_cm ? `${formatNumber(result.total_length_cm)} cm` : 'N/A'}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Jarak Piksel</span>
                  <span className="text-xl font-bold text-[#0E6E7E] font-mono tabular-nums">
                    {formatNumber(result.pixel_distance)} px
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Skala Kalibrasi</span>
                  <span className="text-xl font-bold text-slate-800 font-mono tabular-nums">
                    {result.scale_pixels_per_cm ? `${formatNumber(result.scale_pixels_per_cm.toFixed(1))} px/cm` : 'Belum Kalibrasi'}
                  </span>
                </div>
              </div>

              {/* Anatomy points detected */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Titik Moncong (Snout):
                  </span>
                  <span className="font-mono text-slate-600 tabular-nums">
                    [{result.snout_point?.join(', ')}] px
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" /> Ujung Sirip Ekor (Caudal Fin Tip):
                  </span>
                  <span className="font-mono text-slate-600 tabular-nums">
                    [{result.tail_point?.join(', ')}] px
                  </span>
                </div>
              </div>

              {/* Warnings & Disclaimers */}
              {result.warnings && result.warnings.length > 0 && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 space-y-1">
                  <span className="font-semibold block">Peringatan Validitas:</span>
                  {result.warnings.map((w, idx) => (
                    <p key={idx}>• {w}</p>
                  ))}
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-500 leading-relaxed italic">
                {result.scientific_disclaimer}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[350px] rounded-2xl bg-white border border-slate-200 flex flex-col items-center justify-center p-8 text-center text-slate-500 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <Ruler className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-[#0B1220]">Belum Ada Estimasi Panjang Dijalankan</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Pilih sampel foto dari riwayat di sebelah kiri, tentukan skala kalibrasi penggaris/marker, dan klik "Hitung Total Length".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
