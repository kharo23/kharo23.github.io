/* Charon orbital hero — lightweight depth and telemetry layer. */
(function () {
  'use strict';

  const root = document.querySelector('[data-kharonte-engine]');
  if (!root) return;

  const image = root.querySelector('.charon-hero-image');
  const fallback = root.parentElement && root.parentElement.querySelector('.hero-product-wall');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  const reveal = () => {
    root.classList.add('is-ready');
    if (fallback) fallback.setAttribute('aria-hidden', 'true');
  };

  if (!image || image.complete) reveal();
  else {
    image.addEventListener('load', reveal, { once: true });
    image.addEventListener('error', () => root.classList.add('is-unavailable'), { once: true });
  }

  if (!finePointer || reduceMotion) return;

  let targetX = 0, targetY = 0, currentX = 0, currentY = 0, frame = 0;
  function animate() {
    currentX += (targetX - currentX) * 0.075;
    currentY += (targetY - currentY) * 0.075;
    root.style.setProperty('--orbit-x', `${currentX.toFixed(2)}px`);
    root.style.setProperty('--orbit-y', `${currentY.toFixed(2)}px`);
    root.style.setProperty('--orbit-rx', `${(-currentY * 0.018).toFixed(3)}deg`);
    root.style.setProperty('--orbit-ry', `${(currentX * 0.018).toFixed(3)}deg`);
    if (Math.abs(targetX - currentX) > 0.08 || Math.abs(targetY - currentY) > 0.08) frame = requestAnimationFrame(animate);
    else frame = 0;
  }

  root.addEventListener('pointermove', (event) => {
    const rect = root.getBoundingClientRect();
    targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 15;
    targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 11;
    if (!frame) frame = requestAnimationFrame(animate);
  }, { passive: true });

  root.addEventListener('pointerleave', () => {
    targetX = 0;
    targetY = 0;
    if (!frame) frame = requestAnimationFrame(animate);
  });
})();
