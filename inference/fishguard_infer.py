"""
FishGuard AI - Standalone Inference & Catch Composition Engine
Supports CLI and Python API for high-precision species detection and catch composition analysis.
"""

import os
import sys
import argparse
import numpy as np
import cv2
from pathlib import Path
from ultralytics import YOLO

SPECIES_METADATA = {
    0: {
        "scientific_name": "Rastrelliger brachysoma",
        "common_name": "Kembung Perempuan",
        "color": (255, 120, 0) # BGR
    },
    1: {
        "scientific_name": "Selaroides leptolepis",
        "common_name": "Selar Kuning",
        "color": (0, 215, 255) # BGR: Gold/Yellow
    },
    2: {
        "scientific_name": "Upeneus sulphureus",
        "common_name": "Kuniran",
        "color": (0, 165, 255) # BGR: Orange
    }
}

class FishGuardInferenceEngine:
    def __init__(self, model_path: str = None, device: str = "cpu"):
        if model_path is None:
            default_weights = Path(__file__).resolve().parent.parent / "backend" / "weights" / "fishguard_yolo.pt"
            if not default_weights.exists():
                default_weights = Path(__file__).resolve().parent.parent / "PHASES" / "PHASE_13" / "runs" / "baseline_yolov8n_v001" / "weights" / "best.pt"
            model_path = str(default_weights)
            
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model weights not found at: {model_path}")
            
        print(f"[FishGuard] Loading weights: {model_path} on {device}")
        self.model = YOLO(model_path)
        self.device = device
        
    def predict(self, source, conf: float = 0.25, iou: float = 0.45):
        """
        Runs inference on an image path or numpy image array.
        Returns a structured dictionary with detections, counts, and catch composition.
        """
        results = self.model.predict(source=source, conf=conf, iou=iou, device=self.device, verbose=False)[0]
        
        detections = []
        counts = {0: 0, 1: 0, 2: 0}
        
        if results.boxes is not None and len(results.boxes) > 0:
            for box in results.boxes:
                cls_id = int(box.cls.item())
                score = float(box.conf.item())
                xyxy = [round(float(coord), 1) for coord in box.xyxy[0].tolist()]
                
                meta = SPECIES_METADATA.get(cls_id, {
                    "scientific_name": f"Class_{cls_id}",
                    "common_name": "Unknown",
                    "color": (200, 200, 200)
                })
                
                counts[cls_id] = counts.get(cls_id, 0) + 1
                detections.append({
                    "class_id": cls_id,
                    "scientific_name": meta["scientific_name"],
                    "common_name": meta["common_name"],
                    "confidence": round(score, 4),
                    "box": xyxy,
                    "width_px": round(xyxy[2] - xyxy[0], 1),
                    "height_px": round(xyxy[3] - xyxy[1], 1)
                })
                
        total_fish = len(detections)
        composition = {}
        for c_id, count in counts.items():
            meta = SPECIES_METADATA[c_id]
            pct = round((count / total_fish) * 100.0, 1) if total_fish > 0 else 0.0
            composition[meta["scientific_name"]] = {
                "common_name": meta["common_name"],
                "count": count,
                "percentage": pct
            }
            
        return {
            "total_count": total_fish,
            "composition": composition,
            "detections": detections,
            "speed_ms": {
                "preprocess": round(float(results.speed.get("preprocess", 0.0)), 2),
                "inference": round(float(results.speed.get("inference", 0.0)), 2),
                "postprocess": round(float(results.speed.get("postprocess", 0.0)), 2)
            }
        }
        
    def annotate(self, image_input, output_dict, show_labels: bool = True, show_banner: bool = True):
        """
        Draws bounding boxes and metadata banner on the image.
        """
        if isinstance(image_input, (str, Path)):
            img = cv2.imread(str(image_input))
            if img is None:
                raise ValueError(f"Could not load image: {image_input}")
        else:
            img = image_input.copy()
            
        h, w = img.shape[:2]
        
        # Draw detections
        for det in output_dict["detections"]:
            x1, y1, x2, y2 = map(int, det["box"])
            cid = det["class_id"]
            meta = SPECIES_METADATA.get(cid, {"color": (0, 255, 0)})
            color = meta["color"]
            
            cv2.rectangle(img, (x1, y1), (x2, y2), color, 2)
            
            if show_labels:
                label = f"{det['scientific_name']} ({det['confidence']:.2f})"
                (lw, lh), base = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.45, 1)
                cv2.rectangle(img, (x1, max(0, y1 - lh - 6)), (x1 + lw + 4, y1), color, -1)
                cv2.putText(img, label, (x1 + 2, max(12, y1 - 3)), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 0), 1, cv2.LINE_AA)
                
        # Draw top banner if requested
        if show_banner:
            banner_h = 45
            overlay = img.copy()
            cv2.rectangle(overlay, (0, 0), (w, banner_h), (30, 30, 30), -1)
            cv2.addWeighted(overlay, 0.85, img, 0.15, 0, img)
            
            title = f"FishGuard AI | Total: {output_dict['total_count']} fish"
            comp_str = " | ".join([f"{data['common_name']}: {data['count']} ({data['percentage']}%)" for name, data in output_dict["composition"].items() if data["count"] > 0])
            if not comp_str:
                comp_str = "No fish detected"
                
            cv2.putText(img, title, (15, 18), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (255, 255, 255), 1, cv2.LINE_AA)
            cv2.putText(img, comp_str, (15, 36), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (200, 240, 255), 1, cv2.LINE_AA)
            
        return img

def main():
    parser = argparse.ArgumentParser(description="FishGuard AI Inference Engine")
    parser.add_argument("--image", type=str, required=True, help="Path to input image")
    parser.add_argument("--weights", type=str, default=None, help="Path to YOLO model weights")
    parser.add_argument("--conf", type=float, default=0.25, help="Confidence threshold")
    parser.add_argument("--iou", type=float, default=0.45, help="NMS IoU threshold")
    parser.add_argument("--output", type=str, default=None, help="Path to save annotated image")
    args = parser.parse_args()
    
    engine = FishGuardInferenceEngine(model_path=args.weights)
    result = engine.predict(source=args.image, conf=args.conf, iou=args.iou)
    
    print("\n--- INFERENCE RESULTS ---")
    print(f"Total Fish Detected: {result['total_count']}")
    for sp, data in result["composition"].items():
        print(f"  - {sp} ({data['common_name']}): {data['count']} ({data['percentage']}%)")
    print(f"Latency: Pre: {result['speed_ms']['preprocess']}ms | Infer: {result['speed_ms']['inference']}ms | Post: {result['speed_ms']['postprocess']}ms")
    
    if args.output:
        annotated = engine.annotate(args.image, result)
        out_path = Path(args.output)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        cv2.imwrite(str(out_path), annotated)
        print(f"Annotated image saved to: {out_path}")

if __name__ == "__main__":
    main()
