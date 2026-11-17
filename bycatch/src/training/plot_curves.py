"""
Training Curves Visualizer for ByCatch AI (Phase 7).
Dynamically parses results.csv (supports YOLOv8, YOLO11, and YOLO26 with/without DFL loss)
and renders learning curves to PNG.
"""

import csv
from pathlib import Path
from typing import Optional
import matplotlib.pyplot as plt

def plot_training_curves(results_csv_path: Path, output_png_path: Path) -> Optional[Path]:
    """Reads results.csv and plots loss, precision, recall, and mAP curves."""
    if not results_csv_path.exists():
        return None

    # Read CSV
    epochs = []
    data_cols = {}

    with open(results_csv_path, "r", encoding="utf-8") as f:
        reader = csv.reader(f)
        header = [col.strip() for col in next(reader, [])]
        for col_name in header:
            data_cols[col_name] = []

        for row in reader:
            if not row or not any(row):
                continue
            for idx, val in enumerate(row):
                if idx < len(header):
                    try:
                        data_cols[header[idx]].append(float(val.strip()))
                    except ValueError:
                        pass

    if not data_cols or "epoch" not in data_cols or len(data_cols["epoch"]) == 0:
        return None

    epochs = data_cols["epoch"]

    # Create figure with 2x2 subplots
    fig, axes = plt.subplots(2, 2, figsize=(12, 10))

    # 1. Training Losses (Dynamically match train/box_loss, train/cls_loss, etc.)
    ax_loss = axes[0, 0]
    for k, v in data_cols.items():
        if "train/" in k and "loss" in k:
            ax_loss.plot(epochs, v, label=k.replace("train/", ""))
    ax_loss.set_title("Training Losses")
    ax_loss.set_xlabel("Epoch")
    ax_loss.set_ylabel("Loss")
    ax_loss.legend()
    ax_loss.grid(True, alpha=0.3)

    # 2. Validation Losses
    ax_val_loss = axes[0, 1]
    for k, v in data_cols.items():
        if "val/" in k and "loss" in k:
            ax_val_loss.plot(epochs, v, label=k.replace("val/", ""))
    ax_val_loss.set_title("Validation Losses")
    ax_val_loss.set_xlabel("Epoch")
    ax_val_loss.set_ylabel("Loss")
    ax_val_loss.legend()
    ax_val_loss.grid(True, alpha=0.3)

    # 3. Precision & Recall
    ax_pr = axes[1, 0]
    for k in ["metrics/precision(B)", "metrics/recall(B)"]:
        if k in data_cols:
            ax_pr.plot(epochs, data_cols[k], label=k.replace("metrics/", ""))
    ax_pr.set_title("Precision & Recall")
    ax_pr.set_xlabel("Epoch")
    ax_pr.set_ylabel("Score")
    ax_pr.legend()
    ax_pr.grid(True, alpha=0.3)

    # 4. mAP Metrics
    ax_map = axes[1, 1]
    for k in ["metrics/mAP50(B)", "metrics/mAP50-95(B)"]:
        if k in data_cols:
            ax_map.plot(epochs, data_cols[k], label=k.replace("metrics/", ""))
    ax_map.set_title("mAP Metrics")
    ax_map.set_xlabel("Epoch")
    ax_map.set_ylabel("mAP")
    ax_map.legend()
    ax_map.grid(True, alpha=0.3)

    plt.tight_layout()
    output_png_path.parent.mkdir(parents=True, exist_ok=True)
    plt.savefig(output_png_path, dpi=150)
    plt.close()
    return output_png_path
