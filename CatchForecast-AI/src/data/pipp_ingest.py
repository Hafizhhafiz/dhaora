"""
CatchForecast AI - PIPP KKP Data Ingestion Module
Harvests official fish landing and operational vessel data for PPN Karangantu (Teluk Banten).
"""

import os
import sys
import json
import ssl
import urllib.request
import urllib.parse
from datetime import datetime
import pandas as pd

# Target Port Configuration (PPN Karangantu - Teluk Banten, WPP 712)
PORT_CONFIG = {
    "name": "Pelabuhan Perikanan Nusantara (PPN) Karangantu",
    "port_code": "712.36.05",
    "wpp": "712",
    "location": "Desa Banten, Kec. Kasemen, Kota Serang, Banten",
    "coordinates": {"lat": -6.0333, "lon": 106.1500},
    "encrypted_id": "eyJpdiI6Inc2b0txQlVsQm1qcC8yeGZJOGdlQUE9PSIsInZhbHVlIjoic0JTRXJ1bHo3VVMvUXRRRmFPTkdDUT09IiwibWFjIjoiZmQxYmYyNDY0OGNlZjdjNjNhNzIyODRkMmIxZTFjZWZlYTU1YzBlZWY4YjIxOTZkMDhhYmQ5MmQzMDIyZmFiMCIsInRhZyI6IiJ9",
    "base_url": "https://pipp.kkp.go.id/profil-pelabuhan/"
}

# Scientific & Local Target Species
TARGET_SPECIES = [
    {
        "id": "rastrelliger_brachysoma",
        "scientific_name": "Rastrelliger brachysoma",
        "local_name": "Kembung perempuan",
        "family": "Scombridae",
        "category": "Small Pelagic"
    },
    {
        "id": "selaroides_leptolepis",
        "scientific_name": "Selaroides leptolepis",
        "local_name": "Selar kuning",
        "family": "Carangidae",
        "category": "Small Pelagic"
    },
    {
        "id": "upeneus_sulphureus",
        "scientific_name": "Upeneus sulphureus",
        "local_name": "Kuniran",
        "family": "Mullidae",
        "category": "Demersal"
    }
]

def create_ssl_context():
    """Create unverified SSL context to handle government portal SSL certificates."""
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    return ctx

def fetch_json(endpoint_name, params=None):
    """Fetch JSON data from PIPP KKP endpoint."""
    ctx = create_ssl_context()
    url = urllib.parse.urljoin(PORT_CONFIG["base_url"], endpoint_name)
    if params:
        query_string = urllib.parse.urlencode(params)
        url = f"{url}?{query_string}"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "X-Requested-With": "XMLHttpRequest"
    }
    
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=20) as response:
        if response.status != 200:
            raise RuntimeError(f"HTTP Error {response.status} fetching {url}")
        content = response.read().decode("utf-8")
        return json.loads(content)

def ingest_all_pipp_data(output_dir):
    """Main ingestion pipeline."""
    os.makedirs(output_dir, exist_ok=True)
    enc_id = PORT_CONFIG["encrypted_id"]
    timestamp = datetime.now().isoformat()
    raw_dumps = {"harvest_timestamp": timestamp, "port_config": PORT_CONFIG}
    
    print(f"[*] Starting ingestion for {PORT_CONFIG['name']}...")
    
    # 1. Fetch Landing Price & Volume (Bulanan, Mingguan, Harian)
    frequencies = ["Bulanan", "Mingguan", "Harian"]
    dfs_price = {}
    
    for freq in frequencies:
        print(f"[*] Fetching pendaratan ({freq})...")
        endpoint = "dt-harga-rata-rata-ikan-yang-didaratkan"
        params = {
            "showDataBy": freq,
            "idPelabuhan": enc_id,
            "start": 0,
            "length": 200
        }
        res = fetch_json(endpoint, params)
        raw_dumps[f"pendaratan_{freq.lower()}"] = res
        
        rows = res.get("data", [])
        if rows:
            df = pd.DataFrame(rows)
            df["frequency"] = freq
            df["ingest_date"] = timestamp
            dfs_price[freq] = df
            csv_path = os.path.join(output_dir, f"ppn_karangantu_pendaratan_{freq.lower()}.csv")
            df.to_csv(csv_path, index=False)
            print(f"    -> Saved {len(df)} records to {csv_path}")

    # 2. Fetch Grafik Produksi Bulanan (2026 Time-Series)
    print("[*] Fetching grafik produksi bulanan...")
    res_grafik = fetch_json("grafik-produksi-ikan", {"idPelabuhan": enc_id})
    raw_dumps["grafik_produksi"] = res_grafik
    
    col_opt = res_grafik.get("grafik_produksi_ikan", {}).get("column_chart_option", {})
    categories_str = col_opt.get("x_axis_categories", "[]")
    data_str = col_opt.get("column_series_data", "[]")
    
    months = json.loads(categories_str)
    production_vals = json.loads(data_str)
    
    df_prod = pd.DataFrame({
        "bulan": months,
        "volume_kg": [float(x) for x in production_vals],
        "tahun": 2026,
        "pelabuhan": "PPN Karangantu",
        "wpp": "712"
    })
    csv_prod = os.path.join(output_dir, "ppn_karangantu_produksi_bulanan_2026.csv")
    df_prod.to_csv(csv_prod, index=False)
    print(f"    -> Saved {len(df_prod)} monthly production records to {csv_prod}")

    # 3. Fetch Operasional Kapal Masuk (Effort Proxy by Gear Type)
    print("[*] Fetching operasional kapal masuk (alat tangkap)...")
    res_kapal = fetch_json("dt-operasional-kapal-masuk", {
        "idPelabuhan": enc_id,
        "start": 0,
        "length": 100
    })
    raw_dumps["operasional_kapal_masuk"] = res_kapal
    
    rows_kapal = res_kapal.get("data", [])
    if rows_kapal:
        df_kapal = pd.DataFrame(rows_kapal)
        df_kapal["pelabuhan"] = "PPN Karangantu"
        df_kapal["ingest_date"] = timestamp
        csv_kapal = os.path.join(output_dir, "ppn_karangantu_operasional_kapal.csv")
        df_kapal.to_csv(csv_kapal, index=False)
        print(f"    -> Saved {len(df_kapal)} gear operational records to {csv_kapal}")

    # 4. Fetch Distribusi Pemasaran Masuk & Keluar
    print("[*] Fetching distribusi pemasaran masuk & keluar...")
    try:
        res_dist_in = fetch_json("dt-distribusi-pemasaran-masuk", {"idPelabuhan": enc_id, "start": 0, "length": 100})
        raw_dumps["pemasaran_masuk"] = res_dist_in
        if res_dist_in.get("data"):
            pd.DataFrame(res_dist_in["data"]).to_csv(os.path.join(output_dir, "ppn_karangantu_pemasaran_masuk.csv"), index=False)
    except Exception as e:
        print(f"    [!] Error pemasaran masuk: {e}")

    try:
        res_dist_out = fetch_json("dt-distribusi-pemasaran-keluar", {"idPelabuhan": enc_id, "start": 0, "length": 100})
        raw_dumps["pemasaran_keluar"] = res_dist_out
        if res_dist_out.get("data"):
            pd.DataFrame(res_dist_out["data"]).to_csv(os.path.join(output_dir, "ppn_karangantu_pemasaran_keluar.csv"), index=False)
    except Exception as e:
        print(f"    [!] Error pemasaran keluar: {e}")

    # 5. Extract and Filter Specifically for 3 Target Species
    print("[*] Filtering target species dataset...")
    target_records = []
    
    for freq, df in dfs_price.items():
        for sp in TARGET_SPECIES:
            sci = sp["scientific_name"].lower()
            # Match by scientific name in nama_latin
            matched = df[df["nama_latin"].astype(str).str.lower().str.contains(sci)]
            for _, row in matched.iterrows():
                target_records.append({
                    "species_id": sp["id"],
                    "scientific_name": sp["scientific_name"],
                    "local_name": sp["local_name"],
                    "family": sp["family"],
                    "category": sp["category"],
                    "frequency": freq,
                    "id_jenis_ikan": row.get("id_jenis_ikan"),
                    "nama_sistem": row.get("nama_jenis_ikan", "").strip(),
                    "volume_kg": float(row.get("volume", 0)),
                    "harga_rata_rata_idr": float(row.get("harga_rata_rata", 0)),
                    "nilai_total_est_idr": float(row.get("volume", 0)) * float(row.get("harga_rata_rata", 0))
                })
                
    df_targets = pd.DataFrame(target_records)
    csv_targets = os.path.join(output_dir, "target_species_landings.csv")
    df_targets.to_csv(csv_targets, index=False)
    print(f"    -> Saved {len(df_targets)} target species observations to {csv_targets}")

    # 6. Save Full Raw JSON Dump
    raw_dump_path = os.path.join(output_dir, "raw_pipp_dump.json")
    with open(raw_dump_path, "w", encoding="utf-8") as f:
        json.dump(raw_dumps, f, ensure_ascii=False, indent=2)
    print(f"[*] Complete raw JSON dump saved to {raw_dump_path}")

    # Summary Output
    print("\n" + "="*60)
    print("INGESTION SUMMARY — TARGET SPECIES IN PPN KARANGANTU")
    print("="*60)
    for sp in TARGET_SPECIES:
        sub = df_targets[df_targets["species_id"] == sp["id"]]
        print(f"\nSpesies: {sp['scientific_name']} ({sp['local_name']})")
        for _, r in sub.iterrows():
            print(f"  [{r['frequency']:8s}] Volume: {r['volume_kg']:10,.1f} kg | Harga: Rp {r['harga_rata_rata_idr']:10,.0f}/kg | Estimasi Nilai: Rp {r['nilai_total_est_idr']:14,.0f}")
    print("="*60 + "\n")
    
    return {
        "status": "SUCCESS",
        "output_dir": output_dir,
        "target_species_count": len(df_targets),
        "raw_dump_path": raw_dump_path
    }

if __name__ == "__main__":
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    out_dir = os.path.join(base_dir, "data", "raw", "fisheries")
    ingest_all_pipp_data(out_dir)
