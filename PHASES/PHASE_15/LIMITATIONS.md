# PHASE 15 — LIMITATIONS & INTEGRATION SCOPE

1. **Inferensi CPU Standar:**
   Inferensi model dieksekusi pada CPU laptop (latensi $\sim 90\text{ ms}$ untuk YOLO dan $\sim 4\text{ detik}$ saat cold-start inisialisasi PyTorch). Di lingkungan server produksi dermaga pendaratan, akselerasi GPU (CUDA/TensorRT) disarankan jika throughput $> 30\text{ FPS}$ simultan diperlukan.
2. **Kapasitas Penyimpanan Gambar:**
   Gambar upload dan hasil anotasi disimpan di direktori lokal `backend/static/`. Pada penggunaan jangka panjang, rotasi penyimpanan atau object storage (minIO / S3) diperlukan untuk mencegah disk overflow.
3. **Penyimpanan SQLite Lokal:**
   SQLite memadai untuk MVP operasional lokal di pos pendaratan PPN Karangantu (single-writer model). Untuk multi-kamera jaringan terdistribusi, migrasi ke PostgreSQL disarankan pada Fase Produksi skala penuh.
