# Istruzioni per i coding agent — kharonte-studio (sito kharonte.dev)

Sito statico su GitHub Pages: **il ramo `main` è la produzione** (`kharo23/kharo23.github.io`, dominio `kharonte.dev`). Un push su `main` pubblica. Struttura e comandi: `README-HOME.md`. Brand e regole di contenuto: `docs/BRAND.md`.

## Regole di sicurezza (sempre)
- **Mai** committare credenziali. `gsc-service-account.json`, `*service-account*.json`, `*adminsdk*.json` sono in `.gitignore`: non rimuovere quelle righe, non copiare chiavi nel repository, non incollarle in chat né nei file.
- Chiavi usate dal progetto (solo percorsi, i valori non stanno qui):
  - Google Search Console: `gsc-service-account.json` nella radice (ignorato da git; account `firebase-adminsdk-fbsvc@padel-match-manager`, API via JWT, scope `webmasters`). Se serve, spostarlo fuori dal repo e aggiornare questa riga.
  - Bing Webmaster: `~/.config/kharonte/bing-api-key.txt` (permessi 600). API: `https://ssl.bing.com/webmaster/api.svc/json/<Metodo>?apikey=…`.
  - IndexNow: chiave pubblica nel file `426bd80580ca28dd1d4f4de2bbe94a3d.txt` nella radice (deve restare online).
- Non inventare dati (città, tempi di risposta, recensioni, download, prezzi). Prezzi e disponibilità si verificano sugli store.
- Affermazioni di privacy: il **sito** non usa cookie né tracker (la home misura 0 richieste a terzi); le **app** possono raccogliere eventi d'uso/diagnostica pseudonimi e limitati (vedi le informative). Non scrivere "senza tracciamento" riferito alle app.

## Prima di ogni pubblicazione
1. **Home**: `index.html` (italiano) è la fonte. Dopo ogni modifica: `python3 tools/build-home.py` (rigenera `en/index.html` e `es/index.html`; si ferma se una frase italiana cambiata non ha traduzione). Non modificare a mano le home EN/ES.
2. **Pagine Servizi e per mestiere**: contenuti in `tools/landing_data.py`, poi `python3 tools/build-landing.py`.
3. **Immagini social**, se cambiano titoli o screenshot: server locale + `python3 tools/render-og.py` (home) e `python3 tools/render-og-apps.py` (pagine app).
4. **Nuove pagine**: aggiungerle a `sitemap.xml` (con hreflang it/en/es/x-default e `lastmod` aggiornato), a `llms.txt` / `llms-full.txt` e collegarle da almeno una pagina esistente. Ogni pagina indicizzabile deve avere: title ≤ 60 car., description ≤ 160, un solo H1, canonical, hreflang reciproci, Open Graph + Twitter `summary_large_image`, JSON-LD valido, `<main>` e skip-link.
5. **Aggiornare le date**: `lastmod` nel sitemap per le pagine toccate; "Last updated" in `llms-full.txt`.
6. **Contenuti sensibili da riallineare** se cambia la realtà: stato di FlipEven (in rilascio → pubblicato), modello di prezzo delle app (Aegis ha abbonamenti), FAQ della home, `llms*.txt`.

## Verifica (locale: `python3 -m http.server 8765`)
- Nessun errore in console e **nessun scroll orizzontale a 390 px** su ogni pagina toccata, nelle tre lingue.
- Accessibilità: zero violazioni axe-core (WCAG 2.1 AA) sulle pagine toccate.
- Link interni non rotti, ID non duplicati, JSON-LD parsabile.
- Home: 0 richieste a terzi (font in `assets/fonts`, nessuno script esterno). Le pagine app caricano i badge Launchstag/LaunchBuff: scelta nota, non estenderla alla home.
- Demo della home funzionanti (PDF, Foodlio, Padel, Aegis, FlipEven) in Chromium e WebKit (Firefox se possibile).

## Pubblicazione
1. Commit con messaggio chiaro. Prima del push: `git fetch` e unire `origin/main` se è avanti (qualcuno può aver pubblicato modifiche, es. badge o informative privacy): **non sovrascrivere** il lavoro altrui, risolvere i conflitti mantenendo entrambi i contributi.
2. `git push origin HEAD:main`; attendere la build di Pages (`gh api repos/kharo23/kharo23.github.io/pages/builds/latest`: stato `built`).
3. Controllare online: `/`, `/en/`, `/es/`, una pagina app, `/sitemap.xml`, `/llms.txt`, il file chiave IndexNow.

## Subito dopo la pubblicazione (indicizzazione)
1. **IndexNow** (Bing e altri): `python3 tools/indexnow.py` → risposta 200/202.
2. **Google Search Console**: reinviare `https://kharonte.dev/sitemap.xml` (PUT su `webmasters/v3/sites/https%3A%2F%2Fkharonte.dev%2F/sitemaps/<url-sitemap>`, risposta 204). Opzionale: ispezione URL delle pagine nuove.
3. **Bing Webmaster**: verificare con `GetFeeds` che il sitemap sia `Success` con il numero atteso di URL (la proprietà è già verificata e importata da Google).
4. Dopo 1–2 settimane: controllare indicizzazione e query in Search Console e Bing; segnalare cosa è cambiato.

## Cosa non fare
- Non inviare form, iscrizioni o richieste a servizi esterni oltre a quelli elencati sopra senza conferma.
- Non cambiare identificatori/URL già indicizzati senza redirect e senza aggiornare sitemap, hreflang e canonical.
- Non reintrodurre font o script di terze parti nella home.
