// ==========================================================================
// KHARONTE STUDIO HUB — MOTION LAYER
// Scroll reveal, nav scroll state, trailing cursor glow, magnetic CTAs,
// hero spotlight, card glare-follow and featured screenshot tilt.
// Tuned for native 60fps/120fps hardware acceleration on all platforms.
// All pointer effects are inert on touch/coarse pointers and fully skipped
// under prefers-reduced-motion.
// ==========================================================================

function initHubInteractions() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  // 1. Scroll reveal (safe to run regardless of pointer type)
  const revealEls = document.querySelectorAll('.reveal-up');
  if (revealEls.length) {
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

  // 2. Nav gains presence on scroll
  const nav = document.querySelector('.site-nav');
  if (nav) {
    let scrollTicking = false;
    const toggleNavState = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 40);
      scrollTicking = false;
    };
    toggleNavState();
    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        requestAnimationFrame(toggleNavState);
        scrollTicking = true;
      }
    }, { passive: true });
  }

  // 2b. Bento Micro-Widgets Controller (available on all devices including touch)
  // Foodlio Recipe Margin Switcher
  document.querySelectorAll('.food-margin-widget').forEach((widget) => {
    const pills = widget.querySelectorAll('.micro-pill');
    const nameEl = widget.querySelector('.recipe-name');
    const costEl = widget.querySelector('.recipe-cost');
    const badgeEl = widget.querySelector('.widget-badge');
    const fillEl = widget.querySelector('.margin-fill');
    pills.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        pills.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        if (nameEl) nameEl.textContent = btn.getAttribute('data-name');
        if (costEl) costEl.textContent = btn.getAttribute('data-cost-text');
        if (badgeEl) badgeEl.textContent = btn.getAttribute('data-margin') + ' ' + (btn.getAttribute('data-margin-label') || 'Margine');
        if (fillEl) fillEl.style.width = btn.getAttribute('data-margin');
      });
    });
  });

  // Padel Match Manager Score Incrementer
  document.querySelectorAll('.padel-score-widget').forEach((widget) => {
    const scoreB = widget.querySelector('.padel-score-b');
    const pointBtn = widget.querySelector('.btn-micro-point');
    const statusEl = widget.querySelector('.padel-point-indicator');
    if (pointBtn && scoreB) {
      let ptsB = 4;
      pointBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        ptsB++;
        if (ptsB > 6) {
          ptsB = 4;
          if (statusEl) statusEl.textContent = statusEl.getAttribute('data-status-start') || 'Match Point 🔥';
        } else if (ptsB === 5) {
          if (statusEl) statusEl.textContent = statusEl.getAttribute('data-status-mid') || 'Punto Decisivo 🎾';
        } else if (ptsB === 6) {
          if (statusEl) statusEl.textContent = statusEl.getAttribute('data-status-tie') || 'Tie Break! ⚡';
        }
        scoreB.textContent = ptsB;
        scoreB.classList.add('score-bump');
        setTimeout(() => scoreB.classList.remove('score-bump'), 180);
      });
    }
  });

  // FlipEven Reselling ROI Preset Switcher
  document.querySelectorAll('.flipeven-calc-widget').forEach((widget) => {
    const pills = widget.querySelectorAll('.micro-pill');
    const buyEl = widget.querySelector('.fe-buy-val');
    const sellEl = widget.querySelector('.fe-sell-val');
    const netEl = widget.querySelector('.fe-net-val');
    const roiBadge = widget.querySelector('.widget-badge');
    pills.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        pills.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        if (buyEl) buyEl.textContent = btn.getAttribute('data-buy');
        if (sellEl) sellEl.textContent = btn.getAttribute('data-sell');
        if (netEl) netEl.textContent = btn.getAttribute('data-net');
        if (roiBadge) roiBadge.textContent = btn.getAttribute('data-roi');
      });
    });
  });

  // Aegis Breathing Orb Label Synchronizer
  const aegisBreathLabel = document.querySelector('.aegis-breath-label');
  if (aegisBreathLabel) {
    const lang = document.documentElement.lang || 'it';
    const phrases = lang === 'en'
      ? ['Inhale', 'Hold', 'Exhale', 'Rest']
      : lang === 'es'
      ? ['Inhala', 'Mantén', 'Exhala', 'Calma']
      : ['Inspira', 'Trattieni', 'Espira', 'Pausa'];
    let idx = 0;
    setInterval(() => {
      idx = (idx + 1) % phrases.length;
      aegisBreathLabel.style.opacity = '0';
      setTimeout(() => {
        aegisBreathLabel.textContent = phrases[idx];
        aegisBreathLabel.style.opacity = '1';
      }, 250);
    }, 4000);
  }

  if (reduceMotion || !finePointer) return;

  // 3. Cursor glow (GPU composited with translate3d & snappy responsiveness)
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  glow.setAttribute('aria-hidden', 'true');
  document.body.appendChild(glow);

  let targetX = -100, targetY = -100;
  let currentX = -100, currentY = -100;
  let isTracking = false;

  function trackGlow() {
    // Snappy responsiveness (0.65) so it feels instantaneous and tightly attached to pointer
    currentX += (targetX - currentX) * 0.65;
    currentY += (targetY - currentY) * 0.65;
    glow.style.transform = `translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 0)`;

    // Keep loop active only while moving to save CPU/GPU cycles when mouse is stationary
    if (Math.abs(targetX - currentX) > 0.4 || Math.abs(targetY - currentY) > 0.4) {
      requestAnimationFrame(trackGlow);
    } else {
      currentX = targetX;
      currentY = targetY;
      glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      isTracking = false;
    }
  }

  window.addEventListener('pointermove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    glow.classList.add('is-active');
    if (!isTracking) {
      isTracking = true;
      requestAnimationFrame(trackGlow);
    }
  }, { passive: true });

  document.addEventListener('pointerleave', () => glow.classList.remove('is-active'));

  document.querySelectorAll('a, button, .bento-card').forEach((el) => {
    el.addEventListener('pointerenter', () => glow.classList.add('is-hovering'));
    el.addEventListener('pointerleave', () => glow.classList.remove('is-hovering'));
  });

  // 4. Magnetic pull on primary CTAs (cached bounding box)
  document.querySelectorAll('.magnetic').forEach((el) => {
    let rect = null;
    el.addEventListener('pointerenter', () => {
      rect = el.getBoundingClientRect();
    });
    el.addEventListener('pointermove', (e) => {
      if (!rect) rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate3d(${(x * 0.18).toFixed(1)}px, ${(y * 0.28).toFixed(1)}px, 0)`;
    });
    el.addEventListener('pointerleave', () => {
      rect = null;
      el.style.transform = 'translate3d(0, 0, 0)';
    });
  });

  // 5. Ambient cursor spotlight across entire page (Instant GPU translate3d)
  const spotlight = document.querySelector('.hero-spotlight');
  if (spotlight) {
    let spotTicking = false;
    window.addEventListener('pointermove', (e) => {
      if (!spotTicking) {
        const clientX = e.clientX;
        const clientY = e.clientY;
        requestAnimationFrame(() => {
          spotlight.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
          spotTicking = false;
        });
        spotTicking = true;
      }
      spotlight.classList.add('is-active');
    }, { passive: true });

    document.addEventListener('pointerleave', () => {
      spotlight.classList.remove('is-active');
    });
  }

  // 6. Bento card 3D perspective tilt & glare-follow (rAF throttled & cached rect)
  document.querySelectorAll('.studio-grid .bento-card').forEach((card) => {
    let rect = null;
    let cardTicking = false;
    card.addEventListener('pointerenter', () => {
      rect = card.getBoundingClientRect();
    });
    card.addEventListener('pointermove', (e) => {
      if (!cardTicking) {
        const clientX = e.clientX;
        const clientY = e.clientY;
        requestAnimationFrame(() => {
          if (!rect) rect = card.getBoundingClientRect();
          const x = ((clientX - rect.left) / rect.width) * 100;
          const y = ((clientY - rect.top) / rect.height) * 100;
          card.style.setProperty('--mx', `${x.toFixed(1)}%`);
          card.style.setProperty('--my', `${y.toFixed(1)}%`);

          // 3D Perspective Tilt (-5 to +5 deg)
          const px = (clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
          const py = (clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
          const rotY = px * 5.5;
          const rotX = py * -5.5;
          card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
          cardTicking = false;
        });
        cardTicking = true;
      }
    });
    card.addEventListener('pointerleave', () => {
      rect = null;
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // 7. Featured screenshot tilt (rAF throttled & 3D accelerated)
  const visual = document.querySelector('.featured-card-visual');
  const screenshot = document.querySelector('.featured-screenshot');
  if (visual && screenshot) {
    let visualRect = null;
    let tiltTicking = false;
    visual.addEventListener('pointerenter', () => {
      visualRect = visual.getBoundingClientRect();
    });
    visual.addEventListener('pointermove', (e) => {
      if (!tiltTicking) {
        const clientX = e.clientX;
        const clientY = e.clientY;
        requestAnimationFrame(() => {
          if (!visualRect) visualRect = visual.getBoundingClientRect();
          const px = (clientX - visualRect.left) / visualRect.width - 0.5;
          const py = (clientY - visualRect.top) / visualRect.height - 0.5;
          const rotateY = px * 16;
          const rotateX = py * -16;
          screenshot.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.04, 1.04, 1)`;
          tiltTicking = false;
        });
        tiltTicking = true;
      }
    });
    visual.addEventListener('pointerleave', () => {
      visualRect = null;
      screenshot.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHubInteractions);
} else {
  initHubInteractions();
}
