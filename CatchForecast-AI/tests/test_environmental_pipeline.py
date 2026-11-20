"""
Test Suite for CatchForecast AI - Environmental Data Engineering Pipeline (Phase 05)
Validates spatial grid discretization, Sobel gradient calculations,
quality masking, and temporal alignment with fisheries landings.
"""

import sys
import os
import pytest
import numpy as np
import pandas as pd

# Add src/data to python path
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, os.path.join(BASE_DIR, "src", "data"))

from environmental_pipeline import (
    load_config,
    TelukBantenGrid,
    compute_sobel_gradient_2d,
    haversine_distance_km
)

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PROCESSED_ENV_DIR = os.path.join(BASE_DIR, "data", "processed", "environmental")

def test_grid_generation_and_bounds():
    """Verify that grid dimensions match 1 km spacing and strict Teluk Banten bounding box."""
    cfg = load_config()
    grid_gen = TelukBantenGrid(cfg)
    df_grid = grid_gen.build_grid_dataframe()
    
    assert len(df_grid) == 1426, f"Expected 1426 cells, got {len(df_grid)}"
    assert df_grid["lon"].min() >= 105.90 - 1e-4
    assert df_grid["lon"].max() <= 106.35 + 1e-4
    assert df_grid["lat"].min() >= -6.15 - 1e-4
    assert df_grid["lat"].max() <= -5.85 + 1e-4
    
    # Check marine ratio
    marine_count = df_grid["is_marine"].sum()
    assert 700 <= marine_count <= 900, f"Marine cells should be ~798, got {marine_count}"

def test_sobel_gradient_kernel():
    """Verify that 3x3 Sobel convolution computes mathematically valid gradients."""
    # Synthetic 5x5 array with linear horizontal temperature ramp: 1 deg per cell
    test_grid = np.array([
        [28.0, 29.0, 30.0, 31.0, 32.0],
        [28.0, 29.0, 30.0, 31.0, 32.0],
        [28.0, 29.0, 30.0, 31.0, 32.0],
        [28.0, 29.0, 30.0, 31.0, 32.0],
        [28.0, 29.0, 30.0, 31.0, 32.0]
    ])
    grad = compute_sobel_gradient_2d(test_grid, cell_size_km=1.0)
    
    assert grad.shape == (5, 5)
    # Center cell gradient should be exactly 1.0 deg C / km
    center_grad = grad[2, 2]
    assert np.isclose(center_grad, 1.0, atol=0.05), f"Expected gradient ~1.0, got {center_grad}"
    assert (grad >= 0).all(), "All gradient values must be non-negative"

def test_distance_to_port_and_shore():
    """Verify that distance calculation near PPN Karangantu is minimal and strictly non-negative."""
    # Distance from PPN Karangantu coordinates to itself should be 0
    d_zero = haversine_distance_km(-6.0333, 106.1500, -6.0333, 106.1500)
    assert np.isclose(d_zero, 0.0, atol=1e-3)
    
    # Distance to Pulau Tunda (~106.17, -5.81) should be ~25 km
    d_pulau_tunda = haversine_distance_km(-6.0333, 106.1500, -5.8100, 106.1700)
    assert 20.0 <= d_pulau_tunda <= 30.0

def test_processed_features_integrity():
    """Verify that output processed files exist and contain valid physical ranges."""
    features_csv = os.path.join(PROCESSED_ENV_DIR, "teluk_banten_environmental_features_2026.csv")
    assert os.path.exists(features_csv), "Feature matrix file not found"
    
    df_feat = pd.read_csv(features_csv)
    assert len(df_feat) == 15686, f"Expected 15686 rows, got {len(df_feat)}"
    
    # Only check marine cells for temperatures
    marine_feat = df_feat[df_feat["is_marine"] == True]
    assert (marine_feat["sst_celsius"] >= 25.0).all(), "SST must be >= 25 C"
    assert (marine_feat["sst_celsius"] <= 34.0).all(), "SST must be <= 34 C"
    assert (marine_feat["bathymetry_depth_m"] > 0).all(), "Marine depth must be > 0 m"
    assert (marine_feat["thermal_front_c_per_km"] >= 0).all(), "Front gradient must be >= 0"

def test_catch_environment_alignment():
    """Verify that monthly aligned dataset links fisheries landings to environmental means."""
    aligned_csv = os.path.join(PROCESSED_ENV_DIR, "monthly_aligned_environment_catch.csv")
    assert os.path.exists(aligned_csv), "Aligned dataset not found"
    
    df_aligned = pd.read_csv(aligned_csv)
    assert len(df_aligned) == 11, f"Expected 11 months (Jan-Nov), got {len(df_aligned)}"
    
    # August should have peak catch and lowest SST (Monsoon East upwelling)
    aug_row = df_aligned[df_aligned["month"] == 8].iloc[0]
    assert aug_row["volume_kg"] > 400000, "August volume should be peak (>400 tons)"
    assert aug_row["sst_mean"] < 29.5, "August SST should be cooler in dry season"

if __name__ == "__main__":
    pytest.main(["-v", __file__])
