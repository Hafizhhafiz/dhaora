/**
 * CatchForecast AI - Google Earth Engine Configuration Template
 * Study Area: Teluk Banten, Indonesia
 * Target Species: Rastrelliger brachysoma, Selaroides leptolepis, Upeneus sulphureus
 * 
 * IMPORTANT: Do NOT commit private credentials or personal Google Cloud Project names here.
 * Copy this file to 'config.js' in the GEE Code Editor or your local environment.
 */

var GEE_CONFIG = {
  // 1. Spatio-Temporal Domain
  study_area: {
    name: "Teluk Banten (Banten Bay)",
    wpp: "712",
    center: { lon: 106.12, lat: -6.00, zoom: 11 },
    // Indikatif Bounding Box Teluk Banten [minLon, minLat, maxLon, maxLat]
    bbox: [105.90, -6.15, 106.35, -5.85],
    // Poligon batas perairan Teluk Banten (WGS84 EPSG:4326)
    polygon: [
      [105.90, -5.85],
      [106.35, -5.85],
      [106.35, -6.15],
      [105.90, -6.15],
      [105.90, -5.85]
    ]
  },

  // 2. Temporal Filters
  temporal: {
    start_date: "2024-01-01",
    end_date: "2026-11-18",
    // Musim Puncak Penangkapan Ikan di PPN Karangantu (Agustus)
    peak_season: {
      start_month: 7, // Juli
      end_month: 9    // September
    }
  },

  // 3. Dataset Collections & Parameters
  datasets: {
    // Sea Surface Temperature (SST) - Ultra-High Resolution (1 km)
    sst: {
      id: "JPL/MURSST41/DAILY",
      name: "NASA JPL Multi-scale Ultra-high Resolution (MUR) SST",
      band: "analysed_sst",
      scale: 1000, // meter
      crs: "EPSG:4326",
      conversion: "kelvin_to_celsius", // Celsius = analysed_sst - 273.15
      vis_params: {
        min: 27.0,
        max: 32.0,
        palette: ["0000ff", "00ffff", "ffff00", "ff7f00", "ff0000"]
      }
    },

    // Chlorophyll-a (Chl-a) - Global Ocean Color
    ocean_color: {
      id: "COPERNICUS/OCEAN_COLOR/GLOBAL/4KM/V6",
      name: "Copernicus Marine Ocean Color Global 4km V6",
      band: "CHL",
      scale: 4000, // meter
      crs: "EPSG:4326",
      vis_params: {
        min: 0.1,
        max: 5.0,
        palette: ["000033", "0000ff", "00ffff", "00ff00", "ffff00", "ff0000"]
      }
    },

    // Global Elevation & Bathymetry
    bathymetry: {
      id: "NOAA/NGDC/ETOPO1",
      name: "ETOPO1 1 Arc-Minute Global Relief Model (Bedrock)",
      band: "bedrock",
      scale: 1800,
      crs: "EPSG:4326",
      vis_params: {
        min: -50.0,
        max: 0.0,
        palette: ["08306b", "08519c", "2171b5", "4292c6", "6baed6", "9ecae1", "c6dbef"]
      }
    }
  },

  // 4. Export Presets (Guarded - requires explicit user trigger)
  export: {
    target_scale: 1000,
    target_crs: "EPSG:4326",
    file_format: "GeoTIFF",
    drive_folder: "CatchForecast_TelukBanten"
  }
};

// Export to module scope (for Node/GEE modules)
if (typeof exports !== 'undefined') {
  exports.GEE_CONFIG = GEE_CONFIG;
}
