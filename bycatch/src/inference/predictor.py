"""
FishDetector Inference Engine for ByCatch AI (Phase 10).
Handles lazy loading of YOLO weights, status verification, and bounding box predictions.
Strictly returns status='model_missing' if no weights are active (NEVER generates fake predictions).
"""

import json
from pathlib import Path
from typing import Dict, Any, List, Optional
from PIL import Image
import yaml
import torch

from .preprocess import preprocess_image_for_inference

class FishDetector:
    def __init__(self, root_dir: Path):
        self.root_dir = root_dir
        self.active_model_cfg = root_dir / "models" / "weights" / "active_model.json"
        self.classes_yaml = root_dir / "configs" / "classes.yaml"
        self.model = None
        self.model_status = "uninitialized"
        self.model_metadata = {}
        self.class_names = {}
        self._check_status()

    def _check_status(self):
        """Verifies if an active model weight is registered and exists."""
        # 1. Load canonical classes
        if self.classes_yaml.exists():
            with open(self.classes_yaml, "r", encoding="utf-8") as f:
                cfg = yaml.safe_load(f)
                self.class_names = {i: name for i, name in enumerate(cfg.get("names", []))}

        # 2. Check active_model.json
        if not self.active_model_cfg.exists():
            self.model_status = "model_missing"
            return

        try:
            active_info = json.loads(self.active_model_cfg.read_text(encoding="utf-8"))
            weight_path = Path(active_info.get("weight_path", ""))
            if not weight_path.is_absolute():
                weight_path = self.root_dir / weight_path

            if not weight_path.exists():
                self.model_status = "model_missing"
                return

            self.model_metadata = active_info
            self.weight_path = weight_path
            self.model_status = "ready"
        except Exception:
            self.model_status = "load_error"

    def load_model(self):
        """Lazy loads the model on GPU if available, else CPU."""
        if self.model is not None:
            return

        if self.model_status != "ready":
            return

        try:
            from ultralytics import YOLO
            self.model = YOLO(str(self.weight_path))
            device = 0 if torch.cuda.is_available() else "cpu"
            self.model.to(device)
        except Exception as e:
            self.model_status = "load_error"
            print(f"Failed to load YOLO model: {e}")

    def predict(self, image_input, conf_thresh: float = 0.25) -> Dict[str, Any]:
        """
        Executes inference on an image.
        Returns dict containing detections list and metadata.
        """
        if self.model_status != "ready":
            return {
                "status": self.model_status,
                "error": "Model weights are missing or not registered in active_model.json",
                "detections": []
            }

        self.load_model()
        if self.model is None:
            return {
                "status": "load_error",
                "error": "Model failed to load into memory",
                "detections": []
            }

        rgb_img, orig_w, orig_h = preprocess_image_for_inference(image_input)

        # Run inference
        results = self.model(rgb_img, conf=conf_thresh, verbose=False)
        first_res = results[0]

        detections = []
        if first_res.boxes:
            for box in first_res.boxes:
                cls_id = int(box.cls[0].item())
                conf = float(box.conf[0].item())
                # Normalized xywh
                xywhn = box.xywhn[0].tolist()
                xc, yc, w, h = xywhn
                # Pixel coordinates xyxy
                xyxy = box.xyxy[0].tolist()
                x1, y1, x2, y2 = map(int, xyxy)

                cls_name = self.class_names.get(cls_id, f"class_{cls_id}")

                detections.append({
                    "class_id": cls_id,
                    "class_name": cls_name,
                    "confidence": round(conf, 4),
                    "bbox_norm": [round(v, 4) for v in [xc, yc, w, h]],
                    "bbox_pixel": [x1, y1, x2, y2]
                })

        return {
            "status": "success",
            "image_size": [orig_w, orig_h],
            "detections": detections,
            "total_detected": len(detections)
        }
