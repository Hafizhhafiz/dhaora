# INSTITUTIONAL DATA ACCESS PLAN — CatchForecast AI (Phase 02)

| | |
|---|---|
| **Tanggal** | 2026-11-18 |
| **Status dokumen** | RENCANA. Tidak ada institusi yang dihubungi. Tidak ada akses yang diklaim atau dimiliki. |
| **Status semua jalur** | **NOT STARTED** (menunggu keputusan dan tindakan pengguna) |

> **Batas peran Claude.** Dokumen ini hanya memetakan jalur dan menyiapkan bahan (daftar field, pertanyaan klarifikasi, kerangka draf). Claude tidak mengirim surat, tidak menelepon, dan tidak mewakili pengguna. Semua kontak dilakukan oleh pengguna atas nama sendiri dan institusinya. Kontak yang tercantum diambil dari dokumen publik; kebenarannya perlu dikonfirmasi pengguna sebelum dipakai.

> **Mengapa ini penting.** Data lingkungan saja tidak dapat memvalidasi prediksi tangkapan. Jalur institusional ini adalah satu-satunya rute realistis ke variabel target (tangkapan per spesies) dan upaya tangkap. Jika jalur ini gagal, proyek tidak punya dasar validasi (lihat `DATA_GAPS_AND_RISKS.md`).

---

## 1. Peta institusi dan prioritas

| Prioritas | Institusi | Data yang diharapkan | Dasar bukti (terverifikasi) | Status akses |
|---|---|---|---|---|
| **1** | **PPN Karangantu** (UPT Ditjen Perikanan Tangkap, KKP) | Produksi per spesies × bulan/hari, per alat tangkap, trip/upaya, asal kapal, sampling panjang, logbook | Laporan Tahunan 2025 memuat proses pendataan harian/bulanan/situasional; ada PPID di Kepala Pelabuhan; menerima mahasiswa peneliti (agenda 15 Jan 2025) | NOT STARTED |
| **2** | **DKP Provinsi Banten** | Seri produksi laut per jenis ikan per kabupaten/kota; alat tangkap; RTP; armada | *Kelautan dan Perikanan Dalam Angka* edisi 2010, 2011, 2015 di portal PPID/DMS Banten | NOT STARTED |
| **3** | **DKP3 Kota Serang** dan UPTD pelabuhan sekitar teluk (Kronjo, Cituis, dll.) | Pendaratan di luar Karangantu yang berasal dari teluk | Nama instansi dan pelabuhan binaan terbaca di Laporan Tahunan 2025; **kepemilikan data UNVERIFIED** | NOT STARTED |
| **4** | **BPS** (Pusat dan BPS Provinsi Banten) | Tabel produksi tahunan per provinsi/komoditas; publikasi TPI Banten | Tabel BPS dan publikasi BPS Banten 2019 ditemukan; layanan PST online | NOT STARTED |
| **5** | **KKP Pusat** (Pusdatin / DJPT / Direktorat Kepelabuhanan) | Ekspor PIPP lintas pelabuhan; statistik tangkap nasional | PIPP dikelola KKP; portal statistik dikutip (UNVERIFIED) | NOT STARTED |
| **6** | **Peneliti/akademisi** yang pernah memakai data Karangantu (IPB, Untirta, UPI Serang, Politeknik AUP) | Dataset turunan, metode, kontak | Penulis makalah tercantum di `DATA_SOURCE_CATALOG.md` (CAT-09); beberapa kampus tercatat berkunjung ke PPN | NOT STARTED |

---

## 2. Jalur A — PPN Karangantu (prioritas utama)

### 2.1 Fakta terverifikasi tentang kanal

- Alamat: Jalan Pelelangan Ikan Karangantu, Serang, Banten.
- Telepon: (0254) 202132, 216463. Email: ppn.karangantu@kkp.go.id. *(dari sampul Laporan Tahunan 2025; konfirmasi ulang sebelum dipakai).*
- Kepala PPN bertindak sebagai PPID PPN Karangantu (Agenda Kepala PPN 2025) dan pernah menerima mahasiswa IPB untuk penelitian (15 Januari 2025). Ini preseden jalur riset, bukan jaminan data dibagikan.
- Portal PPID KKP (`ppid.kkp.go.id`) menyimpan dokumen publik per UPT. Pola URL halaman UPT Pengambengan terlihat (`/upt/pelabuhan-perikanan-nusantara-pengambengan/`); **halaman setara untuk Karangantu tidak dikonfirmasi**.
- Ada dokumen daftar informasi yang dikecualikan (DIK PPN Karangantu 2024; SK PPID DIK KKP 2023). **Isinya belum dibaca.** Langkah pertama yang disarankan adalah membacanya untuk mengetahui apakah data produksi per spesies atau data kapal termasuk yang dikecualikan.

### 2.2 Langkah yang disarankan (dilakukan oleh pengguna)

| # | Langkah | Keluaran | Status |
|---|---|---|---|
| A1 | Baca dokumen daftar informasi dikecualikan (DIK) dan standar layanan informasi PPN Karangantu/KKP | Pemahaman batas data | NOT STARTED |
| A2 | Periksa apakah laporan statistik tahunan PPN Karangantu (2015, 2019, 2024 dikutip literatur) dipublikasikan di PPID | Tahu apakah permohonan perlu atau cukup unduh | NOT STARTED |
| A3 | Putuskan pemohon dan dasar permohonan: institusi (kampus/lembaga), tujuan riset, dan ruang lingkup | Surat pengantar | NOT STARTED |
| A4 | Ajukan permohonan informasi publik (format di §4) lewat kanal PPID resmi, simpan bukti pengajuan | Nomor/tanda terima | NOT STARTED |
| A5 | Jika disetujui: minta data dictionary, kode spesies, dan penjelasan koefisien koreksi | Dokumen metodologi | NOT STARTED |
| A6 | Catat syarat penggunaan (publikasi, redistribusi, anonimisasi kapal/nelayan) dalam *data use log* | Catatan lisensi de facto | NOT STARTED |
| A7 | Jika ada penolakan atau tanpa jawaban: gunakan mekanisme keberatan resmi menurut regulasi keterbukaan informasi publik (UU No. 14/2008 dikutip sebagai dasar; **tenggat waktu tidak diverifikasi**) | Dasar eskalasi | NOT STARTED |

### 2.3 Data yang akan diminta (spesifikasi minimal dan ideal)

| Kelompok | Field | Minimal | Ideal | Alasan |
|---|---|---|---|---|
| Tangkapan | Volume per spesies per **hari** (atau minimal per bulan), kg | Bulanan | Harian | Menentukan resolusi prediksi |
| | Nama lokal **dan** kode spesies/nama ilmiah yang dipakai | Ya | + riwayat perubahan kode | Menentukan apakah *R. brachysoma* terpisah dari "kembung/banyar" |
| | Nilai/harga per spesies | Opsional | Bulanan | Penunjuk perilaku nelayan |
| Upaya | Jumlah trip per alat tangkap per bulan; ukuran kapal (GT) | Bulanan | Per trip | CPUE/standardisasi |
| | Lama trip, jumlah ABK | Opsional | Per trip | Koreksi upaya |
| Spasial | Daerah penangkapan/kode WPP per pendaratan | WPP | Grid/posisi | Pemisahan Teluk Banten vs WPP 572/711 |
| | Asal kapal (pelabuhan domisili) | Ya | Ya | Kapal tamu dari Lampung dkk. |
| Biologi | Sampling panjang ikan per spesies | Opsional | Ya | Struktur ukuran, validasi spesies |
| Logbook | Tangkapan, alat, lokasi (jika ada) | Opsional | Ekstrak anonim | Lihat §3 |
| Metadata | Data dictionary, metode enumerasi, koefisien koreksi, bulan hilang | **Wajib** | — | Tanpa ini data tidak bisa dinilai |
| Periode | | 2015–2025 | Seluas yang terdigitalisasi (≥2004) | Panjang seri vs perubahan struktural |
| Format | | CSV/XLSX | CSV/XLSX + dokumen | Hindari PDF tabel |

### 2.4 Pertanyaan klarifikasi (untuk dijawab oleh PPN, bukan diasumsikan)

1. Apakah *kembung perempuan (R. brachysoma)*, *kembung lelaki (R. kanagurta)*, dan *banyar* dicatat sebagai kategori terpisah? Bagaimana pemetaannya ke nama ilmiah?
2. "Kuniran" mencakup spesies *Upeneus* apa saja? Apakah *U. sulphureus* terpisah dari *U. moluccensis*, *U. sundaicus*, dll.?
3. "Selar kuning" dicatat sebagai satu kategori? Apakah *Selaroides leptolepis* dipisah dari selar lain?
4. Bagaimana produksi dihitung (timbang di TPI vs estimasi enumerator)? Apa fungsi "koefisien koreksi produksi" bulanan dan bagaimana diterapkan?
5. Berapa persen pendaratan di dermaga yang tercatat oleh 3 enumerator? Bagaimana pendaratan di luar jam/dermaga lain ditangani?
6. Apakah pendaratan dari kapal tamu (Lampung dll.) masuk produksi Karangantu? Apakah ada pemisahan menurut asal tangkapan?
7. Mengapa komposisi spesies 2025 di laporan jumlahnya 105% dan angka 2024 tertulis 23.392 vs 3.392 ton? Mana angka resmi?
8. Adakah perubahan metode atau sistem pelaporan 2023–2025 (digitalisasi STBLKK/PB sejak Juli 2025, kebijakan penangkapan terukur/PNBP pasca produksi)?
9. Berapa latensi antara pendaratan dan data tersedia di PIPP? Apakah data terbaru bisa diterima berkala?
10. Format dan syarat penggunaan yang diizinkan (publikasi, bagi-pakai, penyimpanan)?

---

## 3. Catatan logbook (CAT-05)

- Terverifikasi: 835 laporan logbook 2025, 270.819 kg ( ±10,3% dari pendaratan 2.620 t; turunan).
- Kemungkinan memuat data kapal dan lokasi, yang sensitif. Rencana: minta ekstrak teranonimisasi (ID kapal diganti, posisi dibulatkan) dan tanyakan batas penggunaannya.
- Tidak boleh dijadikan satu-satunya sumber tangkapan karena bias cakupan.

---

## 4. Kerangka draf permohonan (DRAFT; belum dikirim; untuk ditinjau dan diadaptasi pengguna)

> Catatan: ini kerangka isi, bukan surat final. Nama, nomor, institusi, dan klaim tujuan harus diisi dan disetujui oleh pengguna.

**Perihal:** Permohonan informasi publik data pendaratan ikan untuk penelitian
**Kepada:** PPID Pelabuhan Perikanan Nusantara Karangantu
**Isi pokok:**

1. Identitas pemohon (nama, institusi, kontak) dan tujuan penggunaan (penelitian hubungan kondisi laut dan hasil tangkapan di Teluk Banten; keluaran: laporan/publikasi non-komersial. *Pengguna wajib menyesuaikan dengan tujuan sebenarnya*).
2. Informasi yang diminta: lihat §2.3 (kelompok, periode, format).
3. Informasi metodologi: lihat §2.4.
4. Komitmen: sitasi sumber, tidak menyebarkan data kapal/nelayan, bersedia menandatangani perjanjian penggunaan jika diperlukan, bersedia berbagi hasil ringkas.
5. Cara penyampaian yang diharapkan (email/unggah) dan kontak untuk klarifikasi.

---

## 5. Jalur B — DKP Provinsi Banten

| # | Langkah | Status |
|---|---|---|
| B1 | Periksa portal PPID/DMS Banten (`dmsppid.bantenprov.go.id`) untuk edisi *Kelautan dan Perikanan Dalam Angka* setelah 2015 dan statistik perikanan tangkap per kabupaten/kota (Kota Serang, Kab. Serang, Kab. Tangerang, wilayah pesisir teluk) | NOT STARTED |
| B2 | Jika tidak tersedia: permohonan seri produksi laut per jenis ikan per kabupaten/kota, per alat tangkap, RTP dan armada; periode 2010–2025; format tabel | NOT STARTED |
| B3 | Tanyakan asal data (kompilasi dari PIPP/enumerasi KKP vs survei sendiri) dan perbedaan definisi kategori jenis ikan terhadap PPN Karangantu | NOT STARTED |

Ekspektasi realistis: tahunan dan tingkat kabupaten/provinsi. Fungsi: triangulasi tren dan pengecekan konsistensi, bukan target model.

## 6. Jalur C — DKP3 Kota Serang dan pelabuhan sekitar teluk

| # | Langkah | Status |
|---|---|---|
| C1 | Tentukan pelabuhan/pendaratan yang berhadapan dengan Teluk Banten selain Karangantu (mis. Kronjo, Cituis, pulau-pulau) dan instansi pemegang datanya (PPN Karangantu sebagai pembina vs dinas daerah) | NOT STARTED |
| C2 | Tanyakan apakah pendaratan itu tercakup di PIPP Karangantu atau terpisah | NOT STARTED |
| C3 | Ajukan permohonan data sejenis §2.3 untuk pendaratan tersebut jika terpisah | NOT STARTED |

## 7. Jalur D — BPS

| # | Langkah | Status |
|---|---|---|
| D1 | Telusuri tabel BPS: produksi perikanan tangkap laut per provinsi dan komoditas utama; publikasi BPS Banten 2019 tentang produksi yang dijual di TPI | NOT STARTED |
| D2 | Jika perlu tabulasi khusus: gunakan layanan PST online (`pst.bps.go.id`) | NOT STARTED |
| D3 | Konfirmasi apakah BPS memegang data pendaratan Karangantu atau hanya mengutip dari KKP/DKP | NOT STARTED |

Ekspektasi realistis: BPS tidak akan menjadi sumber target harian/bulanan per spesies. Nilai utamanya adalah penanda konteks dan cek silang.

## 8. Jalur E — KKP Pusat (PIPP, Pusdatin)

| # | Langkah | Status |
|---|---|---|
| E1 | Periksa apakah PIPP menyediakan tampilan publik data produksi per pelabuhan dan apakah bisa diekspor | NOT STARTED |
| E2 | Jika PPN Karangantu menyatakan data dikelola pusat, ajukan permohonan ke PPID KKP | NOT STARTED |

## 9. Jalur F — Akademisi

| # | Langkah | Status |
|---|---|---|
| F1 | Daftar penulis makalah/skripsi yang memakai data Karangantu (IPB, Untirta, Unpad, Undip; lihat CAT-09) | NOT STARTED |
| F2 | Tanyakan melalui kanal akademik apakah dataset turunan boleh dibagikan, dan metode pemetaan spesies | NOT STARTED |
| F3 | Perlakukan data turunan sebagai sekunder; verifikasi terhadap sumber asli | NOT STARTED |

---

## 10. Risiko jalur dan mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Data spesies hanya tersedia sebagai kategori nama lokal | Target tidak bisa spesifik spesies | Definisikan target pada kategori pelabuhan; minta pemetaan dari PPN |
| Data tahunan saja yang diberikan | Tidak bisa validasi bulanan/harian | Minta bulanan/harian secara eksplisit; fallback jalur F |
| Penolakan atau keterlambatan | Fase berikut tertunda | Ajukan paralel ke jalur A, B, C; jangan menunggu satu jalur |
| Syarat penggunaan membatasi publikasi/redistribusi | Reprodusibilitas terbatas | Catat di *data use log*; rancang pipeline agar data mentah tidak masuk repo publik |
| Data identitas kapal/nelayan | Privasi | Anonimisasi sebelum penyimpanan dan analisis |
| Perubahan kelembagaan atau kontak | Kontak usang | Konfirmasi kontak sebelum dipakai |

## 11. Pelacak status (diisi pengguna)

| Jalur | Tanggal diajukan | Kanal | Nomor/bukti | Status | Syarat penggunaan |
|---|---|---|---|---|---|
| A — PPN Karangantu | — | — | — | NOT STARTED | — |
| B — DKP Banten | — | — | — | NOT STARTED | — |
| C — DKP3/pelabuhan sekitar | — | — | — | NOT STARTED | — |
| D — BPS | — | — | — | NOT STARTED | — |
| E — KKP Pusat | — | — | — | NOT STARTED | — |
| F — Akademisi | — | — | — | NOT STARTED | — |

## 12. Hal yang sengaja tidak diklaim

- Tidak ada klaim bahwa PPN Karangantu, DKP Banten, atau BPS akan memberikan data.
- Tidak ada klaim bahwa PIPP dapat diakses publik atau diekspor.
- Tidak ada estimasi waktu proses (tidak ada dasar terverifikasi).
- Tidak ada klaim bahwa data yang diminta ada. Daftar §2.3 adalah permintaan, bukan inventaris.
