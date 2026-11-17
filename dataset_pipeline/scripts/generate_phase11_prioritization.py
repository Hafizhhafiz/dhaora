import os
import pandas as pd
import numpy as np

WORKSPACE_ROOT = r"c:\TUGAS-TUGAS KULIAH\SEMESTER 5\ASIK VOL VI"
PIPELINE_ROOT = os.path.join(WORKSPACE_ROOT, "dataset_pipeline")
REPORTS_11_DIR = os.path.join(PIPELINE_ROOT, "reports", "phase_11")
METADATA_DIR = os.path.join(PIPELINE_ROOT, "metadata")

os.makedirs(REPORTS_11_DIR, exist_ok=True)

# 1. Generate species_prioritization_matrix.csv
# Data from PIPP KKP 2026 PPN Karangantu (23 fish species)
# Scoring criteria weights:
# - Local production: 30%
# - Occurrence consistency: 20%
# - Image availability: 25%
# - Taxonomic certainty: 15%
# - AI detection feasibility: 10%

species_data = [
    {
        "rank": 1,
        "local_name": "Kembung perempuan",
        "scientific_name": "Rastrelliger brachysoma",
        "valid_scientific_name": "Rastrelliger brachysoma (Bleeker, 1851)",
        "family": "Scombridae",
        "pipp_production_kg": 33305,
        "avg_price_idr_kg": 35000,
        "score_prod_30": 30.0,  # #1 production in Karangantu
        "score_cons_20": 18.0,  # Landed almost daily by bagan and payang
        "score_img_25": 19.0,   # 35 GBIF + widely available at TPI for fresh photography
        "score_tax_15": 14.0,   # Accepted species, clear morphological distinction
        "score_ai_10": 9.5,     # Medium-large size (15-22 cm), fusiform body, ideal for YOLO
        "prioritization_tier": "TIER_1_PRIMARY",
        "recommendation_status": "RECOMMENDED_TARGET_CLASS",
        "justification": "Rank 1 produksi di Karangantu (33,3 ton), morfologi fusiform sangat ideal untuk deteksi dan estimasi TL, nilai ekonomi tinggi."
    },
    {
        "rank": 2,
        "local_name": "Peperek",
        "scientific_name": "Leiognathus leuciscus",
        "valid_scientific_name": "Equulites leuciscus (Günther, 1860)",
        "family": "Leiognathidae",
        "pipp_production_kg": 32238,
        "avg_price_idr_kg": 15000,
        "score_prod_30": 29.0,  # #2 production
        "score_cons_20": 18.0,  # Very frequent catch from payang/trawl
        "score_img_25": 15.0,   # 14 GBIF, abundant at TPI but tricky to photograph cleanly
        "score_tax_15": 9.0,    # Complex Leiognathidae taxonomy, genus reclassification
        "score_ai_10": 6.5,     # Small body (6-12 cm), highly compressed, prone to piling
        "prioritization_tier": "TIER_2_SECONDARY",
        "recommendation_status": "PROPOSED_AUXILIARY",
        "justification": "Produksi sangat tinggi (32,2 ton), namun taksonomi genus rumit dan tubuh kecil tipis sering bertumpuk di nampan."
    },
    {
        "rank": 3,
        "local_name": "Kuniran",
        "scientific_name": "Upeneus sulphureus",
        "valid_scientific_name": "Upeneus sulphureus Cuvier, 1829",
        "family": "Mullidae",
        "pipp_production_kg": 23838,
        "avg_price_idr_kg": 25000,
        "score_prod_30": 25.5,  # #3 production
        "score_cons_20": 17.0,  # Demersal regular landings
        "score_img_25": 20.0,   # 67 GBIF StillImages + easy TPI sampling
        "score_tax_15": 14.5,   # Accepted, distinct barbels and yellow stripes
        "score_ai_10": 9.0,     # Distinctive orange/yellow coloration, 12-18 cm size
        "prioritization_tier": "TIER_1_PRIMARY",
        "recommendation_status": "RECOMMENDED_TARGET_CLASS",
        "justification": "Rank 3 produksi (23,8 ton), ciri visual sungut dan warna kuning sangat khas untuk Computer Vision, status taksonomi mapan."
    },
    {
        "rank": 4,
        "local_name": "Selar kuning",
        "scientific_name": "Selaroides leptolepis",
        "valid_scientific_name": "Selaroides leptolepis (Cuvier, 1833)",
        "family": "Carangidae",
        "pipp_production_kg": 19902,
        "avg_price_idr_kg": 30000,
        "score_prod_30": 24.0,  # #4 production
        "score_cons_20": 17.5,  # Very consistent small pelagic
        "score_img_25": 23.5,   # 179 GBIF StillImages (highest among candidates) + TPI
        "score_tax_15": 14.5,   # Monotypic/very stable taxonomy, prominent golden stripe
        "score_ai_10": 9.5,     # Golden lateral stripe provides exceptional feature for YOLO
        "prioritization_tier": "TIER_1_PRIMARY",
        "recommendation_status": "RECOMMENDED_TARGET_CLASS",
        "justification": "Pita kuning lateral sangat diagnostik untuk ekstraksi fitur YOLO, ketersediaan citra tertinggi di GBIF (179 citra), nilai komersial stabil."
    },
    {
        "rank": 5,
        "local_name": "Teri",
        "scientific_name": "Stolephorus commersonii",
        "valid_scientific_name": "Stolephorus commersonii Lacepède, 1803",
        "family": "Engraulidae",
        "pipp_production_kg": 17418,
        "avg_price_idr_kg": 20000,
        "score_prod_30": 22.0,  # #5 production
        "score_cons_20": 15.0,  # Seasonal schools
        "score_img_25": 8.0,    # 0 GBIF StillImages, very difficult macro shots
        "score_tax_15": 8.0,    # Confused with other Stolephorus / Encrasicholina
        "score_ai_10": 3.0,     # Extremely small (3-7 cm), landed in massive wet clumps, impossible for single TL calipers
        "prioritization_tier": "TIER_3_EXCLUDED",
        "recommendation_status": "REJECTED_UNSUITABLE_FOR_MVP",
        "justification": "Ukuran mikro (3-7 cm) mendarat dalam tumpukan ribuan ekor; tidak layak untuk deteksi individu dan pengukuran TL pada MVP."
    },
    {
        "rank": 6,
        "local_name": "Selanget",
        "scientific_name": "Anodontostoma chacunda",
        "valid_scientific_name": "Anodontostoma chacunda (Hamilton, 1822)",
        "family": "Dorosomatidae",
        "pipp_production_kg": 9855,
        "avg_price_idr_kg": 18000,
        "score_prod_30": 16.0,
        "score_cons_20": 14.0,
        "score_img_25": 16.0,   # 69 GBIF images
        "score_tax_15": 13.0,
        "score_ai_10": 8.0,     # Deep-bodied clupeid, distinct black shoulder spot
        "prioritization_tier": "TIER_2_SECONDARY",
        "recommendation_status": "CANDIDATE_PHASE_2",
        "justification": "Bercak bahu hitam khas, namun volume produksi lebih rendah dari top 4."
    },
    {
        "rank": 7,
        "local_name": "Peperek lainnya",
        "scientific_name": "Leiognathus spp",
        "valid_scientific_name": "Leiognathidae indet.",
        "family": "Leiognathidae",
        "pipp_production_kg": 8893,
        "avg_price_idr_kg": 12000,
        "score_prod_30": 15.0,
        "score_cons_20": 13.0,
        "score_img_25": 10.0,
        "score_tax_15": 4.0,    # Genus-level aggregate (cannot be single class)
        "score_ai_10": 5.0,
        "prioritization_tier": "TIER_3_EXCLUDED",
        "recommendation_status": "REJECTED_TAXONOMIC_AMBIGUITY",
        "justification": "Kategori agregat tingkat genus, bertentangan dengan kaidah klasifikasi spesies presisi."
    },
    {
        "rank": 8,
        "local_name": "Peperek bondolan",
        "scientific_name": "Leiognathus bindus",
        "valid_scientific_name": "Photopectoralis bindus (Valenciennes, 1835)",
        "family": "Leiognathidae",
        "pipp_production_kg": 5057,
        "avg_price_idr_kg": 14000,
        "score_prod_30": 12.0,
        "score_cons_20": 12.0,
        "score_img_25": 12.0,
        "score_tax_15": 11.0,
        "score_ai_10": 6.5,
        "prioritization_tier": "TIER_2_SECONDARY",
        "recommendation_status": "CANDIDATE_PHASE_2",
        "justification": "Bintik oranye di sirip dorsal, namun ukuran sangat kecil (5-9 cm)."
    },
    {
        "rank": 9,
        "local_name": "Tembang",
        "scientific_name": "Sardinella brachysoma",
        "valid_scientific_name": "Sardinella brachysoma Bleeker, 1852",
        "family": "Clupeidae",
        "pipp_production_kg": 4866,
        "avg_price_idr_kg": 20000,
        "score_prod_30": 11.5,
        "score_cons_20": 13.0,
        "score_img_25": 12.0,   # 17 GBIF images
        "score_tax_15": 12.0,
        "score_ai_10": 8.0,
        "prioritization_tier": "TIER_2_SECONDARY",
        "recommendation_status": "CANDIDATE_PHASE_2",
        "justification": "Clupeid komersial penting, tetapi volume pendaratan di bawah 5 ton."
    },
    {
        "rank": 10,
        "local_name": "Teri (devisi)",
        "scientific_name": "Encrasicholina devisi",
        "valid_scientific_name": "Encrasicholina devisi (Whitley, 1940)",
        "family": "Engraulidae",
        "pipp_production_kg": 3868,
        "avg_price_idr_kg": 22000,
        "score_prod_30": 10.0,
        "score_cons_20": 11.0,
        "score_img_25": 10.0,   # 24 GBIF images
        "score_tax_15": 9.0,
        "score_ai_10": 3.0,
        "prioritization_tier": "TIER_3_EXCLUDED",
        "recommendation_status": "REJECTED_UNSUITABLE_FOR_MVP",
        "justification": "Teri mikro, mendarat dalam agregat gumpalan basah, tidak cocok untuk deteksi kontur tunggal."
    },
    {
        "rank": 11,
        "local_name": "Beloso",
        "scientific_name": "Saurida tumbil",
        "valid_scientific_name": "Saurida tumbil (Bloch, 1795)",
        "family": "Synodontidae",
        "pipp_production_kg": 3609,
        "avg_price_idr_kg": 20000,
        "score_prod_30": 9.5,
        "score_cons_20": 11.0,
        "score_img_25": 17.0,   # 77 GBIF images
        "score_tax_15": 13.5,
        "score_ai_10": 8.5,     # Silindris panjang, gigi terlihat
        "prioritization_tier": "TIER_2_SECONDARY",
        "recommendation_status": "CANDIDATE_PHASE_2",
        "justification": "Bentuk kadal laut sangat unik, namun volume pendaratan moderat."
    },
    {
        "rank": 12,
        "local_name": "Tongkol banyar",
        "scientific_name": "Euthynnus affinis",
        "valid_scientific_name": "Euthynnus affinis (Cantor, 1849)",
        "family": "Scombridae",
        "pipp_production_kg": 3145,
        "avg_price_idr_kg": 32000,
        "score_prod_30": 9.0,
        "score_cons_20": 12.0,
        "score_img_25": 23.0,   # 293 GBIF images
        "score_tax_15": 14.5,
        "score_ai_10": 9.5,     # Ukuran besar (25-45 cm), corak punggung sangat khas
        "prioritization_tier": "TIER_2_SECONDARY",
        "recommendation_status": "PROPOSED_EXPANSION_LARGE_PELAGIC",
        "justification": "Karakter visual sangat kuat dan citra berlimpah, tetapi ukuran besar membutuhkan nampan khusus."
    },
    {
        "rank": 13,
        "local_name": "Gulamah",
        "scientific_name": "Otolithes ruber",
        "valid_scientific_name": "Otolithes ruber (Bloch & Schneider, 1801)",
        "family": "Sciaenidae",
        "pipp_production_kg": 2608,
        "avg_price_idr_kg": 25000,
        "score_prod_30": 8.5,
        "score_cons_20": 10.0,
        "score_img_25": 18.0,   # 118 GBIF images
        "score_tax_15": 12.5,
        "score_ai_10": 8.5,
        "prioritization_tier": "TIER_2_SECONDARY",
        "recommendation_status": "CANDIDATE_PHASE_2",
        "justification": "Ikan demersal penting, namun volume tangkapan di bawah 3 ton."
    },
    {
        "rank": 14,
        "local_name": "Kurisi",
        "scientific_name": "Nemipterus aurora",
        "valid_scientific_name": "Nemipterus aurora Russell, 1991",
        "family": "Nemipteridae",
        "pipp_production_kg": 1823,
        "avg_price_idr_kg": 28000,
        "score_prod_30": 7.0,
        "score_cons_20": 9.0,
        "score_img_25": 6.0,    # Only 2 GBIF images
        "score_tax_15": 11.0,
        "score_ai_10": 8.0,
        "prioritization_tier": "TIER_3_EXCLUDED",
        "recommendation_status": "REJECTED_LOW_IMAGE_AVAILABILITY",
        "justification": "Hanya 2 citra di GBIF, data citra publik sangat langka."
    },
    {
        "rank": 15,
        "local_name": "Pari kembang",
        "scientific_name": "Dasyatis kuhlii",
        "valid_scientific_name": "Neotrygon kuhlii (Müller & Henle, 1841)",
        "family": "Dasyatidae",
        "pipp_production_kg": 1610,
        "avg_price_idr_kg": 25000,
        "score_prod_30": 6.5,
        "score_cons_20": 9.0,
        "score_img_25": 21.0,
        "score_tax_15": 13.0,
        "score_ai_10": 8.0,     # Bodi pipih bundar dengan duri ekor
        "prioritization_tier": "TIER_2_SECONDARY",
        "recommendation_status": "CANDIDATE_BYCATCH_MODULE",
        "justification": "Elasmobranchii, morfologi pipih unik; lebih tepat untuk modul ByCatch AI."
    },
    {
        "rank": 16,
        "local_name": "Selar komo",
        "scientific_name": "Alepes djedaba",
        "valid_scientific_name": "Alepes djedaba (Forsskål, 1775)",
        "family": "Carangidae",
        "pipp_production_kg": 1428,
        "avg_price_idr_kg": 26000,
        "score_prod_30": 6.0,
        "score_cons_20": 9.0,
        "score_img_25": 18.0,   # 114 GBIF images
        "score_tax_15": 13.0,
        "score_ai_10": 8.5,
        "prioritization_tier": "TIER_2_SECONDARY",
        "recommendation_status": "CANDIDATE_PHASE_2",
        "justification": "Carangid pelagis kecil, volume tangkapan moderat rendah."
    },
    {
        "rank": 17,
        "local_name": "Kuwe",
        "scientific_name": "Caranx sexfasciatus",
        "valid_scientific_name": "Caranx sexfasciatus Quoy & Gaimard, 1825",
        "family": "Carangidae",
        "pipp_production_kg": 1387,
        "avg_price_idr_kg": 40000,
        "score_prod_30": 5.5,
        "score_cons_20": 8.0,
        "score_img_25": 25.0,   # 2149 GBIF images
        "score_tax_15": 14.5,
        "score_ai_10": 9.0,
        "prioritization_tier": "TIER_2_SECONDARY",
        "recommendation_status": "CANDIDATE_PHASE_2",
        "justification": "Citra publik sangat berlimpah, nilai ekonomi tinggi, namun volume produksi Karangantu kecil (1,3 ton)."
    },
    {
        "rank": 18,
        "local_name": "Gulamah (perak)",
        "scientific_name": "Pennahia argentata",
        "valid_scientific_name": "Pennahia argentata (Houttuyn, 1782)",
        "family": "Sciaenidae",
        "pipp_production_kg": 1359,
        "avg_price_idr_kg": 22000,
        "score_prod_30": 5.5,
        "score_cons_20": 8.0,
        "score_img_25": 14.0,
        "score_tax_15": 11.0,
        "score_ai_10": 8.0,
        "prioritization_tier": "TIER_2_SECONDARY",
        "recommendation_status": "CANDIDATE_PHASE_2",
        "justification": "Ikan dasar demersal minor."
    },
    {
        "rank": 19,
        "local_name": "Peperek (berbis)",
        "scientific_name": "Leiognathus berbis",
        "valid_scientific_name": "Equulites elongatus (Günther, 1874) / Equulites berbis",
        "family": "Leiognathidae",
        "pipp_production_kg": 1230,
        "avg_price_idr_kg": 12000,
        "score_prod_30": 5.0,
        "score_cons_20": 7.0,
        "score_img_25": 8.0,
        "score_tax_15": 9.0,
        "score_ai_10": 6.0,
        "prioritization_tier": "TIER_3_EXCLUDED",
        "recommendation_status": "REJECTED_LOW_VOLUME",
        "justification": "Varietas peperek minor dengan produksi rendah."
    },
    {
        "rank": 20,
        "local_name": "Tongkol pisang-balaki",
        "scientific_name": "Auxis thazard",
        "valid_scientific_name": "Auxis thazard (Lacepède, 1800)",
        "family": "Scombridae",
        "pipp_production_kg": 1209,
        "avg_price_idr_kg": 28000,
        "score_prod_30": 5.0,
        "score_cons_20": 7.0,
        "score_img_25": 20.0,
        "score_tax_15": 13.5,
        "score_ai_10": 9.0,
        "prioritization_tier": "TIER_2_SECONDARY",
        "recommendation_status": "CANDIDATE_PHASE_2",
        "justification": "Scombrid pelagis sedang, corak dorsal unik."
    },
    {
        "rank": 21,
        "local_name": "Ikan sebelah",
        "scientific_name": "Psettodes erumei",
        "valid_scientific_name": "Psettodes erumei (Bloch & Schneider, 1801)",
        "family": "Psettodidae",
        "pipp_production_kg": 1017,
        "avg_price_idr_kg": 35000,
        "score_prod_30": 4.5,
        "score_cons_20": 6.0,
        "score_img_25": 15.0,
        "score_tax_15": 14.0,
        "score_ai_10": 9.0,
        "prioritization_tier": "TIER_2_SECONDARY",
        "recommendation_status": "CANDIDATE_PHASE_2",
        "justification": "Ikan sebelah (flatfish), profil morfologi asimetris sangat unik tapi pendaratan sedikit."
    },
    {
        "rank": 22,
        "local_name": "Tenggiri batang",
        "scientific_name": "Scomberomorus lineolatus",
        "valid_scientific_name": "Scomberomorus lineolatus (Cuvier, 1832)",
        "family": "Scombridae",
        "pipp_production_kg": 998,
        "avg_price_idr_kg": 65000,
        "score_prod_30": 4.0,
        "score_cons_20": 5.0,
        "score_img_25": 12.0,
        "score_tax_15": 12.0,
        "score_ai_10": 9.0,
        "prioritization_tier": "TIER_2_SECONDARY",
        "recommendation_status": "CANDIDATE_HIGH_VALUE",
        "justification": "Nilai ekonomi tertinggi (Rp 65rb/kg), namun volume pendaratan di bawah 1 ton."
    },
    {
        "rank": 23,
        "local_name": "Kurisi (nematophorus)",
        "scientific_name": "Nemipterus nematophorus",
        "valid_scientific_name": "Nemipterus nematophorus (Bleeker, 1854)",
        "family": "Nemipteridae",
        "pipp_production_kg": 713,
        "avg_price_idr_kg": 25000,
        "score_prod_30": 3.0,
        "score_cons_20": 5.0,
        "score_img_25": 10.0,
        "score_tax_15": 12.0,
        "score_ai_10": 8.0,
        "prioritization_tier": "TIER_3_EXCLUDED",
        "recommendation_status": "REJECTED_LOW_VOLUME",
        "justification": "Produksi terendah di daftar (<1 ton)."
    }
]

for sp in species_data:
    sp["total_weighted_score_100"] = round(
        sp["score_prod_30"] +
        sp["score_cons_20"] +
        sp["score_img_25"] +
        sp["score_tax_15"] +
        sp["score_ai_10"], 2
    )

df_matrix = pd.DataFrame(species_data)
# Sort by total score descending
df_matrix = df_matrix.sort_values(by="total_weighted_score_100", ascending=False).reset_index(drop=True)
df_matrix["final_rank"] = df_matrix.index + 1

matrix_path = os.path.join(REPORTS_11_DIR, "species_prioritization_matrix.csv")
df_matrix.to_csv(matrix_path, index=False, encoding="utf-8")
print("Saved prioritization matrix to:", matrix_path)
print(df_matrix[["final_rank", "local_name", "scientific_name", "pipp_production_kg", "total_weighted_score_100", "recommendation_status"]].head(8).to_string())

# 2. Generate image_source_inventory.csv for top candidates
inventory_data = [
    {
        "scientific_name": "Rastrelliger brachysoma",
        "local_name": "Kembung perempuan",
        "gbif_still_images_count": 35,
        "gbif_accepted_taxon_key": 2374319,
        "inaturalist_research_grade_avail": "YES (30+ observations in SE Asia)",
        "fishbase_photos_avail": "YES (8 diagnostic lateral photos)",
        "local_field_availability_karangantu": "SANGAT TINGGI (Pendaratan harian perahu bagan/payang, 10-50 kg/keranjang)",
        "primary_image_domain": "Foto pasar / nampan & spesimen segar lateral",
        "dominant_licenses": "CC BY-NC 4.0, CC BY 4.0",
        "sorting_tray_compatibility": "SANGAT TINGGI (Ukuran 15-22 cm, bentuk fusiform lebar, pas di papan ukur 50cm)",
        "visual_resolution_tier": "HIGH",
        "field_sampling_feasibility": "SANGAT TINGGI (Target survei 100-200 ekor di TPI Karangantu mudah tercapai)",
        "risk_assessment": "LOW (Ciri pembeda rasio TL/BD < 3.0 jelas membedakannya dari R. kanagurta)"
    },
    {
        "scientific_name": "Selaroides leptolepis",
        "local_name": "Selar kuning",
        "gbif_still_images_count": 179,
        "gbif_accepted_taxon_key": 2391083,
        "inaturalist_research_grade_avail": "SANGAT TINGGI (140+ observations)",
        "fishbase_photos_avail": "YES (15 lateral & diagnostic photos)",
        "local_field_availability_karangantu": "SANGAT TINGGI (Didaratkan rutin bersama kembung, mudah diperoleh)",
        "primary_image_domain": "Foto bawah air liar, foto pasar, foto spesimen",
        "dominant_licenses": "CC BY-NC 4.0, CC BY 4.0, CC0 1.0",
        "sorting_tray_compatibility": "SANGAT TINGGI (Ukuran 12-18 cm, pita kuning kontras sangat kuat untuk CNN/YOLO)",
        "visual_resolution_tier": "HIGH",
        "field_sampling_feasibility": "SANGAT TINGGI (Biaya murah, kondisi segar terjaga)",
        "risk_assessment": "VERY LOW (Spesies tunggal dalam genus Selaroides, fitur pita kuning tidak tertukar)"
    },
    {
        "scientific_name": "Upeneus sulphureus",
        "local_name": "Kuniran",
        "gbif_still_images_count": 67,
        "gbif_accepted_taxon_key": 2396734,
        "inaturalist_research_grade_avail": "TINGGI (50+ observations)",
        "fishbase_photos_avail": "YES (12 diagnostic photos)",
        "local_field_availability_karangantu": "TINGGI (Pendaratan demersal harian di TPI Karangantu)",
        "primary_image_domain": "Foto bawah air, foto pasar ikan, foto spesimen museum",
        "dominant_licenses": "CC BY-NC 4.0, CC BY 4.0",
        "sorting_tray_compatibility": "SANGAT TINGGI (Ukuran 12-18 cm, sungut dagu & garis kuning sangat diagnostik)",
        "visual_resolution_tier": "HIGH",
        "field_sampling_feasibility": "TINGGI (Mudah diperoleh dari nelayan jaring dasar/payang)",
        "risk_assessment": "LOW (Ekor tanpa corak belang silang membedakannya dari U. vittatus)"
    },
    {
        "scientific_name": "Leiognathus leuciscus / Equulites leuciscus",
        "local_name": "Peperek",
        "gbif_still_images_count": 14,
        "gbif_accepted_taxon_key": 8225573,
        "inaturalist_research_grade_avail": "MODERAT (10-15 observations)",
        "fishbase_photos_avail": "YES (6 diagnostic museum photos)",
        "local_field_availability_karangantu": "SANGAT TINGGI (Melimpah sebagai bycatch/tangkapan komersial payang)",
        "primary_image_domain": "Foto spesimen museum, foto tumpukan pasar",
        "dominant_licenses": "CC BY-NC 4.0, CC0 1.0",
        "sorting_tray_compatibility": "SEDANG (Ukuran kecil 6-12 cm, sangat tipis, lendir berlebih memicu glare)",
        "visual_resolution_tier": "MEDIUM",
        "field_sampling_feasibility": "SANGAT TINGGI (Harga murah Rp 12-15rb/kg, ratusan ekor dalam satu ember)",
        "risk_assessment": "MEDIUM-HIGH (Risiko tertukar dengan L. bindus atau Leiognathus lainnya di lapangan)"
    },
    {
        "scientific_name": "Stolephorus commersonii",
        "local_name": "Teri",
        "gbif_still_images_count": 0,
        "gbif_accepted_taxon_key": 2414002,
        "inaturalist_research_grade_avail": "SANGAT RENDAH (Hanya foto tumpukan)",
        "fishbase_photos_avail": "YES (3 museum specimens)",
        "local_field_availability_karangantu": "TINGGI (Musiman, didaratkan dalam peti kayu/keranjang basah)",
        "primary_image_domain": "Foto tumpukan teri basah (bulk mass)",
        "dominant_licenses": "TERBATAS",
        "sorting_tray_compatibility": "SANGAT RENDAH (Ukuran 3-7 cm, cepat hancur, tidak diukur satuan dengan mistar)",
        "visual_resolution_tier": "LOW",
        "field_sampling_feasibility": "RENDAH (Sulit memotret 1 ekor ortogonal tanpa sirip robek/hancur)",
        "risk_assessment": "CRITICAL_UNSUITABLE (Tidak layak untuk MVP pendeteksi ikan satuan dan kaliper TL)"
    }
]

df_inv = pd.DataFrame(inventory_data)
inv_path = os.path.join(REPORTS_11_DIR, "image_source_inventory.csv")
df_inv.to_csv(inv_path, index=False, encoding="utf-8")
print("\nSaved image inventory to:", inv_path)

# 3. Update species_reference.csv
# Preserve original SP-01 to SP-05, and append new validated candidate species from PIPP Karangantu
spec_ref_path = os.path.join(METADATA_DIR, "species_reference.csv")
df_spec_orig = pd.read_csv(spec_ref_path)
print(f"\nOriginal species_reference rows: {len(df_spec_orig)}")

new_species_entries = [
    {
        "species_id": "SP-06",
        "class_id": 0, # Candidate Class 0 (Replacing/re-centering Kembung to R. brachysoma)
        "scientific_name": "Rastrelliger brachysoma",
        "genus": "Rastrelliger",
        "family": "Scombridae",
        "order": "Scombriformes",
        "local_name_id": "Ikan Kembung Perempuan",
        "common_name_en": "Short Mackerel",
        "diagnostic_features": "Tubuh sangat tinggi dan pipih lateral (deep body), perbandingan panjang terhadap tinggi tubuh < 3.0; operkulum keperakan dengan totol samar; moncong lebih tumpul; 5 finlet dorsal dan 5 finlet anal terpisah.",
        "confusion_species": "Rastrelliger kanagurta (Kembung Lelaki)",
        "identification_keys": "R. brachysoma memiliki kedalaman tubuh 23-27% dari SL (tubuh membulat lebar), sisir saring insang 56-61; R. kanagurta bertubuh langsing (TL/BD > 3.4) dengan bintik gelap di bawah sirip dada.",
        "habitat_teluk_banten": "Perairan pelagis neritik dangkal Teluk Banten; komoditas nomor 1 PPN Karangantu (33,3 ton).",
        "verification_status": "PRIORITY_CANDIDATE"
    },
    {
        "species_id": "SP-07",
        "class_id": 1, # Candidate Class 1
        "scientific_name": "Selaroides leptolepis",
        "genus": "Selaroides",
        "family": "Carangidae",
        "order": "Carangiformes",
        "local_name_id": "Ikan Selar Kuning",
        "common_name_en": "Yellowstripe Scad",
        "diagnostic_features": "Pita kuning keemasan lebar membujur dari belakang mata hingga ke pangkal ekor; bintik hitam jelas pada tepi atas operkulum; scute kecil pada gurat sisi ekor; tubuh lonjong memanjang agak pipih.",
        "confusion_species": "Selar crumenophthalmus (Bentong), Alepes djedaba (Selar komo)",
        "identification_keys": "Pita kuning emas lebar sangat kontras dan terang; tidak memiliki finlet terpisah; mata berukuran sedang (tidak sebesar mata bentong).",
        "habitat_teluk_banten": "Pelagis pantai pesisir Teluk Banten, dasar karang dan pasir; komoditas nomor 4 PPN Karangantu (19,9 ton).",
        "verification_status": "PRIORITY_CANDIDATE"
    },
    {
        "species_id": "SP-08",
        "class_id": 2, # Candidate Class 2
        "scientific_name": "Upeneus sulphureus",
        "genus": "Upeneus",
        "family": "Mullidae",
        "order": "Syngnathiformes",
        "local_name_id": "Ikan Kuniran",
        "common_name_en": "Sulphur Goatfish / Yellow Goatfish",
        "diagnostic_features": "Memiliki sepasang sungut dagu (hyoid barbels) berwarna putih-kuning di bawah rahang bawah; dua garis kuning cerah membujur di sisi tubuh; sirip ekor tanpa corak garis gelap silang; sirip punggung berujung hitam.",
        "confusion_species": "Upeneus vittatus (Kuniran belang), Upeneus tragula",
        "identification_keys": "Cuping sirip ekor polos tanpa garis-garis melintang (plain caudal fin); sungut dagu panjang mencapai tepi preoperkulum.",
        "habitat_teluk_banten": "Demersal perairan pesisir dasar lumpur dan pasir Teluk Banten; komoditas nomor 3 PPN Karangantu (23,8 ton).",
        "verification_status": "PRIORITY_CANDIDATE"
    },
    {
        "species_id": "SP-09",
        "class_id": 3, # Candidate Class 3 / Auxiliary
        "scientific_name": "Equulites leuciscus",
        "genus": "Equulites",
        "family": "Leiognathidae",
        "order": "Acanthuriformes",
        "local_name_id": "Ikan Peperek / Peperek Topang",
        "common_name_en": "Whipfin Ponyfish",
        "diagnostic_features": "Tubuh sangat pipih lateral (compressed) dan keperakan; duri sirip punggung kedua memanjang seperti cambuk (whip-like); mulut dapat disembulkan ke bawah (protractile mouth); permukaan tubuh berlendir licin.",
        "confusion_species": "Photopectoralis bindus, Leiognathus berbis, Nuchequula spp",
        "identification_keys": "Duri dorsal kedua memanjang melebihi duri lainnya; garis-garis bergelombang cokelat samar pada punggung atas.",
        "habitat_teluk_banten": "Demersal neritik Teluk Banten; komoditas nomor 2 PPN Karangantu (32,2 ton).",
        "verification_status": "PROPOSED_AUXILIARY"
    },
    {
        "species_id": "SP-10",
        "class_id": -1, # Excluded for MVP
        "scientific_name": "Stolephorus commersonii",
        "genus": "Stolephorus",
        "family": "Engraulidae",
        "order": "Clupeiformes",
        "local_name_id": "Ikan Teri / Teri Nasi",
        "common_name_en": "Commerson's Anchovy",
        "diagnostic_features": "Tubuh sub-silindris memanjang transparan keperakan; moncong runcing menonjol melampaui rahang bawah; garis perak membujur di sisi tubuh; ukuran sangat kecil (panjang total 4-9 cm).",
        "confusion_species": "Encrasicholina devisi, Stolephorus indicus",
        "identification_keys": "Duri perut (abdominal scutes) hanya 1-4 di antara sirip dada dan sirip perut; maksila mencapai batas operkulum.",
        "habitat_teluk_banten": "Pelagis pesisir dan estuari Teluk Banten; komoditas nomor 5 PPN Karangantu (17,4 ton).",
        "verification_status": "EXCLUDED_UNSUITABLE_FOR_MVP"
    }
]

# Update SP-03 status in original if present or append
df_new_spec = pd.DataFrame(new_species_entries)
df_spec_combined = pd.concat([df_spec_orig, df_new_spec], ignore_index=True)
df_spec_combined.to_csv(spec_ref_path, index=False, encoding="utf-8")
print(f"Updated species_reference.csv: {len(df_spec_combined)} rows ({len(df_spec_orig)} original preserved + {len(df_new_spec)} candidates appended)")

print("\nPIPP PRIORITIZATION & INVENTORY DATASETS GENERATED SUCCESSFULLY!")
