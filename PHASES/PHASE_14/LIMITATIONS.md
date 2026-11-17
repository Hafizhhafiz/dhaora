# PHASE 14 — LIMITATIONS & SCIENTIFIC BOUNDARIES

1. **Batasan Fisik Planar 2D:**
   Estimasi panjang menggunakan kamera monokular mengasumsikan ikan terbentang sempurna pada bidang $Z=0$. Ketebalan tubuh ikan (tinggi dorsal-ventral) menyebabkan pembesaran optik relatif sebesar $\frac{\Delta Z}{H} \approx \frac{15\text{ mm}}{900\text{ mm}} \approx 1.67\%$.
2. **Ketergantungan terhadap Kualitas Segmentasi Kontur:**
   Jika latar belakang meja pendaratan kotor, basah oleh genangan lendir atau es mencair, segmentasi Otsu dapat membesar atau mengecilkan batas moncong/sirip ekor sebesar $\pm 3 - 6\text{ px}$.
3. **Status Lapangan Tetap EXPERIMENTAL:**
   Meskipun algoritma telah terverifikasi secara matematis dan optis di laboratorium (`VALIDATED` pada kerangka sintetis/planar uji), status estimasi panjang pada ikan fisik tangkapan nelayan Karangantu tetap dikunci pada level **`EXPERIMENTAL`** hingga Phase 11.7.4 (pengukuran spesimen fisik riil dengan jangka sorong) dapat dilaksanakan pasca perizinan resmi.
