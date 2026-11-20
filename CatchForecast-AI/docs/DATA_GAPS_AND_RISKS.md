# DATA GAPS AND RISKS — CatchForecast AI (Phase 02)

| | |
|---|---|
| **Tanggal** | 2026-11-18 |
| **Dasar** | `DATA_SOURCE_CATALOG.md` dan `INSTITUTIONAL_DATA_ACCESS_PLAN.md` |
| **Skala** | Dampak: Kritis / Tinggi / Sedang / Rendah. Kemungkinan: Tinggi / Sedang / Rendah / Tidak diketahui. Nilai adalah **penilaian kualitatif**, bukan hasil pengukuran |

---

## 0. Risiko dasar (R-00): data lingkungan saja tidak cukup

**Data lingkungan tidak dapat memvalidasi prediksi tangkapan.** Semua sumber SST, Chl-a, salinitas, arus, dan batimetri di katalog hanyalah kandidat prediktor. Model yang hanya dicocokkan ke lingkungan tanpa data tangkapan teramati tidak dapat diuji terhadap realitas. Model semacam itu hanya menghasilkan korelasi antar variabel lingkungan atau hasil berbasis asumsi biologi.

Untuk memvalidasi *current catch prediction*, dibutuhkan:

1. tangkapan teramati per spesies/kategori (target),
2. pada resolusi waktu yang sama atau lebih halus dari prediksi,
3. dengan upaya tangkap yang dapat dibakukan,
4. dengan pemetaan spasial yang dapat dipertanggungjawabkan ke Teluk Banten,
5. dan tersedia dengan latensi yang memungkinkan evaluasi "saat ini".

Status pemenuhan syarat tersebut pada akhir Phase 02: **belum ada yang terbukti terpenuhi** (semuanya bergantung pada jalur institusional yang belum dimulai).

---

## 1. Register celah data (Gap)

| ID | Celah | Bukti | Dampak | Status |
|---|---|---|---|---|
| **G-01** | **Tidak ada deret tangkapan spesies × waktu untuk Teluk Banten yang terbukti dapat diakses** | Dokumen publik PPN Karangantu hanya agregat (CAT-02/04). Statistik per spesies ada di laporan yang tidak terbukti publik (CAT-03) | **Kritis** | Terbuka |
| **G-02** | **Resolusi taksonomi**: kategori statistik adalah nama lokal; *R. brachysoma* mungkin tergabung di "kembung"/"banyar"; "kuniran" mencakup *Upeneus* spp. | Literatur Selat Sunda memisahkan tiga *Rastrelliger*. Literatur Teluk Banten "kembung" membahas *R. kanagurta*. Laporan 2025 menyebut "banyar" tanpa pemetaan | **Kritis** | Terbuka (UNVERIFIED) |
| **G-03** | **Spesies target mungkin minor dalam pendaratan** | Komposisi 2025 yang tersaji: kuniran 28%, peperek 18%, selanget 10%, teri 7%, samgeh 7%, rajungan 6%, banyar 6%, lainnya 23%. Kembung dan selar kuning tidak muncul terpisah | Tinggi | Terbuka (UNVERIFIED) |
| **G-04** | **Upaya tangkap (effort)** tidak terbukti tersedia dalam bentuk yang dapat dibakukan | Laporan 2025 memuat kunjungan kapal dan jenis alat tangkap secara agregat. Per alat × bulan × spesies tidak terverifikasi. GFW tidak mencakup kapal kecil (CAT-10) | Tinggi | Terbuka |
| **G-05** | **Atribusi spasial**: lokasi pendaratan ≠ lokasi tangkap | Laporan 2025: fishing ground WPP 712, 572, 711; kapal tamu dari Lampung dkk.; asal tangkapan "Teluk Banten dan sekitarnya serta perairan barat Sumatera" | Tinggi | Terbuka |
| **G-06** | **Cakupan Teluk Banten tidak lengkap bila hanya Karangantu** | Pelabuhan binaan lain (Kronjo, Cituis, Pulau Tunda, dll.) dan pendaratan non-pelabuhan; kepemilikan datanya UNVERIFIED (CAT-11) | Sedang–tinggi | Terbuka |
| **G-07** | **Cakupan pencatatan**: enumerator terbatas dan data koreksi | Laporan menyebut 3 enumerator; ada "koefisien koreksi produksi" tanpa metode; logbook ±10,3% dari pendaratan 2025 (turunan) | Tinggi | Terbuka |
| **G-08** | **Tidak ada data in situ** (SST, salinitas, Chl-a, kekeruhan) untuk validasi satelit/model | Tidak ditemukan sumber publik (ENV-16) | Tinggi | Terbuka (UNVERIFIED: tidak ditemukan ≠ tidak ada) |
| **G-09** | **Resolusi lingkungan kasar vs ukuran teluk** | Piksel: 4 km (Chl-a), 0,083° (~8–9 km, arus/salinitas), 0,05° (SST OSTIA), 0,25° (OISST). Hanya MUR (~1 km) dan OLCI (300 m, bulanan) lebih halus | Tinggi | Terbuka (jumlah piksel belum dihitung) |
| **G-10** | **Cakupan awan dan kontaminasi darat/sungai** belum diuji | Produk satelit warna laut hanya valid pada area bebas awan; air pesisir keruh dapat membiaskan Chl-a (diperkirakan; belum diuji di lokasi) | Tinggi | Terbuka (NOT CHECKED) |
| **G-11** | **Salinitas dan arus hanya dari model** | Hanya ENV-01 terverifikasi; tidak ada salinitas satelit resolusi pesisir dalam katalog; HYCOM tidak diverifikasi | Sedang | Terbuka |
| **G-12** | **Angin dan hujan terkini belum terverifikasi** | ERA5 DAILY di GEE berhenti 2020-07-09; ERA5 hourly dan CHIRPS belum dicek. Laporan PPN menyebut cuaca buruk menurunkan aktivitas | Sedang | Terbuka |
| **G-13** | **Ketidakcocokan resolusi waktu** | Chl-a 300 m hanya bulanan; target mungkin harian/bulanan | Sedang | Terbuka |
| **G-14** | **Produk NRT/forecast untuk "current prediction" belum diverifikasi** | Hanya reanalisis/MY GLORYS12 yang dibaca; NRT/forecast CMEMS tidak dicek | Tinggi untuk operasional | Terbuka |
| **G-15** | **Ekstensi temporal tidak stabil** | Bagian D katalog: snapshot saling bertentangan | Sedang | Terbuka |
| **G-16** | **Tidak ada pembanding kualitas batimetri** | BATNAS vs GEBCO berbeda datum; kualitas laut dangkal tidak dibandingkan | Rendah–sedang | Terbuka |

---

## 2. Register risiko

### 2.1 Risiko akses dan hukum

| ID | Risiko | Kemungkinan | Dampak | Mitigasi | Pemilik |
|---|---|---|---|---|---|
| **R-01** | Permohonan ke PPN Karangantu ditolak, tertunda, atau hanya sebagian dipenuhi | Tidak diketahui | **Kritis** | Ajukan paralel ke jalur A–C; minta format dan periode yang bertahap; fallback jalur F | Pengguna |
| **R-02** | Data yang diberikan tahunan/agregat saja | Sedang | Kritis | Minta spesifikasi eksplisit bulanan/harian (§2.3 plan); terima data turunan hanya sebagai sekunder | Pengguna |
| **R-03** | Data termasuk "informasi dikecualikan" (isi DIK belum dibaca) | Tidak diketahui | Tinggi | Baca DIK lebih dulu; minta versi teragregasi | Pengguna |
| **R-04** | Syarat penggunaan membatasi publikasi/redistribusi | Sedang | Sedang | Catat di *data use log*; jangan memasukkan data mentah ke repo publik | Proyek |
| **R-05** | Privasi data kapal/nelayan (logbook, ID kapal) | Sedang | Sedang | Anonimisasi; ekstrak minimal | Proyek |
| **R-06** | Lisensi sumber lingkungan membatasi penggunaan (GFW: CC BY-NC; BATNAS: UNVERIFIED; Copernicus Marine: syarat belum dibaca) | Sedang | Sedang | Baca lisensi di awal Phase 3; hindari GFW jika tujuan komersial | Proyek |

### 2.2 Risiko kualitas data tangkapan

| ID | Risiko | Kemungkinan | Dampak | Mitigasi |
|---|---|---|---|---|
| **R-07** | Inkonsistensi internal pada dokumen institusi (2024 "23.392" vs 3.392 ton; komposisi 2025 = 105%; daftar dominan tidak sama dengan komposisi) | **Terbukti** pada Laporan Tahunan 2025 | Sedang–tinggi | Jangan memakai angka tanpa konfirmasi; minta data tabular asli; audit konsistensi |
| **R-08** | Salah identifikasi spesies di pendaratan (nama lokal vs ilmiah) | Tinggi | Tinggi | Minta pemetaan; jika tidak ada, definisikan target pada kategori statistik, bukan spesies |
| **R-09** | Banyak nol/data jarang karena spesies minor | Sedang | Tinggi | Evaluasi sebaran data sebelum memilih model; pertimbangkan agregasi waktu |
| **R-10** | Perubahan struktural 2023–2025 menyebabkan non-stasioneritas | Sedang–tinggi | Tinggi | Lihat daftar bawah; uji perubahan struktur; jangan campur rezim tanpa penanda |
| **R-11** | Koreksi produksi bulanan tidak transparan | Sedang | Sedang | Minta metode; simpan produksi mentah dan terkoreksi |
| **R-12** | Pendaratan tidak mewakili tangkapan teluk (kapal tamu, asal Lampung/WPP lain) | Tinggi | Tinggi | Pisahkan menurut asal/WPP bila tersedia; kalau tidak, nyatakan keterbatasan |
| **R-13** | Literatur sekunder tercampur "Teluk Banten" dan "Selat Sunda" | Sedang | Sedang | Cek definisi lokasi per sumber sebelum dipakai |

**Indikasi perubahan struktural 2023–2025 (terbukti hanya sebagai catatan di laporan, penyebab tidak diverifikasi):**
- jumlah nelayan beraktivitas turun dari 2.390 (2021) menjadi 1.273 (2025);
- kunjungan kapal turun dari 32.265 (2024) menjadi 28.946 (2025);
- produksi melonjak ke 3.392 t (2024) lalu turun ke 2.620 t (2025);
- laporan menyebut pendaratan tembang (Triwulan IV 2025), cuaca buruk yang membatasi trip, digitalisasi penerbitan STBLKK dan PB (Juli 2025), dan program kebijakan penangkapan terukur/PNBP pasca produksi.

### 2.3 Risiko lingkungan dan teknis

| ID | Risiko | Kemungkinan | Dampak | Mitigasi |
|---|---|---|---|---|
| **R-14** | Sedikit piksel valid di teluk; banyak celah awan | Tinggi (diperkirakan) | Tinggi | Hitung jumlah piksel valid dengan AOI resmi sebelum memilih produk; gunakan komposit temporal; sertakan indikator data hilang |
| **R-15** | Chl-a bias pada air pesisir keruh | Sedang (belum diuji) | Sedang–tinggi | Bandingkan beberapa produk; tidak menafsirkan Chl-a sebagai biomassa tanpa validasi |
| **R-16** | Produk L4 gap-free (interpolasi) dianggap sebagai observasi | Sedang | Sedang | Catat sumber piksel; sensitivitas terhadap versi observasi vs interpolasi |
| **R-17** | Revisi data hampir real-time (MUR 7 hari terakhir) | Terbukti pada dokumentasi | Tinggi untuk operasional | Bekukan snapshot per tanggal akses; gunakan produk final untuk pelatihan |
| **R-18** | Kebocoran informasi: memakai reanalisis/produk final yang tidak tersedia pada waktu prediksi | Sedang | Tinggi | Pisahkan input retrospektif dan input yang benar-benar tersedia saat prediksi |
| **R-19** | Salinan GEE usang atau jendela bergulir (MODIS L3SMI 2022; ERA5 DAILY 2020; CMEMS OC jendela 2025–2026) | Terbukti | Sedang | Gunakan Copernicus Marine Toolbox atau sumber asli untuk riwayat panjang |
| **R-20** | Ekstensi katalog berubah antara Phase 2 dan 3 | Tinggi | Sedang | Cek ulang di awal Phase 3 |
| **R-21** | Batimetri dangkal tidak akurat | Sedang | Rendah–sedang | Bandingkan BATNAS dan GEBCO; hindari kesimpulan berbasis kedalaman detail |

### 2.4 Risiko metodologis

| ID | Risiko | Kemungkinan | Dampak | Mitigasi |
|---|---|---|---|---|
| **R-22** | Jumlah sampel kecil. Jika bulanan 2015–2025 maka ≤132 titik per kategori; harian lebih banyak tetapi dengan banyak nol dan autokorelasi | Tinggi | Tinggi | Tentukan ukuran sampel efektif sebelum memilih model; hindari kompleksitas berlebih |
| **R-23** | Korelasi palsu antara lingkungan yang kasar dan tangkapan bermusim | Tinggi | Tinggi | Kontrol musim/upaya; validasi temporal (bukan acak) |
| **R-24** | Klaim "prediksi" tanpa validasi tangkapan | **Terbukti jika data tangkapan tidak diperoleh** | Kritis | Gerbang keputusan di §3 |
| **R-25** | Perluasan klaim spesies melebihi resolusi data | Sedang | Tinggi | Tulis target sesuai resolusi data (G-02) |

---

## 3. Gerbang keputusan sebelum Phase 3 (kriteria usulan; tidak dieksekusi)

Phase 3 **tidak** dimulai di sini. Berikut kriteria agar keputusan lanjut/tidak dibuat berdasar bukti.

| Gerbang | Kriteria usulan | Status |
|---|---|---|
| **GATE-1 Data target** | Ada setidaknya satu dataset tangkapan bulanan atau lebih halus ≥ beberapa tahun untuk Teluk Banten, **diterima**, dengan syarat penggunaan jelas | Belum terpenuhi |
| **GATE-2 Taksonomi** | Pemetaan nama lokal → target ilmiah dikonfirmasi tertulis, atau target didefinisikan ulang pada kategori statistik | Belum terpenuhi |
| **GATE-3 Upaya** | Effort (trip per alat atau setara) tersedia bersama tangkapan | Belum terpenuhi |
| **GATE-4 Spasial** | Ada cara memisahkan/menandai tangkapan teluk vs luar (WPP/asal kapal/lokasi) atau keterbatasannya diterima eksplisit | Belum terpenuhi |
| **GATE-5 Ekstensi lingkungan** | Ekstensi dan lisensi produk lingkungan terpilih dikonfirmasi dari katalog aktif; piksel valid dan awan diuji dengan AOI resmi | Belum terpenuhi (Phase 3) |
| **GATE-6 Latensi** | Latensi data tangkapan baru dan produk lingkungan NRT memungkinkan definisi "current" yang realistis | Belum terpenuhi |

**Jika GATE-1 gagal:** proyek tidak dapat memvalidasi prediksi tangkapan. Opsi yang tersisa hanya menjadi studi hubungan lingkungan dengan data sekunder tahunan, atau pengumpulan data primer. Perubahan lingkup itu adalah keputusan pengguna.

---

## 4. Ringkasan prioritas

| Prioritas | Item | Alasan |
|---|---|---|
| 1 | G-01, G-02, R-01, R-02, R-24 | Menentukan apakah proyek valid |
| 2 | G-03, G-04, G-05, G-07, R-08, R-12 | Menentukan seberapa spesifik dan terpercaya targetnya |
| 3 | G-09, G-10, G-14, R-14, R-17, R-18 | Menentukan kualitas dan kelayakan operasional prediktor |
| 4 | Sisanya | Pengelolaan rutin |
