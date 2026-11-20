"""
Test Suite for CatchForecast AI - Machine Learning Model Inference (Phase 08)
Validates model artifact loading, input schema conformance, prediction bounds,
and real-time inference latency for all 3 target species models.
"""

import os
import sys
import json
import time
import pytest
import numpy as np
import pandas as pd
import joblib

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
MODELS_DIR = os.path.join(BASE_DIR, "models")

SPECIES_KEYS = ["rastrelliger", "selaroides", "upeneus"]

FEATURE_COLS = [
    "sst_celsius",
    "thermal_front_c_per_km",
    "chlorophyll_a_mg_m3",
    "bathymetry_depth_m",
    "bathymetry_slope_deg",
    "dist_to_shore_km",
    "dist_to_port_km",
    "month_sin",
    "month_cos"
]

def test_model_artifacts_and_metadata_exist():
    """Verify that all 3 species models have serialized .joblib and .json metadata."""
    for sp in SPECIES_KEYS:
        sp_dir = os.path.join(MODELS_DIR, sp)
        assert os.path.isdir(sp_dir), f"Model directory missing: {sp_dir}"
        
        joblib_path = os.path.join(sp_dir, f"{sp}_best_model.joblib")
        json_path = os.path.join(sp_dir, "model_metadata.json")
        
        assert os.path.isfile(joblib_path), f"Champion model binary missing: {joblib_path}"
        assert os.path.isfile(json_path), f"Model metadata JSON missing: {json_path}"
        
        with open(json_path, "r") as f:
            meta = json.load(f)
            
        assert meta["species_id"] == sp
        assert "champion_model_architecture" in meta
        assert "spatial_holdout_metrics" in meta
        assert meta["spatial_holdout_metrics"]["r2_score"] > 0.5, f"Spatial R² for {sp} should be > 0.5"

def test_model_inference_smoke():
    """Verify that models load, accept valid input arrays, and predict positive finite values."""
    # Synthetic test input corresponding to August peak upwelling conditions
    sample_input = pd.DataFrame([{
        "sst_celsius": 28.5,
        "thermal_front_c_per_km": 0.08,
        "chlorophyll_a_mg_m3": 4.5,
        "bathymetry_depth_m": 18.0,
        "bathymetry_slope_deg": 1.2,
        "dist_to_shore_km": 3.5,
        "dist_to_port_km": 12.0,
        "month_sin": -0.866, # month 8: sin(16pi/12) = -0.866
        "month_cos": -0.500  # month 8: cos(16pi/12) = -0.500
    }])
    
    for sp in SPECIES_KEYS:
        model_path = os.path.join(MODELS_DIR, sp, f"{sp}_best_model.joblib")
        model = joblib.load(model_path)
        
        pred = model.predict(sample_input[FEATURE_COLS])
        pred_val = float(pred[0])
        
        assert not np.isnan(pred_val), f"Prediction for {sp} returned NaN"
        assert not np.isinf(pred_val), f"Prediction for {sp} returned Inf"
        assert pred_val >= 0.0, f"Prediction for {sp} must be non-negative, got {pred_val}"

def test_model_inference_latency():
    """Verify that single-sample inference latency is under 100 ms (Web GIS ready)."""
    sample_input = pd.DataFrame([{
        "sst_celsius": 29.0,
        "thermal_front_c_per_km": 0.05,
        "chlorophyll_a_mg_m3": 3.0,
        "bathymetry_depth_m": 15.0,
        "bathymetry_slope_deg": 1.0,
        "dist_to_shore_km": 2.0,
        "dist_to_port_km": 10.0,
        "month_sin": 0.0,
        "month_cos": 1.0
    }])
    
    for sp in SPECIES_KEYS:
        model_path = os.path.join(MODELS_DIR, sp, f"{sp}_best_model.joblib")
        model = joblib.load(model_path)
        
        # Warmup
        _ = model.predict(sample_input[FEATURE_COLS])
        
        # Measure latency over 30 iterations
        t0 = time.time()
        for _ in range(30):
            _ = model.predict(sample_input[FEATURE_COLS])
        avg_latency_ms = ((time.time() - t0) / 30.0) * 1000.0
        
        assert avg_latency_ms < 100.0, f"Inference latency for {sp} is too high: {avg_latency_ms:.2f} ms"
