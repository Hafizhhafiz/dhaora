"""
System Status Page — ByCatch AI
Displays real hardware health, GPU temperature/VRAM, benchmark measurements, and model registration.
"""

import sys
import shutil
from pathlib import Path
import pandas as pd
import streamlit as st

root_dir = Path(__file__).resolve().parents[2]
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from src.utils.gpu_monitor import get_gpu_status, get_system_memory_status
from src.inference.predictor import FishDetector

st.set_page_config(page_title="Status Sistem — ByCatch AI", page_icon="⚙️", layout="wide")

st.title("⚙️ Status Sistem & Lingkungan Komputasi")

# 1. Hardware Metrics
st.subheader("1. Pemantauan Sumber Daya Perangkat Keras")
gpu = get_gpu_status()
mem = get_system_memory_status()
_, _, free_disk = shutil.disk_usage("C:/")

c1, c2, c3 = st.columns(3)
with c1:
    st.markdown("#### GPU Akselerator")
    if gpu["gpu_available"]:
        st.success(f"**Device:** {gpu['gpu_name']}")
        st.write(f"Total VRAM: `{gpu['vram_total_mb']} MB`")
        st.write(f"VRAM Teralokasi: `{gpu['vram_allocated_mb']} MB`")
    else:
        st.warning("CUDA GPU tidak terdeteksi (Fallback CPU).")

with c2:
    st.markdown("#### Memori Sistem (RAM)")
    st.write(f"Total RAM: `{mem['ram_total_gb']} GB`")
    st.write(f"RAM Tersedia: `{mem['ram_available_gb']} GB`")
    st.write(f"Penggunaan: `{mem['ram_percent']}%`")

with c3:
    st.markdown("#### Ruang Penyimpanan")
    st.write(f"Drive C: Bebas: `{free_disk / (1024**3):.2f} GB`")

st.markdown("---")

# 2. Empirical Benchmark Measurements
st.subheader("2. Hasil Pengukuran Benchmark Hardware (RTX 3050 Laptop)")
bench_csv = root_dir / "results" / "phase6_architecture" / "resource_benchmark.csv"

if bench_csv.exists():
    df_bench = pd.read_csv(bench_csv)
    st.dataframe(df_bench, use_container_width=True)
    st.caption("Benchmark diukur pada resolusi 640/512 dengan variasi batch size 2 & 4 pada hardware lokal.")
else:
    st.info("File benchmark resource belum tersedia. Jalankan `scripts/benchmark_resource.py`.")

st.markdown("---")

# 3. Model Registration
st.subheader("3. Registrasi Bobot Model Aktif")
detector = FishDetector(root_dir)
if detector.model_status == "ready":
    st.success("Bobot model aktif terdeteksi:")
    st.json(detector.model_metadata)
else:
    st.warning("⚠️ Belum ada bobot model riset aktif yang terdaftar di `models/weights/active_model.json`.")
    st.info("Status data: `pending_data`. Model riset akan didaftarkan setelah dataset riil diperoleh dan dilatih pada Phase 7.")
