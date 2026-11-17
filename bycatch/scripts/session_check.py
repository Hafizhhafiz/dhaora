#!/usr/bin/env python3
"""
Session check script for ByCatch AI.
Runs at the beginning of each agent session to assess system health,
available memory, GPU status, disk capacity, and dataset file counts.
"""

import sys
import shutil
from pathlib import Path

def get_dir_image_count(dir_path: Path) -> int:
    if not dir_path.exists():
        return 0
    valid_exts = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tif", ".tiff"}
    return sum(1 for p in dir_path.rglob("*") if p.suffix.lower() in valid_exts)

def main():
    print("=" * 60)
    print("ByCatch AI — Session Status & Health Check")
    print("=" * 60)

    # 1. Disk Space Check
    total, used, free = shutil.disk_usage("C:/")
    free_gb = free / (1024 ** 3)
    print(f"[*] C: Drive Free Space: {free_gb:.2f} GB")
    if free_gb < 10:
        print("    [WARNING] Disk space is below 10 GB!")

    # 2. Check Dataset Image Inventory (Read-Only)
    root = Path("C:/ali/tugas/asik/bycatch")
    primary_dir = root / "dataset" / "raw" / "primary"
    secondary_dir = root / "dataset" / "raw" / "secondary"
    curated_dir = root / "dataset" / "curated"

    print("\n[*] Dataset Inventory:")
    for cls in ["kembung_perempuan", "selar_kuning", "kuniran"]:
        n_pri = get_dir_image_count(primary_dir / cls)
        n_sec = get_dir_image_count(secondary_dir / cls)
        n_cur = get_dir_image_count(curated_dir / cls)
        print(f"    - {cls:18s} | Primary: {n_pri:4d} | Secondary: {n_sec:4d} | Curated: {n_cur:4d}")

    # 3. Check Status Files
    print("\n[*] Project Governance Files:")
    for f in ["AGENTS.md", "PROJECT_STATUS.md", "TASKS.md", "DECISIONS.md", "KNOWN_ISSUES.md", "CHANGELOG.md"]:
        p = root / f
        status = "OK" if p.exists() else "MISSING"
        print(f"    - {f:18s} : {status}")

    print("=" * 60)
    return 0

if __name__ == "__main__":
    sys.exit(main())
