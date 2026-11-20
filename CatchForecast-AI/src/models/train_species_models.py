"""
CatchForecast AI - Species Machine Learning Training Pipeline (Phase 08 - Refined)
Trains independent regression models for 3 target species:
1. Rastrelliger brachysoma (Pelagic)
2. Selaroides leptolepis (Pelagic)
3. Upeneus sulphureus (Demersal)

Evaluates:
- Temporal Holdout (Train Months 1-8, Test Months 9-11)
- Spatial Holdout (Train 80% grid cells, Test 20% grid cells)
- Predictor features including oceanographic variables + seasonal cycle (month_sin, month_cos).
- Models: Dummy, Ridge, Random Forest, Gradient Boosting.
"""

import os
import sys
import json
import time
from datetime import datetime, timezone
import numpy as np
import pandas as pd
import joblib

from sklearn.dummy import DummyRegressor
from sklearn.linear_model import Ridge
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import r2_score, mean_absolute_error, root_mean_squared_error

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
PROCESSED_SPECIES_DIR = os.path.join(BASE_DIR, "data", "processed", "species")
MODELS_DIR = os.path.join(BASE_DIR, "models")

SPECIES_CONFIGS = [
    {
        "key": "rastrelliger",
        "name": "Rastrelliger brachysoma",
        "local": "Kembung perempuan",
        "type": "Pelagic"
    },
    {
        "key": "selaroides",
        "name": "Selaroides leptolepis",
        "local": "Selar kuning",
        "type": "Pelagic"
    },
    {
        "key": "upeneus",
        "name": "Upeneus sulphureus",
        "local": "Kuniran",
        "type": "Demersal"
    }
]

BASE_FEATURES = [
    "sst_celsius",
    "thermal_front_c_per_km",
    "chlorophyll_a_mg_m3",
    "bathymetry_depth_m",
    "bathymetry_slope_deg",
    "dist_to_shore_km",
    "dist_to_port_km"
]

TARGET_COL = "catch_weight_kg"

def add_engineered_features(df):
    """Add seasonal cyclical features to represent annual monsoon dynamics."""
    df = df.copy()
    df["month_sin"] = np.sin(2 * np.pi * df["month"] / 12.0)
    df["month_cos"] = np.cos(2 * np.pi * df["month"] / 12.0)
    return df

def train_and_evaluate_species(species_cfg):
    key = species_cfg["key"]
    name = species_cfg["name"]
    print(f"\n{'='*70}")
    print(f"Training Pipeline for Species: {name} ({species_cfg['local']} - {species_cfg['type']})")
    print(f"{'='*70}")
    
    # 1. Load Data
    csv_path = os.path.join(PROCESSED_SPECIES_DIR, key, f"{key}_monthly_features.csv")
    df = pd.read_csv(csv_path)
    df = add_engineered_features(df)
    
    feature_cols = BASE_FEATURES + ["month_sin", "month_cos"]
    
    # 2. Dual Validation Schemes:
    # A) Temporal Holdout: Train Months 1-8, Test Months 9-11
    train_mask_temp = df["month"] <= 8
    test_mask_temp = df["month"] >= 9
    
    # B) Spatial Block Holdout: 80% cells train, 20% cells holdout
    np.random.seed(42)
    unique_cells = df["cell_id"].unique()
    np.random.shuffle(unique_cells)
    n_train_cells = int(len(unique_cells) * 0.8)
    train_cells = set(unique_cells[:n_train_cells])
    test_cells = set(unique_cells[n_train_cells:])
    
    spatial_train_mask = df["cell_id"].isin(train_cells)
    spatial_test_mask = df["cell_id"].isin(test_cells)
    
    print(f"Dataset summary: Total records = {len(df)}")
    print(f"  Temporal Holdout Split: Train = {train_mask_temp.sum()} (M1-8), Test = {test_mask_temp.sum()} (M9-11)")
    print(f"  Spatial Holdout Split:  Train = {spatial_train_mask.sum()} ({len(train_cells)} cells), Test = {spatial_test_mask.sum()} ({len(test_cells)} cells)")
    
    # Model Candidates definition
    def get_fresh_candidates():
        return {
            "Dummy_Mean": DummyRegressor(strategy="mean"),
            "Ridge_Regression": Pipeline([
                ("scaler", StandardScaler()),
                ("regressor", Ridge(alpha=10.0, random_state=42))
            ]),
            "Random_Forest": RandomForestRegressor(
                n_estimators=100,
                max_depth=12,
                min_samples_split=5,
                min_samples_leaf=2,
                random_state=42,
                n_jobs=-1
            ),
            "Gradient_Boosting": GradientBoostingRegressor(
                n_estimators=150,
                max_depth=5,
                learning_rate=0.08,
                subsample=0.85,
                random_state=42
            )
        }
    
    # --- EVALUATE TEMPORAL HOLDOUT ---
    print("\n[A] Evaluating Temporal Holdout Split (Months 1-8 -> Months 9-11):")
    X_train_t = df.loc[train_mask_temp, feature_cols]
    y_train_t = df.loc[train_mask_temp, TARGET_COL]
    X_test_t = df.loc[test_mask_temp, feature_cols]
    y_test_t = df.loc[test_mask_temp, TARGET_COL]
    
    temporal_results = {}
    temporal_models = {}
    for m_name, model in get_fresh_candidates().items():
        t0 = time.time()
        model.fit(X_train_t, y_train_t)
        fit_time = time.time() - t0
        y_pred = np.maximum(model.predict(X_test_t), 0.0)
        
        r2 = float(r2_score(y_test_t, y_pred))
        mae = float(mean_absolute_error(y_test_t, y_pred))
        rmse = float(root_mean_squared_error(y_test_t, y_pred))
        rel_mae = float((mae / y_test_t.mean()) * 100.0)
        
        temporal_results[m_name] = {
            "r2_score": round(r2, 4),
            "mae_kg": round(mae, 3),
            "rmse_kg": round(rmse, 3),
            "relative_mae_percent": round(rel_mae, 2),
            "fit_time_seconds": round(fit_time, 3)
        }
        temporal_models[m_name] = model
        print(f"  [{m_name:<18}] R²: {r2:6.4f} | MAE: {mae:7.2f} kg | RMSE: {rmse:7.2f} kg | Rel Error: {rel_mae:5.2f}%")
        
    # --- EVALUATE SPATIAL HOLDOUT ---
    print("\n[B] Evaluating Spatial Holdout Split (80% Grid Cells -> 20% Unseen Cells):")
    X_train_s = df.loc[spatial_train_mask, feature_cols]
    y_train_s = df.loc[spatial_train_mask, TARGET_COL]
    X_test_s = df.loc[spatial_test_mask, feature_cols]
    y_test_s = df.loc[spatial_test_mask, TARGET_COL]
    
    spatial_results = {}
    spatial_models = {}
    for m_name, model in get_fresh_candidates().items():
        t0 = time.time()
        model.fit(X_train_s, y_train_s)
        fit_time = time.time() - t0
        y_pred = np.maximum(model.predict(X_test_s), 0.0)
        
        r2 = float(r2_score(y_test_s, y_pred))
        mae = float(mean_absolute_error(y_test_s, y_pred))
        rmse = float(root_mean_squared_error(y_test_s, y_pred))
        rel_mae = float((mae / y_test_s.mean()) * 100.0)
        
        spatial_results[m_name] = {
            "r2_score": round(r2, 4),
            "mae_kg": round(mae, 3),
            "rmse_kg": round(rmse, 3),
            "relative_mae_percent": round(rel_mae, 2),
            "fit_time_seconds": round(fit_time, 3)
        }
        spatial_models[m_name] = model
        print(f"  [{m_name:<18}] R²: {r2:6.4f} | MAE: {mae:7.2f} kg | RMSE: {rmse:7.2f} kg | Rel Error: {rel_mae:5.2f}%")
        
    # --- SELECT CHAMPION MODEL ---
    # Champion based on Spatial Holdout (or best overall generalizer)
    best_m_name = max(spatial_results.keys(), key=lambda k: spatial_results[k]["r2_score"])
    champion_model = spatial_models[best_m_name]
    print(f"\nChampion Model Selected: {best_m_name} (Spatial R² = {spatial_results[best_m_name]['r2_score']:.4f})")
    
    # Feature Importances
    feature_importances = {}
    if hasattr(champion_model, "feature_importances_"):
        fi_vals = champion_model.feature_importances_
        feature_importances = {feat: round(float(val), 4) for feat, val in zip(feature_cols, fi_vals)}
    elif hasattr(champion_model, "named_steps") and hasattr(champion_model.named_steps["regressor"], "coef_"):
        fi_vals = np.abs(champion_model.named_steps["regressor"].coef_)
        total = np.sum(fi_vals) if np.sum(fi_vals) > 0 else 1.0
        feature_importances = {feat: round(float(val / total), 4) for feat, val in zip(feature_cols, fi_vals)}
        
    print(f"Feature Importances: {feature_importances}")
    
    # Save Model Artifacts
    target_dir = os.path.join(MODELS_DIR, key)
    os.makedirs(target_dir, exist_ok=True)
    
    model_save_path = os.path.join(target_dir, f"{key}_best_model.joblib")
    joblib.dump(champion_model, model_save_path)
    print(f"Saved champion model to: {model_save_path}")
    
    metadata = {
        "species_id": key,
        "scientific_name": name,
        "local_name": species_cfg["local"],
        "category": species_cfg["type"],
        "champion_model_architecture": best_m_name,
        "training_timestamp_utc": datetime.now(timezone.utc).isoformat(),
        "feature_columns": feature_cols,
        "target_column": TARGET_COL,
        "target_unit": "kg / km² / month",
        "spatial_holdout_metrics": spatial_results[best_m_name],
        "temporal_holdout_metrics": temporal_results.get(best_m_name, {}),
        "all_spatial_candidates": spatial_results,
        "all_temporal_candidates": temporal_results,
        "feature_importances": feature_importances,
        "data_leakage_safeguards": [
            "Spatial block holdout isolating 20% unseen Teluk Banten cells",
            "Temporal holdout split isolating unseen post-upwelling months",
            "Preprocessing pipelines fit strictly on training partitions",
            "Strict species isolation with zero cross-species leakage"
        ]
    }
    
    meta_save_path = os.path.join(target_dir, "model_metadata.json")
    with open(meta_save_path, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"Saved metadata to: {meta_save_path}")
    
    return {
        "key": key,
        "champion": best_m_name,
        "spatial_metrics": spatial_results[best_m_name],
        "temporal_metrics": temporal_results.get(best_m_name, {}),
        "feature_importances": feature_importances
    }

def main():
    print("="*70)
    print("CatchForecast AI — Phase 08: Machine Learning Development")
    print("Dual Validation Protocol: Spatial Holdout & Temporal Holdout")
    print("="*70)
    
    all_experiments = {}
    for sp_cfg in SPECIES_CONFIGS:
        exp_res = train_and_evaluate_species(sp_cfg)
        all_experiments[sp_cfg["key"]] = exp_res
        
    summary_path = os.path.join(BASE_DIR, "docs", "ml_experiments_summary.json")
    with open(summary_path, "w") as f:
        json.dump(all_experiments, f, indent=2)
    print(f"\nAll models trained and verified. Global summary: {summary_path}")

if __name__ == "__main__":
    main()
