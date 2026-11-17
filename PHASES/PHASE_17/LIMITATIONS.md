# PHASE 17 — LIMITATIONS & PROTOTYPE BOUNDARIES

1. **Batas Ruang Lingkup Prototipe (Prototype Milestone Scope):**
   Prototipe FishGuard AI yang dihasilkan pada Phase 17 adalah sistem operasional tingkat laboratorium dan lingkungan terkontrol (*Technology Readiness Level / TRL 4–5*). Sistem membuktikan kelayakan penuh algoritma Computer Vision untuk deteksi 3 spesies MVP, penghitungan cacah, dan estimasi panjang 2D berbasis penanda optik.
2. **Keterbatasan Spesimen Lapangan Fisik:**
   Fase ekspedisi lapangan fisik (11.7.4, 11.7.5, 11.8) berstatus strictly `BLOCKED` menunggu perizinan resmi PPN Karangantu dan tangkapan fisik nelayan. Dengan demikian, performa pada kondisi riil pelabuhan yang basah, kotor, dan bervariasi ekstrem tetap merupakan target riset lanjutan pasca-kompetisi ASIK V.
3. **Keterbatasan Ukuran Dataset Baseline:**
   Model baseline YOLOv8n dilatih pada 80 citra latih sintetis (10 epoch) dengan mAP50 test independen sebesar $0.3673$. Peningkatan akurasi membutuhkan ekspansi dataset dengan citra negatif lapangan (*negative background samples*) untuk menekan false positive rate pada look-alike non-target.
