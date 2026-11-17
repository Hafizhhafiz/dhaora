import csv
from pathlib import Path
from collections import Counter

WORKSPACE = Path(r"c:\TUGAS-TUGAS KULIAH\SEMESTER 5\ASIK VOL VI")
SRC_CSV = WORKSPACE / "dataset_pipeline" / "metadata" / "gbif_quality_report.csv"
OUT_CSV = WORKSPACE / "PHASES" / "PHASE_12" / "gbif_reaudit_register.csv"
OUT_REPORT = WORKSPACE / "PHASES" / "PHASE_12" / "GBIF_REAUDIT_REPORT.md"

with open(SRC_CSV, encoding="utf-8") as f:
    rows = list(csv.DictReader(f))

print(f"Loaded {len(rows)} GBIF records from {SRC_CSV}")

reaudited_rows = []
counts = Counter()

for r in rows:
    img_id = r["image_id"]
    sp_code = r["species_code"] # 'RKAN' or 'DMAC'
    scientific_name = "Rastrelliger kanagurta" if sp_code == "RKAN" else "Decapterus macarellus"
    q_tier = r.get("quality_tier", "MEDIUM")
    cur_status = r.get("curation_status", "CANDIDATE")
    
    # Target Class Check: Neither is a target MVP species (Class 0: R. brachysoma, 1: S. leptolepis, 2: U. sulphureus)
    usable_for_mvp_training = False
    
    if cur_status == "REJECTED" or q_tier == "LOW":
        allocation = "REJECTED"
        reason = f"Poor visual quality ({q_tier}) or duplicate in occurrence set; excluded from all pipelines."
        counts["REJECTED"] += 1
    else:
        allocation = "OOD_EVALUATION_SET"
        reason = (
            f"Species is {scientific_name} (non-target look-alike). "
            f"Banned from target class training to prevent label substitution. "
            f"Allocated exclusively to Out-of-Distribution (OOD) false-positive evaluation benchmark."
        )
        counts["OOD_EVALUATION_SET"] += 1
        
    counts[f"{sp_code}_{allocation}"] += 1

    reaudited_rows.append({
        "image_id": img_id,
        "filename": r["filename"],
        "species_code": sp_code,
        "scientific_name": scientific_name,
        "gbifID": r["gbifID"],
        "original_quality_tier": q_tier,
        "original_curation_status": cur_status,
        "usable_for_mvp_training": "NO",
        "phase12_allocation": allocation,
        "audit_decision_reason": reason
    })

fieldnames = list(reaudited_rows[0].keys())
with open(OUT_CSV, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(reaudited_rows)

print(f"Wrote {len(reaudited_rows)} records to {OUT_CSV}")
print("Allocation breakdown:", dict(counts))

# Write markdown report
report_content = f"""# PHASE 12 — GBIF HISTORICAL RE-AUDIT REPORT
**Auditor:** Research Data Integrity Auditor & AI Lead  
**Tanggal:** 17 November 2026 | **Fokus Audit:** Rekonstruksi Ilmiah 207 Citra Historis GBIF (Issue A2)

---

## 1. Ringkasan Eksekutif & Keputusan Ilmiah
Sesuai arahan audit Master Roadmap (Issue A2):
> *"207 GBIF images are a historical count, not a training count. Possible inflated dataset claims. Phase 12 dataset register must record usable / rejected / reason per image."*

Hasil audit ulang membuktikan:
- **Total record historis yang diperiksa:** **207 record** (107 *Rastrelliger kanagurta*, 100 *Decapterus macarellus*).
- **Jumlah yang dapat digunakan untuk Training Target Kelas MVP:** **0 CITRA (0%)**.
  - *Justifikasi Ilmiah:* Sesuai Golden Rule #1 dan kaidah taksonomi terkunci, *R. kanagurta* tidak boleh disubstitusikan ke dalam Class 0 (*R. brachysoma*), dan *D. macarellus* tidak boleh disubstitusikan ke dalam Class 1 (*S. leptolepis*). Pelabelan spesies mirip sebagai kelas target merupakan pelanggaran integritas data (*label drift*).
- **Jumlah yang dialokasikan untuk Evaluasi Out-of-Distribution (OOD):** **{counts['OOD_EVALUATION_SET']} citra** (Kualitas HIGH/MEDIUM).
  - Citra ini sangat berharga untuk menguji ketahanan model deteksi: mengukur *false-positive rate* dan membuktikan model tidak salah mengklasifikasikan *R. kanagurta* sebagai *R. brachysoma*.
- **Jumlah yang Ditolak Sepenuhnya (REJECTED):** **{counts['REJECTED']} citra** (karena kualitas visual LOW, blur ekstrem, atau duplikasi visual).

---

## 2. Rincian Alokasi per Spesies

| Kode Spesies | Nama Ilmiah | Total Record | Usable for MVP Training | Dialokasikan ke OOD Eval | Ditolak (REJECTED) |
|:---:|:---|:---:|:---:|:---:|:---:|
| **RKAN** | *Rastrelliger kanagurta* (Kembung Lelaki) | 107 | **0** | **{counts['RKAN_OOD_EVALUATION_SET']}** | **{counts['RKAN_REJECTED']}** |
| **DMAC** | *Decapterus macarellus* (Layang Biru) | 100 | **0** | **{counts['DMAC_OOD_EVALUATION_SET']}** | **{counts['DMAC_REJECTED']}** |
| **TOTAL** | — | **207** | **0** | **{counts['OOD_EVALUATION_SET']}** | **{counts['REJECTED']}** |

---

## 3. Register Lengkap
Seluruh 207 baris keputusan individual beserta ID GBIF dan alasan penolakannya tersimpan pada:  
`PHASES/PHASE_12/gbif_reaudit_register.csv`
"""

with open(OUT_REPORT, "w", encoding="utf-8") as f:
    f.write(report_content)

print(f"Generated report at {OUT_REPORT}")
