"""
Conservation Information Page — ByCatch AI
Displays authoritative IUCN Red List, CITES, and Indonesian KKP regulatory status.
Never assumes status from memory; strictly relies on verified sources with dates and URLs.
"""

import sys
from pathlib import Path
import streamlit as st

root_dir = Path(__file__).resolve().parents[2]
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from src.conservation.service import ConservationService

st.set_page_config(page_title="Status Konservasi — ByCatch AI", page_icon="🛡️", layout="wide")

service = ConservationService(
    data_dir=root_dir / "data",
    metadata_dir=root_dir / "metadata"
)

st.title("🛡️ Informasi Status Konservasi & Regulasi")
st.markdown("Penyaringan informasi konservasi otoritatif berbasis **nama ilmiah terverifikasi** (IUCN Red List v4, CITES Species+, dan JDIH KKP RI).")

species_options = {
    "Ikan Kembung Perempuan": "Rastrelliger brachysoma",
    "Ikan Selar Kuning": "Selaroides leptolepis",
    "Ikan Kuniran": "Upeneus sulphureus"
}

selected_name = st.selectbox("Pilih Spesies:", list(species_options.keys()))
sci_name = species_options[selected_name]

profile = service.get_species_conservation_profile(sci_name)

st.markdown("---")
st.subheader(f"{selected_name} (*{sci_name}*)")

col_tax1, col_tax2, col_tax3 = st.columns(3)
with col_tax1:
    st.markdown(f"**Famili:** `{profile.get('family', '-')}`")
with col_tax2:
    st.markdown(f"**Ordo:** `{profile.get('order', '-')}`")
with col_tax3:
    st.markdown(f"**WoRMS AphiaID:** `{profile.get('worms_aphia_id', '-')}`")

st.markdown("### Status Otoritatif")

c_iucn, c_cites, c_nat = st.columns(3)

# 1. IUCN Card
with c_iucn:
    st.markdown("#### IUCN Red List")
    iucn = profile.get("iucn", {})
    st.metric("Kategori Global", iucn.get("iucn_status", "unknown"))
    st.caption(f"Tahun Asesmen: {iucn.get('assessment_year', '-')}")
    st.caption(f"Tren Populasi: {iucn.get('population_trend', '-')}")
    st.caption(f"Sumber: [{iucn.get('source', 'IUCN')}]({iucn.get('source_url', '#')})")

# 2. CITES Card
with c_cites:
    st.markdown("#### CITES Species+")
    cites = profile.get("cites", {})
    app = cites.get("cites_appendix", "unknown")
    st.metric("Lampiran Perdagangan", app)
    st.caption(f"Status: {cites.get('verification_status', '-')}")
    st.caption(f"Sumber: [{cites.get('source', 'CITES')}]({cites.get('source_url', '#')})")

# 3. National Regulation Card
with c_nat:
    st.markdown("#### Regulasi KKP RI")
    nat = profile.get("national_protection", {})
    nat_status = nat.get("national_protection_status", "unknown")
    st.metric("Status Perlindungan Nasional", nat_status)
    st.caption(f"Verifikasi: {nat.get('notes', '-')}")
    st.caption(f"Sumber: [{nat.get('source_name', 'JDIH KKP')}]({nat.get('source_url', '#')})")

st.info("💡 **Aksioma Ilmiah:** Status 'not_listed' atau 'not_listed_in_checked_regulations' berarti spesies telah diverifikasi dan tidak terdaftar pada kategori dilindungi/terancam dalam peraturan yang diperiksa; bukan berarti tidak dimonitor dalam pengelolaan kuota tangkap perikanan.")
