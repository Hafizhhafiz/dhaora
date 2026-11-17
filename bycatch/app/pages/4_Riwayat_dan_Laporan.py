"""
History and Reports Page — ByCatch AI
Displays logged fishing trips and catch evaluations with CSV export functionality.
"""

import sys
from pathlib import Path
import pandas as pd
import streamlit as st

root_dir = Path(__file__).resolve().parents[2]
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from src.database.db import get_connection
from src.database.repository import ByCatchRepository

st.set_page_config(page_title="Riwayat & Laporan — ByCatch AI", page_icon="📊", layout="wide")

conn = get_connection(root_dir / "data" / "app.sqlite")
repo = ByCatchRepository(conn)

st.title("📊 Riwayat Pendaratan & Ekspor Laporan")
st.markdown("Rekapitulasi catatan hasil monitoring pendaratan dan pengelompokan tangkapan utama vs sampingan.")

records = repo.get_all_catch_records()

if not records:
    st.info("Belum ada data pendaratan yang tercatat di database.")
else:
    df = pd.DataFrame(records)
    
    # Filter controls
    col1, col2 = st.columns(2)
    with col1:
        gear_filter = st.multiselect("Filter Alat Tangkap:", options=df["fishing_gear"].unique(), default=df["fishing_gear"].unique())
    with col2:
        role_filter = st.multiselect("Filter Catch Role:", options=df["catch_role"].unique(), default=df["catch_role"].unique())

    filtered_df = df[(df["fishing_gear"].isin(gear_filter)) & (df["catch_role"].isin(role_filter))]

    st.dataframe(filtered_df, use_container_width=True)

    # Export CSV
    csv_bytes = filtered_df.to_csv(index=False).encode("utf-8")
    st.download_button(
        label="📥 Unduh Laporan CSV",
        data=csv_bytes,
        file_name="laporan_monitoring_bycatch_ai.csv",
        mime="text/csv"
    )
