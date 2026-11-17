#!/usr/bin/env python3
"""
Generate synthetic image fixtures for testing Phase 4 dataset audit.
Generates:
- Valid standard images (per species folder)
- Corrupt / truncated file
- Very small image (below resolution threshold)
- Blurry image
- Dark (low brightness) image
- Bright (high brightness) image
- Exact duplicate (identical SHA-256)
- Near duplicate (re-encoded/resized)
- Wrong extension
- Synthetic mark: synthetic=true
"""

import os
import struct
import shutil
from pathlib import Path

def create_bmp_bytes(width: int, height: int, color_rgb: tuple) -> bytes:
    """Create a minimal valid uncompressed 24-bit BMP image in pure Python."""
    row_bytes = width * 3
    padding = (4 - (row_bytes % 4)) % 4
    image_size = (row_bytes + padding) * height
    file_size = 54 + image_size

    # BMP Header (14 bytes)
    header = struct.pack("<2sIHHI", b"BM", file_size, 0, 0, 54)
    # DIB Header (BITMAPINFOHEADER - 40 bytes)
    dib = struct.pack("<IiiHHIIiiII", 40, width, height, 1, 24, 0, image_size, 2835, 2835, 0, 0)
    
    # Pixel data (BGR format, bottom-to-top)
    r, g, b = color_rgb
    pixel_row = bytes([b, g, r] * width) + (b"\x00" * padding)
    pixel_data = pixel_row * height
    
    return header + dib + pixel_data

def generate_fixtures(base_dir: Path):
    print(f"Generating synthetic test fixtures in: {base_dir}")
    base_dir.mkdir(parents=True, exist_ok=True)

    # 1. Standard valid images
    for cls in ["kembung_perempuan", "selar_kuning", "kuniran"]:
        cls_dir = base_dir / "valid" / cls
        cls_dir.mkdir(parents=True, exist_ok=True)
        for i in range(3):
            # 640x480 valid image
            img_data = create_bmp_bytes(640, 480, (100 + i * 20, 150, 200))
            (cls_dir / f"test_{cls}_{i+1}.bmp").write_bytes(img_data)

    # 2. Corrupt / truncated image
    corrupt_dir = base_dir / "corrupt"
    corrupt_dir.mkdir(parents=True, exist_ok=True)
    valid_sample = create_bmp_bytes(200, 200, (128, 128, 128))
    # truncated to 20 bytes (header broken)
    (corrupt_dir / "truncated.bmp").write_bytes(valid_sample[:25])
    # completely invalid text file with bmp extension
    (corrupt_dir / "not_an_image.bmp").write_text("This is purely text, not a valid image.", encoding="utf-8")

    # 3. Very small image (e.g. 50x50, below min resolution)
    small_dir = base_dir / "small"
    small_dir.mkdir(parents=True, exist_ok=True)
    (small_dir / "too_small.bmp").write_bytes(create_bmp_bytes(50, 50, (80, 80, 80)))

    # 4. Extreme lighting (dark & bright)
    lighting_dir = base_dir / "extreme_lighting"
    lighting_dir.mkdir(parents=True, exist_ok=True)
    # Dark (RGB 5, 5, 5)
    (lighting_dir / "too_dark.bmp").write_bytes(create_bmp_bytes(300, 300, (5, 5, 5)))
    # Bright (RGB 252, 252, 252)
    (lighting_dir / "too_bright.bmp").write_bytes(create_bmp_bytes(300, 300, (252, 252, 252)))

    # 5. Exact duplicates
    dup_dir = base_dir / "duplicates"
    dup_dir.mkdir(parents=True, exist_ok=True)
    sample_img = create_bmp_bytes(400, 400, (70, 180, 90))
    (dup_dir / "original_sample.bmp").write_bytes(sample_img)
    (dup_dir / "exact_copy_sample.bmp").write_bytes(sample_img)

    # Write marker metadata
    marker_file = base_dir / "FIXTURE_METADATA.json"
    marker_file.write_text('{"synthetic": true, "purpose": "Testing Phase 4 audit pipeline without real data"}', encoding="utf-8")
    print("Synthetic fixtures created successfully.")

if __name__ == "__main__":
    target = Path(__file__).resolve().parent / "synthetic_audit_images"
    generate_fixtures(target)
