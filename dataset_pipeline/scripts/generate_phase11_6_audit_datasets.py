import os
import pandas as pd
import numpy as np

WORKSPACE_ROOT = r"c:\TUGAS-TUGAS KULIAH\SEMESTER 5\ASIK VOL VI"
PIPELINE_ROOT = os.path.join(WORKSPACE_ROOT, "dataset_pipeline")
REPORTS_11_6_DIR = os.path.join(PIPELINE_ROOT, "reports", "phase_11_6")
METADATA_DIR = os.path.join(PIPELINE_ROOT, "metadata")

os.makedirs(REPORTS_11_6_DIR, exist_ok=True)

# ==============================================================================
# 1. PIPP RECONCILIATION CSV
# ==============================================================================
pipp_data = [
    {
        "commodity_name": "Kembung perempuan",
        "scientific_name": "Rastrelliger brachysoma",
        "table_production_kg": 33305,
        "chart_production_kg": 471090,
        "ratio_chart_to_table": round(471090 / 33305, 2),
        "reported_period_table": "2026 (Tabel pendaratan tercatat)",
        "reported_period_chart": "2026 (Grafik dashboard jenis ikan)",
        "unit": "Kilogram (kg)",
        "data_source_provenance": "PIPP KKP - PPN Karangantu (User Prompt Observation)",
        "reconciliation_status": "UNRESOLVED",
        "evidence_backed_explanation": "Perbedaan faktor ~14.1x antara tabel (33,3 ton) dan grafik (471,1 ton). Tidak ditemukan berkas tangkapan layar mentah atau log ekspor PIPP lokal di workspace untuk memverifikasi rentang tanggal (misal kumulatif tahunan vs bulanan/triwulanan) atau cakupan wilayah (misal WPP 712 vs dermaga lokal PPN). Berdasarkan aturan integritas ilmiah, status ditetapkan UNRESOLVED."
    },
    {
        "commodity_name": "Teri",
        "scientific_name": "Stolephorus commersonii",
        "table_production_kg": 17418,
        "chart_production_kg": 408635,
        "ratio_chart_to_table": round(408635 / 17418, 2),
        "reported_period_table": "2026 (Tabel pendaratan tercatat)",
        "reported_period_chart": "2026 (Grafik dashboard jenis ikan)",
        "unit": "Kilogram (kg)",
        "data_source_provenance": "PIPP KKP - PPN Karangantu (User Prompt Observation)",
        "reconciliation_status": "UNRESOLVED",
        "evidence_backed_explanation": "Perbedaan faktor ~23.5x antara tabel (17,4 ton) dan grafik (408,6 ton). Terdapat pula kategori Teri lain (Encrasicholina devisi: 3.868 kg). Tidak ada bukti arsip lokal yang menjelaskan apakah grafik mengakumulasi seluruh famili Engraulidae atau mencakup periode multi-bulan. Status ditetapkan UNRESOLVED."
    },
    {
        "commodity_name": "Peperek",
        "scientific_name": "Leiognathus leuciscus",
        "table_production_kg": 32238,
        "chart_production_kg": 303771,
        "ratio_chart_to_table": round(303771 / 32238, 2),
        "reported_period_table": "2026 (Tabel pendaratan tercatat)",
        "reported_period_chart": "2026 (Grafik dashboard jenis ikan)",
        "unit": "Kilogram (kg)",
        "data_source_provenance": "PIPP KKP - PPN Karangantu (User Prompt Observation)",
        "reconciliation_status": "UNRESOLVED",
        "evidence_backed_explanation": "Perbedaan faktor ~9.4x antara tabel L. leuciscus (32,2 ton) dan grafik (303,8 ton). Total 4 kategori peperek di tabel berjumlah 47.418 kg (rasio tetap ~6.4x terhadap grafik). Metadata tanggal awal/akhir grafik tidak tersedia di workspace. Status ditetapkan UNRESOLVED."
    }
]

# Add remaining 20 commodities from the 23 fish table
other_20_fish = [
    ("Kuniran", "Upeneus sulphureus", 23838),
    ("Selar kuning", "Selaroides leptolepis", 19902),
    ("Selanget", "Anodontostoma chacunda", 9855),
    ("Peperek lainnya", "Leiognathus spp", 8893),
    ("Peperek bondolan", "Leiognathus bindus", 5057),
    ("Tembang", "Sardinella brachysoma", 4866),
    ("Teri (devisi)", "Encrasicholina devisi", 3868),
    ("Beloso", "Saurida tumbil", 3609),
    ("Tongkol banyar", "Euthynnus affinis", 3145),
    ("Gulamah", "Otolithes ruber", 2608),
    ("Kurisi", "Nemipterus aurora", 1823),
    ("Pari kembang", "Dasyatis kuhlii", 1610),
    ("Selar komo", "Alepes djedaba", 1428),
    ("Kuwe", "Caranx sexfasciatus", 1387),
    ("Gulamah", "Pennahia argentata", 1359),
    ("Peperek", "Leiognathus berbis", 1230),
    ("Tongkol pisang-balaki", "Auxis thazard", 1209),
    ("Ikan sebelah", "Psettodes erumei", 1017),
    ("Tenggiri batang", "Scomberomorus lineolatus", 998),
    ("Kurisi", "Nemipterus nematophorus", 713)
]

for name, sc_name, prod in other_20_fish:
    pipp_data.append({
        "commodity_name": name,
        "scientific_name": sc_name,
        "table_production_kg": prod,
        "chart_production_kg": np.nan,
        "ratio_chart_to_table": np.nan,
        "reported_period_table": "2026 (Tabel pendaratan tercatat)",
        "reported_period_chart": "TIDAK TERTERA PADA CUPLIKAN",
        "unit": "Kilogram (kg)",
        "data_source_provenance": "PIPP KKP - PPN Karangantu (Tabel 23 Komoditas)",
        "reconciliation_status": "CHART_DATA_UNAVAILABLE",
        "evidence_backed_explanation": "Nilai grafik spesifik komoditas ini tidak tersedia dalam cuplikan dashboard pengguna. Nilai tabel diverifikasi tercatat sebesar " + str(prod) + " kg."
    })

df_pipp_rec = pd.DataFrame(pipp_data)
pipp_rec_path = os.path.join(REPORTS_11_6_DIR, "pipp_reconciliation.csv")
df_pipp_rec.to_csv(pipp_rec_path, index=False, encoding="utf-8")
print(f"Saved: {pipp_rec_path} ({len(df_pipp_rec)} rows)")


# ==============================================================================
# 2. TAXONOMIC REVALIDATION CSV
# ==============================================================================
tax_data = [
    {
        "local_name": "Kembung perempuan",
        "recorded_scientific_name": "Rastrelliger brachysoma",
        "valid_accepted_name": "Rastrelliger brachysoma (Bleeker, 1851)",
        "family": "Scombridae",
        "order": "Scombriformes",
        "aphia_id": 219717,
        "gbif_taxon_key": 2374319,
        "taxonomic_status": "ACCEPTED",
        "diagnostic_characters_summary": "Tubuh sangat tinggi (deep-bodied, compressed), SL/BD 2.3-2.7 (atau depth 28.5-32.7% of FL); gill rakers lower limb: 56-61 (Collette & Nauen 1983); moncong tumpul membulat; tanpa bintik hitam tajam di dada.",
        "differentiation_from_confusion_species": "Berbeda dari R. kanagurta yang bertubuh langsing (depth 20-24% of FL, SL/BD 3.4-4.0) dan memiliki gill rakers 30-46.",
        "ai_feature_caution": "Rasio bounding box W/H pada citra TIDAK SAMA dengan rasio morfometrik SL/BD karena bounding box dipengaruhi orientasi sirip, sudut pandang, dan pembengkokan tubuh.",
        "verification_source": "WoRMS / FishBase / Collette & Nauen (1983) FAO Scombrids Cat. p. 46",
        "audit_verdict": "ACCEPTED_TARGET_CLASS_0"
    },
    {
        "local_name": "Peperek",
        "recorded_scientific_name": "Leiognathus leuciscus",
        "valid_accepted_name": "Equulites leuciscus (Günther, 1860)",
        "family": "Leiognathidae",
        "order": "Acanthuriformes",
        "aphia_id": 445582,
        "gbif_taxon_key": 8225573,
        "taxonomic_status": "SYNONYM_RECLASSIFIED",
        "diagnostic_characters_summary": "Duri dorsal kedua memanjang seperti filamen/cambuk; mulut dapat disembulkan ke bawah (protractile); tubuh sangat pipih lateral keperakan.",
        "differentiation_from_confusion_species": "Dipisahkan dari genus Leiognathus sensu stricto berdasarkan revisi filogenetik Leiognathidae (Chakrabarty & Sparks 2008).",
        "ai_feature_caution": "Ukuran kecil (6-12 cm) dan lendir tinggi memicu glare basah pada pencahayaan langsung.",
        "verification_source": "WoRMS (AphiaID: 445582) / Chakrabarty & Sparks (2008)",
        "audit_verdict": "PROPOSED_AUXILIARY"
    },
    {
        "local_name": "Kuniran",
        "recorded_scientific_name": "Upeneus sulphureus",
        "valid_accepted_name": "Upeneus sulphureus Cuvier, 1829",
        "family": "Mullidae",
        "order": "Syngnathiformes",
        "aphia_id": 218671,
        "gbif_taxon_key": 2396734,
        "taxonomic_status": "ACCEPTED",
        "diagnostic_characters_summary": "Sepasang sungut dagu (hyoid barbels) putih-kuning; dua garis lateral kuning membujur; sirip ekor polos tanpa garis melintang gelap; ujung sirip dorsal bertotol hitam.",
        "differentiation_from_confusion_species": "Berbeda dari Upeneus vittatus dan U. tragula yang memiliki garis melintang gelap pada cuping sirip ekor.",
        "ai_feature_caution": "Sungut dagu dapat terlipat di bawah tenggorokan saat ikan mati; garis kuning lateral adalah fitur visual utama bagi CNN.",
        "verification_source": "WoRMS (AphiaID: 218671) / FishBase SpecCode: 4568",
        "audit_verdict": "ACCEPTED_TARGET_CLASS_2"
    },
    {
        "local_name": "Selar kuning",
        "recorded_scientific_name": "Selaroides leptolepis",
        "valid_accepted_name": "Selaroides leptolepis (Cuvier, 1833)",
        "family": "Carangidae",
        "order": "Carangiformes",
        "aphia_id": 218520,
        "gbif_taxon_key": 2391083,
        "taxonomic_status": "ACCEPTED",
        "diagnostic_characters_summary": "Pita kuning keemasan lebar membujur dari tepi mata hingga pangkal ekor; bintik hitam tegas di sudut atas operkulum; scute kecil 24-29 pada bagian lurus gurat sisi.",
        "differentiation_from_confusion_species": "Spesies tunggal (monotypic) dalam genus Selaroides; tidak memiliki finlet lepas seperti Decapterus; mata berukuran sedang tidak sebesar Selar crumenophthalmus.",
        "ai_feature_caution": "Pita kuning keemasan sangat kontras dan stabil pada kondisi segar; pudar jika ikan telah mengalami dekomposisi parah.",
        "verification_source": "WoRMS (AphiaID: 218520) / FishBase SpecCode: 1943",
        "audit_verdict": "ACCEPTED_TARGET_CLASS_1"
    },
    {
        "local_name": "Teri",
        "recorded_scientific_name": "Stolephorus commersonii",
        "valid_accepted_name": "Stolephorus commersonii Lacepède, 1803",
        "family": "Engraulidae",
        "order": "Clupeiformes",
        "aphia_id": 217436,
        "gbif_taxon_key": 2414002,
        "taxonomic_status": "ACCEPTED",
        "diagnostic_characters_summary": "Tubuh sub-silindris transparan keperakan; moncong menonjol; maksila panjang melampaui margin preoperkulum; panjang 5-10 cm.",
        "differentiation_from_confusion_species": "Sangat mirip dengan Encrasicholina devisi dan Stolephorus indicus di lapangan.",
        "ai_feature_caution": "Ukuran mikro (3-7 cm) mendarat dalam tumpukan gumpalan massa basah; tidak layak untuk deteksi objek satuan dan pengukuran TL per ekor.",
        "verification_source": "WoRMS (AphiaID: 217436) / Whitehead et al. (1988) FAO Clupeoid Cat.",
        "audit_verdict": "EXCLUDED_UNSUITABLE_FOR_MVP"
    },
    {
        "local_name": "Selanget",
        "recorded_scientific_name": "Anodontostoma chacunda",
        "valid_accepted_name": "Anodontostoma chacunda (Hamilton, 1822)",
        "family": "Dorosomatidae",
        "order": "Clupeiformes",
        "aphia_id": 217415,
        "gbif_taxon_key": 2413554,
        "taxonomic_status": "ACCEPTED",
        "diagnostic_characters_summary": "Tubuh sangat dalam dan pipih; bintik hitam besar di belakang operkulum (shoulder spot); mulut inferior tanpa gigi.",
        "differentiation_from_confusion_species": "Dorosomatid khas; berbeda dari Nematalosa yang memiliki filamen dorsal panjang.",
        "ai_feature_caution": "Bintik bahu hitam dan profil dorsal membulat tinggi sangat khas.",
        "verification_source": "WoRMS (AphiaID: 217415) / FishBase",
        "audit_verdict": "CANDIDATE_PHASE_2"
    },
    {
        "local_name": "Peperek lainnya",
        "recorded_scientific_name": "Leiognathus spp",
        "valid_accepted_name": "Leiognathidae indet.",
        "family": "Leiognathidae",
        "order": "Acanthuriformes",
        "aphia_id": 125547,
        "gbif_taxon_key": 2968,
        "taxonomic_status": "AGGREGATE_TAXON",
        "diagnostic_characters_summary": "Kategori agregat tingkat genus/famili yang mencakup campuran beragam spesies Leiognathidae yang tidak disortir.",
        "differentiation_from_confusion_species": "Bukan takson spesies tunggal; dilarang keras dijadikan kelas tunggal dalam model deep learning klasifikasi spesies.",
        "ai_feature_caution": "Tinggi variasi intraspesifik semu; merusak batas keputusan (decision boundary) klasifikasi.",
        "verification_source": "ICZN Code / WoRMS",
        "audit_verdict": "REJECTED_TAXONOMIC_AMBIGUITY"
    },
    {
        "local_name": "Peperek bondolan",
        "recorded_scientific_name": "Leiognathus bindus",
        "valid_accepted_name": "Photopectoralis bindus (Valenciennes, 1835)",
        "family": "Leiognathidae",
        "order": "Acanthuriformes",
        "aphia_id": 445588,
        "gbif_taxon_key": 8189851,
        "taxonomic_status": "SYNONYM_RECLASSIFIED",
        "diagnostic_characters_summary": "Tubuh membulat pipih; sirip punggung berujung oranye terang; organ bercahaya (luminescent organ) di cincin dada.",
        "differentiation_from_confusion_species": "Dipindahkan ke genus Photopectoralis oleh Sparks et al. (2005) berdasarkan morfologi organ bercahaya.",
        "ai_feature_caution": "Ukuran sangat kecil (5-8 cm); rentan tertukar dengan juvenile Leiognathidae lain.",
        "verification_source": "WoRMS (AphiaID: 445588) / Sparks et al. (2005)",
        "audit_verdict": "CANDIDATE_PHASE_2"
    },
    {
        "local_name": "Tembang",
        "recorded_scientific_name": "Sardinella brachysoma",
        "valid_accepted_name": "Sardinella brachysoma Bleeker, 1852",
        "family": "Clupeidae",
        "order": "Clupeiformes",
        "aphia_id": 217448,
        "gbif_taxon_key": 2413813,
        "taxonomic_status": "ACCEPTED",
        "diagnostic_characters_summary": "Tubuh agak dalam; sisik mudah lepas; sirip ekor berujung gelap samar; scutes pada perut tajam.",
        "differentiation_from_confusion_species": "Mirip dengan Sardinella albella dan S. gibbosa.",
        "ai_feature_caution": "Sisik mudah rontok saat tertangkap jaring, mengubah penampilan visual.",
        "verification_source": "WoRMS (AphiaID: 217448) / FishBase",
        "audit_verdict": "CANDIDATE_PHASE_2"
    },
    {
        "local_name": "Teri (devisi)",
        "recorded_scientific_name": "Encrasicholina devisi",
        "valid_accepted_name": "Encrasicholina devisi (Whitley, 1940)",
        "family": "Engraulidae",
        "order": "Clupeiformes",
        "aphia_id": 217424,
        "gbif_taxon_key": 2413994,
        "taxonomic_status": "ACCEPTED",
        "diagnostic_characters_summary": "Tubuh silindris kecil memanjang; maksila pendek tidak mencapai margin preoperkulum; istmus berujung tajam.",
        "differentiation_from_confusion_species": "Berbeda dari Stolephorus pada panjang maksila dan duri perut.",
        "ai_feature_caution": "Mikro-spesimen (panjang 4-7 cm); tidak cocok untuk deteksi visual nampan perorangan.",
        "verification_source": "WoRMS (AphiaID: 217424) / FishBase",
        "audit_verdict": "EXCLUDED_UNSUITABLE_FOR_MVP"
    },
    {
        "local_name": "Beloso",
        "recorded_scientific_name": "Saurida tumbil",
        "valid_accepted_name": "Saurida tumbil (Bloch, 1795)",
        "family": "Synodontidae",
        "order": "Aulopiformes",
        "aphia_id": 217646,
        "gbif_taxon_key": 2401402,
        "taxonomic_status": "ACCEPTED",
        "diagnostic_characters_summary": "Tubuh silindris seperti kadal (lizardfish); mulut lebar dengan deretan gigi runcing terlihat jelas; sirip adiposa kecil di punggung belakang.",
        "differentiation_from_confusion_species": "Morfologi kepala kadal bergerigi sangat membedakannya dari famili lain.",
        "ai_feature_caution": "Bentuk memanjang silindris sangat khas, mudah dideteksi oleh YOLO.",
        "verification_source": "WoRMS (AphiaID: 217646) / Russell (1999) FAO Species Identification Guide",
        "audit_verdict": "CANDIDATE_PHASE_2"
    },
    {
        "local_name": "Tongkol banyar",
        "recorded_scientific_name": "Euthynnus affinis",
        "valid_accepted_name": "Euthynnus affinis (Cantor, 1849)",
        "family": "Scombridae",
        "order": "Scombriformes",
        "aphia_id": 219712,
        "gbif_taxon_key": 2373977,
        "taxonomic_status": "ACCEPTED",
        "diagnostic_characters_summary": "Tubuh fusiform kekar kokoh; corak garis bergelombang miring gelap di punggung atas; beberapa bintik hitam gelap di dada antara sirip pektoral dan pelvis.",
        "differentiation_from_confusion_species": "Bintik gelap dada membedakannya dari Auxis thazard dan Katsuwonus pelamis.",
        "ai_feature_caution": "Ukuran besar (25-45 cm); memerlukan papan ukur ukuran besar (minimal 60-80 cm).",
        "verification_source": "WoRMS (AphiaID: 219712) / Collette & Nauen (1983) p. 33",
        "audit_verdict": "PROPOSED_EXPANSION_LARGE_PELAGIC"
    },
    {
        "local_name": "Gulamah",
        "recorded_scientific_name": "Otolithes ruber",
        "valid_accepted_name": "Otolithes ruber (Bloch & Schneider, 1801)",
        "family": "Sciaenidae",
        "order": "Perciformes",
        "aphia_id": 218731,
        "gbif_taxon_key": 2400030,
        "taxonomic_status": "ACCEPTED",
        "diagnostic_characters_summary": "Tubuh memanjang agak pipih; sepasang gigi taring runcing melengkung kuat pada ujung rahang atas; sirip ekor rombik meruncing.",
        "differentiation_from_confusion_species": "Gigi taring khas membedakannya dari Pennahia dan Johnius.",
        "ai_feature_caution": "Warna perak kemerahan/kecokelatan.",
        "verification_source": "WoRMS (AphiaID: 218731) / Sasaki (2001) FAO Sciaenidae",
        "audit_verdict": "CANDIDATE_PHASE_2"
    },
    {
        "local_name": "Kurisi",
        "recorded_scientific_name": "Nemipterus aurora",
        "valid_accepted_name": "Nemipterus aurora Russell, 1991",
        "family": "Nemipteridae",
        "order": "Spariformes",
        "aphia_id": 279585,
        "gbif_taxon_key": 2392500,
        "taxonomic_status": "ACCEPTED",
        "diagnostic_characters_summary": "Tubuh merah muda keperakan; bintik merah cerah di awal gurat sisi; sirip ekor kemerahan dengan tepi atas sedikit memanjang.",
        "differentiation_from_confusion_species": "Berbeda dari N. japonicus dan N. nematophorus pada tidak adanya filamen ekor panjang.",
        "ai_feature_caution": "Ketersediaan citra publik sangat rendah (hanya 2 di GBIF).",
        "verification_source": "WoRMS (AphiaID: 279585) / Russell (1991)",
        "audit_verdict": "REJECTED_LOW_IMAGE_AVAILABILITY"
    },
    {
        "local_name": "Pari kembang",
        "recorded_scientific_name": "Dasyatis kuhlii",
        "valid_accepted_name": "Neotrygon kuhlii (Müller & Henle, 1841)",
        "family": "Dasyatidae",
        "order": "Myliobatiformes",
        "aphia_id": 277995,
        "gbif_taxon_key": 2419842,
        "taxonomic_status": "SYNONYM_RECLASSIFIED",
        "diagnostic_characters_summary": "Cakram tubuh pipih rhomboid membulat; bintik-bintik biru terang melingkar pada dorsal abu-abu/kecokelatan; ekor berduri berbisa dengan belang hitam putih.",
        "differentiation_from_confusion_species": "Basionym: Trygon kuhlii Müller & Henle 1841; dipindahkan ke Neotrygon oleh Last & White (2008).",
        "ai_feature_caution": "Morfologi elasmobranchii sangat unik (bukan teleostei); lebih tepat untuk modul ByCatch AI.",
        "verification_source": "WoRMS (AphiaID: 277995) / Last & White (2008)",
        "audit_verdict": "CANDIDATE_BYCATCH_MODULE"
    },
    {
        "local_name": "Selar komo",
        "recorded_scientific_name": "Alepes djedaba",
        "valid_accepted_name": "Alepes djedaba (Forsskål, 1775)",
        "family": "Carangidae",
        "order": "Carangiformes",
        "aphia_id": 218501,
        "gbif_taxon_key": 2390977,
        "taxonomic_status": "ACCEPTED",
        "diagnostic_characters_summary": "Tubuh pipih lonjong; kelopak mata berlemak berkembang baik di bagian posterior; scute tajam menonjol 29-39 pada gurat sisi lurus; sirip ekor kekuningan.",
        "differentiation_from_confusion_species": "Berbeda dari Selaroides leptolepis pada ketiadaan pita kuning emas lebar dan bentuk gigi pada rahang.",
        "ai_feature_caution": "Carangid berukuran sedang; fitur visual cukup jelas.",
        "verification_source": "WoRMS (AphiaID: 218501) / Smith-Vaniz (1999) FAO Carangidae",
        "audit_verdict": "CANDIDATE_PHASE_2"
    },
    {
        "local_name": "Kuwe",
        "recorded_scientific_name": "Caranx sexfasciatus",
        "valid_accepted_name": "Caranx sexfasciatus Quoy & Gaimard, 1825",
        "family": "Carangidae",
        "order": "Carangiformes",
        "aphia_id": 218413,
        "gbif_taxon_key": 2390886,
        "taxonomic_status": "ACCEPTED",
        "diagnostic_characters_summary": "Tubuh lonjong memipih; ujung sirip punggung kedua dan dubur berwarna putih terang (white tip); bintik hitam kecil di sudut operkulum; scute kuat 27-36.",
        "differentiation_from_confusion_species": "White lobe tip pada dorsal fin kedua sangat diagnostik.",
        "ai_feature_caution": "Citra publik melimpah di GBIF (2.149 citra), namun pendaratan di Karangantu tergolong rendah (1,3 ton).",
        "verification_source": "WoRMS (AphiaID: 218413) / FishBase",
        "audit_verdict": "CANDIDATE_PHASE_2"
    },
    {
        "local_name": "Gulamah (perak)",
        "recorded_scientific_name": "Pennahia argentata",
        "valid_accepted_name": "Pennahia argentata (Houttuyn, 1782)",
        "family": "Sciaenidae",
        "order": "Perciformes",
        "aphia_id": 279954,
        "gbif_taxon_key": 2400008,
        "taxonomic_status": "ACCEPTED",
        "diagnostic_characters_summary": "Tubuh keperakan tanpa gigi taring besar; mulut terminal miring; bintik gelap samar di operkulum.",
        "differentiation_from_confusion_species": "Tidak memiliki gigi taring tajam seperti Otolithes ruber.",
        "ai_feature_caution": "Ikan demersal perak generik; fitur visual kurang kontras.",
        "verification_source": "WoRMS (AphiaID: 279954) / Sasaki (2001)",
        "audit_verdict": "CANDIDATE_PHASE_2"
    },
    {
        "local_name": "Peperek (berbis)",
        "recorded_scientific_name": "Leiognathus berbis",
        "valid_accepted_name": "Equulites berbis (Valenciennes, 1835)",
        "family": "Leiognathidae",
        "order": "Acanthuriformes",
        "aphia_id": 445580,
        "gbif_taxon_key": 8295679,
        "taxonomic_status": "SYNONYM_RECLASSIFIED",
        "diagnostic_characters_summary": "Tubuh memanjang ramping untuk ukuran Leiognathidae; moncong agak meruncing; duri dorsal kedua tidak memanjang seperti filamen.",
        "differentiation_from_confusion_species": "AUDIT KOREKSI KESALAHAN: Laporan Phase 11 sebelumnya keliru menyebut L. berbis sebagai sinonim Equulites elongatus. Keduanya adalah taksa berbeda (E. elongatus Günther 1874 bertubuh jauh lebih langsing dan bersumber dari perairan terpisah). Nama valid adalah Equulites berbis (Valenciennes, 1835).",
        "ai_feature_caution": "Produksi rendah (1,2 ton); risiko tinggi tertukar dengan E. leuciscus.",
        "verification_source": "WoRMS (AphiaID: 445580) / Kimura et al. (2008)",
        "audit_verdict": "REJECTED_LOW_VOLUME_AND_TAXONOMIC_CONFUSION"
    },
    {
        "local_name": "Tongkol pisang-balaki",
        "recorded_scientific_name": "Auxis thazard",
        "valid_accepted_name": "Auxis thazard (Lacepède, 1800)",
        "family": "Scombridae",
        "order": "Scombriformes",
        "aphia_id": 127015,
        "gbif_taxon_key": 2374246,
        "taxonomic_status": "ACCEPTED",
        "diagnostic_characters_summary": "Tubuh fusiform bulat; celah lebar di antara sirip punggung pertama dan kedua; corak garis-garis bergelombang gelap membujur sempit pada daerah tanpa sisik di punggung belakang.",
        "differentiation_from_confusion_species": "Berbeda dari Auxis rochei pada lebar daerah bersisik (corselet) di bawah sirip dorsal kedua.",
        "ai_feature_caution": "Pelagis sedang; corak dorsal sangat kontras.",
        "verification_source": "WoRMS (AphiaID: 127015) / Collette & Nauen (1983) p. 30",
        "audit_verdict": "CANDIDATE_PHASE_2"
    },
    {
        "local_name": "Ikan sebelah",
        "recorded_scientific_name": "Psettodes erumei",
        "valid_accepted_name": "Psettodes erumei (Bloch & Schneider, 1801)",
        "family": "Psettodidae",
        "order": "Pleuronectiformes",
        "aphia_id": 219760,
        "gbif_taxon_key": 2408990,
        "taxonomic_status": "ACCEPTED",
        "diagnostic_characters_summary": "Tubuh pipih asimetris (flatfish); kedua mata berada pada satu sisi (bisa sisi kanan atau kiri/dextral atau sinistral); mulut sangat lebar dengan gigi taring tajam kuat.",
        "differentiation_from_confusion_species": "Flatfish primitif; sirip punggung berawal di belakang mata (bukan melampaui mata seperti Bothidae/Soleidae).",
        "ai_feature_caution": "Morfologi asimetris sangat unik dan mudah dikenali AI; namun volume pendaratan rendah (1,0 ton).",
        "verification_source": "WoRMS (AphiaID: 219760) / Hensley (2001) FAO Pleuronectiformes",
        "audit_verdict": "CANDIDATE_PHASE_2"
    },
    {
        "local_name": "Tenggiri batang",
        "recorded_scientific_name": "Scomberomorus lineolatus",
        "valid_accepted_name": "Scomberomorus lineolatus (Cuvier, 1832)",
        "family": "Scombridae",
        "order": "Scombriformes",
        "aphia_id": 219728,
        "gbif_taxon_key": 2374287,
        "taxonomic_status": "ACCEPTED",
        "diagnostic_characters_summary": "Tubuh memanjang sangat ramping; deretan garis-garis pendek putus-putus gelap membujur di sisi lateral; gigi pipih segitiga tajam.",
        "differentiation_from_confusion_species": "Berbeda dari S. commerson yang memiliki garis belang vertikal utuh.",
        "ai_feature_caution": "Nilai ekonomi sangat tinggi (Rp 65.000/kg), namun pendaratan di Karangantu di bawah 1 ton.",
        "verification_source": "WoRMS (AphiaID: 219728) / Collette & Nauen (1983) p. 67",
        "audit_verdict": "CANDIDATE_HIGH_VALUE"
    },
    {
        "local_name": "Kurisi (nematophorus)",
        "recorded_scientific_name": "Nemipterus nematophorus",
        "valid_accepted_name": "Nemipterus nematophorus (Bleeker, 1854)",
        "family": "Nemipteridae",
        "order": "Spariformes",
        "aphia_id": 279599,
        "gbif_taxon_key": 2392487,
        "taxonomic_status": "ACCEPTED",
        "diagnostic_characters_summary": "Dua duri sirip punggung pertama memanjang menjadi filamen panjang; cuping atas sirip ekor juga memiliki filamen memanjang kuning.",
        "differentiation_from_confusion_species": "Filamen dorsal khas membedakannya dari seluruh Nemipterus lain.",
        "ai_feature_caution": "Filamen sangat rentan patah saat tertangkap jaring komersial; pendaratan terendah (713 kg).",
        "verification_source": "WoRMS (AphiaID: 279599) / Russell (1991)",
        "audit_verdict": "REJECTED_LOW_VOLUME"
    }
]

df_tax = pd.DataFrame(tax_data)
tax_path = os.path.join(REPORTS_11_6_DIR, "taxonomic_revalidation.csv")
df_tax.to_csv(tax_path, index=False, encoding="utf-8")
print(f"Saved: {tax_path} ({len(df_tax)} rows)")


# ==============================================================================
# 3. SPECIES PRIORITIZATION RE-AUDIT CSV
# ==============================================================================
# Load previous matrix and audit rank, total score, and formulas
matrix_prev_path = os.path.join(PIPELINE_ROOT, "reports", "phase_11", "species_prioritization_matrix.csv")
df_matrix_prev = pd.read_csv(matrix_prev_path)

reaudit_rows = []
for idx, r in df_matrix_prev.iterrows():
    # Recalculate mathematical sum
    calc_sum = round(r['score_prod_30'] + r['score_cons_20'] + r['score_img_25'] + r['score_tax_15'] + r['score_ai_10'], 2)
    recorded_sum = r['total_weighted_score_100']
    math_match = (calc_sum == recorded_sum)
    
    # Check ranking logic:
    # Notice: In the previous markdown report text, Teri (56.0) was placed below Selar komo (54.5).
    # In the CSV, Teri was rank 12 (56.0) and Selar komo was rank 13 (54.5).
    rank_audit_note = "Valid CSV ordering"
    if r['scientific_name'] == 'Stolephorus commersonii':
        rank_audit_note = "KOREKSI DOKUMEN: Di laporan markdown Phase 11 ditempatkan di bawah Selar komo (54.5), namun di file CSV urutannya tepat berdasarkan skor 56.0."
    
    reaudit_rows.append({
        "current_csv_rank": r['final_rank'],
        "production_rank": r['rank'],
        "local_name": r['local_name'],
        "scientific_name": r['scientific_name'],
        "pipp_production_kg": r['pipp_production_kg'],
        "score_prod_30": r['score_prod_30'],
        "score_cons_20": r['score_cons_20'],
        "score_img_25": r['score_img_25'],
        "score_tax_15": r['score_tax_15'],
        "score_ai_10": r['score_ai_10'],
        "recalculated_weighted_score": calc_sum,
        "recorded_weighted_score": recorded_sum,
        "math_verified": "VERIFIED_ACCURATE" if math_match else "DISCREPANCY",
        "prioritization_tier": r['prioritization_tier'],
        "recommendation_status": r['recommendation_status'],
        "scoring_rigor_audit": "METHOD_HEURISTIC_SUBJECTIVE" if r['score_cons_20'] > 0 else "DATA_BACKED",
        "ranking_audit_notes": rank_audit_note
    })

df_reaudit = pd.DataFrame(reaudit_rows)
# Ensure strict sort by recalculated_weighted_score descending, then production descending
df_reaudit = df_reaudit.sort_values(by=["recalculated_weighted_score", "pipp_production_kg"], ascending=[False, False]).reset_index(drop=True)
df_reaudit["audited_final_rank"] = df_reaudit.index + 1

reaudit_path = os.path.join(REPORTS_11_6_DIR, "species_prioritization_reaudit.csv")
df_reaudit.to_csv(reaudit_path, index=False, encoding="utf-8")
print(f"Saved: {reaudit_path} ({len(df_reaudit)} rows)")


# ==============================================================================
# 4. PUBLIC IMAGE AUDIT CSV
# ==============================================================================
pub_img_data = [
    {
        "dataset_component": "DeepFish Dataset (Zenodo 6475675)",
        "taxa_represented": "64 Spesies Ikan Mediterania (Spanyol)",
        "total_images_in_archive": 1320,
        "accessible_locally_in_workspace": "41.45 MB COCO JSON + 373.27 MB Image Zip (batch 2021_06-09)",
        "verified_usable_for_target_training": 0,
        "functional_role": "MORPHOLOGY_REFERENCE",
        "license_type": "CC BY 4.0",
        "license_restrictions": "Atribusi wajib Garcia-d'Urso et al. (2022). Tidak boleh diklaim sebagai ikan perairan Indonesia.",
        "domain_characteristics": "Ikan di atas nampan pasar grosir El Campello; anotasi polygon instance segmentation; kalibrasi homografi.",
        "audit_disposition": "RETAIN_AS_METHODOLOGY_REFERENCE_STRICTLY_ISOLATED"
    },
    {
        "dataset_component": "GBIF Phase 10 - Rastrelliger kanagurta",
        "taxa_represented": "Rastrelliger kanagurta (Kembung Lelaki)",
        "total_images_in_archive": 107,
        "accessible_locally_in_workspace": "107 file JPEG/PNG di dataset_pipeline/data/public/gbif/raw/rastrelliger_kanagurta/",
        "verified_usable_for_target_training": 0,
        "functional_role": "OOD_TEST_CANDIDATE",
        "license_type": "CC BY-NC 4.0 (mayoritas), CC BY 4.0, CC0 1.0",
        "license_restrictions": "Penggunaan non-komersial/riset akademis. Klausul NC membatasi komersialisasi langsung.",
        "domain_characteristics": "Underwater in-situ (ikan berenang bebas di terumbu karang); tanpa papan ukur; tanpa bounding box.",
        "audit_disposition": "RETAIN_HISTORICAL_CROSS_DOMAIN_EVALUATION"
    },
    {
        "dataset_component": "GBIF Phase 10 - Decapterus macarellus",
        "taxa_represented": "Decapterus macarellus (Layang)",
        "total_images_in_archive": 100,
        "accessible_locally_in_workspace": "100 file JPEG/PNG di dataset_pipeline/data/public/gbif/raw/decapterus_macarellus/",
        "verified_usable_for_target_training": 0,
        "functional_role": "OOD_TEST_CANDIDATE",
        "license_type": "CC BY-NC 4.0, CC BY 4.0, CC0 1.0",
        "license_restrictions": "Penggunaan non-komersial. Wajib atribusi fotografer/museum.",
        "domain_characteristics": "Foto bawah air dan toples awetan museum alkohol/formalin; bukan foto nampan segar TPI.",
        "audit_disposition": "RETAIN_HISTORICAL_CROSS_DOMAIN_EVALUATION"
    },
    {
        "dataset_component": "GBIF Candidate Query - Rastrelliger brachysoma",
        "taxa_represented": "Rastrelliger brachysoma (Kembung Perempuan - Target Kelas 0)",
        "total_images_in_archive": 35,
        "accessible_locally_in_workspace": "Terekam metadata pada phase_11_gbif_candidates_check.json (belum diunduh massal)",
        "verified_usable_for_target_training": 0,
        "functional_role": "TRAINING_CANDIDATE",
        "license_type": "CC BY-NC 4.0, CC BY 4.0",
        "license_restrictions": "Perlu audit lisensi granular per URL sebelum unduhan massal.",
        "domain_characteristics": "Foto pasar ikan Asia Tenggara dan foto in-situ.",
        "audit_disposition": "APPROVED_FOR_CURATED_DOWNLOAD_UPON_PROTOCOL_APPROVAL"
    },
    {
        "dataset_component": "GBIF Candidate Query - Selaroides leptolepis",
        "taxa_represented": "Selaroides leptolepis (Selar Kuning - Target Kelas 1)",
        "total_images_in_archive": 179,
        "accessible_locally_in_workspace": "Terekam metadata pada phase_11_gbif_candidates_check.json (belum diunduh massal)",
        "verified_usable_for_target_training": 0,
        "functional_role": "TRAINING_CANDIDATE",
        "license_type": "CC BY-NC 4.0, CC BY 4.0, CC0 1.0",
        "license_restrictions": "Perlu audit lisensi granular per URL sebelum unduhan massal.",
        "domain_characteristics": "Foto bawah air dan foto pasar Indo-Pasifik.",
        "audit_disposition": "APPROVED_FOR_CURATED_DOWNLOAD_UPON_PROTOCOL_APPROVAL"
    },
    {
        "dataset_component": "GBIF Candidate Query - Upeneus sulphureus",
        "taxa_represented": "Upeneus sulphureus (Kuniran - Target Kelas 2)",
        "total_images_in_archive": 67,
        "accessible_locally_in_workspace": "Terekam metadata pada phase_11_gbif_candidates_check.json (belum diunduh massal)",
        "verified_usable_for_target_training": 0,
        "functional_role": "TRAINING_CANDIDATE",
        "license_type": "CC BY-NC 4.0, CC BY 4.0",
        "license_restrictions": "Perlu audit lisensi granular per URL sebelum unduhan massal.",
        "domain_characteristics": "Foto bawah air dan foto spesimen segar.",
        "audit_disposition": "APPROVED_FOR_CURATED_DOWNLOAD_UPON_PROTOCOL_APPROVAL"
    },
    {
        "dataset_component": "GBIF Candidate Query - Stolephorus commersonii",
        "taxa_represented": "Stolephorus commersonii (Teri)",
        "total_images_in_archive": 0,
        "accessible_locally_in_workspace": "0 citra terdeteksi pada GBIF StillImage API",
        "verified_usable_for_target_training": 0,
        "functional_role": "REJECTED",
        "license_type": "N/A",
        "license_restrictions": "Tidak ada berkas.",
        "domain_characteristics": "N/A",
        "audit_disposition": "EXCLUDED_FROM_ACQUISITION"
    }
]

df_pub_audit = pd.DataFrame(pub_img_data)
pub_audit_path = os.path.join(REPORTS_11_6_DIR, "public_image_audit.csv")
df_pub_audit.to_csv(pub_audit_path, index=False, encoding="utf-8")
print(f"Saved: {pub_audit_path} ({len(df_pub_audit)} rows)")


# ==============================================================================
# 5. SPECIES REFERENCE AUDIT CSV
# ==============================================================================
# Load species_reference.csv and audit every row
spec_ref_path = os.path.join(METADATA_DIR, "species_reference.csv")
df_spec = pd.read_csv(spec_ref_path)

spec_audit_rows = []
for idx, r in df_spec.iterrows():
    sp_id = r['species_id']
    cid = r['class_id']
    sc_name = r['scientific_name']
    loc_name = r['local_name_id']
    status = r['verification_status']
    
    # Audit determination
    if sp_id == 'SP-01':
        audit_note = "HISTORIS: Kelas 0 awal (R. kanagurta). Harus diubah class_id = -1 karena digantikan oleh R. brachysoma pada MVP."
        action_req = "REASSIGN_CLASS_ID_TO_MINUS_ONE"
    elif sp_id == 'SP-02':
        audit_note = "HISTORIS: Kelas 1 awal (D. macarellus). Harus diubah class_id = -1 karena digantikan oleh Selaroides leptolepis pada MVP."
        action_req = "REASSIGN_CLASS_ID_TO_MINUS_ONE"
    elif sp_id == 'SP-03':
        audit_note = "DUPLIKASI: SP-03 mencatat R. brachysoma dengan class_id: -1. Di Phase 11 ditambahkan SP-06 untuk spesies yang sama dengan class_id: 0. Terjadi redundansi takson."
        action_req = "RECONCILE_WITH_SP06"
    elif sp_id == 'SP-04':
        audit_note = "HISTORIS: Decapterus russelli (spesies pembanding layang). Tetap class_id = -1."
        action_req = "MAINTAIN_REFERENCE"
    elif sp_id == 'SP-05':
        audit_note = "HISTORIS: Actinopterygii indet. (ikan belum teridentifikasi). Tetap class_id = -1."
        action_req = "MAINTAIN_REFERENCE"
    elif sp_id == 'SP-06':
        audit_note = "MVP TARGET: Kelas 0 Baru (Rastrelliger brachysoma). Status valid."
        action_req = "CONFIRMED_MVP_CLASS_0"
    elif sp_id == 'SP-07':
        audit_note = "MVP TARGET: Kelas 1 Baru (Selaroides leptolepis). Status valid."
        action_req = "CONFIRMED_MVP_CLASS_1"
    elif sp_id == 'SP-08':
        audit_note = "MVP TARGET: Kelas 2 Baru (Upeneus sulphureus). Status valid."
        action_req = "CONFIRMED_MVP_CLASS_2"
    elif sp_id == 'SP-09':
        audit_note = "AUXILIARY: Equulites leuciscus (Peperek). Disimpan sebagai cadangan Phase 2, class_id = -1."
        action_req = "REASSIGN_CLASS_ID_TO_MINUS_ONE_FOR_MVP"
    elif sp_id == 'SP-10':
        audit_note = "EXCLUDED: Stolephorus commersonii (Teri). Status eksklusi valid, class_id = -1."
        action_req = "MAINTAIN_EXCLUDED"
    else:
        audit_note = "Takson tambahan."
        action_req = "CHECK"

    spec_audit_rows.append({
        "species_id": sp_id,
        "recorded_class_id": cid,
        "scientific_name": sc_name,
        "local_name_id": loc_name,
        "verification_status": status,
        "mvp_decision_alignment": "ACTIVE_MVP_TARGET" if sp_id in ['SP-06', 'SP-07', 'SP-08'] else ("HISTORICAL_ARCHIVE" if sp_id in ['SP-01', 'SP-02', 'SP-03', 'SP-04', 'SP-05'] else "CANDIDATE_PHASE_2_OR_EXCLUDED"),
        "audit_action_required": action_req,
        "auditor_scientific_rationale": audit_note
    })

df_spec_audit = pd.DataFrame(spec_audit_rows)
spec_audit_path = os.path.join(REPORTS_11_6_DIR, "species_reference_audit.csv")
df_spec_audit.to_csv(spec_audit_path, index=False, encoding="utf-8")
print(f"Saved: {spec_audit_path} ({len(df_spec_audit)} rows)")

print("\nALL PHASE 11.6 AUDIT CSV ARTIFACTS GENERATED SUCCESSFULLY!")
