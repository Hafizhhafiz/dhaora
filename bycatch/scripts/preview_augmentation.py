#!/usr/bin/env python3
"""
Preview Augmentation Script for ByCatch AI (Phase 5).
Simulates photometric and geometric augmentations to verify that diagnostic
features (e.g. yellow stripe on selar, barbels on kuniran) remain visually intact.
"""

import sys
import random
from pathlib import Path
from PIL import Image, ImageEnhance

def preview_sample_augmentations(sample_image_path: Path, output_dir: Path, num_previews: int = 4):
    output_dir.mkdir(parents=True, exist_ok=True)
    if not sample_image_path.exists():
        print(f"Sample image not found: {sample_image_path}")
        return

    with Image.open(sample_image_path) as base_img:
        base_img = base_img.convert("RGB")
        base_img.save(output_dir / "original.jpg")

        for i in range(num_previews):
            img = base_img.copy()

            # 1. Flip LR
            if random.random() > 0.5:
                img = img.transpose(Image.Transpose.FLIP_LEFT_RIGHT)

            # 2. Subtle rotation (-10 to +10 deg)
            angle = random.uniform(-10, 10)
            img = img.rotate(angle, resample=Image.Resampling.BILINEAR, expand=False)

            # 3. Brightness/Contrast slight jitter
            bright_factor = random.uniform(0.85, 1.15)
            img = ImageEnhance.Brightness(img).enhance(bright_factor)
            contrast_factor = random.uniform(0.9, 1.1)
            img = ImageEnhance.Contrast(img).enhance(contrast_factor)

            out_path = output_dir / f"aug_preview_{i+1}.jpg"
            img.save(out_path, "JPEG")
            print(f"Saved: {out_path}")

if __name__ == "__main__":
    root = Path(__file__).resolve().parents[1]
    fixtures_img = root / "tests" / "fixtures" / "synthetic_audit_images" / "valid" / "selar_kuning" / "test_selar_kuning_1.bmp"
    out = root / "results" / "phase5_annotation" / "aug_previews"
    preview_sample_augmentations(fixtures_img, out)
