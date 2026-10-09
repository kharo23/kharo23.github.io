#!/usr/bin/env python3
"""Genera guide (/guide/...), hub guide e pagina Scritti (Medium) in IT/EN/ES.
Dati in tools/guides_data.py e tools/medium-articles.json (aggiornare con tools/fetch-medium.py).
Uso: python3 tools/build-content.py"""
import sys, json, html, importlib.util, pathlib
HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
spec = importlib.util.spec_from_file_location('bl', HERE / 'build-landing.py'); bl = importlib.util.module_from_spec(spec); spec.loader.exec_module(bl)
from guides_data import GUIDES, LAB, UPDATED, UPDATED_TXT, WRITING, MEDIUM_PROFILE
e = bl.e; R = bl.R; AUTH = R + '/#author'; ORG = R + '/#org'
ARTICLES = json.loads((HERE / 'medium-articles.json').read_text())
APPPATH = {'preventivi-facili': 'preventivi-facili', 'foodlio': 'foodlio', 'padel-match-manager': 'padel-match-manager', 'flipeven': 'flipeven', 'aegis': 'aegis'}

def blocks(bs):
    out = ''
    for b in bs:
        k = b[0]
        if k == 'p': out += f'          <p>{b[1]}</p>\n'
        elif k in ('ul', 'ol'): out += f'          <{k}>' + ''.join(f'<li>{x}</li>' for x in b[1]) + f'</{k}>\n'
        elif k == 'table':
            hd, rows, note = b[1], b[2], b[3]
            out += '          <div class="landing-table-wrap" tabindex="0" role="region" aria-label="' + e(note) + '"><table class="landing-table"><thead><tr>' + ''.join(f'<th>{e(c)}</th>' for c in hd) + '</tr></thead><tbody>' + ''.join('<tr>' + ''.join(f'<td>{c}</td>' for c in r) + '</tr>' for r in rows) + f'</tbody></table></div>\n          <p class="minor guide-note">{e(note)}</p>\n'
        elif k == 'foodcalc':
            c = b[1]
            out += f'''          <div class="food-cost-calculator" data-locale="{e(c['locale'])}">
            <div class="food-calc-inputs">
              <label>{e(c['cost'])}<input type="text" inputmode="decimal" value="1,40" data-food-cost aria-describedby="food-calc-help"></label>
              <label>{e(c['price'])}<input type="text" inputmode="decimal" value="7,73" data-food-price aria-describedby="food-calc-help"></label>
              <label>{e(c['target'])}<span class="food-calc-suffix"><input type="text" inputmode="decimal" value="30" data-food-target aria-describedby="food-calc-help"><span aria-hidden="true">%</span></span></label>
            </div>
            <p class="food-calc-help" id="food-calc-help">{e(c['help'])}</p>
            <div class="food-calc-results" aria-live="polite">
              <p><span>{e(c['result'])}</span><strong data-food-result>18,1%</strong></p>
              <p><span>{e(c['suggested'])}</span><strong data-food-suggested>4,67 EUR</strong></p>
            </div>
            <noscript><p class="minor">{e(c['noscript'])}</p></noscript>
          </div>
'''
    return out

def page(kind, lang, key, title, desc, og, ld, main, up):
    h, up2 = bl.head(kind, lang, key, title, desc, og, ld)
    body = f'<body class="product-page hub-page about-page">\n  <a href="#main" class="skip-link">{bl.L[lang]["skip"]}</a>\n{bl.header(kind, lang, key, up2)}  <main id="main">\n{main}  </main>\n' + bl.footer(lang, up2) + '</body>\n</html>\n'
    out = bl.ROOT / bl.path_for(kind, lang, key); out.parent.mkdir(parents=True, exist_ok=True); out.write_text(h + body); return out

def hero(label, h1, sub=''):
    return f'    <section class="hero">\n      <div class="container">\n        <div class="pill-badge"><span class="pill-dot"></span>{e(label)}</div>\n        <h1 class="hero-heading">{h1}</h1>\n        {sub}\n      </div>\n    </section>\n'

made = []
for lang in ('it', 'en', 'es'):
    LB = LAB[lang]; sub = '' if lang == 'it' else lang + '/'
    # ---- guide
    for slug, g in GUIDES.items():
        d = g[lang]; can = bl.url_for('guide', lang, slug); up = '../' * (len(bl.path_for('guide', lang, slug).parts) - 1)
        updated_cfg = g.get('updated', UPDATED); updated_txt_cfg = g.get('updated_txt', UPDATED_TXT)
        updated = updated_cfg.get(lang, UPDATED) if isinstance(updated_cfg, dict) else updated_cfg
        updated_txt = updated_txt_cfg.get(lang, UPDATED_TXT[lang]) if isinstance(updated_txt_cfg, dict) else updated_txt_cfg
        appslug, appname = g['app']; appurl = f'/{appslug}/{sub}'
        related = [(f'{appname}', appurl)]
        if g['niche']: related.append((bl.NICHES[g['niche'][1]][lang]['title'].split(' — ')[0], f'/{g["niche"][0]}/{g["niche"][1]}/{sub}'))
        related.append((LB['demo_breath'] if slug == 'respirazione-box-4-7-8' else LB['demo'], {'it': '/', 'en': '/en/', 'es': '/es/'}[lang] + '#banco'))
        related += [(GUIDES[s][lang]['slug_title'], f'/guide/{s}/{sub}') for s in GUIDES if s != slug][:2]
        ld = [
         {"@context": "https://schema.org", "@type": "Article", "@id": can + "#article", "headline": d['slug_title'], "description": d['desc'], "inLanguage": lang, "datePublished": UPDATED, "dateModified": updated, "mainEntityOfPage": can,
          "author": {"@id": AUTH}, "publisher": {"@id": ORG}, "image": f"{R}/assets/og-card-{lang}.jpg", "about": {"@type": "SoftwareApplication", "name": appname, "url": f"{R}/{appslug}/{sub}"}},
         bl.faq_ld(d['faq']), bl.crumbs(lang, d['slug_title'], can)]
        secs = ''.join(f'        <section class="guide-sec">\n          <h2>{e(h2)}</h2>\n{blocks(bs)}        </section>\n' for h2, bs in d['secs'])
        faq = bl.faq_html(d['faq'])
        main = hero(LB['hub_label'], e(d['h1']), f'<p class="hero-subtext">{d["lead"]}</p><p class="minor">{LB["updated"]} {updated_txt} · {LB["by"]}</p>') + \
          f'    <section class="section-wrapper">\n      <div class="container guide-body">\n{secs}        <section class="guide-sec">\n          <h2>{ {"it": "Domande frequenti", "en": "Frequently asked questions", "es": "Preguntas frecuentes"}[lang] }</h2>\n          <div class="product-faq-list">\n{faq}          </div>\n        </section>\n      </div>\n    </section>\n' + \
          f'    <section class="section-wrapper"><div class="container"><article class="bento-card col-12 about-cta-banner" style="text-align:center;"><h2 class="about-cta-title">{e(LB["try_app"])}: {appname}</h2><p class="minor">{e(LB["related"])}:</p><ul class="landing-links">' + ''.join(f'<li><a href="{u}">{e(t)}</a></li>' for t, u in related) + '</ul></article></div></section>\n' + \
          ('    <script src="/guide-calculator.js?v=20261009" defer></script>\n' if slug == 'food-cost' else '')
        made.append(page('guide', lang, slug, d['title'], d['desc'], f'assets/og-card-{lang}.jpg', ld, main, up))
    # ---- hub
    can = bl.url_for('guides', lang); up = '../' * (len(bl.path_for('guides', lang).parts) - 1)
    ld = [{"@context": "https://schema.org", "@type": "CollectionPage", "@id": can + "#webpage", "url": can, "name": LB['hub_h1a'] + ' ' + LB['hub_h1b'], "inLanguage": lang, "isPartOf": {"@id": R + "/#website"}, "about": {"@id": ORG}},
          {"@context": "https://schema.org", "@type": "ItemList", "itemListElement": [{"@type": "ListItem", "position": i, "url": bl.url_for('guide', lang, s), "name": GUIDES[s][lang]['slug_title']} for i, s in enumerate(GUIDES, 1)]},
          bl.crumbs(lang, LB['guides'], can)]
    cards = ''.join(f'          <article class="bento-card col-6"><h2 class="bento-title">{e(GUIDES[s][lang]["slug_title"])}</h2><p class="bento-text">{e(GUIDES[s][lang]["desc"])}</p><a class="cta-btn-secondary" style="margin-top:14px;display:inline-flex;padding:10px 18px;" href="/guide/{s}/{sub}">{LB["read"]} →</a></article>\n' for s in GUIDES)
    main = hero(LB['hub_label'], f'{e(LB["hub_h1a"])}<br><span class="hero-gradient-text">{e(LB["hub_h1b"])}</span>', f'<p class="hero-subtext">{e(LB["hub_sub"])}</p>') + f'    <section class="section-wrapper"><div class="container"><div class="bento-grid">\n{cards}        </div></div></section>\n'
    hubtitle = {'it': 'Guide pratiche: food cost, preventivi, padel, rivendita', 'en': 'Practical Guides: Food Cost, Quotes, Padel, Reselling', 'es': 'Guías prácticas: food cost, presupuestos, pádel, reventa'}[lang]
    hubdesc = LB['hub_sub']
    made.append(page('guides', lang, None, hubtitle, hubdesc, f'assets/og-card-{lang}.jpg', ld, main, up))
    # ---- scritti
    w = WRITING[lang]; can = bl.url_for('writing', lang); up = '../' * (len(bl.path_for('writing', lang).parts) - 1)
    ld = [{"@context": "https://schema.org", "@type": "CollectionPage", "@id": can + "#webpage", "url": can, "name": w['title'], "description": w['desc'], "inLanguage": lang, "isPartOf": {"@id": R + "/#website"}, "about": {"@id": AUTH}},
          {"@context": "https://schema.org", "@type": "ItemList", "itemListElement": [{"@type": "ListItem", "position": i, "item": {"@type": "Article", "headline": a['title'], "url": a['url'], "datePublished": a['date'], "inLanguage": "en", "keywords": ', '.join(a['tags']), "author": {"@id": AUTH}}} for i, a in enumerate(ARTICLES, 1)]},
          bl.crumbs(lang, w['breadcrumb'], can)]
    def fmt(d):
        y, m, dd = d.split('-'); mon = {'it': ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'], 'en': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], 'es': ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']}[lang][int(m) - 1]
        return f'{int(dd)} {mon} {y}'
    items = ''.join(f'          <article class="bento-card col-6"><span class="feature-number">{fmt(a["date"])}</span><h2 class="bento-title">{e(a["title"])}</h2><p class="bento-text">{e(", ".join(a["tags"][:4]))}</p><a class="cta-btn-secondary" style="margin-top:14px;display:inline-flex;padding:10px 18px;" href="{e(a["url"])}" target="_blank" rel="noopener">{w["read"]} ↗</a></article>\n' for a in ARTICLES)
    main = hero(w['label'], f'{e(w["h1a"])}<br><span class="hero-gradient-text">{e(w["h1b"])}</span>', f'<p class="hero-subtext">{e(w["sub"])}</p><p class="minor">{e(w["note"])}</p>') + f'    <section class="section-wrapper"><div class="container"><div class="bento-grid">\n{items}        </div><p style="text-align:center;margin-top:28px;"><a class="cta-btn-primary" href="{MEDIUM_PROFILE}" target="_blank" rel="noopener"><span>{e(w["all"])}</span> <span aria-hidden="true">↗</span></a></p></div></section>\n'
    made.append(page('writing', lang, None, w['title'], w['desc'], f'assets/og-card-{lang}.jpg', ld, main, up))
for m in made: print('ok', m.relative_to(bl.ROOT))
