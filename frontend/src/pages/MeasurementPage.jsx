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
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Ruler className="w-5 h-5 text-cyan-400" /> Computer Vision Fish Length Estimation
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Modul estimasi Total Length (TL) berbasis morfologi kontur OpenCV dan kalibrasi piksel-ke-sentimeter.
          </p>
        </div>
        <div className="text-[11px] font-mono px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400">
          Metode: <strong className="text-cyan-400">L(cm) = Jarak(px) / Skala(px/cm)</strong>
        </div>
      </div>

      {/* Mandatory Calibration Requirement Notice */}
      <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-amber-300">Pemberitahuan Metodologi Ilmiah:</span>
          <p className="text-amber-200/90 leading-relaxed">
            Bounding Box YOLO tidak dapat digunakan untuk mengukur panjang aktual tanpa kalibrasi. Pengukuran Total Length (TL) 
            memerlukan sudut kamera 90° (ortogonal) serta acuan skala metrik (papan ukur/marker terverifikasi) pada bidang yang sama dengan ikan.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs">
          {error}
        </div>
      )}

      {/* Main Interface: Calibration Setup | Visual Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Calibration Parameters & Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Image Selection */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-cyan-400" /> Pilih Sampel Citra
            </h3>
            
            {historyItems.length > 0 ? (
              <div className="space-y-2">
                <label className="text-xs text-slate-400 block">Pilih dari rekaman deteksi:</label>
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
                  className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
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
              <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950 mt-3">
                <img 
                  src={currentImage} 
                  alt="Current Selected" 
                  className="w-full h-36 object-contain"
                />
              </div>
            )}
          </div>

          {/* Calibration Control Box */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-cyan-400" /> Konfigurasi Kalibrasi Skala
              </h3>
              <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={isCalibratedChecked}
                  onChange={(e) => setIsCalibratedChecked(e.target.checked)}
                  className="rounded accent-cyan-400"
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
                    className={`py-2 px-3 rounded-lg border text-center transition-all ${
                      calibrationMode === 'pixels_per_cm'
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-700 font-semibold'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Rasio Piksel / CM
                  </button>
                  <button
                    onClick={() => setCalibrationMode('marker_reference')}
                    className={`py-2 px-3 rounded-lg border text-center transition-all ${
                      calibrationMode === 'marker_reference'
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-700 font-semibold'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Marker Referensi
                  </button>
                </div>

                {calibrationMode === 'pixels_per_cm' ? (
                  <div className="space-y-2 p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                    <label className="text-slate-300 block">
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
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
                      />
                      <span className="text-slate-400 text-xs">px/cm</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block">
                      Contoh: Pada jarak kamera 30 cm, 1 cm penggaris setara dengan ~25 piksel.
                    </span>
                  </div>
                ) : (
                  <div className="space-y-3 p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                    <div>
                      <label className="text-slate-300 block mb-1">Panjang Marker Fisik (cm):</label>
                      <input 
                        type="number"
                        min="1"
                        max="100"
                        step="0.5"
                        value={markerRefLength}
                        onChange={(e) => setMarkerRefLength(parseFloat(e.target.value) || 1)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 block mb-1">Panjang Marker pada Citra (px):</label>
                      <input 
                        type="number"
                        min="10"
                        max="2000"
                        value={markerWidthPx}
                        onChange={(e) => setMarkerWidthPx(parseInt(e.target.value) || 10)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
                      />
                    </div>
                    <div className="text-[11px] text-cyan-400 font-mono">
                      Skala Terhitung: {(markerWidthPx / markerRefLength).toFixed(2)} px/cm
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-slate-950 text-slate-400 text-xs border border-slate-800">
                Kalibrasi dinonaktifkan. Sistem hanya akan menghitung jarak Euclidean dalam piksel (px) tanpa klaim konversi metrik.
              </div>
            )}

            {/* Run Button */}
            <button
              disabled={loading || !currentImage}
              onClick={handleMeasure}
              className="w-full py-2.5 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
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
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-5">
              {/* Result Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Hasil Pengukuran Panjang
                  </h3>
                  <p className="text-[11px] text-slate-400 flex items-center gap-2">
                    Status Validasi: <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      result.validation_status === 'VALIDATED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      result.validation_status === 'LIMITED' ? 'bg-yellow-950 text-yellow-400 border border-yellow-800' :
                      'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}>{result.validation_status || result.confidence_level}</span>
                  </p>
                </div>
                {result.total_length_cm && (
                  <div className="text-right">
                    <span className="text-2xl font-black text-cyan-400 font-mono">
                      {result.total_length_cm} {result.uncertainty_cm ? <span className="text-xs font-normal text-slate-400 font-sans">± {result.uncertainty_cm}</span> : null} <span className="text-sm font-normal text-slate-300">cm</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Measured Image */}
              <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                <img 
                  src={result.measured_image_url} 
                  alt="Visualisasi Kaliper Panjang" 
                  className="w-full max-h-[380px] object-contain mx-auto"
                />
              </div>

              {/* Metric Breakdown Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Length (TL)</span>
                  <span className="text-xl font-bold text-white font-mono">
                    {result.total_length_cm ? `${result.total_length_cm} cm` : 'N/A'}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Jarak Piksel</span>
                  <span className="text-xl font-bold text-cyan-400 font-mono">
                    {result.pixel_distance} px
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Skala Kalibrasi</span>
                  <span className="text-xl font-bold text-emerald-400 font-mono">
                    {result.scale_pixels_per_cm ? `${result.scale_pixels_per_cm.toFixed(1)} px/cm` : 'Belum Kalibrasi'}
                  </span>
                </div>
              </div>

              {/* Anatomy points detected */}
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs space-y-2">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Titik Moncong (Snout):
                  </span>
                  <span className="font-mono text-slate-400">
                    [{result.snout_point?.join(', ')}] px
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Ujung Sirip Ekor (Caudal Fin Tip):
                  </span>
                  <span className="font-mono text-slate-400">
                    [{result.tail_point?.join(', ')}] px
                  </span>
                </div>
              </div>

              {/* Warnings & Disclaimers */}
              {result.warnings && result.warnings.length > 0 && (
                <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/50 text-[11px] text-amber-300 space-y-1">
                  <span className="font-semibold block">Peringatan Validitas:</span>
                  {result.warnings.map((w, idx) => (
                    <p key={idx}>• {w}</p>
                  ))}
                </div>
              )}

              <div className="p-3 rounded-lg bg-slate-950/90 border border-slate-800 text-[10px] text-slate-400 leading-relaxed italic">
                {result.scientific_disclaimer}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[350px] rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col items-center justify-center p-8 text-center text-slate-500">
              <Ruler className="w-12 h-12 opacity-30 mb-3" />
              <p className="text-sm font-medium text-slate-400">Belum Ada Estimasi Panjang Dijalankan</p>
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
