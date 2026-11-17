# AGENTS.md — ByCatch AI Rules & Operating Protocol

## 1. Aturan Mutlak
- Integritas ilmiah: Tidak mengarang angka/metrik/status. Sumber resmi bertanggal.
- Kosakata status resmi: `planned`, `implemented`, `tested`, `validated`, `blocked`, `pending_data`.
- Data sintetis (`synthetic=true`) hanya di `tests/fixtures/` atau `results/_smoke/`. Dilarang masuk `dataset/`.
- `dataset/raw/` bersifat READ-ONLY. Kurasi = salin + manifest. Output ditimpa hanya dengan `--force`.
- Spesies (citra) dan Catch Role (metadata) adalah 2 proses terpisah. Jangan tebak bycatch dari visual.
- Semua paket di `venv/`. Dilarang perintah destruktif massal. Berhenti hanya di Human Approval Gate (P19).

## 2. Kelas Objek Penelitian (Tetap Tiga)
| Class ID | Nama Kelas | Nama Ilmiah | Famili |
|---|---|---|---|
| 0 | `kembung_perempuan` | *Rastrelliger brachysoma* | Scombridae |
| 1 | `selar_kuning` | *Selaroides leptolepis* | Carangidae |
| 2 | `kuniran` | *Upeneus sulphureus* | Mullidae |

## 3. Batas Hardware & Komputasi
- **GPU:** NVIDIA RTX 3050 Laptop (4 GB VRAM), Driver 573.05, CUDA 12.8.
- **RAM:** ~8 GB fisik (~700 MB–1,1 GB bebas). `workers=0`, `cache=False`, batch 2–4, imgsz 640/512/416.
- Training selalu sebagai proses terpisah (log ke file); guard RAM <1,0 GB (peringatan), <0,5 GB (batal); jeda bila GPU >=85°C.

## 4. Protokol Awal Sesi
1. Baca `AGENTS.md`, `PROJECT_STATUS.md` (NEXT ACTIONS), `TASKS.md`, `DECISIONS.md`, `KNOWN_ISSUES.md`.
2. Jalankan `python scripts/session_check.py`.
3. Kerjakan tugas sesuai dependensi. Dilarang mengulang tugas `tested`/`validated`.

## 5. Protokol Akhir Sesi
1. Perbarui `PROJECT_STATUS.md` (NEXT ACTIONS di atas), `TASKS.md`, `CHANGELOG.md`, `KNOWN_ISSUES.md`.
2. Jalankan `pytest -q` (tanpa marker `gpu`/`requires_data`/`network`).
3. Commit git (jika ada git). Catat pekerjaan, hasil uji, dan langkah berikutnya.
