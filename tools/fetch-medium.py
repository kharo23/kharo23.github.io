#!/usr/bin/env python3
"""Salva l'elenco degli articoli Medium (feed pubblico) in tools/medium-articles.json.  Uso: python3 tools/fetch-medium.py"""
import re, html, json, urllib.request, datetime, email.utils
from guides_data import MEDIUM_PROFILE
x = urllib.request.urlopen(urllib.request.Request(MEDIUM_PROFILE.replace('medium.com/', 'medium.com/feed/'), headers={'User-Agent': 'Mozilla/5.0'}), timeout=30).read().decode('utf-8', 'ignore')
out = []
for it in re.findall(r'<item>(.*?)</item>', x, re.S):
    g = lambda p: (re.search(p, it, re.S) or [None, ''])[1]
    out.append(dict(title=html.unescape(g(r'<title><!\[CDATA\[(.*?)\]\]></title>')).strip(),
                    url=g(r'<link>(.*?)</link>').split('?')[0],
                    date=email.utils.parsedate_to_datetime(g(r'<pubDate>(.*?)</pubDate>')).date().isoformat(),
                    tags=re.findall(r'<category><!\[CDATA\[(.*?)\]\]>', it)))
json.dump(out, open(__import__('pathlib').Path(__file__).with_name('medium-articles.json'), 'w'), ensure_ascii=False, indent=1)
print(len(out), 'articoli salvati')
