# PROTOKOL UJI COBA LAPANGAN (PILOT SAMPLING PROTOCOL)
## FishGuard AI — ASIK V (Phase 11.7)
**Lokasi Uji Coba:** TPI Karangantu, PPN Karangantu, Kota Serang, Banten  
**Institusi:** Program Studi Sistem Informasi Kelautan (SIK), UPI Kampus Serang  
**Jadwal Rencana:** 20 November 2026 (Pukul 05:30 – 08:30 WIB)  

---

## 1. TUJUAN UJI COBA PILOT

Uji coba pilot berskala kecil (*pilot dry run*) dirancang sebagai gladi resik operasional penuh sebelum ekspedisi sampling utama dilaksanakan. Uji coba ini bertujuan menguji dan memvalidasi secara empiris:
1. **Stabilitas Mekanik Rig & Optik:** Menguji kekokohan tripod lengan horizontal dan konsistensi sudut ortogonal $90^\circ$ di lantai TPI yang basah.
2. **Keterbacaan Kalibrator Metrik:** Memastikan marker ArUco 50 mm dan garis mistar akrilik 0.1 cm dapat dideteksi 100% secara otomatis oleh algoritma computer vision.
3. **Pemberantasan Pantulan Cahaya (Glare Control):** Menguji efektivitas kain lap microfiber dan panel LED diffuser dalam menghilangkan pantulan lendir ikan.
4. **Kecepatan & Akurasi Verifikasi Taksonomi On-Site:** Mengukur waktu yang dibutuhkan ahli taksonomi untuk memverifikasi ciri diagnostik 3 kelas target.
5. **Integritas Sinkronisasi Data (Zero Leakage Linkage):** Memastikan tidak ada berkas foto yang kehilangan relasi dengan `specimen_id` pada template CSV.

---

## 2. DESAIN & KUOTA SAMPEL PILOT

- **Target Kuota Sampel:**
  - Class 0 (*Rastrelliger brachysoma*): 15 spesimen unik.
  - Class 1 (*Selaroides leptolepis*): 15 spesimen unik.
  - Class 2 (*Upeneus sulphureus*): 15 spesimen unik.
  - **Total Spesimen Pilot:** **45 ekor ikan unik**.
- **Total Citra yang Dihasilkan:**
  - $45 \text{ spesimen} \times 3 \text{ variasi foto} = 135\text{ citra baseline/variasi}$.
  - Ditambah 5 foto multi-spesimen (kluster) untuk uji counting = **140 citra total**.

---

## 3. MATRIKS KRITERIA LULUS / GAGAL PILOT (PASS/FAIL GATEWAY)

Uji coba pilot dinyatakan **LULUS (PASS)** dan memberikan lampu hijau untuk Ekspedisi Penuh jika seluruh kriteria ambang batas kuantitatif terpenuhi:

| Indikator Kinerja Utama (KPI) | Parameter Uji | Ambang Batas Lulus (Target) | Status Evaluasi |
|:---|:---|:---:|:---:|
| **Optical Usability Rate** | Persentase citra bebas blur, bebas glare parah, fokus tajam | $\ge 90,0\%$ | *Pending Pilot* |
| **ArUco Detection Success** | Keberhasilan algoritma mendeteksi marker ArUco otomatis | **$100,0\%$** (Wajib 100%) | *Pending Pilot* |
| **Ground Truth Error (TL)** | Selisih pembacaan manual operator 1 vs operator 2 | $\Delta \le 1,0\text{ mm}$ pada $\ge 95\%$ sampel | *Pending Pilot* |
| **Specimen-Photo Linkage** | Kesesuaian berkas foto fisik terhadap baris data template CSV | **$100,0\%$** (Nol file orphan) | *Pending Pilot* |
| **Taxonomic Ambiguity Rate** | Persentase spesimen yang meragukan / perlu eskalasi lab | $\le 5,0\%$ (Maksimal 2 ekor) | *Pending Pilot* |
| **Throughput Kecepatan** | Rata-rata waktu handling, ukur, foto, dan logging per ekor | $\le 90\text{ detik / ekor}$ | *Pending Pilot* |

### Tindakan Jika Pilot Gagal (Failure Protocol):
- Jika **Usability Rate $<90\%$** akibat glare: Ubah sudut pencahayaan diffuser dari $45^\circ$ menjadi $60^\circ$ pantul tak langsung (*bounce light*), dan perketat pengeringan lendir.
- Jika **ArUco Detection $<100\%$**: Ganti posisi penempatan marker lebih mendekati pusat bidang pandang lensa atau perbesar ukuran marker menjadi $70\text{ mm}$.
- Jika **Linkage Error $>0\%$**: Hentikan alur kerja, audit ulang urutan kartu memori, dan gunakan barcode label fisik yang dapat dipindai kamera.
- Uji coba pilot wajib diulang hingga seluruh kriteria mencapai status **PASS**.

---

## 4. LARANGAN KLAIM PREMATUR

> [!CAUTION]
> **Larangan Mengklaim Sampling Telah Dilakukan**:
> Dokumen ini adalah protokol perencanaan pengujian pilot. Tim dilarang keras membuat klaim atau menulis laporan bahwa pengujian fisik pilot telah selesai dilaksanakan sebelum tanggal eksekusi nyata pada 20 November 2026.
