"""
Automated Backend Tests for DHAORA Gateway
"""

import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from fastapi.testclient import TestClient
from dhaora.backend.main import app

client = TestClient(app)

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["platform"] == "DHAORA"

def test_gis_species():
    res = client.get("/api/gis/species")
    assert res.status_code == 200
    data = res.json()
    assert len(data["species"]) == 3

def test_gis_geojson_rastrelliger():
    res = client.get("/api/gis/maps/rastrelliger")
    assert res.status_code == 200
    geojson = res.json()
    assert geojson["type"] == "FeatureCollection"
    assert len(geojson["features"]) == 798

def test_bycatch_species():
    res = client.get("/api/bycatch/species")
    assert res.status_code == 200
    data = res.json()
    assert len(data["species"]) >= 3

def test_bycatch_evaluation():
    payload = {
        "vessel_name": "KM Nelayan Maju",
        "fishing_gear": "Jaring Insang (Gillnet)",
        "species_breakdown": {
            "kembung_perempuan": 45.0,
            "selar_kuning": 30.0,
            "kuniran": 10.0
        }
    }
    res = client.post("/api/bycatch/evaluate-catch", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "compliance_status" in data
    assert "target_percentage" in data

def test_history_sessions():
    res = client.get("/api/history/sessions")
    assert res.status_code == 200
    data = res.json()
    assert "sessions" in data

if __name__ == "__main__":
    print("Running DHAORA backend tests...")
    test_health()
    print("✓ Health test passed")
    test_gis_species()
    print("✓ GIS species test passed")
    test_gis_geojson_rastrelliger()
    print("✓ GeoJSON Rastrelliger (798 cells) passed")
    test_bycatch_species()
    print("✓ Bycatch species test passed")
    test_bycatch_evaluation()
    print("✓ Catch evaluation audit passed")
    test_history_sessions()
    print("✓ Unified history test passed")
    print("ALL TESTS PASSED SUCCESSFULLY!")
