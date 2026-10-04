# Istruzioni per i coding agent — kharonte-studio (sito kharonte.dev)

Sito statico su GitHub Pages: **il ramo `main` è la produzione** (`kharo23/kharo23.github.io`, dominio `kharonte.dev`). Un push su `main` pubblica. Struttura e comandi: `README-HOME.md`. Brand e regole di contenuto: `docs/BRAND.md`.

## Piano di distribuzione e marketing (da tenere aggiornato)
Tutto il materiale è in `../marketing/` (fuori da questo repository): `README.md` (indice + regole per gli agent), `app_growth_tracker.md` (stato per app + registro), `piano_editoriale_social_app.md` (testi e regole community), più la strategia in `../DISTRIBUZIONE.md`. **Aggiornare il tracker (matrice + registro) a ogni scoperta e a ogni azione completata.** Non pubblicare a nome dell'utente su Reddit o altri social senza la sua approvazione per ogni singolo post e senza aver letto le regole della community.

## Regole di sicurezza (sempre)
- **Mai** committare credenziali. `gsc-service-account.json`, `*service-account*.json`, `*adminsdk*.json` sono in `.gitignore`: non rimuovere quelle righe, non copiare chiavi nel repository, non incollarle in chat né nei file.
- Chiavi usate dal progetto (solo percorsi, i valori non stanno qui):
  - Google Search Console: `~/.config/kharonte/gsc-service-account.json` (fuori dal repo, permessi 600; account `firebase-adminsdk-fbsvc@padel-match-manager`, API via JWT RS256, scope `https://www.googleapis.com/auth/webmasters`, proprietà `https://kharonte.dev/`). Mai rimetterlo nel repository.
  - Bing Webmaster: `~/.config/kharonte/bing-api-key.txt` (permessi 600). API: `https://ssl.bing.com/webmaster/api.svc/json/<Metodo>?apikey=…`.
  - IndexNow: chiave pubblica nel file `426bd80580ca28dd1d4f4de2bbe94a3d.txt` nella radice (deve restare online).
- Non inventare dati (città, tempi di risposta, recensioni, download, prezzi). Prezzi e disponibilità si verificano sugli store.
- Affermazioni di privacy: il **sito** non usa cookie né tracker (la home misura 0 richieste a terzi); le **app** possono raccogliere eventi d'uso/diagnostica pseudonimi e limitati (vedi le informative). Non scrivere "senza tracciamento" riferito alle app.

## Prima di ogni pubblicazione
1. **Home**: `index.html` (italiano) è la fonte. Dopo ogni modifica: `python3 tools/build-home.py` (rigenera `en/index.html` e `es/index.html`; si ferma se una frase italiana cambiata non ha traduzione). Non modificare a mano le home EN/ES.
2. **Pagine Servizi e per mestiere**: contenuti in `tools/landing_data.py`, poi `python3 tools/build-landing.py`.
   **Guide e Scritti**: contenuti in `tools/guides_data.py`; per aggiornare l'elenco degli articoli Medium `python3 tools/fetch-medium.py`, poi `python3 tools/build-content.py`. Le guide hanno data visibile e `dateModified` (campo `UPDATED`): aggiornarla quando si rivede una guida. Mai affermazioni fiscali/legali/mediche nelle guide; importi di esempio dichiarati illustrativi.
3. **Immagini social**, se cambiano titoli o screenshot: server locale + `python3 tools/render-og.py` (home) e `python3 tools/render-og-apps.py` (pagine app).
4. **Nuove pagine**: aggiungerle a `sitemap.xml` (con hreflang it/en/es/x-default e `lastmod` aggiornato), a `llms.txt` / `llms-full.txt` e collegarle da almeno una pagina esistente. Ogni pagina indicizzabile deve avere: title ≤ 60 car., description ≤ 160, un solo H1, canonical, hreflang reciproci, Open Graph + Twitter `summary_large_image`, JSON-LD valido, `<main>` e skip-link.
5. **Aggiornare le date**: `lastmod` nel sitemap per le pagine toccate; "Last updated" in `llms-full.txt`.
6. **Contenuti sensibili da riallineare** se cambia la realtà: stato di FlipEven (in rilascio → pubblicato), modello di prezzo delle app (Aegis ha abbonamenti), FAQ della home, `llms*.txt`.

## Verifica (locale: `python3 -m http.server 8765`)
- Nessun errore in console e **nessun scroll orizzontale a 390 px** su ogni pagina toccata, nelle tre lingue.
- Accessibilità: zero violazioni axe-core (WCAG 2.1 AA) sulle pagine toccate.
- Link interni non rotti, ID non duplicati, JSON-LD parsabile.
- Home: 0 richieste a terzi (font in `assets/fonts`, nessuno script esterno). I badge Launchstag/LaunchBuff stanno nel footer di Padel Match Manager (IT/EN/ES, entrambi), Preventivi Facili (IT/EN/ES, solo Launchstag → https://launchstag.com/p/preventivi-facili), Foodlio e Aegis (IT/EN/ES, solo Launchstag). Richiesti dai siti dove le app sono state presentate: non rimuoverli, non estenderli alla home.
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

## File per crawler e assistenti (tutti nella radice, da tenere allineati)
`robots.txt` (un solo gruppo condiviso), `sitemap.xml`, `llms.txt`, `llms-full.txt`, chiave IndexNow `*.txt`, `.well-known/security.txt` (rinnovare `Expires` ogni anno).

## Cosa non fare
- `tools/`, `docs/`, `AGENTS.md`, `CLAUDE.md`, `README-HOME.md` e `sentry-diagnostics.md` sono esclusi dalla pubblicazione tramite `_config.yml`: non toglierli dall'elenco `exclude`, e aggiungere lì ogni nuovo file interno.
- Non inviare form, iscrizioni o richieste a servizi esterni oltre a quelli elencati sopra senza conferma.
- Non cambiare identificatori/URL già indicizzati senza redirect e senza aggiornare sitemap, hreflang e canonical.
- Non reintrodurre font o script di terze parti nella home.
