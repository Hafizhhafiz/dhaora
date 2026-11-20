"""
Test Suite for CatchForecast AI - End-to-End System Integration (Phase 12)
Validates complete data-to-decision pipeline across all 12 project phases:
- Data Provenance & Species Separation
- ML Model Integrity & Inference Correctness
- GeoJSON & Cartographic Map Conformance
- Backend REST API Endpoints & Error Handling
- Secret Security Audit & Research Ethics Compliance
"""

import os
import sys
import json
import re
import pytest
from fastapi.testclient import TestClient

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, os.path.join(BASE_DIR, "backend"))

from main import app, VALID_SPECIES

client = TestClient(app)

SPECIES_KEYS = ["rastrelliger", "selaroides", "upeneus"]

def test_data_provenance_and_species_isolation():
    """Verify raw fisheries ground truth and processed species isolation."""
    raw_fish_dir = os.path.join(BASE_DIR, "data", "raw", "fisheries")
    assert os.path.isfile(os.path.join(raw_fish_dir, "ppn_karangantu_produksi_bulanan_2026.csv"))
    assert os.path.isfile(os.path.join(raw_fish_dir, "target_species_landings.csv"))
    assert os.path.isfile(os.path.join(raw_fish_dir, "raw_pipp_dump.json"))
    
    # Verify three isolated species folders
    for sp in SPECIES_KEYS:
        sp_dir = os.path.join(BASE_DIR, "data", "processed", "species", sp)
        assert os.path.isdir(sp_dir)
        csv_file = os.path.join(sp_dir, f"{sp}_monthly_features.csv")
        json_file = os.path.join(sp_dir, f"{sp}_metadata.json")
        assert os.path.isfile(csv_file)
        assert os.path.isfile(json_file)

def test_model_artifacts_and_performance_gate():
    """Verify that all 3 models passed evaluation gate and artifacts are serialized."""
    val_json_path = os.path.join(BASE_DIR, "docs", "model_validation_summary.json")
    assert os.path.isfile(val_json_path)
    
    with open(val_json_path, "r") as f:
        val_data = json.load(f)
        
    for sp in SPECIES_KEYS:
        assert sp in val_data
        sp_val = val_data[sp]
        assert sp_val["overall_status"] == "PASS"
        assert sp_val["spatial_validation"]["r2_score"] >= 0.999
        assert sp_val["spatial_validation"]["relative_mae_percent"] <= 1.0

def test_geospatial_layers_and_cartography():
    """Verify GeoJSON layers and publication PNG maps."""
    maps_dir = os.path.join(BASE_DIR, "data", "processed", "maps")
    png_dir = os.path.join(BASE_DIR, "reports", "phase_10", "maps")
    
    for sp in SPECIES_KEYS:
        geojson_path = os.path.join(maps_dir, f"{sp}_prediction_map.geojson")
        assert os.path.isfile(geojson_path)
        with open(geojson_path, "r") as f:
            data = json.load(f)
        assert len(data["features"]) == 798
        
        png_path = os.path.join(png_dir, f"{sp}_prediction_map.png")
        assert os.path.isfile(png_path)
        assert os.path.getsize(png_path) > 100_000

def test_backend_api_full_flow():
    """Verify complete backend REST API flow from health to GeoJSON serving."""
    # 1. Health
    res_health = client.get("/api/health")
    assert res_health.status_code == 200
    assert res_health.json()["status"] == "healthy"
    
    # 2. Species
    res_sp = client.get("/api/species")
    assert res_sp.status_code == 200
    assert len(res_sp.json()["species"]) == 3
    
    # 3. GeoJSON
    for sp in SPECIES_KEYS:
        res_map = client.get(f"/api/predictions/{sp}")
        assert res_map.status_code == 200
        assert res_map.json()["type"] == "FeatureCollection"
        
        res_summary = client.get(f"/api/predictions/{sp}/summary")
        assert res_summary.status_code == 200
        assert res_summary.json()["total_predicted_catch_kg"] > 0
        
    # 4. Web GIS UI
    res_ui = client.get("/")
    assert res_ui.status_code == 200
    assert "CatchForecast AI" in res_ui.text

def test_zero_credential_leakage_audit():
    """Scan all code files in src/ and backend/ for potential API key or secret leakage."""
    secret_patterns = [
        re.compile(r"(?i)(private_key|client_secret|api_key|password)\s*=\s*['\"][a-zA-Z0-9_\-]{8,}['\"]"),
        re.compile(r"(?i)BEGIN PRIVATE KEY"),
        re.compile(r"(?i)ghp_[a-zA-Z0-9]{30,}")
    ]
    
    code_dirs = [os.path.join(BASE_DIR, "src"), os.path.join(BASE_DIR, "backend")]
    
    for c_dir in code_dirs:
        for root, _, files in os.walk(c_dir):
            for file in files:
                if file.endswith((".py", ".js", ".json")) and not file.endswith("package-lock.json"):
                    file_path = os.path.join(root, file)
                    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                        content = f.read()
                    for pat in secret_patterns:
                        match = pat.search(content)
                        assert match is None, f"Potential credential leak detected in {file_path}: {match.group(0)}"
