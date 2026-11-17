"""
Script: train_yolo.py
Deskripsi: Melatih model Ultralytics YOLO pada dataset target spesies (kembung dan layang),
serta mengekspor bobot hasil training ke backend/weights/fishguard_yolo.pt.
"""

import sys
from pathlib import Path
from ultralytics import YOLO

def main():
    root_dir = Path(__file__).resolve().parent.parent.parent
    config_yaml = root_dir / "dataset_pipeline" / "dataset_config.yaml"
    weights_dir = root_dir / "backend" / "weights"
    weights_dir.mkdir(parents=True, exist_ok=True)
    target_weights = weights_dir / "fishguard_yolo.pt"

    processed_data = root_dir / "dataset_pipeline" / "data" / "processed" / "images" / "train"
    if not processed_data.exists() or len(list(processed_data.glob("*.*"))) == 0:
        print("[ABORT] Dataset latih belum tersedia di dataset_pipeline/data/processed/images/train.")
        print("[INFO] Jalankan pengumpulan foto spesimen dan anotasi terlebih dahulu sebelum training.")
        return

    print("=== MEMULAI FINE-TUNING YOLO FISHGUARD AI ===")
    print(f"Konfigurasi data: {config_yaml}")
    
    # Inisialisasi dari pretrained YOLOv8n
    model = YOLO("yolov8n.pt")

    # Training hyperparameter
    results = model.train(
        data=str(config_yaml),
        epochs=50,
        imgsz=640,
        batch=16,
        patience=10,
        save=True,
        project="fishguard_runs",
        name="teluk_banten_exp"
    )

    # Copy best weights to backend
    best_pt = Path("fishguard_runs/teluk_banten_exp/weights/best.pt")
    if best_pt.exists():
        import shutil
        shutil.copy2(best_pt, target_weights)
        print(f"[SUCCESS] Bobot terbaik diekspor ke: {target_weights}")
    else:
        print("[WARNING] File best.pt tidak ditemukan di direktori runs.")

if __name__ == "__main__":
    main()
