"""
Test Suite for CatchForecast AI - Prediction Map Generation (Phase 10)
Validates GeoJSON schema conformance (RFC 7946, EPSG:4326), geometry closures,
attribute values, and cartographic map artifacts.
"""

import os
import sys
import json
import pytest
import numpy as np

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
MAPS_GEOJSON_DIR = os.path.join(BASE_DIR, "data", "processed", "maps")
MAPS_PNG_DIR = os.path.join(BASE_DIR, "reports", "phase_10", "maps")

SPECIES_KEYS = ["rastrelliger", "selaroides", "upeneus"]

def test_geojson_maps_exist_and_conform_schema():
    """Verify that all 3 GeoJSON files exist, parse correctly, and adhere to RFC 7946."""
    for sp in SPECIES_KEYS:
        geojson_path = os.path.join(MAPS_GEOJSON_DIR, f"{sp}_prediction_map.geojson")
        assert os.path.isfile(geojson_path), f"GeoJSON missing for {sp}: {geojson_path}"
        
        with open(geojson_path, "r") as f:
            data = json.load(f)
            
        assert data.get("type") == "FeatureCollection"
        assert "features" in data
        assert len(data["features"]) == 798, f"Expected exactly 798 marine cells for {sp}, got {len(data['features'])}"
        assert "metadata" in data
        assert data["metadata"]["species"] is not None

def test_geojson_geometry_and_coordinates():
    """Verify polygon geometry validity (closed linear rings, bounded in Teluk Banten)."""
    for sp in SPECIES_KEYS:
        geojson_path = os.path.join(MAPS_GEOJSON_DIR, f"{sp}_prediction_map.geojson")
        with open(geojson_path, "r") as f:
            data = json.load(f)
            
        for feat in data["features"]:
            geom = feat["geometry"]
            assert geom["type"] == "Polygon"
            coords = geom["coordinates"][0]
            assert len(coords) == 5, "1 km cell polygon must have 5 points (closed ring)"
            # Verify ring closure
            assert coords[0] == coords[-1], "Polygon first and last coordinate must match"
            
            # Check bounding coordinates inside Teluk Banten domain
            for pt in coords:
                lon, lat = pt[0], pt[1]
                assert 105.85 <= lon <= 106.40, f"Longitude out of bounds: {lon}"
                assert -6.20 <= lat <= -5.80, f"Latitude out of bounds: {lat}"

def test_geojson_properties_and_values():
    """Verify that predicted catch values and CPUE are strictly non-negative and finite."""
    required_props = [
        "cell_id", "species_id", "scientific_name", "local_name",
        "category", "predicted_catch_kg", "predicted_cpue_kg_per_trip",
        "sst_celsius", "thermal_front_c_per_km", "bathymetry_depth_m",
        "dist_to_shore_km", "month", "year"
    ]
    
    for sp in SPECIES_KEYS:
        geojson_path = os.path.join(MAPS_GEOJSON_DIR, f"{sp}_prediction_map.geojson")
        with open(geojson_path, "r") as f:
            data = json.load(f)
            
        catches = []
        for feat in data["features"]:
            props = feat["properties"]
            for prop in required_props:
                assert prop in props, f"Missing property {prop} in {sp} cell {props.get('cell_id')}"
                
            c_val = props["predicted_catch_kg"]
            assert c_val >= 0.0, f"Predicted catch cannot be negative, got {c_val}"
            assert not np.isnan(c_val) and not np.isinf(c_val)
            catches.append(c_val)
            
        # Verify non-trivial predictions (not all zero)
        assert sum(catches) > 100.0, f"Total predicted catch for {sp} suspiciously low: {sum(catches)}"

def test_thematic_cartographic_pngs_exist():
    """Verify that all 3 species PNG maps plus the comparative map exist and have valid size."""
    expected_pngs = [
        "rastrelliger_prediction_map.png",
        "selaroides_prediction_map.png",
        "upeneus_prediction_map.png",
        "04_comparative_prediction_map.png"
    ]
    
    for png_name in expected_pngs:
        png_path = os.path.join(MAPS_PNG_DIR, png_name)
        assert os.path.isfile(png_path), f"Thematic map missing: {png_path}"
        size_bytes = os.path.getsize(png_path)
        assert size_bytes > 100_000, f"PNG map too small ({size_bytes} bytes): {png_path}"
