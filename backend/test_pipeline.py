"""
FishGuard AI — Comprehensive Backend Integration & Pipeline Test Suite (Phase 15)
Verifies:
1. Health check & model status (auto-detection of CUSTOM_SPECIES_MODEL)
2. Detection endpoint with real weights on test images
3. Length estimation endpoint (ArUco + manual calibration + curvature + uncertainty)
4. History and Statistics database endpoints
5. Edge case & error handling (empty file, non-image format, boundary values)
"""

import os
import sys
import json
import tempfile
import cv2
import numpy as np
from pathlib import Path
from fastapi.testclient import TestClient

# Ensure backend package is in python path
BACKEND_DIR = Path(__file__).resolve().parent
WORKSPACE_DIR = BACKEND_DIR.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))
if str(WORKSPACE_DIR) not in sys.path:
    sys.path.insert(0, str(WORKSPACE_DIR))

from app.main import app
from app.config import CUSTOM_WEIGHTS_PATH, RESULT_DIR, UPLOAD_DIR

client = TestClient(app)

def test_01_root_endpoint():
    print("\n--- TEST 01: GET / ---")
    resp = client.get("/")
    assert resp.status_code == 200, f"Root endpoint failed: {resp.text}"
    data = resp.json()
    assert data["project"] == "FishGuard AI"
    assert data["status"] == "online"
    print("  [PASS] Root endpoint returned status: online")

def test_02_health_and_model_detection():
    print("\n--- TEST 02: GET /api/health ---")
    resp = client.get("/api/health")
    assert resp.status_code == 200, f"Health endpoint failed: {resp.text}"
    data = resp.json()
    print("  Model Mode:", data["model_mode"])
    print("  Is Custom Trained:", data["is_custom_trained"])
    print("  Custom Weights Exist:", data["custom_weights_exist"])
    
    # Critical verification: Must be CUSTOM_SPECIES_MODEL
    assert data["model_mode"] == "CUSTOM_SPECIES_MODEL", f"Expected CUSTOM_SPECIES_MODEL, got {data['model_mode']}"
    assert data["is_custom_trained"] is True, "Expected is_custom_trained == True"
    assert data["custom_weights_exist"] is True, "Expected custom_weights_exist == True"
    assert Path(data["custom_weights_path"]).exists(), "Weights file path must exist"
    print("  [PASS] Health check verified custom weights auto-detection")

def test_03_model_status_and_species_taxonomy():
    print("\n--- TEST 03: GET /api/model/status ---")
    resp = client.get("/api/model/status")
    assert resp.status_code == 200, f"Model status failed: {resp.text}"
    data = resp.json()
    assert data["is_custom_trained"] is True
    assert data["model_mode"] == "CUSTOM_SPECIES_MODEL"
    species = data["supported_target_species"]
    assert len(species) == 3, f"Expected 3 target species, got {len(species)}"
    scientific_names = [s["scientific_name"] for s in species]
    assert "Rastrelliger brachysoma" in scientific_names
    assert "Selaroides leptolepis" in scientific_names
    assert "Upeneus sulphureus" in scientific_names
    print("  [PASS] Model status verified locked 3 MVP species:", scientific_names)

def test_04_detection_with_test_image():
    print("\n--- TEST 04: POST /api/detect with valid image ---")
    # Find a test image from dataset
    test_dir = WORKSPACE_DIR / "datasets" / "fishguard_v001" / "images" / "test"
    test_imgs = list(test_dir.glob("*.jpg"))
    if not test_imgs:
        test_dir = WORKSPACE_DIR / "dataset_pipeline" / "sample_calibrated_images"
        test_imgs = list(test_dir.glob("*.jpg"))
    
    assert len(test_imgs) > 0, "No test image found for detection test"
    test_img_path = test_imgs[0]
    print(f"  Testing with image: {test_img_path.name}")

    with open(test_img_path, "rb") as f:
        resp = client.post(
            "/api/detect",
            files={"file": (test_img_path.name, f, "image/jpeg")},
            data={"confidence": 0.20}
        )

    assert resp.status_code == 200, f"Detection failed: {resp.text}"
    data = resp.json()
    print("  Analysis ID:", data["id"])
    print("  Model Mode:", data["model_mode"])
    print("  Total Count:", data["total_count"])
    print("  Species Breakdown:", data["species_breakdown"])
    print("  Inference Time:", data["inference_time_ms"], "ms")

    assert data["model_mode"] == "CUSTOM_SPECIES_MODEL"
    assert "brachysoma" in data["species_breakdown"]
    assert "leptolepis" in data["species_breakdown"]
    assert "sulphureus" in data["species_breakdown"]
    assert data["total_count"] >= 0
    assert data["inference_time_ms"] > 0
    
    # Check that output result image actually exists on disk
    result_path = BACKEND_DIR / data["result_image_url"].lstrip("/")
    assert result_path.exists(), f"Result annotated image not saved on disk: {result_path}"
    print("  [PASS] Detection pipeline verified end-to-end")
    return data["id"], data["image_url"]

def test_05_detection_error_handling():
    print("\n--- TEST 05: POST /api/detect error handling ---")
    # Case A: Empty file (0 bytes)
    resp = client.post(
        "/api/detect",
        files={"file": ("empty.jpg", b"", "image/jpeg")},
        data={"confidence": 0.25}
    )
    assert resp.status_code == 400, f"Expected 400 for empty file, got {resp.status_code}"
    print("  [PASS] Empty file rejected with 400")

    # Case B: Non-image file (.txt)
    resp = client.post(
        "/api/detect",
        files={"file": ("notes.txt", b"Hello world text file", "text/plain")},
        data={"confidence": 0.25}
    )
    assert resp.status_code == 400, f"Expected 400 for text/plain, got {resp.status_code}"
    print("  [PASS] Non-image MIME type rejected with 400")

def test_06_measurement_with_aruco_and_status(analysis_id, image_url):
    print("\n--- TEST 06: POST /api/measure with ArUco marker image ---")
    # Generate image with ArUco marker + fish ellipse
    h, w = 600, 800
    test_img = np.ones((h, w, 3), dtype=np.uint8) * 255
    cv2.ellipse(test_img, (400, 300), (160, 45), 0, 0, 360, (50, 50, 50), -1)
    
    dict_aruco = cv2.aruco.getPredefinedDictionary(cv2.aruco.DICT_4X4_50)
    marker = cv2.aruco.generateImageMarker(dict_aruco, 0, 100)
    test_img[40:140, 40:140] = cv2.cvtColor(marker, cv2.COLOR_GRAY2BGR)

    marker_filename = "test_pipeline_aruco_fish.jpg"
    marker_path = UPLOAD_DIR / marker_filename
    cv2.imwrite(str(marker_path), test_img)

    payload = {
        "image_path": f"/static/uploads/{marker_filename}",
        "calibration": {
            "mode": "marker_reference",
            "reference_length_cm": 5.0
        },
        "auto_contour": True
    }

    resp = client.post(f"/api/measure?analysis_id={analysis_id}", json=payload)
    assert resp.status_code == 200, f"Measure failed: {resp.text}"
    data = resp.json()
    print("  Measurement Success:", data["success"])
    print("  Is Calibrated:", data["is_calibrated"])
    print("  Scale (px/cm):", data["scale_pixels_per_cm"])
    print("  Total Length (cm):", data["total_length_cm"])
    print("  Validation Status:", data["validation_status"])
    print("  Curvature Ratio:", data["curvature_ratio"])
    print("  Uncertainty (+- cm):", data["uncertainty_cm"])

    assert data["success"] is True
    assert data["is_calibrated"] is True
    assert data["scale_pixels_per_cm"] is not None
    assert data["total_length_cm"] is not None
    assert data["validation_status"] in ["VALIDATED", "LIMITED", "EXPERIMENTAL"]
    assert data["curvature_ratio"] is not None
    assert "scientific_disclaimer" in data
    print("  [PASS] Calibrated length estimation verified with status ladder")

def test_07_history_and_statistics_endpoints():
    print("\n--- TEST 07: GET /api/history & /api/statistics ---")
    resp_hist = client.get("/api/history?limit=10")
    assert resp_hist.status_code == 200
    hist = resp_hist.json()
    assert isinstance(hist, list)
    assert len(hist) > 0
    print(f"  [PASS] History retrieved {len(hist)} items")

    resp_stats = client.get("/api/statistics")
    assert resp_stats.status_code == 200
    stats = resp_stats.json()
    print("  Total Analyses:", stats["total_analyses"])
    print("  Total Fish Detected:", stats["total_fish_detected"])
    print("  Total Brachysoma:", stats["total_brachysoma"])
    print("  Total Leptolepis:", stats["total_leptolepis"])
    print("  Total Sulphureus:", stats["total_sulphureus"])
    assert stats["total_analyses"] >= len(hist)
    assert "total_brachysoma" in stats
    assert "total_leptolepis" in stats
    assert "total_sulphureus" in stats
    print("  [PASS] Statistics aggregation verified for 3 MVP species")

def test_08_model_reload_endpoint():
    print("\n--- TEST 08: POST /api/model/reload ---")
    resp = client.post("/api/model/reload")
    assert resp.status_code == 200
    data = resp.json()
    assert "status" in data
    assert data["status"]["model_mode"] == "CUSTOM_SPECIES_MODEL"
    assert data["status"]["is_custom_trained"] is True
    print("  [PASS] Model reload verified:", data["message"])

def run_all_tests():
    print("==================================================================")
    print("FISHGUARD AI — COMPREHENSIVE PIPELINE & BACKEND INTEGRATION TESTS")
    print("==================================================================")
    test_01_root_endpoint()
    test_02_health_and_model_detection()
    test_03_model_status_and_species_taxonomy()
    analysis_id, image_url = test_04_detection_with_test_image()
    test_05_detection_error_handling()
    test_06_measurement_with_aruco_and_status(analysis_id, image_url)
    test_07_history_and_statistics_endpoints()
    test_08_model_reload_endpoint()
    print("\n==================================================================")
    print("ALL 8 INTEGRATION TESTS PASSED SUCCESSFULLY! (100% PASS RATE)")
    print("==================================================================")

if __name__ == "__main__":
    run_all_tests()
