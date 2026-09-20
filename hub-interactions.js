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
          if (statusEl) statusEl.textContent = statusEl.getAttribute('data-status-start') || 'Match Point';
        } else if (ptsB === 5) {
          if (statusEl) statusEl.textContent = statusEl.getAttribute('data-status-mid') || 'Punto Decisivo';
        } else if (ptsB === 6) {
          if (statusEl) statusEl.textContent = statusEl.getAttribute('data-status-tie') || 'Tie Break!';
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
  const aegisBreathLabels = document.querySelectorAll('.aegis-breath-label');
  if (aegisBreathLabels.length > 0) {
    const lang = document.documentElement.lang || 'it';
    const phrases = lang === 'en'
      ? ['Inhale', 'Hold', 'Exhale', 'Rest']
      : lang === 'es'
      ? ['Inhala', 'Mantén', 'Exhala', 'Calma']
      : ['Inspira', 'Trattieni', 'Espira', 'Pausa'];
    let idx = 0;
    setInterval(() => {
      idx = (idx + 1) % phrases.length;
      aegisBreathLabels.forEach(lbl => {
        lbl.style.opacity = '0';
        setTimeout(() => {
          lbl.textContent = phrases[idx];
          lbl.style.opacity = '1';
        }, 250);
      });
    }, 4000);
  }

  // Preventivi Facili Live Mode Switcher (Craftsman vs Freelance)
  document.querySelectorAll('.interactive-mode-switch').forEach((switcher) => {
    const card = switcher.closest('.featured-card');
    if (!card) return;
    const preview = card.querySelector('.invoice-pill-preview');
    const pillTitle = preview ? preview.querySelector('.micro-pill-title') : null;
    const amountEl = preview ? preview.querySelector('.micro-amount') : null;
    const tagsRow = preview ? preview.querySelector('.micro-tags-row') : null;
    const buttons = switcher.querySelectorAll('.mode-switch-btn');

    buttons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (btn.classList.contains('is-active')) return;
        buttons.forEach(b => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');

        playHapticTick(1.15);

        if (preview) {
          preview.classList.remove('mode-switching');
          void preview.offsetWidth; // force DOM reflow
          preview.classList.add('mode-switching');
        }

        const titleText = btn.getAttribute('data-pill-title');
        const amount = btn.getAttribute('data-amount');
        const countupVal = parseInt(btn.getAttribute('data-countup') || '3450', 10);
        let tags = [];
        try {
          tags = JSON.parse(btn.getAttribute('data-tags') || '[]');
        } catch (err) {}

        if (pillTitle && titleText) {
          pillTitle.textContent = titleText;
        }

        if (amountEl) {
          amountEl.setAttribute('data-countup', countupVal);
          const start = countupVal > 2500 ? 1000 : 500;
          const duration = 400;
          const startTime = performance.now();
          const prefix = amountEl.getAttribute('data-prefix') || '+€ ';
          const suffix = amountEl.getAttribute('data-suffix') || '';

          function animateNum(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.round(start + (countupVal - start) * ease);
            amountEl.textContent = `${prefix}${currentVal.toLocaleString()}${suffix}`;
            if (progress < 1) {
              requestAnimationFrame(animateNum);
            } else {
              amountEl.textContent = amount;
            }
          }
          requestAnimationFrame(animateNum);
        }

        if (tagsRow && tags.length) {
          tagsRow.innerHTML = tags.map(t => `<span class="micro-tag">${t}</span>`).join('');
        }
      });
    });
  });

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

  // 6. Bento card Holographic 3D perspective tilt & specular glare-follow
  document.querySelectorAll('.studio-grid .bento-card').forEach((card) => {
    let rect = null;
    let cardTicking = false;

    // Inject card-glare sheen element if not already present
    let glare = card.querySelector('.card-glare');
    if (!glare) {
      glare = document.createElement('div');
      glare.className = 'card-glare';
      glare.setAttribute('aria-hidden', 'true');
      card.appendChild(glare);
    }

    card.addEventListener('pointerenter', () => {
      rect = card.getBoundingClientRect();
      card.classList.add('is-tilting');
      card.style.setProperty('--glare-o', '1');
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
          card.style.setProperty('--glare-x', `${x.toFixed(1)}%`);
          card.style.setProperty('--glare-y', `${y.toFixed(1)}%`);
          card.style.setProperty('--glare-o', '1');

          // Subtle, smooth 3D Perspective Tilt (-4.5 to +4.5 deg)
          const px = (clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
          const py = (clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
          const rotY = (px * 4.5).toFixed(2);
          const rotX = (py * -4.5).toFixed(2);

          card.style.setProperty('--tilt-x', `${rotX}deg`);
          card.style.setProperty('--tilt-y', `${rotY}deg`);
          card.style.setProperty('--tilt-ty', '-4px');
          cardTicking = false;
        });
        cardTicking = true;
      }
    });

    card.addEventListener('pointerleave', () => {
      rect = null;
      card.classList.remove('is-tilting');
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
      card.style.setProperty('--tilt-ty', '0px');
      card.style.setProperty('--glare-o', '0');
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

  // ==========================================================================
  // 8. WEB AUDIO API SYNTHESIZER (MICRO-HAPTIC FEEDBACK)
  // ==========================================================================
  let audioCtx = null;
  let soundEnabled = localStorage.getItem('kh_sound') !== '0';

  function playHapticTick(pitch = 1) {
    if (!soundEnabled) return;
    try {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) audioCtx = new AudioContext();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const now = audioCtx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(750 * pitch, now);
      osc.frequency.exponentialRampToValueAtTime(180 * pitch, now + 0.024);

      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.028);
    } catch (e) {}
  }

  // Sound Toggle Button Handler
  const soundBtn = document.querySelector('#toggle-sound');
  if (soundBtn) {
    const updateSoundBtn = () => {
      soundBtn.classList.toggle('is-active', soundEnabled);
      const onIcon = soundBtn.querySelector('.sound-icon-on');
      const offIcon = soundBtn.querySelector('.sound-icon-off');
      if (onIcon && offIcon) {
        onIcon.style.display = soundEnabled ? 'block' : 'none';
        offIcon.style.display = soundEnabled ? 'none' : 'block';
      }
    };
    updateSoundBtn();
    soundBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      soundEnabled = !soundEnabled;
      localStorage.setItem('kh_sound', soundEnabled ? '1' : '0');
      updateSoundBtn();
      if (soundEnabled) playHapticTick(1.2);
    });
  }

  // Attach haptic feedback to interactive elements
  document.querySelectorAll('.micro-pill, .mode-switch-btn, .btn-micro-point, .nav-cmd-btn, .cosmos-card, .magnetic, .nav-sound-btn').forEach((el) => {
    el.addEventListener('pointerdown', () => playHapticTick(1));
  });

  // ==========================================================================
  // 9. COUNT-UP DINAMICO PER STAT E CIFRE CHIAVE
  // ==========================================================================
  const countEls = document.querySelectorAll('[data-countup]');
  if (countEls.length && 'IntersectionObserver' in window && !reduceMotion) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-countup'));
          const prefix = el.getAttribute('data-prefix') || '';
          const suffix = el.getAttribute('data-suffix') || '';
          const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
          const duration = 1200;
          const startTime = performance.now();

          function animateCount(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = (target * easeProgress).toFixed(decimals);
            const formatted = decimals === 0 ? Number(current).toLocaleString('it-IT') : current;
            el.textContent = `${prefix}${formatted}${suffix}`;
            if (progress < 1) {
              requestAnimationFrame(animateCount);
            }
          }
          requestAnimationFrame(animateCount);
          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.1 });
    countEls.forEach(el => countObserver.observe(el));
  }

  // ==========================================================================
  // 10. RAYCAST-STYLE COMMAND PALETTE (⌘K / CTRL+K)
  // ==========================================================================
  const lang = document.documentElement.lang || 'it';
  const isEn = lang === 'en';
  const isEs = lang === 'es';
  const rootPath = isEn || isEs ? '../' : './';

  // Build Command Palette Modal dynamically
  const paletteBackdrop = document.createElement('div');
  paletteBackdrop.className = 'cmd-palette-backdrop';
  paletteBackdrop.setAttribute('role', 'dialog');
  paletteBackdrop.setAttribute('aria-modal', 'true');
  paletteBackdrop.setAttribute('aria-label', isEn ? 'Quick Command Palette' : isEs ? 'Paleta de Comandos Rápidos' : 'Ricerca e Comandi Rapidi');

  const placeholderText = isEn ? 'Search apps, features or shortcuts... (Esc to close)' : isEs ? 'Buscar apps, funciones o accesos... (Esc para salir)' : 'Cerca app, funzioni o scorciatoie... (Esc per uscire)';
  const appsHeader = isEn ? 'Studio Apps' : isEs ? 'Aplicaciones del Estudio' : 'Applicazioni Studio';
  const linksHeader = isEn ? 'Quick Navigation & Dev' : isEs ? 'Navegación Rápida & Dev' : 'Navigazione & Sviluppatore';
  const langHeader = isEn ? 'Language / Lingua' : isEs ? 'Idioma / Lingua' : 'Lingua / Language';

  paletteBackdrop.innerHTML = `
    <div class="cmd-palette-modal">
      <div class="cmd-search-row">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input type="text" class="cmd-search-input" placeholder="${placeholderText}" autocomplete="off" spellcheck="false">
      </div>
      <div class="cmd-results-list" role="listbox">
        <div class="cmd-group-label">${appsHeader}</div>
        <a href="${rootPath}preventivi-facili/${isEn ? 'en/' : isEs ? 'es/' : ''}" class="cmd-item is-selected" role="option">
          <img src="${rootPath}assets/icon.png" alt="Preventivi Facili" width="28" height="28">
          <div class="cmd-item-info">
            <span class="cmd-item-title">Preventivi Facili</span>
            <span class="cmd-item-sub">${isEn ? 'PDF quotes & invoices in 30 seconds' : isEs ? 'Presupuestos y facturas en PDF en 30s' : 'Fatture e preventivi PDF in 30 secondi'}</span>
          </div>
          <span class="cmd-item-kbd">↵ Jump</span>
        </a>
        <a href="${rootPath}foodlio/${isEn ? 'en/' : isEs ? 'es/' : ''}" class="cmd-item" role="option">
          <img src="${rootPath}foodlio/icon.png" alt="Foodlio" width="28" height="28">
          <div class="cmd-item-info">
            <span class="cmd-item-title">Foodlio</span>
            <span class="cmd-item-sub">${isEn ? 'Culinary food cost & recipe margins' : isEs ? 'Food cost y cálculo de márgenes para chefs' : 'Food cost reale e margini ricetta'}</span>
          </div>
          <span class="cmd-item-kbd">↵ Jump</span>
        </a>
        <a href="${rootPath}padel-match-manager/${isEn ? 'en/' : isEs ? 'es/' : ''}" class="cmd-item" role="option">
          <img src="${rootPath}padel-match-manager/icon.png" alt="Padel Match Manager" width="28" height="28">
          <div class="cmd-item-info">
            <span class="cmd-item-title">Padel Match Manager</span>
            <span class="cmd-item-sub">${isEn ? 'Americano & Mexicano court tournaments' : isEs ? 'Torneos Americano y liguillas en pista' : 'Tornei Americano e partite di padel'}</span>
          </div>
          <span class="cmd-item-kbd">↵ Jump</span>
        </a>
        <a href="${rootPath}aegis/${isEn ? 'en/' : isEs ? 'es/' : ''}" class="cmd-item" role="option">
          <img src="${rootPath}aegis/icon.png" alt="Aegis" width="28" height="28">
          <div class="cmd-item-info">
            <span class="cmd-item-title">Aegis</span>
            <span class="cmd-item-sub">${isEn ? 'Guided breathing & peaceful sanctuary' : isEs ? 'Respiración guiada y calma personal' : 'Respiro armonico e serenità quotidiana'}</span>
          </div>
          <span class="cmd-item-kbd">↵ Jump</span>
        </a>
        <a href="${rootPath}flipeven/${isEn ? 'en/' : isEs ? 'es/' : ''}" class="cmd-item" role="option">
          <img src="${rootPath}flipeven/icon.png" alt="FlipEven" width="28" height="28">
          <div class="cmd-item-info">
            <span class="cmd-item-title">FlipEven</span>
            <span class="cmd-item-sub">${isEn ? 'Reselling margins & platform break-even' : isEs ? 'Punto de equilibrio para Vinted y eBay' : 'Margini reali per reselling e Vinted'}</span>
          </div>
          <span class="cmd-item-kbd">↵ Jump</span>
        </a>

        <div class="cmd-group-label">${linksHeader}</div>
        <a href="${rootPath}${isEn ? 'en/about.html' : isEs ? 'es/about.html' : 'about.html'}" class="cmd-item" role="option">
          <div class="cmd-item-icon" style="background:rgba(168,85,247,0.15); color:#a855f7;">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div class="cmd-item-info">
            <span class="cmd-item-title">${isEn ? 'About Me — @kharonteAppDev' : isEs ? 'Sobre Mí — @kharonteAppDev' : 'Chi Sono — @kharonteAppDev'}</span>
            <span class="cmd-item-sub">${isEn ? 'Mobile, Full-Stack Web & AI Engineering' : isEs ? 'Móvil, Web Full-Stack e Inteligencia Artificial' : 'Mobile nativo, Web Full-Stack & Intelligenza Artificiale'}</span>
          </div>
          <span class="cmd-item-kbd">↵ Jump</span>
        </a>
        <a href="mailto:kharonte.appdev@gmail.com" class="cmd-item" role="option">
          <div class="cmd-item-icon" style="background:rgba(56,189,248,0.15); color:#38bdf8;">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L1 7"/></svg>
          </div>
          <div class="cmd-item-info">
            <span class="cmd-item-title">${isEn ? 'Email Developer' : isEs ? 'Contactar Desarrollador' : 'Scrivi allo Sviluppatore'}</span>
            <span class="cmd-item-sub">kharonte.appdev@gmail.com</span>
          </div>
        </a>
        <a href="https://github.com/kharo23" target="_blank" rel="noopener noreferrer" class="cmd-item" role="option">
          <div class="cmd-item-icon" style="background:rgba(255,255,255,0.08); color:#fff;">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
          </div>
          <div class="cmd-item-info">
            <span class="cmd-item-title">GitHub @kharo23</span>
            <span class="cmd-item-sub">Repository &amp; open-source</span>
          </div>
        </a>

        <div class="cmd-group-label">${langHeader}</div>
        <a href="${rootPath}" class="cmd-item" role="option">
          <div class="cmd-item-icon" style="background:rgba(16,185,129,0.15); color:#34d399; font-weight:800; font-size:0.75rem;">IT</div>
          <div class="cmd-item-info">
            <span class="cmd-item-title">Italiano</span>
          </div>
        </a>
        <a href="${rootPath}en/" class="cmd-item" role="option">
          <div class="cmd-item-icon" style="background:rgba(56,189,248,0.15); color:#38bdf8; font-weight:800; font-size:0.75rem;">EN</div>
          <div class="cmd-item-info">
            <span class="cmd-item-title">English</span>
          </div>
        </a>
        <a href="${rootPath}es/" class="cmd-item" role="option">
          <div class="cmd-item-icon" style="background:rgba(240,100,0,0.15); color:#ff7a1a; font-weight:800; font-size:0.75rem;">ES</div>
          <div class="cmd-item-info">
            <span class="cmd-item-title">Español</span>
          </div>
        </a>
      </div>
      <div class="cmd-palette-footer">
        <span>Studio Command Palette</span>
        <div class="cmd-shortcuts-tips">
          <span><kbd class="cmd-item-kbd">↑↓</kbd> Naviga</span>
          <span><kbd class="cmd-item-kbd">↵</kbd> Seleziona</span>
          <span><kbd class="cmd-item-kbd">Esc</kbd> Chiudi</span>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(paletteBackdrop);

  const searchInput = paletteBackdrop.querySelector('.cmd-search-input');
  const items = paletteBackdrop.querySelectorAll('.cmd-item');
  let isPaletteOpen = false;

  const openPalette = () => {
    isPaletteOpen = true;
    paletteBackdrop.classList.add('is-open');
    searchInput.value = '';
    filterItems('');
    playHapticTick(1.2);
    setTimeout(() => searchInput.focus(), 50);
  };

  const closePalette = () => {
    isPaletteOpen = false;
    paletteBackdrop.classList.remove('is-open');
    searchInput.blur();
    playHapticTick(0.8);
  };

  const togglePalette = () => {
    if (isPaletteOpen) closePalette();
    else openPalette();
  };

  // Filter items based on query
  function filterItems(query) {
    const q = query.toLowerCase().trim();
    let firstVisible = null;
    items.forEach((item) => {
      const text = item.textContent.toLowerCase();
      const matches = !q || text.includes(q);
      item.style.display = matches ? 'flex' : 'none';
      if (matches && !firstVisible) firstVisible = item;
    });
    items.forEach(i => i.classList.remove('is-selected'));
    if (firstVisible) firstVisible.classList.add('is-selected');
  }

  searchInput.addEventListener('input', (e) => {
    filterItems(e.target.value);
  });

  // Keyboard navigation within the palette
  searchInput.addEventListener('keydown', (e) => {
    const visibleItems = Array.from(items).filter(i => i.style.display !== 'none');
    if (!visibleItems.length) return;
    const currentIndex = visibleItems.findIndex(i => i.classList.contains('is-selected'));

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % visibleItems.length;
      visibleItems.forEach(i => i.classList.remove('is-selected'));
      visibleItems[nextIndex].classList.add('is-selected');
      visibleItems[nextIndex].scrollIntoView({ block: 'nearest' });
      playHapticTick(1.1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
      visibleItems.forEach(i => i.classList.remove('is-selected'));
      visibleItems[prevIndex].classList.add('is-selected');
      visibleItems[prevIndex].scrollIntoView({ block: 'nearest' });
      playHapticTick(1.1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = visibleItems[currentIndex] || visibleItems[0];
      if (selected) {
        playHapticTick(1.3);
        selected.click();
      }
    }
  });

  // Close when clicking outside modal
  paletteBackdrop.addEventListener('click', (e) => {
    if (e.target === paletteBackdrop) closePalette();
  });

  // Open triggers
  document.querySelectorAll('#open-cmd-palette, .open-cmd-trigger').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openPalette();
    });
  });

  // Global Keyboard listener for ⌘K / Ctrl+K
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      togglePalette();
    } else if (e.key === 'Escape' && isPaletteOpen) {
      closePalette();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHubInteractions);
} else {
  initHubInteractions();
}

