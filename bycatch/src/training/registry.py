"""
Experiment Registry Manager for ByCatch AI (Phase 7).
Maintains append-only experiment records in results/phase7_training/experiment_registry.csv.
"""

import csv
from pathlib import Path
from typing import Dict, Any

REGISTRY_FIELDS = [
    "exp_id", "model", "dsv", "seed", "imgsz", "batch",
    "epochs_planned", "epochs_run", "best_epoch", "runtime_s",
    "status", "mode", "synthetic", "notes"
]

def register_experiment(record: Dict[str, Any], registry_csv_path: Path):
    """Appends an experiment run to the registry."""
    registry_csv_path.parent.mkdir(parents=True, exist_ok=True)
    file_exists = registry_csv_path.exists()

    with open(registry_csv_path, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=REGISTRY_FIELDS, extrasaction="ignore")
        if not file_exists:
            writer.writeheader()
        writer.writerow(record)
