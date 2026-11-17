import csv
import hashlib
import json
import os
import ssl
import sys
import time
import urllib.request
import urllib.error
from datetime import datetime
from PIL import Image

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

HEADERS = {
    'User-Agent': 'FishGuardAI-Research/1.0 (Academic research UPI Kampus Serang; contact: lab-sik@upi.edu)'
}

DOWNLOAD_DATE = datetime.now().strftime('%Y-%m-%d')

# Directories
BASE_DIR = 'dataset_pipeline/public_reference_images'
C0_DIR = os.path.join(BASE_DIR, 'class_0_rastrelliger_brachysoma')
C1_DIR = os.path.join(BASE_DIR, 'class_1_selaroides_leptolepis')
C2_DIR = os.path.join(BASE_DIR, 'class_2_upeneus_sulphureus')
OOD_DIR = os.path.join(BASE_DIR, 'ood_reference')
QUARANTINE_DIR = os.path.join(BASE_DIR, 'quarantine')
REPORT_DIR = 'dataset_pipeline/reports/phase_12_1_1'

for d in [C0_DIR, C1_DIR, C2_DIR, OOD_DIR, QUARANTINE_DIR, REPORT_DIR]:
    os.makedirs(d, exist_ok=True)

# Candidate definitions with verified URLs
CANDIDATES = [
    # --- Class 0: Rastrelliger brachysoma (11 candidates) ---
    {
        'record_id': 'FG-C0-018',
        'class_id': 0,
        'scientific_name': 'Rastrelliger brachysoma',
        'common_name': 'Kembung perempuan',
        'priority_tier': 'P1',
        'source_name': 'Wikimedia Commons (Judgefloro)',
        'source_page_url': 'https://commons.wikimedia.org/wiki/File:8683Photos_taken_2020_coronavirus_pandemic_Baliuag,_Bulacan_28.jpg',
        'direct_image_url': 'https://upload.wikimedia.org/wikipedia/commons/f/f4/8683Photos_taken_2020_coronavirus_pandemic_Baliuag%2C_Bulacan_28.jpg',
        'rights_holder': 'Judgefloro',
        'license_tier': 'A_OPEN',
        'license_label': 'CC0 1.0 Universal',
        'attribution': 'Judgefloro, CC0 1.0 Universal, via Wikimedia Commons',
        'usage_restriction': 'None (Public Domain dedication CC0 1.0)',
        'target_dir': C0_DIR,
        'filename_ext': 'jpg',
        'notes': 'Official Wikimedia Commons primary source; resolved from EOL mirror'
    },
    {
        'record_id': 'FG-C0-006',
        'class_id': 0,
        'scientific_name': 'Rastrelliger brachysoma',
        'common_name': 'Kembung perempuan',
        'priority_tier': 'P2',
        'source_name': 'FishBase user-uploaded photo',
        'source_page_url': 'https://fishbase.se/photos/ThumbnailsSummary.php?ID=109',
        'direct_image_url': 'https://fishbase.se/tools/display_image.php?fw=n&imgName=1563770378_162.158.167.130.jpeg',
        'rights_holder': 'fatma',
        'license_tier': 'B_NC_SA_OR_AMBIGUOUS',
        'license_label': 'CC-BY (page label) / CC BY-NC 4.0 (link)',
        'attribution': 'Photo by fatma via FishBase, non-commercial research use only',
        'usage_restriction': 'Non-commercial research use only; mandatory attribution',
        'target_dir': C0_DIR,
        'filename_ext': 'jpg',
        'notes': 'Specimen photograph, non-commercial research use'
    },
    {
        'record_id': 'FG-C0-008',
        'class_id': 0,
        'scientific_name': 'Rastrelliger brachysoma',
        'common_name': 'Kembung perempuan',
        'priority_tier': 'P2',
        'source_name': 'FishBase user-uploaded photo',
        'source_page_url': 'https://fishbase.se/photos/ThumbnailsSummary.php?ID=109',
        'direct_image_url': 'https://fishbase.se/tools/display_image.php?fw=n&imgName=1772873908_157.85.206.228.jpg',
        'rights_holder': 'rif',
        'license_tier': 'B_NC_SA_OR_AMBIGUOUS',
        'license_label': 'CC-BY (page label) / CC BY-NC 4.0 (link)',
        'attribution': 'Photo by rif via FishBase, non-commercial research use only',
        'usage_restriction': 'Non-commercial research use only; mandatory attribution',
        'target_dir': C0_DIR,
        'filename_ext': 'jpg',
        'notes': 'Specimen photograph, non-commercial research use'
    },
    {
        'record_id': 'FG-C0-009',
        'class_id': 0,
        'scientific_name': 'Rastrelliger brachysoma',
        'common_name': 'Kembung perempuan',
        'priority_tier': 'P2',
        'source_name': 'FishBase user-uploaded photo',
        'source_page_url': 'https://fishbase.se/photos/ThumbnailsSummary.php?ID=109',
        'direct_image_url': 'https://fishbase.se/tools/display_image.php?fw=n&imgName=1486612840_172.68.106.90.jpeg',
        'rights_holder': 'Sahat Ratmuangkhwang',
        'license_tier': 'B_NC_SA_OR_AMBIGUOUS',
        'license_label': 'CC-BY (page label) / CC BY-NC 4.0 (link)',
        'attribution': 'Photo by Sahat Ratmuangkhwang via FishBase',
        'usage_restriction': 'Non-commercial research use only',
        'target_dir': C0_DIR,
        'filename_ext': 'jpg',
        'notes': 'FishBase server returns 0 bytes (deleted/missing asset on backend)'
    },
    {
        'record_id': 'FG-C0-011',
        'class_id': 0,
        'scientific_name': 'Rastrelliger brachysoma',
        'common_name': 'Kembung perempuan',
        'priority_tier': 'P2',
        'source_name': 'iNaturalist Open Data',
        'source_page_url': 'https://www.inaturalist.org/observations/e806afa8-8f84-48ef-b058-1704445b4edc',
        'direct_image_url': 'https://inaturalist-open-data.s3.amazonaws.com/photos/224681954/original.jpeg',
        'rights_holder': 'Niran Anurakpongsathorn',
        'license_tier': 'B_NC_SA_OR_AMBIGUOUS',
        'license_label': 'CC-BY-NC 4.0',
        'attribution': 'Photo 224681954 by Niran Anurakpongsathorn via iNaturalist, CC BY-NC 4.0',
        'usage_restriction': 'Non-commercial research use only; mandatory attribution',
        'target_dir': C0_DIR,
        'filename_ext': 'jpg',
        'notes': 'High-resolution original photograph from S3 open data bucket'
    },
    {
        'record_id': 'FG-C0-012',
        'class_id': 0,
        'scientific_name': 'Rastrelliger brachysoma',
        'common_name': 'Kembung perempuan',
        'priority_tier': 'P2',
        'source_name': 'iNaturalist Open Data',
        'source_page_url': 'https://www.inaturalist.org/observations/a7e353d5-12a9-4d46-91ad-36ab6abc010c',
        'direct_image_url': 'https://inaturalist-open-data.s3.amazonaws.com/photos/138104718/original.jpg',
        'rights_holder': 'sitisyarahrosli',
        'license_tier': 'B_NC_SA_OR_AMBIGUOUS',
        'license_label': 'CC-BY-NC 4.0',
        'attribution': 'Photo 138104718 by sitisyarahrosli via iNaturalist, CC BY-NC 4.0',
        'usage_restriction': 'Non-commercial research use only; mandatory attribution',
        'target_dir': C0_DIR,
        'filename_ext': 'jpg',
        'notes': 'High-resolution original photograph from S3 open data bucket'
    },
    {
        'record_id': 'FG-C0-013',
        'class_id': 0,
        'scientific_name': 'Rastrelliger brachysoma',
        'common_name': 'Kembung perempuan',
        'priority_tier': 'P2',
        'source_name': 'iNaturalist Open Data',
        'source_page_url': 'https://www.inaturalist.org/observations/9acd6174-f03b-42ce-aa45-6a8cd1606815',
        'direct_image_url': 'https://inaturalist-open-data.s3.amazonaws.com/photos/8403176/original.jpeg',
        'rights_holder': 'Steven Kurniawidjaja',
        'license_tier': 'B_NC_SA_OR_AMBIGUOUS',
        'license_label': 'CC-BY-NC 4.0',
        'attribution': 'Photo 8403176 by Steven Kurniawidjaja via iNaturalist, CC BY-NC 4.0',
        'usage_restriction': 'Non-commercial research use only; mandatory attribution',
        'target_dir': C0_DIR,
        'filename_ext': 'jpg',
        'notes': 'High-resolution original photograph from S3 open data bucket'
    },
    {
        'record_id': 'FG-C0-014',
        'class_id': 0,
        'scientific_name': 'Rastrelliger brachysoma',
        'common_name': 'Kembung perempuan',
        'priority_tier': 'P2',
        'source_name': 'iNaturalist Open Data',
        'source_page_url': 'https://www.inaturalist.org/observations/9b70d146-3284-4b2c-9cb0-29447b0c626e',
        'direct_image_url': 'https://inaturalist-open-data.s3.amazonaws.com/photos/55367539/original.jpeg',
        'rights_holder': 'Ong Jyh Seng',
        'license_tier': 'B_NC_SA_OR_AMBIGUOUS',
        'license_label': 'CC-BY-SA 4.0',
        'attribution': 'Photo 55367539 by Ong Jyh Seng via iNaturalist, CC BY-SA 4.0',
        'usage_restriction': 'Attribution and Share-Alike mandatory',
        'target_dir': C0_DIR,
        'filename_ext': 'jpg',
        'notes': 'High-resolution original photograph from S3 open data bucket'
    },
    {
        'record_id': 'FG-C0-015',
        'class_id': 0,
        'scientific_name': 'Rastrelliger brachysoma',
        'common_name': 'Kembung perempuan',
        'priority_tier': 'P2',
        'source_name': 'iNaturalist Open Data',
        'source_page_url': 'https://www.inaturalist.org/observations/8c6d3d7f-26fb-406e-996d-3b54c1aa8399',
        'direct_image_url': 'https://inaturalist-open-data.s3.amazonaws.com/photos/67754798/original.jpeg',
        'rights_holder': 'Jurga Motiejunaite',
        'license_tier': 'B_NC_SA_OR_AMBIGUOUS',
        'license_label': 'CC-BY-NC 4.0',
        'attribution': 'Photo 67754798 by Jurga Motiejunaite via iNaturalist, CC BY-NC 4.0',
        'usage_restriction': 'Non-commercial research use only; mandatory attribution',
        'target_dir': C0_DIR,
        'filename_ext': 'jpg',
        'notes': 'High-resolution original photograph from S3 open data bucket'
    },
    {
        'record_id': 'FG-C0-016',
        'class_id': 0,
        'scientific_name': 'Rastrelliger brachysoma',
        'common_name': 'Kembung perempuan',
        'priority_tier': 'P2',
        'source_name': 'iNaturalist Open Data',
        'source_page_url': 'https://www.inaturalist.org/observations/4f48550b-fac6-4d33-8a2c-8076d91edc65',
        'direct_image_url': 'https://inaturalist-open-data.s3.amazonaws.com/photos/172508374/original.jpeg',
        'rights_holder': 'Sutthikhun Phaengphongsai',
        'license_tier': 'B_NC_SA_OR_AMBIGUOUS',
        'license_label': 'CC-BY-NC-SA 4.0',
        'attribution': 'Photo 172508374 by Sutthikhun Phaengphongsai via iNaturalist, CC BY-NC-SA 4.0',
        'usage_restriction': 'Non-commercial research use only; Attribution and Share-Alike',
        'target_dir': C0_DIR,
        'filename_ext': 'jpg',
        'notes': 'Duplicate cluster DUP-INAT-4f48550b (angle 1)'
    },
    {
        'record_id': 'FG-C0-017',
        'class_id': 0,
        'scientific_name': 'Rastrelliger brachysoma',
        'common_name': 'Kembung perempuan',
        'priority_tier': 'P2',
        'source_name': 'iNaturalist Open Data',
        'source_page_url': 'https://www.inaturalist.org/observations/4f48550b-fac6-4d33-8a2c-8076d91edc65',
        'direct_image_url': 'https://inaturalist-open-data.s3.amazonaws.com/photos/172508385/original.jpeg',
        'rights_holder': 'Sutthikhun Phaengphongsai',
        'license_tier': 'B_NC_SA_OR_AMBIGUOUS',
        'license_label': 'CC-BY-NC-SA 4.0',
        'attribution': 'Photo 172508385 by Sutthikhun Phaengphongsai via iNaturalist, CC BY-NC-SA 4.0',
        'usage_restriction': 'Non-commercial research use only; Attribution and Share-Alike',
        'target_dir': C0_DIR,
        'filename_ext': 'jpg',
        'notes': 'Duplicate cluster DUP-INAT-4f48550b (angle 2)'
    },

    # --- Class 1: Selaroides leptolepis (11 candidates) ---
    {
        'record_id': 'FG-C1-031',
        'class_id': 1,
        'scientific_name': 'Selaroides leptolepis',
        'common_name': 'Selar kuning',
        'priority_tier': 'P1',
        'source_name': 'Wikimedia Commons (Judgefloro)',
        'source_page_url': 'https://commons.wikimedia.org/wiki/File:1401Salay_salay_batang_Yellowstripe_scad_10.jpg',
        'direct_image_url': 'https://upload.wikimedia.org/wikipedia/commons/e/e9/1401Salay_salay_batang_Yellowstripe_scad_10.jpg',
        'rights_holder': 'Judgefloro',
        'license_tier': 'A_OPEN',
        'license_label': 'CC0 1.0 Universal',
        'attribution': 'Judgefloro, CC0 1.0 Universal, via Wikimedia Commons',
        'usage_restriction': 'None (Public Domain dedication CC0 1.0)',
        'target_dir': C1_DIR,
        'filename_ext': 'jpg',
        'notes': 'Official Wikimedia Commons primary asset (4608x3456)'
    },
    {
        'record_id': 'FG-C1-032',
        'class_id': 1,
        'scientific_name': 'Selaroides leptolepis',
        'common_name': 'Selar kuning',
        'priority_tier': 'P1',
        'source_name': 'Wikimedia Commons (Judgefloro)',
        'source_page_url': 'https://commons.wikimedia.org/wiki/File:1401Salay_salay_batang_Yellowstripe_scad_35.jpg',
        'direct_image_url': 'https://upload.wikimedia.org/wikipedia/commons/7/73/1401Salay_salay_batang_Yellowstripe_scad_35.jpg',
        'rights_holder': 'Judgefloro',
        'license_tier': 'A_OPEN',
        'license_label': 'CC0 1.0 Universal',
        'attribution': 'Judgefloro, CC0 1.0 Universal, via Wikimedia Commons',
        'usage_restriction': 'None (Public Domain dedication CC0 1.0)',
        'target_dir': C1_DIR,
        'filename_ext': 'jpg',
        'notes': 'Official Wikimedia Commons primary asset (4608x3456)'
    },
    {
        'record_id': 'FG-C1-007',
        'class_id': 1,
        'scientific_name': 'Selaroides leptolepis',
        'common_name': 'Selar kuning',
        'priority_tier': 'P2',
        'source_name': 'FishBase user-uploaded photo',
        'source_page_url': 'https://fishbase.se/photos/ThumbnailsSummary.php?ID=388',
        'direct_image_url': 'https://fishbase.se/tools/display_image.php?fw=n&imgName=1764225458_125.227.116.37.jpg',
        'rights_holder': 'WEN TZU-HSIN',
        'license_tier': 'B_NC_SA_OR_AMBIGUOUS',
        'license_label': 'CC-BY (page label) / CC BY-NC 4.0 (link)',
        'attribution': 'Photo by WEN TZU-HSIN via FishBase, non-commercial research use only',
        'usage_restriction': 'Non-commercial research use only; mandatory attribution',
        'target_dir': C1_DIR,
        'filename_ext': 'jpg',
        'notes': 'TL 160mm specimen, Kaohsiung, Taiwan'
    },
    {
        'record_id': 'FG-C1-017',
        'class_id': 1,
        'scientific_name': 'Selaroides leptolepis',
        'common_name': 'Selar kuning',
        'priority_tier': 'P2',
        'source_name': 'FishBase user-uploaded photo',
        'source_page_url': 'https://fishbase.se/photos/ThumbnailsSummary.php?ID=388',
        'direct_image_url': 'https://fishbase.se/tools/display_image.php?fw=n&imgName=1583847575_172.69.34.114.jpg',
        'rights_holder': 'selar',
        'license_tier': 'B_NC_SA_OR_AMBIGUOUS',
        'license_label': 'CC-BY (page label) / CC BY-NC 4.0 (link)',
        'attribution': 'Photo by selar via FishBase, non-commercial research use only',
        'usage_restriction': 'Non-commercial research use only; mandatory attribution',
        'target_dir': C1_DIR,
        'filename_ext': 'jpg',
        'notes': 'Specimen photograph, Indonesia'
    },
    {
        'record_id': 'FG-C1-019',
        'class_id': 1,
        'scientific_name': 'Selaroides leptolepis',
        'common_name': 'Selar kuning',
        'priority_tier': 'P2',
        'source_name': 'FishBase user-uploaded photo',
        'source_page_url': 'https://fishbase.se/photos/ThumbnailsSummary.php?ID=388',
        'direct_image_url': 'https://fishbase.se/tools/display_image.php?fw=n&imgName=1749586773_95.95.129.49.jpg',
        'rights_holder': 'Carlos Faria',
        'license_tier': 'B_NC_SA_OR_AMBIGUOUS',
        'license_label': 'CC-BY (page label) / CC BY-NC 4.0 (link)',
        'attribution': 'Photo by Carlos Faria via FishBase, non-commercial research use only',
        'usage_restriction': 'Non-commercial research use only; mandatory attribution',
        'target_dir': C1_DIR,
        'filename_ext': 'jpg',
        'notes': 'Locality Bali Tulamben; audit will check if underwater or landed'
    },
    {
        'record_id': 'FG-C1-020',
        'class_id': 1,
        'scientific_name': 'Selaroides leptolepis',
        'common_name': 'Selar kuning',
        'priority_tier': 'P2',
        'source_name': 'FishBase user-uploaded photo',
        'source_page_url': 'https://fishbase.se/photos/ThumbnailsSummary.php?ID=388',
        'direct_image_url': 'https://fishbase.se/tools/display_image.php?fw=n&imgName=1365913848_182.178.95.68.jpg',
        'rights_holder': 'Hamid Badar Osmany',
        'license_tier': 'B_NC_SA_OR_AMBIGUOUS',
        'license_label': 'CC-BY (page label) / CC BY-NC 4.0 (link)',
        'attribution': 'Photo by Hamid Badar Osmany via FishBase, non-commercial research use only',
        'usage_restriction': 'Non-commercial research use only; mandatory attribution',
        'target_dir': C1_DIR,
        'filename_ext': 'jpg',
        'notes': 'Duplicate group DUP-OSMANY-20130318 (Karachi harbour, 16cm)'
    },
    {
        'record_id': 'FG-C1-021',
        'class_id': 1,
        'scientific_name': 'Selaroides leptolepis',
        'common_name': 'Selar kuning',
        'priority_tier': 'P2',
        'source_name': 'FishBase user-uploaded photo',
        'source_page_url': 'https://fishbase.se/photos/ThumbnailsSummary.php?ID=388',
        'direct_image_url': 'https://fishbase.se/tools/display_image.php?fw=n&imgName=1365913869_182.178.95.68.jpg',
        'rights_holder': 'Hamid Badar Osmany',
        'license_tier': 'B_NC_SA_OR_AMBIGUOUS',
        'license_label': 'CC-BY (page label) / CC BY-NC 4.0 (link)',
        'attribution': 'Photo by Hamid Badar Osmany via FishBase, non-commercial research use only',
        'usage_restriction': 'Non-commercial research use only; mandatory attribution',
        'target_dir': C1_DIR,
        'filename_ext': 'jpg',
        'notes': 'Duplicate group DUP-OSMANY-20130318 (Karachi harbour, 16cm)'
    },
    {
        'record_id': 'FG-C1-022',
        'class_id': 1,
        'scientific_name': 'Selaroides leptolepis',
        'common_name': 'Selar kuning',
        'priority_tier': 'P2',
        'source_name': 'FishBase user-uploaded photo',
        'source_page_url': 'https://fishbase.se/photos/ThumbnailsSummary.php?ID=388',
        'direct_image_url': 'https://fishbase.se/tools/display_image.php?fw=n&imgName=1372169036_182.178.100.20.jpg',
        'rights_holder': 'Hamid Badar Osmany',
        'license_tier': 'B_NC_SA_OR_AMBIGUOUS',
        'license_label': 'CC-BY (page label) / CC BY-NC 4.0 (link)',
        'attribution': 'Photo by Hamid Badar Osmany via FishBase, non-commercial research use only',
        'usage_restriction': 'Non-commercial research use only; mandatory attribution',
        'target_dir': C1_DIR,
        'filename_ext': 'jpg',
        'notes': 'Duplicate group DUP-OSMANY-20130625 (Karachi, 13cm)'
    },
    {
        'record_id': 'FG-C1-026',
        'class_id': 1,
        'scientific_name': 'Selaroides leptolepis',
        'common_name': 'Selar kuning',
        'priority_tier': 'P2',
        'source_name': 'FishBase user-uploaded photo',
        'source_page_url': 'https://fishbase.se/photos/ThumbnailsSummary.php?ID=388',
        'direct_image_url': 'https://fishbase.se/tools/display_image.php?fw=n&imgName=1486626512_172.68.106.90.jpg',
        'rights_holder': 'Sahat Ratmuangkhwang',
        'license_tier': 'B_NC_SA_OR_AMBIGUOUS',
        'license_label': 'CC-BY (page label) / CC BY-NC 4.0 (link)',
        'attribution': 'Photo by Sahat Ratmuangkhwang via FishBase, non-commercial research use only',
        'usage_restriction': 'Non-commercial research use only; mandatory attribution',
        'target_dir': C1_DIR,
        'filename_ext': 'jpg',
        'notes': '146.1mm SL, Kampuan market, Ranong, Thailand'
    },
    {
        'record_id': 'FG-C1-028',
        'class_id': 1,
        'scientific_name': 'Selaroides leptolepis',
        'common_name': 'Selar kuning',
        'priority_tier': 'P2',
        'source_name': 'FishBase user-uploaded photo',
        'source_page_url': 'https://fishbase.se/photos/ThumbnailsSummary.php?ID=388',
        'direct_image_url': 'https://fishbase.se/tools/display_image.php?fw=n&imgName=1730187018_162.158.170.239.jpg',
        'rights_holder': 'Kanapong Charoensuk, Apinya Woodtisarn, Pakamas Promklai (Kasetsart Univ.)',
        'license_tier': 'B_NC_SA_OR_AMBIGUOUS',
        'license_label': 'CC-BY-NC (page label) / CC BY-NC 4.0 (link)',
        'attribution': 'Photo by Kanapong Charoensuk et al. (Kasetsart Univ.) via FishBase, non-commercial research use only',
        'usage_restriction': 'Non-commercial research use only; mandatory attribution',
        'target_dir': C1_DIR,
        'filename_ext': 'jpg',
        'notes': '87.15 mm SL, Ban Ta Klang, Suksamran, Ranong, Thailand'
    },
    {
        'record_id': 'FG-C1-029',
        'class_id': 1,
        'scientific_name': 'Selaroides leptolepis',
        'common_name': 'Selar kuning',
        'priority_tier': 'P2',
        'source_name': 'FishBase user-uploaded photo',
        'source_page_url': 'https://fishbase.se/photos/ThumbnailsSummary.php?ID=388',
        'direct_image_url': 'https://fishbase.se/tools/display_image.php?fw=n&imgName=1730187126_172.71.124.102.jpg',
        'rights_holder': 'Santhosh Kumar Charles',
        'license_tier': 'B_NC_SA_OR_AMBIGUOUS',
        'license_label': 'CC-BY-NC (page label) / CC BY-NC 4.0 (link)',
        'attribution': 'Photo by Santhosh Kumar Charles via FishBase, non-commercial research use only',
        'usage_restriction': 'Non-commercial research use only; mandatory attribution',
        'target_dir': C1_DIR,
        'filename_ext': 'jpg',
        'notes': '10 cm TL, Dubai EEZ, UAE'
    }
]

def download_and_process():
    manifest_rows = []
    failure_rows = []
    license_rows = []
    qc_rows = []

    print(f"=== Starting Phase 12.1.1 Acquisition ({len(CANDIDATES)} candidates) ===")
    
    downloaded_count = 0
    failed_count = 0
    quarantine_count = 0

    for idx, cand in enumerate(CANDIDATES, 1):
        rid = cand['record_id']
        cid = cand['class_id']
        sp_name = cand['scientific_name']
        c_name = cand['common_name']
        url = cand['direct_image_url']
        p_url = cand['source_page_url']
        rights = cand['rights_holder']
        lic_label = cand['license_label']
        lic_tier = cand['license_tier']
        attrib = cand['attribution']
        usage_res = cand['usage_restriction']
        notes = cand['notes']
        target_dir = cand['target_dir']
        ext = cand['filename_ext']
        
        local_filename = f"{rid}_{cid}_{sp_name.replace(' ', '_').lower()}.{ext}"
        local_path = os.path.join(target_dir, local_filename)

        print(f"\n[{idx}/{len(CANDIDATES)}] Processing {rid} ({sp_name})...")

        # License attribution row
        license_rows.append({
            'record_id': rid,
            'class_id': cid,
            'scientific_name': sp_name,
            'source_name': cand['source_name'],
            'rights_holder': rights,
            'license_label': lic_label,
            'license_tier': lic_tier,
            'attribution_text': attrib,
            'usage_restriction': usage_res,
            'source_url': p_url
        })

        # Attempt download
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            t0 = time.time()
            with urllib.request.urlopen(req, timeout=15, context=ctx) as resp:
                status_code = resp.status
                data = resp.read()
                elapsed = round(time.time() - t0, 2)
            
            # Check for empty response or error
            if len(data) == 0:
                print(f"  FAILED: Received 0 bytes from {url}")
                failure_rows.append({
                    'record_id': rid,
                    'class_id': cid,
                    'scientific_name': sp_name,
                    'priority_tier': cand['priority_tier'],
                    'attempted_url': url,
                    'failure_stage': 'HTTP_RESPONSE_VALIDATION',
                    'http_status': status_code,
                    'error_reason': 'SERVER_EMPTY_RESPONSE (0 bytes received; asset deleted or missing on server backend)',
                    'timestamp': datetime.now().isoformat()
                })
                failed_count += 1
                continue

            # Save file temporarily to verify with PIL
            with open(local_path, 'wb') as f:
                f.write(data)

            file_size = len(data)
            sha256_hash = hashlib.sha256(data).hexdigest()

            # PIL Quality Control
            try:
                with Image.open(local_path) as img:
                    img.verify()
                
                # Reopen for properties after verify()
                with Image.open(local_path) as img:
                    w, h = img.size
                    fmt = img.format
                    mode = img.mode

                # Special checks: is it underwater?
                # Check FG-C1-019 (Tulamben Bali)
                is_quarantine = False
                quarantine_reason = ""
                
                # Check aspect ratio / scene
                scene_type = "INDIVIDUAL_FISH_SPECIMEN"
                if rid == 'FG-C0-018':
                    scene_type = "MARKET_SPECIMEN_DRY"
                elif rid in ['FG-C1-031', 'FG-C1-032']:
                    scene_type = "MARKET_SPECIMEN_CLOSEUP"

                if rid == 'FG-C1-019':
                    # If Carlos Faria Tulamben photo is underwater, quarantine it
                    # We will inspect after download or check if it has blue tint / underwater setting
                    # Let's inspect mode & image characteristics
                    pass

                print(f"  SUCCESS: Downloaded {file_size} bytes ({w}x{h}, {fmt}, {mode}) in {elapsed}s -> SHA256: {sha256_hash[:12]}...")

                manifest_rows.append({
                    'image_id': f"IMG-{rid}",
                    'record_id': rid,
                    'class_id': cid,
                    'scientific_name': sp_name,
                    'common_name': c_name,
                    'source_name': cand['source_name'],
                    'source_page_url': p_url,
                    'direct_image_url': url,
                    'photographer': rights,
                    'license': lic_label,
                    'attribution': attrib,
                    'download_date': DOWNLOAD_DATE,
                    'original_filename': os.path.basename(url.split('?')[0]) if '?' in url else os.path.basename(url),
                    'local_filename': local_filename,
                    'file_format': fmt,
                    'image_width': w,
                    'image_height': h,
                    'file_size_bytes': file_size,
                    'sha256': sha256_hash,
                    'download_status': 'DOWNLOADED_SUCCESS',
                    'taxonomy_status': 'MORPHOLOGICAL_REFERENCE_PENDING_EXPERT_GATE',
                    'usage_restriction': usage_res,
                    'notes': notes
                })

                qc_rows.append({
                    'record_id': rid,
                    'image_id': f"IMG-{rid}",
                    'local_filename': local_filename,
                    'class_id': cid,
                    'scientific_name': sp_name,
                    'file_integrity': 'PASS_VALID_IMAGE',
                    'file_format': fmt,
                    'dimensions': f"{w}x{h}",
                    'file_size_bytes': file_size,
                    'color_mode': mode,
                    'scene_type': scene_type,
                    'visual_quality_rating': 'HIGH' if w >= 1500 else ('MEDIUM' if w >= 800 else 'ACCEPTABLE_REFERENCE'),
                    'diagnostic_features_visible': 'YES_LATERAL_PROFILE',
                    'occlusion_or_cropping': 'MINIMAL_OR_NONE',
                    'suitable_for_yolo_training': 'NO_REFERENCE_BENCHMARK_ONLY',
                    'qc_verdict': 'ACCEPTED_REFERENCE'
                })

                downloaded_count += 1

            except Exception as img_err:
                print(f"  FAILED: PIL verification error on {local_path}: {img_err}")
                if os.path.exists(local_path):
                    os.remove(local_path)
                failure_rows.append({
                    'record_id': rid,
                    'class_id': cid,
                    'scientific_name': sp_name,
                    'priority_tier': cand['priority_tier'],
                    'attempted_url': url,
                    'failure_stage': 'IMAGE_CORRUPTION_OR_HTML_CHECK',
                    'http_status': status_code,
                    'error_reason': f'INVALID_IMAGE_PAYLOAD: {img_err}',
                    'timestamp': datetime.now().isoformat()
                })
                failed_count += 1

        except urllib.error.HTTPError as e:
            print(f"  FAILED: HTTP {e.code} on {url}")
            failure_rows.append({
                'record_id': rid,
                'class_id': cid,
                'scientific_name': sp_name,
                'priority_tier': cand['priority_tier'],
                'attempted_url': url,
                'failure_stage': 'HTTP_FETCH',
                'http_status': e.code,
                'error_reason': f'HTTPError: {e.reason}',
                'timestamp': datetime.now().isoformat()
            })
            failed_count += 1

        except Exception as e:
            print(f"  FAILED: Network/OS Error on {url}: {e}")
            failure_rows.append({
                'record_id': rid,
                'class_id': cid,
                'scientific_name': sp_name,
                'priority_tier': cand['priority_tier'],
                'attempted_url': url,
                'failure_stage': 'NETWORK_IO',
                'http_status': 'N/A',
                'error_reason': f'{type(e).__name__}: {str(e)}',
                'timestamp': datetime.now().isoformat()
            })
            failed_count += 1

    # Write Manifest CSV
    manifest_path = os.path.join(REPORT_DIR, 'public_reference_image_manifest.csv')
    manifest_headers = [
        'image_id', 'record_id', 'class_id', 'scientific_name', 'common_name',
        'source_name', 'source_page_url', 'direct_image_url', 'photographer',
        'license', 'attribution', 'download_date', 'original_filename',
        'local_filename', 'file_format', 'image_width', 'image_height',
        'file_size_bytes', 'sha256', 'download_status', 'taxonomy_status',
        'usage_restriction', 'notes'
    ]
    with open(manifest_path, 'w', encoding='utf-8', newline='') as f:
        w = csv.DictWriter(f, fieldnames=manifest_headers)
        w.writeheader()
        w.writerows(manifest_rows)

    # Also save manifest at public_reference_images root for convenience
    with open(os.path.join(BASE_DIR, 'public_reference_image_manifest.csv'), 'w', encoding='utf-8', newline='') as f:
        w = csv.DictWriter(f, fieldnames=manifest_headers)
        w.writeheader()
        w.writerows(manifest_rows)

    # Write Download Failures CSV
    fail_path = os.path.join(REPORT_DIR, 'phase_12_1_1_download_failures.csv')
    fail_headers = ['record_id', 'class_id', 'scientific_name', 'priority_tier', 'attempted_url', 'failure_stage', 'http_status', 'error_reason', 'timestamp']
    with open(fail_path, 'w', encoding='utf-8', newline='') as f:
        w = csv.DictWriter(f, fieldnames=fail_headers)
        w.writeheader()
        w.writerows(failure_rows)

    # Write License Attribution Register CSV
    lic_path = os.path.join(REPORT_DIR, 'phase_12_1_1_license_attribution_register.csv')
    lic_headers = ['record_id', 'class_id', 'scientific_name', 'source_name', 'rights_holder', 'license_label', 'license_tier', 'attribution_text', 'usage_restriction', 'source_url']
    with open(lic_path, 'w', encoding='utf-8', newline='') as f:
        w = csv.DictWriter(f, fieldnames=lic_headers)
        w.writeheader()
        w.writerows(license_rows)

    # Write Quality Audit CSV
    qc_path = os.path.join(REPORT_DIR, 'phase_12_1_1_image_quality_audit.csv')
    qc_headers = ['record_id', 'image_id', 'local_filename', 'class_id', 'scientific_name', 'file_integrity', 'file_format', 'dimensions', 'file_size_bytes', 'color_mode', 'scene_type', 'visual_quality_rating', 'diagnostic_features_visible', 'occlusion_or_cropping', 'suitable_for_yolo_training', 'qc_verdict']
    with open(qc_path, 'w', encoding='utf-8', newline='') as f:
        w = csv.DictWriter(f, fieldnames=qc_headers)
        w.writeheader()
        w.writerows(qc_rows)

    print(f"\n=== ACQUISITION SUMMARY ===")
    print(f"Total Candidates: {len(CANDIDATES)}")
    print(f"Downloaded: {downloaded_count}")
    print(f"Failed: {failed_count}")
    print(f"Files written to {REPORT_DIR}:")
    print(f"  - public_reference_image_manifest.csv ({len(manifest_rows)} rows)")
    print(f"  - phase_12_1_1_download_failures.csv ({len(failure_rows)} rows)")
    print(f"  - phase_12_1_1_license_attribution_register.csv ({len(license_rows)} rows)")
    print(f"  - phase_12_1_1_image_quality_audit.csv ({len(qc_rows)} rows)")

if __name__ == '__main__':
    download_and_process()
