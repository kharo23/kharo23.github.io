# Kharonte Studio — guida rapida al sito

## Struttura
- `index.html` (italiano) è la **fonte** della home. `en/index.html` e `es/index.html` sono **generate**: dopo ogni modifica alla home lancia
  `python3 tools/build-home.py` (si ferma se una frase italiana cambiata non ha più la sua traduzione).
- Home: `home.css` + `home.js` (le demo leggono `<html lang>` per testi, formati e PDF).
- Tutte le altre pagine (app, Chi sono, assistenza, privacy, 404, versioni EN/ES) caricano `site.css` + `site.js` dopo `style.css`/`products.css`.
  Ogni app mantiene il proprio colore di accento (definito in `products.css`).
- Nessuna risorsa di terze parti: font in `assets/fonts`, niente analytics, niente cookie.

## Asset generati (script in `tools/`)
- `render-charon.py [N] [file]` — pianeta (numpy + Pillow): `assets/charon.webp` (1400) e `assets/charon-700.webp`.
- `og-card.html` + `render-og.py` — immagini social `assets/og-card-{it,en,es}.jpg` (richiede server locale + Playwright).
- `og-app.html` + `render-og-apps.py` — immagini social delle pagine app (`assets/og/*.jpg`) e relativi meta og/twitter.
- `build-home.py` — genera le home EN/ES.
- Icone leggere della home: `assets/app-icons/*-128.webp` e `assets/studio-96.webp` (le icone originali pesano 70–120 KB).

## Provare in locale
`python3 -m http.server 8765` nella cartella, poi http://localhost:8765/ (e `/en/`, `/es/`).

## SEO / LLM
`robots.txt`, `sitemap.xml` (aggiorna `lastmod` quando cambi le pagine), `llms.txt` e `llms-full.txt`: tienili allineati a prezzi e disponibilità reali delle app.

## Regole di contenuto
Non inventare dati (città, tempi di risposta, recensioni, download). Prezzi e disponibilità si verificano sugli store.
