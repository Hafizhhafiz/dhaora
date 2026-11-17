import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

HEADERS = {'User-Agent': 'FishGuardAI-Research/1.0 (Academic research UPI Serang)'}

def test_wikimedia_file(filename):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles=File:{urllib.parse.quote(filename)}&prop=imageinfo&iiprop=url|size|mime|extmetadata&format=json"
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=8, context=ctx) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        pages = data.get('query', {}).get('pages', {})
        for pid, pdata in pages.items():
            if pid != '-1' and 'imageinfo' in pdata:
                info = pdata['imageinfo'][0]
                return True, info['url'], info.get('width'), info.get('height'), info.get('size'), info.get('extmetadata', {})
        return False, None, None, None, None, {}

found, url, w, h, s, meta = test_wikimedia_file("8683Photos taken 2020 coronavirus pandemic Baliuag, Bulacan 28.jpg")
print(f"File 28: Found={found}, URL={url}, Dimensions={w}x{h}, Size={s}")
if found:
    cats = meta.get('Categories', {}).get('value', '')
    print(f"Categories: {cats}")
    artist = meta.get('Artist', {}).get('value', '')
    print(f"Artist: {artist}")
    license_val = meta.get('LicenseShortName', {}).get('value', '')
    print(f"License: {license_val}")
