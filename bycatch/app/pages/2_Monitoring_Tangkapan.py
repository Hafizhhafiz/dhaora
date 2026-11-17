"""
Catch Monitoring & Context Role Page — ByCatch AI
Logs fishing trips, gear types, target catch, and computes contextual bycatch roles via rule engine.
"""

import sys
from datetime import date
from pathlib import Path
import streamlit as st

root_dir = Path(__file__).resolve().parents[2]
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from src.database.db import get_connection
from src.database.repository import ByCatchRepository
from src.inference.catch_role import determine_catch_role

st.set_page_config(page_title="Monitoring Tangkapan — ByCatch AI", page_icon="📋", layout="wide")

conn = get_connection(root_dir / "data" / "app.sqlite")
repo = ByCatchRepository(conn)

st.title("📋 Pencatatan & Monitoring Hasil Tangkapan")
st.markdown("Pencatatan konteks perikanan tangkap untuk membedakan hasil tangkapan utama (*target catch*) dan sampingan (*bycatch*).")

with st.form("catch_monitoring_form"):
    st.subheader("Data Trip & Operasi Penangkapan")
    col1, col2 = st.columns(2)

    with col1:
        landing_date = st.date_input("Tanggal Pendaratan:", value=date.today())
        trip_id = st.text_input("Identitas Kapal / ID Trip:", placeholder="Misal: KM-BARUNA-04")
        gear_type = st.selectbox(
            "Alat Tangkap yang Digunakan:",
            ["Jaring Insang (Gillnet)", "Bagan Perahu (Lift Net)", "Jaring Rampus / Apollo", "Pancing Ulur (Handline)", "Lainnya"]
        )

    with col2:
        target_species = st.text_input(
            "Spesies Sasaran Operasi (Target Species):",
            placeholder="Misal: Selar kuning, Kembung perempuan"
        )
        detected_species = st.selectbox(
            "Spesies yang Didata / Terdeteksi:",
            ["kembung_perempuan", "selar_kuning", "kuniran"]
        )
        catch_handling = st.selectbox(
            "Penanganan Hasil Tangkapan:",
            ["retained (Dipertahankan untuk dijual/konsumsi)", "discarded (Dibuang ke laut)"]
        )

    notes = st.text_area("Catatan Tambahan Lapangan (Opsional):")
    submitted = st.form_submit_button("Simpan Data Pendaratan", type="primary")

if submitted:
    # Compute catch role via rule engine
    handling_clean = "retained" if "retained" in catch_handling else "discarded"
    role_eval = determine_catch_role(
        detected_species_name=detected_species,
        target_species=target_species,
        catch_handling=handling_clean
    )

    st.markdown("---")
    st.subheader("Hasil Evaluasi Peran Tangkapan (Rule Engine)")
    
    role = role_eval["catch_role"]
    if role == "target":
        st.success(f"**STATUS: HASIL TANGKAPAN UTAMA (TARGET CATCH)**\n\n*Bukti:* {role_eval['evidence']}")
    elif role == "incidental_non_target_retained":
        st.warning(f"**STATUS: HASIL TANGKAPAN SAMPINGAN DIPERTAHANKAN (INCIDENTAL BYCATCH)**\n\n*Bukti:* {role_eval['evidence']}")
    elif role == "discarded_non_target":
        st.error(f"**STATUS: HASIL TANGKAPAN SAMPINGAN DIBUANG (DISCARDED BYCATCH)**\n\n*Bukti:* {role_eval['evidence']}")
    else:
        st.info(f"**STATUS: UNVERIFIED**\n\n*Bukti:* {role_eval['evidence']}")

    # Save to SQLite
    rec_id = repo.insert_catch_record(
        landing_date=str(landing_date),
        vessel_trip_id=trip_id,
        fishing_gear=gear_type,
        target_species=target_species,
        detected_species=detected_species,
        catch_role=role,
        catch_handling=handling_clean,
        notes=notes
    )
    st.caption(f"Tersimpan ke database lokal SQLite dengan Record ID: #{rec_id}")
