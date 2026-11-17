"""
YOLO Training Pipeline with Resource Guards and OOM Ladder for ByCatch AI (Phase 7).
Usage:
    python -m src.training.train --config configs/train/baseline.yaml --model yolo11n.pt --data-yaml <path> --mode smoke|research
"""

import sys
import time
import argparse
import json
from pathlib import Path
import yaml
import torch
from ultralytics import YOLO

from src.utils.gpu_monitor import check_safety_guards, get_gpu_status
from src.training.oom import OOM_LADDER, log_oom_event, get_next_fallback_config
from src.training.registry import register_experiment
from src.training.plot_curves import plot_training_curves

def run_training(
    config_path: Path,
    model_name: str,
    data_yaml_path: Path,
    mode: str = "smoke",
    epochs: int = 100,
    seed: int = 42,
    resume: bool = False
):
    print("=" * 60)
    print(f"ByCatch AI — YOLO Model Training Pipeline (Mode: {mode.upper()})")
    print("=" * 60)

    # 1. Guard check
    safe, msg = check_safety_guards(min_free_ram_gb=0.4)
    if not safe:
        print(f"ABORT: {msg}")
        sys.exit(1)

    # 2. Safety check for research mode
    with open(data_yaml_path, "r", encoding="utf-8") as f:
        data_cfg = yaml.safe_load(f)

    is_synthetic = data_cfg.get("synthetic", False)
    if mode == "research" and is_synthetic:
        print("ERROR: Research training mode CANNOT be executed on a synthetic dataset!")
        sys.exit(1)

    with open(config_path, "r", encoding="utf-8") as f:
        train_cfg = yaml.safe_load(f)

    target_imgsz = train_cfg.get("dataset", {}).get("imgsz", 640)
    target_batch = train_cfg.get("dataset", {}).get("batch", 4)

    timestamp = int(time.time())
    exp_id = f"exp_{Path(model_name).stem}_{mode}_s{seed}_{timestamp}"
    
    if mode == "smoke":
        project_dir = Path("results/_smoke") / exp_id
    else:
        project_dir = Path("results/phase7_training") / exp_id

    project_dir.mkdir(parents=True, exist_ok=True)
    device = 0 if torch.cuda.is_available() else "cpu"

    print(f"Loading base model: {model_name} on device: {device}...")
    model = YOLO(model_name)

    start_time = time.perf_counter()
    trained = False
    current_imgsz = target_imgsz
    current_batch = target_batch

    # Training loop with OOM Fallback Ladder
    while not trained:
        try:
            print(f"Starting training run: imgsz={current_imgsz}, batch={current_batch}, epochs={epochs}...")
            results = model.train(
                data=str(data_yaml_path.resolve()),
                epochs=epochs,
                batch=current_batch,
                imgsz=current_imgsz,
                workers=0,
                cache=False,
                amp=True,
                seed=seed,
                deterministic=True,
                device=device,
                project=str(project_dir.parent),
                name=exp_id,
                save_period=1,
                verbose=True
            )
            trained = True
        except torch.cuda.OutOfMemoryError as oom_err:
            fallback = get_next_fallback_config(current_imgsz, current_batch)
            log_oom_event(
                error_msg=str(oom_err),
                failed_imgsz=current_imgsz,
                failed_batch=current_batch,
                fallback_config=fallback,
                log_path=project_dir / "oom_log.json"
            )
            if fallback is None:
                print("FATAL: Out of memory and reached bottom of fallback ladder!")
                sys.exit(1)
            current_imgsz, current_batch = fallback
            print(f"Retrying on fallback ladder step: imgsz={current_imgsz}, batch={current_batch}...")

    runtime_s = round(time.perf_counter() - start_time, 2)
    print(f"\nTraining completed in {runtime_s} seconds.")

    # 3. Plot curves
    results_csv = project_dir / "results.csv"
    if results_csv.exists():
        plot_training_curves(results_csv, project_dir / "learning_curves.png")

    # 4. Register experiment (only for research mode, or marked synthetic for smoke)
    reg_record = {
        "exp_id": exp_id,
        "model": model_name,
        "dsv": Path(data_yaml_path).parent.name if not is_synthetic else "synthetic",
        "seed": seed,
        "imgsz": current_imgsz,
        "batch": current_batch,
        "epochs_planned": epochs,
        "epochs_run": epochs,
        "best_epoch": epochs,
        "runtime_s": runtime_s,
        "status": "completed",
        "mode": mode,
        "synthetic": is_synthetic,
        "notes": f"Trained on device: {device}"
    }

    if mode == "research":
        register_experiment(reg_record, Path("results/phase7_training/experiment_registry.csv"))
    else:
        register_experiment(reg_record, Path("results/_smoke/smoke_experiment_registry.csv"))

    print(f"Artifacts saved in: {project_dir}")

def main():
    parser = argparse.ArgumentParser(description="ByCatch AI Model Training Pipeline")
    parser.add_argument("--config", type=str, default="configs/train/baseline.yaml", help="Path to config")
    parser.add_argument("--model", type=str, default="yolo11n.pt", help="Pretrained model weights")
    parser.add_argument("--data-yaml", type=str, required=True, help="Path to data.yaml")
    parser.add_argument("--mode", type=str, choices=["smoke", "research"], default="smoke", help="Training mode")
    parser.add_argument("--epochs", type=int, default=2, help="Number of epochs")
    parser.add_argument("--seed", type=int, default=42, help="Random seed")
    parser.add_argument("--resume", action="store_true", help="Resume from last checkpoint")

    args = parser.parse_args()
    run_training(
        config_path=Path(args.config),
        model_name=args.model,
        data_yaml_path=Path(args.data_yaml),
        mode=args.mode,
        epochs=args.epochs,
        seed=args.seed,
        resume=args.resume
    )

if __name__ == "__main__":
    main()
