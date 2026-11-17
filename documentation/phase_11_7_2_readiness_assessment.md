# PENILAIAN FORMAL KESIAPAN PRE-FLIGHT (PHASE 11.7.2)
## FishGuard AI — ASIK V
**Tanggal Penilaian:** 16 November 2026  
**Auditor:** Tim Multidisiplin FishGuard AI  
**Status Kesiapan:** **`CONDITIONALLY_READY_FOR_PILOT`**  

---

## 1. PENETAPAN STATUS & JUSTIFIKASI

Berdasarkan audit komputasional kamera FoV, perancangan checklist verifikasi rig fisik, protokol validasi fisik ArUco, dan penyusunan gerbang kelulusan pilot (*pilot execution gate*), status sistem FishGuard AI ditetapkan sebagai:

$$\mathbf{STATUS:\; CONDITIONALLY\_READY\_FOR\_PILOT}$$

### Landasan Ilmiah Penetapan Status:
1. **Koreksi Kritis FoV Berhasil Diselesaikan:** Kesalahan klaim optik Phase 11.7.1 (jarak 50 cm menghasilkan FoV 55 cm pada lensa 35mm) telah dikoreksi secara matematis melalui [camera_fov_calculator.py](file:///c:/TUGAS-TUGAS%20KULIAH/SEMESTER%205/ASIK%20VOL%20VI/dataset_pipeline/reports/phase_11_7_2/camera_fov_calculator.py). Konfigurasi operasional direvisi menjadi **jarak kerja $H = 90\text{ cm}$ untuk lensa 35mm (FoV $60,4\text{ cm}$)** atau alternatif lensa wide 18mm pada jarak 50 cm.
2. **Pemisahan Tegas Simulasi vs Pengujian Fisik:** Seluruh pengujian perangkat lunak, algoritma deteksi ArUco OpenCV, dan pemisahan data anti-leakage telah berstatus **`PASS_ACTUAL`** / **`SIMULATION_PASS`**.
3. **Kondisi Fisik Belum Diuji (`NOT_TESTED_IN_FIELD`):** Pengujian fisik rig di dermaga basah TPI, pencetakan fisik kartu ArUco dengan margin $\ge 10\text{ mm}$, dan pengantongan surat izin administrasi secara transparan ditandai sebagai **`NOT_TESTED_IN_FIELD`** dan menjadi syarat mutlak pembukaan gerbang pilot sampling.

---

## 2. REKAPITULASI 10 GERBANG KELULUSAN PILOT (GO / NO-GO)

| Gate ID | Dimensi Pengujian | Ambang Batas Wajib | Status Saat Ini | Kategori Kelayakan |
|:---:|:---|:---|:---:|:---:|
| **GATE-01** | Optical FoV Coverage | FoV horizontal $\ge 60,0\text{ cm}$ (Papan 50 cm + margin) | `SIMULATION_PASS` | Layak (H=90cm, f=35mm) |
| **GATE-02** | ArUco Card Quiet Zone | Margin putih $\ge 10,0\text{ mm}$ keliling pada kartu cetak | `NOT_TESTED_PHYSICAL` | Wajib ukur fisik di lab |
| **GATE-03** | Camera Rig Leveling | Bubble level tepat di tengah (sudut $90^\circ \pm 0,5^\circ$) | `NOT_TESTED_PHYSICAL` | Wajib pasang fisik di lab |
| **GATE-04** | Working Distance Height | Ketinggian sensor $H = 90,0\text{ cm} \pm 1,0\text{ cm}$ | `NOT_TESTED_PHYSICAL` | Wajib ukur meteran fisik |
| **GATE-05** | Diffuse Lighting Rig | Glare $< 10\text{ px}$ pada area anatomi, variasi lux $< 15\%$ | `NOT_TESTED_PHYSICAL` | Wajib uji panel LED fisik |
| **GATE-06** | Dual-Operator Biometrics | Delta manual operator 1 vs 2 $\le 1,0\text{ mm}$ pada $\ge 95\%$ sampel | `SIMULATION_PASS` | Teruji pada lembar template |
| **GATE-07** | Specimen-Photo Linkage | Relasi relasional 1-to-many $100\%$ terverifikasi, nol orphan | `PASS_ACTUAL` | Teruji pada skrip validasi |
| **GATE-08** | Anti-Data Leakage | $0,00\%$ kebocoran spesimen antar Train/Val/Test | `PASS_ACTUAL` | Teruji GroupShuffleSplit |
| **GATE-09** | Research Permit Letter | Surat izin resmi UPI Kampus Serang tertandatangani | `NOT_TESTED_PHYSICAL` | Wajib cetak fisik |
| **GATE-10** | K3 / APD Lengkap | Sepatu bot karet, sarung tangan nitril, kotak P3K siap | `NOT_TESTED_PHYSICAL` | Wajib inspeksi fisik |

---

## 3. KESIMPULAN

Sistem FishGuard AI **memiliki seluruh instrumen, kalkulator, checklist, dan protokol yang dibutuhkan untuk validasi pra-penerbangan**. Tim peneliti diizinkan melakukan gladi resik perakitan fisik di laboratorium kampus UPI Serang sebelum mengeksekusi pilot sampling 45 spesimen di TPI Karangantu.
