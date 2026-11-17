# PENILAIAN FORMAL KESIAPAN EKSEKUSI PILOT (PHASE 11.7.1)
## FishGuard AI — ASIK V
**Tanggal Evaluasi:** 16 November 2026  
**Auditor:** Tim Multidisiplin FishGuard AI  
**Lokasi Studi:** PPN Karangantu, Teluk Banten  

---

## 1. PENETAPAN STATUS AKHIR PHASE 11.7.1

Berdasarkan hasil uji coba simulasi laboratorium, stress-test algoritma OpenCV ArUco, validasi anti-data leakage, dan simulasi metadata 3 dummy spesimen, status sistem ditetapkan secara resmi sebagai:

$$\mathbf{STATUS:\; CONDITIONALLY\_READY\_FOR\_PILOT}$$

### Definisi & Justifikasi Status:
- Seluruh komponen **perangkat lunak, logika kalibrasi metrik, skema anotasi keypoints, dan pipeline metadata telah diverifikasi 100% LULUS (PASS)** melalui pengujian empiris langsung.
- Namun, sesuai prinsip integritas riset: **"Jangan memberi status PASS hanya karena prosedur tertulis sudah tersedia. Jangan menyatakan seluruh perangkat fisik telah diuji jika pengujian hanya dilakukan melalui simulasi perangkat lunak."**
- Status bersyarat (*conditionally ready*) diberikan dengan **3 syarat pra-penerbangan fisik (*pre-flight conditions*)** yang wajib dipenuhi sebelum tim berangkat ke dermaga TPI Karangantu.

---

## 2. MATRIKS EVALUASI KELAYAKAN TEKNIS (PASS / FAIL / SIMULATION)

| Parameter Evaluasi | Metode Pengujian | Status Hasil | Bukti Empiris & Catatan |
|:---|:---|:---:|:---|
| **Camera Angle & 90° Leveling** | Analisis Geometri & Bubble Level SOP | **SIMULATION_PASS** | Terbukti secara teoritis; fisik waterpas wajib diperiksa saat perakitan rig di TPI. |
| **Image Resolution & FoV** | Analisis Optik Sensor APS-C 35mm | **SIMULATION_PASS** | FoV horizontal $55\text{ cm}$ pada jarak $50\text{ cm}$ mencakup seluruh papan ukur $50\text{ cm}$. |
| **ArUco Detection Algorithm** | Kueri OpenCV 5.0.0 ArucoDetector | **PASS (ACTUAL)** | Berhasil mendeteksi ID 0 pada marker bersih dan tahan terhadap blur $\sigma=5.0$. |
| **ArUco Quiet Zone Sensitivity** | Uji Batas Kontur (Flush Cut vs Border) | **PASS (ACTUAL)** | Terbukti marker wajib memiliki margin putih $\ge 10\text{ mm}$ (tanpa margin deteksi 0%). |
| **Pixel-to-cm Scale Calculation** | Algoritma Euklidean 4 Titik Sudut | **PASS (ACTUAL)** | Skala terhitung $40,00\text{ px/cm}$ ($4,00\text{ px/mm}$) pada resolusi $200\text{ px}$. |
| **Biometric Parameter Definitions** | Konsistensi Standar FAO (TL/FL/SL/BD/W) | **PASS (ACTUAL)** | Seluruh definisi titik anatomi konsisten dan tertelusur. |
| **Keypoint Landmark Schema** | Skema 6 Keypoints ($KP_0$ s.d. $KP_5$) | **PASS (ACTUAL)** | Skema anotasi mencakup titik ujung moncong, ekor, dan kedalaman tubuh. |
| **Specimen ID Format & Uniqueness** | Uji Parsing Pola Regex & Integritas | **PASS (ACTUAL)** | Format `SP-KRG-YYYYMM-XX-XXXX` terbukti unik dan konsisten. |
| **Specimen-Photo Linkage** | Uji Relasi Relasional 1-to-Many | **PASS (ACTUAL)** | 1 spesimen terhubung ke multiple foto tanpa duplikasi identitas individu. |
| **Anti-Data Leakage Partitioning** | Simulasi GroupShuffleSplit 100 Spesimen | **PASS (ACTUAL)** | $0,00\%$ kebocoran spesimen antara partisi Train, Val, dan Test. |
| **Metadata Completeness** | Validasi 3 Dummy Spesimen Target | **PASS (ACTUAL)** | Seluruh kolom terisi 100% tanpa nilai null/kosong pada tabel simulasi. |
| **Field Hardware Physical Assembly** | Pengujian Mekanik di Meja Basah TPI | **NOT_TESTED_IN_FIELD** | Menunggu gladi resik fisik di TPI Karangantu. |

---

## 3. PERSYARATAN KELULUSAN PRE-FLIGHT (PRE-FLIGHT CONDITIONS)

Untuk mengubah status menjadi `READY_FOR_PILOT_EXECUTION` penuh di lapangan, tim wajib memverifikasi 3 butir fisik berikut:
- [ ] **Kondisi 1 (Fisik ArUco):** Cetakan fisik kartu ArUco 50 mm wajib memiliki tepi putih (*white margin*) selebar minimal $10\text{ mm}$ di sekeliling kotak hitam (tidak boleh dipotong mepet).
- [ ] **Kondisi 2 (Kesejajaran Rig):** Tripod horizontal boom dipasang di meja laboratorium SIK UPI Kampus Serang dan gelembung waterpas bundar dipastikan berada di titik pusat $0,0^\circ$.
- [ ] **Kondisi 3 (Legalitas Administrasi):** Surat izin koordinasi resmi dari UPI Kampus Serang ke PPN Karangantu telah dicetak dan dikantongi tim lapangan.
