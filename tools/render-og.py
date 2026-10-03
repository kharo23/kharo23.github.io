#!/usr/bin/env python3
"""Genera le immagini social 1200x630 (assets/og-card-{it,en,es}.jpg) da tools/og-card.html.
Serve prima:  python3 -m http.server 8765   (dalla radice del repo)   e Playwright installato."""
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1200, 'height': 630})
    for lang in ('it', 'en', 'es'):
        pg.goto(f'http://localhost:8765/tools/og-card.html?lang={lang}'); pg.wait_for_function("document.title==='ready'"); pg.wait_for_timeout(400)
        pg.screenshot(path=f'assets/og-card-{lang}.jpg', type='jpeg', quality=88)
    b.close()
