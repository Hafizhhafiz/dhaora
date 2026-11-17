# PHASE 15 — BACKEND & DASHBOARD INTEGRATION PLAN
**Status:** COMPLETED & VERIFIED  
**Fase Pemilik:** Fullstack Software Engineer, System Architect

---

## 1. Sasaran Utama
1. Memverifikasi transisi otomatis backend FastAPI ke status `CUSTOM_SPECIES_MODEL` saat mendeteksi keberadaan bobot `backend/weights/fishguard_yolo.pt`.
2. Mengintegrasikan endpoint deteksi (`/api/detect`), estimasi panjang terkalibrasi (`/api/measure`), riwayat tangkapan (`/api/history`), dan statistik agregat (`/api/statistics`).
3. Memastikan keselarasan skema 3 kelas MVP (*R. brachysoma*, *S. leptolepis*, *U. sulphureus*) di seluruh lapisan backend (FastAPI, Pydantic, SQLite).
4. Menyinkronkan antarmuka pengguna React Vite (Dashboard, DetectionPage, CountingPage, MeasurementPage) untuk menampilkan data deteksi riil, komposisi tangkapan, dan status ladder validasi panjang.
5. Menjalankan pengujian integrasi end-to-end tanpa kegagalan via `backend/test_pipeline.py`.
