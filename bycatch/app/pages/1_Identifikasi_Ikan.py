"""
Fish Identification Page — ByCatch AI
Upload image, run detector, display bounding boxes, human verification & save to database.
"""

import sys
import hashlib
from pathlib import Path
from PIL import Image
import streamlit as st

root_dir = Path(__file__).resolve().parents[2]
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from src.database.db import get_connection
from src.database.repository import ByCatchRepository
from src.inference.predictor import FishDetector
from src.annotation.visualize_labels import draw_yolo_boxes

st.set_page_config(page_title="Identifikasi Ikan — ByCatch AI", page_icon="🐟", layout="wide")

conn = get_connection(root_dir / "data" / "app.sqlite")
repo = ByCatchRepository(conn)
detector = FishDetector(root_dir)

st.title("🐟 Identifikasi & Deteksi Citra Ikan")
st.markdown("Unggah citra hasil pendaratan di TPI untuk mendeteksi ikan kembung perempuan, selar kuning, dan kuniran.")

# Model status check
if detector.model_status != "ready":
    st.warning("⚠️ **Model Belum Tersedia:** Bobot model riset belum didaftarkan di `models/weights/active_model.json`. Analisis deteksi dinonaktifkan sementara sampai model dilatih pada data riil.")
    st.info("Anda dapat melihat arsitektur model dan benchmark sumber daya di halaman **Status Sistem**.")

uploaded_file = st.file_uploader("Pilih file foto ikan (JPG, PNG, WebP):", type=["jpg", "jpeg", "png", "webp", "bmp"])

if uploaded_file is not None:
    col_img, col_res = st.columns([1, 1])

    with col_img:
        st.subheader("Citra Asli")
        img = Image.open(uploaded_file)
        st.image(img, use_container_width=True)

    with col_res:
        st.subheader("Hasil Analisis Deteksi")
        if detector.model_status == "ready":
            conf_thresh = st.slider("Confidence Threshold:", min_value=0.1, max_value=0.9, value=0.25, step=0.05)
            
            if st.button("Jalankan Deteksi AI", type="primary"):
                with st.spinner("Menjalankan inferensi model YOLO..."):
                    pred = detector.predict(uploaded_file, conf_thresh=conf_thresh)

                if pred.get("status") == "success":
                    dets = pred["detections"]
                    st.success(f"Ditemukan {len(dets)} individu ikan!")

                    # Render boxes onto image
                    boxes = [(d["class_id"], d["bbox_norm"][0], d["bbox_norm"][1], d["bbox_norm"][2], d["bbox_norm"][3]) for d in dets]
                    out_vis = root_dir / "results" / "temp_vis.jpg"
                    
                    # Save upload to temp
                    temp_src = root_dir / "results" / "temp_upload.jpg"
                    temp_src.parent.mkdir(parents=True, exist_ok=True)
                    img.convert("RGB").save(temp_src)

                    draw_yolo_boxes(temp_src, boxes, out_vis)
                    if out_vis.exists():
                        st.image(Image.open(out_vis), caption="Deteksi Bounding Box", use_container_width=True)

                    # Table of detections
                    for i, d in enumerate(dets, 1):
                        st.markdown(f"**#{i}: {d['class_name']}** — Keyakinan: `{d['confidence']*100:.1f}%`")
                else:
                    st.error(f"Error inferensi: {pred.get('error')}")
        else:
            st.info("Fitur inferensi aktif setelah model penelitian selesai dilatih.")
