# PHASE 11.7.4 — CONTROLLED SPECIMEN PILOT PLAN
**Status:** PLANNED (WAITING FOR 11.7.3 APPROVAL & PHYSICAL SPECIMEN ACCESS)  
**Tujuan:** Menguji alur kerja pemotretan spesimen fisik biologis, verifikasi morfologi per individu, pencatatan pengukuran manual ground truth (TL, FL, SL) oleh dua pengamat, serta validasi skrip quality control (QC) citra sebelum ekspedisi sampling penuh.

---

## 1. Rencana Ukuran Sampel Pilot
- **Class 0 (*Rastrelliger brachysoma*):** 10–15 spesimen fisik unik.
- **Class 1 (*Selaroides leptolepis*):** 10–15 spesimen fisik unik.
- **Class 2 (*Upeneus sulphureus*):** 10–15 spesimen fisik unik.
- **Total:** 30–45 spesimen fisik terkontrol.
- *Catatan:* Angka ini merupakan target rencana dan tidak boleh dipalsukan jika ketersediaan pasar/nelayan lokal hanya menyediakan sebagian.

---

## 2. Alur Kerja Pengambilan Data per Spesimen
1. **Pemberian ID Unik:** Setiap ikan diberi tag fisik bernomor (`SPEC_C0_001`, dsb.).
2. **Verifikasi Taksonomi Ahli:** Ahli biologi/perikanan mencatat karakter diagnostik (sisir insang, scute, sungut dagu, sirip ekor) pada formulir.
3. **Pengukuran Manual Ground Truth:**
   - Total Length (TL): dari ujung moncong tertutup sampai ujung terpanjang sirip ekor yang dikatupkan.
   - Fork Length (FL): dari ujung moncong sampai lekukan percabangan sirip ekor (fork).
   - Standard Length (SL): dari ujung moncong sampai pangkal batas tulang sirip ekor.
   - Diukur secara berulang oleh Pengamat 1 dan Pengamat 2 menggunakan jangka sorong digital $\pm 0,02$ mm untuk menghitung *inter-observer error*.
4. **Pemotretan di Rig Terkalibrasi:**
   - Sudut 1: Lateral kiri datar (kepala menghadap ke kiri, menyentuh headblock).
   - Sudut 2: Lateral kanan datar.
   - Sudut 3: Sedikit miring (oblik 15°) untuk uji ketahanan model terhadap variasi pose.
5. **Ingestion & QC Otomatis:** Skrip memeriksa blur Laplacian, kecerahan, dan keterbacaan marker ArUco.
