import csv
import json
import urllib.request
import urllib.error
import ssl
from collections import Counter
from urllib.parse import urlparse

# Disable SSL verification issues if any institutional self-signed certs exist, but record errors
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 FishGuardAI-Auditor/1.0'
}

def test_url(url, timeout=5):
    if not url or url.strip() == '':
        return "NULL_OR_EMPTY", None, 0
    url = url.strip()
    try:
        req = urllib.request.Request(url, headers=HEADERS, method='HEAD')
        with urllib.request.urlopen(req, timeout=timeout, context=ctx) as resp:
            content_type = resp.headers.get('Content-Type', '')
            content_length = resp.headers.get('Content-Length', 0)
            return f"HTTP_{resp.status}", content_type, content_length
    except urllib.error.HTTPError as e:
        # Some servers reject HEAD (e.g. 405 Method Not Allowed), retry with GET stream
        if e.code in [405, 403]:
            try:
                req_get = urllib.request.Request(url, headers=HEADERS, method='GET')
                with urllib.request.urlopen(req_get, timeout=timeout, context=ctx) as resp_get:
                    content_type = resp_get.headers.get('Content-Type', '')
                    content_length = resp_get.headers.get('Content-Length', 0)
                    return f"HTTP_{resp_get.status}", content_type, content_length
            except urllib.error.HTTPError as e2:
                return f"HTTP_{e2.code}", None, 0
            except Exception as e2:
                return f"ERROR_{type(e2).__name__}", None, 0
        return f"HTTP_{e.code}", None, 0
    except urllib.error.URLError as e:
        return f"URLError_{e.reason}", None, 0
    except Exception as e:
        return f"ERROR_{type(e).__name__}", None, 0

def run_audit():
    with open('Fishguard_AI/fishguard_public_image_inventory.csv', encoding='utf-8') as f:
        rows = list(csv.DictReader(f))

    print(f"Total rows in inventory: {len(rows)}")

    # Sample unique direct URLs and unique source URLs to test reachability safely without spamming
    direct_urls = {}
    for r in rows:
        d_url = r.get('direct_image_url', '').strip()
        if d_url:
            direct_urls[d_url] = direct_urls.get(d_url, []) + [r['record_id']]

    print(f"Total non-empty direct URLs: {len(direct_urls)}")

    url_test_results = {}
    print("\nTesting direct image URLs reachability (sample / distinct)...")
    for idx, (url, rec_ids) in enumerate(direct_urls.items()):
        status, ctype, clen = test_url(url, timeout=5)
        url_test_results[url] = {
            'status': status,
            'content_type': ctype,
            'content_length': clen,
            'record_ids': rec_ids
        }
        if (idx + 1) % 10 == 0 or idx == len(direct_urls) - 1:
            print(f"  Tested {idx + 1}/{len(direct_urls)}: {url[:60]}... -> {status}")

    # Also test source page URLs domains / sample
    source_domains = Counter()
    domain_samples = {}
    for r in rows:
        p_url = r.get('source_page_url', '').strip()
        if p_url:
            dom = urlparse(p_url).netloc
            source_domains[dom] += 1
            if dom not in domain_samples:
                domain_samples[dom] = p_url

    print("\nTesting domain sample page reachability...")
    domain_reachability = {}
    for dom, sample_url in domain_samples.items():
        status, ctype, _ = test_url(sample_url, timeout=6)
        domain_reachability[dom] = status
        print(f"  Domain: {dom} ({source_domains[dom]} records) -> {status}")

    # Save reachability results
    with open('dataset_pipeline/reports/phase_12_1/url_reachability_results.json', 'w', encoding='utf-8') as out_f:
        json.dump({
            'direct_urls_tested': url_test_results,
            'domain_reachability': domain_reachability,
            'source_domains_count': dict(source_domains)
        }, out_f, indent=2)

    print("\nURL audit finished and saved to dataset_pipeline/reports/phase_12_1/url_reachability_results.json")

if __name__ == '__main__':
    run_audit()
