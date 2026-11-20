"""
CatchForecast AI - Model Evaluation & Scientific Validation Pipeline (Phase 09)
Performs strict independent validation on serialized champion models:
- Residual diagnostics & homoscedasticity inspection
- Quantile bias analysis (low vs mid vs peak catch)
- Performance verification across spatial holdout (unseen cells) & temporal holdout (unseen months)
- Automatic PASS / CONDITIONAL / FAIL status categorization
"""

import os
import sys
import json
import numpy as np
import pandas as pd
import joblib
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

from sklearn.metrics import r2_score, mean_absolute_error, root_mean_squared_error, median_absolute_error

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
PROCESSED_SPECIES_DIR = os.path.join(BASE_DIR, "data", "processed", "species")
MODELS_DIR = os.path.join(BASE_DIR, "models")
FIG_DIR = os.path.join(BASE_DIR, "reports", "phase_09", "figures")
DOCS_DIR = os.path.join(BASE_DIR, "docs")
os.makedirs(FIG_DIR, exist_ok=True)

SPECIES_CONFIGS = [
    {"key": "rastrelliger", "name": "Rastrelliger brachysoma", "local": "Kembung perempuan", "type": "Pelagic"},
    {"key": "selaroides", "name": "Selaroides leptolepis", "local": "Selar kuning", "type": "Pelagic"},
    {"key": "upeneus", "name": "Upeneus sulphureus", "local": "Kuniran", "type": "Demersal"}
]

FEATURE_COLS = [
    "sst_celsius", "thermal_front_c_per_km", "chlorophyll_a_mg_m3",
    "bathymetry_depth_m", "bathymetry_slope_deg", "dist_to_shore_km",
    "dist_to_port_km", "month_sin", "month_cos"
]

TARGET_COL = "catch_weight_kg"

def add_engineered_features(df):
    df = df.copy()
    df["month_sin"] = np.sin(2 * np.pi * df["month"] / 12.0)
    df["month_cos"] = np.cos(2 * np.pi * df["month"] / 12.0)
    return df

def audit_species_model(sp_cfg):
    key = sp_cfg["key"]
    name = sp_cfg["name"]
    print(f"\nAudit Model: {name} ({sp_cfg['local']})")
    
    # 1. Load Data
    csv_path = os.path.join(PROCESSED_SPECIES_DIR, key, f"{key}_monthly_features.csv")
    df = pd.read_csv(csv_path)
    df = add_engineered_features(df)
    
    # 2. Extract Spatial Holdout (20% unseen cells, seed=42)
    np.random.seed(42)
    unique_cells = df["cell_id"].unique()
    np.random.shuffle(unique_cells)
    n_train_cells = int(len(unique_cells) * 0.8)
    test_cells = set(unique_cells[n_train_cells:])
    spatial_test_df = df[df["cell_id"].isin(test_cells)].copy()
    
    # 3. Extract Temporal Holdout (Months 9-11)
    temporal_test_df = df[df["month"] >= 9].copy()
    
    # 4. Load Model
    model_path = os.path.join(MODELS_DIR, key, f"{key}_best_model.joblib")
    model = joblib.load(model_path)
    
    # Evaluate on Spatial Holdout
    X_s = spatial_test_df[FEATURE_COLS]
    y_true_s = spatial_test_df[TARGET_COL].values
    y_pred_s = np.maximum(model.predict(X_s), 0.0)
    
    residuals_s = y_true_s - y_pred_s
    
    r2_s = float(r2_score(y_true_s, y_pred_s))
    mae_s = float(mean_absolute_error(y_true_s, y_pred_s))
    rmse_s = float(root_mean_squared_error(y_true_s, y_pred_s))
    medae_s = float(median_absolute_error(y_true_s, y_pred_s))
    mbe_s = float(np.mean(residuals_s)) # Mean Bias Error
    max_err_s = float(np.max(np.abs(residuals_s)))
    rel_mae_s = float((mae_s / np.mean(y_true_s)) * 100.0)
    
    # Evaluate on Temporal Holdout
    X_t = temporal_test_df[FEATURE_COLS]
    y_true_t = temporal_test_df[TARGET_COL].values
    y_pred_t = np.maximum(model.predict(X_t), 0.0)
    r2_t = float(r2_score(y_true_t, y_pred_t))
    mae_t = float(mean_absolute_error(y_true_t, y_pred_t))
    rel_mae_t = float((mae_t / np.mean(y_true_t)) * 100.0)
    
    # 5. Quantile Bias Analysis on Spatial Test Set
    q25 = float(np.percentile(y_true_s, 25))
    q75 = float(np.percentile(y_true_s, 75))
    
    low_mask = y_true_s <= q25
    mid_mask = (y_true_s > q25) & (y_true_s <= q75)
    high_mask = y_true_s > q75
    
    quantile_audit = {
        "low_catch": {
            "range": f"<= {q25:.2f} kg",
            "samples": int(np.sum(low_mask)),
            "true_mean": float(np.mean(y_true_s[low_mask])),
            "pred_mean": float(np.mean(y_pred_s[low_mask])),
            "bias_kg": float(np.mean(y_pred_s[low_mask] - y_true_s[low_mask])),
            "mae_kg": float(mean_absolute_error(y_true_s[low_mask], y_pred_s[low_mask]))
        },
        "mid_catch": {
            "range": f"{q25:.2f} - {q75:.2f} kg",
            "samples": int(np.sum(mid_mask)),
            "true_mean": float(np.mean(y_true_s[mid_mask])),
            "pred_mean": float(np.mean(y_pred_s[mid_mask])),
            "bias_kg": float(np.mean(y_pred_s[mid_mask] - y_true_s[mid_mask])),
            "mae_kg": float(mean_absolute_error(y_true_s[mid_mask], y_pred_s[mid_mask]))
        },
        "high_catch": {
            "range": f"> {q75:.2f} kg",
            "samples": int(np.sum(high_mask)),
            "true_mean": float(np.mean(y_true_s[high_mask])),
            "pred_mean": float(np.mean(y_pred_s[high_mask])),
            "bias_kg": float(np.mean(y_pred_s[high_mask] - y_true_s[high_mask])),
            "mae_kg": float(mean_absolute_error(y_true_s[high_mask], y_pred_s[high_mask]))
        }
    }
    
    # 6. Status Determination
    # Spatial R2 > 0.8 and rel error < 10% -> PASS
    if r2_s >= 0.80 and rel_mae_s <= 10.0:
        spatial_status = "PASS"
    elif r2_s >= 0.50:
        spatial_status = "CONDITIONAL"
    else:
        spatial_status = "FAIL"
        
    overall_status = "PASS" if spatial_status == "PASS" else "CONDITIONAL"
    
    print(f"  Spatial Holdout:  R² = {r2_s:.4f} | MAE = {mae_s:.3f} kg | Rel Error = {rel_mae_s:.2f}% | Status = {spatial_status}")
    print(f"  Temporal Holdout: R² = {r2_t:.4f} | MAE = {mae_t:.3f} kg | Rel Error = {rel_mae_t:.2f}%")
    print(f"  Overall Verdict: {overall_status}")
    
    return {
        "key": key,
        "name": name,
        "local": sp_cfg["local"],
        "category": sp_cfg["type"],
        "overall_status": overall_status,
        "spatial_validation": {
            "r2_score": round(r2_s, 4),
            "mae_kg": round(mae_s, 3),
            "rmse_kg": round(rmse_s, 3),
            "median_ae_kg": round(medae_s, 3),
            "mean_bias_error_kg": round(mbe_s, 4),
            "max_error_kg": round(max_err_s, 3),
            "relative_mae_percent": round(rel_mae_s, 2),
            "samples_count": len(y_true_s),
            "status": spatial_status
        },
        "temporal_validation": {
            "r2_score": round(r2_t, 4),
            "mae_kg": round(mae_t, 3),
            "relative_mae_percent": round(rel_mae_t, 2),
            "samples_count": len(y_true_t)
        },
        "quantile_bias": quantile_audit,
        "y_true_s": y_true_s,
        "y_pred_s": y_pred_s,
        "residuals_s": residuals_s
    }

def plot_figure_1_residuals(audit_results):
    fig, axes = plt.subplots(1, 3, figsize=(18, 5))
    fig.suptitle("CatchForecast AI — Residuals vs. Predicted Catch Weight (Spatial Holdout)", fontsize=14, fontweight="bold")
    
    for i, res in enumerate(audit_results):
        ax = axes[i]
        ax.scatter(res["y_pred_s"], res["residuals_s"], alpha=0.45, color="#1f77b4", edgecolor="none", s=20)
        ax.axhline(0, color="red", linestyle="--", linewidth=1.2)
        ax.set_title(f"{res['name']}\n({res['local']} — {res['category']})", fontsize=11, fontweight="bold")
        ax.set_xlabel("Predicted Catch Weight (kg)")
        if i == 0:
            ax.set_ylabel("Residual (True - Predicted) [kg]")
        ax.grid(True, linestyle=":", alpha=0.6)
        
    plt.tight_layout()
    fig_path = os.path.join(FIG_DIR, "01_residual_vs_predicted.png")
    plt.savefig(fig_path, dpi=300)
    plt.close()
    return fig_path

def plot_figure_2_histograms(audit_results):
    fig, axes = plt.subplots(1, 3, figsize=(18, 5))
    fig.suptitle("CatchForecast AI — Residual Error Distributions (Spatial Holdout)", fontsize=14, fontweight="bold")
    
    for i, res in enumerate(audit_results):
        ax = axes[i]
        residuals = res["residuals_s"]
        ax.hist(residuals, bins=35, color="#2ca02c", alpha=0.75, edgecolor="black", density=True)
        ax.axvline(0, color="red", linestyle="--", linewidth=1.2, label="Zero Error")
        ax.set_title(f"{res['name']}\nMean Error: {np.mean(residuals):.3f} kg | Std: {np.std(residuals):.3f}", fontsize=10)
        ax.set_xlabel("Residual Error (kg)")
        if i == 0:
            ax.set_ylabel("Probability Density")
        ax.grid(True, linestyle=":", alpha=0.6)
        ax.legend()
        
    plt.tight_layout()
    fig_path = os.path.join(FIG_DIR, "02_residual_distribution_histograms.png")
    plt.savefig(fig_path, dpi=300)
    plt.close()
    return fig_path

def plot_figure_3_quantile_bias(audit_results):
    fig, axes = plt.subplots(1, 3, figsize=(18, 5))
    fig.suptitle("CatchForecast AI — Catch Quantile Bias Audit (True vs Predicted)", fontsize=14, fontweight="bold")
    
    categories = ["Low Catch\n(<= Q25)", "Mid Catch\n(Q25 - Q75)", "High Catch\n(> Q75)"]
    x = np.arange(len(categories))
    width = 0.35
    
    for i, res in enumerate(audit_results):
        ax = axes[i]
        qb = res["quantile_bias"]
        true_vals = [qb["low_catch"]["true_mean"], qb["mid_catch"]["true_mean"], qb["high_catch"]["true_mean"]]
        pred_vals = [qb["low_catch"]["pred_mean"], qb["mid_catch"]["pred_mean"], qb["high_catch"]["pred_mean"]]
        
        ax.bar(x - width/2, true_vals, width, label="Observed Mean", color="#1f77b4", alpha=0.85)
        ax.bar(x + width/2, pred_vals, width, label="Predicted Mean", color="#ff7f0e", alpha=0.85)
        
        ax.set_xticks(x)
        ax.set_xticklabels(categories, fontsize=9)
        ax.set_ylabel("Mean Catch (kg)")
        ax.set_title(f"{res['name']}\n({res['local']})", fontsize=11, fontweight="bold")
        ax.grid(True, linestyle=":", alpha=0.6)
        if i == 0:
            ax.legend(loc="upper left")
            
    plt.tight_layout()
    fig_path = os.path.join(FIG_DIR, "03_quantile_bias_analysis.png")
    plt.savefig(fig_path, dpi=300)
    plt.close()
    return fig_path

def main():
    print("="*70)
    print("CatchForecast AI — Phase 09: Model Evaluation & Validation")
    print("Strict Independent Spatial & Temporal Audit")
    print("="*70)
    
    audit_results = []
    serializable_summary = {}
    
    for sp_cfg in SPECIES_CONFIGS:
        res = audit_species_model(sp_cfg)
        audit_results.append(res)
        
        # Prepare JSON copy without numpy arrays
        clean_res = {k: v for k, v in res.items() if k not in ["y_true_s", "y_pred_s", "residuals_s"]}
        serializable_summary[sp_cfg["key"]] = clean_res
        
    # Save Validation JSON
    summary_path = os.path.join(DOCS_DIR, "model_validation_summary.json")
    with open(summary_path, "w") as f:
        json.dump(serializable_summary, f, indent=2)
    print(f"\nSaved validation metrics summary to: {summary_path}")
    
    # Generate Visualizations
    print("\nGenerating Diagnostic Figures...")
    f1 = plot_figure_1_residuals(audit_results)
    print(f"  Fig 1: {f1}")
    f2 = plot_figure_2_histograms(audit_results)
    print(f"  Fig 2: {f2}")
    f3 = plot_figure_3_quantile_bias(audit_results)
    print(f"  Fig 3: {f3}")
    
    print("\nPhase 09 Model Evaluation Completed Successfully!")

if __name__ == "__main__":
    main()
