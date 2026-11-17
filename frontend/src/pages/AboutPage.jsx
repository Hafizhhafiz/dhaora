import React from 'react';
import { Waves, Cpu, Database, Award, Code2, ShieldAlert, Sparkles, MapPin, Globe } from 'lucide-react';

export default function AboutPage({ healthInfo }) {
  return (
    <div className="space-y-6 max-w-5xl">
      {/* Hero card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Waves className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">
              FishGuard AI — Sistem Informasi Kelautan
            </h2>
            <p className="text-xs text-cyan-400 font-medium">
              Inovasi ASIK V | Universitas Pendidikan Indonesia, Kampus Serang
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          FishGuard AI adalah platform pemantauan dan pendukung konservasi perikanan skala kecil (small-scale fisheries) 
          berbasis Artificial Intelligence dan Computer Vision. Sistem ini dirancang untuk mendigitalisasi pencatatan hasil tangkapan 
          di Tempat Pelelangan Ikan (TPI) perairan Teluk Banten, mendukung transparansi kuota, serta memantau kelimpahan spesies pelagis kecil.
        </p>
      </div>

      {/* Architecture Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="p-2.5 rounded-lg bg-cyan-950/80 border border-cyan-800 text-cyan-400 w-fit">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">AI & Computer Vision</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Didukung oleh Ultralytics YOLO untuk deteksi objek multi-ikan dan OpenCV untuk segmentasi morfologi, kaliper digital, serta konversi piksel-ke-cm.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-400 w-fit">
            <Code2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Modern Full-Stack</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Frontend reaktif React.js + Vite dengan Tailwind CSS dan Recharts. Backend asinkron berkinerja tinggi FastAPI + Uvicorn di Python 3.14.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="p-2.5 rounded-lg bg-blue-950/80 border border-blue-800 text-blue-400 w-fit">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Penyimpanan Terstruktur</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Database relasional lokal SQLite untuk tahap MVP, dirancang siap migrasi ke PostgreSQL dan PostGIS untuk pemetaan spasial hasil tangkapan.
          </p>
        </div>
      </div>

      {/* Target Focus & Research Location */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <MapPin className="w-4 h-4 text-cyan-400" /> Wilayah Studi & Spesies Fokus
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="font-bold text-cyan-400 block mb-1">Wilayah Studi: Teluk Banten</span>
            Perairan pesisir utara Banten yang memiliki aktivitas perikanan tangkap skala kecil yang dinamis, termasuk TPI Karangantu dan perairan sekitarnya.
          </div>
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="font-bold text-emerald-400 block mb-1">Tiga Spesies Target MVP (Terkunci):</span>
            1. Ikan Kembung Perempuan (<em>Rastrelliger brachysoma</em> - Famili Scombridae)<br />
            2. Ikan Selar Kuning (<em>Selaroides leptolepis</em> - Famili Carangidae)<br />
            3. Ikan Kuniran (<em>Upeneus sulphureus</em> - Famili Mullidae)
          </div>
        </div>
      </div>

      {/* System Diagnostics */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyan-400" /> Diagnostik Sistem Runtime
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Status Backend</span>
            <span className="text-emerald-400 font-bold">{healthInfo?.status || 'Active'}</span>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Status Model</span>
            <span className="text-cyan-400 font-bold truncate block">{healthInfo?.model_status || 'YOLOv8n'}</span>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Upload Cache</span>
            <span className="text-slate-200">{healthInfo?.uploads_count ?? 0} file</span>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Hasil Anotasi</span>
            <span className="text-slate-200">{healthInfo?.results_count ?? 0} file</span>
          </div>
        </div>
      </div>
    </div>
  );
}
