"""
CatchForecast AI - Species Data Preparation Pipeline (Phase 06)
Constructs three isolated, species-specific training datasets for:
1. Rastrelliger brachysoma (Kembung perempuan - Pelagic)
2. Selaroides leptolepis (Selar kuning - Pelagic)
3. Upeneus sulphureus (Kuniran - Demersal)
"""

import os
import sys
import json
import numpy as np
import pandas as pd

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
RAW_FISHERIES_DIR = os.path.join(BASE_DIR, "data", "raw", "fisheries")
PROCESSED_ENV_DIR = os.path.join(BASE_DIR, "data", "processed", "environmental")
PROCESSED_SPECIES_DIR = os.path.join(BASE_DIR, "data", "processed", "species")

# Species Configurations
SPECIES_CONFIGS = {
    "rastrelliger": {
        "species_id": "rastrelliger_brachysoma",
        "scientific_name": "Rastrelliger brachysoma",
        "local_name": "Kembung perempuan",
        "family": "Scombridae",
        "category": "Small Pelagic",
        "annual_volume_kg": 474922.0,
        "sample_price_idr": 24000.0,
        "relevant_gear_effort": 19819,
        "folder": "rastrelliger",
        "schaefer_msy_kg": 452113.0,
        "optimal_effort_trips": 19819
    },
    "selaroides": {
        "species_id": "selaroides_leptolepis",
        "scientific_name": "Selaroides leptolepis",
        "local_name": "Selar kuning",
        "family": "Carangidae",
        "category": "Small Pelagic",
        "annual_volume_kg": 36308.0,
        "sample_price_idr": 4846.0,
        "relevant_gear_effort": 19819,
        "folder": "selaroides",
        "schaefer_msy_kg": 288275.0,
        "optimal_effort_trips": 19819
    },
    "upeneus": {
        "species_id": "upeneus_sulphureus",
        "scientific_name": "Upeneus sulphureus",
        "local_name": "Kuniran",
        "family": "Mullidae",
        "category": "Demersal",
        "annual_volume_kg": 182175.0,
        "sample_price_idr": 2722.0,
        "relevant_gear_effort": 5618,
        "folder": "upeneus",
        "schaefer_msy_kg": 332759.0,
        "optimal_effort_trips": 5618
    }
}

def load_prerequisites():
    """Validates existence of Phase 03 and Phase 05 outputs."""
    env_features_path = os.path.join(PROCESSED_ENV_DIR, "teluk_banten_environmental_features_2026.csv")
    prod_path = os.path.join(RAW_FISHERIES_DIR, "ppn_karangantu_produksi_bulanan_2026.csv")
    
    if not os.path.exists(env_features_path):
        raise FileNotFoundError(f"Missing environmental features: {env_features_path}. Run Phase 05 first.")
    if not os.path.exists(prod_path):
        raise FileNotFoundError(f"Missing monthly fisheries production: {prod_path}. Run Phase 03 first.")
        
    df_env = pd.read_csv(env_features_path)
    df_prod = pd.read_csv(prod_path)
    return df_env, df_prod

def run_species_pipeline():
    """Executes species isolation, spatial feature joining, and dataset generation."""
    print("="*75)
    print("CATCHFORECAST AI — PHASE 06: SPECIES DATA PREPARATION PIPELINE")
    print("="*75)
    
    df_env, df_prod = load_prerequisites()
    
    # Filter only marine cells
    df_marine_env = df_env[df_env["is_marine"] == True].copy()
    print(f"[*] Loaded {len(df_marine_env)} marine environmental grid-month observations.")
    
    # Calculate monthly seasonal distribution factors from total landings curve
    m_map = {"Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "Mei": 5, "Jun": 6,
             "Jul": 7, "Agu": 8, "Sep": 9, "Okt": 10, "Nov": 11, "Des": 12}
    df_prod["month"] = df_prod["bulan"].map(m_map)
    df_valid_prod = df_prod[df_prod["volume_kg"] > 0].copy()
    
    total_valid_landings = df_valid_prod["volume_kg"].sum()
    df_valid_prod["seasonality_ratio"] = df_valid_prod["volume_kg"] / total_valid_landings
    seasonality_dict = dict(zip(df_valid_prod["month"], df_valid_prod["seasonality_ratio"]))
    
    results = {}
    
    for key, sp in SPECIES_CONFIGS.items():
        print(f"\n[*] Processing isolated dataset for: {sp['scientific_name']} ({sp['local_name']})...")
        out_folder = os.path.join(PROCESSED_SPECIES_DIR, sp["folder"])
        os.makedirs(out_folder, exist_ok=True)
        
        species_records = []
        monthly_effort_proxy = sp["relevant_gear_effort"] / 12.0
        
        for m in range(1, 12):  # Jan to Nov
            ratio = seasonality_dict.get(m, 1.0 / 11.0)
            month_total_catch = sp["annual_volume_kg"] * ratio
            
            # Sub-table for this month
            m_cells = df_marine_env[df_marine_env["month"] == m].copy()
            n_cells = len(m_cells)
            
            # Ecological weighting function:
            if sp["category"] == "Small Pelagic":
                # Pelagic prefers optimal temperature (28-29.5°C) and strong thermal fronts
                sst = m_cells["sst_celsius"].values
                front = m_cells["thermal_front_c_per_km"].fillna(0).values
                # Weight = exp(-((sst - 28.8)**2)/1.5) * (1.0 + front * 3.0)
                weights = np.exp(-((sst - 28.8)**2) / 1.5) * (1.0 + front * 3.0)
            else:
                # Demersal prefers depth between 12m and 30m and gentle slope (<2 deg)
                depth = m_cells["bathymetry_depth_m"].values
                slope = m_cells["bathymetry_slope_deg"].values
                weights = np.exp(-((depth - 20.0)**2) / 50.0) / (1.0 + slope * 0.5)
                
            weights = np.maximum(weights, 1e-4)
            normalized_weights = weights / weights.sum()
            
            # Allocated catch per cell (sum exactly equals month_total_catch)
            cell_catch_kg = np.round(normalized_weights * month_total_catch, 2)
            cell_cpue = np.round(cell_catch_kg / (monthly_effort_proxy / n_cells), 3)
            
            for idx, (_, cell_row) in enumerate(m_cells.iterrows()):
                species_records.append({
                    "species_id": sp["species_id"],
                    "scientific_name": sp["scientific_name"],
                    "local_name": sp["local_name"],
                    "category": sp["category"],
                    "family": sp["family"],
                    "cell_id": cell_row["cell_id"],
                    "year": cell_row["year"],
                    "month": cell_row["month"],
                    "lat": cell_row["lat"],
                    "lon": cell_row["lon"],
                    # Environmental Predictors (X)
                    "sst_celsius": cell_row["sst_celsius"],
                    "thermal_front_c_per_km": cell_row["thermal_front_c_per_km"],
                    "chlorophyll_a_mg_m3": cell_row["chlorophyll_a_mg_m3"],
                    "bathymetry_depth_m": cell_row["bathymetry_depth_m"],
                    "bathymetry_slope_deg": cell_row["bathymetry_slope_deg"],
                    "dist_to_shore_km": cell_row["dist_to_shore_km"],
                    "dist_to_port_km": cell_row["dist_to_port_km"],
                    # Target Variables (Y)
                    "catch_weight_kg": cell_catch_kg[idx],
                    "cpue_kg_per_unit_effort": cell_cpue[idx],
                    "total_month_catch_kg": round(month_total_catch, 2),
                    "is_complete": True
                })
                
        df_sp = pd.DataFrame(species_records)
        out_csv = os.path.join(out_folder, f"{sp['folder']}_monthly_features.csv")
        df_sp.to_csv(out_csv, index=False)
        print(f"    -> Saved {len(df_sp)} observations to: {out_csv}")
        
        # Save Metadata
        sp_metadata = {
            "species_id": sp["species_id"],
            "scientific_name": sp["scientific_name"],
            "local_name": sp["local_name"],
            "family": sp["family"],
            "category": sp["category"],
            "annual_volume_kg_2026": sp["annual_volume_kg"],
            "sample_price_idr_per_kg": sp["sample_price_idr"],
            "gear_effort_group_annual": sp["relevant_gear_effort"],
            "schaefer_msy_kg": sp["schaefer_msy_kg"],
            "optimal_effort_trips": sp["optimal_effort_trips"],
            "total_observations": len(df_sp),
            "months_covered": 11,
            "target_variables": ["catch_weight_kg", "cpue_kg_per_unit_effort"],
            "predictor_variables": [
                "sst_celsius", "thermal_front_c_per_km", "chlorophyll_a_mg_m3",
                "bathymetry_depth_m", "bathymetry_slope_deg", "dist_to_shore_km", "dist_to_port_km"
            ]
        }
        meta_json_path = os.path.join(out_folder, f"{sp['folder']}_metadata.json")
        with open(meta_json_path, "w", encoding="utf-8") as f:
            json.dump(sp_metadata, f, indent=2)
            
        results[key] = {
            "csv_path": out_csv,
            "rows": len(df_sp),
            "sum_allocated_catch": round(df_sp["catch_weight_kg"].sum(), 1)
        }
        
    print("\n" + "="*75)
    print("PHASE 06 SUMMARY — SPECIES DATASET PREPARATION")
    print("="*75)
    for k, v in results.items():
        print(f"[*] {k.upper():<15} | Rows: {v['rows']:<6} | Sum Catch Allocated: {v['sum_allocated_catch']:,.1f} kg")
    print("="*75 + "\n")
    return results

if __name__ == "__main__":
    run_species_pipeline()
