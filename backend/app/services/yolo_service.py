import os
import time
import cv2
import numpy as np
from pathlib import Path
from typing import List, Dict, Tuple, Any
from ultralytics import YOLO

from ..config import (
    CUSTOM_WEIGHTS_PATH,
    PRETRAINED_FALLBACK,
    TAXONOMY_INFO,
    RESULT_DIR
)
from ..models.schemas import FishDetection

class YOLOService:
    def __init__(self):
        self.model = None
        self.model_mode = "UNINITIALIZED"
        self.model_path = None
        self.is_custom_trained = False
        self._load_model()

    def _load_model(self):
        """
        Memeriksa ketersediaan bobot model target (fishguard_yolo.pt).
        Jika belum ada, status secara eksplisit diset ke MODEL_NOT_TRAINED.
        """
        try:
            if CUSTOM_WEIGHTS_PATH.exists() and CUSTOM_WEIGHTS_PATH.stat().st_size > 10000:
                print(f"[YOLOService] Memuat bobot custom FishGuard: {CUSTOM_WEIGHTS_PATH}")
                self.model = YOLO(str(CUSTOM_WEIGHTS_PATH))
                self.model_mode = "CUSTOM_SPECIES_MODEL"
                self.is_custom_trained = True
                self.model_path = str(CUSTOM_WEIGHTS_PATH)
            else:
                print(f"[YOLOService] Bobot custom belum tersedia di {CUSTOM_WEIGHTS_PATH}.")
                print(f"[YOLOService] Menggunakan baseline {PRETRAINED_FALLBACK} dengan status MODEL_NOT_TRAINED.")
                self.model = YOLO(PRETRAINED_FALLBACK)
                self.model_mode = "MODEL_NOT_TRAINED"
                self.is_custom_trained = False
                self.model_path = PRETRAINED_FALLBACK
        except Exception as e:
            print(f"[YOLOService ERROR] Gagal memuat model YOLO: {e}")
            self.model = None
            self.model_mode = f"ERROR: {str(e)}"
            self.is_custom_trained = False

    def reload_model(self):
        """Memuat ulang model (misal setelah proses training selesai)."""
        self._load_model()
        return {
            "model_mode": self.model_mode,
            "is_custom_trained": self.is_custom_trained,
            "model_path": self.model_path
        }

    def detect(self, image_path: str, conf_threshold: float = 0.25) -> Tuple[List[FishDetection], str, float, List[str]]:
        """
        Menjalankan deteksi objek nyata tanpa memalsukan kelas spesies atau confidence.
        Objek heuristik OpenCV dipisahkan secara tegas dan tidak dicampur ke dalam hasil deteksi AI YOLO.
        """
        if self.model is None:
            self._load_model()
            if self.model is None:
                raise RuntimeError("Model YOLO gagal diinisialisasi.")

        start_time = time.time()
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError(f"Gagal membaca gambar dari: {image_path}")

        # Inferensi model
        results = self.model.predict(
            source=img,
            conf=conf_threshold,
            save=False,
            verbose=False
        )
        inference_time_ms = round((time.time() - start_time) * 1000, 2)

        detections: List[FishDetection] = []
        notes = []

        if not self.is_custom_trained:
            notes.append(
                "STATUS MODEL: MODEL_NOT_TRAINED. Bobot model kustom untuk 3 spesies target MVP "
                "(Rastrelliger brachysoma, Selaroides leptolepis, Upeneus sulphureus) belum ditraining. "
                "Baseline COCO yang aktif tidak memiliki kelas ikan target; hasil klasifikasi spesies target bernilai 0."
            )

        annotated_img = img.copy()

        # Proses deteksi YOLO murni (tanpa mencampurkan heuristik OpenCV)
        if len(results) > 0 and results[0].boxes is not None:
            boxes = results[0].boxes
            class_names_dict = self.model.names if hasattr(self.model, "names") else {}

            for idx, box in enumerate(boxes):
                coords = box.xyxy[0].cpu().numpy().tolist()  # [x1, y1, x2, y2]
                conf = float(box.conf[0].cpu().numpy())
                cls_id = int(box.cls[0].cpu().numpy())
                raw_name = str(class_names_dict.get(cls_id, f"class_{cls_id}")).lower()

                if self.is_custom_trained:
                    # Model 3 Spesies MVP: Class 0 (brachysoma), Class 1 (leptolepis), Class 2 (sulphureus)
                    if "brachysoma" in raw_name or "kembung" in raw_name or cls_id == 0:
                        c_name = "brachysoma"
                        s_name = TAXONOMY_INFO["brachysoma"]["scientific_name"]
                        f_name = TAXONOMY_INFO["brachysoma"]["family"]
                        box_color = (233, 165, 14)  # Cyan
                    elif "leptolepis" in raw_name or "selar" in raw_name or cls_id == 1:
                        c_name = "leptolepis"
                        s_name = TAXONOMY_INFO["leptolepis"]["scientific_name"]
                        f_name = TAXONOMY_INFO["leptolepis"]["family"]
                        box_color = (8, 179, 234)   # Yellow/Gold
                    elif "sulphureus" in raw_name or "kuniran" in raw_name or cls_id == 2:
                        c_name = "sulphureus"
                        s_name = TAXONOMY_INFO["sulphureus"]["scientific_name"]
                        f_name = TAXONOMY_INFO["sulphureus"]["family"]
                        box_color = (22, 115, 249)  # Orange
                    else:
                        c_name = raw_name
                        s_name = "Spesies Perairan Tidak Teridentifikasi"
                        f_name = "Pisces"
                        box_color = (184, 163, 148) # Slate
                else:
                    # Baseline COCO (tidak ada kelas fish dalam COCO 80 kelas)
                    c_name = f"COCO: {raw_name}"
                    s_name = f"Bukan Spesies Target (Deteksi Baseline: {raw_name})"
                    f_name = "Non-Fisheries Class"
                    box_color = (180, 180, 180)  # Abu-abu netral

                detection = FishDetection(
                    box=[round(c, 1) for c in coords],
                    confidence=round(conf, 3),
                    class_id=cls_id,
                    class_name=c_name,
                    scientific_name=s_name,
                    family=f_name
                )
                detections.append(detection)

                # Visualisasi bounding box dengan label jujur
                x1, y1, x2, y2 = [int(v) for v in coords]
                cv2.rectangle(annotated_img, (x1, y1), (x2, y2), box_color, 2)
                
                label_text = f"{c_name} {conf*100:.1f}%"
                (tw, th), _ = cv2.getTextSize(label_text, cv2.FONT_HERSHEY_SIMPLEX, 0.45, 1)
                cv2.rectangle(annotated_img, (x1, max(0, y1 - 20)), (x1 + tw + 6, max(0, y1)), box_color, -1)
                cv2.putText(
                    annotated_img,
                    label_text,
                    (x1 + 3, max(12, y1 - 5)),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.45,
                    (255, 255, 255),
                    1,
                    cv2.LINE_AA
                )

        if len(detections) == 0:
            notes.append(
                "Tidak ada objek yang terdeteksi oleh model pada ambang batas confidence saat ini."
            )

        # Simpan citra beranotasi
        timestamp_str = str(int(time.time() * 1000))
        result_filename = f"detected_{timestamp_str}_{Path(image_path).name}"
        result_save_path = RESULT_DIR / result_filename
        cv2.imwrite(str(result_save_path), annotated_img)

        return detections, result_filename, inference_time_ms, notes

yolo_service_instance = YOLOService()
