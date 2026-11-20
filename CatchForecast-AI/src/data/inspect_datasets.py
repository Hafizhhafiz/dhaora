"""
CatchForecast AI - Reproducible Dataset Inspection & Audit Module (Phase 03)
Performs schema, completeness, statistical, and taxonomic audits on raw datasets.
"""

import os
import sys
import json
import hashlib
from datetime import datetime
import pandas as pd
import numpy as np

def compute_file_hash(filepath):
    """Compute SHA-256 hash of a file for data provenance and integrity verification."""
    hasher = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(8192):
            hasher.update(chunk)
    return hasher.hexdigest()

def detect_outliers_iqr(series):
    """Detect outlier count using the standard 1.5 * IQR rule."""
    clean_s = series.dropna()
    if len(clean_s) < 4:
        return 0
    q25 = clean_s.quantile(0.25)
    q75 = clean_s.quantile(0.75)
    iqr = q75 - q25
    lower_bound = q25 - 1.5 * iqr
    upper_bound = q75 + 1.5 * iqr
    return int(((clean_s < lower_bound) | (clean_s > upper_bound)).sum())

def audit_single_dataframe(filepath):
    """Audits a single CSV dataset."""
    filesize_bytes = os.path.getsize(filepath)
    file_sha256 = compute_file_hash(filepath)
    filename = os.path.basename(filepath)
    
    df = pd.read_csv(filepath)
    n_rows, n_cols = df.shape
    n_duplicates = int(df.duplicated().sum())
    
    col_profiles = {}
    for col in df.columns:
        s = df[col]
        n_missing = int(s.isnull().sum())
        pct_missing = round((n_missing / n_rows) * 100, 2) if n_rows > 0 else 0
        dtype_str = str(s.dtype)
        
        prof = {
            "dtype": dtype_str,
            "missing_count": n_missing,
            "missing_pct": pct_missing,
            "unique_count": int(s.nunique()),
        }
        
        if pd.api.types.is_numeric_dtype(s):
            clean_num = s.dropna()
            if len(clean_num) > 0:
                prof.update({
                    "min": float(clean_num.min()),
                    "max": float(clean_num.max()),
                    "mean": float(round(clean_num.mean(), 2)),
                    "median": float(round(clean_num.median(), 2)),
                    "std": float(round(clean_num.std(), 2)) if len(clean_num) > 1 else 0.0,
                    "outliers_iqr_count": detect_outliers_iqr(clean_num)
                })
        else:
            top_vals = s.value_counts().head(3).to_dict()
            prof["top_categories"] = {str(k): int(v) for k, v in top_vals.items()}
            
        col_profiles[col] = prof
        
    return {
        "filename": filename,
        "filepath": filepath,
        "size_bytes": filesize_bytes,
        "size_kb": round(filesize_bytes / 1024, 2),
        "sha256": file_sha256,
        "rows": n_rows,
        "cols": n_cols,
        "duplicates": n_duplicates,
        "columns": list(df.columns),
        "column_profiles": col_profiles
    }

def run_phase_03_audit(data_root, output_dir):
    """Audits all raw data in fisheries and oceanographic directories."""
    os.makedirs(output_dir, exist_ok=True)
    audit_time = datetime.now().isoformat()
    
    results = {
        "audit_timestamp": audit_time,
        "python_version": sys.version,
        "pandas_version": pd.__version__,
        "data_root": data_root,
        "datasets": {}
    }
    
    print("="*75)
    print("CATCHFORECAST AI — PHASE 03 DATASET INSPECTION & REPRODUCIBLE AUDIT")
    print("="*75)
    
    # Scan raw fisheries directory
    fisheries_dir = os.path.join(data_root, "raw", "fisheries")
    if os.path.exists(fisheries_dir):
        for f in os.listdir(fisheries_dir):
            if f.endswith(".csv"):
                fpath = os.path.join(fisheries_dir, f)
                print(f"[*] Auditing {f}...")
                prof = audit_single_dataframe(fpath)
                results["datasets"][f] = prof
                print(f"    Rows: {prof['rows']} | Cols: {prof['cols']} | Dups: {prof['duplicates']} | Size: {prof['size_kb']} KB")
                
    # Scan raw oceanographic directory
    ocean_dir = os.path.join(data_root, "raw", "oceanographic")
    if os.path.exists(ocean_dir):
        for f in os.listdir(ocean_dir):
            if f.endswith(".csv"):
                fpath = os.path.join(ocean_dir, f)
                print(f"[*] Auditing {f}...")
                prof = audit_single_dataframe(fpath)
                results["datasets"][f] = prof
                print(f"    Rows: {prof['rows']} | Cols: {prof['cols']} | Dups: {prof['duplicates']} | Size: {prof['size_kb']} KB")
                
    # Save full audit json
    audit_json_path = os.path.join(output_dir, "dataset_audit_metrics.json")
    with open(audit_json_path, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"\n[+] Comprehensive audit JSON saved to: {audit_json_path}")
    
    # Generate Markdown Summary Tables
    md_summary_path = os.path.join(output_dir, "AUDIT_SUMMARY_TABLES.md")
    with open(md_summary_path, "w", encoding="utf-8") as f:
        f.write("# Dataset Audit Summary Tables (Phase 03)\n")
        f.write(f"Audit Executed: `{audit_time}`\n\n")
        f.write("| File Name | Rows | Columns | Size (KB) | Missing Cells | Duplicates | SHA-256 (prefix) |\n")
        f.write("|---|---|---|---|---|---|---|\n")
        for fname, d in results["datasets"].items():
            tot_missing = sum(c["missing_count"] for c in d["column_profiles"].values())
            f.write(f"| `{fname}` | {d['rows']} | {d['cols']} | {d['size_kb']} KB | {tot_missing} | {d['duplicates']} | `{d['sha256'][:12]}...` |\n")
        
        f.write("\n\n## Target Species Landings Profile\n\n")
        if "target_species_landings.csv" in results["datasets"]:
            f.write("Columns profiled:\n")
            target_ds = results["datasets"]["target_species_landings.csv"]
            for col, p in target_ds["column_profiles"].items():
                f.write(f"- **{col}** (`{p['dtype']}`): Unique={p['unique_count']}, Missing={p['missing_count']} ({p['missing_pct']}%)\n")
                if "min" in p:
                    f.write(f"  - Min={p['min']}, Max={p['max']}, Mean={p['mean']}, Outliers(IQR)={p['outliers_iqr_count']}\n")
                    
    print(f"[+] Markdown audit summary saved to: {md_summary_path}")
    print("="*75 + "\n")
    return results

if __name__ == "__main__":
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    data_dir = os.path.join(project_root, "data")
    rep_dir = os.path.join(project_root, "reports", "phase_03")
    run_phase_03_audit(data_dir, rep_dir)
