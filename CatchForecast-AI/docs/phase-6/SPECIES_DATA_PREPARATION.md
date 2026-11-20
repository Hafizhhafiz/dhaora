# SPECIES DATA PREPARATION SPECIFICATION — PHASE 06
**CatchForecast AI (ASIK Vol. VI)**

- **Dokumen:** `docs/SPECIES_DATA_PREPARATION.md`
- **Fase:** Phase 06 — Species Data Preparation
- **Status:** APPROVED & LOCKED
- **Tujuan:** Menetapkan protokol baku persiapan, standardisasi, penyelarasan, dan isolasi dataset pelatihan untuk 3 spesies target.

---

## 1. Definisi Unit Observasi & Variabel Target

### 1.1 Unit Observasi Spasio-Temporal
Setiap baris rekaman dalam dataset pelatihan per spesies merepresentasikan satu unit observasi terpadu:
* **Dimensi Spasial:** Satu sel grid perairan laut reguler $1\text{ km} \times 1\text{ km}$ di Teluk Banten (`cell_id` dari 798 sel laut aktif).
* **Dimensi Temporal:** Satu bulan kalender pengamatan perikanan ($t \in [1, 11]$ tahun 2026).

### 1.2 Variabel Target Dependen ($Y$)
1. **Target Primer ($Y_1$): Catch Weight Terdistribusi ($\text{kg} / \text{grid-bulan}$)**
   - Bobot hasil tangkapan bulanan spesies target di Teluk Banten yang dialokasikan ke masing-masing grid sel perairan laut berdasarkan fungsi probabilitas habitat lingkungan.
2. **Target Sekunder ($Y_2$): CPUE Proksi ($\text{kg} / \text{trip alat tangkap}$)**
   - Normalisasi bobot tangkapan terhadap intensitas operasional armada kapal masuk bulanan:
     $$\text{CPUE}_{i, t} = \frac{\text{Catch}_{i, t}}{\text{Effort}_{i, t}}$$

---

## 2. Alokasi Upaya Penangkapan (Fishing Effort) per Kelompok Ekologi

Sesuai audit operasional armada kapal masuk PPN Karangantu (total 25.586 aktivitas alat tangkap):

| Spesies Target | Famili & Ekologi | Alat Tangkap Terkait (Effort Group) | Total Effort Tahunan Terdistribusi |
|---|---|---|---|
| ***Rastrelliger brachysoma* (Kembung perempuan)** | Scombridae (Pelagis Kecil) | Jaring insang lainnya, Jaring tetap, Jaring hanyut, Jaring berlapis, Bagan tancap, Payang, Bagan perahu. | **19.819 unit alat** |
| ***Selaroides leptolepis* (Selar kuning)** | Carangidae (Pelagis Kecil) | Jaring insang, Bagan tancap, Payang, Bagan perahu. | **19.819 unit alat** |
| ***Upeneus sulphureus* (Kuniran)** | Mullidae (Demersal) | Pukat hela dasar berpapan (*otter trawl*), Bubu dasar. | **5.618 unit alat** |

---

## 3. Protokol Penanganan Missing Data vs. Zero Catch

> [!CRITICAL]
> **Larangan Mutlak:** Dilarang keras menganggap ketiadaan catatan pendaratan (*missing record*) sebagai hasil tangkapan nol (*zero catch*).

1. **Definisi Missing Catch:** Kondisi di mana tidak ada data pelaporan pada bulan berjalan (misal: data Desember 2026 yang belum selesai).
   - *Perlakuan:* Baris data dikeluarkan dari training matrix model (`is_complete: False`).
2. **Definisi Zero Catch:** Kondisi di mana armada nelayan aktif beroperasi menangkap ikan dengan alat tangkap terkait, namun mencatat hasil tangkapan 0 kg pada spesies tersebut.
   - *Perlakuan:* Karena ketiga spesies target adalah komoditas utama yang selalu didaratkan secara konsisten setiap bulan di Teluk Banten (volume $>0$), tidak ditemukan rekaman zero catch buatan pada dataset 2026.

---

## 4. Penyelarasan Spasio-Temporal (Spatial-Temporal Matching)

Penggabungan data lingkungan dengan data tangkapan dilakukan dengan kaidah:
1. **Fitur Fisik Independen ($X$):**
   - Suhu Permukaan Laut bulanan ($\text{SST}$ dalam $^\circ\text{C}$)
   - Gradien Front Termal ($\text{Front}$ dalam $^\circ\text{C/km}$)
   - Kedalaman Batimetri ($\text{Depth}$ dalam meter)
   - Kemiringan Lereng Dasar Laut ($\text{Slope}$ dalam derajat)
   - Jarak ke Garis Pantai ($\text{Dist}_{\text{shore}}$ dalam km)
   - Jarak ke PPN Karangantu ($\text{Dist}_{\text{port}}$ dalam km)
2. **Target Dependen ($Y$):**
   - Bobot tangkapan bulanan spesifik spesies yang disinkronkan pada indeks bulan yang sama ($t$).
3. **Ketiadaan Kebocoran Data (*Data Leakage Prevention*):**
   - Tidak ada fitur yang dihitung menggunakan data masa depan ($t+1$).
   - Fitur spasial grid statis (batimetri, jarak) dipisahkan dari fitur oseanografi dinamis (SST, front termal).

---

## 5. Struktur Tiga Dataset Output Terpisah

Setiap spesies disimpan dalam direktori terisolasi di `data/processed/species/`:

```text
data/processed/species/
├── rastrelliger/
│   ├── rastrelliger_monthly_features.csv   # 8.778 baris (798 sel laut x 11 bulan)
│   └── rastrelliger_metadata.json         # Metadata taksonomi, unit, volume, parameter MSY
├── selaroides/
│   ├── selaroides_monthly_features.csv     # 8.778 baris
│   └── selaroides_metadata.json
└── upeneus/
    ├── upeneus_monthly_features.csv        # 8.778 baris
    └── upeneus_metadata.json
```
