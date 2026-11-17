import os
import shutil
import pandas as pd

out_dir = r'dataset_pipeline/reports/phase_11_7'
doc_dir = r'documentation'
os.makedirs(out_dir, exist_ok=True)
os.makedirs(doc_dir, exist_ok=True)

print("Starting generation of Phase 11.7 artifacts...")

# ==========================================
# 1. field_equipment_checklist.csv
# ==========================================
equip_file = os.path.join(out_dir, 'field_equipment_checklist.csv')
equip_rows = [
    {
        'item_id': 'EQ-01',
        'category': 'Alat Ukur & Kalibrasi',
        'item_name': 'Papan Ukur Perikanan (Ichthyometer)',
        'technical_specification': 'Akrilik bening 50 cm x 15 cm tebal 5 mm, skala milimeter laser engraved (presisi 0.1 cm), pembatas kepala (headboard) tegak 90 derajat',
        'quantity': 2,
        'criticality': 'CRITICAL',
        'status_verification': 'VERIFIED_AVAILABLE',
        'storage_location': 'Lab Basah SIK UPI Kampus Serang',
        'responsible_person': 'Ahmad Fajar',
        'notes': 'Alat utama penempatan spesimen dan pembacaan manual ground truth'
    },
    {
        'item_id': 'EQ-02',
        'category': 'Alat Ukur & Kalibrasi',
        'item_name': 'Marker Kalibrasi Optik ArUco',
        'technical_specification': 'Marker ArUco 50x50 mm (Dictionary DICT_4X4_50) dicetak resolusi 1200 dpi, laminasi doff matte anti-air dan anti-refleksi',
        'quantity': 4,
        'criticality': 'CRITICAL',
        'status_verification': 'VERIFIED_AVAILABLE',
        'storage_location': 'Kit Lapangan FishGuard',
        'responsible_person': 'Ahmad Fajar',
        'notes': 'Ditempatkan rata sejajar dengan bidang papan ukur untuk konversi otomatis pixel-to-millimeter'
    },
    {
        'item_id': 'EQ-03',
        'category': 'Alat Ukur & Kalibrasi',
        'item_name': 'Mistar Logam Presisi Stainless Steel',
        'technical_specification': 'Mistar baja stainless 300 mm, toleransi DIN 866/II, gradasi 0.5 mm dan 1.0 mm terukir',
        'quantity': 2,
        'criticality': 'HIGH',
        'status_verification': 'VERIFIED_AVAILABLE',
        'storage_location': 'Kit Lapangan FishGuard',
        'responsible_person': 'Dewi Lestari',
        'notes': 'Kalibrator sekunder untuk verifikasi skala fisik optik pada foto'
    },
    {
        'item_id': 'EQ-04',
        'category': 'Alat Ukur & Kalibrasi',
        'item_name': 'Kaliper Geser Digital (Vernier Caliper)',
        'technical_specification': 'Stainless steel digital caliper 0-150 mm, presisi 0.01 mm, layar LCD baterai CR2032',
        'quantity': 1,
        'criticality': 'HIGH',
        'status_verification': 'VERIFIED_AVAILABLE',
        'storage_location': 'Lab Basah SIK UPI Kampus Serang',
        'responsible_person': 'M. Rizki, M.Si',
        'notes': 'Untuk verifikasi kedalaman tubuh (body depth) dan diameter mata'
    },
    {
        'item_id': 'EQ-05',
        'category': 'Alat Ukur & Kalibrasi',
        'item_name': 'Timbangan Digital Lapangan',
        'technical_specification': 'Kapasitas 0-3000 g, presisi 0.1 g, platform stainless steel, fungsi Tare/Zero, proteksi percikan air',
        'quantity': 1,
        'criticality': 'HIGH',
        'status_verification': 'VERIFIED_AVAILABLE',
        'storage_location': 'Lab Basah SIK UPI Kampus Serang',
        'responsible_person': 'Dewi Lestari',
        'notes': 'Pencatatan bobot basah spesimen utuh'
    },
    {
        'item_id': 'EQ-06',
        'category': 'Kamera & Optik',
        'item_name': 'Kamera Utama Mirrorless',
        'technical_specification': 'Sensor APS-C 24.2 MP (Sony Alpha 6400 / ekuivalen), shutter mekanik, format RAW + JPEG Fine, output resolusi 6000x4000',
        'quantity': 1,
        'criticality': 'CRITICAL',
        'status_verification': 'VERIFIED_AVAILABLE',
        'storage_location': 'Lab Komputasi Kelautan SIK',
        'responsible_person': 'Ahmad Fajar',
        'notes': 'Pengambilan citra dataset resolusi tinggi bebas distorsi lensa'
    },
    {
        'item_id': 'EQ-07',
        'category': 'Kamera & Optik',
        'item_name': 'Lensa Prime 35mm f/1.8',
        'technical_specification': 'Ekuivalen 52.5 mm full-frame, distorsi geometrik <0.5%, autofokus cepat dan akurat',
        'quantity': 1,
        'criticality': 'CRITICAL',
        'status_verification': 'VERIFIED_AVAILABLE',
        'storage_location': 'Lab Komputasi Kelautan SIK',
        'responsible_person': 'Ahmad Fajar',
        'notes': 'Lensa standar sudut pandang normal manusia untuk mencegah distorsi perspektif'
    },
    {
        'item_id': 'EQ-08',
        'category': 'Kamera & Optik',
        'item_name': 'Tripod Rig Kamera Kokoh + Horizontal Extension Arm',
        'technical_specification': 'Aluminium alloy tripod load capacity 8 kg, boom arm 90 derajat horizontal, tinggi operasional 150 cm',
        'quantity': 1,
        'criticality': 'CRITICAL',
        'status_verification': 'VERIFIED_AVAILABLE',
        'storage_location': 'Lab Komputasi Kelautan SIK',
        'responsible_person': 'Ahmad Fajar',
        'notes': 'Menyangga kamera persis di atas papan ukur dengan orientasi 90 derajat top-down'
    },
    {
        'item_id': 'EQ-09',
        'category': 'Kamera & Optik',
        'item_name': 'Waterpas Bundar (Circular Bubble Level)',
        'technical_specification': 'Mini circular bubble level diameter 32 mm, akurasi leveling +/- 0.5 derajat',
        'quantity': 2,
        'criticality': 'CRITICAL',
        'status_verification': 'VERIFIED_AVAILABLE',
        'storage_location': 'Kit Lapangan FishGuard',
        'responsible_person': 'Ahmad Fajar',
        'notes': 'Dipasang pada hot-shoe kamera dan di papan ukur untuk menjamin bidang sensor sejajar sempurna'
    },
    {
        'item_id': 'EQ-10',
        'category': 'Kamera & Optik',
        'item_name': 'Lampu Panel LED Portable + Softbox Diffuser',
        'technical_specification': 'Panel LED bi-color 5500K daylight, CRI >95, baterai NP-F970 rechargeable, diffuser matte silikon',
        'quantity': 2,
        'criticality': 'HIGH',
        'status_verification': 'VERIFIED_AVAILABLE',
        'storage_location': 'Lab Komputasi Kelautan SIK',
        'responsible_person': 'Dewi Lestari',
        'notes': 'Menghilangkan bayangan tajam operator dan meminimalkan pantulan basah pada tubuh ikan'
    },
    {
        'item_id': 'EQ-11',
        'category': 'Kamera & Optik',
        'item_name': 'Kartu Memori SDXC UHS-I 128 GB',
        'technical_specification': 'Speed Class 10, U3, V30, read speed 150 MB/s, write speed 70 MB/s, water/shock proof',
        'quantity': 2,
        'criticality': 'CRITICAL',
        'status_verification': 'VERIFIED_AVAILABLE',
        'storage_location': 'Lab Komputasi Kelautan SIK',
        'responsible_person': 'Ahmad Fajar',
        'notes': 'Kapasitas cukup untuk 2000+ foto RAW+JPEG'
    },
    {
        'item_id': 'EQ-12',
        'category': 'Kamera & Optik',
        'item_name': 'Baterai Cadangan Kamera NP-FW50',
        'technical_specification': 'Lithium-ion 1020 mAh rechargeable original / certified third-party',
        'quantity': 3,
        'criticality': 'CRITICAL',
        'status_verification': 'VERIFIED_AVAILABLE',
        'storage_location': 'Lab Komputasi Kelautan SIK',
        'responsible_person': 'Ahmad Fajar',
        'notes': 'Mendukung operasi sampling kontinu 4-5 jam tanpa henti'
    },
    {
        'item_id': 'EQ-13',
        'category': 'Sanitasi & Penanganan Spesimen',
        'item_name': 'Sarung Tangan Nitril Bebas Serbuk',
        'technical_specification': 'Nitrile powder-free examination gloves, ketebalan 4 mil, ukuran M & L',
        'quantity': 100,
        'criticality': 'HIGH',
        'status_verification': 'VERIFIED_AVAILABLE',
        'storage_location': 'Lab Basah SIK UPI Kampus Serang',
        'responsible_person': 'Dewi Lestari',
        'notes': 'Melindungi tangan operator dari duri sirip dan mencegah transfer bakteri antar spesimen'
    },
    {
        'item_id': 'EQ-14',
        'category': 'Sanitasi & Penanganan Spesimen',
        'item_name': 'Kain Lap Microfiber Halus',
        'technical_specification': 'Microfiber 300 GSM non-abrasive, daya serap tinggi',
        'quantity': 6,
        'criticality': 'HIGH',
        'status_verification': 'VERIFIED_AVAILABLE',
        'storage_location': 'Kit Lapangan FishGuard',
        'responsible_person': 'Dewi Lestari',
        'notes': 'Menyerap lendir berlebih dan lelehan es pada tubuh ikan sebelum difoto untuk cegah glare'
    },
    {
        'item_id': 'EQ-15',
        'category': 'Sanitasi & Penanganan Spesimen',
        'item_name': 'Coolbox Lapangan 15 Liter + Ice Gel Pack',
        'technical_specification': 'Insulasi busa poliuretan rapat, kapasitas 15L, 4 pack ice gel beku suhu 0 s.d. 4 derajat C',
        'quantity': 1,
        'criticality': 'HIGH',
        'status_verification': 'VERIFIED_AVAILABLE',
        'storage_location': 'Lab Basah SIK UPI Kampus Serang',
        'responsible_person': 'M. Rizki, M.Si',
        'notes': 'Menyimpan spesimen voucher rujukan untuk verifikasi laboratorium lanjutan'
    },
    {
        'item_id': 'EQ-16',
        'category': 'Pencatatan & Identifikasi',
        'item_name': 'Kertas Label Tahan Air (Waterproof Tags)',
        'technical_specification': 'Kertas sintetis tahan air (polyart/tyvek), pre-cut label dengan kolom Specimen ID',
        'quantity': 500,
        'criticality': 'CRITICAL',
        'status_verification': 'VERIFIED_AVAILABLE',
        'storage_location': 'Kit Lapangan FishGuard',
        'responsible_person': 'Ahmad Fajar',
        'notes': 'Ditempatkan di samping ikan saat pemotretan sebagai redundansi identitas optik'
    },
    {
        'item_id': 'EQ-17',
        'category': 'Pencatatan & Identifikasi',
        'item_name': 'Spidol Permanen Fine Tip Tahan Air',
        'technical_specification': 'Marker permanen tinta hitam tahan air, cepat kering, ketebalan garis 0.5 mm & 1.0 mm',
        'quantity': 4,
        'criticality': 'HIGH',
        'status_verification': 'VERIFIED_AVAILABLE',
        'storage_location': 'Kit Lapangan FishGuard',
        'responsible_person': 'Ahmad Fajar',
        'notes': 'Penulisan ID spesimen pada label fisik dan lembar data'
    },
    {
        'item_id': 'EQ-18',
        'category': 'Administrasi & K3',
        'item_name': 'Surat Izin Penelitian & Koordinasi Pelabuhan',
        'technical_specification': 'Dokumen cetak bertandatangan Ketua Prodi SIK UPI Kampus Serang + Surat Tembusan PPN Karangantu',
        'quantity': 2,
        'criticality': 'CRITICAL',
        'status_verification': 'VERIFIED_AVAILABLE',
        'storage_location': 'Map Dokumen Lapangan',
        'responsible_person': 'M. Rizki, M.Si',
        'notes': 'Legalitas formal kegiatan riset di wilayah kerja pelabuhan perikanan nusantara'
    },
    {
        'item_id': 'EQ-19',
        'category': 'Administrasi & K3',
        'item_name': 'Kotak Pertolongan Pertama (First Aid Kit)',
        'technical_specification': 'Antiseptik povidone iodine, plester luka steril, kasa perban, pinset pembersih duri ikan, alkohol swab',
        'quantity': 1,
        'criticality': 'HIGH',
        'status_verification': 'VERIFIED_AVAILABLE',
        'storage_location': 'Kit Lapangan FishGuard',
        'responsible_person': 'Dewi Lestari',
        'notes': 'Penanganan darurat bila terkena tusukan duri sirip ikan layang/kuniran atau terpeleset'
    },
    {
        'item_id': 'EQ-20',
        'category': 'Komputasi & Backup',
        'item_name': 'Laptop Lapangan Rugged + Card Reader',
        'criticality': 'HIGH',
        'item_name': 'Laptop QC Lapangan',
        'technical_specification': 'Laptop Intel Core i5/i7, layar IPS anti-glare, card reader USB 3.0, penyimpanan SSD',
        'quantity': 1,
        'status_verification': 'VERIFIED_AVAILABLE',
        'storage_location': 'Lab Komputasi Kelautan SIK',
        'responsible_person': 'Ahmad Fajar',
        'notes': 'Triage cepat citra (inspeksi fokus/glare) dan backup data sekunder on-site'
    }
]

df_equip = pd.DataFrame(equip_rows)
df_equip.to_csv(equip_file, index=False)
print(f"Generated {equip_file} with {len(df_equip)} items.")

# ==========================================
# 2. sampling_schedule_template.csv
# ==========================================
sched_file = os.path.join(out_dir, 'sampling_schedule_template.csv')
sched_rows = [
    {
        'sampling_phase': 'PILOT_TEST',
        'session_id': 'SESS-PILOT-01',
        'scheduled_date': '2026-11-20',
        'time_window': '05:30 - 08:30 WIB',
        'target_species': 'Rastrelliger brachysoma, Selaroides leptolepis, Upeneus sulphureus',
        'target_class_id': '0, 1, 2',
        'quota_specimens': '15 ekor per kelas (Total 45 ekor unik)',
        'vessel_landing_focus': 'Bagan Tancap & Payang Pelagis',
        'dock_location': 'Dermaga TPI Karangantu Sektor Timur',
        'primary_collector': 'Ahmad Fajar & Dewi Lestari',
        'taxonomic_verifier': 'M. Rizki, M.Si (Ahli Taksonomi SIK)',
        'qc_operator': 'Ahmad Fajar (AI Engineer)',
        'milestone_deliverable': 'Validasi rig 90 derajat, kalibrasi ArUco, uji template metadata, verifikasi toleransi pengukuran ground truth'
    },
    {
        'sampling_phase': 'FULL_EXPEDITION',
        'session_id': 'SESS-EXP-01',
        'scheduled_date': '2026-11-23',
        'time_window': '05:30 - 09:00 WIB',
        'target_species': 'Rastrelliger brachysoma (Kembung Perempuan)',
        'target_class_id': '0',
        'quota_specimens': '50 ekor unik',
        'vessel_landing_focus': 'Bagan Tancap Nelayan Karangantu',
        'dock_location': 'TPI Karangantu Meja Sortir A',
        'primary_collector': 'Ahmad Fajar',
        'taxonomic_verifier': 'M. Rizki, M.Si',
        'qc_operator': 'Dewi Lestari',
        'milestone_deliverable': 'Pengumpulan Batch 1 Kelas 0, rentang ukuran TL 14-22 cm'
    },
    {
        'sampling_phase': 'FULL_EXPEDITION',
        'session_id': 'SESS-EXP-02',
        'scheduled_date': '2026-11-24',
        'time_window': '05:30 - 09:00 WIB',
        'target_species': 'Selaroides leptolepis (Selar Kuning)',
        'target_class_id': '1',
        'quota_specimens': '50 ekor unik',
        'vessel_landing_focus': 'Kapal Motor Payang Pelagis',
        'dock_location': 'TPI Karangantu Meja Sortir B',
        'primary_collector': 'Dewi Lestari',
        'taxonomic_verifier': 'M. Rizki, M.Si',
        'qc_operator': 'Ahmad Fajar',
        'milestone_deliverable': 'Pengumpulan Batch 1 Kelas 1, rentang ukuran TL 10-18 cm'
    },
    {
        'sampling_phase': 'FULL_EXPEDITION',
        'session_id': 'SESS-EXP-03',
        'scheduled_date': '2026-11-25',
        'time_window': '06:00 - 09:30 WIB',
        'target_species': 'Upeneus sulphureus (Kuniran)',
        'target_class_id': '2',
        'quota_specimens': '50 ekor unik',
        'vessel_landing_focus': 'Jaring Arad & Trammel Net Demersal',
        'dock_location': 'TPI Karangantu Meja Sortir C',
        'primary_collector': 'Ahmad Fajar',
        'taxonomic_verifier': 'M. Rizki, M.Si',
        'qc_operator': 'Dewi Lestari',
        'milestone_deliverable': 'Pengumpulan Batch 1 Kelas 2, rentang ukuran TL 10-17 cm'
    },
    {
        'sampling_phase': 'FULL_EXPEDITION',
        'session_id': 'SESS-EXP-04',
        'scheduled_date': '2026-11-27',
        'time_window': '05:30 - 09:00 WIB',
        'target_species': 'Rastrelliger brachysoma, Selaroides leptolepis',
        'target_class_id': '0, 1',
        'quota_specimens': '50 ekor R. brachysoma + 50 ekor S. leptolepis',
        'vessel_landing_focus': 'Bagan Tancap & Mini Purse Seine',
        'dock_location': 'TPI Karangantu Meja Sortir A & B',
        'primary_collector': 'Dewi Lestari',
        'taxonomic_verifier': 'M. Rizki, M.Si',
        'qc_operator': 'Ahmad Fajar',
        'milestone_deliverable': 'Pengumpulan Batch 2 Kelas 0 & 1, pemenuhan kuota 100 ekor'
    },
    {
        'sampling_phase': 'FULL_EXPEDITION',
        'session_id': 'SESS-EXP-05',
        'scheduled_date': '2026-11-28',
        'time_window': '06:00 - 09:30 WIB',
        'target_species': 'Upeneus sulphureus, Rastrelliger brachysoma, Selaroides leptolepis',
        'target_class_id': '0, 1, 2',
        'quota_specimens': '100 ekor U. sulphureus + sisa target pemenuhan kuota',
        'vessel_landing_focus': 'Campuran Payang, Arad, dan Bagan',
        'dock_location': 'TPI Karangantu Meja Sortir A, B, C',
        'primary_collector': 'Ahmad Fajar & Dewi Lestari',
        'taxonomic_verifier': 'M. Rizki, M.Si',
        'qc_operator': 'Ahmad Fajar',
        'milestone_deliverable': 'Finalisasi kuota total 150 spesimen unik per kelas (Total 450 spesimen teranotasi)'
    }
]

df_sched = pd.DataFrame(sched_rows)
df_sched.to_csv(sched_file, index=False)
print(f"Generated {sched_file} with {len(df_sched)} sessions.")

print("CSV artifacts generated successfully.")