"""
FishGuard AI - Comprehensive Model Evaluation Script (Phase 13)
Evaluates trained YOLOv8n weights on:
1. Frozen independent test set (25 images, 168 ground truth instances)
2. Out-of-Distribution (OOD) look-alike benchmark (177 verified GBIF images)
3. Count & Catch composition metrics
"""

import os
import sys
import json
import time
import argparse
import numpy as np
import pandas as pd
from pathlib import Path
from ultralytics import YOLO

WORKSPACE = Path(r"c:\TUGAS-TUGAS KULIAH\SEMESTER 5\ASIK VOL VI")
CLASS_NAMES = {
    0: "Rastrelliger brachysoma",
    1: "Selaroides leptolepis",
    2: "Upeneus sulphureus"
}

def load_ground_truth_labels(label_path):
    boxes = []
    if not label_path.exists():
        return boxes
    with open(label_path, "r", encoding="utf-8") as f:
        for line in f:
            parts = line.strip().split()
            if len(parts) >= 5:
                cls_id = int(parts[0])
                cx, cy, w, h = map(float, parts[1:5])
                boxes.append({"class_id": cls_id, "bbox": [cx, cy, w, h]})
    return boxes

def evaluate_test_set(model, data_yaml, test_images_dir, test_labels_dir, output_dir, conf=0.25, iou=0.45):
    print("\n=======================================================")
    print("STEP 1: EVALUATING FROZEN INDEPENDENT TEST SET")
    print("=======================================================")
    
    # 1. Native YOLO validation on test split
    print("Running YOLO test split validation...")
    val_results = model.val(
        data=str(data_yaml),
        split="test",
        conf=conf,
        iou=iou,
        plots=True,
        project=str(output_dir),
        name="test_native_val",
        exist_ok=True,
        device="cpu"
    )
    
    # Extract native metrics
    box_metrics = val_results.box
    overall_p = float(box_metrics.p.mean()) if hasattr(box_metrics.p, 'mean') else float(box_metrics.mp)
    overall_r = float(box_metrics.r.mean()) if hasattr(box_metrics.r, 'mean') else float(box_metrics.mr)
    overall_map50 = float(box_metrics.map50)
    overall_map50_95 = float(box_metrics.map)
    f1_score = 2 * (overall_p * overall_r) / (overall_p + overall_r + 1e-8)
    
    # Per-class metrics
    per_class_metrics = {}
    class_indices = list(box_metrics.maps.keys()) if hasattr(box_metrics, 'maps') and isinstance(box_metrics.maps, dict) else [0, 1, 2]
    
    for c_id in [0, 1, 2]:
        c_name = CLASS_NAMES[c_id]
        p_c = float(box_metrics.p[c_id]) if len(box_metrics.p) > c_id else 0.0
        r_c = float(box_metrics.r[c_id]) if len(box_metrics.r) > c_id else 0.0
        map50_c = float(box_metrics.all_ap[c_id][0]) if hasattr(box_metrics, 'all_ap') and len(box_metrics.all_ap) > c_id else 0.0
        map_c = float(box_metrics.all_ap[c_id].mean()) if hasattr(box_metrics, 'all_ap') and len(box_metrics.all_ap) > c_id else 0.0
        f1_c = 2 * (p_c * r_c) / (p_c + r_c + 1e-8)
        per_class_metrics[c_id] = {
            "species_name": c_name,
            "precision": round(p_c, 4),
            "recall": round(r_c, 4),
            "f1_score": round(f1_c, 4),
            "map50": round(map50_c, 4),
            "map50_95": round(map_c, 4)
        }
        
    speed_info = {
        "preprocess_ms": round(float(val_results.speed.get("preprocess", 0.0)), 2),
        "inference_ms": round(float(val_results.speed.get("inference", 0.0)), 2),
        "postprocess_ms": round(float(val_results.speed.get("postprocess", 0.0)), 2),
    }
    speed_info["total_latency_ms"] = round(sum(speed_info.values()), 2)
    speed_info["fps"] = round(1000.0 / (speed_info["total_latency_ms"] + 1e-6), 2)
    
    # 2. Detailed Per-Image Counting and Composition Evaluation
    print("\nRunning granular image-by-image count and composition evaluation...")
    test_images = sorted(list(test_images_dir.glob("*.jpg")) + list(test_images_dir.glob("*.png")))
    image_eval_records = []
    
    gt_total_counts = []
    pred_total_counts = []
    
    gt_class_counts = {0: [], 1: [], 2: []}
    pred_class_counts = {0: [], 1: [], 2: []}
    
    inference_times = []
    
    for img_path in test_images:
        label_file = test_labels_dir / f"{img_path.stem}.txt"
        gt_boxes = load_ground_truth_labels(label_file)
        
        gt_counts = {0: 0, 1: 0, 2: 0}
        for b in gt_boxes:
            c = b["class_id"]
            if c in gt_counts:
                gt_counts[c] += 1
                
        # Inference
        t0 = time.perf_counter()
        results = model.predict(source=str(img_path), conf=conf, iou=iou, device="cpu", verbose=False)[0]
        t1 = time.perf_counter()
        inference_times.append((t1 - t0) * 1000.0)
        
        pred_counts = {0: 0, 1: 0, 2: 0}
        detected_boxes = []
        if results.boxes is not None and len(results.boxes) > 0:
            for box in results.boxes:
                cls_id = int(box.cls.item())
                score = float(box.conf.item())
                xyxy = [round(float(x), 1) for x in box.xyxy[0].tolist()]
                if cls_id in pred_counts:
                    pred_counts[cls_id] += 1
                detected_boxes.append({"class_id": cls_id, "confidence": round(score, 4), "box": xyxy})
                
        gt_tot = sum(gt_counts.values())
        pred_tot = sum(pred_counts.values())
        
        gt_total_counts.append(gt_tot)
        pred_total_counts.append(pred_tot)
        
        for c in [0, 1, 2]:
            gt_class_counts[c].append(gt_counts[c])
            pred_class_counts[c].append(pred_counts[c])
            
        record = {
            "image": img_path.name,
            "gt_total": gt_tot,
            "pred_total": pred_tot,
            "abs_count_error": abs(pred_tot - gt_tot),
            "exact_match": bool(pred_tot == gt_tot),
            "within_plus_minus_1": bool(abs(pred_tot - gt_tot) <= 1),
            "gt_by_class": gt_counts,
            "pred_by_class": pred_counts,
            "num_detections": len(detected_boxes)
        }
        image_eval_records.append(record)
        
    # Compute counting metrics
    total_mae = float(np.mean([r["abs_count_error"] for r in image_eval_records]))
    total_rmse = float(np.sqrt(np.mean([r["abs_count_error"] ** 2 for r in image_eval_records])))
    exact_match_pct = float(np.mean([1.0 if r["exact_match"] else 0.0 for r in image_eval_records]) * 100.0)
    within_1_pct = float(np.mean([1.0 if r["within_plus_minus_1"] else 0.0 for r in image_eval_records]) * 100.0)
    
    class_maes = {}
    for c in [0, 1, 2]:
        c_errors = [abs(p - g) for p, g in zip(pred_class_counts[c], gt_class_counts[c])]
        class_maes[c] = round(float(np.mean(c_errors)), 3)
        
    test_metrics = {
        "dataset_name": "fishguard_v001_test",
        "num_test_images": len(test_images),
        "total_gt_instances": int(sum(gt_total_counts)),
        "total_pred_instances": int(sum(pred_total_counts)),
        "detection_metrics": {
            "precision": round(overall_p, 4),
            "recall": round(overall_r, 4),
            "f1_score": round(f1_score, 4),
            "map50": round(overall_map50, 4),
            "map50_95": round(overall_map50_95, 4),
            "per_class": per_class_metrics
        },
        "counting_metrics": {
            "overall_mae": round(total_mae, 3),
            "overall_rmse": round(total_rmse, 3),
            "exact_count_accuracy_pct": round(exact_match_pct, 2),
            "within_plus_minus_1_accuracy_pct": round(within_1_pct, 2),
            "class_mae": {CLASS_NAMES[c]: class_maes[c] for c in [0, 1, 2]}
        },
        "speed_benchmark_cpu": speed_info,
        "granular_results": image_eval_records
    }
    
    return test_metrics

def evaluate_ood(model, ood_manifest_csv, output_dir, conf_thresholds=[0.25, 0.50]):
    print("\n=======================================================")
    print("STEP 2: EVALUATING OUT-OF-DISTRIBUTION (OOD) BENCHMARK")
    print("=======================================================")
    
    df = pd.read_csv(ood_manifest_csv)
    ood_rows = df[df["phase12_allocation"] == "OOD_EVALUATION_SET"].copy()
    print(f"Total OOD records in manifest: {len(ood_rows)}")
    
    # Locate images on disk across entire GBIF dataset repository
    gbif_root = WORKSPACE / "dataset_pipeline" / "data" / "public" / "gbif"
    file_map = {}
    if gbif_root.exists():
        for p in gbif_root.rglob("*.*"):
            if p.is_file() and p.suffix.lower() in [".jpg", ".jpeg", ".png", ".webp"]:
                file_map[p.name] = p
                
    found_records = []
    missing_records = []
    
    for idx, row in ood_rows.iterrows():
        fname = row["filename"]
        if fname in file_map:
            found_records.append((row, file_map[fname]))
        else:
            missing_records.append(fname)
            
    print(f"Found {len(found_records)} OOD images on disk (Missing: {len(missing_records)}).")
    
    ood_results = []
    
    for row, img_path in found_records:
        species_code = row["species_code"]
        sci_name = row["scientific_name"]
        
        # Inference at low confidence 0.25
        res = model.predict(source=str(img_path), conf=0.25, device="cpu", verbose=False)[0]
        
        detections_025 = []
        detections_050 = []
        
        if res.boxes is not None and len(res.boxes) > 0:
            for b in res.boxes:
                c = int(b.cls.item())
                s = float(b.conf.item())
                detections_025.append({"class_id": c, "class_name": CLASS_NAMES.get(c, "unknown"), "conf": round(s, 4)})
                if s >= 0.50:
                    detections_050.append({"class_id": c, "class_name": CLASS_NAMES.get(c, "unknown"), "conf": round(s, 4)})
                    
        has_fp_025 = bool(len(detections_025) > 0)
        has_fp_050 = bool(len(detections_050) > 0)
        max_conf = max([d["conf"] for d in detections_025]) if detections_025 else 0.0
        
        ood_results.append({
            "image_id": row["image_id"],
            "filename": row["filename"],
            "true_species": sci_name,
            "species_code": species_code,
            "fp_at_conf_025": has_fp_025,
            "fp_count_025": len(detections_025),
            "fp_at_conf_050": has_fp_050,
            "fp_count_050": len(detections_050),
            "max_confidence": round(max_conf, 4),
            "detections_025": detections_025
        })
        
    n_total = len(ood_results)
    if n_total == 0:
        return {"error": "No OOD images found on disk"}
        
    fp_025_total = sum(1 for r in ood_results if r["fp_at_conf_025"])
    fp_050_total = sum(1 for r in ood_results if r["fp_at_conf_050"])
    
    fpr_025 = round((fp_025_total / n_total) * 100.0, 2)
    fpr_050 = round((fp_050_total / n_total) * 100.0, 2)
    specificity_025 = round(100.0 - fpr_025, 2)
    specificity_050 = round(100.0 - fpr_050, 2)
    
    # Species breakdown
    breakdown = {}
    for sc in ["RKAN", "DMAC"]:
        sc_subset = [r for r in ood_results if r["species_code"] == sc]
        n_sc = len(sc_subset)
        if n_sc > 0:
            fp_025_sc = sum(1 for r in sc_subset if r["fp_at_conf_025"])
            fp_050_sc = sum(1 for r in sc_subset if r["fp_at_conf_050"])
            breakdown[sc] = {
                "name": "Rastrelliger kanagurta" if sc == "RKAN" else "Decapterus macarellus",
                "total_tested": n_sc,
                "fp_count_025": fp_025_sc,
                "fpr_pct_025": round((fp_025_sc / n_sc) * 100.0, 2),
                "fp_count_050": fp_050_sc,
                "fpr_pct_050": round((fp_050_sc / n_sc) * 100.0, 2),
                "specificity_pct_050": round(100.0 - (fp_050_sc / n_sc) * 100.0, 2)
            }
            
    summary = {
        "ood_benchmark_name": "GBIF Out-of-Distribution Look-Alike Evaluation",
        "total_images_evaluated": n_total,
        "false_positive_rate_conf_025_pct": fpr_025,
        "false_positive_rate_conf_050_pct": fpr_050,
        "specificity_conf_025_pct": specificity_025,
        "specificity_conf_050_pct": specificity_050,
        "species_breakdown": breakdown,
        "detailed_results": ood_results
    }
    return summary

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--weights", type=str, default=str(WORKSPACE / "PHASES" / "PHASE_13" / "runs" / "baseline_yolov8n_v001" / "weights" / "best.pt"))
    parser.add_argument("--data_yaml", type=str, default=str(WORKSPACE / "datasets" / "fishguard_v001" / "data.yaml"))
    parser.add_argument("--output_dir", type=str, default=str(WORKSPACE / "PHASES" / "PHASE_13" / "evaluation"))
    parser.add_argument("--ood_manifest", type=str, default=str(WORKSPACE / "datasets" / "fishguard_v001" / "ood_eval" / "ood_evaluation_manifest.csv"))
    parser.add_argument("--conf", type=float, default=0.25)
    parser.add_argument("--iou", type=float, default=0.45)
    args = parser.parse_args()
    
    out_path = Path(args.output_dir)
    out_path.mkdir(parents=True, exist_ok=True)
    
    print(f"Loading trained weights: {args.weights}")
    model = YOLO(args.weights)
    
    test_img_dir = WORKSPACE / "datasets" / "fishguard_v001" / "images" / "test"
    test_lbl_dir = WORKSPACE / "datasets" / "fishguard_v001" / "labels" / "test"
    
    # 1. Test set eval
    test_results = evaluate_test_set(model, args.data_yaml, test_img_dir, test_lbl_dir, out_path, conf=args.conf, iou=args.iou)
    test_json_path = out_path / "test_metrics.json"
    with open(test_json_path, "w", encoding="utf-8") as f:
        json.dump(test_results, f, indent=2)
    print(f"\n[SUCCESS] Test set metrics saved to {test_json_path}")
    
    # 2. OOD eval
    ood_results = evaluate_ood(model, args.ood_manifest, out_path, conf_thresholds=[0.25, 0.50])
    ood_json_path = out_path / "ood_metrics.json"
    with open(ood_json_path, "w", encoding="utf-8") as f:
        json.dump(ood_results, f, indent=2)
    print(f"[SUCCESS] OOD evaluation metrics saved to {ood_json_path}")
    
    print("\n================ EVALUATION SUMMARY ================")
    print(f"Overall Test mAP@50:    {test_results['detection_metrics']['map50']:.4f}")
    print(f"Overall Test mAP@50-95: {test_results['detection_metrics']['map50_95']:.4f}")
    print(f"Overall Precision:      {test_results['detection_metrics']['precision']:.4f}")
    print(f"Overall Recall:         {test_results['detection_metrics']['recall']:.4f}")
    print(f"Overall F1 Score:       {test_results['detection_metrics']['f1_score']:.4f}")
    print(f"Count MAE:              {test_results['counting_metrics']['overall_mae']:.3f} fish")
    print(f"Count Exact Match:      {test_results['counting_metrics']['exact_count_accuracy_pct']:.1f}%")
    print(f"Count Within +-1:       {test_results['counting_metrics']['within_plus_minus_1_accuracy_pct']:.1f}%")
    print(f"CPU Latency (per img):  {test_results['speed_benchmark_cpu']['total_latency_ms']} ms ({test_results['speed_benchmark_cpu']['fps']} FPS)")
    print(f"OOD False Positive (0.25): {ood_results.get('false_positive_rate_conf_025_pct', 0.0)}%")
    print(f"OOD False Positive (0.50): {ood_results.get('false_positive_rate_conf_050_pct', 0.0)}%")
    print(f"OOD Specificity (0.50):    {ood_results.get('specificity_conf_050_pct', 0.0)}%")

if __name__ == "__main__":
    main()
