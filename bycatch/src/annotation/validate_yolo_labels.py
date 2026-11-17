"""
YOLO Annotation Validator for ByCatch AI (Phase 5).
Validates format, coordinates, class IDs, IoU duplicates, and edge cases.
"""

from pathlib import Path
from typing import List, Dict, Any, Tuple

VALID_CLASSES = {0, 1, 2}
MIN_BOX_DIM = 0.005  # Normalized minimum width/height (e.g. at least 3-4 px on 640x640)
MAX_BOX_COVERAGE = 0.99  # Flag if single box covers nearly entire image

def compute_box_iou(b1: Tuple[float, float, float, float], b2: Tuple[float, float, float, float]) -> float:
    """Compute IoU between two YOLO boxes: (xc, yc, w, h)."""
    xc1, yc1, w1, h1 = b1
    xc2, yc2, w2, h2 = b2

    x1_min, y1_min = xc1 - w1 / 2, yc1 - h1 / 2
    x1_max, y1_max = xc1 + w1 / 2, yc1 + h1 / 2

    x2_min, y2_min = xc2 - w2 / 2, yc2 - h2 / 2
    x2_max, y2_max = xc2 + w2 / 2, yc2 + h2 / 2

    inter_xmin = max(x1_min, x2_min)
    inter_ymin = max(y1_min, y2_min)
    inter_xmax = min(x1_max, x2_max)
    inter_ymax = min(y1_max, y2_max)

    inter_w = max(0.0, inter_xmax - inter_xmin)
    inter_h = max(0.0, inter_ymax - inter_ymin)
    inter_area = inter_w * inter_h

    area1 = w1 * h1
    area2 = w2 * h2
    union_area = area1 + area2 - inter_area

    if union_area <= 0:
        return 0.0
    return inter_area / union_area

def validate_yolo_label_file(label_path: Path, expected_class_id: int = None) -> Dict[str, Any]:
    """
    Validates a single YOLO format label file (.txt).
    Returns dict with validity boolean, boxes list, errors, and warnings.
    """
    result = {
        "label_path": str(label_path),
        "is_valid": True,
        "is_negative_image": False,
        "box_count": 0,
        "boxes": [],
        "errors": [],
        "warnings": []
    }

    if not label_path.exists():
        result["is_valid"] = False
        result["errors"].append("Label file does not exist")
        return result

    lines = [line.strip() for line in label_path.read_text(encoding="utf-8").splitlines() if line.strip()]

    # 1. Empty file check (legitimate negative background image)
    if not lines:
        result["is_negative_image"] = True
        return result

    parsed_boxes = []
    for line_idx, line in enumerate(lines, 1):
        parts = line.split()
        if len(parts) != 5:
            result["is_valid"] = False
            result["errors"].append(f"Line {line_idx}: Expected 5 columns, found {len(parts)} ('{line}')")
            continue

        try:
            cls_id = int(parts[0])
            xc, yc, w, h = map(float, parts[1:])
        except ValueError as e:
            result["is_valid"] = False
            result["errors"].append(f"Line {line_idx}: Non-numeric value ({e})")
            continue

        # Class ID check
        if cls_id not in VALID_CLASSES:
            result["is_valid"] = False
            result["errors"].append(f"Line {line_idx}: Invalid class ID {cls_id}. Allowed: {VALID_CLASSES}")

        # Coordinate bounds [0.0, 1.0]
        for val_name, val in [("x_center", xc), ("y_center", yc), ("width", w), ("height", h)]:
            if not (0.0 <= val <= 1.0):
                result["is_valid"] = False
                result["errors"].append(f"Line {line_idx}: {val_name} {val} out of bounds [0.0, 1.0]")

        # Dimension checks
        if w <= MIN_BOX_DIM or h <= MIN_BOX_DIM:
            result["warnings"].append(f"Line {line_idx}: Bounding box width/height is extremely small (w={w:.4f}, h={h:.4f})")
        if w > MAX_BOX_COVERAGE and h > MAX_BOX_COVERAGE:
            result["warnings"].append(f"Line {line_idx}: Bounding box covers practically entire image (w={w:.4f}, h={h:.4f})")

        # Class conflict check against single-species folder
        if expected_class_id is not None and cls_id != expected_class_id:
            result["warnings"].append(f"Line {line_idx}: Box class {cls_id} does not match expected folder class {expected_class_id}")

        parsed_boxes.append((cls_id, xc, yc, w, h))

    # Check for near-duplicate boxes (IoU > 0.95 same class)
    for i in range(len(parsed_boxes)):
        for j in range(i + 1, len(parsed_boxes)):
            c1, b1 = parsed_boxes[i][0], parsed_boxes[i][1:]
            c2, b2 = parsed_boxes[j][0], parsed_boxes[j][1:]
            if c1 == c2:
                iou = compute_box_iou(b1, b2)
                if iou > 0.95:
                    result["warnings"].append(f"Boxes {i+1} and {j+1} have excessive overlap (IoU = {iou:.3f})")

    result["box_count"] = len(parsed_boxes)
    result["boxes"] = parsed_boxes
    if result["errors"]:
        result["is_valid"] = False

    return result
