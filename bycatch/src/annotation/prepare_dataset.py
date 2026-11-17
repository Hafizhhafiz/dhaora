"""
Dataset Preparation and Versioning Engine (Phase 5).
Packages split annotations and images into frozen dataset version: dataset/processed/<dsv>/.
"""

import hashlib
import json
import shutil
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List
from PIL import Image, ImageOps
import yaml

def generate_dsv_hash(manifest_records: List[Dict[str, Any]]) -> str:
    """Generates unique 8-character hash from sorted manifest records."""
    h = hashlib.sha256()
    sorted_ids = sorted(f"{r['image_id']}:{r.get('split', '')}" for r in manifest_records)
    for s in sorted_ids:
        h.update(s.encode("utf-8"))
    date_str = datetime.now().strftime("%Y%m%d")
    return f"dsv_{date_str}_{h.hexdigest()[:8]}"

def prepare_yolo_dataset(
    splits: Dict[str, List[Dict[str, Any]]],
    output_base_dir: Path,
    classes_yaml_path: Path
) -> Tuple[Path, str, Dict[str, Any]]:
    """
    Copies images (with exif_transpose) and labels to processed/<dsv>/.
    Generates data.yaml and manifest.
    """
    all_records = []
    for split_records in splits.values():
        all_records.extend(split_records)

    dsv_name = generate_dsv_hash(all_records)
    dsv_dir = output_base_dir / dsv_name
    dsv_dir.mkdir(parents=True, exist_ok=True)

    # 1. Read canonical classes
    with open(classes_yaml_path, "r", encoding="utf-8") as f:
        classes_cfg = yaml.safe_load(f)

    class_names = classes_cfg.get("names", ["kembung_perempuan", "selar_kuning", "kuniran"])

    stats = {
        "dataset_version": dsv_name,
        "created_at": datetime.now().isoformat(),
        "splits": {"train": 0, "val": 0, "test": 0},
        "classes": {name: {"train": 0, "val": 0, "test": 0} for name in class_names}
    }

    # 2. Populate images and labels
    for split_name, records in splits.items():
        img_out_dir = dsv_dir / "images" / split_name
        lbl_out_dir = dsv_dir / "labels" / split_name
        img_out_dir.mkdir(parents=True, exist_ok=True)
        lbl_out_dir.mkdir(parents=True, exist_ok=True)

        for r in records:
            src_img = Path(r["file_path"])
            dest_img = img_out_dir / src_img.name

            # Exif transpose and save
            try:
                with Image.open(src_img) as im:
                    transposed = ImageOps.exif_transpose(im)
                    transposed.save(dest_img)
            except Exception:
                shutil.copy2(src_img, dest_img)

            # Copy label file if exists, else create empty (negative image)
            src_lbl = src_img.with_suffix(".txt")
            dest_lbl = lbl_out_dir / f"{src_img.stem}.txt"
            if src_lbl.exists():
                shutil.copy2(src_lbl, dest_lbl)
            else:
                dest_lbl.write_text("", encoding="utf-8")

            stats["splits"][split_name] += 1
            cls = r.get("class_label", "unknown")
            if cls in stats["classes"]:
                stats["classes"][cls][split_name] += 1

    # 3. Write data.yaml for Ultralytics YOLO
    data_yaml_content = {
        "path": dsv_dir.resolve().as_posix(),
        "train": "images/train",
        "val": "images/val",
        "test": "images/test",
        "names": {i: name for i, name in enumerate(class_names)},
        "nc": len(class_names)
    }

    yaml_file = dsv_dir / "data.yaml"
    with open(yaml_file, "w", encoding="utf-8") as f:
        yaml.dump(data_yaml_content, f, sort_keys=False)

    # 4. Save metadata stats
    (dsv_dir / "dataset_stats.json").write_text(json.dumps(stats, indent=2), encoding="utf-8")

    return dsv_dir, dsv_name, stats
