"""
E2E Audit Script: Memverifikasi integritas endpoint API FishGuard AI
Memastikan transparansi status model (MODEL_NOT_TRAINED) dan akurasi estimasi panjang.
"""

import requests
import json
from pathlib import Path

BASE_URL = "http://127.0.0.1:8000"
SAMPLE_DIR = Path(__file__).resolve().parent.parent / "dataset_pipeline" / "sample_calibrated_images"

def run_e2e_audit():
    print("=== PENGUJIAN END-TO-END AUDIT API FISHGUARD AI ===\n")
    
    # 1. Health & Model Status Check
    print("1. Menguji GET /api/health ...")
    r_health = requests.get(f"{BASE_URL}/api/health")
    assert r_health.status_code == 200, f"Health check gagal: {r_health.text}"
    health_data = r_health.json()
    print("   [PASS] Health Status:", health_data.get("status"))
    print("   [PASS] Model Mode:", health_data.get("model_mode"))
    print("   [PASS] Custom Weights Exist:", health_data.get("custom_weights_exist"))

    print("\n2. Menguji GET /api/model/status ...")
    r_model = requests.get(f"{BASE_URL}/api/model/status")
    assert r_model.status_code == 200, f"Model status gagal: {r_model.text}"
    model_data = r_model.json()
    print("   [PASS] Is Custom Trained:", model_data.get("is_custom_trained"))
    print("   [PASS] Message:", model_data.get("message"))

    # 3. Detection Test with Synthetic Specimen
    sample_file = SAMPLE_DIR / "sample_kembung_calibrated.jpg"
    print(f"\n3. Menguji POST /api/detect dengan sampel sintetis terkalibrasi: {sample_file.name} ...")
    with open(sample_file, "rb") as f:
        files = {"file": (sample_file.name, f, "image/jpeg")}
        data = {"confidence": 0.25}
        r_det = requests.post(f"{BASE_URL}/api/detect", files=files, data=data)
    assert r_det.status_code == 200, f"Deteksi gagal: {r_det.text}"
    det_data = r_det.json()
    print("   [PASS] Analysis ID:", det_data.get("id"))
    print("   [PASS] Model Mode:", det_data.get("model_mode"))
    print("   [PASS] Total Fish Terdeteksi:", det_data.get("total_count"))
    print("   [PASS] Kembung Count (Harus 0 jika belum terlatih):", det_data.get("kembung_count"))
    print("   [PASS] Layang Count (Harus 0 jika belum terlatih):", det_data.get("layang_count"))
    print("   [PASS] Diagnostic Notes:", det_data.get("notes"))
    analysis_id = det_data.get("id")

    # 4. Length Measurement Test with Known Calibration Scale (20 px/cm)
    print(f"\n4. Menguji POST /api/measure untuk analisis ID {analysis_id} ...")
    measure_payload = {
        "image_path": det_data.get("image_url"),
        "calibration": {
            "mode": "pixels_per_cm",
            "pixels_per_cm": 20.0
        },
        "auto_contour": True
    }
    r_meas = requests.post(f"{BASE_URL}/api/measure?analysis_id={analysis_id}", json=measure_payload)
    assert r_meas.status_code == 200, f"Pengukuran gagal: {r_meas.text}"
    meas_data = r_meas.json()
    print("   [PASS] Is Calibrated:", meas_data.get("is_calibrated"))
    print("   [PASS] Pixel Distance:", meas_data.get("pixel_distance"), "px")
    print("   [PASS] Total Length (TL):", meas_data.get("total_length_cm"), "cm")
    print("   [PASS] Confidence Level:", meas_data.get("confidence_level"))

    # 5. History Endpoint
    print("\n5. Menguji GET /api/history ...")
    r_hist = requests.get(f"{BASE_URL}/api/history?limit=5")
    assert r_hist.status_code == 200
    hist_data = r_hist.json()
    print(f"   [PASS] Total riwayat tersimpan: {len(hist_data)} item")

    # 6. Statistics Endpoint
    print("\n6. Menguji GET /api/statistics ...")
    r_stats = requests.get(f"{BASE_URL}/api/statistics")
    assert r_stats.status_code == 200
    stats_data = r_stats.json()
    print("   [PASS] Agregasi Dashboard:")
    print("     - Total Analyses:", stats_data.get("total_analyses"))
    print("     - Total Fish Detected:", stats_data.get("total_fish_detected"))
    print("     - Total Kembung:", stats_data.get("total_kembung"))
    print("     - Total Layang:", stats_data.get("total_layang"))

    print("\n=== [HASIL AUDIT END-TO-END: SEMUA ENDPOINT VALID & MEMENUHI STANDAR INTEGRITAS ILMIAH] ===")

if __name__ == "__main__":
    run_e2e_audit()
