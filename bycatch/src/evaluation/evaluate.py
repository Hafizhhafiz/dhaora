"""
Model Evaluation Engine for ByCatch AI (Phase 8).
Calculates mAP50, mAP50-95, precision, recall, F1, and bootstrap confidence intervals.
"""

import sys
import json
import random
from pathlib import Path
from typing import Dict, Any, List
import yaml
import numpy as np
from ultralytics import YOLO

def compute_bootstrap_ci(scores: List[float], n_bootstrap: int = 1000, ci_level: float = 0.95, seed: int = 42) -> Dict[str, float]:
    """Computes bootstrap confidence interval for a metric list."""
    if not scores:
        return {"mean": 0.0, "ci_lower": 0.0, "ci_upper": 0.0}

    random.seed(seed)
    np.random.seed(seed)
    n = len(scores)
    boot_means = []

    for _ in range(n_bootstrap):
        sample = np.random.choice(scores, size=n, replace=True)
        boot_means.append(float(np.mean(sample)))

    alpha = (1.0 - ci_level) / 2.0
    lower = float(np.percentile(boot_means, alpha * 100))
    upper = float(np.percentile(boot_means, (1.0 - alpha) * 100))

    return {
        "mean": round(float(np.mean(scores)), 4),
        "ci_lower": round(lower, 4),
        "ci_upper": round(upper, 4)
    }

def run_evaluation(
    weights_path: Path,
    data_yaml_path: Path,
    output_dir: Path,
    split: str = "val",
    imgsz: int = 640,
    conf_thresh: float = 0.25,
    iou_thresh: float = 0.50
) -> Dict[str, Any]:
    """Runs model validation and produces evaluation report."""
    output_dir.mkdir(parents=True, exist_ok=True)
    model = YOLO(str(weights_path))

    metrics = model.val(
        data=str(data_yaml_path),
        split=split,
        imgsz=imgsz,
        conf=conf_thresh,
        iou=iou_thresh,
        project=str(output_dir),
        name="val_run",
        verbose=False
    )

    results = {
        "weights": str(weights_path),
        "data_yaml": str(data_yaml_path),
        "split": split,
        "mAP50": round(float(metrics.box.map50), 4),
        "mAP50_95": round(float(metrics.box.map), 4),
        "precision_mean": round(float(metrics.box.mp), 4),
        "recall_mean": round(float(metrics.box.mr), 4),
        "f1_mean": round(float(2 * (metrics.box.mp * metrics.box.mr) / max(1e-6, (metrics.box.mp + metrics.box.mr))), 4),
        "per_class": {}
    }

    # Class breakdown
    class_names = ["kembung_perempuan", "selar_kuning", "kuniran"]
    for i, name in enumerate(class_names):
        p = float(metrics.box.p[i]) if i < len(metrics.box.p) else 0.0
        r = float(metrics.box.r[i]) if i < len(metrics.box.r) else 0.0
        map50 = float(metrics.box.ap50[i]) if i < len(metrics.box.ap50) else 0.0
        f1 = (2 * p * r) / max(1e-6, (p + r))
        results["per_class"][name] = {
            "precision": round(p, 4),
            "recall": round(r, 4),
            "f1": round(f1, 4),
            "mAP50": round(map50, 4)
        }

    # Save JSON report
    report_file = output_dir / "evaluation_report.json"
    report_file.write_text(json.dumps(results, indent=2), encoding="utf-8")
    print(f"Evaluation report written to: {report_file}")
    return results
