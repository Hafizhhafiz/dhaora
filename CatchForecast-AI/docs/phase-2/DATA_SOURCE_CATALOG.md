# DATA SOURCE CATALOG — CatchForecast AI (Phase 02: Data Source Discovery)

| | |
|---|---|
| **Tanggal akses (semua entri)** | 2026-11-18 |
| **Cakupan studi** | Teluk Banten; *Rastrelliger brachysoma*, *Selaroides leptolepis*, *Upeneus sulphureus* |
| **Sifat dokumen** | DISCOVERY ONLY. Tidak ada data yang diunduh, diproses, atau diuji. Tidak ada institusi yang dihubungi. |
| **Phase berikutnya** | Tidak dimulai (Phase 3 ditahan). |

---

## 0. Cara membaca katalog ini

**Definisi status**

- **VERIFIED** = field kunci (keberadaan dataset, variabel, resolusi, cakupan waktu, lisensi/akses) terbaca dari halaman penyedia/katalog resmi pada tanggal akses. Ini verifikasi **metadata**. Tidak ada panggilan API, tidak ada unduhan, dan tidak ada uji piksel valid di Teluk Banten.
- **UNVERIFIED** = hanya bukti sekunder (kutipan jurnal, tag katalog), bukti saling bertentangan, atau tidak dibaca sama sekali. Field yang tidak terverifikasi ditandai di dalam entri.

**Tanggal akses** = tanggal halaman metadata dibaca, bukan tanggal unduh data.

**Cakupan Teluk Banten.** Semua produk lingkungan di sini adalah grid global/regional. Belum ada yang diuji untuk piksel laut valid, tutupan awan, atau kontaminasi daratan di Teluk Banten. Semua berstatus *NOT CHECKED* untuk pertanyaan itu (ditunda ke Phase 3).

**Keterbatasan cara verifikasi.** Hampir semua verifikasi lingkungan berasal dari ringkasan halaman penyedia yang dikembalikan mesin pencari. Hanya satu dokumen institusi (Laporan Tahunan PPN Karangantu 2025) dibaca penuh. Satu percobaan membuka `pipp.kkp.go.id` langsung ditolak oleh tool karena URL belum muncul di hasil pencarian, sehingga status PIPP tetap UNVERIFIED.

### Pernyataan kunci (berlaku untuk seluruh katalog)

> **Data lingkungan saja tidak cukup untuk memvalidasi prediksi tangkapan.** SST, klorofil-a, salinitas, arus, dan batimetri hanya prediktor atau konteks. Validasi *current catch prediction* membutuhkan data tangkapan (dan idealnya upaya tangkap) yang teramati pada resolusi waktu dan taksonomi yang sesuai. Bagian A (catch/effort) adalah penentu kelayakan proyek. Bagian B (lingkungan) adalah pendukung.

---

## 1. Temuan kunci

1. **Belum ada dataset tangkapan spesies × waktu untuk Teluk Banten yang terbukti dapat diunduh publik.** Jalur realistis adalah permohonan formal ke PPN Karangantu (rencana di `INSTITUTIONAL_DATA_ACCESS_PLAN.md`).
2. **Dokumen publik PPN Karangantu hanya agregat.** Laporan Tahunan 2025 memuat produksi tahunan 2021–2025 (2.464; 2.584; 2.435; 3.392; 2.620 ton). Komposisi spesies 2025 hanya disajikan sebagai grafik. Tidak ada tabel spesies × bulan di teks yang terbaca.
3. **Kategori spesies lokal vs target ilmiah belum tentu cocok.** Statistik pelabuhan memakai nama lokal ("kembung", "banyar", "kuniran", "selar kuning"). Literatur Selat Sunda membedakan tiga *Rastrelliger* (*R. faughni*, *R. kanagurta*, *R. brachysoma*). Literatur Teluk Banten untuk "kembung" membahas *R. kanagurta*. Apakah *R. brachysoma* tercatat terpisah di PPN Karangantu adalah **UNVERIFIED** dan merupakan risiko kritis.
4. **Spesies target tidak tampak dominan di komposisi 2025 yang tersaji.** Daftar 2025: kuniran 28%, peperek 18%, selanget 10%, teri 7%, samgeh 7%, rajungan 6%, banyar 6%, lainnya 23%. Kembung dan selar kuning tidak disebut terpisah (mungkin termasuk "lainnya"; UNVERIFIED). Risiko: volume rendah dan banyak nol.
5. **Banyak kandidat lingkungan, tetapi resolusinya kasar relatif terhadap teluk**, dan beberapa salinan GEE sudah usang (MODIS-Aqua L3SMI berakhir 2022-02-28; ERA5 DAILY berakhir 2020-07-09).
6. **Ekstensi temporal di katalog berubah-ubah antar snapshot.** Wajib dicek ulang langsung di awal Phase 3 (Bagian D).

---

## 2. Ringkasan katalog

### Bagian A — Tangkapan & upaya tangkap (penentu validasi)

| ID | Sumber | Status | Resolusi temporal | Spesies-spesifik? | Kecocokan *current catch* |
|---|---|---|---|---|---|
| CAT-01 | PPN Karangantu — pendataan pendaratan harian (enumerator → PIPP) | UNVERIFIED (akses & granularitas) | Harian (koleksi) | Mungkin (nama lokal) | **Tinggi, bersyarat** |
| CAT-02 | PPN Karangantu — Laporan Tahunan 2025 | VERIFIED | Tahunan | Tidak (grafik 2025) | Rendah (konteks) |
| CAT-03 | PPN Karangantu — Laporan Statistik Perikanan Tahunan (2015/2019/2024, dikutip) | UNVERIFIED | Diduga bulanan | Mungkin | **Tinggi, bersyarat** |
| CAT-04 | PPN Karangantu — Laporan Kinerja (TW/tahunan) | VERIFIED (keberadaan) | Triwulan/tahunan | Tidak | Rendah |
| CAT-05 | PPN Karangantu — data logbook penangkapan | UNVERIFIED (isi field) | Per trip/bulanan | Mungkin | Sedang (komplemen) |
| CAT-06 | DKP Banten — *Kelautan dan Perikanan Dalam Angka* | VERIFIED | Tahunan | Ya (per jenis, tingkat provinsi) | Rendah (triangulasi) |
| CAT-07 | BPS — statistik perikanan tangkap | VERIFIED (keberadaan) | Tahunan | Terbatas | Rendah |
| CAT-08 | KKP — portal statistik / Satu Data KP | UNVERIFIED | Tahunan/semester | Tidak jelas | Tidak diketahui |
| CAT-09 | Literatur: ekstraksi sekunder data PPN Karangantu | VERIFIED (sebagai sumber sekunder) | Tahunan | Ya (beberapa spesies) | Rendah (cek silang) |
| CAT-10 | Global Fishing Watch (AIS/VMS) | VERIFIED | Harian | Tidak | Sangat rendah (proxy upaya kapal besar) |
| CAT-11 | DKP3 Kota Serang & pelabuhan binaan | UNVERIFIED | — | — | Tidak diketahui |
| CAT-12 | FAO FishStat | UNVERIFIED (tidak dinilai) | Tahunan nasional | — | Tidak relevan skala |

### Bagian B — Lingkungan (prediktor/konteks, tidak cukup sendirian)

| ID | Sumber | Variabel | Status | Resolusi spasial | Catatan inti |
|---|---|---|---|---|---|
| ENV-01 | CMEMS GLORYS12V1 (GLOBAL_MULTIYEAR_PHY_001_030) | Suhu, salinitas, arus, SSH, MLD | VERIFIED | 0,083° (~8–9 km) | Satu-satunya kandidat terverifikasi untuk salinitas & arus |
| ENV-02 | CMEMS GlobColour OC L4 (009_104) | Chl-a, optik, transparansi, PP | VERIFIED | 4 km; OLCI 300 m (bulanan) | Daily gap-free = interpolasi |
| ENV-03 | GEE: Copernicus Marine Satellite Ocean Color V6 | Chl-a, Rrs | VERIFIED | 4 km | Salinan GEE berakhir 2024-12-31 |
| ENV-04 | GEE: NASA MODIS-Aqua L3SMI | Chl-a, Rrs, SST, dll | VERIFIED | 4,6 km | Salinan GEE berakhir 2022-02-28 |
| ENV-05 | GEE: JAXA GCOM-C CHLA V3 | Chl-a | VERIFIED | 4,6 km | Mulai 2021-11-29 (riwayat pendek) |
| ENV-06 | NASA/JPL MUR SST v4.1 | SST (foundation) | VERIFIED | 0,01° (~1 km) | 7 hari terakhir direvisi |
| ENV-07 | CMEMS OSTIA SST (REP & NRT) | SST | VERIFIED (ekstensi bertentangan) | 0,05° | Cek ekstensi akhir langsung |
| ENV-08 | NOAA OISST v2.1 (GEE) | SST | VERIFIED | 0,25° (27,8 km) | Sangat kasar untuk teluk |
| ENV-09 | GEBCO_2025 | Batimetri | VERIFIED | 15″ (~460 m) | Public domain |
| ENV-10 | BATNAS (BIG) | Batimetri | VERIFIED (spesifikasi); akses/lisensi UNVERIFIED | 6″ (~180 m) | Akurasi laut dangkal terbatas |
| ENV-11 | GEE: ECMWF ERA5 DAILY | Angin 10 m, hujan, dll | VERIFIED (usang) | 27,8 km | Berakhir 2020-07-09 |
| ENV-12 | ERA5 hourly / CDS | Angin, hujan | UNVERIFIED | — | Tidak dicek |
| ENV-13 | CHIRPS | Curah hujan | UNVERIFIED | — | Tidak dicek |
| ENV-14 | HYCOM di GEE | Arus, suhu, salinitas | UNVERIFIED | — | Hanya tag katalog terlihat |
| ENV-15 | BIG prediksi pasang surut | Pasut | UNVERIFIED | — | Hanya muncul di sitasi |
| ENV-16 | Data in situ (pelampung, DLH, riset) | SST/salinitas/Chl in situ | UNVERIFIED (tidak ditemukan) | — | Celah |

**Total:** 28 entri. 17 VERIFIED (metadata-level), 11 UNVERIFIED.

---

# BAGIAN A — TANGKAPAN & UPAYA TANGKAP

### CAT-01 — PPN Karangantu: pendataan pendaratan harian (enumerator → PIPP)

| Field | Isi |
|---|---|
| Penyedia / dataset | PPN Karangantu (UPT Ditjen Perikanan Tangkap, KKP); sistem Pusat Informasi Pelabuhan Perikanan (PIPP) KKP |
| URL / DOI | Proses terverifikasi di Laporan Tahunan 2025 §5.1: https://ppid.kkp.go.id/media/uploads/document_information_public/Laporan_Tahunan_PPN_Karangantu_2025_c.pdf. Portal `https://pipp.kkp.go.id/` dikutip makalah IPB (2024) tetapi **tidak dibuka langsung** |
| Variabel · unit · format | Per laporan: kapal masuk/keluar, produksi ikan, distribusi ikan dari luar pelabuhan, harga konsumen (harian); koefisien koreksi produksi, jasa, perbekalan (bulanan); sampling panjang ikan, registrasi kapal/alat tangkap (situasional). Unit diduga kg/ton, Rp. **Format ekspor UNVERIFIED** |
| Cakupan geografis · periode | Pendaratan di PPN Karangantu (Kota Serang). Asal tangkapan menurut laporan 2025: Teluk Banten dan sekitarnya serta perairan barat Sumatera. Fishing ground WPP 712, 572, 711. Kapal tamu dari Brebes, Lampung, Bojonegara, Labuan, Cilincing, dll. **Periode data UNVERIFIED** (literatur mengutip seri statistik dari 2004–2013 dan laporan 2015–2025) |
| Resolusi | Titik pelabuhan; koleksi harian; kategori spesies nama lokal (resolusi taksonomi UNVERIFIED) |
| Akses | Tidak ada API terverifikasi. Jalur: permohonan informasi publik via PPID PPN Karangantu (lihat access plan). Kepala PPN adalah PPID PPN Karangantu (Agenda Kepala PPN 2025) |
| Lisensi / batas | Tidak ditemukan pernyataan lisensi. Berlaku rezim keterbukaan informasi publik. Ada dokumen "Daftar Informasi Publik yang Dikecualikan" PPN Karangantu 2024 (**isi tidak dibaca**) |
| Tanggal akses | 2026-11-18 |
| **Status** | **UNVERIFIED** (keberadaan koleksi data: terverifikasi; akses dan granularitas spesies: tidak) |
| Kecocokan *current catch* | **Tinggi, bersyarat.** Kandidat tunggal yang dapat menjadi variabel target, jika spesies target dapat dipisahkan |
| Keterbatasan & risiko | (a) Laporan menyebut hanya 3 enumerator untuk sebaran pendaratan yang luas. (b) Ada "koefisien koreksi produksi" bulanan yang metodenya tidak dijelaskan. (c) Pendaratan ≠ lokasi tangkap. (d) Perubahan struktural 2023–2025 (lihat gaps). (e) Latensi data terbaru tidak diketahui |

### CAT-02 — PPN Karangantu: Laporan Tahunan TA 2025

| Field | Isi |
|---|---|
| Penyedia / dataset | PPN Karangantu, Laporan Tahunan TA.2025 (disusun 23 Januari 2026) |
| URL / DOI | https://ppid.kkp.go.id/media/uploads/document_information_public/Laporan_Tahunan_PPN_Karangantu_2025_c.pdf |
| Variabel · unit · format | Produksi dan nilai pendaratan tahunan 2021–2025 (Tabel 3); komposisi spesies 2025 (grafik); kunjungan kapal; alat tangkap; jumlah nelayan; logbook; SHTI; BBM; PNBP. PDF |
| Cakupan · periode | PPN Karangantu; 2021–2025 (agregat) |
| Resolusi | Tahunan; logbook dan kunjungan kapal ada tabel bulanan |
| Akses | Unduh publik dari PPID KKP |
| Lisensi / batas | Tidak dinyatakan; dokumen publik pemerintah. Wajib sitasi |
| Tanggal akses | 2026-11-18 (dibaca penuh) |
| **Status** | **VERIFIED** |
| Kecocokan *current catch* | **Rendah** untuk prediksi. Berguna untuk konteks skala dan uji kewajaran |
| Keterbatasan & risiko | Tidak ada tabel spesies × bulan di teks. Inkonsistensi internal (lihat di bawah) |

**Angka terverifikasi dari dokumen ini**

- Pendaratan: 2021: 2.464 t; 2022: 2.584 t; 2023: 2.435 t; 2024: 3.392 t; 2025: 2.620 t (nilai 2025 ± Rp 35,9 miliar).
- Kunjungan kapal: 28.946 (2025) vs 32.265 (2024).
- Nelayan beraktivitas: 2.390 (2021) → 1.273 (2025).
- Logbook 2025: 835 laporan, 270.819 kg. Terhadap pendaratan 2.620 t ini setara **±10,3%** (turunan, bukan klaim laporan).
- Kapal dominan >5–30 GT, "one day fishing". Alat: bagan perahu, bagan tancap, gill net, payang, rampus, pancing, sero, dll.

**Inkonsistensi yang ditemukan (jangan dipakai tanpa konfirmasi)**

- Teks menulis produksi 2024 "23.392 ton"; Tabel 3 menulis 3.392 ton.
- Persentase komposisi 2025 (28+18+10+7+7+6+6+23) berjumlah 105%.
- Daftar "jenis dominan" (tembang, kembung, teri, cumi-cumi, kuniran, peperek) tidak sama dengan daftar komposisi 2025.
- Narasi sebab penurunan 2025 (pendaratan tembang) tidak koheren dengan arah penurunan.

### CAT-03 — PPN Karangantu: Laporan Statistik Perikanan Tahunan

| Field | Isi |
|---|---|
| Penyedia / dataset | PPN Karangantu, "Laporan statistik perikanan tahunan" |
| URL / DOI | Tidak ditemukan URL publik. Dikutip sebagai referensi untuk tahun 2019 dan 2024 (Aurelia Journal, ejournal-balitbang.kkp.go.id/…/aureliajournal/article/view/20343); tahun 2015 dikutip makalah Undip |
| Variabel · unit · format | **UNVERIFIED.** Sebagai analogi, laporan statistik PPN Kejawanan 2021 (publik di PPID KKP) memuat tabel volume per bulan per jenis ikan, per alat tangkap, per WPP, frekuensi kapal per alat tangkap/ukuran: https://ppid.kkp.go.id/media/uploads/document_information_public/Laporan_Statistik_PPN_Kejawanan_2021.pdf |
| Cakupan · periode | UNVERIFIED |
| Resolusi | Jika setara Kejawanan: bulanan × jenis ikan × alat tangkap |
| Akses | UNVERIFIED apakah dipublikasikan. Jalur: permohonan |
| Lisensi / batas | UNVERIFIED |
| Tanggal akses | 2026-11-18 |
| **Status** | **UNVERIFIED** |
| Kecocokan *current catch* | **Tinggi, bersyarat.** Jika struktur sama dengan Kejawanan, ini bentuk data paling cocok (spesies × bulan × alat × trip) |
| Keterbatasan & risiko | Keberadaan hanya dibuktikan lewat sitasi. Struktur Kejawanan adalah analogi, bukan bukti isi dokumen Karangantu |

### CAT-04 — PPN Karangantu: Laporan Kinerja (triwulan/tahunan)

| Field | Isi |
|---|---|
| Penyedia / dataset | PPN Karangantu, Laporan Kinerja (IKU "Volume produksi perikanan tangkap di PPN Karangantu") |
| URL / DOI | Contoh: https://ppid.kkp.go.id/media/uploads/document_information_public/Laporan_Kinerja_Triwulan_I_2026_gZdSklp.pdf ; https://ppid.kkp.go.id/media/uploads/document_information_public/Laporan_Kinerja_Tahun_2025_zvmxiO6.pdf |
| Variabel · unit · format | Volume produksi (ton) agregat per periode laporan. PDF. Nilai tidak dibaca di sesi ini |
| Cakupan · periode | PPN Karangantu; laporan tersedia untuk 2023, 2024, 2025, TW I 2026 |
| Resolusi | Triwulan/tahunan, total semua spesies |
| Akses · lisensi | Unduh publik; lisensi tidak dinyatakan |
| Tanggal akses | 2026-11-18 |
| **Status** | **VERIFIED** (keberadaan; angka tidak dibaca) |
| Kecocokan *current catch* | **Rendah** (tanpa spesies) |
| Keterbatasan & risiko | Dapat dipakai hanya untuk cek kewajaran total |

### CAT-05 — PPN Karangantu: data logbook penangkapan ikan

| Field | Isi |
|---|---|
| Penyedia / dataset | Syahbandar/Tim Kerja Kesyahbandaran PPN Karangantu |
| URL / DOI | Ringkasan di Laporan Tahunan 2025 §5.6.d (URL pada CAT-02) |
| Variabel · unit · format | Yang terverifikasi hanya jumlah laporan dan produksi (kg) per bulan. **Isi field (posisi, alat, spesies, durasi trip) UNVERIFIED** |
| Cakupan · periode | 2025 terbaca (835 logbook; 270.819 kg; bulanan 3.224–61.786 kg). Tahun lain UNVERIFIED |
| Resolusi | Per laporan/trip; kapal tidak berulang tiap bulan |
| Akses | Permohonan; kemungkinan memuat data kapal (privasi) |
| Lisensi / batas | UNVERIFIED; perlu anonimisasi |
| Tanggal akses | 2026-11-18 |
| **Status** | **UNVERIFIED** |
| Kecocokan *current catch* | **Sedang** sebagai komplemen: potensi info upaya dan daerah tangkap |
| Keterbatasan & risiko | Cakupan hanya ±10% dari volume pendaratan 2025; bias pelaporan (hanya kapal yang aktif melapor) |

### CAT-06 — DKP Provinsi Banten: *Kelautan dan Perikanan Dalam Angka*

| Field | Isi |
|---|---|
| Penyedia / dataset | Dinas Kelautan dan Perikanan Provinsi Banten |
| URL / DOI | Edisi 2015: https://dmsppid.bantenprov.go.id/upload/dms/37/2015.pdf ; edisi 2011: …/2011.pdf ; edisi 2010: …/2010.pdf |
| Variabel · unit · format | Daftar isi edisi 2015 memuat "Produksi Perikanan Laut Menurut Jenis Ikan, 2010–2014", "Produksi Perikanan Tangkap Menurut Jenis Alat Penangkap, 2009–2014", keragaan perikanan laut per kabupaten/kota. PDF |
| Cakupan · periode | Provinsi Banten dan kabupaten/kota; edisi yang terlihat: 2010, 2011, 2015. **Edisi lebih baru UNVERIFIED** |
| Resolusi | Tahunan; spesies tingkat jenis ikan (nama lokal) |
| Akses | Unduh publik (portal PPID/DMS Banten) |
| Lisensi / batas | Tidak dinyatakan |
| Tanggal akses | 2026-11-18 (hanya daftar isi dibaca) |
| **Status** | **VERIFIED** |
| Kecocokan *current catch* | **Rendah** (tahunan, tingkat provinsi/kabupaten). Berguna untuk triangulasi tren jangka panjang |
| Keterbatasan & risiko | Tabel tidak dibuka; tidak ada jaminan kategori sama dengan PIPP; data yang ada sudah berusia lama |

### CAT-07 — BPS: statistik perikanan tangkap

| Field | Isi |
|---|---|
| Penyedia / dataset | BPS (nasional dan BPS Provinsi Banten) |
| URL / DOI | https://www.bps.go.id/en/statistics-table/1/MTcwNSMx/produksi-perikanan-tangkap-menurut-provinsi-dan-jenis-penangkapan--2000-2020.html ; tabel "Produksi dan Nilai Produksi Perikanan Tangkap di Laut Menurut Provinsi dan Komoditas Utama, 2022" (bps.go.id); BPS Banten: https://banten.bps.go.id/en/publication/2020/09/24/b6adb21db7ddf449cb399284/produksi-perikanan-laut-yang-dijual-di-tempat-pelelangan-ikan-provinsi-banten-2019.html ; layanan PST: pst.bps.go.id |
| Variabel · unit · format | Produksi/nilai per provinsi dan jenis penangkapan; komoditas utama laut per provinsi; produksi yang dijual di TPI Banten (2019) |
| Cakupan · periode | Nasional/provinsi; 2000–2020 dan 2022 (tabel); Banten 2019 (publikasi TPI) |
| Resolusi | Tahunan, provinsi |
| Akses | Unduh web; permintaan via PST |
| Lisensi / batas | UNVERIFIED (ketentuan BPS tidak dibaca) |
| Tanggal akses | 2026-11-18 |
| **Status** | **VERIFIED** (keberadaan); kemampuan memisahkan 3 spesies target **UNVERIFIED** |
| Kecocokan *current catch* | **Rendah** |
| Keterbatasan & risiko | Publikasi Banten 2019 hanya mencakup produksi yang dijual di TPI; BPS sendiri menyebutnya sebagai gambaran. Tidak bisa menggantikan data pelabuhan |

### CAT-08 — KKP: portal statistik / Satu Data Kelautan dan Perikanan

| Field | Isi |
|---|---|
| Penyedia / dataset | Pusdatin KKP; `statistik.kkp.go.id` dikutip (data 2018); buku *Kelautan dan Perikanan Dalam Angka* dikutip |
| URL / DOI | https://statistik.kkp.go.id/ (**tidak dibuka**; hanya dikutip dokumen Seknas Fitra 2022) |
| Variabel · cakupan | UNVERIFIED. Dasar hukum Satu Data KP: PermenKP No. 61 Tahun 2020 (dikutip dokumen Dinas Perikanan Banggai Kepulauan 2025) |
| Resolusi · akses · lisensi | UNVERIFIED |
| Tanggal akses | 2026-11-18 |
| **Status** | **UNVERIFIED** |
| Kecocokan *current catch* | Tidak diketahui |
| Keterbatasan & risiko | Status aktif portal tidak dikonfirmasi; kemungkinan tahunan/provinsi |

### CAT-09 — Literatur: ekstraksi sekunder data PPN Karangantu dan biologi spesies

| Field | Isi |
|---|---|
| Penyedia / dataset | Makalah dan skripsi (IPB, Untirta, Unpad, dll.) |
| URL / DOI | Selar kuning, produksi Teluk Banten 2005–2012 dari statistik PPN Karangantu: https://www.smujo.id/bw/article/download/2255/2080/2868 ; kurisi 2006–2010: https://journals.unpad.ac.id/jpk/article/download/3535/2414 ; kembung lelaki Teluk Banten: https://jperairan.unram.ac.id/index.php/JP/article/download/1318/722/9404 ; *Rastrelliger* spp. Selat Sunda (PPP Labuan): https://journal.ugm.ac.id/jfs/article/download/12424/17926 ; kuniran: Lindawati dkk. 2019 doi:10.29303/jbt.v19i2.1293 dan https://journal.ipb.ac.id/index.php/jurnalppt/article/download/30562/19851 ; selar kuning (skripsi IPB): https://repository.ipb.ac.id/handle/123456789/149274 |
| Variabel · unit | Tabel produksi tahunan, CPUE, parameter biologi (pertumbuhan, reproduksi, eksploitasi) |
| Cakupan · periode | Teluk Banten/Selat Sunda; seri tahunan 2005–2012 (selar kuning), 2006–2010 (kurisi); sampling biologi 2015–2018 |
| Resolusi | Tahunan atau sampling musiman |
| Akses · lisensi | Open access sebagian; hak cipta penulis/penerbit. Wajib sitasi, tidak boleh dikutip massal |
| Tanggal akses | 2026-11-18 |
| **Status** | **VERIFIED** sebagai sumber sekunder |
| Kecocokan *current catch* | **Rendah** untuk model; **berguna** untuk parameter biologi dan uji silang |
| Keterbatasan & risiko | (a) "Teluk Banten" dan "Selat Sunda" dipakai longgar; skripsi selar kuning IPB berjudul Selat Sunda tetapi abstraknya menyebut perairan Teluk Banten didaratkan di PPP Labuan. (b) Spesies *Rastrelliger* yang dikaji berbeda-beda. (c) Periode sudah lama |

### CAT-10 — Global Fishing Watch (AIS/VMS apparent fishing effort)

| Field | Isi |
|---|---|
| Penyedia / dataset | Global Fishing Watch, apparent fishing effort/events, vessel presence |
| URL / DOI | https://globalfishingwatch.org/our-apis/documentation/docs/license-rate-limits ; https://globalfishingwatch.org/our-apis/documentation/docs/v3/general-api-doc/data-caveats |
| Variabel · format | Jam "apparent fishing effort" per sel grid/hari; API REST v3, paket R `gfwr` dan Python |
| Cakupan · periode | Global; periode dan cakupan Teluk Banten tidak dicek |
| Resolusi | Harian; grid |
| Lisensi / batas | **CC BY-NC 4.0, non-komersial saja**; atribusi wajib; ada batas laju API |
| Tanggal akses | 2026-11-18 |
| **Status** | **VERIFIED** |
| Kecocokan *current catch* | **Sangat rendah** |
| Keterbatasan & risiko | AIS terutama untuk kapal >24 m; armada Teluk Banten dominan >5–30 GT dan bagan. GFW sendiri menyebut cakupan Asia Tenggara lemah. Bukan data tangkapan |

### CAT-11 — DKP3 Kota Serang dan pelabuhan/PPI binaan sekitar teluk

| Field | Isi |
|---|---|
| Penyedia / dataset | Dinas Ketahanan Pangan, Pertanian dan Perikanan (DKP3) Kota Serang (disebut di Laporan Tahunan 2025); pelabuhan binaan PPN Karangantu: PP Panimbang, Labuan, Sidamukti, Kronjo, Cituis, Pulau Tunda, Maringgai, Lempasing, Muara Piluk (Tabel 24) |
| URL / Isi / Periode | **UNVERIFIED seluruhnya.** Hanya nama institusi dan pelabuhan yang terverifikasi |
| Status | **UNVERIFIED** |
| Kecocokan | Tidak diketahui. Relevan karena sebagian tangkapan teluk bisa didaratkan di luar Karangantu (mis. Kronjo, Cituis) |
| Risiko | Cakupan teluk tidak lengkap jika hanya PPN Karangantu dipakai |

### CAT-12 — FAO FishStat

Tidak dinilai di sesi ini. **UNVERIFIED.** Berdasarkan sifat umum (agregat nasional per spesies/tahun), tidak relevan untuk skala Teluk Banten. Tidak dirangking.

---

# BAGIAN B — LINGKUNGAN

> Semua entri di Bagian B: *cakupan Teluk Banten, piksel laut valid, dan tutupan awan belum diuji (NOT CHECKED).* Resolusi piksel di bawah belum diterjemahkan menjadi jumlah piksel di teluk (butuh AOI resmi di Phase 3).

### ENV-01 — CMEMS Global Ocean Physics Reanalysis (GLORYS12V1)

| Field | Isi |
|---|---|
| Penyedia / dataset | Copernicus Marine Service (Mercator Ocean), `GLOBAL_MULTIYEAR_PHY_001_030` |
| URL / DOI | https://data.marine.copernicus.eu/product/GLOBAL_MULTIYEAR_PHY_001_030 ; DOI produk: https://doi.org/10.48670/moi-00021 |
| Variabel · unit · format | Suhu potensial air laut (juga di dasar laut), salinitas, **arus**, tinggi permukaan laut, mixed layer depth, es laut. NetCDF; akses analysis-ready cloud-optimized, WMTS, STAC. **Unit tidak dibaca dari halaman; verifikasi di metadata dataset** |
| Cakupan · periode | Global (lat −80° s/d 90°). Mulai 1993-01-01; akhir yang terlihat bervariasi antar snapshot (2025-12-23; 2026-02-24; 2026-09-22) |
| Resolusi | 0,083° (~8–9 km), 50 level vertikal; harian dan bulanan (juga klimatologi bulanan) |
| Akses | Copernicus Marine Toolbox (Python), subset/unduh. Kebutuhan akun: UNVERIFIED |
| Lisensi / batas | Lisensi layanan Copernicus Marine (halaman rujukan mencatat "No limitations on public access"). Syarat atribusi: UNVERIFIED |
| Tanggal akses | 2026-11-18 |
| **Status** | **VERIFIED** |
| Kecocokan *current catch* | **Sedang–rendah.** Kandidat terverifikasi satu-satunya untuk salinitas dan arus; cocok sebagai konteks skala regional |
| Keterbatasan & risiko | Grid ~8 km tidak menyelesaikan struktur dalam teluk; pengaruh sungai dan estuari tidak diharapkan tertangkap (UNVERIFIED). Reanalisis ≠ data tersedia real-time (untuk *current prediction* butuh produk NRT/forecast yang **tidak dicek**) |

### ENV-02 — CMEMS Global Ocean Colour (Copernicus-GlobColour) L4

| Field | Isi |
|---|---|
| Penyedia / dataset | Copernicus Marine / ACRI-ST, `OCEANCOLOUR_GLO_BGC_L4_MY_009_104` (ada juga NRT `…_009_102` dan produk ESA-CCI `…_009_108`) |
| URL / DOI | https://data.marine.copernicus.eu/product/OCEANCOLOUR_GLO_BGC_L4_MY_009_104 ; halaman layanan dataset: …/services ; DOI 009_108: https://doi.org/10.48670/moi-00283 (DOI 009_104 tidak terbaca) |
| Variabel · unit | Chl-a (CHL), optik, reflektansi, transparansi, produktivitas primer. Unit Chl-a diduga mg m⁻³ (tidak dibaca di halaman) |
| Dataset ID terbaca | `cmems_obs-oc_glo_bgc-plankton_my_l4-gapfree-multi-4km_P1D` (04/09/1997–24/04/2026); `…plankton_my_l4-multi-4km_P1M` (bulanan, 1997–2026-03); `…plankton_my_l4-olci-300m_P1M` dan `…olci-4km_P1M` (01/04/2016–01/03/2026) |
| Cakupan · periode | Global; 1997-09-01 s/d snapshot (halaman produk menyebut 6 Nov 2026) |
| Resolusi | 4 km (multi-sensor); **300 m untuk OLCI (bulanan, 2016–)**. Harian hanya untuk varian *gap-free* |
| Akses | Copernicus Marine Toolbox; salinan GEE (`COPERNICUS/MARINE/OC_GLO_BGC/PLANKTON_MULTI_4KM`, `…/OPTICS_MULTI_4KM`) tampak hanya jendela waktu terbaru (mis. 2025-02-10 s/d 2026-06-07), tafsiran UNVERIFIED |
| Lisensi / batas | GEE: tunduk pada perjanjian layanan CMEMS. Detail lisensi UNVERIFIED |
| Tanggal akses | 2026-11-18 |
| **Status** | **VERIFIED** |
| Kecocokan *current catch* | **Sedang–tinggi** untuk Chl-a. Varian 300 m bulanan memberi struktur spasial di teluk; varian harian *gap-free* memberi kontinuitas waktu |
| Keterbatasan & risiko | *Gap-free* = hasil interpolasi ruang-waktu, bukan observasi. Varian 300 m hanya bulanan. Air pesisir keruh dapat bias untuk algoritma Chl-a (diperkirakan; belum diuji untuk Teluk Banten) |

### ENV-03 — GEE: Copernicus Marine Satellite Ocean Color Daily (V6)

| Field | Isi |
|---|---|
| Penyedia / dataset | C3S/ESA-CCI via GEE `COPERNICUS/MARINE/SATELLITE_OCEAN_COLOR/V6` |
| URL / DOI | https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_MARINE_SATELLITE_OCEAN_COLOR_V6 ; DOI C3S: 10.24381/cds.f85b319d |
| Variabel · unit | `chlor_a`, Rrs per sensor, jumlah observasi (SeaWiFS, MERIS, MODIS-Aqua, VIIRS, OLCI) |
| Cakupan · periode | Global; 1997-01-01 s/d **2024-12-31** (snapshot) |
| Resolusi | 4.000 m; harian; hanya area bebas awan/es |
| Akses | GEE (`ee.ImageCollection`) |
| Lisensi / batas | CC-BY |
| Tanggal akses | 2026-11-18 |
| **Status** | **VERIFIED** |
| Kecocokan *current catch* | **Sedang** untuk riwayat; **tidak cukup** untuk kondisi saat ini (berakhir 2024-12) |
| Keterbatasan & risiko | Banyak celah awan di perairan tropis (diperkirakan); tidak diuji |

### ENV-04 — GEE: NASA MODIS-Aqua L3SMI

| Field | Isi |
|---|---|
| Penyedia / dataset | NASA OB.DAAC via GEE `NASA/OCEANDATA/MODIS-Aqua/L3SMI` |
| URL / DOI | https://developers.google.com/earth-engine/datasets/catalog/NASA_OCEANDATA_MODIS-Aqua_L3SMI |
| Variabel · unit | `chlor_a` (mg/m³), nFLH, POC, Rrs, SST |
| Cakupan · periode | Global; harian 2002-07-03 s/d **2022-02-28** (versi GEE) |
| Resolusi | ~4.616 m (halaman Terra: 4616 m) |
| Akses · lisensi | GEE; domain publik tanpa batasan penggunaan (kebijakan data NASA) |
| Tanggal akses | 2026-11-18 |
| **Status** | **VERIFIED** (salinan GEE usang) |
| Kecocokan *current catch* | **Rendah.** Berakhir 2022; ekstensi sumber NASA berbeda antar mirror (data.gov: 2022-05-31; APDRC: Jul 2025). **Ekstensi otoritatif UNVERIFIED** |
| Keterbatasan & risiko | Tidak bisa dipakai untuk periode terkini lewat GEE |

### ENV-05 — GEE: JAXA GCOM-C/SGLI Chl-a L3 (V3)

| Field | Isi |
|---|---|
| Penyedia / dataset | JAXA via GEE `JAXA/GCOM-C/L3/OCEAN/CHLA/V3` |
| URL / DOI | https://developers.google.com/earth-engine/datasets/catalog/JAXA_GCOM-C_L3_OCEAN_CHLA_V3 |
| Variabel · unit | `CHLA` (mg/m³), flag QA |
| Cakupan · periode | Global; 2021-11-29 s/d 2026-08-28 (snapshot; snapshot lain menyebut 2025-10-14); latensi 3–4 hari |
| Resolusi | ~4.638 m; harian |
| Lisensi / batas | Tidak dibaca; UNVERIFIED |
| Tanggal akses | 2026-11-18 |
| **Status** | **VERIFIED** (lisensi UNVERIFIED) |
| Kecocokan *current catch* | **Sedang** sebagai sumber NRT sekunder; riwayat hanya ±5 tahun |

### ENV-06 — NASA/JPL MUR SST v4.1 (GHRSST L4)

| Field | Isi |
|---|---|
| Penyedia / dataset | NASA JPL (program MEaSUREs), MUR-JPL-L4-GLOB-v4.1 |
| URL / DOI | https://podaac.jpl.nasa.gov/dataset/MUR-JPL-L4-GLOB-v4.1 (DOI tidak terbaca) |
| Variabel · unit | `analysed SST` / sea_surface_foundation_temperature, mask darat/es. Unit tidak dibaca |
| Cakupan · periode | Global; 2002–sekarang (judul ERDDAP: "2002-present") |
| Resolusi | 0,01° (~1 km); harian (juga turunan bulanan NOAA ERD) |
| Akses | PO.DAAC; ERDDAP NOAA/SWFSC (`jplMURSST41`). Salinan GEE tidak dikonfirmasi |
| Lisensi / batas | CC0 (rekaman metadata data.gov) |
| Tanggal akses | 2026-11-18 |
| **Status** | **VERIFIED** (via PO.DAAC dan metadata data.gov) |
| Kecocokan *current catch* | **Sedang–tinggi** untuk SST pada resolusi terbaik |
| Keterbatasan & risiko | Data 7 hari terakhir direvisi tiap hari (kadang hari lain). Risiko kebocoran dan ketidakreproduksian jika dipakai tanpa snapshot. Analisis L4 menggabungkan sensor; piksel pesisir bisa tidak independen |

### ENV-07 — CMEMS OSTIA SST (reprocessed & NRT)

| Field | Isi |
|---|---|
| Penyedia / dataset | Copernicus Marine / UK Met Office. REP `SST_GLO_SST_L4_REP_OBSERVATIONS_010_011`; NRT `…010_001`; ESA-CCI/C3S `…010_024` |
| URL / DOI | https://data.marine.copernicus.eu/product/SST_GLO_SST_L4_REP_OBSERVATIONS_010_011 (DOI moi-00168); NRT DOI moi-00165; https://data.marine.copernicus.eu/product/SST_GLO_SST_L4_REP_OBSERVATIONS_010_024/description |
| Variabel · unit | SST (foundation), es laut. NetCDF |
| Cakupan · periode | Global. 010_011: halaman produk menyebut 1981-10-01 s/d 2026-03-31, metadata lama menyebut s/d 2022-05-31. 010_024: 1980-01-01 s/d 2024-12-31. 010_001 NRT: dari 2007-01-01 |
| Resolusi | 0,05° (~5,5 km); harian |
| Akses · lisensi | Copernicus Marine Toolbox; lisensi layanan Copernicus Marine (detail UNVERIFIED) |
| Tanggal akses | 2026-11-18 |
| **Status** | **VERIFIED** dengan **konflik ekstensi** yang belum terselesaikan |
| Kecocokan *current catch* | **Sedang.** Gap-free dan didukung NRT; resolusi ~5 km |
| Keterbatasan & risiko | Dokumen QUID mencantumkan peringatan pembekuan produk akibat Brexit (kalimat terpotong; maknanya UNVERIFIED). Gunakan kombinasi REP + NRT hanya setelah ekstensi dikonfirmasi |

### ENV-08 — NOAA OISST v02r01 (GEE)

| Field | Isi |
|---|---|
| Penyedia / dataset | NOAA NCEI, `NOAA/CDR/OISST/V2_1` |
| URL / DOI | https://developers.google.com/earth-engine/datasets/catalog/NOAA_CDR_OISST_V2_1 ; doi:10.7289/V5SQ8XB5 |
| Variabel · unit | `sst` (°C, skala 0,01), `anom`, `ice`, `err` |
| Cakupan · periode | Global; 1981-09-01 s/d 2026-08-26 (snapshot terbaru; snapshot lain 2026-02-27) |
| Resolusi | 0,25° (piksel GEE 27.830 m); harian; versi awal dan final |
| Akses · lisensi | GEE; publik, tanpa batasan penggunaan |
| Tanggal akses | 2026-11-18 |
| **Status** | **VERIFIED** |
| Kecocokan *current catch* | **Rendah–sedang.** Mudah diakses dan konsisten, tetapi satu sel kasar jauh lebih besar dari teluk |

### ENV-09 — GEBCO_2025 Grid

| Field | Isi |
|---|---|
| Penyedia / dataset | GEBCO (Nippon Foundation–GEBCO Seabed 2030) |
| URL / DOI | https://www.gebco.net/data-products-gridded-bathymetry-data/gebco2025-grid ; doi:10.5285/37c52e96-24ea-67ce-e063-7086abc05f29 |
| Variabel · unit · format | Elevasi/kedalaman (m; negatif = kedalaman). NetCDF, GeoTIFF, ESRI ASCII; juga OPeNDAP dan CEDA |
| Cakupan · periode | Global; rilis Agustus 2025 |
| Resolusi | 15″ (~460 m) |
| Lisensi / batas | Domain publik, bebas biaya; dilarang menyiratkan status resmi/endorsement GEBCO |
| Tanggal akses | 2026-11-18 |
| **Status** | **VERIFIED** |
| Kecocokan *current catch* | **Rendah–sedang** (statis; konteks habitat) |
| Keterbatasan & risiko | Di perairan dangkal teluk, sumber data campuran dan kualitas bervariasi (disclaimer GEBCO). Sebaiknya dibandingkan dengan BATNAS |

### ENV-10 — BATNAS (Batimetri Nasional), BIG

| Field | Isi |
|---|---|
| Penyedia / dataset | Badan Informasi Geospasial (BIG) |
| URL / DOI | https://big.go.id/en/content/produk/demnas ; portal: tanahair.indonesia.go.id (`/demnas/#/batnas`); sibatnas.big.go.id dikutip makalah UGM |
| Variabel · unit · format | Kedalaman/elevasi (m); GeoTIFF 32-bit float, geografis, datum MSL (dikutip ITS). **Format tidak dibaca dari BIG langsung** |
| Cakupan · periode | 90°–150° BT, 20° LS–20° LU. Tahun versi UNVERIFIED |
| Resolusi | 6″ (~180 m) |
| Akses | Unduh dari portal; kemungkinan butuh registrasi (UNVERIFIED) |
| Lisensi / batas | **UNVERIFIED** (ketentuan BIG tidak dibaca) |
| Tanggal akses | 2026-11-18 |
| **Status** | **VERIFIED** (spesifikasi); akses, lisensi, versi UNVERIFIED |
| Kecocokan *current catch* | **Rendah–sedang** (statis) |
| Keterbatasan & risiko | Skripsi UGM menyebut BATNAS hanya untuk survei pendahuluan; kesalahan di laut dangkal bisa besar (angka bias dari slide sekunder). Datum berbeda dari GEBCO |

### ENV-11 — GEE: ECMWF ERA5 Daily Aggregates

| Field | Isi |
|---|---|
| Penyedia / dataset | ECMWF/C3S via GEE `ECMWF/ERA5/DAILY` |
| URL / DOI | https://developers.google.com/earth-engine/datasets/catalog/ECMWF_ERA5_DAILY |
| Variabel · unit | Angin 10 m u/v (m/s), curah hujan total harian (m), suhu udara 2 m, tekanan |
| Cakupan · periode | Global; 1979-01-02 s/d **2020-07-09** |
| Resolusi | 27.830 m; harian |
| Lisensi / batas | Lisensi Copernicus C3S/CAMS; atribusi wajib |
| Tanggal akses | 2026-11-18 |
| **Status** | **VERIFIED (koleksi ini berhenti 2020)** |
| Kecocokan *current catch* | **Tidak ada** untuk prediksi terkini |
| Keterbatasan & risiko | Angin dan hujan penting secara biologis/operasional (cuaca buruk disebut menurunkan trip di laporan PPN), tetapi sumber terkini harus diverifikasi (ENV-12) |

### ENV-12 s/d ENV-16 — belum diverifikasi

| ID | Sumber | Status | Catatan |
|---|---|---|---|
| ENV-12 | ERA5 hourly (GEE `ECMWF/ERA5/HOURLY` atau C3S CDS) | UNVERIFIED | Tidak dicek. Kandidat pengganti ENV-11 untuk angin/hujan |
| ENV-13 | CHIRPS (curah hujan harian) | UNVERIFIED | Tidak dicek. Relevan untuk aliran sungai ke teluk (Cibanten) |
| ENV-14 | HYCOM di GEE | UNVERIFIED | Hanya tag katalog terlihat (hycom, sst, ocean). Detail, periode, lisensi tidak dibaca |
| ENV-15 | BIG prediksi pasang surut (`srgi.big.go.id/map/pasut-prediction`) | UNVERIFIED | Hanya muncul sebagai sitasi |
| ENV-16 | Data in situ: pelampung, stasiun DLH, survei riset (SST, salinitas, Chl-a, kekeruhan) | UNVERIFIED (tidak ditemukan) | Tidak ada sumber in situ publik untuk Teluk Banten yang ditemukan. Ini celah validasi produk satelit |

---

# BAGIAN C — RANKING KANDIDAT (dengan alasan)

## C.1 Metode (bukan skor numerik)

Ranking tidak memakai skor numerik karena nilai yang tidak terukur akan memberi presisi palsu. Digunakan tiga *gate* kelayakan sebagai target prediksi, lalu urutan dalam tier berdasarkan kualitas bukti dan jalur akses.

- **G1** spesies terpisah (setidaknya level nama lokal yang dapat dipetakan ke 3 target)
- **G2** resolusi waktu bulanan atau lebih halus
- **G3** dapat dikaitkan ke area Teluk Banten (pendaratan atau daerah tangkap)

## C.2 Ranking sumber tangkapan/upaya

| Rank | ID | G1 | G2 | G3 | Alasan |
|---|---|---|---|---|---|
| 1 | CAT-01 + CAT-03 (satu paket permohonan) | ? | ✔ (harian/diduga bulanan) | ◐ (pelabuhan; asal tangkapan campuran) | Satu-satunya kelas sumber yang berpotensi lolos ketiganya. Proses pengumpulan terverifikasi di laporan 2025; seri historis tercermin di literatur. Syarat: konfirmasi pemisahan spesies, jalur akses, dan lisensi |
| 2 | CAT-05 logbook | ? | ✔ | ◐ (mungkin daerah tangkap; UNVERIFIED) | Komplemen upaya/lokasi; cakupan ±10% pendaratan, tidak dapat berdiri sendiri |
| 3 | CAT-06 DKP Banten KPDA | ◐ | ✘ (tahunan) | ✘ (provinsi/kabupaten) | Publik dan terverifikasi, tetapi hanya triangulasi tren |
| 4 | CAT-09 literatur | ◐ | ✘ | ◐ | Cek silang seri 2005–2012; batas kualitas dan hak sitasi |
| 5 | CAT-02, CAT-04 laporan PPN | ✘ | ✘ | ✔ | Total agregat; uji kewajaran dan konteks perubahan struktural |
| 6 | CAT-07 BPS; CAT-08 portal KKP | ✘/? | ✘ | ✘ | Provinsi/tahunan; CAT-08 tidak terverifikasi |
| 7 | CAT-10 GFW | ✘ | ✔ | ✘ | Proxy upaya kapal besar saja; non-komersial; bukan tangkapan |
| — | CAT-11, CAT-12 | — | — | — | Tidak cukup bukti untuk dirangking |

Legenda: ✔ lolos; ◐ sebagian/bersyarat; ✘ tidak lolos; ? tidak diketahui.

**Konsekuensi keputusan.** Jika data yang diterima hanya membedakan "kembung" (campuran *Rastrelliger* spp.), "kuniran" (*Upeneus* spp.), dan "selar kuning", target prediksi harus didefinisikan pada **kategori statistik pelabuhan**, bukan pada tiga spesies ilmiah. Klaim spesies di tahap berikutnya harus disesuaikan (keputusan pengguna).

## C.3 Ranking sumber lingkungan per variabel

| Variabel | Urutan kandidat | Alasan |
|---|---|---|
| **Chl-a** | 1) ENV-02 (4 km gap-free harian + OLCI 300 m bulanan) → 2) ENV-05 GCOM-C (NRT sekunder, riwayat pendek) → 3) ENV-03 (hingga 2024-12) → 4) ENV-04 (hingga 2022-02, hanya historis) | ENV-02 satu-satunya yang menyatukan kontinuitas hingga kini, opsi 300 m untuk teluk, dan jalur akses asli. ENV-03/04 tertinggal waktu di GEE |
| **SST** | 1) ENV-06 MUR (1 km) → 2) ENV-07 OSTIA (5 km, REP+NRT) → 3) ENV-08 OISST (27,8 km) | Resolusi spasial menurun tetapi kemudahan akses naik. MUR berisiko revisi; OSTIA ekstensi harus dikonfirmasi; OISST kasar |
| **Salinitas, arus** | 1) ENV-01 GLORYS12 (satu-satunya terverifikasi) | Tidak ada pembanding terverifikasi; ENV-14 HYCOM belum dicek |
| **Batimetri** | 1) ENV-10 BATNAS dan ENV-09 GEBCO dipakai berpasangan | Keduanya statis dan murah; BATNAS lebih halus tetapi kualitas dangkal terbatas; GEBCO punya lisensi jelas |
| **Angin, hujan** | Belum bisa dirangking | ENV-11 usang; ENV-12 dan ENV-13 belum diverifikasi |
| **Pasang surut, in situ** | Belum bisa dirangking | ENV-15 dan ENV-16 tidak terverifikasi |

---

# BAGIAN D — Konflik ekstensi temporal antar snapshot (wajib cek ulang di Phase 3)

| Dataset | Pernyataan yang saling bertentangan |
|---|---|
| NOAA OISST v2.1 (GEE) | Berakhir 2026-08-26 (snapshot A), 2026-02-27 (snapshot B), 2021-09-25 (mirror lama) |
| GLORYS12 | Berakhir 2025-12-23, 2026-02-24, 2026-09-22 antar halaman |
| MODIS-Aqua chl-a | GEE: 2022-02-28; data.gov: 2022-05-31; APDRC: Jul 2025 |
| GCOM-C Chl-a (GEE) | 2025-10-14 vs 2026-08-28 |
| GEE CMEMS OC_GLO_BGC PLANKTON | "2023-04-01–2025-10-14" vs "2025-02-10–2026-06-07" (jendela bergeser) |
| OSTIA REP 010_011 | 2026-03-31 vs 2022-05-31 |

Penjelasan paling sederhana adalah katalog bergulir dan halaman cache berbeda waktu. Ini tidak terbukti. **Jangan mengunci periode analisis sebelum ekstensi dikonfirmasi langsung dari katalog aktif.**

---

# BAGIAN E — Tidak dicek di sesi ini

- Pembukaan langsung `pipp.kkp.go.id`, `statistik.kkp.go.id`, dan halaman PPID PPN Karangantu.
- Isi "Daftar Informasi Publik yang Dikecualikan" (SK PPID KKP 2023; DIK PPN Karangantu 2024).
- Syarat penggunaan BATNAS/BIG, serta kebutuhan registrasi Copernicus Marine.
- Batas waktu pelayanan informasi publik menurut regulasi (tidak dikutip di sini).
- Produk NRT/forecast CMEMS untuk arus dan salinitas.
- Ketersediaan publik laporan statistik PPN Karangantu di luar Laporan Tahunan/Kinerja.
- Semua uji spasial (piksel valid, awan, kontaminasi darat) di Teluk Banten.
