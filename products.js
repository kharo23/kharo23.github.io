'use strict';
const cost = document.getElementById('cost');
const price = document.getElementById('price');
if (cost && price) {
  const update = () => {
    const c = cost.valueAsNumber, p = price.valueAsNumber;
    const valid = Number.isFinite(c) && Number.isFinite(p) && c >= 0 && p > 0;
    document.getElementById('food-percent').textContent = valid ? (c / p * 100).toLocaleString('it-IT', {maximumFractionDigits: 1, minimumFractionDigits: 1}) + '%' : '—';
    document.getElementById('food-margin').textContent = valid ? 'Differenza prezzo − ingredienti: ' + (p - c).toLocaleString('it-IT', {style: 'currency', currency: 'EUR'}) : 'Inserisci un costo non negativo e un prezzo maggiore di zero.';
  };
  cost.addEventListener('input', update); price.addEventListener('input', update); update();
}
const next = document.getElementById('next-round');
if (next) {
  const rounds = [
    [['Anna + Luca','Sara + Marco'],['Giulia + Paolo','Elena + Fabio']],
    [['Anna + Sara','Giulia + Elena'],['Luca + Marco','Paolo + Fabio']],
    [['Anna + Marco','Paolo + Elena'],['Luca + Sara','Giulia + Fabio']]
  ];
  let round = 0;
  next.addEventListener('click', () => {
    round = (round + 1) % rounds.length;
    document.getElementById('round-label').textContent = `Turno ${round + 1} di 3`;
    document.getElementById('matches').innerHTML = rounds[round].map((m,i) => `<p class="match">Campo ${i+1}<br><b>${m[0]}</b> vs <b>${m[1]}</b></p>`).join('');
  });
}
const breath = document.getElementById('breath-toggle');
if (breath) {
  let timer = null, inhale = false;
  const orb = document.getElementById('breathing-orb'), phase = document.getElementById('breath-phase');
  const stop = () => {
    clearInterval(timer); timer = null; orb.classList.remove('expanded');
    phase.textContent = 'Al tuo ritmo'; breath.textContent = 'Inizia la pausa'; breath.setAttribute('aria-pressed','false');
  };
  breath.addEventListener('click', () => {
    if (timer !== null) { stop(); return; }
    inhale = false;
    const tick = () => { inhale = !inhale; orb.classList.toggle('expanded',inhale); phase.textContent = inhale ? 'Inspira' : 'Espira'; };
    tick(); timer = setInterval(tick,4000); breath.textContent = 'Termina la pausa'; breath.setAttribute('aria-pressed','true');
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
}
