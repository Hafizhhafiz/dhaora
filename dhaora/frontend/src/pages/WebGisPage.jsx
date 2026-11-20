import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  Map, 
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
  Sparkles
} from 'lucide-react';
import { getSpeciesCatalog, getPredictionGeoJSON, getLandingSites, getTelemetry } from '../api/client';

const BASEMAP_OPTIONS = {
  canvas: {
    id: 'canvas',
    name: 'Canvas Maps',
    desc: 'CartoDB Dark Minimalis',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    options: { maxZoom: 19, subdomains: 'abcd', attribution: '&copy; CARTO' },
    icon: Palette,
    accent: 'border-purple-500 text-purple-300'
  },
  street: {
    id: 'street',
    name: 'Street',
    desc: 'OpenStreetMap Jalan & Pesisir',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    options: { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' },
    icon: Map,
    accent: 'border-emerald-500 text-emerald-300'
  },
  imagery: {
    id: 'imagery',
    name: 'Imagery',
    desc: 'Esri World Imagery Satelit',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    options: { maxZoom: 19, attribution: 'Tiles &copy; Esri' },
    icon: Satellite,
    accent: 'border-amber-500 text-amber-300'
  },
  topographic: {
    id: 'topographic',
    name: 'Topographic',
    desc: 'Esri World Topo & Kontur Daratan',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    options: { maxZoom: 19, attribution: 'Tiles &copy; Esri' },
    icon: Mountain,
    accent: 'border-emerald-400 text-emerald-200'
  }
};

export default function WebGisPage({ onOpenDrawer }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const geojsonLayerRef = useRef(null);
  const markersLayerRef = useRef(null);

  // States
  const [selectedBasemap, setSelectedBasemap] = useState('canvas');
  const [showGrid, setShowGrid] = useState(true); // ON/OFF Grid Toggle
  const [speciesList, setSpeciesList] = useState([]);
  const [selectedSpecies, setSelectedSpecies] = useState('rastrelliger');
  const [activeMetric, setActiveMetric] = useState('catch'); // 'catch' or 'sst' or 'depth'
  const [loadingMap, setLoadingMap] = useState(false);
  const [telemetry, setTelemetry] = useState(null);
  const [landingData, setLandingData] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);

  // Color Ramps for Species & Metrics
  const getColor = (val, min, max, speciesId) => {
    if (val === undefined || val === null) return '#1e293b';
    const norm = Math.max(0, Math.min(1, (val - min) / (max - min || 1)));

    if (activeMetric === 'sst') {
      // SST Thermal Gradient (Blue -> Amber -> Red)
      return norm > 0.75 ? '#ef4444' : norm > 0.5 ? '#f59e0b' : norm > 0.25 ? '#38bdf8' : '#3b82f6';
    }
    if (activeMetric === 'depth') {
      // Bathymetry Depth (Cyan shallow -> Deep Indigo)
      return norm > 0.75 ? '#0369a1' : norm > 0.5 ? '#0284c7' : norm > 0.25 ? '#06b6d4' : '#22d3ee';
    }

    // Catch Density Colors per Species
    if (speciesId === 'selaroides') {
      // Gold / Amber
      return norm > 0.8 ? '#d97706' : norm > 0.5 ? '#f59e0b' : norm > 0.25 ? '#fbbf24' : '#fef3c7';
    } else if (speciesId === 'upeneus') {
      // Orange / Coral
      return norm > 0.8 ? '#ea580c' : norm > 0.5 ? '#f97316' : norm > 0.25 ? '#fb923c' : '#ffedd5';
    } else {
      // Rastrelliger: Oceanic Cyan / Sky Blue
      return norm > 0.8 ? '#0284c7' : norm > 0.5 ? '#0ea5e9' : norm > 0.25 ? '#38bdf8' : '#bae6fd';
    }
  };

  // 1. Initialize Map with Zoom Control moved to Top-Right (No overlap with Left Control Card!)
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center on Teluk Banten (PPN Karangantu & Banten Bay)
    const map = L.map(mapContainerRef.current, {
      center: [-5.98, 106.15],
      zoom: 11,
      zoomControl: false, // Turn off default top-left zoom control
      attributionControl: false
    });

    // Place Zoom Control cleanly at topright so it NEVER overlaps with left control card
    L.control.zoom({ position: 'topright' }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Handle Basemap Tile Swapping
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const config = BASEMAP_OPTIONS[selectedBasemap] || BASEMAP_OPTIONS.canvas;

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const newTileLayer = L.tileLayer(config.url, config.options);
    newTileLayer.addTo(mapInstanceRef.current);
    newTileLayer.bringToBack();
    tileLayerRef.current = newTileLayer;
  }, [selectedBasemap]);

  // 3. Fetch Meta & Telemetry
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
          <div style="background:#ef4444; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid white; box-shadow:0 0 15px rgba(239,68,68,0.8);">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const portMarker = L.marker(port.coordinates, { icon: portIcon });
      portMarker.bindPopup(`
        <div style="font-family:sans-serif; color:#f8fafc; padding:8px;">
          <h4 style="font-size:13px; font-weight:bold; color:#ef4444; margin-bottom:4px;">${port.name}</h4>
          <p style="font-size:11px; color:#94a3b8; margin-bottom:6px;">Pangkalan Pendaratan Ikan Utama (WPPNRI 712)</p>
          <div style="font-size:11px; border-top:1px solid #334155; padding-top:6px; line-height:1.5;">
            <div>Total Pendaratan: <strong>${port.landing_volume_2026_kg.toLocaleString()} kg</strong></div>
            <div>Armada: <strong>${port.vessels}</strong></div>
            <div>Koordinat: <strong>${port.coordinates[0]}°S, ${port.coordinates[1]}°E</strong></div>
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
            <div style="background:#0ea5e9; width:18px; height:18px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid white; box-shadow:0 0 8px rgba(14,165,233,0.8);">
              <div style="width:6px; height:6px; border-radius:50%; background:white;"></div>
            </div>
          `,
          iconSize: [18, 18],
          iconAnchor: [9, 9]
        });
        const stMarker = L.marker(st.coordinates, { icon: stIcon });
        stMarker.bindPopup(`
          <div style="font-family:sans-serif; color:#f8fafc; padding:6px;">
            <div style="font-size:12px; font-weight:bold; color:#38bdf8;">${st.station_id}: ${st.name}</div>
            <div style="font-size:11px; color:#94a3b8; margin-top:4px;">Zona: ${st.zone} | Kedalaman: ${st.depth_m} m</div>
          </div>
        `);
        markersLayerRef.current.addLayer(stMarker);
      });
    }
  }, [landingData]);

  // 5. Load GeoJSON Layer for Selected Species & Handle showGrid ON/OFF
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // If grid is toggled OFF, remove layer from map
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

        // Remove previous GeoJSON layer
        if (geojsonLayerRef.current) {
          mapInstanceRef.current.removeLayer(geojsonLayerRef.current);
        }

        // Determine min and max for active metric
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

        const newLayer = L.geoJSON(geojson, {
          style: (feature) => {
            const props = feature.properties;
            let val = props.predicted_catch_kg;
            if (activeMetric === 'sst') val = props.sst_celsius;
            if (activeMetric === 'depth') val = props.bathymetry_depth_m;

            return {
              fillColor: getColor(val, minVal, maxVal, selectedSpecies),
              weight: selectedBasemap === 'imagery' ? 1.0 : 0.6,
              opacity: 0.85,
              color: selectedBasemap === 'imagery' ? '#ffffff' : '#080d1a',
              fillOpacity: selectedBasemap === 'imagery' ? 0.6 : 0.68
            };
          },
          onEachFeature: (feature, layer) => {
            layer.on({
              mouseover: (e) => {
                const l = e.target;
                l.setStyle({
                  weight: 2.5,
                  color: '#38bdf8',
                  fillOpacity: 0.88
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
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden flex flex-col bg-[#060b17]">
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Control Panel (Top-Left) - Placed cleanly with no zoom buttons underneath */}
      <div className="absolute top-4 left-4 z-10 w-84 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-6rem)] overflow-y-auto bg-[#0c1424]/95 border border-[#1e293b] rounded-2xl p-4 shadow-2xl backdrop-blur-md space-y-3.5">
        <div className="flex items-center justify-between border-b border-[#1e293b] pb-2.5">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Kontrol WebGIS Teluk Banten
            </h3>
          </div>
          {loadingMap && showGrid && (
            <span className="text-[10px] text-cyan-400 font-mono animate-pulse">
              Memuat GeoJSON...
            </span>
          )}
        </div>

        {/* 1. Basemap Selector (4 Clean Options: Canvas Maps, Street, Imagery, Topographic) */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-200 flex items-center justify-between">
            <span>Pilihan Basemap:</span>
            <span className="text-[10px] text-cyan-300 font-mono capitalize">
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
                      ? 'bg-cyan-950/70 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-950/40 font-bold'
                      : 'bg-[#0f172a] border-[#1e293b] text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg flex-shrink-0 ${isActive ? 'bg-cyan-500 text-slate-950' : 'bg-[#131e36] text-slate-400'}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <div className="text-[11px] font-semibold truncate leading-tight">{bm.name}</div>
                    <div className="text-[9px] text-slate-400 truncate mt-0.5">{bm.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. ON/OFF Grid Visibility Toggle Switch */}
        <div className="pt-2 border-t border-[#1e293b]">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#090f1d] border border-[#1e293b]">
            <div className="flex items-center gap-2">
              {showGrid ? (
                <Eye className="w-4 h-4 text-cyan-400" />
              ) : (
                <EyeOff className="w-4 h-4 text-slate-500" />
              )}
              <div>
                <div className="text-xs font-bold text-slate-200">Grid Prediksi (1 km²)</div>
                <div className="text-[10px] text-slate-400">
                  {showGrid ? '798 Sel Poligon Aktif' : 'Grid Dinonaktifkan (Peta Polos)'}
                </div>
              </div>
            </div>
            
            {/* Interactive Toggle Switch */}
            <button
              type="button"
              onClick={() => setShowGrid(!showGrid)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                showGrid ? 'bg-cyan-500 justify-end' : 'bg-slate-700 justify-start'
              }`}
              title={showGrid ? 'Sembunyikan Grid Prediksi' : 'Tampilkan Grid Prediksi'}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform" />
            </button>
          </div>
        </div>

        {/* 3. Target Species Selector (Active only when grid is ON, or shows note) */}
        <div className={`space-y-1.5 pt-2 border-t border-[#1e293b] transition-opacity ${showGrid ? 'opacity-100' : 'opacity-60'}`}>
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-200 block">
              Target Spesies Prediksi:
            </label>
            {!showGrid && (
              <span className="text-[9px] text-amber-400 font-semibold">(Nyalakan Grid)</span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'rastrelliger', label: 'Kembung', color: 'border-cyan-500 text-cyan-300' },
              { id: 'selaroides', label: 'Selar', color: 'border-amber-500 text-amber-300' },
              { id: 'upeneus', label: 'Kuniran', color: 'border-orange-500 text-orange-300' },
            ].map((sp) => (
              <button
                key={sp.id}
                onClick={() => {
                  setSelectedSpecies(sp.id);
                  if (!showGrid) setShowGrid(true);
                }}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                  selectedSpecies === sp.id && showGrid
                    ? `bg-slate-800 ${sp.color} shadow-sm font-bold`
                    : 'bg-[#0f172a] border-[#1e293b] text-slate-400 hover:text-slate-200'
                }`}
              >
                {sp.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Metric Switcher */}
        <div className={`space-y-1.5 pt-2 border-t border-[#1e293b] transition-opacity ${showGrid ? 'opacity-100' : 'opacity-60'}`}>
          <label className="text-[11px] font-bold text-slate-200 block">
            Parameter Tampilan Spasial:
          </label>
          <div className="grid grid-cols-3 gap-1.5 text-[11px]">
            <button
              onClick={() => {
                setActiveMetric('catch');
                if (!showGrid) setShowGrid(true);
              }}
              className={`py-1 px-1.5 rounded-md border text-center transition-all cursor-pointer ${
                activeMetric === 'catch' && showGrid
                  ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300 font-bold'
                  : 'bg-[#0f172a] border-[#1e293b] text-slate-400'
              }`}
            >
              Densitas Tangkapan
            </button>
            <button
              onClick={() => {
                setActiveMetric('sst');
                if (!showGrid) setShowGrid(true);
              }}
              className={`py-1 px-1.5 rounded-md border text-center transition-all cursor-pointer ${
                activeMetric === 'sst' && showGrid
                  ? 'bg-amber-950/60 border-amber-500/50 text-amber-300 font-bold'
                  : 'bg-[#0f172a] border-[#1e293b] text-slate-400'
              }`}
            >
              Suhu SST
            </button>
            <button
              onClick={() => {
                setActiveMetric('depth');
                if (!showGrid) setShowGrid(true);
              }}
              className={`py-1 px-1.5 rounded-md border text-center transition-all cursor-pointer ${
                activeMetric === 'depth' && showGrid
                  ? 'bg-blue-950/60 border-blue-500/50 text-blue-300 font-bold'
                  : 'bg-[#0f172a] border-[#1e293b] text-slate-400'
              }`}
            >
              Batimetri
            </button>
          </div>
        </div>

        {/* 5. Species Summary Card */}
        {activeSpeciesObj && (
          <div className="p-2.5 rounded-xl bg-[#090f1d] border border-[#1e293b] text-xs space-y-1">
            <div className="font-bold text-white italic truncate">
              {activeSpeciesObj.scientific_name}
            </div>
            <div className="text-[11px] text-slate-400 flex justify-between">
              <span>Model Champion:</span>
              <span className="text-slate-200">{activeSpeciesObj.champion_model}</span>
            </div>
            <div className="text-[11px] text-slate-400 flex justify-between">
              <span>Akurasi Spatial R²:</span>
              <span className="text-emerald-400 font-mono font-bold">
                {activeSpeciesObj.spatial_r2_score}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex justify-between">
              <span>Rerata Tangkapan:</span>
              <span className="text-cyan-300 font-mono font-bold">
                {activeSpeciesObj.mean_catch_kg_per_sqkm} kg/km²
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Floating Hover Cell Inspector (Bottom-Left) - Only when grid is ON and cell is selected */}
      {showGrid && selectedCell && (
        <div className="absolute bottom-6 left-4 z-10 w-80 bg-[#0c1424]/95 border border-[#1e293b] rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-[#1e293b] pb-2 mb-2">
            <div className="text-xs font-bold text-cyan-300 font-mono">
              Grid Cell: {selectedCell.cell_id}
            </div>
            <span className="text-[10px] text-slate-400">1 km² Domain</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-[#0f172a] p-2 rounded-lg border border-[#1e293b]">
              <div className="text-[10px] text-slate-400">Prediksi Tangkapan:</div>
              <div className="text-sm font-bold text-white font-mono">
                {selectedCell.predicted_catch_kg} <span className="text-xs font-normal text-slate-400">kg</span>
              </div>
            </div>
            <div className="bg-[#0f172a] p-2 rounded-lg border border-[#1e293b]">
              <div className="text-[10px] text-slate-400">CPUE per Trip:</div>
              <div className="text-sm font-bold text-emerald-400 font-mono">
                {selectedCell.predicted_cpue_kg_per_trip} <span className="text-xs font-normal text-slate-400">kg</span>
              </div>
            </div>
            <div className="bg-[#0f172a] p-2 rounded-lg border border-[#1e293b]">
              <div className="text-[10px] text-slate-400">Suhu Muka Laut:</div>
              <div className="text-xs font-bold text-amber-300 font-mono">
                {selectedCell.sst_celsius} °C
              </div>
            </div>
            <div className="bg-[#0f172a] p-2 rounded-lg border border-[#1e293b]">
              <div className="text-[10px] text-slate-400">Kedalaman Dasar:</div>
              <div className="text-xs font-bold text-cyan-300 font-mono">
                {selectedCell.bathymetry_depth_m} m
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button for Quick Analysis (Bottom-Right) */}
      <div className="absolute bottom-6 right-6 z-10">
        <button
          onClick={onOpenDrawer}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-2xl shadow-cyan-900/50 border border-cyan-400/40 transition-all transform hover:scale-105 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-cyan-200" />
          <span>Buka Quick Analysis Dock</span>
        </button>
      </div>
    </div>
  );
}
