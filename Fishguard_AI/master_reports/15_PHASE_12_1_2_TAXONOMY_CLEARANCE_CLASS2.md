# PHASE 12.1.2 — TAXONOMIC CLEARANCE & SELECTIVE ACQUISITION REPORT
## Class 2: *Upeneus sulphureus* (Ikan Kuniran / Sulphur Goatfish)
**FishGuard AI — ASIK V (Ajang Kompetisi Sistem Informasi Kelautan)**  
**Program Studi Sistem Informasi Kelautan, Universitas Pendidikan Indonesia**  
**Tanggal Pelaksanaan:** 16 November 2026  
**Auditor/Tim Penguji:** Tim Multidisiplin FishGuard AI (Computer Vision Engineer, Ichthyology & Marine Biologist, Research Data Integrity Auditor)

---

## 1. Executive Summary & Konteks Keputusan

Menindaklanjuti keputusan arsitektur pada Master Handover Gemini Antigravity, sebanyak **10 kandidat gambar publik untuk Class 2 (*Upeneus sulphureus*)** yang sebelumnya ditahan pada status `TAXONOMY_REVIEW` (Phase 12.1 dan Phase 12.1.1) telah diaudit secara ichthyologis, diunduh, dan diverifikasi integritas teknisnya.

### Ringkasan Hasil Eksekusi:
- **Kandidat diaudit:** 10 record (`FG-C2-010` s.d. `FG-C2-014`, `FG-C2-019` s.d. `FG-C2-023`).
- **Keberhasilan unduh:** **10 dari 10 gambar (100%)** berhasil diunduh tanpa error 0-byte atau timeout.
- **Verifikasi integritas PIL & SHA-256:** 10 gambar lulus validasi format JPEG/RGB.
- **Karantina underwater:** 0 gambar (seluruh gambar merupakan foto spesimen lateral di darat/laboratorium dengan latar polos, bukan foto penyelaman bawah air).
- **Keputusan taksonomi:** **APPROVED_TAXONOMY_CLEARED** berdasarkan kriteria diagnostik morfologis Uiblein et al. (2025).
- **Total akumulasi referensi bersih proyek:**
  - Class 0 (*Rastrelliger brachysoma*): 10 gambar bersih
  - Class 1 (*Selaroides leptolepis*): 10 gambar bersih (1 dikarantina: FG-C1-019)
  - Class 2 (*Upeneus sulphureus*): 10 gambar bersih
  - **Total referensi bersih MVP:** **30 gambar spesimen lateral resolusi tinggi**.

---

## 2. Kriteria Evaluasi Taksonomi (Uiblein et al., 2025)

Spesies kambing-laut / kuniran (*Mullidae: Upeneus*) sering kali mengalami kerancuan identifikasi (*cryptic species complex*). Pada audit ini, spesimen dievaluasi secara ketat berdasarkan karakter pembeda kunci:

1. **Sirip Ekor (Caudal Fin):** Polos tanpa garis melintang gelap (*plain caudal fin without dark bars/stripes*). Karakter ini membedakan secara tegas dari *Upeneus tragula*, *Upeneus vittatus*, *Upeneus sundaicus*, dan *Upeneus luzonius* yang memiliki belang hitam/cokelat jelas pada sirip ekor.
2. **Sungkut / Sungut Dagu (Chin Barbels):** Berwarna putih / pucat (*white barbels*), tidak berwarna kuning terang atau gelap.
3. **Pola Garis Tubuh (Body Coloration):** Memiliki 2 garis kuning longitudinal di sepanjang sisi lateral tubuh, dengan punggung kehijauan/perak dan perut keputihan.
4. **Sirip Punggung Pertama (First Dorsal Fin):** Memiliki bercak hitam/gelap pada ujung atas sirip (D VIII, 9).

Seluruh 10 spesimen yang diunduh memperlihatkan morfologi ekor polos tanpa garis gelap dan garis kuning lateral yang konsisten dengan deskripsi spesies *Upeneus sulphureus* Cuvier, 1829.

---

## 3. Rincian Record Spesimen Class 2 yang Diakuisisi

| Record ID | Fotografer / Institusi | Sumber | Lisensi | Resolusi | Background | Lokasi Asal Spesimen | Status Audit |
|---|---|---|---|---|---|---|---|
| **FG-C2-010** | Jishnudev Ma | FishBase | CC-BY (label) | 2801x1168 | Abu-abu lab | Thrissur, Kerala, India | CLEARED |
| **FG-C2-011** | D.G.R. Wiadnya | FishBase | CC-BY-NC (label) | 4314x2475 | Abu-abu netral | Probolinggo, Jawa Timur, Indonesia | CLEARED (Prioritas Lokal) |
| **FG-C2-012** | Hoang Ngoc Thao | FishBase | CC-BY (label) | 4272x2848 | Biru (papan ukur) | Viet Nam | CLEARED |
| **FG-C2-013** | Sahat Ratmuangkhwang | FishBase | CC-BY (label) | 3299x2473 | Hitam pekat | Ranong, Thailand | CLEARED |
| **FG-C2-014** | Sahat Ratmuangkhwang | FishBase | CC-BY (label) | 1688x1266 | Hitam pekat | Phang Nga, Thailand | CLEARED |
| **FG-C2-019** | Dinh D. Tran, FiMSeA | Fishes of Australia | CC BY | 1020x678 | Hitam pekat | Mekong / Vietnam | CLEARED |
| **FG-C2-020** | Jeffrey T. Williams | Smithsonian NMNH | CC BY-NC-SA | 2500x1663 | Putih studio | Manila, Filipina (Pasar Cubao) | CLEARED (Voucher 1) |
| **FG-C2-021** | Jeffrey T. Williams | Smithsonian NMNH | CC BY-NC-SA | 2500x1663 | Putih studio | Manila, Filipina (Pasar Cubao) | CLEARED (Voucher 2) |
| **FG-C2-022** | Jeffrey T. Williams | Smithsonian NMNH | CC BY-NC-SA | 2500x1663 | Putih studio | Manila, Filipina (Pasar Cubao) | CLEARED (Voucher 3) |
| **FG-C2-023** | CSIRO ANFC | Fishes of Australia | CC BY-NC | 654x435 | Putih studio | Australia | CLEARED |

### Catatan Khusus Spesimen Biologis:
- **FG-C2-011 (D.G.R. Wiadnya):** Merupakan spesimen dari Selat Madura / Laut Jawa (Probolinggo, Jawa Timur). Memiliki nilai representasi ilmiah tertinggi karena berada pada bioregion Paparan Sunda (*Sunda Shelf*), selaras dengan perairan Teluk Banten / PPN Karangantu.
- **Klaster Voucher Smithsonian (FG-C2-020, FG-C2-021, FG-C2-022):** Berdasarkan metadata kurasi Smithsonian NMNH Division of Fishes, ketiganya merupakan individu fisik terpisah (*distinct catalogued specimens*) yang dikoleksi pada pasar ikan Cubao, Manila. Ketiganya bukan merupakan foto multi-angle dari 1 individu ikan, melainkan 3 voucher spesimen yang berbeda.

---

## 4. Hash SHA-256 dan Lokasi Penyimpanan Fisik

Seluruh file disimpan di folder repositori resmi:  
`dataset_pipeline/public_reference_images/class_2_upeneus_sulphureus/`

1. `FG-C2-010_upeneus_sulphureus.jpg`  
   `SHA-256: a9a066bcf5964f087e99b18f27f3245b145f8237b4023c7a40da19b16bdf7c6f`
2. `FG-C2-011_upeneus_sulphureus.jpg`  
   `SHA-256: a74a5db714f540215989e2e5896a47f6b623d566242374c05b90907dbd397635`
3. `FG-C2-012_upeneus_sulphureus.jpg`  
   `SHA-256: da3d31b219112828ac7d7ac5963e3628db5a7d63366f2cc146a925d41e4f0811`
4. `FG-C2-013_upeneus_sulphureus.jpg`  
   `SHA-256: 23446c57fb4bc89db07ef95d313d2ff29e2bd88276803f30eb03f3dc08699767`
5. `FG-C2-014_upeneus_sulphureus.jpg`  
   `SHA-256: 4302b0333a209142733bdcc4027e4937e3a73494c4063ce8bddd0495ce881a85`
6. `FG-C2-019_upeneus_sulphureus.jpg`  
   `SHA-256: a6e90778609696089f2d2e00128a915db1bf13f117e26f64c3d074589c18fed6`
7. `FG-C2-020_upeneus_sulphureus.jpg`  
   `SHA-256: 440a4807538ebf25f7ab6c445adeda81c18de367ae50d6cf688bea1e677b69e7`
8. `FG-C2-021_upeneus_sulphureus.jpg`  
   `SHA-256: b6b67749c9471250a01c6615429ec954acd649d4d5f3a11551e6abb2600d6304`
9. `FG-C2-022_upeneus_sulphureus.jpg`  
   `SHA-256: d01b11a9477f1051ebbc0eb4167006108f463ed8ae7aaab086f30d0240f017ba`
10. `FG-C2-023_upeneus_sulphureus.jpg`  
    `SHA-256: ade0743227e6e789f3b6817384637a082d295621f66349471224562b524915f0`

---

## 5. Kesimpulan dan Kesiapan Fase Selanjutnya

Dengan diselesaikannya akuisisi dan audit taksonomi Class 2, **seluruh 3 kelas target spesies MVP FishGuard AI kini telah memiliki inventaris citra referensi bersih**:
1. Class 0: *Rastrelliger brachysoma* (10 referensi)
2. Class 1: *Selaroides leptolepis* (10 referensi)
3. Class 2: *Upeneus sulphureus* (10 referensi)

Dataset ini siap digunakan untuk ekstraksi sprite transparan (*transparent fish cutouts*) dan pembuatan generator komposisi multi-ikan sintetis (*copy-paste augmentation*) untuk melatih dan mengevaluasi detektor & classifier FishGuard AI.
