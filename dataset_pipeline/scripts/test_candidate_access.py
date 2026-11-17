import urllib.request
import urllib.error
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

HEADERS = {'User-Agent': 'FishGuardAI-Research/1.0 (Academic research UPI Serang)'}

def test_inat_all():
    records = {
        'FG-C0-011': '224681954',
        'FG-C0-012': '138104718',
        'FG-C0-013': '8403176',
        'FG-C0-014': '55367539',
        'FG-C0-015': '67754798',
        'FG-C0-016': '172508374',
        'FG-C0-017': '172508385'
    }
    print("Testing iNaturalist S3 URLs for original / large resolution:")
    results = {}
    for rid, pid in records.items():
        found = False
        for res in ['original', 'large', 'medium', 'small']:
            for ext in ['jpeg', 'jpg']:
                u = f"https://inaturalist-open-data.s3.amazonaws.com/photos/{pid}/{res}.{ext}"
                try:
                    req = urllib.request.Request(u, headers=HEADERS, method='HEAD')
                    with urllib.request.urlopen(req, timeout=5, context=ctx) as r:
                        if r.status == 200:
                            results[rid] = (u, res, r.headers.get('Content-Length'))
                            print(f"  {rid} (photo {pid}): Found {res}.{ext}, size={r.headers.get('Content-Length')} bytes")
                            found = True
                            break
                except Exception:
                    pass
            if found:
                break
        if not found:
            print(f"  {rid} (photo {pid}): NOT FOUND on S3")
    return results

def test_fishbase_c0():
    urls = {
        'FG-C0-006': 'https://fishbase.se/tools/display_image.php?fw=n&imgName=1563770378_162.158.167.130.jpeg',
        'FG-C0-008': 'https://fishbase.se/tools/display_image.php?fw=n&imgName=1772873908_157.85.206.228.jpg',
        'FG-C0-009': 'https://fishbase.se/tools/display_image.php?fw=n&imgName=1486612840_172.68.106.90.jpeg'
    }
    print("\nTesting FishBase Class 0 display_image URLs:")
    for rid, u in urls.items():
        try:
            req = urllib.request.Request(u, headers=HEADERS, method='HEAD')
            with urllib.request.urlopen(req, timeout=8, context=ctx) as r:
                print(f"  {rid}: Status={r.status}, Content-Type={r.headers.get('Content-Type')}, Size={r.headers.get('Content-Length')}")
        except Exception as e:
            print(f"  {rid}: Error={e}")

def test_fishbase_c1_page():
    url = "https://fishbase.se/photos/ThumbnailsSummary.php?ID=388"
    print(f"\nTesting FishBase Class 1 page ({url}):")
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=10, context=ctx) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            print(f"  Page loaded, length: {len(html)} chars")
            # find display_image or image links
            links = re.findall(r'display_image\.php\?[^"\' >]+', html)
            print(f"  Found display_image links: {len(links)}")
            for l in links[:10]:
                print(f"    https://fishbase.se/tools/{l}")
            # also find img tags
            imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', html)
            print(f"  Found img src tags: {len(imgs)}")
            for im in imgs[:10]:
                print(f"    {im}")
    except Exception as e:
        print(f"  Page error: {e}")

if __name__ == '__main__':
    test_inat_all()
    test_fishbase_c0()
    test_fishbase_c1_page()
