"""
YOLO Label Visualizer for ByCatch AI (Phase 5).
Renders bounding boxes and class names onto images for quality control verification.
"""

from pathlib import Path
from typing import List, Tuple, Optional
from PIL import Image, ImageDraw, ImageFont

CLASS_CONFIG = {
    0: {"name": "kembung_perempuan", "color": (50, 150, 255)},    # Blue
    1: {"name": "selar_kuning", "color": (255, 215, 0)},         # Gold / Yellow
    2: {"name": "kuniran", "color": (255, 120, 50)}              # Coral / Orange
}

def draw_yolo_boxes(
    image_path: Path,
    boxes: List[Tuple[int, float, float, float, float]],
    output_path: Path
) -> Optional[Path]:
    """
    Renders bounding boxes on image and saves to output_path.
    Boxes format: (class_id, xc, yc, w, h) in normalized 0-1 coords.
    """
    if not image_path.exists():
        return None

    try:
        with Image.open(image_path) as img:
            vis = img.convert("RGB")
            draw = ImageDraw.Draw(vis)
            img_w, img_h = vis.size

            for cls_id, xc, yc, w, h in boxes:
                cfg = CLASS_CONFIG.get(cls_id, {"name": f"cls_{cls_id}", "color": (200, 200, 200)})
                color = cfg["color"]
                name = cfg["name"]

                # Denormalize coordinates
                x1 = int(round((xc - w / 2) * img_w))
                y1 = int(round((yc - h / 2) * img_h))
                x2 = int(round((xc + w / 2) * img_w))
                y2 = int(round((yc + h / 2) * img_h))

                # Draw rectangle (3-pixel width)
                for i in range(3):
                    draw.rectangle([x1 - i, y1 - i, x2 + i, y2 + i], outline=color)

                # Draw label text with background banner
                label_text = f"{name} ({cls_id})"
                text_bbox = draw.textbbox((x1, y1 - 16), label_text)
                draw.rectangle(text_bbox, fill=color)
                draw.text((x1 + 2, y1 - 16), label_text, fill=(0, 0, 0))

            output_path.parent.mkdir(parents=True, exist_ok=True)
            vis.save(output_path, "JPEG", quality=90)
            return output_path
    except Exception as e:
        print(f"Error visualizing {image_path}: {e}")
        return None
