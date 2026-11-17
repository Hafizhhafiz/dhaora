# ASIK V MASTER CONTEXT — FISHGUARD AI
**Platform Kecerdasan Artifisial Pemantauan & Pencatatan Hasil Tangkapan Perikanan Skala Kecil**  
**Program Studi Sistem Informasi Kelautan — Universitas Pendidikan Indonesia (UPI) Kampus Serang**

---

## 1. Identitas Proyek & Kompetisi
- **Nama Proyek:** FishGuard AI
- **Kompetisi:** ASIK V (Ajang Kompetisi Sistem Informasi Kelautan) — Kategori Inovasi Sistem & AI Kelautan
- **Institusi Penyelenggara:** Program Studi Sistem Informasi Kelautan, Kampus UPI di Serang
- **Lokasi Referensi Operasional:** Pelabuhan Perikanan Nusantara (PPN) Karangantu, Teluk Banten, Kota Serang, Banten, Indonesia (Geospasial: Lat -6.029°, Long 106.161°).
- **Subjek Analisis:** Hasil tangkapan armada perikanan skala kecil (*small-scale fisheries*) dengan armada kapal motor < 10 GT dan alat tangkap jaring insang hanyut (*drift gillnet*), payang, dan pukat cincin mini (*mini purse seine*).

---

## 2. Ruang Lingkup Taksonomi Terkunci (Fixed Scientific Scope)
Sistem FishGuard AI mengunci tiga spesies target pendaratan dominan di PPN Karangantu berdasarkan rekonsiliasi data pendaratan PIPP KKP:

| Class ID | Nama Ilmiah Valid | Nama Lokal / Pasar | Famili | Ciri Kunci Morfologis Diagnostik |
|:---:|:---|:---|:---|:---|
| **0** | *Rastrelliger brachysoma* (Bleeker, 1851) | Kembung Perempuan | Scombridae | Tubuh tinggi membulat ($TL/BD < 3.0$), moncong tumpul membulat, bintik gelap punggung. |
| **1** | *Selaroides leptolepis* (Cuvier, 1833) | Selar Kuning | Carangidae | Pita emas lebar membujur dari batas atas mata ke pangkal ekor, bercak hitam jelas pada operkulum. |
| **2** | *Upeneus sulphureus* Cuvier, 1829 | Kuniran / Kambing-Laut | Mullidae | Sepasang sungut dagu putih/pucat, sirip ekor polos tanpa garis belang gelap, 2 pita kuning lateral (Uiblein et al., 2025). |

### Aturan Batasan Taksonomi:
1. Tidak diperkenankan melakukan substitusi label (*label drift*) dengan spesies mirip (misal mengganti *R. brachysoma* dengan *R. kanagurta*, atau *S. leptolepis* dengan *Decapterus macarellus*).
2. Spesies non-target atau spesimen serupa (*look-alike*) hanya dialokasikan untuk subset evaluasi Out-of-Distribution (OOD).
3. Setiap spesimen wajib memiliki catatan verifikasi identitas taksonomi ilmiah dan bukti visual.

---

## 3. Enam Pilar Fungsional Sistem
1. **Identifikasi Spesies:** Klasifikasi otomatis 3 kelas target MVP menggunakan arsitektur deep learning Computer Vision.
2. **Pencacahan Individu (*Fish Counting*):** Deteksi multi-ikan pada citra statis pendaratan (meja sortir, krat ikan, hamparan es) dengan pelaporan Mean Absolute Error (MAE).
3. **Analisis Komposisi Tangkapan (*Catch Composition*):** Menghitung persentase proporsi biomassa dan kelimpahan numerik tiap spesies dari total tangkapan per sesi.
4. **Estimasi Panjang Fisik (*Length Estimation*):** Integrasi optik kalibrasi metrik 2D berbasis penanda referensi. Berstatus **`EXPERIMENTAL / CONDITIONAL`** hingga lolos uji validasi ground truth manual.
5. **Aplikasi Terintegrasi (Backend + Frontend):** Antarmuka web modern reaktif (React Vite + Tailwind) dan API berkinerja tinggi (FastAPI + SQLite).
6. **Integritas Ilmiah & Dukungan Riset:** Menjamin pelaporan transparan, tidak memalsukan data/hasil training, dan melacak seluruh rekam jejak audit (*audit trail*).

---

## 4. Sepuluh Kaidah Emas Integritas Riset (The Golden Rules)
1. **Never fabricate progress, datasets, results, citations, measurements, sample sizes or completed field work.**
2. **Never assume hardware exists or that field sampling happened. Check evidence.**
3. **Never claim a model is validated without test-set evidence; never claim length accuracy without ground-truth comparison.**
4. **A passing software test is not scientific validation.**
5. **Never replace working architecture without a verified reason and approval.**
6. **Never delete, overwrite or restructure existing files before understanding their purpose. Work non-destructively (copy, add, version).**
7. **Never go beyond Phase 17. There is no Phase 18+.**
8. **Never skip mandatory acceptance criteria.**
9. **Missing evidence → mark UNVERIFIED or BLOCKED and state exactly what is needed.**
10. **Do not declare completion based on generated documentation alone.**

---

## 5. Ringkasan Peta Jalan (Master Roadmap Phase 11.7.3 → Phase 17)
- **Phase 11.7.3:** Laboratory Physical Rig Validation (STARTING POINT)
- **Phase 11.7.4:** Controlled Specimen Pilot
- **Phase 11.7.5:** Pilot Data Integrity Audit
- **Phase 11.8:** Field Sampling Execution (Entry gate: written permissions, verified rig & pilot)
- **Phase 12:** Dataset Construction & YOLO Preparation (Provenance, splits by specimen/session, OOD set)
- **Phase 13:** YOLO Baseline Training & Evaluation (Pre-registered targets, independent test set)
- **Phase 14:** Length Estimation & Catch Analysis (Bland-Altman, MAPE, status classification)
- **Phase 15:** Backend & Dashboard Integration (FastAPI + React, OpenAPI contract)
- **Phase 16:** System Testing & Validation (12 test categories, human evaluation session)
- **Phase 17:** Prototype Completion (15 final deliverables, research report, project freeze)
