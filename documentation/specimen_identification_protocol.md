# PROTOKOL IDENTIFIKASI TAKSONOMI SPESIMEN LAPANGAN
## FishGuard AI — ASIK V (Phase 11.7)
**Standar Taksonomi:** WoRMS (World Register of Marine Species) & FAO Species Identification Guide  
**Lokasi Penerapan:** PPN Karangantu, Teluk Banten  
**Institusi:** Program Studi Sistem Informasi Kelautan (SIK), UPI Kampus Serang  

---

## 1. HIERARKI VERIFIKASI TAKSONOMI

Untuk menjamin integritas data ilmiah sebelum spesimen dimasukkan ke dalam katalog pelatihan model AI, diterapkan hierarki verifikasi bertingkat:

```
[ Kolektor Lapangan ]  --->  [ Ahli Taksonomi Lapangan ]  --->  [ Lab Iktiologi SIK ]
(Deteksi Ciri Visual Primer)     (Pemeriksaan Morfometrik Kritis)     (Uji Voucher / Diseksi)
```

1. **Level 1 (Kolektor Lapangan):** Menyaring spesimen berdasarkan penampakan umum dan memilah ke nampan kelas target.
2. **Level 2 (Ahli Taksonomi Lapangan):** Memeriksa karakter diagnostik kunci, menghitung sisir insang/scute bila meragukan, dan menandatangani lembar metadata (`FIELD_VERIFIED`).
3. **Level 3 (Eskalasi Laboratorium):** Bila ditemukan spesimen atipikal, hibrida, atau meragukan, spesimen diberi label `NEEDS_REVIEW`, disimpan di coolbox, dan dibawa ke Lab Iktiologi SIK UPI Kampus Serang.

---

## 2. KUNCI DIAGNOSTIK 3 KELAS TARGET MVP

### 2.1 KELAS 0: *Rastrelliger brachysoma* (Bleeker, 1851) — Ikan Kembung Perempuan
- **Taksonomi:** Ordo Scombriformes, Famili Scombridae (WoRMS AphiaID: 273656).
- **Karakter Diagnostik Kunci:**
  1. Tubuh sangat tinggi, membulat lebar, dan pipih lateral (*deep-bodied*).
  2. Rasio kedalaman tubuh (*body depth* pada batas operkulum) adalah **3,7 – 4,3 kali pada Fork Length (FL)** (kedalaman tubuh 28,5% – 32,7% dari FL).
  3. Panjang kepala lebih pendek daripada kedalaman tubuh; profil moncong tumpul membulat.
  4. Sisir saring insang bawah (*lower gill rakers*) berjumlah **56 – 61** pada busur insang pertama.
  5. Memiliki 5 finlet dorsal dan 5 finlet anal terpisah di belakang sirip punggung/dubur.
  6. Punggung berwarna kehijauan polos dengan sedikit bintik gelap samar tak beraturan (tanpa bintik hitam tajam di dasar pektoral).
- **Spesies Simpatrik & Risiko Salah Identifikasi:**
  - *Rastrelliger kanagurta* (Kembung Lelaki): Tubuh langsing memanjang (kedalaman tubuh 20–25% FL), moncong runcing, sisir insang bawah hanya 30–45, dan memiliki **bintik hitam jelas pada batas bawah sirip dada**.
  - *Keputusan:* Jika ditemukan *R. kanagurta*, catat sebagai `EXCLUDED_NON_MVP_SPECIES` (`class_id: -1`).

---

### 2.2 KELAS 1: *Selaroides leptolepis* (Cuvier, 1833) — Ikan Selar Kuning
- **Taksonomi:** Ordo Carangiformes, Famili Carangidae (WoRMS AphiaID: 218442).
- **Karakter Diagnostik Kunci:**
  1. Terdapat **pita kuning keemasan lebar yang sangat mencolok** membujur dari tepi atas mata melintasi sisi tubuh hingga ke pangkal ekor (*caudal peduncle*).
  2. Bercak hitam berbentuk bulat lonjong jelas pada batas atas operkulum (tutup insang).
  3. Gurat sisi (*lateral line*) memiliki deretan **24 – 29 scute kecil** pada bagian lurus dekat pangkal ekor.
  4. Tidak memiliki finlet lepas terpisah di belakang sirip punggung dan dubur.
  5. Gigi pada rahang atas berbentuk deretan halus seperti beludru, sedangkan rahang bawah memiliki satu deret gigi kecil.
- **Spesies Simpatrik & Risiko Salah Identifikasi:**
  - *Selar crumenophthalmus* (Bentong): Mata berukuran sangat besar (diameter mata > 1/3 panjang kepala), ada lekukan dalam di batas bahu (*cleithrum*), tanpa pita kuning emas lebar.
  - *Alepes djedaba* (Selar komo): Tubuh lebih lebar, memiliki 39–51 scute yang jauh lebih tajam dan tebal, cuping atas sirip punggung berwarna kehitaman.
  - *Keputusan:* Pastikan pita kuning keemasan kontras dan scute berjumlah <30.

---

### 2.3 KELAS 2: *Upeneus sulphureus* Cuvier, 1829 — Ikan Kuniran
- **Taksonomi:** Ordo Syngnathiformes, Famili Mullidae (WoRMS AphiaID: 218671).
- **Karakter Diagnostik Kunci:**
  1. Memiliki **sepasang sungut dagu panjang (hyoid barbels)** berwarna putih kekuningan di bawah rahang bawah yang mencapai batas tepi preoperkulum.
  2. Memiliki **dua garis kuning cerah membujur** sejajar sepanjang sisi tubuh berwarna perak keemasan.
  3. Ujung cuping sirip punggung pertama berwarna hitam tajam.
  4. **Sirip ekor polos** berwarna kuning transparan tanpa corak garis-garis gelap menyilang (*plain caudal fin, no dark cross-bars*).
- **Spesies Simpatrik & Risiko Salah Identifikasi:**
  - *Upeneus vittatus* (Kuniran belang): Sirip ekor memiliki 4–5 garis melintang hitam-cokelat yang sangat kontras pada cuping atas dan 3–4 pada cuping bawah.
  - *Upeneus tragula*: Tubuh berbintik-bintik cokelat gelap, sungut berwarna cokelat kemerahan.
  - *Keputusan:* Verifikasi mutlak: **Sirip ekor wajib polos tanpa garis hitam melintang!**

---

## 3. FORMULIR KEPUTUSAN VERIFIKASI (DECISION TREE)

```
[ Spesimen Diperiksa ]
        |
        +---> Apakah memiliki sepasang sungut dagu?
        |         |--- YA: Periksa sirip ekor. Polos tanpa garis silang?
        |         |           |--- YA  --> [ KELAS 2: Upeneus sulphureus ] (VERIFIED)
        |         |           |--- TDK --> [ EXCLUDED: Upeneus vittatus / tragula ]
        |
        +---> Apakah memiliki pita kuning emas lebar membujur + bercak hitam operkulum?
        |         |--- YA: Periksa scute ekor kecil (24-29 scute)?
        |         |           |--- YA  --> [ KELAS 1: Selaroides leptolepis ] (VERIFIED)
        |         |           |--- TDK --> [ EXCLUDED: Alepes djedaba / Selar spp ]
        |
        +---> Apakah bertubuh sangat tinggi (BD > 28% FL) dengan 5 finlet lepas?
                  |--- YA: Periksa rasio TL/BD < 3.0 & sisir insang banyak?
                  |           |--- YA  --> [ KELAS 0: Rastrelliger brachysoma ] (VERIFIED)
                  |           |--- TDK (Langsing, bintik pektoral) --> [ EXCLUDED: R. kanagurta ]
```
