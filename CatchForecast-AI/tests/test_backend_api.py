"""
Test Suite for CatchForecast AI - Backend REST API & Web GIS Serving (Phase 11)
Validates endpoints, HTTP status codes, GeoJSON response headers, and error handling.
"""

import sys
import os
import pytest
from fastapi.testclient import TestClient

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, os.path.join(BASE_DIR, "backend"))

from main import app, VALID_SPECIES

client = TestClient(app)

def test_serve_frontend_root():
    """Verify that GET / returns the Web GIS dashboard HTML with 200 OK."""
    response = client.get("/")
    assert response.status_code == 200
    assert "text/html" in response.headers["content-type"]
    assert "CatchForecast AI" in response.text
    assert "leaflet" in response.text.lower()
    assert "PPN Karangantu" in response.text

def test_health_check():
    """Verify /api/health status, release name, and validation gate status."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["active_models_count"] == 3
    assert data["validation_gate_status"] == "PASS"

def test_species_catalog():
    """Verify /api/species returns exactly 3 approved target species."""
    response = client.get("/api/species")
    assert response.status_code == 200
    data = response.json()
    assert data["count"] == 3
    species_ids = [s["species_id"] for s in data["species"]]
    assert "rastrelliger" in species_ids
    assert "selaroides" in species_ids
    assert "upeneus" in species_ids

def test_system_metadata():
    """Verify /api/metadata returns Teluk Banten domain and 798 active marine cells."""
    response = client.get("/api/metadata")
    assert response.status_code == 200
    data = response.json()
    assert data["active_marine_cells"] == 798
    assert data["masked_land_cells"] == 628
    assert data["crs"] == "EPSG:4326 (WGS 84)"
    assert data["primary_landing_hub"]["name"] == "PPN Karangantu"

def test_predictions_geojson_endpoints():
    """Verify /api/predictions/{species_id} returns valid GeoJSON for all 3 species."""
    for sp in ["rastrelliger", "selaroides", "upeneus"]:
        response = client.get(f"/api/predictions/{sp}")
        assert response.status_code == 200
        data = response.json()
        assert data["type"] == "FeatureCollection"
        assert len(data["features"]) == 798
        first_feature = data["features"][0]
        assert "predicted_catch_kg" in first_feature["properties"]
        assert first_feature["properties"]["predicted_catch_kg"] >= 0.0

def test_predictions_invalid_species_404():
    """Verify that an invalid species ID returns a clean HTTP 404 response."""
    response = client.get("/api/predictions/tuna_albacore")
    assert response.status_code == 404
    data = response.json()
    assert "detail" in data
    assert "not recognized" in data["detail"].lower()

def test_species_summary_endpoint():
    """Verify /api/predictions/{species_id}/summary returns calculated KPI metrics."""
    response = client.get("/api/predictions/rastrelliger/summary")
    assert response.status_code == 200
    data = response.json()
    assert data["species_id"] == "rastrelliger"
    assert data["cells_analyzed"] == 798
    assert data["total_predicted_catch_kg"] > 0
    assert data["mean_catch_kg_per_cell"] > 0
    assert data["max_catch_kg_cell"] >= data["mean_catch_kg_per_cell"]
