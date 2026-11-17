import os
import sys
import argparse
from pathlib import Path
from ultralytics import YOLO

WORKSPACE = Path(r"c:\TUGAS-TUGAS KULIAH\SEMESTER 5\ASIK VOL VI")
DATA_YAML = WORKSPACE / "datasets" / "fishguard_v001" / "data.yaml"
OUTPUT_DIR = WORKSPACE / "PHASES" / "PHASE_13" / "runs"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def train_baseline(epochs=10, batch_size=8, imgsz=640, seed=42):
    print(f"--- FishGuard AI: YOLOv8n Baseline Training (Phase 13) ---")
    print(f"Data YAML: {DATA_YAML}")
    print(f"Epochs: {epochs} | Batch: {batch_size} | Imgsz: {imgsz} | Seed: {seed}")
    
    # Check baseline weights
    baseline_weights = WORKSPACE / "yolov8n.pt"
    if not baseline_weights.exists():
        print(f"Downloading yolov8n.pt...")
        model = YOLO("yolov8n.pt")
    else:
        print(f"Loading local baseline weights: {baseline_weights}")
        model = YOLO(str(baseline_weights))

    results = model.train(
        data=str(DATA_YAML),
        epochs=epochs,
        batch=batch_size,
        imgsz=imgsz,
        seed=seed,
        deterministic=True,
        device="cpu",
        workers=2,
        project=str(OUTPUT_DIR),
        name="baseline_yolov8n_v001",
        exist_ok=True,
        verbose=True,
        plots=True,
        save=True
    )
    
    print("\nTraining complete!")
    best_weights = OUTPUT_DIR / "baseline_yolov8n_v001" / "weights" / "best.pt"
    if best_weights.exists():
        print(f"Best model weights saved to: {best_weights}")
        # Copy to backend/weights/fishguard_yolo.pt
        backend_weights = WORKSPACE / "backend" / "weights" / "fishguard_yolo.pt"
        import shutil
        shutil.copy2(best_weights, backend_weights)
        print(f"Copied best model to backend: {backend_weights}")
    return results

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--epochs", type=int, default=10)
    parser.add_argument("--batch", type=int, default=8)
    parser.add_argument("--imgsz", type=int, default=640)
    args = parser.parse_args()
    train_baseline(epochs=args.epochs, batch_size=args.batch, imgsz=args.imgsz)
