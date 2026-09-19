// ==========================================================================
// KHARONTE STUDIO HUB — MOTION LAYER
// Cursor spotlight, card glare-follow, featured screenshot tilt and
// scroll-reveal. Inert on touch/coarse pointers and fully skipped under
// prefers-reduced-motion.
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  // 1. Scroll reveal (safe to run regardless of pointer type)
  const revealEls = document.querySelectorAll('.reveal-up');
  if (revealEls.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(el => el.classList.add('is-visible'));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach(el => io.observe(el));
    }
  }

  if (reduceMotion || !finePointer) return;

  // 2. Hero cursor spotlight
  const hero = document.querySelector('.hero');
  const spotlight = document.querySelector('.hero-spotlight');
  if (hero && spotlight) {
    hero.addEventListener('pointermove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      spotlight.style.setProperty('--mx', `${x}%`);
      spotlight.style.setProperty('--my', `${y}%`);
      spotlight.classList.add('is-active');
    });
    hero.addEventListener('pointerleave', () => {
      spotlight.classList.remove('is-active');
    });
  }

  // 3. Bento card glare-follow
  document.querySelectorAll('.bento-card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });
  });

  // 4. Featured screenshot tilt
  const visual = document.querySelector('.featured-card-visual');
  const screenshot = document.querySelector('.featured-screenshot');
  if (visual && screenshot) {
    visual.addEventListener('pointermove', (e) => {
      const rect = visual.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      const rotateY = px * 16;
      const rotateX = py * -16;
      screenshot.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
    });
    visual.addEventListener('pointerleave', () => {
      screenshot.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  }
});
