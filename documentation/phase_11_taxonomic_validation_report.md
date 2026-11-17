# PHASE 11 — TAXONOMIC VALIDATION REPORT
## FishGuard AI — ASIK V

**Tanggal Dokumen:** 16 November 2026  
**Auditor:** Senior Fisheries Taxonomist & Dataset Curator  
**Institusi:** Program Studi Sistem Informasi Kelautan, Universitas Pendidikan Indonesia Kampus Serang  
**Dasar Data Primer:** Rekapitulasi Statistik Pendaratan Ikan PIPP KKP 2026 — PPN Karangantu, Kota Serang, Banten  
**Status Validasi:** ✅ SELESAI (Audit Nomenklatur 23 Komoditas Ikan Teluk Banten Selesai)  

---

## 1. Ringkasan Eksekutif

Dalam pengembangan sistem visi komputer perikanan, akurasi pelabelan kelas (*ground truth ground-state labels*) sangat bergantung pada keabsahan taksonomi. Kesalahan penamaan ilmiah atau penggunaan nama sinonim usang dapat memicu inkonsistensi metadata lintas repositori global (GBIF, FishBase, WoRMS) serta mengaburkan batas morfologi diagnostik.

Laporan ini menyajikan audit taksonomi komprehensif terhadap **23 komoditas ikan** yang tercatat dalam data produksi Pusat Informasi Pelabuhan Perikanan (PIPP) KKP tahun 2026 di PPN Karangantu, Kota Serang, Banten. 

### Temuan Taksonomi Utama:
1. **Pembaruan Nomenklatur Genus *Leiognathus***: Sebanyak 4 komoditas peperek dalam data PIPP menggunakan nama genus *Leiognathus*. Berdasarkan revisi filogenetik Leiognathidae mutakhir (Chakrabarty & Sparks, 2008; WoRMS 2024), sebagian besar spesies telah dipindahkan ke genus baru:
   * *Leiognathus leuciscus* $\rightarrow$ valid sebagai ***Equulites leuciscus*** (Günther, 1860).
   * *Leiognathus bindus* $\rightarrow$ valid sebagai ***Photopectoralis bindus*** (Valenciennes, 1835).
2. **Pembaruan Nomenklatur Pari Kembang**: *Dasyatis kuhlii* telah direvisi dalam taksonomi Elasmobranchii menjadi ***Neotrygon kuhlii*** (Müller & Henle, 1841).
3. **Peringatan Kategori Agregat Genus**: Entri *"Peperek lainnya (Leiognathus spp)"* dengan volume 8.893 kg merupakan kategori penampung (*chaff category*) tingkat genus yang mencakup multi-spesies dan **DITOLAK** untuk dijadikan kelas model YOLO spesifik.
4. **Validitas Taksonomi Tiga Kandidat Teratas**: *Rastrelliger brachysoma*, *Selaroides leptolepis*, dan *Upeneus sulphureus* berstatus **`ACCEPTED`** pada World Register of Marine Species (WoRMS) dan FishBase, memiliki batas morfologi yang jelas, serta tidak memiliki kerancuan taksonomi tingkat genus.

---

## 2. Audit Nomenklatur 23 Komoditas Ikan PIPP Karangantu

Tabel di bawah ini merekonsiliasi nama yang tercatat pada portal PIPP KKP terhadap basis data taksonomi kelautan internasional terstandarisasi (**WoRMS / FishBase / GBIF Backbone Taxonomy**):

| No | Nama Lokal (PIPP) | Nama Ilmiah Tercatat (PIPP) | Nama Ilmiah Valid Terkini (WoRMS / FishBase) | Famili Valid | Ordo | Taxonomic Confidence | Status Nomenklatur |
|---|---|---|---|---|---|---|---|
| 1 | Kembung perempuan | *Rastrelliger brachysoma* | ***Rastrelliger brachysoma* (Bleeker, 1851)** | Scombridae | Scombriformes | **HIGH** | `ACCEPTED` |
| 2 | Peperek | *Leiognathus leuciscus* | ***Equulites leuciscus* (Günther, 1860)** | Leiognathidae | Acanthuriformes | **HIGH** | `SYNONYM_RECLASSIFIED` |
| 3 | Kuniran | *Upeneus sulphureus* | ***Upeneus sulphureus* Cuvier, 1829** | Mullidae | Syngnathiformes | **HIGH** | `ACCEPTED` |
| 4 | Selar kuning | *Selaroides leptolepis* | ***Selaroides leptolepis* (Cuvier, 1833)** | Carangidae | Carangiformes | **HIGH** | `ACCEPTED` |
| 5 | Teri | *Stolephorus commersonii* | ***Stolephorus commersonii* Lacepède, 1803** | Engraulidae | Clupeiformes | **HIGH** | `ACCEPTED` |
| 6 | Selanget | *Anodontostoma chacunda* | ***Anodontostoma chacunda* (Hamilton, 1822)** | Dorosomatidae | Clupeiformes | **HIGH** | `ACCEPTED` |
| 7 | Peperek lainnya | *Leiognathus spp* | *Leiognathidae indet.* (Multi-species) | Leiognathidae | Acanthuriformes | **LOW (GENUS)** | `AGGREGATE_TAXON` |
| 8 | Peperek bondolan | *Leiognathus bindus* | ***Photopectoralis bindus* (Valenciennes, 1835)** | Leiognathidae | Acanthuriformes | **HIGH** | `SYNONYM_RECLASSIFIED` |
| 9 | Tembang | *Sardinella brachysoma* | ***Sardinella brachysoma* Bleeker, 1852** | Clupeidae | Clupeiformes | **MEDIUM** | `ACCEPTED` |
| 10 | Teri | *Encrasicholina devisi* | ***Encrasicholina devisi* (Whitley, 1940)** | Engraulidae | Clupeiformes | **HIGH** | `ACCEPTED` |
| 11 | Beloso | *Saurida tumbil* | ***Saurida tumbil* (Bloch, 1795)** | Synodontidae | Aulopiformes | **HIGH** | `ACCEPTED` |
| 12 | Tongkol banyar | *Euthynnus affinis* | ***Euthynnus affinis* (Cantor, 1849)** | Scombridae | Scombriformes | **HIGH** | `ACCEPTED` |
| 13 | Gulamah | *Otolithes ruber* | ***Otolithes ruber* (Bloch & Schneider, 1801)** | Sciaenidae | Perciformes | **HIGH** | `ACCEPTED` |
| 14 | Kurisi | *Nemipterus aurora* | ***Nemipterus aurora* Russell, 1991** | Nemipteridae | Spariformes | **HIGH** | `ACCEPTED` |
| 15 | Pari kembang | *Dasyatis kuhlii* | ***Neotrygon kuhlii* (Müller & Henle, 1841)** | Dasyatidae | Myliobatiformes | **HIGH** | `SYNONYM_RECLASSIFIED` |
| 16 | Selar komo | *Alepes djedaba* | ***Alepes djedaba* (Forsskål, 1775)** | Carangidae | Carangiformes | **HIGH** | `ACCEPTED` |
| 17 | Kuwe | *Caranx sexfasciatus* | ***Caranx sexfasciatus* Quoy & Gaimard, 1825** | Carangidae | Carangiformes | **HIGH** | `ACCEPTED` |
| 18 | Gulamah | *Pennahia argentata* | ***Pennahia argentata* (Houttuyn, 1782)** | Sciaenidae | Perciformes | **MEDIUM** | `ACCEPTED` |
| 19 | Peperek | *Leiognathus berbis* | ***Equulites elongatus* (Günther, 1874)** / *E. berbis* | Leiognathidae | Acanthuriformes | **MEDIUM** | `SYNONYM_RECLASSIFIED` |
| 20 | Tongkol pisang-balaki | *Auxis thazard* | ***Auxis thazard* (Lacepède, 1800)** | Scombridae | Scombriformes | **HIGH** | `ACCEPTED` |
| 21 | Ikan sebelah | *Psettodes erumei* | ***Psettodes erumei* (Bloch & Schneider, 1801)** | Psettodidae | Pleuronectiformes | **HIGH** | `ACCEPTED` |
| 22 | Tenggiri batang | *Scomberomorus lineolatus* | ***Scomberomorus lineolatus* (Cuvier, 1832)** | Scombridae | Scombriformes | **HIGH** | `ACCEPTED` |
| 23 | Kurisi | *Nemipterus nematophorus* | ***Nemipterus nematophorus* (Bleeker, 1854)** | Nemipteridae | Spariformes | **HIGH** | `ACCEPTED` |

---

## 3. Analisis Taksonomi Mendalam untuk 5 Kandidat Prioritas

### 3.1 Kandidat 1: *Rastrelliger brachysoma* (Bleeker, 1851) — Kembung Perempuan
* **Kedudukan Taksonomi**: Ordo Scombriformes, Famili Scombridae, Tribus Scombrini, Genus *Rastrelliger*.
* **Status Ilmiah**: `ACCEPTED` (WoRMS AphiaID: 219717, FishBase SpecCode: 114).
* **Diagnosis Morfologi**:
  * Tubuh sangat dalam dan memipih ke samping (*deep-bodied, compressed*).
  * Kedalaman tubuh (Body Depth / $BD$) relatif tinggi: panjang standar ($SL$) hanya $2.3$ hingga $2.7$ kali tinggi tubuh ($SL/BD \le 2.7$), atau $TL/BD < 3.0$.
  * Sisir saring insang (*gill rakers*) berjumlah sangat banyak: **56–61 sisir saring** pada lengkung insang pertama bagian bawah.
  * Ujung moncong lebih tumpul membulat; tidak memiliki bintik hitam tajam di dekat pangkal sirip dada.
* **Diferensiasi Taksonomi terhadap *Rastrelliger kanagurta* (Kembung Lelaki)**:
  $$\text{Kembung Perempuan: } \frac{TL}{BD} < 3.0 \quad \text{vs} \quad \text{Kembung Lelaki: } \frac{TL}{BD} > 3.4$$
  Perbedaan rasio ini sangat signifikan dan dapat diekstraksi secara akurat oleh bounding box rasio $W/H$ pada model visi komputer.
* **Rekomendasi Verifikasi**: `ACCEPTED_PRIMARY_TARGET`.

---

### 3.2 Kandidat 2: *Equulites leuciscus* (Günther, 1860) — Peperek / Peperek Topang
* **Kedudukan Taksonomi**: Ordo Acanthuriformes, Famili Leiognathidae, Genus *Equulites*.
* **Status Ilmiah**: `ACCEPTED` sebagai *Equulites leuciscus* (WoRMS AphiaID: 445582); *Leiognathus leuciscus* berstatus `HOMOTYPIC_SYNONYM`.
* **Diagnosis Morfologi**:
  * Duri sirip punggung kedua (*second dorsal spine*) memanjang lentur seperti cambuk (*filamentous/whip-like*), melebihi tinggi sirip punggung lainnya.
  * Mulut dapat dijulurkan ke arah bawah (*downward protractile mouth*) untuk memakan mangsa bentik di dasar lumpur.
  * Sisi dorsal memiliki corak garis-garis bergelombang cokelat samar; sisi ventral keperakan berkilau.
* **Tantangan Taksonomi Lapangan**:
  * Famili Leiognathidae di Teluk Banten didaratkan bercampur-baur antara *Equulites leuciscus*, *Photopectoralis bindus*, *Deveximentum spp.*, dan *Nuchequula spp.*
  * Nelayan lokal menyebut seluruh famili ini dengan nama generik: **"Peperek"**.
* **Rekomendasi Verifikasi**: `PROPOSED_AUXILIARY` (Memerlukan sortasi ketat di meja laboratorium jika ingin dipisahkan ke tingkat spesies).

---

### 3.3 Kandidat 3: *Upeneus sulphureus* Cuvier, 1829 — Kuniran / Yellow Goatfish
* **Kedudukan Taksonomi**: Ordo Syngnathiformes, Famili Mullidae, Genus *Upeneus*.
* **Status Ilmiah**: `ACCEPTED` (WoRMS AphiaID: 218671, FishBase SpecCode: 4568).
* **Diagnosis Morfologi**:
  * Memiliki sepasang sungut dagu (*hyoid barbels*) berwarna putih kekuningan di bawah rahang bawah yang dapat dilipat ke celah tenggorokan.
  * Dua garis kuning cerah membujur di sepanjang sisi lateral tubuh (dari belakang mata hingga pangkal ekor).
  * Cuping sirip ekor polos tanpa garis-garis silang gelap (*plain caudal fin without dark bars*). Karakter ini sangat penting untuk membedakannya dari *Upeneus vittatus* dan *Upeneus tragula*.
  * Ujung sirip punggung pertama memiliki bercak hitam jelas.
* **Keunggulan untuk Computer Vision**:
  * Sungut dagu dan warna oranye-kuning sangat kontras terhadap latar belakang papan ukur biru, memudahkan segmentasi kontur dan ekstraksi fitur CNN.
* **Rekomendasi Verifikasi**: `ACCEPTED_PRIMARY_TARGET`.

---

### 3.4 Kandidat 4: *Selaroides leptolepis* (Cuvier, 1833) — Selar Kuning / Yellowstripe Scad
* **Kedudukan Taksonomi**: Ordo Carangiformes, Famili Carangidae, Genus *Selaroides*.
* **Status Ilmiah**: `ACCEPTED` (WoRMS AphiaID: 218520, FishBase SpecCode: 1943). Spesies tunggal (*monotypic*) dalam genus *Selaroides*.
* **Diagnosis Morfologi**:
  * Terdapat pita kuning keemasan lebar yang sangat mencolok membujur di sisi atas tubuh dari tepi belakang mata hingga ke pangkal sirip ekor.
  * Terdapat bintik hitam bulat (*opercular spot*) yang tegas pada sudut atas tepi operkulum.
  * Sisik duri (*scutes*) kecil berjumlah 24–29 pada bagian lurus gurat sisi dekat ekor.
  * Tidak memiliki finlet terpisah di belakang sirip punggung kedua maupun dubur (membedakannya dari *Decapterus*).
* **Keunggulan untuk Computer Vision**:
  * Garis emas membujur merupakan fitur visual berfrekuensi tinggi (*high-contrast texture feature*) yang sangat mudah diidentifikasi oleh layer konvolusi YOLO.
* **Rekomendasi Verifikasi**: `ACCEPTED_PRIMARY_TARGET`.

---

### 3.5 Kandidat 5: *Stolephorus commersonii* Lacepède, 1803 — Teri / Commerson's Anchovy
* **Kedudukan Taksonomi**: Ordo Clupeiformes, Famili Engraulidae, Subfamili Engraulinae, Genus *Stolephorus*.
* **Status Ilmiah**: `ACCEPTED` (WoRMS AphiaID: 217436, FishBase SpecCode: 585).
* **Diagnosis Morfologi**:
  * Tubuh sub-silindris memanjang, transparan, dan berdaging rapuh; garis perak lateral membujur.
  * Moncong menonjol melampaui rahang bawah (*fleshy projecting snout*); maksila panjang mencapai tepi depan preoperkulum.
  * Ukuran dewasa sangat kecil: Total Length hanya $5.0$ hingga $10.0\text{ cm}$.
* **Alasan Diskualifikasi Teknis**:
  * Di TPI Karangantu, teri tidak pernah didaratkan dalam susunan satu per satu di nampan, melainkan dalam **massa basah gumpalan ribuan ekor** di dalam peti kayu/keranjang plastik.
  * Memotret dan mengukur panjang individu teri satu per satu bertentangan dengan tujuan operasional modul pemantauan tangkapan cepat FishGuard AI.
* **Rekomendasi Verifikasi**: `REJECTED_UNSUITABLE_FOR_MVP`.

---

## 4. Taksa yang Memerlukan Pemeriksaan Ahli Laboratorium

Berdasarkan audit, beberapa taksa dalam daftar PIPP memiliki risiko ambiguitas taksonomi tinggi jika dikumpulkan di lapangan:

1. **Kompleks Peperek (*Leiognathidae*)**:
   * *Equulites leuciscus* vs *Photopectoralis bindus* vs *Equulites berbis*.
   * Memerlukan pemeriksaan mikroskopis bentuk mulut protraktil dan susunan sisir punggung oleh asisten laboratorium SIK UPI sebelum diberi label kelas spesifik.
2. **Kompleks Gulamah (*Sciaenidae*)**:
   * *Otolithes ruber* vs *Pennahia argentata*.
   * Perlu pemeriksaan gigi taring (*canine teeth*) di rahang atas dan bentuk gelembung renang (*swim bladder appendages*).

---

## 5. Kesimpulan Validasi Taksonomi

1. Penamaan ilmiah pada katalog `species_reference.csv` telah disinkronkan dengan status WoRMS 2024.
2. Tiga spesies yang memiliki **kepastian taksonomi tertinggi dan batas morfologi paling tegas** untuk dijadikan target kelas FishGuard AI adalah:
   * **Kelas 0**: *Rastrelliger brachysoma* (Kembung Perempuan)
   * **Kelas 1**: *Selaroides leptolepis* (Selar Kuning)
   * **Kelas 2**: *Upeneus sulphureus* (Kuniran)

---
*Laporan Validasi Taksonomi FishGuard AI — Program Studi Sistem Informasi Kelautan, UPI Kampus Serang.*
