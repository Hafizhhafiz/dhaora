# PROTOKOL VALIDASI FISIK PENANDA ARUCO & KALIBRASI METRIK
## FishGuard AI — ASIK V (Phase 11.7.2)
**Standar Kalibrasi:** OpenCV 5.0.0 ArucoDetector & DIN 866/II Metric Reference  
**Lokasi Penerapan:** Laboratorium SIK UPI & TPI PPN Karangantu  

---

## 1. SPESIFIKASI FISIK PENANDA ARUCO

Penanda kalibrasi optik FishGuard AI wajib memenuhi parameter fisik presisi berikut:
1. **Dictionary:** `cv2.aruco.DICT_4X4_50` (ID: 0).
2. **Dimensi Kotak Hitam Fisik:** $W_{marker} = 50,00\text{ mm} \pm 0,20\text{ mm}$ ($5,00\text{ cm}$).
3. **Batas Putih Keliling (Quiet Zone):** Lebar margin putih $\ge 10,0\text{ mm}$ di sekeliling keempat sisi luar penanda.
4. **Bahan Substrat & Laminasi:** Kertas sintetis polyart/tyvek berlaminasi doff matte anti-air dan anti-refleksi (bebas lapisan glossy yang memicu silau pantul).
5. **Penempatan:** Ditempel rata dan sejajar dengan mistar ukur pada sudut kiri atas bidang papan ukur akrilik.

```
+-------------------------------------------------------+
|  MARGIN PUTIH (QUIET ZONE) >= 10 mm                   |
|   +-----------------------------------------------+   |
|   | ####### ####### ####### ####### ####### ##### |   |
|   | #######                                 ##### |   |
|   | #######   POLA BINER ARUCO 4x4          ##### |   |  <--- 50.0 mm
|   | #######   (cv2.aruco.DICT_4X4_50, ID 0) ##### |   |
|   | #######                                 ##### |   |
|   | ####### ####### ####### ####### ####### ##### |   |
|   +-----------------------------------------------+   |
|                                                       |
+-------------------------------------------------------+
  <-------------------- >= 70.0 mm ------------------->
```

---

## 2. PROSEDUR VERIFIKASI FISIK DI LABORATORIUM

Sebelum penanda ArUco dibawa ke TPI Karangantu, operator wajib melakukan pengujian fisik di laboratorium:
1. **Pengukuran Manual Kaliper Digital:**
   - Ukur keempat sisi terluar kotak hitam penanda menggunakan kaliper geser digital terkalibrasi.
   - Catat nilai panjang sisi atas, bawah, kiri, dan kanan.
   - *Syarat Kelulusan:* Seluruh sisi berada pada rentang **$49,80\text{ mm} - 50,20\text{ mm}$** (toleransi $\le 0,4\%$).
2. **Pemeriksaan Quiet Zone:**
   - Ukur jarak dari garis hitam terluar ke batas tepi kartu potong.
   - *Syarat Kelulusan:* Margin putih $\ge 10,0\text{ mm}$ di seluruh perimeter.
3. **Verifikasi Silang Terhadap Mistar Baja Presisi:**
   - Letakkan kartu ArUco berdampingan dengan mistar baja DIN 866.
   - Ambil foto uji tegak lurus $90^\circ$.
   - Jalankan skrip deteksi otomatis untuk menghitung jarak antara garis $0\text{ cm}$ dan garis $10\text{ cm}$ pada mistar baja ($100,0\text{ mm}$).
   - *Syarat Kelulusan:* Galat konversi skala piksel ArUco terhadap mistar baja **$\le 0,5\%$** ($< 0,5\text{ mm}$ pada panjang $100\text{ mm}$).

---

## 3. LOGIKA PENOLAKAN SISTEM (FAIL-SAFE REJECTION)

Algoritma computer vision FishGuard AI secara otomatis **menolak citra dan membatalkan estimasi panjang** jika terjadi kondisi berikut:
- Penanda ArUco tidak terdeteksi (`ids is None` atau `len(ids) == 0`).
- ID penanda yang terdeteksi bukan ID 0 (`id != 0`).
- Geometri penanda terdistorsi parah (rasio aspek sisi penanda $\Delta > 5\%$ akibat sudut kamera miring atau lensa cembung).
- Nilai galat reproyeksi (*reprojection error*) penanda $> 1,5\text{ piksel}$.

Pada kondisi tersebut, sistem mengeluarkan pesan kesalahan:
$$\mathbf{ERROR:\; ARUCO\_CALIBRATION\_FAILED\; [FRAME\; REJECTED]}$$
Operator diinstruksikan membersihkan kartu penanda dari tetesan air/lendir dan melakukan pemotretan ulang (*retake*).
