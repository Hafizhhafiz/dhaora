# VALIDASI RELASI METADATA & PENCEGAHAN DATA LEAKAGE
## FishGuard AI — ASIK V (Phase 11.7.1)
**Metode:** Uji Relasional 1-to-Many & Simulasi GroupShuffleSplit  
**Status Evaluasi:** **PASS (ZERO LEAKAGE TERBUKTI KOMPUTASIONAL)**  

---

## 1. UJI STRUKTUR ID SPESIMEN & FOTO

Sistem identitas FishGuard AI mematuhi format baku:
- **Format ID Spesimen:** `SP-KRG-YYYYMM-<KODE_SPESIES>-<SERIAL>` (contoh: `SP-KRG-202611-RB-0001`).
- **Format ID Foto:** `PHT-YYYYMMDD-<SERIAL_SPESIMEN>-<INDEX_VARIASI>` (contoh: `PHT-20261120-0001-01`).
- **Format Berkas Citra:** `TB_YYYYMMDD_KRN_<KODE>_<SERIAL>_<VARIASI>.<ext>`.

### Hasil Uji Konsistensi:
1. **Keunikan `specimen_id`:** Terverifikasi 100% unik untuk setiap individu ikan.
2. **Relasi 1-to-Many:** Terverifikasi bahwa 1 `specimen_id` dapat menaungi 2 hingga 4 berkas foto variasi tanpa duplikasi identitas ikan.
3. **Penyelarasan Class ID:** Terverifikasi konsisten dengan master katalog `species_reference.csv`:
   - `class_id: 0` $\rightarrow$ *Rastrelliger brachysoma*
   - `class_id: 1` $\rightarrow$ *Selaroides leptolepis*
   - `class_id: 2` $\rightarrow$ *Upeneus sulphureus*

---

## 2. HASIL EMPIRIS PENCEGAHAN DATA LEAKAGE

Skrip pengujian menjalankan simulasi pemisahan partisi dataset (*data partitioning*) menggunakan algoritma `GroupShuffleSplit` berbasis `specimen_id`:
- **Populasi Uji:** 100 spesimen unik $\times$ 3 variasi foto = 300 baris citra.
- **Partisi:**
  - *Train Set:* 70 spesimen ($210\text{ citra}$, $70,0\%$)
  - *Validation Set:* 15 spesimen ($45\text{ citra}$, $15,0\%$)
  - *Test Set:* 15 spesimen ($45\text{ citra}$, $15,0\%$)

### Hasil Pengujian Tumpang-Tindih (*Overlap / Leakage Check*):
$$\text{Spesimen Irisan } (\text{Train} \cap \text{Val}) = 0$$
$$\text{Spesimen Irisan } (\text{Train} \cap \text{Test}) = 0$$
$$\text{Spesimen Irisan } (\text{Val} \cap \text{Test}) = 0$$

$$\mathbf{TOTAL\; DATA\; LEAKAGE = 0\; SPESIMEN\; (0,00\% \implies PASS)}$$

Terbukti secara komputasional bahwa tidak ada foto dari individu ikan yang sama yang terdistribusi ke dalam kelompok train dan test secara terpisah.
