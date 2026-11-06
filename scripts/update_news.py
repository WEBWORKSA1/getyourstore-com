#!/usr/bin/env python3
"""Fetch ecommerce headlines from public RSS feeds and write data/news.json.

Runs daily via .github/workflows/update-content.yml. Standard library only.
Stores titles + links only (no article text) and always links to the publisher.
"""
import json, re, sys, html, datetime, urllib.request
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime

FEEDS = [
    ("Google News", "https://news.google.com/rss/search?q=ecommerce+small+business&hl=en-US&gl=US&ceid=US:en"),
    ("Google News", "https://news.google.com/rss/search?q=%22online+store%22+OR+%22online+retail%22&hl=en-US&gl=US&ceid=US:en"),
    ("Practical Ecommerce", "https://www.practicalecommerce.com/feed"),
    ("eCommerceFuel", "https://www.ecommercefuel.com/feed/"),
    ("Search Engine Journal", "https://www.searchenginejournal.com/category/ecommerce/feed/"),
]
OUT = "data/news.json"
MAX_ITEMS = 30
UA = "Mozilla/5.0 (compatible; GetYourStoreNewsBot/1.0; +https://getyourstore.com/news.html)"


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=25) as r:
        return r.read()


def parse_date(s):
    if not s:
        return None
    try:
        d = parsedate_to_datetime(s)
    except Exception:
        try:
            d = datetime.datetime.fromisoformat(s.replace("Z", "+00:00"))
        except Exception:
            return None
    if d.tzinfo is None:
        d = d.replace(tzinfo=datetime.timezone.utc)
    return d


def clean(t):
    t = html.unescape(re.sub(r"<[^>]+>", "", t or "")).strip()
    return re.sub(r"\s+", " ", t)


def items_from(source, raw):
    out = []
    root = ET.fromstring(raw)
    ns = {"a": "http://www.w3.org/2005/Atom"}
    for it in root.iter("item"):
        title = clean(it.findtext("title"))
        link = (it.findtext("link") or "").strip()
        src = it.find("source")
        pub = src.text.strip() if src is not None and src.text else source
        if source == "Google News" and " - " in title:
            title, pub = title.rsplit(" - ", 1)[0], title.rsplit(" - ", 1)[1]
        out.append({"title": title, "link": link, "source": pub, "date": it.findtext("pubDate")})
    for e in root.findall("a:entry", ns):
        l = e.find("a:link", ns)
        out.append({"title": clean(e.findtext("a:title", namespaces=ns)), "link": l.get("href") if l is not None else "",
                    "source": source, "date": e.findtext("a:updated", namespaces=ns)})
    return out


def main():
    allitems, seen = [], set()
    for source, url in FEEDS:
        try:
            for it in items_from(source, fetch(url)):
                key = re.sub(r"[^a-z0-9]", "", it["title"].lower())[:80]
                if not it["title"] or not it["link"].startswith("http") or key in seen:
                    continue
                seen.add(key)
                d = parse_date(it["date"])
                it["date"] = d.isoformat() if d else None
                it["_ts"] = d.timestamp() if d else 0
                allitems.append(it)
        except Exception as ex:  # one bad feed must not break the run
            print(f"warn: {url}: {ex}", file=sys.stderr)
    if not allitems:
        print("no items fetched; keeping existing file", file=sys.stderr)
        return 0
    allitems.sort(key=lambda x: x["_ts"], reverse=True)
    for it in allitems:
        it.pop("_ts", None)
    data = {"updated": datetime.datetime.now(datetime.timezone.utc).isoformat(), "items": allitems[:MAX_ITEMS]}
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    print(f"wrote {len(data['items'])} items")
    return 0


if __name__ == "__main__":
    sys.exit(main())
