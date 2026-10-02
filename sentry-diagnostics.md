# Diagnostica delle terminazioni iOS

I breadcrumb `app.operation` registrano inizio/fine, esito e durata di avvio,
attesa degli store, PDF, selezione/ridimensionamento immagini e backup locale/iCloud.
Un inizio senza fine indica un'operazione potenzialmente interrotta, non prova
che sia la causa della terminazione. Le durate includono eventuale attesa nei
selettori e nelle finestre native di condivisione.

`app.screen` e il tag `app_screen` usano solo rotte presenti in una allowlist
(es. `preventivo/[id]`), mai ID concreti o query. `app.state` registra il ciclo di
vita; `app.memory` registra gli avvisi di memoria ricevuti da React Native.
`technical_runtime` conserva piattaforma e versione OS nel contesto Sentry.
La mancata ricezione di un avviso non esclude esaurimento della memoria.

Non passare dati di dominio, errori, percorsi, nomi di file o oggetti utente agli
helper. I nuovi breadcrumb sono sicuri già prima del passaggio al livello nativo:
il filtro JavaScript `beforeSend` non filtra tutti gli eventi generati dal SDK
Cocoa. La strumentazione è disattivata in sviluppo. Non abilita tracing o replay.

## Verifica su release (ancora da eseguire su dispositivo)

1. Usare una build release interna con DSN Sentry configurato e dati fittizi.
2. Avviare a freddo; navigare tra elenco/dettaglio; generare/condividere un PDF;
   selezionare e annullare un'immagine; esportare/importare un backup fittizio;
   portare l'app in background e riaprirla.
3. In una build diagnostica temporanea, generare un errore di prova gestito e,
   separatamente, un crash nativo di prova. Non distribuire il trigger di crash.
   Riaprire l'app dopo il crash per consentire l'invio.
4. Nel JSON Sentry verificare breadcrumb, esiti, durate, `app_screen`, `app_state`
   e `technical_runtime`; controllare l'assenza di dati dei fixture e percorsi.
   Verificare separatamente `device`/`os` automatici e simbolicazione nativa.
5. Un crash nativo di prova non riproduce necessariamente un watchdog: alla
   successiva ricorrenza reale controllare il contesto della sessione precedente.

Il codice Cocoa installato (`SentryWatchdogTerminationTracker`) ricostruisce il
report dai breadcrumb e dal contesto precedentemente salvati su disco e può
usare il timestamp dell'ultimo breadcrumb. Gli orari del report non sono quindi
una misura certa della durata dell'app o dell'istante della terminazione.
Un kill prima dell'inizializzazione JavaScript o prima del salvataggio nativo
può comunque lasciare un report incompleto. Questa modifica non conferma né
risolve la causa dell'evento PREVENTIVI-FACILI-8.
