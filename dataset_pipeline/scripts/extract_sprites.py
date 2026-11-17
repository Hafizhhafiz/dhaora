import os
import cv2
import numpy as np
from pathlib import Path
from PIL import Image

WORKSPACE = Path(r"c:\TUGAS-TUGAS KULIAH\SEMESTER 5\ASIK VOL VI")
REF_BASE = WORKSPACE / "dataset_pipeline" / "public_reference_images"
SPRITES_DIR = WORKSPACE / "dataset_pipeline" / "data" / "sprites"

CLASSES = {
    0: ("class_0_rastrelliger_brachysoma", "brachysoma"),
    1: ("class_1_selaroides_leptolepis", "leptolepis"),
    2: ("class_2_upeneus_sulphureus", "sulphureus")
}

def extract_sprite_from_image(img_path):
    img = cv2.imread(str(img_path))
    if img is None:
        return None
    h, w, _ = img.shape
    
    # Analyze background color from 4 corners
    corners = np.vstack([
        img[0:min(20, h), 0:min(20, w)].reshape(-1, 3),
        img[0:min(20, h), max(0, w-20):w].reshape(-1, 3),
        img[max(0, h-20):h, 0:min(20, w)].reshape(-1, 3),
        img[max(0, h-20):h, max(0, w-20):w].reshape(-1, 3)
    ])
    bg_color = np.median(corners, axis=0) # BGR
    
    # Distance in color space from background
    diff = np.linalg.norm(img.astype(np.float32) - bg_color.astype(np.float32), axis=2)
    
    # Adaptive threshold depending on background brightness
    bg_lum = 0.114 * bg_color[0] + 0.587 * bg_color[1] + 0.299 * bg_color[2]
    if bg_lum < 50:
        # Dark/black background
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        mask = (gray > 30) | (diff > 35)
    elif bg_lum > 200:
        # Light/white background
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        mask = (gray < 225) | (diff > 30)
    else:
        # Colored/gray background
        mask = diff > 35
        
    mask = mask.astype(np.uint8) * 255
    
    # Clean up mask with morphology
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel, iterations=2)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=1)
    
    # Find largest contour (the fish)
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return None
        
    largest_c = max(contours, key=cv2.contourArea)
    area = cv2.contourArea(largest_c)
    if area < (w * h * 0.05):
        # Too small to be the main fish
        return None
        
    clean_mask = np.zeros((h, w), dtype=np.uint8)
    cv2.drawContours(clean_mask, [largest_c], -1, 255, -1)
    
    # Smooth alpha edges slightly
    clean_mask = cv2.GaussianBlur(clean_mask, (5, 5), 0)
    
    # Crop to bounding rect of the contour
    bx, by, bw, bh = cv2.boundingRect(largest_c)
    
    # Pad by 5 pixels
    x1 = max(0, bx - 5)
    y1 = max(0, by - 5)
    x2 = min(w, bx + bw + 5)
    y2 = min(h, by + bh + 5)
    
    cropped_bgr = img[y1:y2, x1:x2]
    cropped_alpha = clean_mask[y1:y2, x1:x2]
    
    # Build RGBA
    rgba = cv2.cvtColor(cropped_bgr, cv2.COLOR_BGR2BGRA)
    rgba[:, :, 3] = cropped_alpha
    
    return rgba

def main():
    SPRITES_DIR.mkdir(parents=True, exist_ok=True)
    summary = {}
    
    for cls_id, (subfolder, s_name) in CLASSES.items():
        src_dir = REF_BASE / subfolder
        dst_dir = SPRITES_DIR / f"class_{cls_id}_{s_name}"
        dst_dir.mkdir(parents=True, exist_ok=True)
        
        extracted_count = 0
        img_files = sorted(src_dir.glob("*.jpg")) + sorted(src_dir.glob("*.png"))
        print(f"\nProcessing Class {cls_id} ({s_name}): {len(img_files)} source images")
        
        for f in img_files:
            sprite = extract_sprite_from_image(f)
            if sprite is not None:
                out_name = f"{f.stem}_sprite.png"
                out_path = dst_dir / out_name
                cv2.imwrite(str(out_path), sprite)
                sh, sw, _ = sprite.shape
                print(f"  [OK] Extracted sprite: {out_name} ({sw}x{sh})")
                extracted_count += 1
            else:
                print(f"  [WARN] Failed to extract sprite from {f.name}")
                
        summary[cls_id] = extracted_count
        
    print("\n--- Sprite Extraction Summary ---")
    for cls_id, (subfolder, s_name) in CLASSES.items():
        print(f"Class {cls_id} ({s_name}): {summary[cls_id]} sprites saved in {SPRITES_DIR / f'class_{cls_id}_{s_name}'}")

if __name__ == "__main__":
    main()
