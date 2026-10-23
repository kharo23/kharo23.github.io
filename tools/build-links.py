#!/usr/bin/env python3
"""Genera le pagine 'link in bio' /go/<canale>/ (noindex, senza script né font esterni).
Ogni canale usa etichette di tracciamento proprie: App Store `ct`, Google Play `referrer` (UTM).
Uso: python3 tools/build-links.py"""
import html, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
APPS = [  # slug, nome, riga, icona, App Store, pacchetto Play, pagina del sito
    ("preventivi", "Preventivi Facili", "Preventivi in PDF per artigiani, con firma del cliente", "assets/app-icons/preventivi-128.webp", "https://apps.apple.com/it/app/preventivi-facili-artigiani/id6775595665", "com.kharonte.preventivifacili", "/preventivi-facili/"),
    ("flipeven", "FlipEven", "Guadagno netto e punto di pareggio per chi rivende", "assets/app-icons/flipeven-128.webp", "https://apps.apple.com/it/app/flipeven/id6795444732", "com.kharonte.flipeven", "/flipeven/"),
    ("foodlio", "Foodlio", "Food cost e margini di ogni ricetta", "assets/app-icons/foodlio-128.webp", "https://apps.apple.com/it/app/id6777711571", "com.kharonte.food_cost_pro", "/foodlio/"),
    ("padel", "Padel Match Manager", "Tornei di padel, punteggi e classifica", "assets/app-icons/padel-128.webp", "https://apps.apple.com/it/app/id6775152321", "it.kharonte.padel_tournament_organizer", "/padel-match-manager/"),
    ("aegis", "Aegis", "Respiro guidato e meditazioni (non è un dispositivo medico)", "assets/app-icons/aegis-128.webp", "https://apps.apple.com/it/app/id6791089198", "com.mindfulspace.mindful_space", "/aegis/"),
]
CHANNELS = {"ig": "instagram", "tiktok": "tiktok"}
CSS = """*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}body{margin:0;background:#06080e;color:#eef1f7;font:16px/1.45 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}
main{max-width:480px;margin:0 auto;padding:28px 16px 40px}h1{font-size:1.25rem;margin:0 0 4px}p.sub{margin:0 0 22px;color:#aab2c5;font-size:.95rem}
.app{display:flex;gap:14px;align-items:center;background:#111522;border:1px solid #232a3d;border-radius:18px;padding:14px;margin:0 0 12px}
.app>div{flex:1;min-width:0}.app img{width:64px;height:64px;border-radius:14px;flex:none}.app h2{font-size:1.05rem;margin:0 0 2px}.app p{margin:0 0 10px;color:#aab2c5;font-size:.88rem}
.b{display:grid;grid-template-columns:1fr 1fr;gap:8px}.b a{display:flex;align-items:center;justify-content:center;min-height:44px;padding:0 10px;border-radius:12px;background:#eef1f7;color:#06080e;font-weight:600;font-size:.9rem;text-decoration:none}
.b a.s{grid-column:1/-1;background:transparent;color:#aab2c5;border:0;min-height:44px;font-weight:500;text-decoration:underline}.b a:focus-visible{outline:3px solid #7aa2ff;outline-offset:2px}
footer{margin-top:24px;color:#8a92a8;font-size:.82rem}footer a{color:#aab2c5}"""
def page(slug, label):
    cards = []
    for s, name, line, icon, ios, pkg, site in APPS:
        ct = f"{label[:2]}_{s}"
        play = f"https://play.google.com/store/apps/details?id={pkg}&hl=it&referrer=utm_source%3D{label}%26utm_medium%3Dbio%26utm_campaign%3D{s}"
        cards.append(f'<section class="app"><img src="/{icon}" alt="" width="64" height="64"><div><h2>{html.escape(name)}</h2><p>{html.escape(line)}</p>'
                     f'<div class="b"><a href="{html.escape(ios)}?ct={ct}">App Store</a><a href="{html.escape(play)}">Google Play</a><a class="s" href="{site}">Scopri l&rsquo;app</a></div></div></section>')
    return f"""<!doctype html>
<html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow"><title>Le app di Kharonte Studio</title>
<meta name="theme-color" content="#06080e"><link rel="icon" href="/assets/favicon.png"><link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<style>{CSS}</style></head><body><main><h1>Le app di Kharonte Studio</h1><p class="sub">Scegli l'app e il tuo store.</p>
{chr(10).join(cards)}
<footer><a href="/">kharonte.dev</a> · <a href="/privacy.html">Privacy</a></footer></main></body></html>
"""
for slug, label in CHANNELS.items():
    d = ROOT / "go" / slug
    d.mkdir(parents=True, exist_ok=True)
    (d / "index.html").write_text(page(slug, label), encoding="utf-8")
    print("scritto", d / "index.html")
