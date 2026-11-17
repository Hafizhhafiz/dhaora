# PHASE 11.7.3 — DEFECTS & RISK REGISTER
**Pencatatan Defek Perangkat, Analisis Risiko Optik, dan Rencana Kontinjensi**

| Defect / Risk ID | Deskripsi Masalah | Dampak Terhadap Pengukuran | Mitigasi / Prosedur Korektif | Status |
|---|---|---|---|:---:|
| **DEF-1173-01** | Potensi getaran mikro (*micro-vibration*) saat menekan tombol shutter kamera mekanis. | Citra mengalami motion blur pada sirip dan tepi tubuh ikan. | Wajib menggunakan kabel remote shutter release, trigger timer 2 detik, atau aplikasi wireless tethering. | MITIGATED |
| **DEF-1173-02** | Pantulan silau (*specular glare*) pada lendir basah menutupi tepi kontur marker ArUco atau moncong ikan. | Deteksi sudut ArUco gagal atau estimasi panjang meleset hingga 5–10 mm. | Putar filter polarisator CPL pada lensa hingga silau padam; lap lendir berlebih dengan tisu steril sebelum pemotretan. | MITIGATED |
| **DEF-1173-03** | Pergeseran autofokus (*autofocus hunt/drift*) pada latar belakang gelap polos. | Citra menjadi tidak tajam (*out-of-focus*), menurunkan ketepatan sub-pixel corner ArUco. | Kunci kamera pada Manual Focus (MF) terkalibrasi pada awal sesi; gunakan aperture $f/8$ untuk DoF dalam. | MITIGATED |
| **DEF-1173-04** | Ketidaksempurnaan kelurusan waterpass ($> 0,5^\circ$ kemiringan). | Paralaks perspektif menyebabkan pembesaran asimetris antara sisi kiri dan kanan frame. | Periksa rasio aspek marker ($W/H \in [0,98, 1,02]$); jika di luar rentang, skrip menolak citra secara otomatis. | MITIGATED |
| **DEF-1173-05** | Perangkat keras fisik belum tersedia di lokasi operator saat ini. | Uji fisik aktual di laboratorium belum dapat ditandatangani. | Terapkan Blocked-Task Protocol: uji simulasi numerik dan sintesis tervalidasi; tandai gerbang fisik PENDING. | ACTIVE |
