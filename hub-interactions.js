// ==========================================================================
// KHARONTE STUDIO HUB — MOTION LAYER
// Scroll reveal, nav scroll state, trailing cursor glow, magnetic CTAs,
// hero spotlight, card glare-follow and featured screenshot tilt. Pointer
// effects are inert on touch/coarse pointers and fully skipped under
// prefers-reduced-motion.
// ==========================================================================

function initHubInteractions() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  // 1. Scroll reveal (safe to run regardless of pointer type)
  const revealEls = document.querySelectorAll('.reveal-up');
  if (revealEls.length) {
    // Immediately reveal anything already in or near the viewport so there is never an invisible flash
    revealEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95) {
        el.classList.add('is-visible');
      }
    });

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
      }, { threshold: 0.05, rootMargin: '0px 0px 60px 0px' });
      revealEls.forEach(el => {
        if (!el.classList.contains('is-visible')) {
          io.observe(el);
        }
      });
    }
  }

  // 2. Nav gains presence on scroll (cheap, safe under reduced motion too)
  const nav = document.querySelector('.site-nav');
  if (nav) {
    const toggleNavState = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    toggleNavState();
    window.addEventListener('scroll', toggleNavState, { passive: true });
  }

  if (reduceMotion || !finePointer) return;

  // 3. Trailing cursor glow (additive — native cursor stays visible)
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  glow.setAttribute('aria-hidden', 'true');
  document.body.appendChild(glow);

  let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
  window.addEventListener('pointermove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    glow.classList.add('is-active');
  });
  document.addEventListener('pointerleave', () => glow.classList.remove('is-active'));

  function trackGlow() {
    currentX += (targetX - currentX) * 0.18;
    currentY += (targetY - currentY) * 0.18;
    glow.style.left = `${currentX}px`;
    glow.style.top = `${currentY}px`;
    requestAnimationFrame(trackGlow);
  }
  requestAnimationFrame(trackGlow);

  document.querySelectorAll('a, button, .bento-card').forEach((el) => {
    el.addEventListener('pointerenter', () => glow.classList.add('is-hovering'));
    el.addEventListener('pointerleave', () => glow.classList.remove('is-hovering'));
  });

  // 4. Magnetic pull on primary CTAs
  document.querySelectorAll('.magnetic').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });

  // 5. Ambient cursor spotlight across hero and apps
  const mainTarget = document.querySelector('#main') || document.querySelector('.hero');
  const spotlight = document.querySelector('.hero-spotlight');
  if (mainTarget && spotlight) {
    mainTarget.addEventListener('pointermove', (e) => {
      const rect = mainTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      spotlight.style.setProperty('--mx', `${x}%`);
      spotlight.style.setProperty('--my', `${y}%`);
      spotlight.classList.add('is-active');
    });
    mainTarget.addEventListener('pointerleave', () => {
      spotlight.classList.remove('is-active');
    });
  }

  // 6. Bento card glare-follow
  document.querySelectorAll('.bento-card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });
  });

  // 7. Featured screenshot tilt
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
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHubInteractions);
} else {
  initHubInteractions();
}
