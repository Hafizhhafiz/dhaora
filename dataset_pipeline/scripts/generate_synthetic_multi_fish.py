import os
import random
import cv2
import numpy as np
from pathlib import Path
from PIL import Image

WORKSPACE = Path(r"c:\TUGAS-TUGAS KULIAH\SEMESTER 5\ASIK VOL VI")
SPRITES_DIR = WORKSPACE / "dataset_pipeline" / "data" / "sprites"
OUT_BASE = WORKSPACE / "dataset_pipeline" / "data" / "synthetic_multispecies"

IMG_WIDTH = 1280
IMG_HEIGHT = 960

CLASSES = {
    0: ("class_0_brachysoma", "Rastrelliger brachysoma"),
    1: ("class_1_leptolepis", "Selaroides leptolepis"),
    2: ("class_2_sulphureus", "Upeneus sulphureus")
}

def load_all_sprites():
    sprites_dict = {0: [], 1: [], 2: []}
    for cls_id, (folder_name, _) in CLASSES.items():
        folder = SPRITES_DIR / folder_name
        for p in folder.glob("*.png"):
            sprite = cv2.imread(str(p), cv2.IMREAD_UNCHANGED)
            if sprite is not None and sprite.shape[2] == 4:
                sprites_dict[cls_id].append(sprite)
    return sprites_dict

def generate_background(bg_type="stainless"):
    """Generates procedural realistic fishery backgrounds."""
    w, h = IMG_WIDTH, IMG_HEIGHT
    
    if bg_type == "stainless":
        # Brushed stainless steel table
        base = np.full((h, w, 3), 160, dtype=np.uint8)
        # Add horizontal brush grain
        noise_line = np.random.normal(0, 15, (h, 1, 3)).astype(np.int16)
        base = np.clip(base.astype(np.int16) + noise_line, 0, 255).astype(np.uint8)
        # Specular sheen / lighting gradient
        gradient = np.linspace(0.85, 1.15, w).reshape(1, w, 1)
        base = np.clip(base.astype(np.float32) * gradient, 0, 255).astype(np.uint8)
        # Add slight circular vignette
        Y, X = np.ogrid[:h, :w]
        dist = np.sqrt((X - w/2)**2 + (Y - h/2)**2)
        max_dist = np.sqrt((w/2)**2 + (h/2)**2)
        vignette = 1.0 - 0.25 * (dist / max_dist)
        base = np.clip(base.astype(np.float32) * vignette[:, :, None], 0, 255).astype(np.uint8)
        return base

    elif bg_type == "blue_crate":
        # HDPE Blue Fishery Crate
        base = np.zeros((h, w, 3), dtype=np.uint8)
        base[:, :] = (150, 80, 20) # Deep ocean blue BGR
        # Grid ribbing pattern
        grid = np.zeros((h, w), dtype=np.float32)
        grid[::40, :] = 30
        grid[:, ::40] = 30
        grid = cv2.GaussianBlur(grid, (9, 9), 0)
        base = np.clip(base.astype(np.float32) + grid[:, :, None], 0, 255).astype(np.uint8)
        # Lighting gradient
        Y, X = np.ogrid[:h, :w]
        dist = np.sqrt((X - w/2)**2 + (Y - h/2)**2)
        vignette = 1.1 - 0.35 * (dist / np.sqrt((w/2)**2 + (h/2)**2))
        return np.clip(base.astype(np.float32) * vignette[:, :, None], 0, 255).astype(np.uint8)

    elif bg_type == "wood_board":
        # Wet wooden sorting board
        base = np.full((h, w, 3), (80, 130, 175), dtype=np.uint8) # Warm wood BGR
        grain = np.random.normal(0, 18, (h, 1, 3)).astype(np.int16)
        grain = cv2.blur(grain, (1, 15))
        base = np.clip(base.astype(np.int16) + grain, 0, 255).astype(np.uint8)
        return base

    else:
        # Crushed ice bed
        base = np.full((h, w, 3), (240, 235, 220), dtype=np.uint8) # Ice white-blue
        noise = np.random.normal(0, 25, (h, w, 3)).astype(np.int16)
        base = np.clip(base.astype(np.int16) + noise, 0, 255).astype(np.uint8)
        base = cv2.GaussianBlur(base, (3, 3), 0)
        return base

def rotate_and_scale_sprite(sprite, scale, angle, flip_h=False):
    if flip_h:
        sprite = cv2.flip(sprite, 1)
        
    sh, sw = sprite.shape[:2]
    new_w = max(20, int(sw * scale))
    new_h = max(20, int(sh * scale))
    resized = cv2.resize(sprite, (new_w, new_h), interpolation=cv2.INTER_AREA)
    
    # Rotate with bounding box expansion
    center = (new_w // 2, new_h // 2)
    M = cv2.getRotationMatrix2D(center, angle, 1.0)
    cos = np.abs(M[0, 0])
    sin = np.abs(M[0, 1])
    bound_w = int((new_h * sin) + (new_w * cos))
    bound_h = int((new_h * cos) + (new_w * sin))
    M[0, 2] += (bound_w / 2) - center[0]
    M[1, 2] += (bound_h / 2) - center[1]
    
    rotated = cv2.warpAffine(resized, M, (bound_w, bound_h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=(0,0,0,0))
    return rotated

def blend_sprite_onto_canvas(canvas, sprite, x, y):
    """Blends RGBA sprite onto BGR canvas and adds a soft shadow."""
    ch, cw = canvas.shape[:2]
    sh, sw = sprite.shape[:2]
    
    # Shadow offset
    shadow_ox = int(sw * 0.02) + 4
    shadow_oy = int(sh * 0.02) + 4
    
    # 1. Contact shadow
    alpha = sprite[:, :, 3].astype(np.float32) / 255.0
    shadow_mask = (cv2.GaussianBlur(alpha, (15, 15), 0) * 0.45)[:, :, None]
    
    sx1 = max(0, x + shadow_ox)
    sy1 = max(0, y + shadow_oy)
    sx2 = min(cw, x + sw + shadow_ox)
    sy2 = min(ch, y + sh + shadow_oy)
    
    crop_sx1 = max(0, -x - shadow_ox)
    crop_sy1 = max(0, -y - shadow_oy)
    crop_sx2 = crop_sx1 + (sx2 - sx1)
    crop_sy2 = crop_sy1 + (sy2 - sy1)
    
    if sx2 > sx1 and sy2 > sy1:
        s_alpha = shadow_mask[crop_sy1:crop_sy2, crop_sx1:crop_sx2]
        canvas[sy1:sy2, sx1:sx2] = (canvas[sy1:sy2, sx1:sx2].astype(np.float32) * (1.0 - s_alpha)).astype(np.uint8)

    # 2. Main fish sprite blend
    x1 = max(0, x)
    y1 = max(0, y)
    x2 = min(cw, x + sw)
    y2 = min(ch, y + sh)
    
    cx1 = max(0, -x)
    cy1 = max(0, -y)
    cx2 = cx1 + (x2 - x1)
    cy2 = cy1 + (y2 - y1)
    
    if x2 > x1 and y2 > y1:
        sub_sprite = sprite[cy1:cy2, cx1:cx2]
        sub_alpha = (sub_sprite[:, :, 3].astype(np.float32) / 255.0)[:, :, None]
        sub_bgr = sub_sprite[:, :, :3].astype(np.float32)
        
        target_roi = canvas[y1:y2, x1:x2].astype(np.float32)
        blended = sub_bgr * sub_alpha + target_roi * (1.0 - sub_alpha)
        canvas[y1:y2, x1:x2] = np.clip(blended, 0, 255).astype(np.uint8)
        
        # Calculate tight bounding box from alpha
        binary_alpha = sub_sprite[:, :, 3] > 30
        ys, xs = np.where(binary_alpha)
        if len(xs) > 100:
            bbox_x1 = x1 + np.min(xs)
            bbox_y1 = y1 + np.min(ys)
            bbox_x2 = x1 + np.max(xs)
            bbox_y2 = y1 + np.max(ys)
            return (bbox_x1, bbox_y1, bbox_x2, bbox_y2)
    return None

def generate_scene(sprites_dict, bg_type):
    canvas = generate_background(bg_type)
    num_fish = random.randint(4, 9)
    
    bboxes = []
    
    for _ in range(num_fish):
        # Sample class (ensure all 3 classes appear)
        cls_id = random.choice([0, 1, 2])
        sprite_pool = sprites_dict[cls_id]
        if not sprite_pool:
            continue
        raw_sprite = random.choice(sprite_pool)
        
        # Random scale
        scale = random.uniform(0.18, 0.32)
        # Realistic orientation: mostly horizontal with some tilt
        angle = random.choice([
            random.uniform(-30, 30),
            random.uniform(150, 210)
        ])
        flip_h = random.choice([True, False])
        
        trans_sprite = rotate_and_scale_sprite(raw_sprite, scale, angle, flip_h)
        sh, sw = trans_sprite.shape[:2]
        
        # Random position with margins
        px = random.randint(int(IMG_WIDTH * 0.05), max(int(IMG_WIDTH * 0.05) + 10, IMG_WIDTH - sw - int(IMG_WIDTH * 0.05)))
        py = random.randint(int(IMG_HEIGHT * 0.05), max(int(IMG_HEIGHT * 0.05) + 10, IMG_HEIGHT - sh - int(IMG_HEIGHT * 0.05)))
        
        box = blend_sprite_onto_canvas(canvas, trans_sprite, px, py)
        if box is not None:
            bx1, by1, bx2, by2 = box
            bw = bx2 - bx1
            bh = by2 - by1
            if bw > 30 and bh > 20:
                xc = (bx1 + bx2) / 2.0 / IMG_WIDTH
                yc = (by1 + by2) / 2.0 / IMG_HEIGHT
                norm_w = bw / IMG_WIDTH
                norm_h = bh / IMG_HEIGHT
                bboxes.append((cls_id, xc, yc, norm_w, norm_h))
                
    return canvas, bboxes

def main():
    print("Loading extracted sprites...")
    sprites_dict = load_all_sprites()
    for cls_id, lst in sprites_dict.items():
        print(f"  Class {cls_id} ({CLASSES[cls_id][1]}): {len(lst)} sprites loaded")
        
    for split in ["train", "val"]:
        (OUT_BASE / "images" / split).mkdir(parents=True, exist_ok=True)
        (OUT_BASE / "labels" / split).mkdir(parents=True, exist_ok=True)
        
    bg_choices = ["stainless", "blue_crate", "wood_board", "ice"]
    
    splits_cfg = [("train", 100), ("val", 25)]
    total_generated = 0
    
    for split_name, n_images in splits_cfg:
        print(f"\nGenerating {n_images} synthetic multi-fish scenes for {split_name} split...")
        for i in range(n_images):
            bg = random.choice(bg_choices)
            canvas, bboxes = generate_scene(sprites_dict, bg)
            
            img_filename = f"synth_{split_name}_{i+1:04d}_{bg}.jpg"
            lbl_filename = f"synth_{split_name}_{i+1:04d}_{bg}.txt"
            
            img_path = OUT_BASE / "images" / split_name / img_filename
            lbl_path = OUT_BASE / "labels" / split_name / lbl_filename
            
            cv2.imwrite(str(img_path), canvas)
            
            with open(lbl_path, "w", encoding="utf-8") as f_lbl:
                for cls_id, xc, yc, nw, nh in bboxes:
                    f_lbl.write(f"{cls_id} {xc:.6f} {yc:.6f} {nw:.6f} {nh:.6f}\n")
                    
            total_generated += 1
            if (i + 1) % 25 == 0:
                print(f"  [{split_name}] Generated {i+1}/{n_images} images (last had {len(bboxes)} fish)")
                
    # Generate dataset.yaml
    yaml_content = f"""# FishGuard AI - Synthetic Multi-Species Dataset
path: {OUT_BASE.resolve().as_posix()}
train: images/train
val: images/val

names:
  0: Rastrelliger brachysoma
  1: Selaroides leptolepis
  2: Upeneus sulphureus
"""
    yaml_path = OUT_BASE / "dataset.yaml"
    with open(yaml_path, "w", encoding="utf-8") as f:
        f.write(yaml_content)
    print(f"\nSaved YOLO dataset YAML to {yaml_path}")
    print(f"Total synthetic multi-fish scenes generated: {total_generated} images with YOLO annotations.")

if __name__ == "__main__":
    main()
