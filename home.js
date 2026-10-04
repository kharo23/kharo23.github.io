/* Kharonte Studio — home "Il banco di prova". Nessuna dipendenza, nessuna richiesta a terzi. */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  /* ---------- lingua: testi usati dalle demo (il resto e' nell'HTML) ---------- */
  const LANG = (document.documentElement.lang || 'it').slice(0, 2);
  const LX_ALL = {
    it: { loc: 'it-IT',
      pv: { rows: ['Sostituzione caldaia', 'Manodopera (ore)'], idle: 'Il PDF viene creato sul tuo dispositivo, nessun server coinvolto.', vat: (n) => `IVA ${n}%`, exempt: 'IVA esente', done: (s) => `Fatto in ${s} secondi. Nell'app, con i clienti già salvati, ne bastano molti meno.`, ok: 'PDF generato.', file: 'preventivo-104-demo.pdf', title: 'PREVENTIVO N. 104', client: 'Cliente: ', date: 'Data: ', desc: 'Descrizione', qty: 'Qta', price: 'Prezzo', amount: 'Importo', sub: 'Imponibile', total: 'TOTALE', foot: 'Generato nel browser con la demo di Preventivi Facili - kharonte.dev' },
      fo: { dishes: ['Tagliata ai porcini', 'Pizza gourmet', 'Spritz signature', 'Tiramisù'], good: 'Margine sano', mid: "Da tenere d'occhio", bad: 'Stai regalando margine', hint: 'Calcolo sul prezzo al netto di IVA 10%. Soglia di riferimento: food cost sotto il 30%.' },
      pa: { name: 'Giocatore', info: (n) => `${n} giocatori · ${n - 1} turni · ogni coppia gioca insieme una sola volta.`, emptyT: 'Nessun torneo ancora', emptyD: 'Premi «Genera i turni» o «Simula il torneo».', turn: 'Turno', turns: 'Turni', court: 'Campo', pts: 'Punti', and: 'e', rest: 'A riposo:', board: 'Classifica', pt: 'pt' },
      ae: { ph: { in: 'Inspira', hold: 'Trattieni', out: 'Espira' }, coh: 'Coerente 5-5', ready: 'Pronto', go: 'Inizia a respirare', pause: 'Pausa', cycles: (n) => `Cicli completati: ${n}` },
      fe: ['Vinted 0%', 'Subito 5%', 'eBay 13%', 'Marketplace 10%'],
      proof: (t, c) => `Questa pagina · ${t} richieste a terzi · ${c} cookie · 0 tracker` },
    en: { loc: 'en-US',
      pv: { rows: ['Boiler replacement', 'Labor (hours)'], idle: 'The PDF is created on your device, no server involved.', vat: (n) => `VAT ${n}%`, exempt: 'VAT exempt', done: (s) => `Done in ${s} seconds. In the app, with clients already saved, it takes far less.`, ok: 'PDF generated.', file: 'quote-104-demo.pdf', title: 'QUOTE NO. 104', client: 'Client: ', date: 'Date: ', desc: 'Description', qty: 'Qty', price: 'Price', amount: 'Amount', sub: 'Subtotal', total: 'TOTAL', foot: 'Generated in the browser with the Preventivi Facili demo - kharonte.dev' },
      fo: { dishes: ['Porcini steak', 'Gourmet pizza', 'Signature spritz', 'Tiramisu'], good: 'Healthy margin', mid: 'Keep an eye on it', bad: "You're giving margin away", hint: 'Calculated on the price net of 10% VAT. Reference threshold: food cost under 30%.' },
      pa: { name: 'Player', info: (n) => `${n} players · ${n - 1} rounds · every pair plays together only once.`, emptyT: 'No tournament yet', emptyD: 'Press “Generate rounds” or “Simulate the tournament”.', turn: 'Round', turns: 'Rounds', court: 'Court', pts: 'Points', and: 'and', rest: 'Resting:', board: 'Standings', pt: 'pts' },
      ae: { ph: { in: 'Inhale', hold: 'Hold', out: 'Exhale' }, coh: 'Coherent 5-5', ready: 'Ready', go: 'Start breathing', pause: 'Pause', cycles: (n) => `Cycles completed: ${n}` },
      fe: ['Vinted 0%', 'Classifieds 5%', 'eBay 13%', 'Marketplace 10%'],
      proof: (t, c) => `This page · ${t} third-party requests · ${c} cookies · 0 trackers` },
    es: { loc: 'es-ES',
      pv: { rows: ['Sustitución de caldera', 'Mano de obra (horas)'], idle: 'El PDF se crea en tu dispositivo, sin ningún servidor.', vat: (n) => `IVA ${n}%`, exempt: 'IVA exento', done: (s) => `Hecho en ${s} segundos. En la app, con los clientes ya guardados, hace falta mucho menos.`, ok: 'PDF generado.', file: 'presupuesto-104-demo.pdf', title: 'PRESUPUESTO N.º 104', client: 'Cliente: ', date: 'Fecha: ', desc: 'Descripción', qty: 'Cant.', price: 'Precio', amount: 'Importe', sub: 'Base imponible', total: 'TOTAL', foot: 'Generado en el navegador con la demo de Preventivi Facili - kharonte.dev' },
      fo: { dishes: ['Entrecot con boletus', 'Pizza gourmet', 'Spritz de la casa', 'Tiramisú'], good: 'Margen sano', mid: 'Hay que vigilarlo', bad: 'Estás regalando margen', hint: 'Cálculo sobre el precio sin IVA del 10%. Umbral de referencia: food cost por debajo del 30%.' },
      pa: { name: 'Jugador', info: (n) => `${n} jugadores · ${n - 1} rondas · cada pareja juega junta una sola vez.`, emptyT: 'Aún no hay torneo', emptyD: 'Pulsa «Generar rondas» o «Simular el torneo».', turn: 'Ronda', turns: 'Rondas', court: 'Pista', pts: 'Puntos', and: 'y', rest: 'Descansan:', board: 'Clasificación', pt: 'pts' },
      ae: { ph: { in: 'Inspira', hold: 'Mantén', out: 'Espira' }, coh: 'Coherente 5-5', ready: 'Listo', go: 'Empezar a respirar', pause: 'Pausa', cycles: (n) => `Ciclos completados: ${n}` },
      fe: ['Vinted 0%', 'Anuncios 5%', 'eBay 13%', 'Marketplace 10%'],
      proof: (t, c) => `Esta página · ${t} solicitudes a terceros · ${c} cookies · 0 rastreadores` },
  };
  const LX = LX_ALL[LANG] || LX_ALL.it;
  const eur = new Intl.NumberFormat(LX.loc, { style: 'currency', currency: 'EUR' });
  const num = (v, d = 0) => (isFinite(v) ? v : 0).toLocaleString(LX.loc, { minimumFractionDigits: d, maximumFractionDigits: d });
  const val = (el) => parseFloat(String(el.value).replace(',', '.')) || 0;

  /* ---------- reveal + nav ---------- */
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
  $$('.hero .rv').forEach((el) => el.classList.add('in'));   // sopra la piega: subito, senza attendere l'osservatore
  $$('.rv').forEach((el) => { if (!el.classList.contains('in')) io.observe(el); });
  /* apertura coreografata: parte quando i font sono pronti (o dopo 900 ms) */
  let started = false; const go = () => { if (!started) { started = true; document.body.classList.add('go'); } };
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(go); setTimeout(go, 450); } else go();
  /* barra di avanzamento + luce globale */
  const prog = $('#progress'), gl2 = $('.g-lantern');
  let gx = 0.6 * innerWidth, gy = 0.3 * innerHeight, gtx = gx, gty = gy, graf = 0;
  const gtick = () => { gx += (gtx - gx) * 0.12; gy += (gty - gy) * 0.12; gl2.style.setProperty('--gx', gx.toFixed(0) + 'px'); gl2.style.setProperty('--gy', gy.toFixed(0) + 'px'); graf = Math.abs(gtx - gx) + Math.abs(gty - gy) > 0.5 ? requestAnimationFrame(gtick) : 0; };
  if (fine && !reduce) addEventListener('pointermove', (e) => { gtx = e.clientX; gty = e.clientY; if (!graf) graf = requestAnimationFrame(gtick); }, { passive: true }); else gl2.style.display = 'none';
  const nav = $('#nav');
  const onScroll = () => { nav.classList.toggle('solid', scrollY > 40); const m = document.documentElement.scrollHeight - innerHeight; prog.style.transform = `scaleX(${m > 0 ? Math.min(scrollY / m, 1) : 0})`; };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- hero: campo di flusso illuminato dalla lanterna ---------- */
  const moonArt = $('.moon-art'), hero = $('#top'), cv = $('#field'), ctx = cv.getContext('2d');
  const W0 = () => innerWidth; let W = 0, H = 0, dpr = 1, parts = [], mx = 0.7, my = 0.4, tx = 0.7, ty = 0.4, running = true, auto = !fine;
  function size() {
    dpr = Math.min(devicePixelRatio || 1, W0() < 700 ? 1.5 : 2);
    W = hero.clientWidth; H = hero.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#0a0b0d'; ctx.fillRect(0, 0, W, H);
    const n = Math.round(Math.min(W < 700 ? 520 : 1400, (W * H) / (W < 700 ? 1900 : 1500)));
    parts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, life: Math.random() * 200 }));
  }
  const angle = (x, y, t) => Math.sin(x * 0.0021 + t * 0.00007) * 2.1 + Math.cos(y * 0.0026 - t * 0.00005) * 2.1 + Math.sin((x + y) * 0.0009) * 1.4;
  function step(t) {
    mx += (tx - mx) * 0.06; my += (ty - my) * 0.06;
    ctx.fillStyle = 'rgba(10,11,13,0.075)'; ctx.fillRect(0, 0, W, H);
    const lx = mx * W, ly = my * H, R = Math.max(220, W * 0.17);
    ctx.lineWidth = 1;
    for (const p of parts) {
      const a = angle(p.x, p.y, t), nx = p.x + Math.cos(a) * 1.5, ny = p.y + Math.sin(a) * 1.5;
      const d = Math.hypot(p.x - lx, p.y - ly), k = Math.max(0, 1 - d / R);
      ctx.strokeStyle = k > 0.02 ? `rgba(255,${Math.round(190 - 30 * k)},${Math.round(110 - 50 * k)},${0.10 + k * 0.75})` : 'rgba(236,230,216,0.10)';
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(nx, ny); ctx.stroke();
      p.x = nx; p.y = ny; p.life++;
      if (p.life > 260 || nx < 0 || nx > W || ny < 0 || ny > H) { p.x = Math.random() * W; p.y = Math.random() * H; p.life = 0; }
    }
    hero.style.setProperty('--lx', lx + 'px'); hero.style.setProperty('--ly', ly + 'px');
    $('.lantern').style.setProperty('--lx', lx + 'px'); $('.lantern').style.setProperty('--ly', ly + 'px');
    if (moonArt) {
      const r = moonArt.getBoundingClientRect(), hr = hero.getBoundingClientRect();
      const dx = (hr.left + lx - (r.left + r.width / 2)) / r.width, dy = (hr.top + ly - (r.top + r.height / 2)) / r.height, m = Math.hypot(dx, dy) || 1, k = Math.min(1, m) / m;
      moonArt.style.setProperty('--mlx', (50 + dx * k * 46).toFixed(1) + '%'); moonArt.style.setProperty('--mly', (50 + dy * k * 46).toFixed(1) + '%');
    }
  }
  function frame(t) {
    if (running) {
      if (auto) { tx = 0.72 + Math.sin(t * 0.00031) * 0.22; ty = 0.42 + Math.cos(t * 0.00042) * 0.26; }
      step(t);
    }
    requestAnimationFrame(frame);
  }
  size(); addEventListener('resize', size);
  if (reduce) { for (let i = 0; i < 260; i++) step(i * 40); } else requestAnimationFrame(frame);
  new IntersectionObserver((e) => { running = e[0].isIntersecting; }).observe(hero);
  hero.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    const r = hero.getBoundingClientRect(); auto = false;
    tx = (e.clientX - r.left) / r.width; ty = (e.clientY - r.top) / r.height;
    const orb = $('#orbit'); orb.style.setProperty('--ox', ((tx - 0.5) * -22).toFixed(1) + 'px'); orb.style.setProperty('--oy', ((ty - 0.5) * -16).toFixed(1) + 'px');
  });

  /* ---------- banco di prova: tab ---------- */
  const tabs = $$('.rail-btn'), stage = $('#stage');
  const hooks = {};
  function select(app, focus) {
    tabs.forEach((t) => { const on = t.dataset.app === app; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; if (on && focus) t.focus(); });
    $$('.demo').forEach((d) => { const on = d.id === 'demo-' + app; d.hidden = !on; if (on) stage.style.setProperty('--accent', d.dataset.accent); });
    Object.keys(hooks).forEach((k) => hooks[k].stop && k !== app && hooks[k].stop());
    stage.style.setProperty('--breath', 0);
    if (hooks[app] && hooks[app].start) hooks[app].start();
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t.dataset.app));
    t.addEventListener('keydown', (e) => {
      const k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]; if (!k) return;
      e.preventDefault(); select(tabs[(i + k + tabs.length) % tabs.length].dataset.app, true);
    });
  });
  $$('.sat').forEach((s) => s.addEventListener('click', () => { select(s.dataset.app); $('#banco').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }));

  /* ---------- demo: Preventivi Facili ---------- */
  (function () {
    const rowsEl = $('#pv-rows'), body = $('#pv-body');
    let rows = [{ d: LX.pv.rows[0], q: 1, p: 1850 }, { d: LX.pv.rows[1], q: 6, p: 45 }];
    let t0 = 0, tick = 0, done = false;
    const setTime = (s) => { $('#pv-time').textContent = num(s, 1); };
    function startTimer() { if (t0 || done) return; t0 = performance.now(); tick = setInterval(() => setTime((performance.now() - t0) / 1000), 100); }
    function stopTimer() { clearInterval(tick); const s = t0 ? (performance.now() - t0) / 1000 : 0; setTime(s); return s; }
    function totals() {
      const sub = rows.reduce((a, r) => a + r.q * r.p, 0), v = val($('#pv-vat')), vat = sub * v / 100;
      return { sub, v, vat, tot: sub + vat };
    }
    function draw() {
      rowsEl.innerHTML = rows.map((r, i) => `<div class="row3"><input type="text" aria-label="Descrizione voce ${i + 1}" data-i="${i}" data-k="d" value="${r.d.replace(/"/g, '&quot;')}"><input type="number" aria-label="Quantità" data-i="${i}" data-k="q" value="${r.q}" min="0" inputmode="decimal"><input type="number" aria-label="Prezzo unitario" data-i="${i}" data-k="p" value="${r.p}" min="0" inputmode="decimal"></div>`).join('');
      preview();
    }
    function preview() {
      const T = totals();
      $('#pv-pclient').textContent = $('#pv-client').value || '—';
      $('#pv-date').textContent = new Date().toLocaleDateString(LX.loc);
      body.innerHTML = rows.map((r) => `<tr><td>${esc(r.d) || '—'}</td><td>${num(r.q, r.q % 1 ? 1 : 0)}</td><td>${eur.format(r.q * r.p)}</td></tr>`).join('');
      $('#pv-sub').textContent = eur.format(T.sub); $('#pv-vatl').textContent = T.v ? LX.pv.vat(T.v) : LX.pv.exempt;
      $('#pv-vatv').textContent = eur.format(T.vat); $('#pv-tot').textContent = eur.format(T.tot);
    }
    const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
    rowsEl.addEventListener('input', (e) => {
      const i = e.target.dataset.i; if (i == null) return; startTimer();
      rows[i][e.target.dataset.k] = e.target.dataset.k === 'd' ? e.target.value : val(e.target); preview();
    });
    $('#pv-client').addEventListener('input', () => { startTimer(); preview(); });
    $('#pv-vat').addEventListener('change', () => { startTimer(); preview(); });
    $('#pv-add').addEventListener('click', () => { startTimer(); rows.push({ d: '', q: 1, p: 0 }); draw(); rowsEl.querySelector('.row3:last-child input').focus(); });
    $('#pv-reset').addEventListener('click', () => { clearInterval(tick); t0 = 0; done = false; setTime(0); $('#pv-msg').textContent = LX.pv.idle; });
    $('#pv-pdf').addEventListener('click', () => {
      const s = stopTimer(); done = true; const T = totals();
      const L = [{ t: LX.pv.title, x: 50, y: 780, s: 22, b: 1 }, { t: LX.pv.client + ($('#pv-client').value || '-'), x: 50, y: 752, s: 12 }, { t: LX.pv.date + new Date().toLocaleDateString(LX.loc), x: 50, y: 736, s: 12 }, { l: [50, 708, 545] },
        { t: LX.pv.desc, x: 50, y: 690, s: 10, b: 1 }, { t: LX.pv.qty, x: 340, y: 690, s: 10, b: 1 }, { t: LX.pv.price, x: 400, y: 690, s: 10, b: 1 }, { t: LX.pv.amount, x: 480, y: 690, s: 10, b: 1 }];
      let y = 668;
      rows.forEach((r) => { L.push({ t: (r.d || '-').slice(0, 48), x: 50, y, s: 11 }, { t: num(r.q, r.q % 1 ? 1 : 0), x: 340, y, s: 11 }, { t: eur.format(r.p), x: 400, y, s: 11 }, { t: eur.format(r.q * r.p), x: 480, y, s: 11 }); y -= 20; });
      y -= 10; L.push({ l: [330, y + 12, 545] }, { t: LX.pv.sub, x: 340, y, s: 11 }, { t: eur.format(T.sub), x: 480, y, s: 11 });
      y -= 18; L.push({ t: T.v ? LX.pv.vat(T.v) : LX.pv.exempt, x: 340, y, s: 11 }, { t: eur.format(T.vat), x: 480, y, s: 11 });
      y -= 26; L.push({ t: LX.pv.total, x: 340, y, s: 14, b: 1 }, { t: eur.format(T.tot), x: 470, y, s: 14, b: 1 });
      L.push({ t: LX.pv.foot, x: 50, y: 40, s: 8 });
      const a = document.createElement('a'); a.href = URL.createObjectURL(makePdf(L)); a.download = LX.pv.file; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      $('#pv-msg').textContent = s ? LX.pv.done(num(s, 1)) : LX.pv.ok;
    });
    function makePdf(L) {
      const esc2 = (s) => s.replace(/\u20ac/g, '\\200').replace(/[\\()]/g, '\\$&').replace(/[^\x20-\x7e\xa0-\xff]/g, '?');
      const c = L.map((l) => l.l ? `0.5 w ${l.l[0]} ${l.l[1]} m ${l.l[2]} ${l.l[1]} l S` : `BT /F${l.b ? 2 : 1} ${l.s} Tf ${l.x} ${l.y} Td (${esc2(l.t)}) Tj ET`).join('\n');
      const objs = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
        '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>',
        `<< /Length ${c.length} >>\nstream\n${c}\nendstream`,
        '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'];
      let out = '%PDF-1.4\n'; const off = [];
      objs.forEach((o, i) => { off.push(out.length); out += `${i + 1} 0 obj\n${o}\nendobj\n`; });
      const x = out.length; out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + off.map((o) => String(o).padStart(10, '0') + ' 00000 n \n').join('') + `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${x}\n%%EOF`;
      const u = new Uint8Array(out.length); for (let i = 0; i < out.length; i++) u[i] = out.charCodeAt(i) & 255;
      return new Blob([u], { type: 'application/pdf' });
    }
    draw();
  })();

  /* ---------- demo: Foodlio ---------- */
  (function () {
    const dishes = [{ n: LX.fo.dishes[0], c: 4.2, p: 16 }, { n: LX.fo.dishes[1], c: 1.4, p: 8.5 }, { n: LX.fo.dishes[2], c: 1.1, p: 6 }, { n: LX.fo.dishes[3], c: 1.3, p: 6.5 }];
    const cost = $('#fo-cost'), price = $('#fo-price'), wrap = $('#fo-dishes');
    wrap.innerHTML = dishes.map((d, i) => `<button class="pill" type="button" aria-pressed="${i === 0}" data-i="${i}">${d.n}</button>`).join('');
    function calc() {
      const c = val(cost), p = val(price), net = p / 1.1, m = net > 0 ? (net - c) / net * 100 : 0, fc = net > 0 ? c / net * 100 : 0;
      $('#fo-cost-o').textContent = eur.format(c); $('#fo-price-o').textContent = eur.format(p);
      $('#fo-margin').textContent = num(Math.max(m, 0), 1) + '%';
      $('#fo-ring').style.strokeDashoffset = 326.7 * (1 - Math.min(Math.max(m, 0), 100) / 100);
      $('#fo-fc').textContent = num(fc, 1) + '%'; $('#fo-eur').textContent = eur.format(net - c); $('#fo-sug').textContent = eur.format(c / 0.3 * 1.1);
      const v = $('#fo-verdict'), good = fc <= 30, mid = fc <= 38;
      v.textContent = good ? LX.fo.good : mid ? LX.fo.mid : LX.fo.bad;
      v.style.color = good ? '#8ff0a4' : mid ? '#ffd166' : '#ff7a6b';
      $('#fo-ring').style.stroke = good ? '' : mid ? '#ffd166' : '#ff7a6b';
      $('#fo-hint').textContent = LX.fo.hint;
    }
    wrap.addEventListener('click', (e) => { const b = e.target.closest('.pill'); if (!b) return; const d = dishes[b.dataset.i]; cost.value = d.c; price.value = d.p; $$('.pill', wrap).forEach((x) => x.setAttribute('aria-pressed', x === b)); calc(); });
    [cost, price].forEach((el) => el.addEventListener('input', () => { $$('.pill', wrap).forEach((x) => x.setAttribute('aria-pressed', false)); calc(); }));
    cost.value = dishes[0].c; price.value = dishes[0].p; calc();
  })();

  /* ---------- demo: Padel Match Manager (Americano) ---------- */
  (function () {
    const base = ['Marco', 'Leo', 'Alex', 'Sam', 'Giulia', 'Nico', 'Sofia', 'Teo'];
    let n = 6, names = base.slice(), rounds = [], cur = 0, scores = {};
    const namesEl = $('#pa-names'), out = $('#pa-out');
    const nm = (i) => names[i].trim() || 'G' + (i + 1);
    function drawNames() {
      namesEl.innerHTML = names.slice(0, n).map((x, i) => `<input type="text" aria-label="${LX.pa.name} ${i + 1}" value="${x}" data-i="${i}" maxlength="14">`).join('');
      $('#pa-info').textContent = LX.pa.info(n);
    }
    function gen() {
      rounds = []; scores = {}; cur = 0;
      const ids = Array.from({ length: n }, (_, i) => i), fixed = ids[0]; let rest = ids.slice(1);
      for (let r = 0; r < n - 1; r++) {
        const l = [fixed, ...rest], pairs = [];
        for (let i = 0; i < n / 2; i++) pairs.push([l[i], l[n - 1 - i]]);
        const ms = []; for (let k = 0; k + 1 < pairs.length; k += 2) ms.push([pairs[k], pairs[k + 1]]);
        rounds.push({ ms, rest: pairs.length % 2 ? pairs[pairs.length - 1] : null });
        rest = [rest[rest.length - 1], ...rest.slice(0, -1)];
      }
      render();
    }
    function board() {
      const pts = Array(n).fill(0), pl = Array(n).fill(0);
      rounds.forEach((r, ri) => r.ms.forEach((m, mi) => { const s = scores[ri + '-' + mi]; if (!s || s[0] == null || s[1] == null) return; m[0].forEach((p) => { pts[p] += s[0]; pl[p]++; }); m[1].forEach((p) => { pts[p] += s[1]; pl[p]++; }); }));
      return pts.map((p, i) => ({ i, p, g: pl[i] })).sort((a, b) => b.p - a.p || a.g - b.g);
    }
    function render() {
      if (!rounds.length) { out.innerHTML = '<div class="empty"><div><b style="font:400 1.4rem var(--serif);color:var(--bone)">' + LX.pa.emptyT + '</b><br>' + LX.pa.emptyD + '</div></div>'; return; }
      const r = rounds[cur];
      out.innerHTML = `<span class="mono panel-label">${LX.pa.turn}</span><div class="rounds" role="group" aria-label="${LX.pa.turns}">${rounds.map((_, i) => `<button type="button" aria-pressed="${i === cur}" data-r="${i}">${i + 1}</button>`).join('')}</div>` +
        r.ms.map((m, mi) => { const s = scores[cur + '-' + mi] || []; return `<div class="match"><div class="mono court">${LX.pa.court} ${mi + 1}</div>${[0, 1].map((t) => `<div class="team"><span>${nm(m[t][0])} / ${nm(m[t][1])}</span><input type="number" min="0" max="99" inputmode="numeric" aria-label="${LX.pa.pts} ${nm(m[t][0])} ${LX.pa.and} ${nm(m[t][1])}" data-m="${mi}" data-t="${t}" value="${s[t] ?? ''}" placeholder="–"></div>`).join('')}</div>`; }).join('') +
        (r.rest ? `<p class="minor" style="margin-bottom:12px">${LX.pa.rest} ${nm(r.rest[0])} / ${nm(r.rest[1])}</p>` : '') +
        `<span class="mono panel-label" style="margin-top:12px">${LX.pa.board}</span><table class="board" id="pa-board"></table>`;
      boardDraw();
    }
    function boardDraw() { const b = $('#pa-board'); if (b) b.innerHTML = board().map((x, k) => `<tr><td>${k + 1}</td><td>${nm(x.i)}</td><td>${x.p} ${LX.pa.pt}</td></tr>`).join(''); }
    $$('.seg button').forEach((b) => b.addEventListener('click', () => { n = +b.dataset.n; $$('.seg button').forEach((x) => x.setAttribute('aria-pressed', x === b)); rounds = []; drawNames(); render(); }));
    namesEl.addEventListener('input', (e) => { names[+e.target.dataset.i] = e.target.value; if (rounds.length) render(); });
    out.addEventListener('click', (e) => { const b = e.target.closest('[data-r]'); if (b) { cur = +b.dataset.r; render(); } });
    out.addEventListener('input', (e) => { const t = e.target; if (t.dataset.m == null) return; const k = cur + '-' + t.dataset.m; scores[k] = scores[k] || [null, null]; scores[k][+t.dataset.t] = t.value === '' ? null : Math.max(0, Math.min(99, +t.value)); boardDraw(); });
    $('#pa-gen').addEventListener('click', gen);
    $('#pa-sim').addEventListener('click', () => { gen(); rounds.forEach((r, ri) => r.ms.forEach((_, mi) => { const a = 3 + Math.floor(Math.random() * 6); let b = 3 + Math.floor(Math.random() * 6); if (a === b) b = (b + 1) % 9; scores[ri + '-' + mi] = [a, b]; })); render(); });
    drawNames(); render();
  })();

  /* ---------- demo: Aegis (respiro) ---------- */
  (function () {
    const pats = [{ n: 'Box 4-4-4-4', s: [['in', 4], ['hold', 4], ['out', 4], ['hold', 4]] }, { n: '4-7-8', s: [['in', 4], ['hold', 7], ['out', 8]] }, { n: LX.ae.coh, s: [['in', 5], ['out', 5]] }];
    let p = 0, on = false, raf = 0, t0 = 0, cycles = 0, lastCycle = -1;
    const orb = $('#ae-orb'), petals = $('#lt-petals', orb), wrap = $('#ae-pats'), go = $('#ae-go');
    wrap.innerHTML = pats.map((x, i) => `<button class="pill" type="button" aria-pressed="${i === 0}" data-i="${i}">${x.n}</button>`).join('');
    const PET = 'M0 0C-.55 -.35 -.45 -.78 0 -1C.45 -.78 .55 -.35 0 0Z';
    petals.innerHTML = [0, 1].map((r) => Array.from({ length: 6 }, (_, i) => `<path d="${PET}" fill="url(#lt-p${r ? 'i' : 'o'})" stroke="#fff" stroke-opacity="${r ? .65 : .55}" stroke-width="1" vector-effect="non-scaling-stroke"/>`).join('')).join('');
    const pp = petals.children, g = $('#lt-g', orb), sc = $('#lt-sc', orb), cg = $('#lt-cg', orb), cp = $('#lt-cp', orb);
    function bloom(e) {
      const s = 0.85 + 0.45 * e, ol = 44 * (0.85 + e * 0.28), il = ol * 0.68, oo = 8 + e * 9, io = 4 + e * 5, core = 12 * (0.85 + e * 0.25);
      for (let i = 0; i < 6; i++) {
        pp[i].setAttribute('transform', `rotate(${(i * 60 + e * 4.6).toFixed(2)}) translate(0 ${-oo.toFixed(2)}) scale(${(ol * 0.54).toFixed(2)} ${ol.toFixed(2)})`);
        pp[6 + i].setAttribute('transform', `rotate(${(i * 60 + 30 - e * 2.9).toFixed(2)}) translate(0 ${-io.toFixed(2)}) scale(${(il * 0.58).toFixed(2)} ${il.toFixed(2)})`);
      }
      g.setAttribute('r', (88 * s).toFixed(2)); g.style.opacity = (0.6 + 0.4 * e).toFixed(2);
      cg.setAttribute('r', (core * 2.2).toFixed(2)); cp.setAttribute('r', (core * 0.45).toFixed(2));
      sc.setAttribute('transform', `scale(${s.toFixed(3)})`);
    }
    bloom(0);
    const lvl = (name, f) => name === 'in' ? f : name === 'out' ? 1 - f : null;
    function loop(now) {
      const steps = pats[p].s, total = steps.reduce((a, s) => a + s[1], 0), t = ((now - t0) / 1000), cyc = Math.floor(t / total); let u = t % total, k = 0;
      while (u >= steps[k][1]) { u -= steps[k][1]; k++; }
      const [name, d] = steps[k], f = u / d; let level = lvl(name, f);
      if (level == null) level = steps[k - 1 >= 0 ? k - 1 : steps.length - 1][0] === 'in' ? 1 : 0;
      const e = level * level * (3 - 2 * level);
      bloom(e); stage.style.setProperty('--breath', e.toFixed(3)); orb.style.setProperty('--breath', e.toFixed(3));
      $('#ae-phase').textContent = LX.ae.ph[name]; $('#ae-sec').textContent = Math.ceil(d - u);
      if (cyc !== lastCycle) { if (lastCycle >= 0) cycles++; lastCycle = cyc; $('#ae-info').textContent = LX.ae.cycles(cycles); }
      raf = requestAnimationFrame(loop);
    }
    function begin() { on = true; cycles = 0; lastCycle = -1; t0 = performance.now(); go.textContent = LX.ae.pause; raf = requestAnimationFrame(loop); }
    function halt() { on = false; cancelAnimationFrame(raf); go.textContent = LX.ae.go; bloom(0); orb.style.setProperty('--breath', 0); stage.style.setProperty('--breath', 0); $('#ae-phase').textContent = LX.ae.ready; $('#ae-sec').textContent = '·'; }
    go.addEventListener('click', () => (on ? halt() : begin()));
    wrap.addEventListener('click', (e) => { const b = e.target.closest('.pill'); if (!b) return; p = +b.dataset.i; $$('.pill', wrap).forEach((x) => x.setAttribute('aria-pressed', x === b)); if (on) begin(); });
    hooks.aegis = { stop: halt };
  })();

  /* ---------- demo: FlipEven ---------- */
  (function () {
    const fees = [{ n: LX.fe[0], f: 0 }, { n: LX.fe[1], f: 5 }, { n: LX.fe[2], f: 13 }, { n: LX.fe[3], f: 10 }];
    let fee = 0; const wrap = $('#fe-fees');
    wrap.innerHTML = fees.map((x, i) => `<button class="pill" type="button" aria-pressed="${i === 0}" data-f="${x.f}">${x.n}</button>`).join('');
    function calc() {
      const b = val($('#fe-buy')), s = val($('#fe-sell')), sh = val($('#fe-ship')), c = s * fee / 100, net = s - b - sh - c;
      const el = $('#fe-net'); el.textContent = (net >= 0 ? '+' : '') + eur.format(net); el.classList.toggle('neg', net < 0);
      $('#fe-roi').textContent = b > 0 ? num(net / b * 100) + '%' : '–'; $('#fe-be').textContent = eur.format((b + sh) / (1 - fee / 100)); $('#fe-mg').textContent = s > 0 ? num(net / s * 100) + '%' : '–';
      const loss = Math.max(0, -net), tot = Math.max(s, b + sh + c) || 1, parts = [b, sh, c, Math.max(net, 0), loss];
      $$('#fe-bar i').forEach((i, k) => { i.style.flexGrow = (parts[k] / tot).toFixed(4); i.style.flexBasis = 0; });
    }
    wrap.addEventListener('click', (e) => { const x = e.target.closest('.pill'); if (!x) return; fee = +x.dataset.f; $$('.pill', wrap).forEach((y) => y.setAttribute('aria-pressed', y === x)); calc(); });
    ['#fe-buy', '#fe-sell', '#fe-ship'].forEach((s) => $(s).addEventListener('input', calc)); calc();
  })();

  /* ---------- manifesto: parole che si accendono con lo scroll ---------- */
  (function () {
    const el = $('#mani'); const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w) => `<span>${w}</span>`).join(' '); const sp = $$('span', el);
    function upd() { const r = el.getBoundingClientRect(), p = (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35); const k = Math.round(Math.min(Math.max(p, 0), 1) * sp.length); sp.forEach((s, i) => s.classList.toggle('on', i < k)); }
    if (reduce) sp.forEach((s) => s.classList.add('on')); else { addEventListener('scroll', upd, { passive: true }); upd(); }
  })();

  /* ---------- "com'e' nell'app" ---------- */
  (function () {
    const peeks = $$('.peek');
    const close = (except) => peeks.forEach((p) => { if (p !== except) { p.classList.remove('open'); $('.peek-btn', p).setAttribute('aria-expanded', 'false'); } });
    peeks.forEach((p) => $('.peek-btn', p).addEventListener('click', (e) => { e.stopPropagation(); const o = !p.classList.contains('open'); close(p); p.classList.toggle('open', o); e.currentTarget.setAttribute('aria-expanded', o); }));
    document.addEventListener('click', () => close()); document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  })();

  /* ---------- codice: righe che compaiono + prova dal vivo ---------- */
  (function () {
    const code = $('#hat-code-src'); if (!code) return;
    code.innerHTML = code.innerHTML.split('\n').map((l, i) => `<span class="ln2" style="--i:${i}">${l || ' '}</span>`).join('');
    const r = $('#try-cost'), pr = 16;
    function upd() { const c = val(r), net = pr / 1.1, m = (net - c) / net * 100; $('#try-cost-o').textContent = eur.format(c); $('#try-c').textContent = c.toFixed(2); $('#try-m').textContent = num(m, 1) + '%'; }
    r.addEventListener('input', upd); upd();
  })();

  /* ---------- striscia store: trascina, frecce, inclinazione ---------- */
  (function () {
    const strip = $('#strip'); if (!strip) return;
    let down = false, sx = 0, sl = 0, moved = 0;
    strip.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = 0; sx = e.clientX; sl = strip.scrollLeft; });
    addEventListener('pointermove', (e) => { if (!down) return; const d = e.clientX - sx; moved = Math.max(moved, Math.abs(d)); if (moved > 5) strip.classList.add('drag'); strip.scrollLeft = sl - d; });
    addEventListener('pointerup', () => { if (!down) return; down = false; setTimeout(() => strip.classList.remove('drag'), 0); });
    const step = () => Math.max(240, strip.clientWidth * 0.6);
    $('#strip-prev').addEventListener('click', () => strip.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }));
    $('#strip-next').addEventListener('click', () => strip.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }));
    if (fine && !reduce) $$('.phone', strip).forEach((p) => {
      const s = $('.shell', p);
      p.addEventListener('pointermove', (e) => { const r = p.getBoundingClientRect(); s.style.setProperty('--ry', (((e.clientX - r.left) / r.width - 0.5) * 12).toFixed(1) + 'deg'); s.style.setProperty('--rx', (-((e.clientY - r.top) / r.height - 0.5) * 8).toFixed(1) + 'deg'); });
      p.addEventListener('pointerleave', () => { s.style.setProperty('--rx', '0deg'); s.style.setProperty('--ry', '0deg'); });
    });
  })();

  /* ---------- tre cappelli ---------- */
  (function () {
    const btns = $$('.hat-btn'), bar = $('#hat-bar'), box = $('#hats'); let cur = 0, timer = 0, user = reduce, visible = false, t0 = 0, raf = 0;
    const DUR = 7000;
    function show(i) {
      cur = i;
      btns.forEach((b, k) => { b.setAttribute('aria-selected', k === i); b.tabIndex = k === i ? 0 : -1; });
      $$('.hat-panel').forEach((p, k) => { p.hidden = k !== i; p.classList.toggle('live', k === i); });
      t0 = performance.now();
    }
    function tickBar(now) {
      const f = user || !visible ? 0 : Math.min((now - t0) / DUR, 1);
      bar.style.transform = `scaleX(${f})`;
      if (!user && visible && f >= 1) show((cur + 1) % btns.length);
      raf = requestAnimationFrame(tickBar);
    }
    btns.forEach((b, i) => {
      b.addEventListener('click', () => { user = true; show(i); });
      b.addEventListener('keydown', (e) => { const k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]; if (!k) return; e.preventDefault(); user = true; const n = (i + k + btns.length) % btns.length; show(n); btns[n].focus(); });
    });
    new IntersectionObserver((e) => { visible = e[0].isIntersecting; if (visible) t0 = performance.now(); }, { threshold: 0.35 }).observe(box);
    show(0); if (!reduce) raf = requestAnimationFrame(tickBar);
  })();

  /* ---------- prova in diretta nel footer ---------- */
  (function () {
    const out = $('#live-proof');
    function fill() {
      const res = performance.getEntriesByType('resource'), third = res.filter((r) => { try { return new URL(r.name).origin !== location.origin; } catch (e) { return false; } }).length;
      out.textContent = LX.proof(third, document.cookie ? document.cookie.split(';').length : 0);
    }
    if (document.readyState === 'complete') fill(); else addEventListener('load', () => setTimeout(fill, 50));
  })();


  select('preventivi');
})();
