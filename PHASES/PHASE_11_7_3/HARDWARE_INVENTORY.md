# PHASE 11.7.3 — HARDWARE INVENTORY FORM & SPECIFICATIONS
**Audit Perangkat Keras Pengambilan Citra Laboratorium & Lapangan**

Formulir ini mencatat spesifikasi teknis komponen rig pengambilan data. Data yang bersumber dari analisis desain diverifikasi secara matematis; rincian nomor seri fisik dan ketersediaan aktual diisi oleh Operator Manusia.

---

## 1. Komponen Utama Rig Pengambilan Citra

| Komponen | Spesifikasi Rencana / Desain | Status Fisik Aktual | Catatan Teknis / Implikasi Akurasi |
|---|---|:---:|---|
| **Bodi Kamera** | Kamera Digital Mirrorless / DSLR (Sensor APS-C, resolusi $\ge 24$ MP, e.g., Sony Alpha / Canon EOS) atau Smartphone Resolusi Tinggi ($\ge 48$ MP sensor 1/1.5") | *Menunggu konfirmasi operator* | Mode Manual (M) wajib didukung: Shutter Speed, Aperture, ISO, dan Manual Focus. |
| **Lensa Primer** | 35mm Prime Lens (setara $\sim 50$ mm Full Frame) dengan distorsi barel/pincushion minimal ($\le 1.0\%$) | *Menunggu konfirmasi operator* | Menghindari distorsi tepi lensa sudut lebar (*wide-angle distortion*) yang mendistorsi panjang ikan. |
| **Rig / Tripod Frame** | Tripod berkaki kokoh dengan lengan ekstensi horizontal 90° (*horizontal center column*) atau rig bingkai aluminium *copy stand* | *Menunggu konfirmasi operator* | Wajib mampu mengunci ketinggian kamera pada $H = 90,0 \text{ cm} \pm 1,0 \text{ cm}$ tegak lurus terhadap papan ukur. |
| **Papan Ukur (*Measuring Board*)** | Papan ukur perikanan akrilik/kayu tahan air panjang 50 cm dengan pembatas kepala (*headblock*) 90° | *Tersedia / Siap Cetak* | Dilengkapi mistar milimeter terukir dengan kontras tinggi (angka hitam pada alas putih/kuning). |
| **Penanda Kalibrasi (ArUco Marker)**| Marker ArUco OpenCV `DICT_4X4_50` ukuran $50,0 \times 50,0 \text{ mm}$ tercetak kaku (*rigid plastic/acrylic backing*) | *Tersedia (PDF generator)* | Wajib memiliki batas putih keliling (*quiet zone*) minimal $10 \text{ mm}$ agar terdeteksi sempurna oleh OpenCV. |
| **Sistem Pencahayaan (*Lighting*)**| 2 unit lampu panel LED CRI $\ge 95$ dengan diffuser kain/akrilik, dipasang pada sudut $45^\circ$ dari kiri dan kanan | *Menunggu konfirmasi operator* | Mencegah pantulan spekular keras (*glare/hotspot*) pada permukaan lendir ikan yang basah. |
| **Latar Belakang (*Substrate*)** | Lembaran alas silikon/karet matte warna gelap netral (navy/hitam/abu-abu doff) | *Menunggu konfirmasi operator* | Menyediakan kontras tinggi terhadap tubuh perak/kuning ikan dan meminimalisir pantulan cahaya. |
| **Alat Ukur Pembanding Ground Truth**| Jangka sorong digital (*digital caliper*) $0 - 300 \text{ mm}$ (akurasi $\pm 0,02 \text{ mm}$) terkalibrasi | *Menunggu konfirmasi operator* | Digunakan untuk mengukur Total Length (TL), Fork Length (FL), dan Standard Length (SL) manual. |
| **Penyimpanan & Catu Daya** | Kartu memori SDXC UHS-I Class 10 $\ge 64$ GB + Laptop data ingestion + Power bank/baterai cadangan | *Tersedia* | Mendukung pencadangan ganda harian di lapangan. |

---

## 2. Instruksi bagi Operator Manusia (*Human Operator Action*):
Harap lengkapi informasi berikut saat pengujian fisik di laboratorium dilakukan:
1. Model bodi kamera fisik yang digunakan: `[ .............................. ]`
2. Model lensa fisik yang digunakan: `[ .............................. ]`
3. Resolusi sensor efektif (Piksel W x H): `[ .............................. ]`
4. Hasil verifikasi kelurusan waterpass rig (derajat tilt horizontal/vertikal): `[ ......° ]`
