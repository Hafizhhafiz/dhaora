import urllib.request
import ssl
import re
from bs4 import BeautifulSoup

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
HEADERS = {'User-Agent': 'FishGuardAI-Research/1.0 (Academic research UPI Serang)'}

url_388 = "https://fishbase.se/photos/ThumbnailsSummary.php?ID=388"
req = urllib.request.Request(url_388, headers=HEADERS)
with urllib.request.urlopen(req, timeout=10, context=ctx) as r:
    html = r.read().decode('utf-8', errors='ignore')

soup = BeautifulSoup(html, 'html.parser')

print("=== User-uploaded photos table parsing ===")
# Let's find all rows with pictures
for tr in soup.find_all('tr'):
    text = tr.get_text(separator=' ', strip=True)
    for p in ['Carlos Faria', 'Osmany', 'Sahat', 'Charoensuk', 'Charles', 'selar', 'WEN', 'Wen']:
        if p.lower() in text.lower():
            imgs = [img['src'] for img in tr.find_all('img') if 'src' in img.attrs]
            links = [a['href'] for a in tr.find_all('a') if 'href' in a.attrs]
            print(f"\n--- Match for '{p}' ---")
            print(f"Text: {text[:160]}")
            print(f"Imgs: {imgs}")
            print(f"Links: {links}")
            break
