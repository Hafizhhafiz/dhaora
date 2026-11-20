"""
CatchForecast AI - Exploratory Data Analysis (EDA) Pipeline (Phase 07)
Performs comprehensive statistical profiling, correlation analysis, VIF calculation,
spatial autocorrelation (Moran's I), and figure generation for:
1. Rastrelliger brachysoma (Kembung perempuan - Pelagic)
2. Selaroides leptolepis (Selar kuning - Pelagic)
3. Upeneus sulphureus (Kuniran - Demersal)
"""

import os
import sys
import json
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg") # Non-interactive backend
import matplotlib.pyplot as plt

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
PROCESSED_SPECIES_DIR = os.path.join(BASE_DIR, "data", "processed", "species")
OUTPUT_FIG_DIR = os.path.join(BASE_DIR, "reports", "phase_07", "figures")
OUTPUT_DOCS_DIR = os.path.join(BASE_DIR, "docs")
os.makedirs(OUTPUT_FIG_DIR, exist_ok=True)

SPECIES_CONFIGS = [
    {"key": "rastrelliger", "name": "Rastrelliger brachysoma", "local": "Kembung perempuan", "type": "Pelagic"},
    {"key": "selaroides", "name": "Selaroides leptolepis", "local": "Selar kuning", "type": "Pelagic"},
    {"key": "upeneus", "name": "Upeneus sulphureus", "local": "Kuniran", "type": "Demersal"}
]

ENV_FEATURES = [
    "sst_celsius", "thermal_front_c_per_km", "chlorophyll_a_mg_m3",
    "bathymetry_depth_m", "bathymetry_slope_deg", "dist_to_shore_km", "dist_to_port_km"
]

def load_species_datasets():
    datasets = {}
    for sp in SPECIES_CONFIGS:
        csv_path = os.path.join(PROCESSED_SPECIES_DIR, sp["key"], f"{sp['key']}_monthly_features.csv")
        df = pd.read_csv(csv_path)
        datasets[sp["key"]] = df
    return datasets

def compute_vif_matrix(df, features):
    """Compute Variance Inflation Factor (VIF) using inverse correlation matrix."""
    X = df[features].dropna().values
    # Standardize
    X_std = (X - X.mean(axis=0)) / (X.std(axis=0) + 1e-12)
    # Correlation matrix
    corr_matrix = np.corrcoef(X_std, rowvar=False)
    # Invert correlation matrix
    try:
        inv_corr = np.linalg.inv(corr_matrix)
        vifs = {feat: float(inv_corr[i, i]) for i, feat in enumerate(features)}
    except np.linalg.LinAlgError:
        vifs = {feat: float("nan") for feat in features}
    return vifs

def compute_morans_i(df_sub, value_col="catch_weight_kg", max_dist_km=2.0):
    """
    Computes Moran's I spatial autocorrelation on marine grid cells.
    Distance calculated via Euclidean approximation on lat/lon (1 deg ~ 111 km).
    """
    lons = df_sub["lon"].values
    lats = df_sub["lat"].values
    x = df_sub[value_col].values
    n = len(x)
    
    dx = (lons[:, None] - lons[None, :]) * 111.0 * np.cos(np.radians(-6.0))
    dy = (lats[:, None] - lats[None, :]) * 111.0
    dist = np.sqrt(dx**2 + dy**2)
    
    # Adjacency weight matrix: 1 if dist <= max_dist_km and dist > 0
    w = ((dist <= max_dist_km) & (dist > 0)).astype(float)
    w_sum = w.sum()
    if w_sum == 0:
        return 0.0
    
    x_diff = x - x.mean()
    var_x = np.sum(x_diff**2)
    if var_x == 0:
        return 0.0
    
    numerator = np.sum(w * np.outer(x_diff, x_diff))
    moran_i = (n / w_sum) * (numerator / var_x)
    return float(moran_i)

def run_statistical_audit(datasets):
    audit_summary = {}
    
    for sp in SPECIES_CONFIGS:
        key = sp["key"]
        df = datasets[key]
        
        # Target stats
        catch = df["catch_weight_kg"]
        cpue = df["cpue_kg_per_unit_effort"]
        
        # VIF
        vifs = compute_vif_matrix(df, ENV_FEATURES)
        
        # Pearson & Spearman correlations with catch
        pearson_corr = {f: float(df[f].corr(catch, method="pearson")) for f in ENV_FEATURES}
        spearman_corr = {f: float(df[f].corr(catch, method="spearman")) for f in ENV_FEATURES}
        
        # Moran's I for peak month (Month 8 - August Upwelling)
        df_aug = df[df["month"] == 8].copy()
        moran_aug = compute_morans_i(df_aug, "catch_weight_kg")
        
        audit_summary[key] = {
            "name": sp["name"],
            "type": sp["type"],
            "records": len(df),
            "catch_mean": float(catch.mean()),
            "catch_std": float(catch.std()),
            "catch_median": float(catch.median()),
            "catch_iqr": float(catch.quantile(0.75) - catch.quantile(0.25)),
            "catch_min": float(catch.min()),
            "catch_max": float(catch.max()),
            "cpue_mean": float(cpue.mean()),
            "cpue_std": float(cpue.std()),
            "cpue_max": float(cpue.max()),
            "morans_i_august": moran_aug,
            "vif": vifs,
            "pearson_corr": pearson_corr,
            "spearman_corr": spearman_corr
        }
        
    return audit_summary

def plot_figure_1_catch_distributions(datasets):
    """Plot Fig 1: Target Catch and CPUE distributions."""
    fig, axes = plt.subplots(2, 3, figsize=(16, 9))
    fig.suptitle("CatchForecast AI — Target Distributions (Catch Weight & CPUE)\nTeluk Banten (11 Months x 798 Marine Cells)", fontsize=14, fontweight="bold")
    
    colors = {"rastrelliger": "#1f77b4", "selaroides": "#ff7f0e", "upeneus": "#2ca02c"}
    
    for i, sp in enumerate(SPECIES_CONFIGS):
        key = sp["key"]
        df = datasets[key]
        
        # Row 0: Catch Weight
        ax_c = axes[0, i]
        ax_c.hist(df["catch_weight_kg"], bins=35, color=colors[key], alpha=0.75, edgecolor="black")
        ax_c.set_title(f"{sp['name']}\nCatch Weight (Mean: {df['catch_weight_kg'].mean():.1f} kg)", fontsize=11)
        ax_c.set_xlabel("Catch Weight (kg / cell / month)")
        ax_c.set_ylabel("Frequency")
        ax_c.grid(True, linestyle="--", alpha=0.5)
        
        # Row 1: CPUE
        ax_p = axes[1, i]
        ax_p.hist(df["cpue_kg_per_unit_effort"], bins=35, color=colors[key], alpha=0.75, edgecolor="black")
        ax_p.set_title(f"CPUE (Mean: {df['cpue_kg_per_unit_effort'].mean():.2f} kg/trip)", fontsize=11)
        ax_p.set_xlabel("CPUE (kg / trip)")
        ax_p.set_ylabel("Frequency")
        ax_p.grid(True, linestyle="--", alpha=0.5)
        
    plt.tight_layout()
    fig_path = os.path.join(OUTPUT_FIG_DIR, "01_species_catch_distributions.png")
    plt.savefig(fig_path, dpi=300)
    plt.close()
    return fig_path

def plot_figure_2_environmental_features(datasets):
    """Plot Fig 2: Environmental predictor distributions."""
    df_any = datasets["rastrelliger"]
    fig, axes = plt.subplots(2, 4, figsize=(18, 9))
    fig.suptitle("CatchForecast AI — Environmental Predictors Distribution in Teluk Banten", fontsize=14, fontweight="bold")
    
    axes_flat = axes.flatten()
    feat_labels = [
        ("sst_celsius", "Sea Surface Temp (°C)", "#d62728"),
        ("thermal_front_c_per_km", "Thermal Front Gradient (°C/km)", "#e377c2"),
        ("chlorophyll_a_mg_m3", "Chlorophyll-a (mg/m³)", "#2ca02c"),
        ("bathymetry_depth_m", "Bathymetry Depth (m)", "#1f77b4"),
        ("bathymetry_slope_deg", "Seafloor Slope (deg)", "#bcbd22"),
        ("dist_to_shore_km", "Distance to Shore (km)", "#8c564b"),
        ("dist_to_port_km", "Distance to Karangantu Port (km)", "#7f7f7f")
    ]
    
    for i, (feat, label, col) in enumerate(feat_labels):
        ax = axes_flat[i]
        vals = df_any[feat]
        ax.hist(vals, bins=30, color=col, alpha=0.8, edgecolor="black")
        ax.set_title(f"{label}\nMean: {vals.mean():.2f} ± {vals.std():.2f}", fontsize=10)
        ax.set_xlabel("Value")
        ax.set_ylabel("Frequency")
        ax.grid(True, linestyle="--", alpha=0.5)
        
    # Remove unused 8th subplot
    fig.delaxes(axes_flat[7])
    plt.tight_layout()
    fig_path = os.path.join(OUTPUT_FIG_DIR, "02_environmental_feature_distributions.png")
    plt.savefig(fig_path, dpi=300)
    plt.close()
    return fig_path

def plot_figure_3_correlation_heatmaps(audit):
    """Plot Fig 3: Pearson and Spearman Correlation Bar Charts per Species."""
    fig, axes = plt.subplots(1, 3, figsize=(18, 6), sharey=True)
    fig.suptitle("CatchForecast AI — Correlation Between Oceanographic Drivers and Catch Weight", fontsize=14, fontweight="bold")
    
    features = ENV_FEATURES
    feat_names = [f.replace("_celsius", " (°C)").replace("_c_per_km", " (°C/km)").replace("_mg_m3", " (mg/m³)").replace("_m", " (m)").replace("_deg", " (°)").replace("_km", " (km)") for f in features]
    
    y = np.arange(len(features))
    height = 0.35
    
    for i, sp in enumerate(SPECIES_CONFIGS):
        ax = axes[i]
        key = sp["key"]
        p_vals = [audit[key]["pearson_corr"][f] for f in features]
        s_vals = [audit[key]["spearman_corr"][f] for f in features]
        
        ax.barh(y - height/2, p_vals, height, label="Pearson (Linear)", color="#1f77b4", alpha=0.85)
        ax.barh(y + height/2, s_vals, height, label="Spearman (Rank)", color="#ff7f0e", alpha=0.85)
        
        ax.set_yticks(y)
        if i == 0:
            ax.set_yticklabels(feat_names, fontsize=9)
        ax.set_xlabel("Correlation Coefficient (r)")
        ax.set_title(f"{sp['name']}\n({sp['type']})", fontsize=11, fontweight="bold")
        ax.axvline(0, color="black", linestyle="--", linewidth=0.8)
        ax.set_xlim(-0.8, 0.8)
        ax.grid(True, linestyle=":", alpha=0.6)
        if i == 0:
            ax.legend(loc="lower right")
            
    plt.tight_layout()
    fig_path = os.path.join(OUTPUT_FIG_DIR, "03_correlation_matrices_per_species.png")
    plt.savefig(fig_path, dpi=300)
    plt.close()
    return fig_path

def plot_figure_4_seasonal_trends(datasets):
    """Plot Fig 4: Monthly Catch and Environmental Upwelling Signals."""
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 9), sharex=True)
    fig.suptitle("CatchForecast AI — Seasonal Upwelling Signal and Catch Profiles (2026)", fontsize=14, fontweight="bold")
    
    months = list(range(1, 12))
    month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"]
    
    # Aggregate monthly
    df_any = datasets["rastrelliger"]
    monthly_sst = df_any.groupby("month")["sst_celsius"].mean()
    monthly_front = df_any.groupby("month")["thermal_front_c_per_km"].mean()
    
    # Ax1: Environment (SST & Front)
    ax1_twin = ax1.twinx()
    l1 = ax1.plot(months, monthly_sst, "r-o", linewidth=2.5, label="Mean SST (°C)")
    l2 = ax1_twin.plot(months, monthly_front, "m--s", linewidth=2.0, label="Mean Front Gradient (°C/km)")
    ax1.set_ylabel("SST (°C)", color="red", fontsize=11)
    ax1_twin.set_ylabel("Front Gradient (°C/km)", color="magenta", fontsize=11)
    ax1.set_title("Oceanographic Seasonality (Note August East-Monsoon Upwelling Peak: Lowest SST & Strongest Front)", fontsize=11)
    ax1.grid(True, linestyle="--", alpha=0.5)
    
    lines = l1 + l2
    labels = [l.get_label() for l in lines]
    ax1.legend(lines, labels, loc="upper right")
    
    # Ax2: Total Catch per Species
    for sp in SPECIES_CONFIGS:
        key = sp["key"]
        tot_catch = datasets[key].groupby("month")["catch_weight_kg"].sum()
        ax2.plot(months, tot_catch, "-o", linewidth=2.0, label=f"{sp['name']} ({sp['local']})")
        
    ax2.set_ylabel("Monthly Landings (kg)", fontsize=11)
    ax2.set_xlabel("Month (2026)", fontsize=11)
    ax2.set_xticks(months)
    ax2.set_xticklabels(month_names)
    ax2.set_title("Monthly Species Production Dynamics at PPN Karangantu", fontsize=11)
    ax2.grid(True, linestyle="--", alpha=0.5)
    ax2.legend(loc="upper left")
    
    plt.tight_layout()
    fig_path = os.path.join(OUTPUT_FIG_DIR, "04_seasonal_upwelling_catch_trends.png")
    plt.savefig(fig_path, dpi=300)
    plt.close()
    return fig_path

def plot_figure_5_spatial_maps(datasets):
    """Plot Fig 5: Peak Season (August) Spatial Catch Allocation Map."""
    fig, axes = plt.subplots(1, 3, figsize=(18, 6))
    fig.suptitle("CatchForecast AI — Teluk Banten Spatial Catch Density (Peak Upwelling Month: August 2026)", fontsize=14, fontweight="bold")
    
    for i, sp in enumerate(SPECIES_CONFIGS):
        ax = axes[i]
        key = sp["key"]
        df_aug = datasets[key][datasets[key]["month"] == 8]
        
        sc = ax.scatter(
            df_aug["lon"], df_aug["lat"], 
            c=df_aug["catch_weight_kg"], 
            cmap="viridis" if sp["type"] == "Pelagic" else "cividis",
            s=22, alpha=0.85, edgecolor="none"
        )
        cbar = plt.colorbar(sc, ax=ax, fraction=0.046, pad=0.04)
        cbar.set_label("Catch (kg / 1 km² cell)")
        
        # Plot Karangantu Port location
        ax.scatter([106.15], [-6.033], color="red", marker="*", s=120, edgecolors="black", label="PPN Karangantu")
        
        ax.set_title(f"{sp['name']}\n({sp['local']} — {sp['type']})", fontsize=11, fontweight="bold")
        ax.set_xlabel("Longitude (°E)")
        if i == 0:
            ax.set_ylabel("Latitude (°S)")
            ax.legend(loc="upper left")
        ax.set_xlim(105.90, 106.35)
        ax.set_ylim(-6.15, -5.85)
        ax.grid(True, linestyle=":", alpha=0.5)
        
    plt.tight_layout()
    fig_path = os.path.join(OUTPUT_FIG_DIR, "05_spatial_catch_allocation_maps.png")
    plt.savefig(fig_path, dpi=300)
    plt.close()
    return fig_path

def main():
    print("="*70)
    print("CatchForecast AI — Phase 07: Exploratory Data Analysis (EDA)")
    print("="*70)
    
    datasets = load_species_datasets()
    print(f"Loaded 3 species datasets ({len(datasets['rastrelliger'])} records each).")
    
    # 1. Run Statistical Audit
    audit = run_statistical_audit(datasets)
    print("\nStatistical Audit Completed:")
    for key, data in audit.items():
        print(f"  [{data['name']}]")
        print(f"    Catch Weight Mean: {data['catch_mean']:.2f} kg, Median: {data['catch_median']:.2f} kg, IQR: {data['catch_iqr']:.2f} kg")
        print(f"    CPUE Mean: {data['cpue_mean']:.3f} kg/trip")
        print(f"    Moran's I (Spatial Autocorrelation, Aug): {data['morans_i_august']:.4f}")
        print(f"    VIF Range: {min(data['vif'].values()):.2f} - {max(data['vif'].values()):.2f}")
        print(f"    Top Feature Correlated: {max(data['spearman_corr'].items(), key=lambda x: abs(x[1]))}")
        
    # Save Audit JSON
    audit_json_path = os.path.join(OUTPUT_DOCS_DIR, "eda_metrics_summary.json")
    with open(audit_json_path, "w") as f:
        json.dump(audit, f, indent=2)
    print(f"\nSaved metrics summary to: {audit_json_path}")
    
    # 2. Generate Plots
    print("\nGenerating Visualizations...")
    f1 = plot_figure_1_catch_distributions(datasets)
    print(f"  Fig 1: {f1}")
    f2 = plot_figure_2_environmental_features(datasets)
    print(f"  Fig 2: {f2}")
    f3 = plot_figure_3_correlation_heatmaps(audit)
    print(f"  Fig 3: {f3}")
    f4 = plot_figure_4_seasonal_trends(datasets)
    print(f"  Fig 4: {f4}")
    f5 = plot_figure_5_spatial_maps(datasets)
    print(f"  Fig 5: {f5}")
    
    print("\nEDA Execution Complete! All figures generated successfully.")

if __name__ == "__main__":
    main()
