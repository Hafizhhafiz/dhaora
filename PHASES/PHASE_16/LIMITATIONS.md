# PHASE 16 — LIMITATIONS & VALIDATION SCOPE

1. **Lingkungan Pengujian Terkendali (Controlled In-Process Environment):**
   Pengujian integrasi otomatis dijalankan menggunakan `fastapi.testclient.TestClient` pada proses lokal untuk menjamin determinisme tinggi tanpa fluktuasi socket jaringan eksternal.
2. **Keterbatasan Evaluasi Lapangan Fisik:**
   Kategori Uji 12 (Validasi Lapangan Operasional di Dermaga PPN Karangantu) tidak dieksekusi secara fisik di lapangan karena fase ekspedisi fisik (11.7.4, 11.7.5, 11.8) berstatus `BLOCKED` menunggu perizinan resmi dan spesimen tangkapan segar. Sesuai integritas ilmiah, pengujian lapangan tidak dipalsukan.
