"""
ByCatch AI — Main Dashboard Application (Phase 10)
Marine-themed executive overview of landing statistics, detections, and conservation status.
"""

import sys
from pathlib import Path
import streamlit as st

# Setup python path to import from src
root_dir = Path(__file__).resolve().parents[1]
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from src.database.db import get_connection, init_database
from src.database.repository import ByCatchRepository
from src.inference.predictor import FishDetector

st.set_page_config(
    page_title="ByCatch AI — FishGuard Ecosystem",
    page_icon="🐟",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Initialize DB if not exists
db_file = root_dir / "data" / "app.sqlite"
if not db_file.exists():
    init_database(db_file)

conn = get_connection(db_file)
repo = ByCatchRepository(conn)
detector = FishDetector(root_dir)

# --- Sidebar ---
st.sidebar.title("🐟 ByCatch AI")
st.sidebar.caption("Sistem Monitoring Perikanan & Konservasi")
st.sidebar.markdown("**Lokasi:** PPN Karangantu (WPPNRI 712)")
st.sidebar.markdown("---")

# Detector Status Banner in Sidebar
if detector.model_status == "ready":
    st.sidebar.success(f"Model Aktif: {detector.model_metadata.get('model_name', 'YOLO')}")
else:
    st.sidebar.warning("Status Model: Belum ada bobot aktif (pending_data)")

# --- Main Page ---
st.title("ByCatch AI — Dashboard Monitoring Pendaratan Ikan")
st.markdown("""
Modul inovasi cerdas berbasis *Computer Vision* dan *Rule Engine* perikanan di bawah ekosistem **FishGuard AI (ASIK V)**.
Dirancang untuk identifikasi spesies hasil tangkapan, pemisahan tangkapan utama vs sampingan (*bycatch*), serta integrasi status konservasi otoritatif.
""")

# Top Metric Cards (Fetched dynamically from SQLite)
summary = repo.get_dashboard_summary()
col1, col2, col3, col4 = st.columns(4)

with col1:
    st.metric("Total Citra Dianalisis", summary["total_images"])
with col2:
    st.metric("Total Ikan Terdeteksi", summary["total_detections"])
with col3:
    st.metric("Catatan Trip Pendaratan", summary["total_catch_records"])
with col4:
    active_m = detector.model_metadata.get("model_name", "None") if detector.model_status == "ready" else "None"
    st.metric("Model Detektor Aktif", active_m)

st.markdown("---")

# Species Distribution & Catch Composition
col_left, col_right = st.columns(2)

with col_left:
    st.subheader("Komposisi Deteksi Tiga Spesies Target")
    sp_counts = summary["species_counts"]
    if any(sp_counts.values()):
        st.bar_chart(sp_counts)
    else:
        st.info("Belum ada data deteksi tersimpan di database.")

with col_right:
    st.subheader("Distribusi Peran Hasil Tangkapan (Catch Role)")
    roles = summary["catch_roles"]
    if any(roles.values()):
        st.bar_chart(roles)
    else:
        st.info("Belum ada catatan peran hasil tangkapan (target / bycatch).")

st.markdown("---")

# Species Canonical Reference Card
st.subheader("Tiga Spesies Objek Penelitian Kanonikal")
cols = st.columns(3)

with cols[0]:
    st.markdown("### 0. Kembung Perempuan")
    st.markdown("*Rastrelliger brachysoma* (Scombridae)")
    st.caption("Pelagis kecil ekonomis penting. Ciri: Deep body, operkulum lebar, corak dorsal kehijauan.")

with cols[1]:
    st.markdown("### 1. Selar Kuning")
    st.markdown("*Selaroides leptolepis* (Carangidae)")
    st.caption("Pelagis kecil. Ciri: Garis kuning lebar membujur dari mata ke ekor, bintik hitam operkulum.")

with cols[2]:
    st.markdown("### 2. Kuniran")
    st.markdown("*Upeneus sulphureus* (Mullidae)")
    st.caption("Demersal dasar berpasir/lumpur. Ciri: Sepasang sungut dagu (barbels), garis lateral oranye.")
