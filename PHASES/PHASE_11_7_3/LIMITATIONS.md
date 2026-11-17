# PHASE 11.7.3 — KNOWN LIMITATIONS
**Dokumentasi Batasan Teknis dan Ilmiah Rig Pengambilan Citra Laboratorium**

1. **Status Pengujian Terbatas pada Sintesis & Simulasi Geometris:**
   Seluruh angka keterulangan ($CV = 0,200\%$) dan akurasi objek ($Error = 0,09\text{ mm}$) pada Phase 11.7.3 diperoleh melalui pengujian citra sintetis terkontrol beresolusi tinggi dengan noise sensor terukur. Angka ini membuktikan bahwa algoritma OpenCV dan formula optik berfungsi sempurna, namun belum merepresentasikan fluktuasi mekanis bodi dan lensa fisik di meja laboratorium riil.

2. **Ketergantungan Bidang Datar 2D (Planar Assumption):**
   Estimasi skala metrik mengasumsikan ikan terletak pada bidang horizontal yang persis setinggi bidang penanda ArUco ($Z = 0$). Ikan yang tebal (misal *Rastrelliger brachysoma* dengan ketebalan tubuh 3–4 cm) akan memiliki bagian atas tubuh yang lebih dekat ke lensa kamera ($\Delta Z \approx 3\text{ cm}$), menghasilkan efek pembesaran paralaks sekitar $3 / 90 \approx 3,3\%$. Koreksi ketebalan tubuh harus diperhitungkan dalam Phase 14.

3. **Batasan Penerangan Lapangan:**
   Meskipun rig laboratorium dilengkapi panel LED ganda 45°, kondisi pendaratan sebenarnya di dermaga TPI Karangantu dapat dipengaruhi oleh perubahan cahaya matahari alami yang masuk dari samping dermaga.
