import React from 'react';
import { 
  Waves, 
  Satellite, 
  Thermometer, 
  Droplet, 
  Compass, 
  AlertTriangle, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  ArrowLeft,
  FileText
} from 'lucide-react';

export default function OceanSensePage({ setActiveModule, setActiveTab }) {
  const parameters = [
    {
      name: "Suhu Permukaan Laut (SPL / Sea Surface Temperature)",
      sensor: "Sentinel-3 SLSTR / MODIS Aqua",
      resolution: "1 km (L3S/L4 GHRST)",
      unit: "Derajat Celcius (°C)",
      description: "Pemetaan sebaran gradien suhu permukaan laut untuk mendeteksi batas massa air dan indikasi front termal di Teluk Banten."
    },
    {
      name: "Konsentrasi Klorofil-a (Chlorophyll-a Concentration)",
      sensor: "Sentinel-3 OLCI / MODIS Aqua OCx",
      resolution: "300 m - 1 km",
      unit: "mg/m³",
      description: "Indikator estimasi kelimpahan fitoplankton sebagai produsen primer rantai makanan perairan pesisir."
    },
    {
      name: "Zona Potensi Penangkapan Ikan (ZPPI)",
      sensor: "Multi-Sensor Fusion (SST + Chl-a + Batimetri)",
      resolution: "Gridded 1 km²",
      unit: "Indeks Kesesuaian Habitat (0 - 100%)",
      description: "Algoritma spasial multivariat penggabungan pergeseran gradien suhu dan klorofil untuk menentukan zona prediksi keberadaan schooling pelagis."
    },
    {
      name: "Dinamika Arus Permukaan & Pasut",
      sensor: "Model Numerik Hidrodinamika 2D (HYCOM / InaGOOS)",
      resolution: "1/12 derajat",
      unit: "m/s & arah (derajat)",
      description: "Pola sirkulasi arus permukaan yang mengendalikan transpor larva dan sebaran nutrien di Teluk Banten."
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Navigation Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            setActiveModule('home');
            setActiveTab('home');
          }}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda ASIK</span>
        </button>
        <span className="text-xs px-2.5 py-1 rounded-full bg-amber-950/70 border border-amber-800/60 text-amber-300 font-medium">
          Status: Planned / Dalam Riset Akademik
        </span>
      </div>

      {/* Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 p-8 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-950 border border-blue-800/60 flex items-center justify-center text-blue-400 shrink-0">
            <Waves className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white tracking-wide">
              Modul 3: OceanSense AI — Oseanografi & Penginderaan Jauh Satelit
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              Modul ini didesain sebagai komponen oseanografi makro pada platform ASIK VOL VI. Mengintegrasikan citra penginderaan jauh satelit oseanografi untuk memantau dinamika oseanografi perairan Teluk Banten dan Selat Sunda guna mendukung pemahaman habitat perikanan tangkap.
            </p>
          </div>
        </div>
      </div>

      {/* Scientific Integrity Disclaimer */}
      <div className="rounded-xl bg-amber-950/40 border border-amber-800/60 p-5 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200/90 space-y-1">
          <div className="font-bold text-amber-300 uppercase tracking-wide">
            Kaidah Integritas Ilmiah & Kejujuran Sistem
          </div>
          <p>
            Modul OceanSense AI berada dalam tahap perancangan arsitektur data dan pengumpulan data mentah satelit. Sesuai prinsip integritas ilmiah, platform <strong>TIDAK menampilkan grafik telemetri tiruan (dummy) atau data oseanografi rekaan</strong>. Seluruh metrik parameter di bawah ini merupakan spesifikasi ilmiah yang akan diakuisisi dari API resmi Copernicus Marine Environment Monitoring Service (CMEMS) dan NASA OceanColor pada fase implementasi lanjutan.
          </p>
        </div>
      </div>

      {/* Planned Oceanographic Parameters */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Satellite className="w-4 h-4 text-cyan-400" />
          <span>Parameter Oseanografi yang Direncanakan (Roadmap)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {parameters.map((param, idx) => (
            <div key={idx} className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-200">
                  {param.name}
                </h3>
                <span className="text-[10px] font-mono bg-slate-800 text-cyan-400 px-2 py-0.5 rounded border border-slate-700/60 shrink-0">
                  {param.unit}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {param.description}
              </p>
              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800/80 space-y-1 font-mono">
                <div>Sensor / Satelit: <span className="text-slate-300">{param.sensor}</span></div>
                <div>Resolusi Spasial: <span className="text-slate-300">{param.resolution}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Academic Sources and Workflow */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Alur Integrasi Data Satelit (Desain Sistem)</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="font-semibold text-cyan-400">1. Akuisisi Data Level 3/4</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Pengunduhan otomatis data L3S/L4 dari portal Copernicus Marine Service (CMEMS) dan NASA OceanColor untuk bounding box Teluk Banten (5.8°S - 6.2°S, 106.0°E - 106.4°E).
            </p>
          </div>
          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="font-semibold text-cyan-400">2. Koreksi & Deteksi Front</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Filtering tutupan awan (cloud masking), interpolasi spasial Kriging/Optimal Interpolation, dan deteksi gradien thermal front menggunakan algoritma Cayula-Cornillon.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="font-semibold text-cyan-400">3. Korelasi Pendaratan Ikan</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Analisis korelasi spasio-temporal antara anomali SPL dan kelimpahan pendaratan ikan (CPUE) dari basis data FishGuard AI dan ByCatch AI di PPN Karangantu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
