# PHASE 11.7.3 — OPTICAL CALIBRATION PROCEDURE
**Standard Operating Procedure (SOP) Kalibrasi Optik Piksel-ke-Milimeter OpenCV**

---

## 1. Prinsip Dasar Kalibrasi
Estimasi ukuran metrik 2D mengasumsikan bahwa:
1. Kamera terpasang tegak lurus sempurna ($90^\circ$) terhadap bidang ukur horizontal.
2. Spesimen ikan diletakkan mendatar (*flat planar surface*) setinggi bidang marker kalibrasi.
3. Distorsi radial lensa telah dikoreksi atau bernilai minimal ($\le 1.0\%$).

Rasio skala metrik dihitung melalui deteksi empat titik sudut penanda ArUco:
$$S_{\text{mm/px}} = \frac{L_{\text{marker}} \text{ (mm)}}{\text{Panjang sisi marker dalam piksel (px)}}$$

---

## 2. Langkah-Langkah Operasional Kalibrasi Harian

### Langkah 1: Pemasangan Rig & Pengecekan Waterpass
1. Pasang bodi kamera pada rig ekstensi horizontal pada ketinggian $H = 90,0 \text{ cm} \pm 1,0 \text{ cm}$.
2. Periksa waterpass digital/tabung pada bodi kamera: deviasi sudut kemiringan (*tilt* pitch/roll) wajib $< 0,5^\circ$.
3. Nyalakan panel lampu LED 45° dan periksa keseragaman pencahayaan di atas papan ukur menggunakan lux meter atau histogram kamera (deviasi luminesensi antar-sudut $\le 10\%$).

### Langkah 2: Pemotretan Citra Kalibrasi Awal Sesi (*Start-of-Session*)
1. Tempatkan papan ukur 50 cm dan marker ArUco 50 mm di bidang pandang kamera.
2. Tempatkan mistar kalibrasi presisi baja terkalibrasi di tengah bidang pandang.
3. Kunci parameter kamera pada mode Manual:
   - Shutter speed: $\ge 1/125\text{ s}$ (mencegah blur getaran).
   - Aperture: $f/5.6 - f/8.0$ (memaksimalkan kedalaman bidang/DoF dan ketajaman optik tepi).
   - ISO: 100 - 400 (meminimalkan digital noise).
   - Focus: Manual Focus (MF) dikunci pada bidang marker.
4. Ambil citra kalibrasi pertama: `CALIB_<SESSION_ID>_START.JPG`.

### Langkah 3: Eksekusi Skrip Kalibrasi Otomatis
Jalankan skrip kalibrasi resmi:
```powershell
python "tools/calibrate_scale.py" --image "path/to/CALIB_START.JPG" --marker_size_mm 50.0
```

### Langkah 4: Kriteria Penerimaan Kalibrasi
- Marker terdeteksi dengan 4 titik sudut lengkap.
- Rasio aspek marker $W_{\text{px}} / H_{\text{px}}$ berada di antara $0,98$ dan $1,02$ (membuktikan ketiadaan distorsi miring/paralaks sudut).
- Panjang sisi mistar pembanding $150 \text{ mm}$ terestimasi dalam batas toleransi $\pm 2.0\%$ ($\pm 3,0 \text{ mm}$).
- Jika kriteria terpenuhi: status kalibrasi **VALID**. Nilai scale factor disimpan ke metadata sesi.
- Jika gagal: periksa sudut kemiringan tripod, bersihkan quiet zone marker, dan ulangi kalibrasi.
