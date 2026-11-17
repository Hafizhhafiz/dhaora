# STANDAR OPERASIONAL PROSEDUR (SOP) PENGAMBILAN DATA CITRA LAPANGAN
## FishGuard AI — ASIK V (Phase 11.7)
**Lokasi Penerapan:** Tempat Pelelangan Ikan (TPI) Karangantu & PPN Karangantu, Teluk Banten  
**Institusi:** Program Studi Sistem Informasi Kelautan (SIK), UPI Kampus Serang  
**Versi Dokumen:** 2.0 (Harmonisasi 3 Kelas Target MVP)  
**Tanggal Berlaku:** 16 November 2026  

---

## 1. TUJUAN & RUANG LINGKUP

### 1.1 Tujuan
Menstandarkan seluruh prosedur teknis akuisisi citra digital ikan hasil tangkapan nelayan di atas meja sortir pendaratan dan papan ukur terkalibrasi untuk menghasilkan dataset primer berkualitas tinggi yang:
1. Memenuhi syarat geometrik visi komputer (ortogonal $90^\circ$, bebas distorsi perspektif).
2. Memiliki resolusi optik tinggi dan pencahayaan merata bebas *specular glare*.
3. Mencegah kebocoran data (*data leakage*) pada tingkat individu spesimen.
4. Terkalibrasi secara metrik (skala milimeter dan marker ArUco) untuk estimasi panjang (*Total Length*).

### 1.2 Ruang Lingkup Spesies Target (MVP 3-Kelas)
- **Class 0:** *Rastrelliger brachysoma* (Ikan Kembung Perempuan)
- **Class 1:** *Selaroides leptolepis* (Ikan Selar Kuning)
- **Class 2:** *Upeneus sulphureus* (Ikan Kuniran)

Spesies di luar ketiga taksa di atas (termasuk *Rastrelliger kanagurta* dan *Decapterus macarellus*) diklasifikasikan sebagai `EXCLUDED_NON_MVP_SPECIES` (`class_id: -1`).

---

## 2. PENGATURAN TEMPAT & KONDISI LINGKUNGAN (ENVIRONMENT SETUP)

```
       [ KAMERA 90° ORTOGONAL ]  <--- Dilengkapi Bubble Level (0.0° pitch/roll)
                 |
                 | Jarak Tetap: 45 - 55 cm
                 v
   +-------------------------------+   <--- Diffused LED Panel 5500K / Natural Shade
   | [ArUco]                       |
   | |                             |
   | v                             |
   | [=== PAPAN UKUR AKRILIK ===]  |   <--- Skala Engraved 0.1 cm
   | [HEAD] >======IKAN======> [TAIL]
   | [BOARD]                       |
   +-------------------------------+   <--- Background Biru Matte Anti-Refleksi
```

### 2.1 Lokasi & Waktu Operasional
- **Area Kerja:** Meja sortir TPI Karangantu yang kokoh, terlindung dari terik matahari langsung dan tempias ombak/hujan.
- **Waktu Sampling:** Pukul **05:30 – 08:30 WIB** (puncak pendaratan armada bagan tancap dan kapal payang pesisir Teluk Banten).

### 2.2 Perakitan Rig Kamera
1. Pasang tripod heavy-duty dengan *horizontal boom arm* (lengan ekstensi $90^\circ$).
2. Kunci kamera mirrorless (lensa prime ekuivalen 35–50 mm) menghadap lurus ke bawah (*top-down orthogonal*).
3. Atur ketinggian lensa tepat **45 – 55 cm** dari permukaan papan ukur.
4. Pasang waterpas bundar (*circular bubble level*) pada hot-shoe kamera. Sesuaikan sudut ballhead hingga gelembung udara berada tepat di tengah lingkaran ($0,0^\circ$ deviasi pitch dan roll).
5. Pasang panel lampu LED 5500K dengan softbox diffuser bersudut $45^\circ$ di sisi berlawanan untuk memancarkan cahaya lembut merata.

### 2.3 Standar Latar Belakang (Background)
- Papan ukur (*ichthyometer*) diletakkan di atas alas karet biru matte anti-refleksi.
- Marker ArUco 50 mm (`DICT_4X4_50`) dipasang permanen pada sudut kiri atas bidang papan ukur, sejajar dengan mistar ukur.

---

## 3. PROSEDUR PENANGANAN SPESIMEN (SPECIMEN HANDLING)

1. **Pemilihan Spesimen:** Pilih ikan dalam kondisi fisik utuh (mata relatif jernih, sirip tidak robek parah, tubuh tidak terlipat kaku).
2. **Pembersihan Permukaan:** Usap tubuh ikan secara lembut menggunakan kain lap microfiber lembap untuk menghilangkan lendir berlebih, serpihan es, kotoran, atau tetesan darah yang dapat memicu pantulan silau (*specular glare*).
3. **Orientasi Baku:**
   - Letakkan ikan dengan **posisi lateral kiri menghadap ke atas** (*left lateral view*).
   - Tempelkan ujung moncong (*snout tip*) secara rapat dan tegak lurus menyentuh pembatas kepala (*headboard* di titik 0.0 cm).
   - Luruskan garis sumbu tubuh ikan sejajar dengan garis horizontal mistar ukur.
   - Bentangkan sirip ekor secara wajar (*natural caudal spread*).

---

## 4. URUTAN PENGAMBILAN CITRA PER SPESIMEN (CAPTURE SEQUENCE)

Untuk setiap **1 individu ikan unik (`specimen_id`)**, ambil rangkaian foto berikut secara disiplin:

| No | Tipe Foto | Sudut Kamera & Orientasi Ikan | Tujuan Pelatihan AI |
|:---:|:---|:---|:---|
| **Foto 01** | **Baseline Ortogonal Murni** | Sudut $90^\circ$ tegak lurus sempurna, ikan lurus, sirip ekor mengembang alami | Ground truth estimasi panjang (TL) & deteksi utama |
| **Foto 02** | **Variasi Kemiringan Mikro** | Sudut $85^\circ$ (miring $5^\circ$) atau ikan diputar diagonal $15^\circ$ | Uji ketahanan model terhadap distorsi sudut pendaratan |
| **Foto 03** | **Variasi Sirip Ekor Terkatup** | Sudut $90^\circ$, sirip ekor dibiarkan sedikit menguncup alami | Evaluasi variabilitas morfologi keypoint ujung ekor |
| **Foto 04\*** | **Multi-Spesimen (Kluster)** | 3–6 ekor ikan diletakkan bersamaan (opsional, per batch) | Evaluasi modul *counting* dan penanganan oklusi |

*\*Foto multi-spesimen dicatat dengan batch ID tersendiri dan tidak dihitung sebagai penambahan kuota individu unik.*

---

## 5. PROTOKOL ANTI-DATA LEAKAGE & SISTEM ID

> [!IMPORTANT]
> **Larangan Penggandaan ID Individu (Anti-Leakage Mandate)**:
> Dilarang keras memberikan `specimen_id` baru untuk foto-foto yang berasal dari individu ikan yang sama! Seluruh variasi foto dari 1 ekor ikan wajib merujuk ke 1 `specimen_id`.

Format Penamaan Berkas Citra:
$$\mathbf{TB\_<YYYYMMDD>\_<LOKASI>\_<KODE\_SPESIES>\_<ID\_SPESIMEN>\_<INDEX\_FOTO>.<ext>}$$

Contoh:
- `TB_20261120_KRN_RB_0001_01.jpg` (Foto 01 dari Spesimen 0001 Kembung Perempuan)
- `TB_20261120_KRN_RB_0001_02.jpg` (Foto 02 dari Spesimen 0001 Kembung Perempuan)
- `TB_20261120_KRN_SL_0002_01.jpg` (Foto 01 dari Spesimen 0002 Selar Kuning)

---

## 6. KONTROL KUALITAS DI TEMPAT (ON-SITE QC & TRIAGE)

Sebelum ikan dikembalikan kepada pedagang, operator wajib memverifikasi citra di layar kamera/laptop:
- **Status `USABLE` (Lolos):** Seluruh tubuh ikan fokus tajam, skala milimeter terbaca, marker ArUco terdeteksi, tanpa bayangan gelap operator.
- **Status `DISCARDED_BLUR` (Ulangi):** Gambar kabur karena getaran tangan atau gerakan ikan $\rightarrow$ Foto ulang seketika.
- **Status `DISCARDED_GLARE` (Ulangi):** Terdapat silau putih yang menutupi garis tepi tubuh atau ekor $\rightarrow$ Keringkan dengan lap microfiber dan foto ulang.
- **Status `DAMAGED_SPECIMEN` (Eksklusi):** Ujung sirip ekor atau moncong patah saat penanganan $\rightarrow$ Beri status rusak, jangan masukkan ke dataset ground truth panjang.
