import urllib.request
import ssl
import re
from bs4 import BeautifulSoup

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

HEADERS = {'User-Agent': 'FishGuardAI-Research/1.0 (Academic research UPI Serang)'}

# 1. Check FG-C0-009
url_009 = 'https://fishbase.se/tools/display_image.php?fw=n&imgName=1486612840_172.68.106.90.jpeg'
req = urllib.request.Request(url_009, headers=HEADERS)
try:
    with urllib.request.urlopen(req, timeout=8, context=ctx) as r:
        content = r.read()
        print(f"FG-C0-009 content length: {len(content)}")
        print(f"FG-C0-009 snippet:\n{content[:400].decode('utf-8', errors='ignore')}")
except Exception as e:
    print(f"FG-C0-009 error: {e}")

# 2. Parse ID=388 page for Class 1 candidate matches
url_388 = "https://fishbase.se/photos/ThumbnailsSummary.php?ID=388"
req = urllib.request.Request(url_388, headers=HEADERS)
try:
    with urllib.request.urlopen(req, timeout=10, context=ctx) as r:
        html = r.read().decode('utf-8', errors='ignore')
        
    soup = BeautifulSoup(html, 'html.parser')
    tables = soup.find_all('table')
    print(f"\nFound {len(tables)} tables on ID=388 page")
    
    # Let's search for the photographer names
    photographers = [
        'WEN TZU-HSIN', 'selar', 'Carlos Faria', 'Hamid Badar Osmany',
        'Sahat Ratmuangkhwang', 'Kanapong Charoensuk', 'Santhosh Kumar Charles'
    ]
    
    for p in photographers:
        matches = [s for s in soup.stripped_strings if p.lower() in s.lower()]
        print(f"Photographer '{p}': {len(matches)} string matches in page")
        
    # Find all table rows or blocks with display_image
    for a in soup.find_all('a', href=re.compile(r'display_image\.php')):
        # get parent container or text
        parent = a.find_parent('tr') or a.find_parent('td') or a.parent
        text = parent.get_text(separator=' ', strip=True) if parent else ''
        print(f"  Link: {a['href']} | Context: {text[:120]}")
        
except Exception as e:
    print(f"Parse error: {e}")
