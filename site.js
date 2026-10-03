/* Kharonte Studio — dettagli condivisi delle pagine secondarie: avanzamento di lettura e luce che segue il mouse. */
(function () {
  'use strict';
  document.documentElement.classList.add('has-js');
  /* accordion delle FAQ nelle pagine di assistenza */
  document.querySelectorAll('.faq-item').forEach((it) => {
    const q = it.querySelector('.faq-question'); if (!q) return;
    q.setAttribute('aria-expanded', 'false');
    q.addEventListener('click', () => { const o = !it.classList.contains('open'); it.classList.toggle('open', o); q.setAttribute('aria-expanded', o); });
  });
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const bar = document.createElement('div'); bar.className = 'k-progress'; bar.setAttribute('aria-hidden', 'true');
  const fill = document.createElement('i'); bar.appendChild(fill); document.body.appendChild(bar);
  const onScroll = () => { const m = document.documentElement.scrollHeight - innerHeight; fill.style.transform = `scaleX(${m > 0 ? Math.min(scrollY / m, 1) : 0})`; };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if (!fine || reduce) return;
  const lamp = document.createElement('div'); lamp.className = 'k-lantern'; lamp.setAttribute('aria-hidden', 'true'); document.body.appendChild(lamp);
  let x = innerWidth * 0.6, y = innerHeight * 0.3, tx = x, ty = y, raf = 0;
  const tick = () => { x += (tx - x) * 0.12; y += (ty - y) * 0.12; lamp.style.setProperty('--gx', x.toFixed(0) + 'px'); lamp.style.setProperty('--gy', y.toFixed(0) + 'px'); raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(tick) : 0; };
  addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; if (!raf) raf = requestAnimationFrame(tick); }, { passive: true });
})();
