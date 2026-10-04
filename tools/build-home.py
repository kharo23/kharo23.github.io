#!/usr/bin/env python3
"""Genera la home inglese (en/index.html) e spagnola (es/index.html) a partire da index.html (italiano).

La home italiana e' la fonte di verita': ogni modifica si fa li', poi si rilancia
    python3 tools/build-home.py
Ogni stringa italiana della tabella TR deve comparire ALMENO una volta nel sorgente
(altrimenti lo script si ferma): cosi' una frase modificata in italiano non resta
silenziosamente non tradotta.
"""
import re, sys, json, html, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = (ROOT / "index.html").read_text()

# (italiano, inglese, spagnolo) — sottostringhe esatte del sorgente HTML
TR = [
 # ---- head ----
 ('<title>Kharonte Studio — App native iOS e Android indipendenti</title>', '<title>Kharonte Studio — Independent native iOS &amp; Android apps</title>', '<title>Kharonte Studio — Apps nativas independientes iOS y Android</title>'),
 ('Scopri le app native di Kharonte Studio create da @kharonteAppDev per iOS e Android: Preventivi Facili, Foodlio, Padel Match Manager, Aegis e FlipEven.',
  'Discover native iOS &amp; Android apps crafted by @kharonteAppDev: Preventivi Facili, Foodlio, Padel Match Manager, Aegis, and FlipEven.',
  'Descubre las apps nativas de Kharonte Studio para iOS y Android: Preventivi Facili, Foodlio, Padel Match Manager, Aegis y FlipEven.'),
 ('content="Kharonte Studio — App native iOS e Android indipendenti"', 'content="Kharonte Studio — Independent native iOS &amp; Android apps"', 'content="Kharonte Studio — Apps nativas independientes iOS y Android"'),
 ('App native per lavoro, sport e benessere create da @kharonteAppDev per iOS e Android.', 'Native apps for productivity, sports, and daily mindfulness by @kharonteAppDev.', 'Apps nativas para productividad, deporte y bienestar creadas por @kharonteAppDev para iOS y Android.'),
 ('"description": "Kharonte Studio crea app native indipendenti, veloci e senza abbonamenti per lavoro, sport e benessere."',
  '"description": "Kharonte Studio builds independent, fast native apps with no hidden subscriptions for work, sport and wellbeing."',
  '"description": "Kharonte Studio crea apps nativas independientes y rápidas, sin suscripciones ocultas, para trabajo, deporte y bienestar."'),
 # ---- accessibilita / nav ----
 ('Vai al contenuto', 'Skip to content', 'Ir al contenido'),
 ('aria-label="Navigazione principale"', 'aria-label="Main navigation"', 'aria-label="Navegación principal"'),
 ('>Prodotti</a>', '>Products</a>', '>Productos</a>'),
 ('>Chi sono</a>', '>About</a>', '>Sobre mí</a>'),
 ('Contattami ↗', 'Contact me ↗', 'Contáctame ↗'),
 # ---- hero ----
 ('aria-label="Cinque app. Una sola mano."', 'aria-label="Five apps. One maker."', 'aria-label="Cinco apps. Una sola mano."'),
 ('<span class="w">Cinque app.</span>', '<span class="w">Five apps.</span>', '<span class="w">Cinco apps.</span>'),
 ('<span class="w">Una sola <em>mano.</em></span>', '<span class="w">One <em>maker.</em></span>', '<span class="w">Una sola <em>mano.</em></span>'),
 ('<strong>Design, codice, store. Tutto da solo.</strong> Cinque prodotti reali per lavoro, sport e benessere. Non ti chiedo di crederci: qui sotto funzionano davvero.',
  '<strong>Design, code, store. All by myself.</strong> Five real products for work, sport and wellbeing. I won\'t ask you to take my word for it: down below, they actually work.',
  '<strong>Diseño, código, tiendas. Todo en solitario.</strong> Cinco productos reales para trabajo, deporte y bienestar. No te pido que me creas: aquí abajo funcionan de verdad.'),
 ('Prova le app <span', 'Try the apps <span', 'Prueba las apps <span'),
 ('Il codice su GitHub ↗', 'Code on GitHub ↗', 'El código en GitHub ↗'),
 ('aria-label="Le cinque app in orbita attorno a Caronte. Scegline una per provarla."', 'aria-label="The five apps orbiting Charon. Pick one to try it."', 'aria-label="Las cinco apps orbitando Caronte. Elige una para probarla."'),
 ('Caronte · tocca un\'app', 'Charon · tap an app', 'Caronte · toca una app'),
 ('Non leggere. Prova.', "Don't read. Try.", 'No leer. Probar.'),
 # ---- banco di prova ----
 ('aria-label="Il banco di prova"', 'aria-label="The test bench"', 'aria-label="El banco de pruebas"'),
 ('Il banco <em>di prova.</em>', 'The test <em>bench.</em>', 'El banco <em>de pruebas.</em>'),
 ('Ogni app è qui in miniatura e funziona sul serio: calcola, genera, respira. Tutto gira nel tuo browser, nessun dato lascia questa pagina.',
  'Every app is here in miniature, and it works for real: it calculates, generates, breathes. Everything runs in your browser, no data leaves this page.',
  'Cada app está aquí en miniatura y funciona de verdad: calcula, genera, respira. Todo se ejecuta en tu navegador, ningún dato sale de esta página.'),
 ('aria-label="Scegli un\'app"', 'aria-label="Choose an app"', 'aria-label="Elige una app"'),
 ('<small>Genera un PDF</small>', '<small>Generate a PDF</small>', '<small>Genera un PDF</small>'),
 ('<small>Calcola il margine</small>', '<small>Work out the margin</small>', '<small>Calcula el margen</small>'),
 ('<small>Organizza un torneo</small>', '<small>Run a tournament</small>', '<small>Organiza un torneo</small>'),
 ('<small>Respira con me</small>', '<small>Breathe with me</small>', '<small>Respira conmigo</small>'),
 ('<small>Vendi senza perdere</small>', '<small>Never sell at a loss</small>', '<small>Vende sin pérdidas</small>'),
 ('Preventivi e fatture in PDF dal telefono, 100% offline. Quanto ci metti a farne uno?', 'Quotes and invoices as PDF straight from your phone, 100% offline. How long does it take you to make one?', 'Presupuestos y facturas en PDF desde el móvil, 100% offline. ¿Cuánto tardas en hacer uno?'),
 ('secondi · parte alla prima battuta', 'seconds · starts at your first keystroke', 'segundos · empieza con la primera pulsación'),
 ('<label for="pv-client">Cliente</label>', '<label for="pv-client">Client</label>', '<label for="pv-client">Cliente</label>'),
 ('panel-label">Voci</span>', 'panel-label">Items</span>', 'panel-label">Conceptos</span>'),
 ('+ Aggiungi voce', '+ Add item', '+ Añadir concepto'),
 ('<label for="pv-vat">IVA</label>', '<label for="pv-vat">VAT</label>', '<label for="pv-vat">IVA</label>'),
 ('>Esente</option>', '>Exempt</option>', '>Exento</option>'),
 ('Genera il PDF ↓', 'Generate the PDF ↓', 'Generar el PDF ↓'),
 ('>Ricomincia</button>', '>Start over</button>', '>Empezar de nuevo</button>'),
 ('Il PDF viene creato sul tuo dispositivo, nessun server coinvolto.', 'The PDF is created on your device, no server involved.', 'El PDF se crea en tu dispositivo, sin ningún servidor.'),
 ('aria-label="Anteprima del preventivo"', 'aria-label="Quote preview"', 'aria-label="Vista previa del presupuesto"'),
 ('PREVENTIVO N. 104', 'QUOTE NO. 104', 'PRESUPUESTO N.º 104'),
 ('<th>Descrizione</th><th>Q.tà</th><th>Importo</th>', '<th>Description</th><th>Qty</th><th>Amount</th>', '<th>Descripción</th><th>Cant.</th><th>Importe</th>'),
 ('<span>Imponibile</span>', '<span>Subtotal</span>', '<span>Base imponible</span>'),
 ('<span id="pv-vatl">IVA 22%</span>', '<span id="pv-vatl">VAT 22%</span>', '<span id="pv-vatl">IVA 22%</span>'),
 ('<span>Totale</span>', '<span>Total</span>', '<span>Total</span>'),
 ("Nell'app: archivio clienti, firma, logo, fatture. Qui solo l'assaggio.", 'In the app: client archive, signature, logo, invoices. Here, just a taste.', 'En la app: archivo de clientes, firma, logo, facturas. Aquí, solo un adelanto.'),
 ("Com'è nell'app", 'See it in the app', 'Cómo es en la app'),
 ('alt="Schermata reale dell\'app"', 'alt="Real screenshot of the app"', 'alt="Captura real de la app"'),
 ('Scheda completa →', 'Full details →', 'Ficha completa →'),
 ('Food cost reale, margini e menu engineering per chef, bar e ristoranti. Muovi i prezzi e guarda cosa succede.', 'Real food cost, margins and menu engineering for chefs, bars and restaurants. Move the prices and see what happens.', 'Food cost real, márgenes e ingeniería de menú para chefs, bares y restaurantes. Mueve los precios y mira qué pasa.'),
 ('panel-label">Scegli un piatto</span>', 'panel-label">Pick a dish</span>', 'panel-label">Elige un plato</span>'),
 ('>Costo ingredienti</label>', '>Ingredient cost</label>', '>Coste de ingredientes</label>'),
 ('>Prezzo in carta (IVA incl.)</label>', '>Menu price (VAT incl.)</label>', '>Precio en carta (IVA incl.)</label>'),
 ('<span class="mono">margine</span>', '<span class="mono">margin</span>', '<span class="mono">margen</span>'),
 ('<span>Utile / piatto</span>', '<span>Profit / dish</span>', '<span>Beneficio / plato</span>'),
 ('<span>Prezzo al 30%</span>', '<span>Price at 30%</span>', '<span>Precio al 30%</span>'),
 ("Nell'app: ricette, fornitori, schede tecniche, menu engineering.", 'In the app: recipes, suppliers, spec sheets, menu engineering.', 'En la app: recetas, proveedores, fichas técnicas, ingeniería de menú.'),
 ('Americano senza fogli e calcolatrice. Scegli i giocatori: ogni coppia gioca insieme una volta sola.', 'Americano without paper sheets or a calculator. Pick the players: each pair plays together only once.', 'Americano sin hojas ni calculadora. Elige los jugadores: cada pareja juega junta una sola vez.'),
 ('panel-label">Giocatori</span>', 'panel-label">Players</span>', 'panel-label">Jugadores</span>'),
 ('aria-label="Numero di giocatori"', 'aria-label="Number of players"', 'aria-label="Número de jugadores"'),
 ('Genera i turni</button>', 'Generate rounds</button>', 'Generar rondas</button>'),
 ('Simula il torneo</button>', 'Simulate the tournament</button>', 'Simular el torneo</button>'),
 ("Nell'app: Mexicano, gironi, classifica live, condivisione.", 'In the app: Mexicano, group stages, live standings, sharing.', 'En la app: Mexicano, grupos, clasificación en vivo, compartir.'),
 ('Respirazione guidata, suoni e diario privato. Segui il cerchio: tutta la scena respira con te.', 'Guided breathing, sounds and a private journal. Follow the circle: the whole scene breathes with you.', 'Respiración guiada, sonidos y diario privado. Sigue el círculo: toda la escena respira contigo.'),
 ('<span id="ae-phase">Pronto</span>', '<span id="ae-phase">Ready</span>', '<span id="ae-phase">Listo</span>'),
 ('aria-label="Schema di respiro"', 'aria-label="Breathing pattern"', 'aria-label="Patrón de respiración"'),
 ('>Inizia a respirare</button>', '>Start breathing</button>', '>Empezar a respirar</button>'),
 ('Cicli completati: 0', 'Cycles completed: 0', 'Ciclos completados: 0'),
 ("Nell'app: suoni, diario, statistiche. Zero pubblicità.", 'In the app: sounds, journal, stats. No ads.', 'En la app: sonidos, diario, estadísticas. Sin publicidad.'),
 ('Prima di comprare, scopri a che prezzo devi rivendere. Basta vendite in perdita.', 'Before you buy, find out the price you need to resell at. No more selling at a loss.', 'Antes de comprar, descubre a qué precio debes revender. Se acabaron las ventas con pérdidas.'),
 ('In rilascio sugli store', 'Coming soon to the stores', 'Próximamente en las tiendas'),
 ('>Acquisto €</label>', '>Purchase €</label>', '>Compra €</label>'),
 ('>Vendita €</label>', '>Sale €</label>', '>Venta €</label>'),
 ('>Spedizione €</label>', '>Shipping €</label>', '>Envío €</label>'),
 ('panel-label">Commissione piattaforma</span>', 'panel-label">Platform fee</span>', 'panel-label">Comisión de plataforma</span>'),
 ("Percentuali di esempio: nell'app imposti quelle reali di ogni piattaforma.", 'Example percentages: in the app you set the real ones for each platform.', 'Porcentajes de ejemplo: en la app configuras los reales de cada plataforma.'),
 ('panel-label">Utile netto</span>', 'panel-label">Net profit</span>', 'panel-label">Beneficio neto</span>'),
 ('></i>Acquisto</span>', '></i>Purchase</span>', '></i>Compra</span>'),
 ('></i>Spedizione</span>', '></i>Shipping</span>', '></i>Envío</span>'),
 ('></i>Commissione</span>', '></i>Fee</span>', '></i>Comisión</span>'),
 ('></i>Utile</span>', '></i>Profit</span>', '></i>Beneficio</span>'),
 ('<span>Pareggio</span>', '<span>Break-even</span>', '<span>Equilibrio</span>'),
 ('<span>Margine</span>', '<span>Margin</span>', '<span>Margen</span>'),
 ("Nell'app: inventario, storico vendite, cataloghi.", 'In the app: inventory, sales history, catalogs.', 'En la app: inventario, historial de ventas, catálogos.'),
 # ---- manifesto ----
 ('aria-label="Manifesto"', 'aria-label="Manifesto"', 'aria-label="Manifiesto"'),
 ("mani-lead rv\">Chi c'è dietro</p>", "mani-lead rv\">Who's behind it</p>", 'mani-lead rv\">Quién hay detrás</p>'),
 ("Un designer, uno sviluppatore e chi gestisce gli store. Sono la stessa persona. Per questo ogni app è piccola, veloce, privata e finita fino all'ultimo pixel.",
  'A designer, a developer and whoever manages the app stores. They are the same person. That is why every app is small, fast, private and finished down to the last pixel.',
  'Un diseñador, un desarrollador y quien gestiona las tiendas de apps. Son la misma persona. Por eso cada app es pequeña, rápida, privada y está acabada hasta el último píxel.'),
 # ---- sugli store ----
 ('aria-label="Le app sul telefono"', 'aria-label="The apps on your phone"', 'aria-label="Las apps en tu móvil"'),
 ('Così appaiono <em>sul telefono.</em>', 'This is how they look <em>on your phone.</em>', 'Así se ven <em>en tu móvil.</em>'),
 ('Schermate reali, non mockup. Trascina per scorrere e tocca per aprire la scheda.', 'Real screenshots, not mockups. Drag to scroll and tap to open the page.', 'Capturas reales, no mockups. Arrastra para desplazarte y toca para abrir la ficha.'),
 ('aria-label="Scorri le schermate"', 'aria-label="Scroll the screenshots"', 'aria-label="Desplazar las capturas"'),
 ('aria-label="Precedente"', 'aria-label="Previous"', 'aria-label="Anterior"'),
 ('aria-label="Successiva"', 'aria-label="Next"', 'aria-label="Siguiente"'),
 ('alt="Preventivi Facili: fatturato accettato e preventivi recenti"', 'alt="Preventivi Facili: accepted revenue and recent quotes"', 'alt="Preventivi Facili: facturación aceptada y presupuestos recientes"'),
 ('alt="Foodlio: food cost e margini"', 'alt="Foodlio: food cost and margins"', 'alt="Foodlio: food cost y márgenes"'),
 ('alt="Padel Match Manager: torneo in corso"', 'alt="Padel Match Manager: tournament in progress"', 'alt="Padel Match Manager: torneo en curso"'),
 ('alt="Aegis: respirazione guidata"', 'alt="Aegis: guided breathing"', 'alt="Aegis: respiración guiada"'),
 ('<span class="mono">Lavoro</span>', '<span class="mono">Work</span>', '<span class="mono">Trabajo</span>'),
 ('<span class="mono">Cucina</span>', '<span class="mono">Kitchen</span>', '<span class="mono">Cocina</span>'),
 ('<span class="mono">Reselling</span>', '<span class="mono">Reselling</span>', '<span class="mono">Reventa</span>'),
 ('FlipEven · Reselling', 'FlipEven · Reselling', 'FlipEven · Reventa'),
 ('<span class="mono">Sport</span>', '<span class="mono">Sport</span>', '<span class="mono">Deporte</span>'),
 ('aria-label="FlipEven: guadagno netto reale +65,00 € su una vendita a 110 €"', 'aria-label="FlipEven: real net profit of €65.00 on a €110 sale"', 'aria-label="FlipEven: beneficio neto real de 65,00 € en una venta de 110 €"'),
 ('<strong>Sai quanto<br>guadagni davvero</strong>', '<strong>Know what<br>you really earn</strong>', '<strong>Sabe cuánto<br>ganas de verdad</strong>'),
 # ---- tre mestieri ----
 ('aria-label="Tre mestieri, una persona"', 'aria-label="Three jobs, one person"', 'aria-label="Tres oficios, una persona"'),
 ('Tre mestieri, <em>una persona.</em>', 'Three jobs, <em>one person.</em>', 'Tres oficios, <em>una persona.</em>'),
 ('Scegli un cappello e guarda lo stesso prodotto da tre lati: come lo disegno, come lo scrivo, come lo porto sugli store.', 'Pick a hat and look at the same product from three sides: how I design it, how I write it, how I bring it to the stores.', 'Elige un sombrero y mira el mismo producto desde tres lados: cómo lo diseño, cómo lo escribo, cómo lo llevo a las tiendas.'),
 ('aria-label="Scegli un mestiere"', 'aria-label="Choose a job"', 'aria-label="Elige un oficio"'),
 ('<strong>Design</strong>', '<strong>Design</strong>', '<strong>Diseño</strong>'),
 ('Ogni schermata è pensata per il gesto che farai davvero, con il pollice, in piedi, di fretta.', "Every screen is made for the gesture you'll really make: thumb in hand, standing up, in a hurry.", 'Cada pantalla está pensada para el gesto que harás de verdad: con el pulgar, de pie, con prisa.'),
 ('<strong>Codice</strong>', '<strong>Code</strong>', '<strong>Código</strong>'),
 ('App native, offline, con i calcoli sul telefono. Nessun server tra te e i tuoi dati.', 'Native apps, offline, with the calculations on your phone. No server between you and your data.', 'Apps nativas, offline, con los cálculos en el móvil. Ningún servidor entre tú y tus datos.'),
 ('<strong>Store</strong>', '<strong>Store</strong>', '<strong>Tiendas</strong>'),
 ('Build, test, revisione, scheda, screenshot, assistenza. Rispondo io, direttamente.', 'Build, testing, review, listing, screenshots, support. I reply directly.', 'Compilación, pruebas, revisión, ficha, capturas, soporte. Respondo yo, directamente.'),
 ('alt="Foodlio: schermata principale"', 'alt="Foodlio: main screen"', 'alt="Foodlio: pantalla principal"'),
 ('<em>Un solo dato in primo piano</em>', '<em>One number up front</em>', '<em>Un solo dato en primer plano</em>'),
 ('<em>Etichette piccole, numeri grandi</em>', '<em>Small labels, big numbers</em>', '<em>Etiquetas pequeñas, números grandes</em>'),
 ('<em>Azioni in basso, a portata di pollice</em>', '<em>Actions at the bottom, within thumb reach</em>', '<em>Acciones abajo, al alcance del pulgar</em>'),
 ('<em>Colore = stato: verde bene, rosso attenzione</em>', '<em>Color = status: green good, red warning</em>', '<em>Color = estado: verde bien, rojo atención</em>'),
 ('La logica della demo di Foodlio, semplificata', 'Foodlio demo logic, simplified', 'La lógica de la demo de Foodlio, simplificada'),
 ('aria-label="Codice di esempio"', 'aria-label="Example code"', 'aria-label="Código de ejemplo"'),
 ('''<span class="c">// Il calcolo che hai appena visto</span>
<span class="k">double</span> <span class="f">margine</span>(<span class="k">double</span> costo, <span class="k">double</span> prezzo) {
  <span class="k">final</span> netto = prezzo / <span class="n">1.10</span>; <span class="c">// IVA 10%</span>
  <span class="k">return</span> (netto - costo) / netto * <span class="n">100</span>;
}

<span class="k">if</span> (costo / netto &gt; <span class="n">0.30</span>) {
  <span class="f">avvisa</span>(<span class="s">'Stai regalando margine'</span>);
}''',
  '''<span class="c">// The calculation you just saw</span>
<span class="k">double</span> <span class="f">margin</span>(<span class="k">double</span> cost, <span class="k">double</span> price) {
  <span class="k">final</span> net = price / <span class="n">1.10</span>; <span class="c">// 10% VAT</span>
  <span class="k">return</span> (net - cost) / net * <span class="n">100</span>;
}

<span class="k">if</span> (cost / net &gt; <span class="n">0.30</span>) {
  <span class="f">warn</span>(<span class="s">'You are giving away margin'</span>);
}''',
  '''<span class="c">// El cálculo que acabas de ver</span>
<span class="k">double</span> <span class="f">margen</span>(<span class="k">double</span> coste, <span class="k">double</span> precio) {
  <span class="k">final</span> neto = precio / <span class="n">1.10</span>; <span class="c">// IVA 10%</span>
  <span class="k">return</span> (neto - coste) / neto * <span class="n">100</span>;
}

<span class="k">if</span> (coste / neto &gt; <span class="n">0.30</span>) {
  <span class="f">avisa</span>(<span class="s">'Estás regalando margen'</span>);
}'''),
 ('Prova: costo <output', 'Try it: cost <output', 'Pruébalo: coste <output'),
 ('· prezzo € 16,00</label>', '· price €16.00</label>', '· precio 16,00 €</label>'),
 ('<span>margine(<b id="try-c">', '<span>margin(<b id="try-c">', '<span>margen(<b id="try-c">'),
 ('<span class="chip soon">Nessun server</span>', '<span class="chip soon">No server</span>', '<span class="chip soon">Sin servidor</span>'),
 ('<span class="chip soon">Zero tracker</span>', '<span class="chip soon">Zero trackers</span>', '<span class="chip soon">Cero rastreadores</span>'),
 ('<span>Build</span>', '<span>Build</span>', '<span>Compilación</span>'),
 ('<span>Test su dispositivo</span>', '<span>Device testing</span>', '<span>Pruebas en dispositivo</span>'),
 ('<span>Revisione store</span>', '<span>Store review</span>', '<span>Revisión de tienda</span>'),
 ('<span>Pubblicata</span>', '<span>Published</span>', '<span>Publicada</span>'),
 ('<span>Food cost, margini e menu engineering</span>', '<span>Food cost, margins and menu engineering</span>', '<span>Food cost, márgenes e ingeniería de menú</span>'),
 ('class="get" href="./foodlio/">Scheda</a>', 'class="get" href="./foodlio/">Details</a>', 'class="get" href="./foodlio/">Ficha</a>'),
 # ---- FAQ e social ----
 ('Domande <em>frequenti.</em>', 'Frequently asked <em>questions.</em>', 'Preguntas <em>frecuentes.</em>'),
 ('Le risposte brevi a quello che mi chiedono più spesso.', 'Short answers to what people ask me most.', 'Respuestas breves a lo que más me preguntan.'),
 ('aria-label="Domande frequenti"', 'aria-label="Frequently asked questions"', 'aria-label="Preguntas frecuentes"'),
 ("Chi c'è dietro Kharonte Studio?", 'Who is behind Kharonte Studio?', '¿Quién está detrás de Kharonte Studio?'),
 ("Kharonte Studio è uno studio indipendente di una sola persona (@kharonteAppDev): progetto, sviluppo e pubblico ogni app, dall'interfaccia agli store.", 'Kharonte Studio is an independent one-person studio (@kharonteAppDev): I design, build and publish every app, from the interface to the stores.', 'Kharonte Studio es un estudio independiente de una sola persona (@kharonteAppDev): diseño, desarrollo y publico cada app, desde la interfaz hasta las tiendas.'),
 ('Su quali piattaforme sono disponibili le app?', 'Which platforms are the apps available on?', '¿En qué plataformas están disponibles las apps?'),
 ('Preventivi Facili, Foodlio, Padel Match Manager e Aegis sono su App Store e Google Play. FlipEven è in fase di rilascio sugli store.', 'Preventivi Facili, Foodlio, Padel Match Manager and Aegis are on the App Store and Google Play. FlipEven is currently being released on the stores.', 'Preventivi Facili, Foodlio, Padel Match Manager y Aegis están en App Store y Google Play. FlipEven está en proceso de lanzamiento en las tiendas.'),
 ('Le app funzionano offline e rispettano la privacy?', 'Do the apps work offline and respect privacy?', '¿Las apps funcionan sin conexión y respetan la privacidad?'),
 ("Sono progettate per lavorare sul tuo dispositivo e senza tracciamento: Preventivi Facili salva i dati solo sul telefono, Padel Match Manager gestisce i tornei offline e Aegis non ha pubblicità né tracciamento. I dettagli sono nella scheda di ogni app e nell'informativa privacy. Questo sito non usa cookie né tracker.", "They are designed to work on your device and without tracking: Preventivi Facili stores data only on the phone, Padel Match Manager runs tournaments offline, and Aegis has no ads and no tracking. Details are on each app's page and in its privacy policy. This site uses no cookies or trackers.", 'Están pensadas para funcionar en tu dispositivo y sin rastreo: Preventivi Facili guarda los datos solo en el móvil, Padel Match Manager gestiona los torneos sin conexión y Aegis no tiene publicidad ni rastreo. Los detalles están en la ficha de cada app y en su política de privacidad. Este sitio no usa cookies ni rastreadores.'),
 ('Le app sono gratuite?', 'Are the apps free?', '¿Las apps son gratuitas?'),
 ("Le app già pubblicate si scaricano gratuitamente. Preventivi Facili prevede un acquisto singolo a vita, senza canoni; Aegis offre abbonamenti mensili e annuali; per Foodlio e Padel Match Manager le opzioni Pro sono mostrate nell'app. Prezzi e condizioni aggiornati sono sempre indicati negli store.", 'The published apps can be downloaded for free. Preventivi Facili offers a one-time lifetime purchase with no recurring fees; Aegis offers monthly and annual subscriptions; for Foodlio and Padel Match Manager the Pro options are shown in the app. Current prices and terms are always listed in the stores.', 'Las apps ya publicadas se descargan gratis. Preventivi Facili ofrece una compra única de por vida, sin cuotas; Aegis ofrece suscripciones mensuales y anuales; en Foodlio y Padel Match Manager las opciones Pro se muestran en la app. Los precios y condiciones actualizados siempre figuran en las tiendas.'),
 ('Realizzi anche software su misura?', 'Do you also build custom software?', '¿También haces software a medida?'),
 ('Sì. Oltre alle app dello studio progetto e sviluppo app native per iOS e Android, piattaforme web full-stack e integrazioni di intelligenza artificiale. Scrivimi a kharonte.appdev@gmail.com con una breve descrizione del progetto.', "Yes. Besides the studio's own apps, I design and build native iOS and Android apps, full-stack web platforms and AI integrations. Write to me at kharonte.appdev@gmail.com with a short description of your project.", 'Sí. Además de las apps del estudio, diseño y desarrollo apps nativas para iOS y Android, plataformas web full-stack e integraciones de inteligencia artificial. Escríbeme a kharonte.appdev@gmail.com con una breve descripción de tu proyecto.'),
 ('Kharonte Studio: cinque app, una sola mano', 'Kharonte Studio: five apps, one maker', 'Kharonte Studio: cinco apps, una sola mano'),
 # ---- contatti / footer ----
 ('aria-label="Contatti"', 'aria-label="Contact"', 'aria-label="Contacto"'),
 ('>Progetti su misura</p>', '>Custom projects</p>', '>Proyectos a medida</p>'),
 ("Hai un'idea?<br><em>Parliamone</em>", "Got an idea?<br><em>Let's talk</em>", '¿Tienes una idea?<br><em>Hablemos</em>'),
 ('>Scrivimi</a>', '>Write to me</a>', '>Escríbeme</a>'),
 ('>Assistenza e FAQ</a>', '>Support &amp; FAQ</a>', '>Soporte y FAQ</a>'),
 ('Applicazioni native indipendenti per iOS e Android. Prodotti veloci, curati nel dettaglio e senza abbonamenti nascosti.', 'Independent native apps for iOS and Android. Fast, carefully crafted products with no hidden subscriptions.', 'Aplicaciones nativas independientes para iOS y Android. Productos rápidos, cuidados al detalle y sin suscripciones ocultas.'),
 ('<h3>Applicazioni</h3>', '<h3>Applications</h3>', '<h3>Aplicaciones</h3>'),
 ('<h3>Supporto &amp; Info</h3>', '<h3>Support &amp; Info</h3>', '<h3>Soporte e Info</h3>'),
 ('>Contattami</a>', '>Contact me</a>', '>Contáctame</a>'),
 ('>Informativa Privacy</a>', '>Privacy Policy</a>', '>Política de privacidad</a>'),
 ('Questa pagina: verifica in corso…', 'This page: checking…', 'Esta página: comprobando…'),
 ('subject=Progetto%20Custom', 'subject=Custom%20Project', 'subject=Proyecto%20Personalizado'),
]

LANGS = {
    'en': dict(idx=1, htmllang='en', locale='en_US', canon='https://kharonte.dev/en/', screens='en', ct='kharo23_hub_en', hl='en'),
    'es': dict(idx=2, htmllang='es', locale='es_ES', canon='https://kharonte.dev/es/', screens='es', ct='kharo23_hub_es', hl='es'),
}

PRODUCTS = ['preventivi-facili', 'foodlio', 'padel-match-manager', 'aegis', 'flipeven']


def fix_webpage(s, lang, cfg):
    """Il blocco WebPage cambia per lingua (url, nome, immagine); Organization e WebSite restano sul dominio radice."""
    def rep(m):
        d = json.loads(m.group(1))
        if d.get('@type') != 'WebPage':
            return m.group(0)
        d['@id'] = cfg['canon'] + '#webpage'; d['url'] = cfg['canon']; d['inLanguage'] = lang
        d['name'] = html.unescape(re.search(r'<title>(.*?)</title>', s, re.S).group(1))
        d['primaryImageOfPage']['url'] = f'https://kharonte.dev/assets/og-card-{lang}.jpg'
        return '<script type="application/ld+json">\n' + json.dumps(d, ensure_ascii=False, indent=2) + '\n  </script>'
    return re.sub(r'<script type="application/ld\+json">(.*?)</script>', rep, s, flags=re.S)

def build(lang, cfg):
    s = SRC
    missing = []
    for row in TR:
        it, tr = row[0], row[cfg['idx']]
        if it not in s:
            # alcune voci "di sicurezza" possono non esistere: segnaliamo solo le principali
            missing.append(it[:60]); continue
        s = s.replace(it, tr)
    s = re.sub(r'aria-label="Prova ([^"]+)"', ('aria-label="Try \\1"' if lang == 'en' else 'aria-label="Probar \\1"'), s)
    s = s.replace('og-card-it.jpg', f'og-card-{lang}.jpg')
    # lingua, canonical, og
    s = s.replace('<html lang="it">', f'<html lang="{cfg["htmllang"]}">')
    s = s.replace('<link rel="canonical" href="https://kharonte.dev/">', f'<link rel="canonical" href="{cfg["canon"]}">')
    s = s.replace('<meta property="og:url" content="https://kharonte.dev/">', f'<meta property="og:url" content="{cfg["canon"]}">')
    s = s.replace('<meta property="og:locale" content="it_IT">', f'<meta property="og:locale" content="{cfg["locale"]}">')
    # selettore lingua
    old = '<a href="./" class="on" aria-current="page">IT</a><a href="./en/">EN</a><a href="./es/">ES</a>'
    assert old in s
    def lk(code, label):
        href = {'it': '../', 'en': './' if lang == 'en' else '../en/', 'es': './' if lang == 'es' else '../es/'}[code]
        return f'<a href="{href}"' + (' class="on" aria-current="page"' if code == lang else '') + f'>{label}</a>'
    s = s.replace(old, lk('it', 'IT') + lk('en', 'EN') + lk('es', 'ES'))
    # protezione delle pagine di servizio che vivono dentro en/ e es/
    for p in ('about.html', 'support.html', 'privacy.html'):
        s = s.replace(f'href="./{p}"', f'href="@@KEEP@@{p}"')
    s = s.replace('href="./"', 'href="@@KEEP@@"')          # logo/brand -> home della lingua
    # pagine prodotto localizzate (link e dati strutturati)
    for p in PRODUCTS:
        s = s.replace(f'"url": "https://kharonte.dev/{p}/"', f'"url": "https://kharonte.dev/{p}/{lang}/"')
    for p in PRODUCTS:
        s = s.replace(f'href="./{p}/"', f'href="../{p}/{lang}/"')
    # schermate localizzate
    s = s.replace('screenshot-it.webp', f'screenshot-{cfg["screens"]}.webp').replace('preventivi-facili-hub-it.webp', f'preventivi-facili-hub-{cfg["screens"]}.webp')
    # percorsi relativi: da ./ a ../
    s = re.sub(r'(href|src)="\./(?!@)', r'\1="../', s)
    s = re.sub(r'(srcset|imagesrcset)="([^"]+)"', lambda m: m.group(1) + '="' + m.group(2).replace('./assets/', '../assets/') + '"', s)
    s = s.replace('@@KEEP@@', './')
    # store: tracking e lingua dello store
    s = s.replace('ct=kharo23_hub"', f'ct={cfg["ct"]}"').replace('hl=it&amp;', f'hl={cfg["hl"]}&amp;')
    s = fix_webpage(s, lang, cfg)
    out = ROOT / lang / 'index.html'
    out.write_text(s)
    return missing, out

if __name__ == '__main__':
    bad = False
    for lang, cfg in LANGS.items():
        missing, out = build(lang, cfg)
        print(f'{lang}: scritto {out.relative_to(ROOT)}')
        if missing:
            bad = True
            print('  stringhe non trovate nel sorgente:'); [print('   -', m) for m in missing]
    sys.exit(1 if bad else 0)
