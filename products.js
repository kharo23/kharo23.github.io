'use strict';
const lang = (document.documentElement.lang || 'it').toLowerCase().slice(0, 2);

const I18N = {
  it: {
    locale: 'it-IT',
    currency: 'EUR',
    marginPrefix: 'Differenza prezzo − ingredienti: ',
    invalidInputs: 'Inserisci un costo non negativo e un prezzo maggiore di zero.',
    roundLabel: (r, total) => `Turno ${r} di ${total}`,
    courtLabel: (n) => `Campo ${n}`,
    rounds: [
      [['Anna + Luca', 'Sara + Marco'], ['Giulia + Paolo', 'Elena + Fabio']],
      [['Anna + Sara', 'Giulia + Elena'], ['Luca + Marco', 'Paolo + Fabio']],
      [['Anna + Marco', 'Paolo + Elena'], ['Luca + Sara', 'Giulia + Fabio']]
    ],
    breathIdle: 'Al tuo ritmo',
    breathStart: 'Inizia la pausa',
    breathStop: 'Termina la pausa',
    inhale: 'Inspira',
    exhale: 'Espira',
    flipBreakEvenPrefix: 'Prezzo minimo per pareggio: ',
    flipNetGainPrefix: 'Guadagno netto stimato'
  },
  en: {
    locale: 'en-US',
    currency: 'EUR',
    marginPrefix: 'Price − ingredients margin: ',
    invalidInputs: 'Enter a non-negative cost and a price greater than zero.',
    roundLabel: (r, total) => `Round ${r} of ${total}`,
    courtLabel: (n) => `Court ${n}`,
    rounds: [
      [['Anna + Luke', 'Sarah + Mark'], ['Julia + Paul', 'Elena + Frank']],
      [['Anna + Sarah', 'Julia + Elena'], ['Luke + Mark', 'Paul + Frank']],
      [['Anna + Mark', 'Paul + Elena'], ['Luke + Sarah', 'Julia + Frank']]
    ],
    breathIdle: 'At your own pace',
    breathStart: 'Start pause',
    breathStop: 'End pause',
    inhale: 'Inhale',
    exhale: 'Exhale',
    flipBreakEvenPrefix: 'Minimum break-even price: ',
    flipNetGainPrefix: 'Estimated net profit'
  },
  es: {
    locale: 'es-ES',
    currency: 'EUR',
    marginPrefix: 'Diferencia precio − ingredientes: ',
    invalidInputs: 'Introduce un coste no negativo y un precio mayor que cero.',
    roundLabel: (r, total) => `Ronda ${r} de ${total}`,
    courtLabel: (n) => `Pista ${n}`,
    rounds: [
      [['Ana + Lucas', 'Sara + Marcos'], ['Julia + Pablo', 'Elena + Fabio']],
      [['Ana + Sara', 'Julia + Elena'], ['Lucas + Marcos', 'Pablo + Fabio']],
      [['Ana + Marcos', 'Pablo + Elena'], ['Lucas + Sara', 'Julia + Fabio']]
    ],
    breathIdle: 'A tu propio ritmo',
    breathStart: 'Iniciar pausa',
    breathStop: 'Terminar pausa',
    inhale: 'Inhala',
    exhale: 'Exhala',
    flipBreakEvenPrefix: 'Precio mínimo de equilibrio: ',
    flipNetGainPrefix: 'Ganancia neta estimada'
  }
};

const t = I18N[lang] || I18N.it;

// Foodlio Demo
const cost = document.getElementById('cost');
const price = document.getElementById('price');
if (cost && price) {
  const update = () => {
    const c = cost.valueAsNumber, p = price.valueAsNumber;
    const valid = Number.isFinite(c) && Number.isFinite(p) && c >= 0 && p > 0;
    document.getElementById('food-percent').textContent = valid
      ? (c / p * 100).toLocaleString(t.locale, { maximumFractionDigits: 1, minimumFractionDigits: 1 }) + '%'
      : '—';
    document.getElementById('food-margin').textContent = valid
      ? t.marginPrefix + (p - c).toLocaleString(t.locale, { style: 'currency', currency: t.currency })
      : t.invalidInputs;
  };
  cost.addEventListener('input', update);
  price.addEventListener('input', update);
  update();
}

// Padel Match Manager Demo
const next = document.getElementById('next-round');
if (next) {
  const rounds = t.rounds;
  let round = 0;
  next.addEventListener('click', () => {
    round = (round + 1) % rounds.length;
    document.getElementById('round-label').textContent = t.roundLabel(round + 1, rounds.length);
    document.getElementById('matches').innerHTML = rounds[round]
      .map((m, i) => `<p class="match">${t.courtLabel(i + 1)}<br><b>${m[0]}</b> vs <b>${m[1]}</b></p>`)
      .join('');
  });
}

// Aegis Breathing Demo
const breath = document.getElementById('breath-toggle');
if (breath) {
  let timer = null, inhale = false;
  const orb = document.getElementById('breathing-orb'), phase = document.getElementById('breath-phase');
  const stop = () => {
    clearInterval(timer);
    timer = null;
    orb.classList.remove('expanded');
    phase.textContent = t.breathIdle;
    breath.textContent = t.breathStart;
    breath.setAttribute('aria-pressed', 'false');
  };
  breath.addEventListener('click', () => {
    if (timer !== null) {
      stop();
      return;
    }
    inhale = false;
    const tick = () => {
      inhale = !inhale;
      orb.classList.toggle('expanded', inhale);
      phase.textContent = inhale ? t.inhale : t.exhale;
    };
    tick();
    timer = setInterval(tick, 4000);
    breath.textContent = t.breathStop;
    breath.setAttribute('aria-pressed', 'true');
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
  });
}

// FlipEven Interactive Platform Matrix & Phone Mockup
const platformPills = document.querySelectorAll('.platform-pill-btn');
if (platformPills.length) {
  const PLATFORMS_DATA = {
    it: {
      vinted: { name: 'Vinted', feeLabel: '0% venditore', rate: 0, fixed: 0, note: 'Zero commissioni trattenute dal tuo incasso (protezione pagata dal compratore).' },
      ebay: { name: 'eBay', feeLabel: '11.5% + 0.35€', rate: 0.115, fixed: 0.35, note: 'Tariffa finale sul valore del prodotto + quota fissa di elaborazione ordine.' },
      wallapop: { name: 'Wallapop', feeLabel: '5% spedizione', rate: 0.05, fixed: 0, note: 'Commissione di gestione transazione per ordini spediti con Wallapop.' },
      subito: { name: 'Subito.it', feeLabel: '4% TuttoSubito', rate: 0.04, fixed: 0, note: 'Trattenuta per il servizio di pagamento sicuro e garanzia acquirente.' },
      cash: { name: 'Contanti / Mercatino', feeLabel: '0% scambio a mano', rate: 0, fixed: 0, note: 'Scambio di persona: nessun intermediario, 100% del ricavato in tasca.' }
    },
    en: {
      vinted: { name: 'Vinted', feeLabel: '0% seller fee', rate: 0, fixed: 0, note: 'Zero fees taken from your payout (buyer pays protection fee).' },
      ebay: { name: 'eBay', feeLabel: '11.5% + €0.35', rate: 0.115, fixed: 0.35, note: 'Final value marketplace fee + order processing fixed charge.' },
      wallapop: { name: 'Wallapop', feeLabel: '5% protection', rate: 0.05, fixed: 0, note: 'Platform transaction and buyer protection handling fee.' },
      subito: { name: 'Subito / Local', feeLabel: '4% secure pay', rate: 0.04, fixed: 0, note: 'Escrow payment and insured shipping fee on local apps.' },
      cash: { name: 'Cash / In-Person', feeLabel: '0% direct meetup', rate: 0, fixed: 0, note: 'Direct local meetup: no middleman cut, keep 100% of profit.' }
    },
    es: {
      vinted: { name: 'Vinted', feeLabel: '0% vendedor', rate: 0, fixed: 0, note: 'Cero comisión al vendedor (la protección la paga el comprador).' },
      ebay: { name: 'eBay', feeLabel: '11.5% + 0.35€', rate: 0.115, fixed: 0.35, note: 'Comisión por valor final + tarifa fija por procesamiento de pedido.' },
      wallapop: { name: 'Wallapop', feeLabel: '5% gestión', rate: 0.05, fixed: 0, note: 'Tarifa de gestión y seguro de envío para transacciones en la app.' },
      subito: { name: 'Milanuncios Express', feeLabel: '4% pago seguro', rate: 0.04, fixed: 0, note: 'Retención de servicio de pago protegido para envíos seguros.' },
      cash: { name: 'En mano / Efectivo', feeLabel: '0% trato directo', rate: 0, fixed: 0, note: 'Trato en mano sin intermediarios: 100% del dinero limpio para ti.' }
    }
  };

  const buy = 45;
  const sell = 110;
  const currLang = PLATFORMS_DATA[lang] ? lang : 'it';
  const dataMap = PLATFORMS_DATA[currLang];

  platformPills.forEach(btn => {
    btn.addEventListener('click', () => {
      platformPills.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.getAttribute('data-platform') || 'vinted';
      const item = dataMap[key] || dataMap.vinted;

      const fee = (sell * item.rate) + item.fixed;
      const net = sell - buy - fee;
      const roi = (net / buy) * 100;
      const breakeven = (buy + item.fixed) / (1 - item.rate);

      const netEl = document.getElementById('mockup-net-val');
      const roiEl = document.getElementById('mockup-roi-val');
      const feeEl = document.getElementById('mockup-fee-val');
      const beEl = document.getElementById('mockup-be-val');
      const platformBadge = document.getElementById('mockup-platform-badge');
      const noteEl = document.getElementById('mockup-platform-note');

      if (netEl) netEl.textContent = `+${net.toFixed(2).replace('.', ',')} €`;
      if (roiEl) roiEl.textContent = `+${roi.toFixed(1)}% ROI`;
      if (feeEl) feeEl.textContent = `${fee.toFixed(2).replace('.', ',')} € (${item.feeLabel})`;
      if (beEl) beEl.textContent = `${breakeven.toFixed(2).replace('.', ',')} €`;
      if (platformBadge) platformBadge.textContent = item.name;
      if (noteEl) noteEl.textContent = item.note;
    });
  });
}
