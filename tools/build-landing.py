#!/usr/bin/env python3
"""Genera le pagine Servizi (servizi.html, en/services.html, es/servicios.html) e le pagine per mestiere
(preventivi-facili/elettricisti, foodlio/pizzerie, padel-match-manager/circoli, ciascuna in it/en/es).
Contenuti in tools/landing_data.py.  Uso:  python3 tools/build-landing.py"""
import re, sys, json, html, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from landing_data import SERVICES, NICHES, APPS, MAIL
from guides_data import WRITING

ROOT = pathlib.Path(__file__).resolve().parent.parent
R = 'https://kharonte.dev'
LOC = {'it': 'it_IT', 'en': 'en_US', 'es': 'es_ES'}
OGALT = {'it': 'Kharonte Studio: cinque app, una sola mano', 'en': 'Kharonte Studio: five apps, one maker', 'es': 'Kharonte Studio: cinco apps, una sola mano'}
L = {  # etichette fisse
 'it': dict(allapps='← Tutte le app', skip='Vai al contenuto', nav='Navigazione principale', lang='Lingua', apps='Applicazioni', info='Supporto & Info', about='Chi sono', services='Servizi', support='Assistenza e FAQ', privacy='Informativa Privacy', contact='Contattami', bio="Applicazioni native indipendenti per iOS e Android. Prodotti veloci, curati nel dettaglio e senza abbonamenti nascosti.", freelance='Cerchi sviluppo software su misura o un progetto custom?', write='Scrivimi', home='Home'),
 'en': dict(allapps='← All apps', skip='Skip to content', nav='Main navigation', lang='Language', apps='Applications', info='Support & Info', about='About', services='Services', support='Support & FAQ', privacy='Privacy Policy', contact='Contact me', bio="Independent native apps for iOS and Android. Fast, carefully crafted products with no hidden subscriptions.", freelance='Looking for custom software development or a bespoke project?', write='Get in touch', home='Home'),
 'es': dict(allapps='← Todas las apps', skip='Ir al contenido', nav='Navegación principal', lang='Idioma', apps='Aplicaciones', info='Soporte e Info', about='Sobre mí', services='Servicios', support='Soporte y FAQ', privacy='Política de privacidad', contact='Contáctame', bio="Aplicaciones nativas independientes para iOS y Android. Productos rápidos, cuidados al detalle y sin suscripciones ocultas.", freelance='¿Buscas desarrollo de software a medida o un proyecto personalizado?', write='Escríbeme', home='Inicio'),
}
GL = {'it': 'Guide', 'en': 'Guides', 'es': 'Guías'}
WL = {'it': 'Scritti', 'en': 'Writing', 'es': 'Escritos'}
SUBJ = {'it': 'Progetto%20Custom', 'en': 'Custom%20Project', 'es': 'Proyecto%20Personalizado'}
e = lambda x: html.escape(x, quote=True)

def url_for(kind, lang, key=None):
    if kind == 'writing':
        return R + '/' + WRITING[lang]['file']
    if kind == 'guides':
        return f"{R}/guide/" + ('' if lang == 'it' else lang + '/')
    if kind == 'guide':
        return f"{R}/guide/{key}/" + ('' if lang == 'it' else lang + '/')
    if kind == 'services':
        return R + '/' + {'it': 'servizi.html', 'en': 'en/services.html', 'es': 'es/servicios.html'}[lang]
    n = NICHES[key]; base = f"{R}/{n['parent']}/{n['sub']}/"
    return base + ('' if lang == 'it' else lang + '/')

def path_for(kind, lang, key=None):
    if kind == 'writing':
        return pathlib.Path(WRITING[lang]['file'])
    return pathlib.Path(url_for(kind, lang, key).replace(R + '/', '')) if kind == 'services' else pathlib.Path(url_for(kind, lang, key).replace(R + '/', '')) / 'index.html'

def head(kind, lang, key, title, desc, og, ld):
    can = url_for(kind, lang, key)
    alts = ''.join(f'  <link rel="alternate" hreflang="{l}" href="{url_for(kind, l, key)}">\n' for l in ('it', 'en', 'es')) + f'  <link rel="alternate" hreflang="x-default" href="{url_for(kind, "it", key)}">\n'
    dep = len(path_for(kind, lang, key).parts) - 1
    up = '../' * dep
    img = f'{R}/{og}'
    return f'''<!DOCTYPE html>
<html lang="{lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
  <title>{e(title)}</title>
  <meta name="description" content="{e(desc)}">
  <link rel="canonical" href="{can}">
{alts}  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Kharonte Studio">
  <meta property="og:title" content="{e(title)}">
  <meta property="og:description" content="{e(desc)}">
  <meta property="og:url" content="{can}">
  <meta property="og:locale" content="{LOC[lang]}">
  <meta property="og:image" content="{img}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="{e(OGALT[lang])}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{e(title)}">
  <meta name="twitter:description" content="{e(desc)}">
  <meta name="twitter:image" content="{img}">
  <meta name="twitter:image:alt" content="{e(OGALT[lang])}">
  <link rel="icon" type="image/png" href="{up}assets/favicon.png">
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#0a0b0d">
  <link rel="stylesheet" href="{up}style.css?v=20260924e">
  <link rel="stylesheet" href="{up}products.css?v=20260924e">
  <link rel="stylesheet" href="{up}site.css?v=1">
  <script src="{up}hub-interactions.js?v=20260924e" defer></script>
  <script src="{up}site.js?v=1" defer></script>
''' + ''.join('  <script type="application/ld+json">\n' + json.dumps(x, ensure_ascii=False, indent=2) + '\n  </script>\n' for x in ld) + '</head>\n', up

def header(kind, lang, key, up):
    sw = ''.join(f'<a href="{url_for(kind, l, key).replace(R, "") or "/"}" class="lang-link{" active" if l == lang else ""}"' + (' aria-current="page"' if l == lang else '') + f'>{l.upper()}</a>' for l in ('it', 'en', 'es'))
    home = {'it': '/', 'en': '/en/', 'es': '/es/'}[lang]
    return f'''  <header class="site-nav">
    <nav class="container nav-inner" aria-label="{L[lang]["nav"]}">
      <a class="brand-wrapper" href="{home}">
        <img class="brand-logo-img" src="{up}assets/studio-icon.png" alt="">
        <span class="brand-name">Kharonte <span>Studio</span></span>
      </a>
      <div class="nav-right-group">
        <div class="lang-switch" aria-label="{L[lang]["lang"]}">{sw}</div>
        <a class="hub-link" href="{home}">{L[lang]["allapps"]}</a>
      </div>
    </nav>
  </header>
'''

def footer(lang, up):
    t = L[lang]; sub = '' if lang == 'it' else lang + '/'
    pre = {'it': '/', 'en': '/en/', 'es': '/es/'}[lang]
    about = {'it': '/about.html', 'en': '/en/about.html', 'es': '/es/about.html'}[lang]
    guide_hub = {'it': '/guide/', 'en': '/guide/en/', 'es': '/guide/es/'}[lang]
    writ = '/' + WRITING[lang]['file']
    serv = {'it': '/servizi.html', 'en': '/en/services.html', 'es': '/es/servicios.html'}[lang]
    sup = {'it': '/support.html', 'en': '/en/support.html', 'es': '/es/support.html'}[lang]
    pri = {'it': '/privacy.html', 'en': '/en/privacy.html', 'es': '/es/privacy.html'}[lang]
    apps = ''.join(f'<li><a href="/{s}/{sub}">{n}</a></li>' for s, n, _, _ in APPS)
    return f'''  <footer class="global-footer" style="margin-top: 60px;">
    <div class="container">
      <div class="footer-columns-grid">
        <div>
          <a class="brand-wrapper" href="{pre}">
            <img class="brand-logo-img" src="{up}assets/studio-icon.png" alt="" loading="lazy">
            <span class="brand-name">Kharonte <span>Studio</span></span>
          </a>
          <p class="footer-bio-p">{t["bio"]}</p>
        </div>
        <div>
          <h3 class="footer-nav-header">{t["apps"]}</h3>
          <ul class="footer-nav-list">{apps}</ul>
        </div>
        <div>
          <h3 class="footer-nav-header">{t["info"]}</h3>
          <ul class="footer-nav-list">
            <li><a href="{about}">{t["about"]}</a></li>
            <li><a href="{serv}">{t["services"]}</a></li>
            <li><a href="{guide_hub}">{GL[lang]}</a></li>
            <li><a href="{writ}">{WL[lang]}</a></li>
            <li><a href="mailto:{MAIL}">{t["contact"]}</a></li>
            <li><a href="{sup}">{t["support"]}</a></li>
            <li><a href="{pri}">{t["privacy"]}</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom-row">
        <div>&copy; 2026 Kharonte Studio by <a href="https://github.com/kharo23" target="_blank" rel="noopener noreferrer" style="color:var(--text-main); font-weight:600; text-decoration:none;">@kharonteAppDev</a></div>
        <div class="footer-social-row"><a href="https://www.tiktok.com/@kharonteappdev" target="_blank" rel="noopener noreferrer">TikTok</a><span>·</span><a href="https://www.instagram.com/kharonte.appdev/" target="_blank" rel="noopener noreferrer">Instagram</a><span>·</span><a href="https://github.com/kharo23" target="_blank" rel="noopener noreferrer">GitHub</a></div>
      </div>
      <div class="footer-freelance-note">{t["freelance"]} <a href="mailto:{MAIL}?subject={SUBJ[lang]}">{t["write"]}</a>.</div>
    </div>
  </footer>
'''

def balanced_div(s, start_pat):
    m = re.search(start_pat, s); i = m.start(); depth = 0
    for t in re.finditer(r'<div\b|</div>', s[i:]):
        depth += 1 if t.group(0) != '</div>' else -1
        if depth == 0: return s[i:i + t.end()]
    raise ValueError('div non bilanciato')

def cards(items, cols='col-4', num=False):
    out = ''
    for k, (t, d) in enumerate(items, 1):
        out += f'          <article class="bento-card {cols}">\n' + (f'            <span class="feature-number">{k:02d}</span>\n' if num else '') + f'            <h3 class="bento-title">{e(t)}</h3>\n            <p class="bento-text">{e(d)}</p>\n          </article>\n'
    return out

def faq_html(items):
    return ''.join(f'        <details class="product-faq"><summary>{e(q)}</summary><p>{e(a)}</p></details>\n' for q, a in items)

def faq_ld(items):
    return {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in items]}

def crumbs(lang, name, can):
    home = {'it': R + '/', 'en': R + '/en/', 'es': R + '/es/'}[lang]
    return {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": L[lang]['home'], "item": home}, {"@type": "ListItem", "position": 2, "name": name, "item": can}]}

def section(label, title, body, extra=''):
    return f'''    <section class="section-wrapper">
      <div class="container">
        <div class="section-title-area">
          <span class="section-label">{e(label)}</span>
          <h2 class="section-title">{e(title)}</h2>
          {extra}
        </div>
{body}      </div>
    </section>
'''

def build_services(lang):
    d = SERVICES[lang]; can = url_for('services', lang); sub = '' if lang == 'it' else lang + '/'
    ld = [
     {"@context": "https://schema.org", "@type": "WebPage", "@id": can + "#webpage", "url": can, "name": d['title'], "description": d['desc'], "inLanguage": lang, "isPartOf": {"@id": R + "/#website"}, "about": {"@id": R + "/#org"}, "primaryImageOfPage": {"@type": "ImageObject", "url": f"{R}/assets/og-card-{lang}.jpg"}},
     {"@context": "https://schema.org", "@type": "Service", "@id": can + "#service", "name": d['h1a'] + ' ' + d['h1b'], "serviceType": ["Mobile app development", "Full-stack web development", "AI integration"], "description": d['desc'], "provider": {"@id": R + "/#org"}, "availableChannel": {"@type": "ServiceChannel", "serviceUrl": f"mailto:{MAIL}"}, "inLanguage": lang},
     faq_ld(d['faq']), crumbs(lang, d['breadcrumb'], can)]
    h, up = head('services', lang, None, d['title'], d['desc'], f'assets/og-card-{lang}.jpg', ld)
    s3 = d['s3']
    applist = ''.join(f'          <article class="bento-card col-4">\n            <h3 class="bento-title">{n}</h3>\n            <p class="bento-text">{e(desc[lang])}{"" if live else " (" + s3[3] + ")"}</p>\n            <a class="cta-btn-secondary" style="margin-top:14px;display:inline-flex;padding:10px 18px;" href="/{slug}/{sub}">{s3[4]} →</a>\n          </article>\n' for slug, n, desc, live in APPS)
    body = f'''<body class="product-page hub-page about-page">
  <a href="#main" class="skip-link">{L[lang]["skip"]}</a>
{header('services', lang, None, up)}  <main id="main">
    <section class="hero">
      <div class="container">
        <div class="pill-badge"><span class="pill-dot"></span>{e(d["eyebrow"].upper())}</div>
        <h1 class="hero-heading">{e(d["h1a"])}<br><span class="hero-gradient-text">{e(d["h1b"])}</span></h1>
        <p class="hero-subtext">{e(d["sub"])}</p>
        <div class="about-cta-actions" style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
          <a class="cta-btn-primary" href="mailto:{MAIL}?subject={d["subj"]}"><span>{e(d["cta"])}</span> <span aria-hidden="true">→</span></a>
          <a class="cta-btn-secondary" href="{ {'it': '/', 'en': '/en/', 'es': '/es/'}[lang] }#banco">{e(d["cta2"])}</a>
        </div>
      </div>
    </section>
''' + section(d['s1'][0], d['s1'][1], f'        <div class="bento-grid">\n{cards(d["s1"][2])}        </div>\n') \
      + section(d['s2'][0], d['s2'][1], f'        <div class="bento-grid">\n{cards(d["s2"][2], "col-6", True)}        </div>\n') \
      + section(s3[0], s3[1], f'        <div class="bento-grid">\n{applist}        </div>\n', f'<p class="section-description">{e(s3[2])}</p>') \
      + section({'it': 'Approfondimenti', 'en': 'Further reading', 'es': 'Para profundizar'}[lang], {'it': 'Scritti tecnici e guide pratiche', 'en': 'Technical writing and practical guides', 'es': 'Escritos técnicos y guías prácticas'}[lang], f'''        <div class="bento-grid">
          <article class="bento-card col-6"><h3 class="bento-title">{WL[lang]}</h3><p class="bento-text">{ {'it': 'Articoli su backend (Spring Boot, API, microservizi), sviluppo mobile (Flutter, React Native) e flussi di lavoro con IA.', 'en': 'Articles on backend (Spring Boot, APIs, microservices), mobile development (Flutter, React Native) and AI workflows.', 'es': 'Artículos sobre backend (Spring Boot, APIs, microservicios), desarrollo móvil (Flutter, React Native) y flujos de trabajo con IA.'}[lang] }</p><a class="cta-btn-secondary" style="margin-top:14px;display:inline-flex;padding:10px 18px;" href="/{WRITING[lang]['file']}">{WL[lang]} →</a></article>
          <article class="bento-card col-6"><h3 class="bento-title">{GL[lang]}</h3><p class="bento-text">{ {'it': 'Formule ed esempi su preventivi, food cost, tornei di padel e rivendita.', 'en': 'Formulas and examples on quotes, food cost, padel tournaments and reselling.', 'es': 'Fórmulas y ejemplos sobre presupuestos, food cost, torneos de pádel y reventa.'}[lang] }</p><a class="cta-btn-secondary" style="margin-top:14px;display:inline-flex;padding:10px 18px;" href="/guide/{sub}">{GL[lang]} →</a></article>
        </div>
''') \
      + section(d['faq_label'], d['faq_title'], f'        <div class="product-faq-list" style="max-width:820px;margin:0 auto;">\n{faq_html(d["faq"])}        </div>\n') \
      + f'''    <section class="section-wrapper">
      <div class="container">
        <article class="bento-card col-12 about-cta-banner" style="text-align:center;">
          <h2 class="about-cta-title">{e(d["ctat"])}</h2>
          <p class="about-cta-desc">{e(d["ctad"])}</p>
          <div class="about-cta-actions" style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:18px;">
            <a class="cta-btn-primary" href="mailto:{MAIL}?subject={d["subj"]}"><span>{e(d["cta"])}</span> <span aria-hidden="true">→</span></a>
          </div>
        </article>
      </div>
    </section>
  </main>
''' + footer(lang, up) + '</body>\n</html>\n'
    out = ROOT / path_for('services', lang); out.write_text(h + body); return out

def build_niche(key, lang):
    n = NICHES[key]; d = n[lang]; can = url_for('niche', lang, key); sub = '' if lang == 'it' else lang + '/'
    parent_page = ROOT / n['parent'] / ('index.html' if lang == 'it' else f'{lang}/index.html')
    ps = parent_page.read_text()
    store = balanced_div(ps, r'<div class="store-buttons-container">')
    bodycls = re.search(r'<body class="([^"]*)"', ps).group(1)
    parent_can = re.search(r'<link rel="canonical" href="([^"]*)"', ps).group(1)
    ld = [
     {"@context": "https://schema.org", "@type": "WebPage", "@id": can + "#webpage", "url": can, "name": d['title'], "description": d['desc'], "inLanguage": lang, "isPartOf": {"@id": R + "/#website"}, "about": {"@id": parent_can + "#app"}, "primaryImageOfPage": {"@type": "ImageObject", "url": f"{R}/assets/og/{n['parent']}-{lang}.jpg"}},
     faq_ld(d['faq']), crumbs(lang, n['name'] + ' · ' + d['title'].split(' — ')[0], can)]
    h, up = head('niche', lang, key, d['title'], d['desc'], f"assets/og/{n['parent']}-{lang}.jpg", ld)
    s1, ex, faq, links = d['s1'], d['ex'], d['faq'], d['links']
    rows = ''.join('<tr>' + ''.join(f'<td>{e(c)}</td>' for c in r) + '</tr>' for r in ex[3])
    foot = ''.join(f'<tr class="lt-sum"><td colspan="{len(ex[2]) - 1}">{e(a)}</td><td>{e(b)}</td></tr>' for a, b in ex[4])
    table = f'''        <div class="landing-table-wrap" tabindex="0" role="region" aria-label="{e(ex[0])}"><table class="landing-table"><thead><tr>{''.join(f'<th>{e(c)}</th>' for c in ex[2])}</tr></thead><tbody>{rows}{foot}</tbody></table></div>
'''
    from guides_data import GUIDES
    gslug = {'pizzerie': 'food-cost', 'circoli': 'torneo-americano-padel', 'elettricisti': 'come-fare-un-preventivo'}.get(key)
    extra = [(GUIDES[gslug][lang]['slug_title'], f'/guide/{gslug}/{sub}')] if gslug else []
    lk = ''.join(f'<li><a href="{u}">{e(t)}</a></li>' for t, u in list(links[1]) + extra)
    body = f'''<body class="{bodycls}">
  <a href="#main" class="skip-link">{L[lang]["skip"]}</a>
{header('niche', lang, key, up)}  <main id="main">
    <section class="hero">
      <div class="container">
        <div class="pill-badge"><span class="pill-dot"></span>{e(d["eyebrow"])}</div>
        <h1 class="hero-heading">{e(d["h1a"])}<br><span class="hero-gradient-text">{e(d["h1b"])}</span></h1>
        <p class="hero-subtext">{e(d["sub"])}</p>
        {store}
      </div>
    </section>
''' + section(s1[0], s1[1], f'        <div class="bento-grid">\n{cards(s1[2])}        </div>\n') \
      + section({'it': 'Esempio', 'en': 'Example', 'es': 'Ejemplo'}[lang], ex[0], table, f'<p class="section-description">{e(ex[1])}</p>') \
      + section({'it': 'Prima di iniziare', 'en': 'Before you start', 'es': 'Antes de empezar'}[lang], {'it': 'Domande frequenti', 'en': 'Frequently asked questions', 'es': 'Preguntas frecuentes'}[lang], f'        <div class="product-faq-list" style="max-width:820px;margin:0 auto;">\n{faq_html(faq)}        </div>\n') \
      + f'''    <section class="section-wrapper">
      <div class="container">
        <article class="bento-card col-12 about-cta-banner" style="text-align:center;">
          <h2 class="about-cta-title">{e(d["ctat"])}</h2>
          <p class="about-cta-desc">{e(d["ctad"])}</p>
          <p class="minor" style="margin-top:22px;opacity:.85;">{e(links[0])}:</p>
          <ul class="landing-links">{lk}</ul>
        </article>
      </div>
    </section>
  </main>
''' + footer(lang, up) + '</body>\n</html>\n'
    out = ROOT / path_for('niche', lang, key); out.parent.mkdir(parents=True, exist_ok=True); out.write_text(h + body); return out

if __name__ == '__main__':
    made = []
    for lang in ('it', 'en', 'es'):
        made.append(build_services(lang))
        for key in NICHES: made.append(build_niche(key, lang))
    for m in made: print('ok', m.relative_to(ROOT))
