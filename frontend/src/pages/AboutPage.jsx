import React from 'react';
import { Waves, Cpu, Database, Award, Code2, ShieldAlert, Sparkles, MapPin, Globe } from 'lucide-react';

export default function AboutPage({ healthInfo }) {
  return (
    <div className="space-y-6 max-w-5xl animate-fadeIn">
      {/* Hero card (#0A1A2F Dark Contrast Block) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0A1A2F] text-white border border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 text-teal-300 border border-white/15 flex items-center justify-center shadow-sm">
            <Waves className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              DHAORA — Integrated Marine AI & <span className="font-serif-italic font-normal">WebGIS Platform.</span>
            </h2>
            <p className="text-xs text-teal-300 font-medium">
              Inovasi ASIK VOL VI | Universitas Pendidikan Indonesia, Kampus Serang
            </p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          DHAORA adalah platform kecerdasan buatan dan geospasial terintegrasi untuk pemantauan, prediksi habitat, 
          dan pendukung konservasi perikanan skala kecil (small-scale fisheries) di perairan Teluk Banten (WPPNRI 712). 
          Sistem ini dirancang untuk mendigitalisasi pencatatan hasil tangkapan di Pelabuhan Perikanan Nusantara (PPN) Karangantu, 
          memprediksi daerah potensi penangkapan ikan (CatchForecast), serta menegakkan kepatuhan spesies dilindungi (ByCatch AI).
        </p>
      </div>

      {/* Architecture Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5">
          <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-[#0E6E7E] w-fit">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#0B1220]">AI & Computer Vision</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Didukung oleh Ultralytics YOLO untuk deteksi multi-ikan simultan dan segmentasi morfologi OpenCV untuk kaliper digital dan konversi skala piksel-ke-sentimeter.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5">
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 w-fit">
            <Code2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white text-[#0B1220]">Modern Full-Stack</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Frontend reaktif React.js + Vite dengan Tailwind CSS dan Recharts. Backend asinkron berkinerja tinggi FastAPI + Uvicorn di Python 3.14.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5">
          <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 w-fit">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#0B1220]">Penyimpanan Terstruktur</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Database relasional lokal SQLite untuk tahap MVP dengan audit log otomatis, dirancang siap migrasi ke PostgreSQL dan PostGIS untuk pemetaan spasial terdistribusi.
          </p>
        </div>
      </div>

      {/* Target Focus & Research Location */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-[#0B1220] flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#0E6E7E]" /> Wilayah Studi & Spesies Fokus
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-[#0B1220] block mb-1">Wilayah Studi: Teluk Banten (WPPNRI 712)</span>
            Perairan pesisir utara Banten dengan aktivitas armada &lt; 10 GT yang dinamis, berpusat di Pelabuhan Perikanan Nusantara (PPN) Karangantu dan perairan estuari sekitarnya.
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-[#0B1220] block mb-1">Tiga Spesies Target MVP (Terkunci):</span>
            1. Ikan Kembung Perempuan (<em>Rastrelliger brachysoma</em> - Famili Scombridae)<br />
            2. Ikan Selar Kuning (<em>Selaroides leptolepis</em> - Famili Carangidae)<br />
            3. Ikan Kuniran (<em>Upeneus sulphureus</em> - Famili Mullidae)
          </div>
        </div>
      </div>

      {/* System Diagnostics */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-[#0B1220] flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#0E6E7E]" /> Diagnostik Sistem Runtime
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 text-[10px] block font-sans">Status Backend</span>
            <span className="text-emerald-700 font-bold">{healthInfo?.status || 'Active'}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 text-[10px] block font-sans">Status Model</span>
            <span className="text-[#0E6E7E] font-bold truncate block">{healthInfo?.model_status || 'YOLOv8n'}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 text-[10px] block font-sans">Upload Cache</span>
            <span className="text-slate-700 tabular-nums">{healthInfo?.uploads_count ?? 0} file</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 text-[10px] block font-sans">Hasil Anotasi</span>
            <span className="text-slate-700 tabular-nums">{healthInfo?.results_count ?? 0} file</span>
          </div>
        </div>
      </div>
    </div>
  );
}
