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
    throw new Error(`Tidak dapat terhubung ke backend FishGuard di port 8000: ${err.message}`);
  }
}

export async function checkHealth() {
  try {
    const res = await fetchWithFallback("/api/health");
    if (!res.ok) throw new Error("Backend offline");
    return await res.json();
  } catch (err) {
    return { status: "error", message: err.message };
  }
}

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

export async function detectFish(file, confidence = 0.25) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("confidence", confidence.toString());

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
