# VALIDASI ALUR PENGUKURAN BIOMETRIK & KEYPOINTS
## FishGuard AI — ASIK V (Phase 11.7.1)
**Metode:** Verifikasi Definisi Morfometrik & Skema Anotasi Keypoint  
**Status Evaluasi:** **PASS (STANDAR TERTELUSUR & KONSISTEN)**  

---

## 1. ALUR PENGUKURAN BIOMETRIK

Pemeriksaan silang terhadap protokol biometrik memastikan konsistensi parameter pengukuran fisik:

1. **Total Length ($TL$):** Diukur dari ujung terdepan rahang (moncong terkatup) hingga ujung cuping sirip ekor terpanjang (dibentangkan alami). Satuan: $cm$, ketelitian $0,1\text{ cm}$.
2. **Fork Length ($FL$):** Diukur dari moncong hingga lekukan tengah percabangan ekor (*cartilaginous notch*). Wajib untuk *Rastrelliger brachysoma* dan *Selaroides leptolepis*. Satuan: $cm$, ketelitian $0,1\text{ cm}$.
3. **Standard Length ($SL$):** Diukur dari moncong hingga batas akhir lipatan pangkal ekor (*hypural crease*). Satuan: $cm$, ketelitian $0,1\text{ cm}$.
4. **Body Depth ($BD$):** Kedalaman vertikal maksimum tubuh di depan sirip punggung pertama, diukur menggunakan kaliper geser digital. Satuan: $cm$, ketelitian $0,01\text{ cm}$.
5. **Wet Weight ($W$):** Bobot basah total spesimen utuh yang diukur dengan timbangan digital lapangan bertoleransi $0,1\text{ gram}$.

---

## 2. EVALUASI SKEMA 6 KEYPOINTS ANATOMI

Skema 6 titik kunci anatomi yang telah disahkan pada Phase 11.7 dievaluasi terhadap morfologi 3 kelas target:

| Keypoint ID | Nama Landmark | Relevansi Morfometrik | Status Validasi |
|:---:|:---|:---|:---:|
| **KP-0** | `snout_tip` | Titik nol referensi pengukuran $TL$, $FL$, dan $SL$ | **VALID** |
| **KP-1** | `caudal_fork` | Titik akhir pengukuran $FL$ (*Rastrelliger* & *Selaroides*) | **VALID** |
| **KP-2** | `upper_caudal_tip` | Ujung cuping ekor bagian atas (komponen $TL$) | **VALID** |
| **KP-3** | `lower_caudal_tip` | Ujung cuping ekor bagian bawah (komponen $TL$) | **VALID** |
| **KP-4** | `dorsal_apex` | Batas dorsal kedalaman maksimum tubuh (komponen $BD$) | **VALID** |
| **KP-5** | `ventral_apex` | Batas ventral kedalaman maksimum tubuh (komponen $BD$) | **VALID** |

### Penegasan Integritas Visi Komputer:
Estimasi panjang ikan tidak boleh diturunkan semata-mata dari lebar bounding box 2D ($W_{bbox}$). Variasi posisi sirip ekor, kurvatur tubuh lentur saat lemas di atas nampan, dan rotasi mikro dapat menghasilkan kesalahan estimasi panjang hingga $>8\%$. Penghitungan jarak Euclidean antar-keypoint ($KP_0$ ke $KP_2$/$KP_3$) yang dinormalisasi dengan skala ArUco merupakan satu-satunya metode yang diizinkan untuk menghasilkan *ground truth* metrik yang dapat dipertanggungjawabkan secara ilmiah.
