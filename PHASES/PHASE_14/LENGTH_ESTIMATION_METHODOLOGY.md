# PHASE 14 — LENGTH ESTIMATION & CATCH ANALYSIS METHODOLOGY
**Metodologi Estimasi Panjang 2D, Analisis Ketidakpastian, dan Batasan Ilmiah**

---

## 1. Analisis Kelayakan 2D Planar (*Feasibility Analysis*)
Estimasi panjang fisik dari citra 2D tegak lurus memiliki keterbatasan fisik mendasar yang harus dideklarasikan secara jujur:
1. **Asumsi Planar:** Objek dianggap terletak datar pada bidang referensi $Z = 0$.
2. **Kelengkungan Tubuh (*Body Curvature*):** Ikan yang mati atau mengalami rigor mortis sering kali melengkung. Jarak garis lurus Euclidean antara moncong dan ekor meremehkan (*underestimate*) panjang aktual ikan hingga $3–8\%$.
3. **Ketebalan Tubuh & Paralaks:** Ikan bertubuh tinggi/tebal memiliki bagian atas tubuh yang lebih dekat ke lensa kamera, sehingga mengalami pembesaran optik relatif terhadap marker di dasar meja.
4. **Sudut Kemiringan (*Tilt*):** Jika kepala bersandar pada balok ukur sedangkan ekor terangkat atau menjuntai, proyeksi ortogonal memendek sebesar $\cos(\theta)$.

---

## 2. Kandidat Metode Estimasi Panjang
1. **Metode A — Calibrated Bounding Box Long-Axis:**
   Menggunakan dimensi terpanjang dari bounding box objek terdeteksi dikalikan skala optik:
   $$TL_{\text{est}} = \max(W_{\text{px}}, H_{\text{px}}) \times S_{\text{mm/px}}$$
   *Kelemahan:* Sangat sensitif terhadap rotasi ikan yang miring terhadap sumbu koordinat.
2. **Metode B — Minimum Area Oriented Bounding Box (cv2.minAreaRect):**
   Mencari kotak pembatas berorientasi bebas yang memeluk kontur ikan dengan rotasi $\theta$:
   $$TL_{\text{est}} = \max(\text{dim}_1, \text{dim}_2) \times S_{\text{mm/px}}$$
   *Kelebihan:* Mengatasi rotasi bebas ikan di atas meja sortir.
3. **Metode C — Contour Morphological Skeleton / Medial Axis:**
   Mengekstrak garis tengah tubuh dari moncong hingga ekor mengikuti kelengkungan tubuh ikan.
   *Kelebihan:* Mengatasi kelengkungan tubuh (*curvature*).
4. **Metode D — Keypoint Snout-to-Fork Distance:**
   Deteksi titik moncong anterior dan titik tengah lekukan sirip ekor (*caudal fork*).

---

## 3. Ambang Batas Klasifikasi Status Validasi Panjang (Pre-registered)
Sistem FishGuard AI mengikat status fitur estimasi panjang pada banner aplikasi:
- **`VALIDATED`**: Mean Absolute Percentage Error (MAPE) $\le 5,0\%$ terhadap ground truth manual jangka sorong pada independent test set.
- **`LIMITED`**: MAPE berada di antara $5,0\% - 10,0\%$. Aplikasi menampilkan estimasi panjang disertai rentang galat ketidakpastian ($\pm \text{SD}$).
- **`EXPERIMENTAL`**: MAPE $> 10,0\%$ atau data uji spesimen biologis belum mencukupi. Aplikasi secara tegas melabeli hasil sebagai estimasi indikatif non-validasi.
