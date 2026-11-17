import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
HEADERS = {'User-Agent': 'FishGuardAI-Research/1.0 (Academic research UPI Serang)'}

c1_fb_candidates = {
    'FG-C1-007': 'https://fishbase.se/tools/display_image.php?fw=n&imgName=1764225458_125.227.116.37.jpg',
    'FG-C1-017': 'https://fishbase.se/tools/display_image.php?fw=n&imgName=1583847575_172.69.34.114.jpg',
    'FG-C1-019': 'https://fishbase.se/tools/display_image.php?fw=n&imgName=1749586773_95.95.129.49.jpg',
    'FG-C1-020': 'https://fishbase.se/tools/display_image.php?fw=n&imgName=1365913848_182.178.95.68.jpg',
    'FG-C1-021': 'https://fishbase.se/tools/display_image.php?fw=n&imgName=1365913869_182.178.95.68.jpg',
    'FG-C1-022': 'https://fishbase.se/tools/display_image.php?fw=n&imgName=1372169036_182.178.100.20.jpg',
    'FG-C1-026': 'https://fishbase.se/tools/display_image.php?fw=n&imgName=1486626512_172.68.106.90.jpg',
    'FG-C1-028': 'https://fishbase.se/tools/display_image.php?fw=n&imgName=1730187018_162.158.170.239.jpg',
    'FG-C1-029': 'https://fishbase.se/tools/display_image.php?fw=n&imgName=1730187126_172.71.124.102.jpg'
}

print("Testing FishBase Class 1 display_image URLs:")
for rid, u in c1_fb_candidates.items():
    try:
        req = urllib.request.Request(u, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=10, context=ctx) as r:
            data = r.read()
            ctype = r.headers.get('Content-Type')
            print(f"  {rid}: Status={r.status}, Content-Type={ctype}, Bytes={len(data)}")
    except Exception as e:
        print(f"  {rid}: Error={e}")
