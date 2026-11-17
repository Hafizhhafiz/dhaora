# KNOWN ISSUES — ByCatch AI

| Issue ID | Severity | Deskripsi | Workaround / Solusi | Status |
|---|---|---|---|---|
| **ISS-001** | Medium | Perintah `git` tidak ditemukan dalam PATH sistem Windows. | Versi tracking dilakukan manual melalui `CHANGELOG.md` dan snapshot timestamp. Pengguna disarankan menginstal Git for Windows jika ingin version control aktif. | `open` |
| **ISS-002** | High | RAM sistem fisik 8 GB dengan sisa bebas ~700 MB–1,1 GB saat idle. Rentan system thrashing. | Wajib melatih model dengan `workers=0`, `cache=False`, batch 2–4. Menjalankan proses training secara terpisah di latar belakang (bukan dalam IDE). Guard RAM diaktifkan. | `mitigated` |
| **ISS-003** | Medium | Dataset primer PPN Karangantu belum tersedia (0 gambar). | Seluruh kode Phase 4–12 diuji menggunakan dataset sintetis (`synthetic=true`) di `tests/fixtures/` atau `results/_smoke/`. Model riset tidak dilatih sebelum data riil diunggah. | `pending_data` |
| **ISS-004** | Low | Python 3.14 terpasang di host, ekosistem library AI baru mulai merilis wheel cp314. | Menggunakan wheel resmi PyTorch cu128 yang kompatibel cp314 (`torch-2.11.0+cu128`). Verifikasi ketat dijalankan lewat `verify_install.py`. | `in_verification` |
