# PHASE 12 — YOLO ANNOTATION GUIDELINES
**Standar Operasional Prosedur (SOP) Anotasi Bounding Box Multi-Spesies Ikan**

---

## 1. Definisi Kelas Objek & ID Terkunci
Sesuai batasan ilmiah proyek, hanya ada 3 kelas target:
- `0`: *Rastrelliger brachysoma* (Kembung Perempuan)
- `1`: *Selaroides leptolepis* (Selar Kuning)
- `2`: *Upeneus sulphureus* (Kuniran)

Spesies lain yang tidak termasuk dalam ketiga kelas ini **tidak dianotasi sebagai target**, atau dialokasikan khusus pada subset evaluasi Out-of-Distribution (OOD).

---

## 2. Aturan Pembatasan Bounding Box (Bounding Box Tightness)
1. **Ketepatan Tepi (*Tightness*):** Bounding box harus memuat seluruh tubuh ikan secara pas (*tight*), mulai dari ujung moncong anterior hingga ujung sirip ekor posterior terluar, serta dari tepi punggung (sirip dorsal yang terbentang) hingga tepi perut/sirip dubur.
2. **Margin Kosong:** Tidak boleh menyisakan ruang latar belakang lebih dari $5\%$ di sekeliling ikan.
3. **Orientasi:** Bounding box berorientasi axis-aligned horizontal/vertikal $[x_{min}, y_{min}, x_{max}, y_{max}]$ yang dinormalisasi ke $[x_c, y_c, w, h]$.

---

## 3. Penanganan Oklusi dan Ikan Bertumpuk (*Occlusion Rules*)
1. **Oklusi Ringan hingga Sedang ($< 50\%$ tertutup):** Ikan tetap dianotasi dengan bounding box yang memperkirakan batas fisik tubuh penuh atau bagian yang tampak nyata.
2. **Oklusi Berat ($50\% - 80\%$ tertutup):** Dianotasi hanya jika karakter diagnostik kunci (misal kepala + operkulum atau sirip ekor + scute) masih terlihat jelas untuk verifikasi taksonomi.
3. **Oklusi Ekstrem ($> 80\%$ tertutup):** **JANGAN DIANOTASI**. Memasukkan ikan yang hampir seluruhnya tertutup akan membingungkan loss function detektor.
4. **Ikan Terpotong di Tepi Frame (*Truncated Fish*):**
   - Jika bagian tubuh yang tampak $\ge 60\%$: anotasi hingga tepi frame.
   - Jika bagian tubuh yang tampak $< 60\%$: jangan dianotasi.

---

## 4. Eksperimen Keputusan Keypoint vs Box-based (Issue A5)
- Pada Phase 14, dilakukan pengujian komparatif antara metode bounding-box long axis vs skeleton/keypoint snout-to-fork pada 30 citra uji per kelas.
- Jika error bounding box memenuhi kriteria validasi ($\text{MAPE} \le 5\%$), anotasi keypoint tidak diwajibkan untuk menghemat biaya kurasi data.
