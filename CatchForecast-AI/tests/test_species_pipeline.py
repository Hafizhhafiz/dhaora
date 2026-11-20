"""
Test Suite for CatchForecast AI - Species Data Preparation Pipeline (Phase 06)
Validates species isolation, spatial allocation conservation, ecological differentiation,
and data integrity across all 3 target species.
"""

import os
import sys
import json
import pytest
import numpy as np
import pandas as pd

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PROCESSED_SPECIES_DIR = os.path.join(BASE_DIR, "data", "processed", "species")

SPECIES_KEYS = ["rastrelliger", "selaroides", "upeneus"]
EXPECTED_ANNUAL_TOTALS = {
    "rastrelliger": 474922.4,
    "selaroides": 36308.0,
    "upeneus": 182175.1
}

def test_species_dataset_existence_and_structure():
    """Verify that all 3 species folders exist with CSV and metadata JSON."""
    assert os.path.exists(PROCESSED_SPECIES_DIR), "Processed species directory must exist"
    
    for sp in SPECIES_KEYS:
        sp_dir = os.path.join(PROCESSED_SPECIES_DIR, sp)
        assert os.path.isdir(sp_dir), f"Directory for {sp} must exist"
        
        csv_file = os.path.join(sp_dir, f"{sp}_monthly_features.csv")
        json_file = os.path.join(sp_dir, f"{sp}_metadata.json")
        
        assert os.path.isfile(csv_file), f"CSV file for {sp} missing: {csv_file}"
        assert os.path.isfile(json_file), f"Metadata JSON for {sp} missing: {json_file}"
        
        # Verify JSON metadata content
        with open(json_file, "r") as f:
            meta = json.load(f)
        assert "scientific_name" in meta
        assert "category" in meta
        assert "total_observations" in meta
        assert meta["total_observations"] == 8778

def test_row_count_and_cell_completeness():
    """Verify that each species dataset contains exactly 8,778 rows (798 cells x 11 months)."""
    for sp in SPECIES_KEYS:
        csv_file = os.path.join(PROCESSED_SPECIES_DIR, sp, f"{sp}_monthly_features.csv")
        df = pd.read_csv(csv_file)
        
        assert len(df) == 8778, f"{sp} expected 8,778 rows, got {len(df)}"
        assert df["cell_id"].nunique() == 798, f"{sp} must have exactly 798 unique marine cells"
        assert sorted(df["month"].unique()) == list(range(1, 12)), f"{sp} must have months 1..11"
        
        # Verify exactly 798 cells per month
        cells_per_month = df.groupby("month")["cell_id"].count()
        assert (cells_per_month == 798).all(), f"Every month in {sp} must have exactly 798 cells"

def test_catch_conservation_and_allocation():
    """Verify exact catch conservation: sum of allocated catch equals port landing totals."""
    for sp, expected_total in EXPECTED_ANNUAL_TOTALS.items():
        csv_file = os.path.join(PROCESSED_SPECIES_DIR, sp, f"{sp}_monthly_features.csv")
        df = pd.read_csv(csv_file)
        
        total_allocated = df["catch_weight_kg"].sum()
        # Allow 0.1% tolerance due to floating point rounding across 8,778 cells
        assert np.isclose(total_allocated, expected_total, rtol=1e-3), (
            f"Catch conservation failed for {sp}: Expected {expected_total} kg, got {total_allocated:.2f} kg"
        )
        
        # Ensure catch and CPUE are strictly non-negative
        assert (df["catch_weight_kg"] >= 0).all(), f"{sp} allocated catch cannot be negative"
        assert (df["cpue_kg_per_unit_effort"] >= 0).all(), f"{sp} CPUE cannot be negative"
        assert not df["catch_weight_kg"].isna().any(), f"{sp} has NaN in catch_weight_kg"
        assert not df["cpue_kg_per_unit_effort"].isna().any(), f"{sp} has NaN in cpue_kg_per_unit_effort"

def test_required_columns_and_data_types():
    """Verify schema integrity and feature column value ranges."""
    numeric_cols = [
        "lat", "lon", "sst_celsius", "thermal_front_c_per_km", 
        "chlorophyll_a_mg_m3", "bathymetry_depth_m", "bathymetry_slope_deg", 
        "dist_to_shore_km", "dist_to_port_km", 
        "catch_weight_kg", "cpue_kg_per_unit_effort", "total_month_catch_kg"
    ]
    meta_cols = ["species_id", "scientific_name", "local_name", "category", "family", "cell_id", "year", "month", "is_complete"]
    
    for sp in SPECIES_KEYS:
        csv_file = os.path.join(PROCESSED_SPECIES_DIR, sp, f"{sp}_monthly_features.csv")
        df = pd.read_csv(csv_file)
        
        for col in meta_cols + numeric_cols:
            assert col in df.columns, f"Missing required column {col} in {sp}"
            assert not df[col].isna().any(), f"Column {col} in {sp} has NaN values"
            
        for col in numeric_cols:
            assert not np.isinf(df[col]).any(), f"Numeric column {col} in {sp} has inf values"
            
        # Range checks
        assert (df["sst_celsius"] >= 25.0).all() and (df["sst_celsius"] <= 35.0).all()
        assert (df["thermal_front_c_per_km"] >= 0.0).all()
        assert (df["bathymetry_depth_m"] >= 0.0).all(), "Bathymetry depth magnitude is positive"
        assert (df["bathymetry_slope_deg"] >= 0.0).all()
        assert (df["dist_to_shore_km"] >= 0.0).all()
        assert (df["dist_to_port_km"] >= 0.0).all()

def test_ecological_niche_differentiation():
    """Verify that pelagic vs demersal species exhibit distinct habitat affinity profiles."""
    rast = pd.read_csv(os.path.join(PROCESSED_SPECIES_DIR, "rastrelliger", "rastrelliger_monthly_features.csv"))
    upen = pd.read_csv(os.path.join(PROCESSED_SPECIES_DIR, "upeneus", "upeneus_monthly_features.csv"))
    
    # Check that spatial catch allocations are not identical
    assert not np.allclose(rast["catch_weight_kg"], upen["catch_weight_kg"]), (
        "Pelagic and Demersal species must not have identical spatial catch allocation!"
    )
    
    # Verify price and MSY metadata are distinct
    with open(os.path.join(PROCESSED_SPECIES_DIR, "rastrelliger", "rastrelliger_metadata.json")) as f:
        meta_rast = json.load(f)
    with open(os.path.join(PROCESSED_SPECIES_DIR, "upeneus", "upeneus_metadata.json")) as f:
        meta_upen = json.load(f)
        
    assert meta_rast["category"] == "Small Pelagic"
    assert meta_upen["category"] == "Demersal"
    assert meta_rast["schaefer_msy_kg"] != meta_upen["schaefer_msy_kg"]
