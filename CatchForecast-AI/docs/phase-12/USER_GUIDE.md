# USER GUIDE — CatchForecast AI Web GIS
**Panduan Pengguna Sistem Prediksi Hasil Tangkapan Ikan Teluk Banten**

---

## 1. Pendahuluan
CatchForecast AI adalah sistem peta interaktif berbasis web yang memetakan estimasi potensi hasil tangkapan ikan di Teluk Banten untuk tiga spesies:
1. **Kembung Perempuan** (*Rastrelliger brachysoma*) — Ikan Pelagis Kecil
2. **Selar Kuning** (*Selaroides leptolepis*) — Ikan Pelagis Kecil
3. **Kuniran** (*Upeneus sulphureus*) — Ikan Demersal Dasar Laut

Aplikasi ini ditujukan bagi nelayan, pengurus koperasi perikanan, syahbandar pelabuhan, dan dinas kelautan untuk merencanakan trip penangkapan ikan yang lebih hemat bahan bakar dan berbasis data ilmiah.

---

## 2. Cara Menjalankan Aplikasi
1. Buka PowerShell atau Terminal pada komputer Anda di folder `CatchForecast-AI`.
2. Jalankan perintah server:
   ```powershell
   python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
   ```
3. Buka peramban (*Chrome, Edge, Firefox*) dan akses alamat:
   **[http://127.0.0.1:8000/](http://127.0.0.1:8000/)**

---

## 3. Navigasi & Fitur Antarmuka

```
+-----------------------------------------------------------------------------+
|  CATCHFORECAST AI — TELUK BANTEN WEB GIS                                    |
+----------------------+------------------------------------------------------+
| [PILIH SPESIES]      | [PETA INTERAKTIF TELUK BANTEN]                       |
| (•) Kembung          |                                                      |
| ( ) Selar            |   - Sel Poligon 1 km² berwarna (Choropleth)          |
| ( ) Kuniran          |   - Hover Kursor: Menampilkan estimasi tangkapan     |
|                      |   - Klik Sel: Membuka modal detail oseanografi       |
| [KARTU INDIKATOR]    |   - Bintang Merah: PPN Karangantu (Hub Utama)        |
| - Total: 26.010 kg   |                                                      |
| - Rerata: 32.6 kg/km²| [KOTAK INSPEKTUR MENGAMBANG] (Pojok Kanan Atas)      |
|                      |  "Sel TB_G_0561 | Kedalaman: 12.2m | SST: 29.1°C"    |
| [LEGENDA WARNA]      |                                                      |
| Rendah ====== Tinggi | [KONTROL LAYER] (Pojok Kanan Atas Peta)              |
|                      |  Pilihan Peta: Dark Canvas / OpenStreetMap / Ocean   |
+----------------------+------------------------------------------------------+
```

### Langkah Operasional Nelayan / Pengguna:
1. **Memilih Spesies Ikan:** Klik salah satu tombol spesies di bilah samping kiri (*Sidebar*). Seluruh warna peta dan angka ringkasan akan langsung diperbarui.
2. **Membaca Peta Zona Potensial:**
   - Warna merah/oranye pekat (pada Kembung) atau kuning cerah (pada Kuniran) menandakan zona kelimpahan tinggi (*fishing hotspot*).
   - Zona perairan yang direkomendasikan untuk ikan kembung berada di perairan teluk bagian tengah dan utara.
   - Zona perairan yang direkomendasikan untuk ikan kuniran berada di perairan dangkal dekat garis pantai timur dan selatan.
3. **Mengecek Informasi Sel Laut:** Arahkan kursor mouse ke sel grid tertentu untuk melihat perkiraan bobot ikan ($kg$), estimasi CPUE (hasil per trip perahu), suhu air laut (°C), dan kedalaman laut ($m$).
4. **Melihat Titik Pelabuhan Karangantu:** Klik ikon bintang merah di muara Karangantu untuk melihat profil pelabuhan dan total pendaratan tahunan.

---

## 4. Batasan & Catatan Keamanan Pelayaran
- Peta ini adalah **estimasi ilmiah potensi biomassa** berdasarkan suhu satelit dan klorofil terkini. Peta ini **bukan jaminan pasti** bahwa kapal nelayan akan menemukan ikan di titik tersebut.
- Keselamatan pelayaran tetap merupakan prioritas utama. Selalu periksa prakiraan cuaca maritim BMKG mengenai tinggi gelombang dan kecepatan angin sebelum melaut.
