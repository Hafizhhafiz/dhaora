import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Thermometer, 
  Clock, 
  MapPin, 
  Radio, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function Navbar({ activeTab, isDrawerOpen, setIsDrawerOpen }) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB');
    }
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const tabTitles = {
    webgis: {
      title: 'Peta Spasial & WebGIS Teluk Banten',
      subtitle: 'Prediksi densitas tangkapan 1 km² per spesies & telemetri oseanografi'
    },
    fishguard: {
      title: 'Studio FishGuard Computer Vision',
      subtitle: 'Deteksi spesies MVP, pencacahan multi-ikan, dan kalibrasi panjang ArUco 50mm'
    },
    bycatch: {
      title: 'Pusat Konservasi ByCatch & Audit Alat Tangkap',
      subtitle: 'Pemisahan hasil tangkapan sampingan & verifikasi status konservasi IUCN Red List'
    },
    dashboard: {
      title: 'Dashboard Eksekutif Perikanan Teluk Banten',
      subtitle: 'Rekapitulasi pendaratan PIPP 2026, bioekonomi MSY, dan kesehatan model AI'
    },
    history: {
      title: 'Arsip & Riwayat Analisis Terpadu',
      subtitle: 'Rekam jejak audit lintas database FishGuard, CatchForecast, dan ByCatch'
    }
  };

  const current = tabTitles[activeTab] || tabTitles.webgis;

  return (
    <header className="h-16 bg-[#080d1a]/95 border-b border-[#1e293b] flex items-center justify-between px-6 sticky top-0 z-20 backdrop-blur-md">
      {/* Active Tab Title */}
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            {current.title}
          </h2>
          <p className="text-xs text-slate-400">
            {current.subtitle}
          </p>
        </div>
      </div>

      {/* Real-Time Telemetry & Status Badges */}
      <div className="flex items-center gap-3 text-xs">
        {/* Karangantu Port GPS */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f172a] border border-[#1e293b] text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-rose-400" />
          <span className="font-mono text-[11px]">-6.029°S, 106.161°E</span>
        </div>

        {/* Sea Surface Temp Telemetry */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f172a] border border-[#1e293b] text-slate-300">
          <Thermometer className="w-3.5 h-3.5 text-amber-400" />
          <span>SST: <strong className="text-amber-300 font-mono">29.8°C</strong></span>
        </div>

        {/* Live Clock */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f172a] border border-[#1e293b] text-slate-400">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono text-[11px] text-slate-200">{timeStr}</span>
        </div>

        {/* Quick Drawer Toggle */}
        <button
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            isDrawerOpen
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-[#131e36] text-cyan-300 hover:bg-[#1a2948] border border-cyan-500/30'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Quick Analysis</span>
        </button>
      </div>
    </header>
  );
}
