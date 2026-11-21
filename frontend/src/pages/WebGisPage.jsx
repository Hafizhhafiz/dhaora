import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  Map as MapIcon, 
  Satellite, 
  Mountain, 
  Palette,
  Eye, 
  EyeOff, 
  Compass, 
  Anchor, 
  Thermometer, 
  Info,
  Maximize2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  Crosshair,
  Calendar
} from 'lucide-react';
import { getSpeciesCatalog, getPredictionGeoJSON, getLandingSites, getTelemetry } from '../api/client';
import { formatNumber, formatWeight, formatDensity, formatPrecision } from '../utils/formatters';

const BASEMAP_OPTIONS = {
  positron: {
    id: 'positron',
    name: 'Positron Terang',
    desc: 'CartoDB Light Minimalis',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    options: { maxZoom: 19, subdomains: 'abcd', attribution: '&copy; CARTO' },
    icon: Palette,
    accent: 'border-[#0E6E7E] text-[#0E6E7E]'
  },
  canvas: {
    id: 'canvas',
    name: 'Canvas Gelap',
    desc: 'CartoDB Dark Minimalis',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    options: { maxZoom: 19, subdomains: 'abcd', attribution: '&copy; CARTO' },
    icon: Palette,
    accent: 'border-purple-600 text-purple-700'
  },
  street: {
    id: 'street',
    name: 'Street Maps',
    desc: 'OpenStreetMap Pesisir',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    options: { maxZoom: 19, attribution: '&copy; OpenStreetMap' },
    icon: MapIcon,
    accent: 'border-emerald-600 text-emerald-700'
  },
  imagery: {
    id: 'imagery',
    name: 'Satelit Esri',
    desc: 'World Imagery Satelit',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    options: { maxZoom: 19, attribution: 'Tiles &copy; Esri' },
    icon: Satellite,
    accent: 'border-amber-600 text-amber-700'
  }
};

export default function WebGisPage({ onOpenDrawer }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const geojsonLayerRef = useRef(null);
  const markersLayerRef = useRef(null);

  // States
  const [selectedBasemap, setSelectedBasemap] = useState('positron');
  const [showGrid, setShowGrid] = useState(true);
  const [speciesList, setSpeciesList] = useState([]);
  const [selectedSpecies, setSelectedSpecies] = useState('rastrelliger');
  const [activeMetric, setActiveMetric] = useState('catch'); // 'catch' | 'sst' | 'depth'
  const [loadingMap, setLoadingMap] = useState(false);
  const [telemetry, setTelemetry] = useState(null);
  const [landingData, setLandingData] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [isControlOpen, setIsControlOpen] = useState(true);
  const [cursorCoords, setCursorCoords] = useState(null);
  const [metricRange, setMetricRange] = useState({ min: 0, max: 50 });

  // Sequential & Contrast Color Ramps
  const getColor = (val, min, max, speciesId) => {
    if (val === undefined || val === null) return '#1e293b';
    const norm = Math.max(0, Math.min(1, (val - min) / (max - min || 1)));

    if (activeMetric === 'sst') {
      // SST Thermal Gradient (Cool Cyan -> Yellow -> Coral -> Deep Crimson)
      return norm > 0.75 ? '#ef4444' : norm > 0.5 ? '#f59e0b' : norm > 0.25 ? '#38bdf8' : '#0284c7';
    }
    if (activeMetric === 'depth') {
      // Bathymetry Depth (Bright Shallow Cyan -> Deep Navy)
      return norm > 0.75 ? '#0c4a6e' : norm > 0.5 ? '#0284c7' : norm > 0.25 ? '#06b6d4' : '#67e8f9';
    }

    // High Contrast Sequential Catch Palette per Species (Clear over dark sea)
    if (speciesId === 'selaroides') {
      return norm > 0.8 ? '#d97706' : norm > 0.5 ? '#f59e0b' : norm > 0.25 ? '#fde047' : '#fef08a';
    } else if (speciesId === 'upeneus') {
      return norm > 0.8 ? '#ea580c' : norm > 0.5 ? '#f97316' : norm > 0.25 ? '#fb923c' : '#fed7aa';
    } else {
      // Rastrelliger (Cyan to Emerald for high contrast over dark navy sea)
      return norm > 0.8 ? '#059669' : norm > 0.5 ? '#10b981' : norm > 0.25 ? '#06b6d4' : '#38bdf8';
    }
  };

  // 1. Initialize Leaflet Map Instance
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Teluk Banten coordinates (Center: -5.98, 106.15, Zoom: 11)
    const map = L.map(mapContainerRef.current, {
      center: [-5.98, 106.15],
      zoom: 11,
      minZoom: 9,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: true
    });

    // Custom Zoom Control at Top-Right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Leaflet Metric Scale Bar at Bottom-Left
    L.control.scale({ imperial: false, metric: true, position: 'bottomleft' }).addTo(map);

    // Base Tile Layer
    const baseConfig = BASEMAP_OPTIONS.positron;
    const tile = L.tileLayer(baseConfig.url, baseConfig.options).addTo(map);
    tileLayerRef.current = tile;

    // Layer Groups
    markersLayerRef.current = L.layerGroup().addTo(map);

    // Cursor position tracking
    map.on('mousemove', (e) => {
      setCursorCoords({
        lat: e.latlng.lat.toFixed(4),
        lng: e.latlng.lng.toFixed(4)
      });
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Basemap Switcher
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const config = BASEMAP_OPTIONS[selectedBasemap] || BASEMAP_OPTIONS.canvas;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    const newTile = L.tileLayer(config.url, config.options).addTo(mapInstanceRef.current);
    tileLayerRef.current = newTile;
  }, [selectedBasemap]);

  // 3. Load Species & Landing Metadata
  useEffect(() => {
    async function loadMeta() {
      try {
        const [spec, land, telem] = await Promise.all([
          getSpeciesCatalog(),
          getLandingSites(),
          getTelemetry()
        ]);
        if (spec && spec.species) setSpeciesList(spec.species);
        if (land) setLandingData(land);
        if (telem) setTelemetry(telem);
      } catch (err) {
        console.error('Error loading metadata:', err);
      }
    }
    loadMeta();
  }, []);

  // 4. Add Port & Sampling Stations Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !landingData) return;
    markersLayerRef.current.clearLayers();

    // PPN Karangantu Anchor Marker
    const port = landingData.ppn_karangantu;
    if (port) {
      const portIcon = L.divIcon({
        className: 'custom-port-icon',
        html: `
          <div style="background:#ef4444; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid white; box-shadow:0 0 16px rgba(239,68,68,0.9); cursor:pointer;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const portMarker = L.marker(port.coordinates, { icon: portIcon });
      portMarker.bindPopup(`
        <div style="font-family:system-ui, sans-serif; color:#f8fafc; padding:8px; min-width:200px;">
          <h4 style="font-size:14px; font-weight:bold; color:#ef4444; margin-bottom:4px;">${port.name}</h4>
          <p style="font-size:11px; color:#94a3b8; margin-bottom:6px;">Pangkalan Pendaratan Ikan Utama (WPPNRI 712)</p>
          <div style="font-size:11px; border-top:1px solid #334155; padding-top:6px; line-height:1.6;">
            <div>Total Pendaratan: <strong>${formatWeight(port.landing_volume_2026_kg, 0)}</strong></div>
            <div>Armada Kapal: <strong>${port.vessels}</strong></div>
            <div>Koordinat: <strong>${port.coordinates[0]}° LS, ${port.coordinates[1]}° BT</strong></div>
          </div>
        </div>
      `);
      markersLayerRef.current.addLayer(portMarker);
    }

    // Sampling Stations
    if (landingData.sampling_stations) {
      landingData.sampling_stations.forEach((st) => {
        const stIcon = L.divIcon({
          className: 'custom-station-icon',
          html: `
            <div style="background:#0ea5e9; width:18px; height:18px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid white; box-shadow:0 0 8px rgba(14,165,233,0.8); cursor:pointer;">
              <div style="width:6px; height:6px; border-radius:50%; background:white;"></div>
            </div>
          `,
          iconSize: [18, 18],
          iconAnchor: [9, 9]
        });
        const stMarker = L.marker(st.coordinates, { icon: stIcon });
        stMarker.bindPopup(`
          <div style="font-family:system-ui, sans-serif; color:#f8fafc; padding:6px; min-width:180px;">
            <div style="font-size:12px; font-weight:bold; color:#38bdf8;">${st.station_id}: ${st.name}</div>
            <div style="font-size:11px; color:#94a3b8; margin-top:4px;">Zona: ${st.zone} | Kedalaman: ${formatNumber(st.depth_m, 1)} m</div>
          </div>
        `);
        markersLayerRef.current.addLayer(stMarker);
      });
    }
  }, [landingData]);

  // 5. Load GeoJSON Layer for Selected Species & Handle showGrid ON/OFF
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (!showGrid) {
      if (geojsonLayerRef.current) {
        mapInstanceRef.current.removeLayer(geojsonLayerRef.current);
      }
      setSelectedCell(null);
      return;
    }

    let isSubscribed = true;
    setLoadingMap(true);

    getPredictionGeoJSON(selectedSpecies)
      .then((geojson) => {
        if (!isSubscribed) return;

        if (geojsonLayerRef.current) {
          mapInstanceRef.current.removeLayer(geojsonLayerRef.current);
        }

        let minVal = Infinity;
        let maxVal = -Infinity;

        geojson.features.forEach((f) => {
          const props = f.properties;
          let val = props.predicted_catch_kg;
          if (activeMetric === 'sst') val = props.sst_celsius;
          if (activeMetric === 'depth') val = props.bathymetry_depth_m;

          if (val < minVal) minVal = val;
          if (val > maxVal) maxVal = val;
        });

        setMetricRange({ min: minVal, max: maxVal });

        const newLayer = L.geoJSON(geojson, {
          style: (feature) => {
            const props = feature.properties;
            let val = props.predicted_catch_kg;
            if (activeMetric === 'sst') val = props.sst_celsius;
            if (activeMetric === 'depth') val = props.bathymetry_depth_m;

            return {
              fillColor: getColor(val, minVal, maxVal, selectedSpecies),
              weight: selectedBasemap === 'imagery' ? 0.9 : 0.5,
              opacity: 0.6,
              color: selectedBasemap === 'imagery' ? '#ffffff' : '#080d1a',
              fillOpacity: selectedBasemap === 'imagery' ? 0.65 : 0.72
            };
          },
          onEachFeature: (feature, layer) => {
            layer.on({
              mouseover: (e) => {
                const l = e.target;
                l.setStyle({
                  weight: 2.5,
                  color: '#38bdf8',
                  fillOpacity: 0.9
                });
                l.bringToFront();
                setSelectedCell(feature.properties);
              },
              mouseout: (e) => {
                newLayer.resetStyle(e.target);
              },
              click: () => {
                setSelectedCell(feature.properties);
              }
            });
          }
        });

        newLayer.addTo(mapInstanceRef.current);
        geojsonLayerRef.current = newLayer;
        setLoadingMap(false);
      })
      .catch((err) => {
        console.error('Failed to load GeoJSON map:', err);
        setLoadingMap(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [selectedSpecies, activeMetric, selectedBasemap, showGrid]);

  const activeSpeciesObj = speciesList.find((s) => s.species_id === selectedSpecies);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden flex flex-col bg-[#060b17] select-none font-sans">
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Prediction Period Banner (Top-Center) */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-lg text-slate-200 text-xs backdrop-blur-md">
        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
        <span className="font-medium">Prediksi Spasial: Siklus Harian (WPPNRI 712 Teluk Banten)</span>
      </div>

      {/* Control Panel Toggle Pill (When collapsed) */}
      {!isControlOpen && (
        <button
          onClick={() => setIsControlOpen(true)}
          className="absolute top-4 left-4 z-10 flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 border border-slate-200 text-[#0B1220] text-xs font-semibold shadow-md backdrop-blur-md hover:bg-slate-50 transition-all cursor-pointer"
        >
          <Layers className="w-4 h-4 text-[#0E6E7E]" />
          <span>Buka Kontrol Peta</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>
      )}

      {/* Floating Control Panel (Top-Left) */}
      {isControlOpen && (
        <div className="absolute top-4 left-4 z-10 w-80 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-6rem)] overflow-y-auto bg-white/95 border border-slate-200 rounded-3xl p-5 shadow-xl backdrop-blur-md space-y-4 animate-fadeIn text-[#0B1220]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0E6E7E]" />
              <h3 className="text-xs font-bold text-[#0B1220] uppercase tracking-wider">
                Kontrol WebGIS Teluk Banten
              </h3>
            </div>
            <div className="flex items-center gap-1.5">
              {loadingMap && showGrid && (
                <span className="text-[10px] text-[#0E6E7E] font-mono animate-pulse">
                  Memuat...
                </span>
              )}
              <button
                onClick={() => setIsControlOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Sembunyikan Panel Kontrol"
                aria-label="Sembunyikan Panel Kontrol"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 1. Basemap Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
              <span>Pilihan Basemap:</span>
              <span className="text-[10px] text-[#0E6E7E] font-mono capitalize">
                {BASEMAP_OPTIONS[selectedBasemap]?.name}
              </span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.values(BASEMAP_OPTIONS).map((bm) => {
                const Icon = bm.icon;
                const isActive = selectedBasemap === bm.id;
                return (
                  <button
                    key={bm.id}
                    onClick={() => setSelectedBasemap(bm.id)}
                    className={`p-2 rounded-xl border text-left text-xs transition-all flex items-center gap-2 cursor-pointer ${
                      isActive
                        ? 'bg-[#EBF4F6] border-[#0E6E7E] text-[#0E6E7E] shadow-xs font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg shrink-0 ${isActive ? 'bg-[#0E6E7E] text-white' : 'bg-slate-200 text-slate-600'}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <div className="text-[11px] font-semibold truncate leading-tight">{bm.name}</div>
                      <div className="text-[9px] text-slate-500 truncate mt-0.5">{bm.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. ON/OFF Grid Visibility Toggle Switch */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2">
                {showGrid ? (
                  <Eye className="w-4 h-4 text-[#0E6E7E]" />
                ) : (
                  <EyeOff className="w-4 h-4 text-slate-400" />
                )}
                <div>
                  <div className="text-xs font-bold text-[#0B1220]">Grid Prediksi (1 km²)</div>
                  <div className="text-[10px] text-slate-500">
                    {showGrid ? '798 Sel Poligon Aktif' : 'Peta Polos (Grid Nonaktif)'}
                  </div>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => setShowGrid(!showGrid)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  showGrid ? 'bg-[#0E6E7E] justify-end' : 'bg-slate-300 justify-start'
                }`}
                title={showGrid ? 'Sembunyikan Grid Prediksi' : 'Tampilkan Grid Prediksi'}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform" />
              </button>
            </div>
          </div>

          {/* 3. Target Species Selector */}
          <div className={`space-y-1.5 pt-2 border-t border-slate-100 transition-opacity ${showGrid ? 'opacity-100' : 'opacity-60'}`}>
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-700 block">
                Target Spesies Prediksi:
              </label>
              {!showGrid && (
                <span className="text-[9px] text-amber-600 font-semibold">(Nyalakan Grid)</span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'rastrelliger', label: 'Kembung', color: 'border-emerald-600 text-emerald-800' },
                { id: 'selaroides', label: 'Selar', color: 'border-amber-600 text-amber-800' },
                { id: 'upeneus', label: 'Kuniran', color: 'border-orange-600 text-orange-800' },
              ].map((sp) => (
                <button
                  key={sp.id}
                  onClick={() => {
                    setSelectedSpecies(sp.id);
                    if (!showGrid) setShowGrid(true);
                  }}
                  className={`py-1.5 px-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                    selectedSpecies === sp.id && showGrid
                      ? `bg-slate-100 ${sp.color} shadow-xs font-bold`
                      : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Metric Switcher */}
          <div className={`space-y-1.5 pt-2 border-t border-slate-100 transition-opacity ${showGrid ? 'opacity-100' : 'opacity-60'}`}>
            <label className="text-[11px] font-bold text-slate-700 block">
              Parameter Tampilan Spasial:
            </label>
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              <button
                onClick={() => {
                  setActiveMetric('catch');
                  if (!showGrid) setShowGrid(true);
                }}
                className={`py-1.5 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                  activeMetric === 'catch' && showGrid
                    ? 'bg-[#0E6E7E] border-[#0E6E7E] text-white font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                Densitas
              </button>
              <button
                onClick={() => {
                  setActiveMetric('sst');
                  if (!showGrid) setShowGrid(true);
                }}
                className={`py-1.5 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                  activeMetric === 'sst' && showGrid
                    ? 'bg-[#0E6E7E] border-[#0E6E7E] text-white font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                Suhu SST
              </button>
              <button
                onClick={() => {
                  setActiveMetric('depth');
                  if (!showGrid) setShowGrid(true);
                }}
                className={`py-1.5 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                  activeMetric === 'depth' && showGrid
                    ? 'bg-[#0E6E7E] border-[#0E6E7E] text-white font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                Batimetri
              </button>
            </div>
          </div>

          {/* 5. Species Summary Card */}
          {activeSpeciesObj && (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="font-bold text-[#0B1220] italic truncate">
                {activeSpeciesObj.scientific_name}
              </div>
              <div className="text-[11px] text-slate-600 flex justify-between">
                <span>Model Champion:</span>
                <span className="text-slate-900 font-medium">{activeSpeciesObj.champion_model}</span>
              </div>
              <div className="text-[11px] text-slate-600 flex justify-between">
                <span>Akurasi Spatial R²:</span>
                <span className="text-emerald-700 font-mono font-bold">
                  {formatPrecision(activeSpeciesObj.spatial_r2_score, 4)}
                </span>
              </div>
              <div className="text-[11px] text-slate-600 flex justify-between">
                <span>Rerata Tangkapan:</span>
                <span className="text-[#0E6E7E] font-mono font-bold">
                  {formatDensity(activeSpeciesObj.mean_catch_kg_per_sqkm, 2)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dynamic Color Scale Legend & Marker Legend (Bottom-Center / Left) */}
      {showGrid && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bg-white/95 border border-slate-200 rounded-full px-5 py-2 shadow-md backdrop-blur-md flex flex-wrap items-center gap-4 text-xs text-[#0B1220]">
          {/* Gradient Ramp */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 font-medium">
              {activeMetric === 'catch' ? 'Densitas:' : activeMetric === 'sst' ? 'Suhu:' : 'Kedalaman:'}
            </span>
            <span className="font-mono text-[10px] text-slate-700 tabular-nums">
              {activeMetric === 'catch' ? `${formatNumber(metricRange.min)} kg` : activeMetric === 'sst' ? `${formatNumber(metricRange.min, 1)}°C` : `${formatNumber(metricRange.min, 1)}m`}
            </span>
            <div 
              className="w-24 h-2 rounded-full border border-slate-300" 
              style={{
                background: activeMetric === 'sst'
                  ? 'linear-gradient(to right, #0284c7, #38bdf8, #f59e0b, #ef4444)'
                  : activeMetric === 'depth'
                  ? 'linear-gradient(to right, #67e8f9, #06b6d4, #0284c7, #0c4a6e)'
                  : selectedSpecies === 'selaroides'
                  ? 'linear-gradient(to right, #fef08a, #fde047, #f59e0b, #d97706)'
                  : selectedSpecies === 'upeneus'
                  ? 'linear-gradient(to right, #fed7aa, #fb923c, #f97316, #ea580c)'
                  : 'linear-gradient(to right, #38bdf8, #06b6d4, #10b981, #059669)'
              }}
            />
            <span className="font-mono text-[10px] text-slate-700 tabular-nums">
              {activeMetric === 'catch' ? `${formatNumber(metricRange.max)} kg` : activeMetric === 'sst' ? `${formatNumber(metricRange.max, 1)}°C` : `${formatNumber(metricRange.max, 1)}m`}
            </span>
          </div>

          {/* Marker Symbols */}
          <div className="hidden md:flex items-center gap-3 border-l border-slate-200 pl-3 text-[11px] text-slate-600">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0E6E7E] border border-white" />
              <span>Stasiun Sampling</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 border border-white" />
              <span>PPN Karangantu</span>
            </span>
          </div>
        </div>
      )}

      {/* Real-time Cursor Coordinates Readout (Bottom-Left) */}
      {cursorCoords && (
        <div className="absolute bottom-1.5 left-20 z-10 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-slate-200 text-[10px] font-mono text-slate-600 shadow-xs backdrop-blur-sm">
          <Crosshair className="w-3 h-3 text-[#0E6E7E]" />
          <span>{cursorCoords.lat}° LS, {cursorCoords.lng}° BT</span>
        </div>
      )}

      {/* Floating Selected Cell Inspector (Bottom-Left above scale) */}
      {showGrid && selectedCell && (
        <div className="absolute bottom-14 left-4 z-10 w-80 max-w-[calc(100vw-2rem)] bg-white/95 border border-slate-200 rounded-3xl p-5 shadow-xl backdrop-blur-md animate-fadeIn text-[#0B1220]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
            <div className="text-xs font-bold text-[#0E6E7E] font-mono">
              Sel Grid: {selectedCell.cell_id}
            </div>
            <button 
              onClick={() => setSelectedCell(null)}
              className="text-slate-400 hover:text-slate-700 p-0.5 rounded-full"
              aria-label="Tutup detail sel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div className="text-[10px] text-slate-500">Prediksi Tangkapan:</div>
              <div className="text-sm font-bold text-[#0B1220] font-mono">
                {formatWeight(selectedCell.predicted_catch_kg, 1)}
              </div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div className="text-[10px] text-slate-500">CPUE per Trip:</div>
              <div className="text-sm font-bold text-emerald-700 font-mono">
                {formatWeight(selectedCell.predicted_cpue_kg_per_trip, 1)}
              </div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div className="text-[10px] text-slate-500">Suhu Muka Laut:</div>
              <div className="text-xs font-bold text-amber-700 font-mono">
                {formatNumber(selectedCell.sst_celsius, 2)} °C
              </div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div className="text-[10px] text-slate-500">Kedalaman Dasar:</div>
              <div className="text-xs font-bold text-[#0E6E7E] font-mono">
                {formatNumber(selectedCell.bathymetry_depth_m, 1)} m
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button for Quick Analysis */}
      <div className="absolute top-4 right-14 z-10">
        <button
          onClick={onOpenDrawer}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0E6E7E] hover:bg-[#085461] text-white font-medium text-xs shadow-md transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Quick Analysis</span>
          <span className="sm:hidden">Analysis</span>
        </button>
      </div>
    </div>
  );
}
