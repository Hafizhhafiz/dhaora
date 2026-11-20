/**
 * DHAORA Unified API Client
 * Connects all frontend components to the DHAORA FastAPI Gateway.
 */

const API_BASE = '/api';

export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('Health check failed:', err);
    return null;
  }
}

// --- GIS CatchForecast Endpoints ---
export async function getSpeciesCatalog() {
  const res = await fetch(`${API_BASE}/gis/species`);
  return await res.json();
}

export async function getPredictionGeoJSON(speciesId) {
  const res = await fetch(`${API_BASE}/gis/maps/${speciesId}`);
  if (!res.ok) throw new Error(`Failed to load GeoJSON for ${speciesId}`);
  return await res.json();
}

export async function getLandingSites() {
  const res = await fetch(`${API_BASE}/gis/landing-sites`);
  return await res.json();
}

export async function getTelemetry() {
  const res = await fetch(`${API_BASE}/gis/telemetry`);
  return await res.json();
}

// --- FishGuard Computer Vision Endpoints ---
export async function getFishguardStatus() {
  const res = await fetch(`${API_BASE}/fishguard/status`);
  return await res.json();
}

export async function getFishguardSamples() {
  const res = await fetch(`${API_BASE}/fishguard/samples`);
  return await res.json();
}

export async function detectFish(formData) {
  const res = await fetch(`${API_BASE}/fishguard/detect`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Gagal menjalankan deteksi ikan');
  }
  return await res.json();
}

export async function measureLength(payload) {
  const res = await fetch(`${API_BASE}/fishguard/measure`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Gagal mengukur panjang ikan');
  return await res.json();
}

// --- ByCatch & Conservation Endpoints ---
export async function getBycatchSpecies() {
  const res = await fetch(`${API_BASE}/bycatch/species`);
  return await res.json();
}

export async function getBycatchGears() {
  const res = await fetch(`${API_BASE}/bycatch/gears`);
  return await res.json();
}

export async function evaluateCatch(payload) {
  const res = await fetch(`${API_BASE}/bycatch/evaluate-catch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Gagal mengevaluasi tangkapan');
  }
  return await res.json();
}

export async function getBycatchMetrics() {
  const res = await fetch(`${API_BASE}/bycatch/metrics`);
  return await res.json();
}

// --- Unified History Endpoints ---
export async function getUnifiedSessions(limit = 50) {
  const res = await fetch(`${API_BASE}/history/sessions?limit=${limit}`);
  return await res.json();
}

export async function getUnifiedStats() {
  const res = await fetch(`${API_BASE}/history/stats`);
  return await res.json();
}
