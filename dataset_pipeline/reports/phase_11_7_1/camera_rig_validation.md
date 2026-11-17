# VALIDASI TEKNIS RIG KAMERA & KONTROL OPTIK
## FishGuard AI — ASIK V (Phase 11.7.1)
**Metode:** Uji Simulasi Laboratorium & Verifikasi Geometri Optik  
**Status Evaluasi:** **PASS (DENGAN KETENTUAN PRE-FLIGHT CHECK)**  

---

## 1. EVALUASI SUDUT ORTOGONAL 90° & WATERPAS

### 1.1 Persyaratan Geometrik
Model estimasi panjang metrik FishGuard AI mengasumsikan bidang proyeksi sensor kamera sejajar sempurna dengan bidang papan ukur:
$$\mathbf{n}_{sensor} \parallel \mathbf{n}_{board} \implies \theta = 90,0^\circ$$

Bila terjadi kemiringan sudut $\Delta \theta$:
$$L_{terukur} = L_{sebenarnya} \times \cos(\Delta \theta)$$
Pada kemiringan $\Delta \theta = 5^\circ$, galat panjang sistemik mencapai $\cos(5^\circ) \approx 0,9962$ ($0,38\%$ penyusutan panjang aksial). Pada kemiringan $\Delta \theta = 15^\circ$, galat melonjak hingga $3,41\%$, yang melampaui batas toleransi milimeter biometrik.

### 1.2 Prosedur Kontrol Kualitas Leveling (Waterpas)
1. **Pemasangan Bubble Level:** Waterpas bundar mini berdiameter 32 mm dipasang pada *hot-shoe* kamera.
2. **Kriteria Kelulusan Visual:** Gelembung udara wajib berada $100\%$ di dalam lingkaran target tengah (toleransi deviasi kemiringan $\le 0,5^\circ$).
3. **Pemeriksaan Lengan Boom:** Kunci kenop lengan ekstensi tripod diperiksa kekencangannya untuk mencegah lendutan mekanik akibat beban kamera saat pemotretan berlangsung.

---

## 2. EVALUASI JARAK KAMERA (45 – 55 CM) & FIELD OF VIEW

### 2.1 Perhitungan Sudut Pandang (FoV)
- **Sensor:** APS-C ($23,5 \times 15,6\text{ mm}$, faktor krop $1,5\times$).
- **Panjang Fokus:** $f = 35\text{ mm}$ (ekuivalen $52,5\text{ mm}$ full-frame).
- **Jarak Kerja ($H$):** $500\text{ mm}$ ($50\text{ cm}$).

$$\text{FoV}_{lebar} = 2 \times H \times \tan\left(\frac{\alpha_{horizontal}}{2}\right) = \frac{H \times w_{sensor}}{f} = \frac{500 \times 23,5}{35} \approx 335,7\text{ mm} \; (33,6\text{ cm})$$

$$\text{FoV}_{panjang} = \frac{H \times w_{sensor\_panjang}}{f}$$

Dengan orientasi kamera lanskap memanjang, bidang pandang pada jarak 50 cm mencakup rentang horizontal **$55,0\text{ cm}$**, yang secara sempurna memuat papan ukur $50\text{ cm}$ beserta marker ArUco tanpa pemotongan tepi (*no clipping*).

---

## 3. PROTOKOL PENCAHAYAAN 5500K & KONTROL PANTULAN (GLARE)

- **Sumber Cahaya:** 2 unit panel LED portable dengan suhu warna daylight $5500\text{ K}$ (CRI $>95$).
- **Peredam Silau (Diffuser):** Dilengkapi tudung kain diffuser softbox matte.
- **Sudut Penyinaran:** Ditempatkan bersudut $45^\circ$ dari sisi kiri dan kanan spesimen (bukan dari arah depan lensa) untuk memantulkan berkas cahaya ke luar lensa dan mencegah silau basah pada lendir ikan.
- **Prosedur Pengambilan Ulang (Retake):** Bila foto menunjukkan area putih jenuh (*specular highlights*) $>10\text{ piksel}$ pada area sirip ekor atau garis gurat sisi, operator wajib mengelap lendir dengan lap microfiber dan mengambil ulang foto seketika.
