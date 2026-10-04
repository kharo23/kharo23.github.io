# Checklist di lancio (SEO, indicizzazione, verifica)

Dopo la pubblicazione del sito (nulla di questo ha effetto prima):

## 1. Google Search Console (la proprietà risulta già verificata dal file google*.html)
1. search.google.com/search-console → proprietà `kharonte.dev`.
2. Sitemap → aggiungi `https://kharonte.dev/sitemap.xml` → Invia.
3. Ispezione URL → incolla la home, `/servizi.html` e le 3 pagine per mestiere → "Richiedi indicizzazione".
4. Dopo 1–2 settimane: Rendimento (query, clic) e Copertura (pagine escluse).

## 2. Bing Webmaster Tools (non l'hai mai usato — 3 minuti)
1. bing.com/webmasters → accedi → "Importa da Google Search Console" (verifica e sitemap passano in automatico).
2. Controlla che la sitemap risulti elaborata. Bing alimenta anche le ricerche di ChatGPT e di altri assistenti.

## 3. IndexNow (avvisa Bing e altri motori a ogni modifica)
1. Verifica che `https://kharonte.dev/426bd80580ca28dd1d4f4de2bbe94a3d.txt` sia raggiungibile (contiene la chiave).
2. `python3 tools/indexnow.py` → risposta 200 o 202 = ok. Rilancialo dopo ogni pubblicazione.

## 4. Verifiche dopo il lancio
- Anteprime social: incolla gli URL in un messaggio/Slack/LinkedIn e controlla l'immagine.
- Rich Results Test (search.google.com/test/rich-results) su una pagina app e sulla home (FAQ).
- PageSpeed Insights sulla home, mobile.
- Schede store: stesso nome, parole chiave coerenti col sito, etichette privacy coerenti con le promesse.

## 5. Contenuti da fornire per completare il lavoro
Valutazioni/recensioni reali, numeri veri, eventuali dati aziendali richiesti dalla legge (da verificare con un professionista).
