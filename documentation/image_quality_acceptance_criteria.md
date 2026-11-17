# KRITERIA PENERIMAAN KUALITAS CITRA & AMBANG BATAS QC
## FishGuard AI — ASIK V (Phase 11.7.2)
**Tujuan:** Menstandarkan kriteria lolos (*USABLE*) vs ditolak (*DISCARDED*) pada triage citra lapangan  

---

## 1. MATRIKS STANDAR KUALITAS CITRA

Setiap foto yang diambil di atas meja sortir/papan ukur TPI Karangantu wajib diperiksa seketika (*on-site visual inspection*) sebelum ikan dikembalikan kepada pedagang:

| Parameter Kualitas | Kriteria Diterima (PASS / USABLE) | Kriteria Ditolak (FAIL / DISCARDED) | Tindakan Koreksi Lapangan |
|:---|:---|:---|:---|
| **Ketajaman & Fokus (Blur)** | Seluruh kontur tubuh, sisik, dan ujung sirip tajam; varians Laplacian $\ge 150,0$. | Citra kabur akibat getaran tangan atau gerakan ikan lemas; varians Laplacian $< 150,0$. | Kunci shutter speed $\ge 1/250\text{ s}$, pastikan subjek diam, dan foto ulang. |
| **Pantulan Cahaya (Glare)** | Bebas pantulan silau putih pada area anatomi penting (moncong, mata, gurat sisi, cuping ekor). | Terdapat bercak putih jenuh (*specular highlight* $255,255,255$) $> 10\text{ piksel}$ yang menutupi batas tubuh. | Usap lendir/air dengan kain lap microfiber secara lembut dan atur sudut diffuser $45^\circ$. |
| **Bayangan Gelap (Shadowing)** | Pencahayaan merata; bayangan tubuh ikan lembut dan tidak mengaburkan batas garis ventral/perut. | Bayangan operator atau bayangan pekat kamera menutupi batas kontur tubuh ikan ($> 20\%$ kontras hilang). | Geser posisi operator menjauhi arah sinar, gunakan reflektor putih di sisi berlawanan. |
| **Kelengkapan Anatomi (Clipping)** | $100\%$ tubuh ikan terlihat utuh dalam bingkai; moncong dan kedua cuping ekor berjarak $\ge 2\text{ cm}$ dari tepi frame. | Ujung moncong atau ujung cuping sirip ekor terpotong batas bingkai (*clipped*). | Posisikan ulang ikan tepat di tengah papan ukur dan periksa jarak kamera $H=90\text{ cm}$. |
| **Kondisi Fisik Sirip Ekor** | Sirip ekor dibentangkan alami (*natural spread*); jari-jari sirip utuh tidak robek parah. | Sirip ekor terlipat kaku $> 50\%$ atau cuping ekor patah/rusak parah akibat benturan es. | Rentangkan sirip dengan ujung jari basah; jika rusak permanen, beri status `DAMAGED_SPECIMEN`. |
| **Keterbacaan Kalibrator** | Marker ArUco 50 mm dan angka garis mistar ukur (0.1 cm) terbaca jelas dan tajam. | Marker ArUco tertutup tetesan air/lendir atau angka mistar buram tidak terbaca. | Bersihkan permukaan akrilik dengan kain lap microfiber dan foto ulang. |

---

## 2. KODE STATUS TRIAGE LAPANGAN

Setiap berkas foto diberi salah satu kode triage resmi pada template metadata:
1. **`USABLE`:** Memenuhi seluruh parameter di atas. Layak masuk pipeline anotasi ground truth visi komputer.
2. **`DISCARDED_BLUR`:** Ditolak karena gambar buram/goyang. Foto diulang di tempat.
3. **`DISCARDED_GLARE`:** Ditolak karena pantulan silau berlebih. Dilap dan diulang di tempat.
4. **`DISCARDED_CLIPPED`:** Ditolak karena bagian tubuh ikan terpotong tepi bingkai.
5. **`DAMAGED_SPECIMEN`:** Spesimen cacat/patah fisik alami pendaratan. Tidak digunakan untuk data latih estimasi panjang.
6. **`UNCERTAIN_TAXONOMY`:** Ciri morfologi meragukan/atipikal. Disimpan di coolbox untuk pemeriksaan laboratorium kampus.
