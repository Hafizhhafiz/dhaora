/**
 * DHAORA / ASIK VOL VI — Unified API Client
 * Connects all frontend components to the unified FastAPI Gateway.
 * Supports direct calls and fallback handling.
 */

const API_BASE = "";
const DIRECT_BACKEND = "http://127.0.0.1:8000";

async function fetchWithFallback(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, options);
    if (res.ok) return res;
  } catch (err) {
    // Proxy might be unavailable, try direct backend
  }
  try {
    const directRes = await fetch(`${DIRECT_BACKEND}${endpoint}`, options);
    if (directRes.ok) return directRes;
    return directRes;
  } catch (err) {
    throw new Error(`Tidak dapat terhubung ke Unified Backend (${endpoint}): ${err.message}`);
  }
}

// ==========================================
// SYSTEM HEALTH & STATUS
// ==========================================

export async function checkHealth() {
  try {
    const res = await fetchWithFallback("/api/health");
    if (!res.ok) throw new Error("Backend offline");
    return await res.json();
  } catch (err) {
    return { status: "error", message: err.message };
  }
}

// ==========================================
// MODULE 1: CATCHFORECAST AI (WEBGIS)
// ==========================================

export async function getSpeciesCatalog() {
  const res = await fetchWithFallback("/api/gis/species");
  if (!res.ok) throw new Error("Gagal memuat katalog spesies WebGIS");
  return await res.json();
}

export async function getPredictionGeoJSON(speciesId) {
  const res = await fetchWithFallback(`/api/gis/maps/${speciesId}`);
  if (!res.ok) throw new Error(`Gagal memuat poligon spasial GeoJSON untuk ${speciesId}`);
  return await res.json();
}

export async function getLandingSites() {
  const res = await fetchWithFallback("/api/gis/landing-sites");
  if (!res.ok) throw new Error("Gagal memuat data pangkalan pendaratan");
  return await res.json();
}

export async function getTelemetry() {
  const res = await fetchWithFallback("/api/gis/telemetry");
  if (!res.ok) throw new Error("Gagal memuat telemetri oseanografi Teluk Banten");
  return await res.json();
}

export async function getMapMetadata() {
  const res = await fetchWithFallback("/api/gis/metadata");
  if (!res.ok) return null;
  return await res.json();
}

// ==========================================
// MODULE 2: FISHGUARD AI (COMPUTER VISION)
// ==========================================

export async function getStatistics() {
  const res = await fetchWithFallback("/api/statistics");
  if (!res.ok) throw new Error("Gagal mengambil statistik");
  return await res.json();
}

export async function getHistory(limit = 50) {
  const res = await fetchWithFallback(`/api/history?limit=${limit}`);
  if (!res.ok) throw new Error("Gagal mengambil riwayat analisis");
  return await res.json();
}

export async function detectFish(fileOrFormData, confidence = 0.25) {
  let formData;
  if (fileOrFormData instanceof FormData) {
    formData = fileOrFormData;
  } else {
    formData = new FormData();
    formData.append("file", fileOrFormData);
    formData.append("confidence", confidence.toString());
  }

  const res = await fetchWithFallback("/api/detect", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || "Gagal melakukan deteksi ikan");
  }

  return await res.json();
}

export async function measureLength(payload) {
  return measureFishLength(payload);
}

export async function measureFishLength(payload, analysisId = null) {
  const url = analysisId
    ? `/api/measure?analysis_id=${encodeURIComponent(analysisId)}`
    : `/api/measure`;

  const res = await fetchWithFallback(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || "Gagal melakukan estimasi panjang ikan");
  }

  return await res.json();
}

export async function getFishguardStatus() {
  const res = await fetchWithFallback("/api/fishguard/status");
  if (!res.ok) throw new Error("Gagal memuat status FishGuard");
  return await res.json();
}

export async function getFishguardSamples() {
  const res = await fetchWithFallback("/api/fishguard/samples");
  if (!res.ok) throw new Error("Gagal memuat daftar sampel citra");
  return await res.json();
}

// ==========================================
// MODULE 3: BYCATCH AI (CONSERVATION & ETP)
// ==========================================

export async function checkByCatchHealth() {
  try {
    const res = await fetchWithFallback("/api/bycatch/health");
    if (!res.ok) throw new Error("ByCatch AI module offline");
    return await res.json();
  } catch (err) {
    return { status: "error", message: err.message };
  }
}

export async function detectByCatch(file, targetSpecies = "", fishingGear = "Jaring Insang / Gillnet", catchHandling = "retained", confidence = 0.25) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("target_species", targetSpecies);
  formData.append("fishing_gear", fishingGear);
  formData.append("catch_handling", catchHandling);
  formData.append("confidence", confidence.toString());

  const res = await fetchWithFallback("/api/bycatch/detect", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || "Gagal melakukan deteksi ByCatch");
  }

  return await res.json();
}

export async function evaluateCatchRole(payload) {
  const res = await fetchWithFallback("/api/bycatch/roles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || "Gagal mengevaluasi aturan peran tangkapan");
  }

  return await res.json();
}

export async function getConservationProfile(scientificName) {
  const res = await fetchWithFallback(`/api/bycatch/conservation/${encodeURIComponent(scientificName)}`);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || `Gagal mengambil profil konservasi untuk ${scientificName}`);
  }
  return await res.json();
}

export async function getByCatchRecords(limit = 50) {
  const res = await fetchWithFallback(`/api/bycatch/records?limit=${limit}`);
  if (!res.ok) throw new Error("Gagal mengambil catatan riwayat ByCatch");
  return await res.json();
}

export async function createByCatchTrip(payload) {
  const res = await fetchWithFallback("/api/bycatch/trips", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || "Gagal menyimpan catatan trip");
  }

  return await res.json();
}

export async function getBycatchSpecies() {
  const res = await fetchWithFallback("/api/bycatch/species");
  if (!res.ok) throw new Error("Gagal memuat referensi spesies ByCatch");
  return await res.json();
}

export async function getBycatchGears() {
  const res = await fetchWithFallback("/api/bycatch/gears");
  if (!res.ok) throw new Error("Gagal memuat registri alat tangkap");
  return await res.json();
}

export async function evaluateCatch(payload) {
  const res = await fetchWithFallback("/api/bycatch/evaluate-catch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Gagal mengevaluasi tangkapan");
  }
  return await res.json();
}

export async function getBycatchMetrics() {
  const res = await fetchWithFallback("/api/bycatch/metrics");
  if (!res.ok) throw new Error("Gagal memuat metrik konservasi");
  return await res.json();
}

// ==========================================
// UNIFIED HISTORY & MULTI-MODULE AUDIT
// ==========================================

export async function getUnifiedSessions(limit = 50) {
  const res = await fetchWithFallback(`/api/history/sessions?limit=${limit}`);
  if (!res.ok) throw new Error("Gagal memuat sesi riwayat terpadu");
  return await res.json();
}

export async function getUnifiedStats() {
  const res = await fetchWithFallback("/api/history/stats");
  if (!res.ok) throw new Error("Gagal memuat statistik riwayat terpadu");
  return await res.json();
}
