# PHASE 11.7.3 → PHASE 11.7.4 HANDOVER PROTOCOL
**Protokol Pengalihan Fase dan Prasyarat Memulai Phase 11.7.4 (Controlled Specimen Pilot)**

---

## 1. Prasyarat Masuk (*Entry Conditions*) untuk Phase 11.7.4
Sebelum pengumpulan data spesimen pilot (10–15 ekor per spesies) dimulai di laboratorium:
- [x] Geometri optik rig terverifikasi ($H = 90\text{ cm}$, FoV $\ge 60\text{ cm}$).
- [x] Skrip kalibrasi optik OpenCV `tools/calibrate_scale.py` berfungsi normal.
- [x] Format metadata sidecar JSON dan penamaan file terdefinisi baku.
- [ ] Bodi kamera dan lensa fisik dipasang di rig dan lolos cek waterpass tegak lurus ($< 0,5^\circ$).
- [ ] Akses terhadap spesimen biologis segar (ikan kembung perempuan, selar kuning, kuniran) telah disetujui secara etik dan logistik.
- [ ] Ahli taksonomi / kunci identifikasi morfologis telah siap di laboratorium untuk memverifikasi spesies per individu spesimen.
- [ ] Persetujuan resmi operator manusia (*Human Approval [AG]*) untuk gerbang Phase 11.7.3 telah diberikan.

---

## 2. Instruksi Pekerjaan Paralel Sementara Menunggu Spesimen Fisik
Sesuai Section 9 dari Master Execution Prompt:
"While waiting for human or physical steps you may work on: annotation guidelines and tooling, dataset schemas and validation scripts, the GBIF re-audit, backend/API scaffolding, test-case writing, documentation."

Tim dapat melanjutkan pekerjaan paralel:
1. Penyusunan detail rencana Phase 11.7.4 (`PILOT_PROTOCOL.md` dan template manual measurements).
2. Penyusunan pedoman anotasi lanjutan Phase 12 (`ANNOTATION_GUIDELINES.md`).
3. Penyusunan kerangka pengujian sistem Phase 16 (`TEST_CASES.md`).
