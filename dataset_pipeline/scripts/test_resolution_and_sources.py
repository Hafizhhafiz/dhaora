import urllib.request
import urllib.error
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

HEADERS = {
    'User-Agent': 'FishGuardAI-Research/1.0 (Academic research UPI Serang; contact: lab-sik@upi.edu)'
}

def test_wikimedia_file(filename):
    # Wikimedia API endpoint for file info
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles=File:{urllib.parse.quote(filename)}&prop=imageinfo&iiprop=url|size|mime|extmetadata&format=json"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=8, context=ctx) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, pdata in pages.items():
                if pid != '-1' and 'imageinfo' in pdata:
                    info = pdata['imageinfo'][0]
                    return True, info['url'], info.get('width'), info.get('height'), info.get('size')
            return False, "Page not found on Commons", None, None, None
    except Exception as e:
        return False, str(e), None, None, None

def test_inat_resolutions(photo_id):
    results = {}
    for res in ['original', 'large', 'medium', 'small']:
        for ext in ['jpeg', 'jpg']:
            u = f"https://inaturalist-open-data.s3.amazonaws.com/photos/{photo_id}/{res}.{ext}"
            req = urllib.request.Request(u, headers=HEADERS, method='HEAD')
            try:
                with urllib.request.urlopen(req, timeout=5, context=ctx) as r:
                    results[f"{res}.{ext}"] = (r.status, r.headers.get('Content-Length'))
                    break
            except urllib.error.HTTPError as e:
                results[f"{res}.{ext}"] = (e.code, None)
            except Exception as e:
                results[f"{res}.{ext}"] = (type(e).__name__, None)
    return results

print("1. Testing Wikimedia Commons for FG-C1-031 and FG-C1-032:")
for f in ["1401Salay_salay_batang_Yellowstripe_scad_10.jpg", "1401Salay_salay_batang_Yellowstripe_scad_35.jpg"]:
    found, url, w, h, s = test_wikimedia_file(f)
    print(f"  {f}: Found={found}, URL={url}, Dimensions={w}x{h}, Size={s}")

print("\n2. Testing FG-C0-018 Wikimedia source:")
# In EOL page 29417013, let's see if we can find what file Judgefloro uploaded for Rastrelliger brachysoma
# Common Judgefloro titles for short mackerel / hasa-hasa / kembung:
# Let's search Wikimedia Commons for Judgefloro Rastrelliger brachysoma
search_url = "https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=Judgefloro+Rastrelliger+brachysoma&srnamespace=6&format=json"
req = urllib.request.Request(search_url, headers=HEADERS)
try:
    with urllib.request.urlopen(req, timeout=8, context=ctx) as resp:
        sdata = json.loads(resp.read().decode('utf-8'))
        results = sdata.get('query', {}).get('search', [])
        print(f"  Search results for Judgefloro Rastrelliger brachysoma: {len(results)}")
        for r in results[:5]:
            print(f"    Title: {r['title']}")
except Exception as e:
    print(f"  Search error: {e}")

print("\n3. Testing iNaturalist resolutions for FG-C0-011 (photo 224681954):")
res = test_inat_resolutions("224681954")
print(f"  Results: {res}")
