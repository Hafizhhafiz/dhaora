#!/usr/bin/env python3
"""
Generate a minimal synthetic YOLO dataset for testing Phase 5 (annotation/split)
and Phase 7 (smoke training) without real research data.
All files are strictly marked with synthetic=true and saved in tests/fixtures/.
"""

import struct
from pathlib import Path

def create_bmp_bytes(width: int, height: int, color_rgb: tuple) -> bytes:
    row_bytes = width * 3
    padding = (4 - (row_bytes % 4)) % 4
    image_size = (row_bytes + padding) * height
    file_size = 54 + image_size
    header = struct.pack("<2sIHHI", b"BM", file_size, 0, 0, 54)
    dib = struct.pack("<IiiHHIIiiII", 40, width, height, 1, 24, 0, image_size, 2835, 2835, 0, 0)
    r, g, b = color_rgb
    pixel_row = bytes([b, g, r] * width) + (b"\x00" * padding)
    return header + dib + (pixel_row * height)

def generate_synthetic_yolo(target_dir: Path):
    print(f"Generating synthetic YOLO dataset at: {target_dir}")
    
    splits = {
        "train": [
            ("synth_001.bmp", 0, 0.5, 0.5, 0.4, 0.3),
            ("synth_002.bmp", 1, 0.4, 0.4, 0.5, 0.3),
            ("synth_003.bmp", 2, 0.6, 0.5, 0.3, 0.4),
            ("synth_004.bmp", 0, 0.3, 0.5, 0.4, 0.2),
            ("synth_005.bmp", 1, 0.5, 0.6, 0.3, 0.3),
            ("synth_006.bmp", 2, 0.4, 0.5, 0.5, 0.2),
        ],
        "val": [
            ("synth_val_001.bmp", 0, 0.5, 0.5, 0.4, 0.3),
            ("synth_val_002.bmp", 1, 0.4, 0.5, 0.3, 0.2),
            ("synth_val_003.bmp", 2, 0.5, 0.4, 0.4, 0.3),
        ]
    }

    colors = {0: (120, 160, 200), 1: (200, 200, 100), 2: (200, 130, 80)}

    for split_name, items in splits.items():
        img_dir = target_dir / "images" / split_name
        lbl_dir = target_dir / "labels" / split_name
        img_dir.mkdir(parents=True, exist_ok=True)
        lbl_dir.mkdir(parents=True, exist_ok=True)

        for filename, cls_id, xc, yc, w, h in items:
            img_path = img_dir / filename
            lbl_path = lbl_dir / f"{Path(filename).stem}.txt"

            # Create image
            img_data = create_bmp_bytes(640, 480, colors[cls_id])
            img_path.write_bytes(img_data)

            # Create YOLO label: class_id x_center y_center width height
            lbl_content = f"{cls_id} {xc:.4f} {yc:.4f} {w:.4f} {h:.4f}\n"
            lbl_path.write_text(lbl_content, encoding="utf-8")

    # Generate synthetic data.yaml
    data_yaml = f"""# Synthetic Dataset for Testing Pipeline Functionality
# DILARANG DIGUNAKAN UNTUK KLAIM RISET / MODEL RISET
synthetic: true
path: {target_dir.as_posix()}
train: images/train
val: images/val

nc: 3
names: ['kembung_perempuan', 'selar_kuning', 'kuniran']
"""
    (target_dir / "data.yaml").write_text(data_yaml, encoding="utf-8")
    (target_dir / "SYNTHETIC_MARKER.json").write_text('{"synthetic": true, "classes": 3, "description": "Pipeline smoke test dataset"}', encoding="utf-8")
    print("Synthetic YOLO dataset generated successfully.")

if __name__ == "__main__":
    out_dir = Path(__file__).resolve().parent / "synthetic_yolo_dataset"
    generate_synthetic_yolo(out_dir)
