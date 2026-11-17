"""
Integration Test Suite for ByCatch AI Endpoints in ASIK Platform
Verifies:
1. GET /api/bycatch/health
2. POST /api/bycatch/roles (Rule engine evaluation)
3. GET /api/bycatch/conservation/{scientific_name} (IUCN/CITES/KKP authoritative query)
4. POST /api/bycatch/detect (Image inference + catch role + conservation lookup)
5. GET /api/bycatch/records (Database retrieval from app.sqlite)
6. POST /api/bycatch/trips (Trip logging)
"""

import sys
from pathlib import Path
from fastapi.testclient import TestClient

# Ensure workspace root in path
WORKSPACE_ROOT = Path(__file__).resolve().parent.parent
if str(WORKSPACE_ROOT) not in sys.path:
    sys.path.insert(0, str(WORKSPACE_ROOT))

from backend.app.main import app

client = TestClient(app)

def test_bycatch_health():
    print("\n--- TEST: GET /api/bycatch/health ---")
    resp = client.get("/api/bycatch/health")
    assert resp.status_code == 200, f"Health check failed: {resp.text}"
    data = resp.json()
    assert data["module"] == "ByCatch AI"
    assert data["model_status"] == "ready"
    assert data["database_connected"] is True
    assert data["conservation_sources"]["iucn_snapshot_available"] is True
    assert data["conservation_sources"]["cites_snapshot_available"] is True
    print("  [PASS] ByCatch health verified: model_status=ready, db=connected")

def test_bycatch_role_engine():
    print("\n--- TEST: POST /api/bycatch/roles ---")
    # Case 1: Target species match
    resp1 = client.post("/api/bycatch/roles", json={
        "detected_species_name": "selar_kuning",
        "target_species": "selar kuning; kembung",
        "catch_handling": "retained"
    })
    assert resp1.status_code == 200
    d1 = resp1.json()
    assert d1["catch_role"] == "target"
    assert d1["is_target"] is True
    assert d1["is_bycatch"] is False

    # Case 2: Non-target retained
    resp2 = client.post("/api/bycatch/roles", json={
        "detected_species_name": "kuniran",
        "target_species": "selar kuning",
        "catch_handling": "retained"
    })
    assert resp2.status_code == 200
    d2 = resp2.json()
    assert d2["catch_role"] == "incidental_non_target_retained"
    assert d2["is_target"] is False
    assert d2["is_bycatch"] is True

    # Case 3: Non-target discarded
    resp3 = client.post("/api/bycatch/roles", json={
        "detected_species_name": "kuniran",
        "target_species": "selar kuning",
        "catch_handling": "discarded"
    })
    assert resp3.status_code == 200
    d3 = resp3.json()
    assert d3["catch_role"] == "discarded_non_target"
    assert d3["is_target"] is False
    assert d3["is_bycatch"] is True
    print("  [PASS] FAO Catch Role Rule Engine verified for target, retained bycatch, and discarded bycatch")

def test_bycatch_conservation():
    print("\n--- TEST: GET /api/bycatch/conservation/{scientific_name} ---")
    resp = client.get("/api/bycatch/conservation/Selaroides leptolepis")
    assert resp.status_code == 200
    data = resp.json()
    assert data["scientific_name"] == "Selaroides leptolepis"
    assert data["family"] == "Carangidae"
    assert "iucn" in data
    assert "cites" in data
    assert "national_protection" in data
    assert "legal_disclaimer" in data
    print(f"  [PASS] Conservation profile verified: IUCN={data['iucn'].get('iucn_status')}, CITES={data['cites'].get('cites_appendix')}")

def test_bycatch_detect():
    print("\n--- TEST: POST /api/bycatch/detect ---")
    test_img = WORKSPACE_ROOT / "backend" / "static" / "samples" / "sample_test_01.jpg"
    assert test_img.exists(), f"Test image missing: {test_img}"

    with open(test_img, "rb") as f:
        resp = client.post(
            "/api/bycatch/detect",
            files={"file": ("sample_test_01.jpg", f, "image/jpeg")},
            data={
                "target_species": "selar kuning",
                "fishing_gear": "Jaring Insang / Gillnet",
                "catch_handling": "retained",
                "confidence": 0.25
            }
        )
    assert resp.status_code == 200, f"Detection failed: {resp.text}"
    data = resp.json()
    assert data["status"] == "success"
    assert "analysis_id" in data
    assert "image_url" in data
    assert "result_image_url" in data
    assert "summary" in data
    assert "detections" in data
    assert "disclaimer" in data
    print(f"  [PASS] ByCatch detection successful: Total={data['total_detected']}, Target={data['summary']['target_count']}, Bycatch={data['summary']['bycatch_count']}")

def test_bycatch_records_and_trips():
    print("\n--- TEST: POST /api/bycatch/trips and GET /api/bycatch/records ---")
    resp_trip = client.post("/api/bycatch/trips", json={
        "landing_date": "2026-11-18",
        "fishing_gear": "Rawai Dasar / Longline",
        "detected_species": "Upeneus sulphureus",
        "catch_role": "incidental_non_target_retained",
        "target_species": "Selaroides leptolepis",
        "vessel_trip_id": "TRIP-TEST-001",
        "catch_handling": "retained",
        "notes": "Test integration record"
    })
    assert resp_trip.status_code == 200
    assert resp_trip.json()["status"] == "success"

    resp_rec = client.get("/api/bycatch/records?limit=10")
    assert resp_rec.status_code == 200
    data = resp_rec.json()
    assert data["status"] == "success"
    assert len(data["records"]) > 0
    print(f"  [PASS] Trip logged and records verified: {len(data['records'])} records in SQLite")

if __name__ == "__main__":
    print("=" * 66)
    print("ASIK PLATFORM — BYCATCH AI INTEGRATION SUITE")
    print("=" * 66)
    test_bycatch_health()
    test_bycatch_role_engine()
    test_bycatch_conservation()
    test_bycatch_detect()
    test_bycatch_records_and_trips()
    print("\n" + "=" * 66)
    print("ALL BYCATCH INTEGRATION TESTS PASSED (100%)!")
    print("=" * 66)
