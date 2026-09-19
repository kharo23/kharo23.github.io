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

// FlipEven Break-Even Calculator Demo
const flipBuy = document.getElementById('flip-buy');
const flipSell = document.getElementById('flip-sell');
const flipFee = document.getElementById('flip-fee');
if (flipBuy && flipSell) {
  const updateFlip = () => {
    const b = flipBuy.valueAsNumber;
    const s = flipSell.valueAsNumber;
    const f = (flipFee && Number.isFinite(flipFee.valueAsNumber) ? flipFee.valueAsNumber : 10) / 100;
    const valid = Number.isFinite(b) && Number.isFinite(s) && b >= 0 && s > 0 && f < 1;
    if (valid) {
      const feeAmount = s * f;
      const net = s - b - feeAmount;
      const breakeven = b / (1 - f);
      const roi = b > 0 ? (net / b * 100) : 0;
      const netEl = document.getElementById('flip-net');
      const roiEl = document.getElementById('flip-roi');
      const beEl = document.getElementById('flip-breakeven');
      if (netEl) netEl.textContent = (net >= 0 ? '+' : '') + net.toLocaleString(t.locale, { style: 'currency', currency: t.currency });
      if (roiEl) roiEl.textContent = (roi >= 0 ? '+' : '') + roi.toLocaleString(t.locale, { maximumFractionDigits: 1 }) + '% ROI';
      if (beEl) beEl.textContent = t.flipBreakEvenPrefix + breakeven.toLocaleString(t.locale, { style: 'currency', currency: t.currency });
    } else {
      const netEl = document.getElementById('flip-net');
      const roiEl = document.getElementById('flip-roi');
      const beEl = document.getElementById('flip-breakeven');
      if (netEl) netEl.textContent = '—';
      if (roiEl) roiEl.textContent = '—';
      if (beEl) beEl.textContent = t.invalidInputs;
    }
  };
  flipBuy.addEventListener('input', updateFlip);
  flipSell.addEventListener('input', updateFlip);
  if (flipFee) flipFee.addEventListener('input', updateFlip);
  updateFlip();
}
