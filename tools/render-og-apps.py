#!/usr/bin/env python3
"""Genera le immagini social delle pagine app (assets/og/<pagina>-<lingua>.jpg) e aggiorna i meta og/twitter.
Serve:  python3 -m http.server 8765  (dalla radice del repo)  +  Playwright.   Uso: python3 tools/render-og-apps.py"""
import re, html, os, urllib.parse
from playwright.sync_api import sync_playwright
APPS = {  # pagina: (nome, accento, icona, screenshot per lingua)
 'preventivi-facili': ('Preventivi Facili', '#3d7eff', '../assets/icon.png', lambda l: f'../assets/preventivi-facili-hub-{l}.webp'),
 'preventivi-facili/idraulici': ('Preventivi Facili', '#3d7eff', '../assets/icon.png', lambda l: f'../assets/preventivi-facili-hub-{l}.webp'),
 'foodlio': ('Foodlio', '#10b981', '../foodlio/icon.png', lambda l: f'../foodlio/screenshot-{l}.webp'),
 'padel-match-manager': ('Padel Match Manager', '#ff7a1a', '../padel-match-manager/icon.png', lambda l: f'../padel-match-manager/screenshot-{l}.webp'),
 'aegis': ('Aegis', '#a78bfa', '../aegis/icon.png', lambda l: f'../aegis/screenshot-{l}.webp'),
 'flipeven': ('FlipEven', '#22d3ee', '../flipeven/icon.png', lambda l: '../assets/flipeven-preview.png'),
}
os.makedirs('assets/og', exist_ok=True)
jobs = []
for slug, (name, ac, ic, sh) in APPS.items():
    for lang in ('it', 'en', 'es'):
        path = f'{slug}/index.html' if lang == 'it' else f'{slug}/{lang}/index.html'
        s = open(path).read()
        h1 = re.search(r'<h1[^>]*>(.*?)</h1>', s, re.S).group(1)
        h1 = ' '.join(html.unescape(re.sub(r'<[^>]+>', ' ', re.sub(r'<br\s*/?>', ' ', h1))).split())
        out = f'assets/og/{slug.replace("/", "-")}-{lang}.jpg'
        jobs.append((path, out, dict(nm=name, ac=ac, ic=ic, sh=sh(lang), h=h1)))
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1200, 'height': 630})
    for path, out, q in jobs:
        pg.goto('http://localhost:8765/tools/og-app.html?' + urllib.parse.urlencode(q)); pg.wait_for_function("document.title==='ready'"); pg.wait_for_timeout(250)
        pg.screenshot(path=out, type='jpeg', quality=86)
        s = open(path).read(); url = 'https://kharonte.dev/' + out; alt = html.escape(q['h'], quote=True)
        s = re.sub(r'\s*<meta property="og:image:(type|width|height|alt)"[^>]*>', '', s)
        s = re.sub(r'\s*<meta name="twitter:image:alt"[^>]*>', '', s)
        s = re.sub(r'<meta property="og:image" content="[^"]*">', f'<meta property="og:image" content="{url}">\n  <meta property="og:image:type" content="image/jpeg">\n  <meta property="og:image:width" content="1200">\n  <meta property="og:image:height" content="630">\n  <meta property="og:image:alt" content="{alt}">', s)
        s = re.sub(r'<meta name="twitter:image" content="[^"]*">', f'<meta name="twitter:image" content="{url}">\n  <meta name="twitter:image:alt" content="{alt}">', s)
        s = s.replace('<meta name="twitter:card" content="summary">', '<meta name="twitter:card" content="summary_large_image">')
        open(path, 'w').write(s); print('ok', out)
    b.close()
