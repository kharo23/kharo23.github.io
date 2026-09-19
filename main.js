// ==========================================================================
// PREVENTIVI FACILI — ADVANCED INTERACTIVE ENGINE
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Footer Year
  const yearEl = document.getElementById('yearField');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. FAQ Accordion Toggle
  const faqUnits = document.querySelectorAll('.faq-card-unit');
  faqUnits.forEach(unit => {
    const trigger = unit.querySelector('.faq-trigger-button');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isCurrentActive = unit.classList.contains('active');
        // Close other items
        faqUnits.forEach(u => u.classList.remove('active'));
        if (!isCurrentActive) {
          unit.classList.add('active');
        }
      });
    }
  });

  // 3. Dynamic Savings Calculator
  const quoteSlider = document.getElementById('quoteRangeInput');
  const quoteVisual = document.getElementById('quoteNumberVisual');
  const hoursVisual = document.getElementById('hoursSavedVisual');
  const stressNarrative = document.getElementById('stressNarrative');

  // Localized strings live as data-attributes on the calculator card so this
  // script stays identical across the it/en/es pages.
  const calcCard = document.querySelector('.calc-card-container');
  const i18n = calcCard ? calcCard.dataset : {};

  function calculateSavings(quotes) {
    if (quoteVisual) quoteVisual.textContent = `${quotes} ${i18n.unitLabel || 'preventivi'}`;
    // ~45 mins manual in Word/Excel vs ~3 mins in Preventivi Facili = ~0.70h saved per quote
    const hoursMonth = Math.round(quotes * 0.72);
    const hoursYear = hoursMonth * 12;

    if (hoursVisual) {
      hoursVisual.textContent = `~${hoursMonth} ${i18n.hoursLabel || 'ore / mese'}`;
    }

    if (stressNarrative) {
      const template = quotes <= 6
        ? (i18n.narrativeLow || `Risparmi circa {hours} ore all'anno da dedicare al tuo tempo libero.`)
        : quotes <= 18
          ? (i18n.narrativeMid || `Equivalente a oltre {hours} ore all'anno liberate per la tua famiglia o per i tuoi cantieri.`)
          : (i18n.narrativeHigh || `Oltre {hours} ore all'anno risparmiate! Praticamente un intero mese di lavoro d'ufficio evitato.`);
      stressNarrative.textContent = template.replace('{hours}', hoursYear);
    }
  }

  if (quoteSlider) {
    quoteSlider.addEventListener('input', (e) => {
      calculateSavings(parseInt(e.target.value, 10));
    });
    calculateSavings(parseInt(quoteSlider.value, 10));
  }

  // 4. Live Interactive PDF Simulator
  const btnToggleLabor = document.getElementById('btnToggleLabor');
  const btnToggleMaterials = document.getElementById('btnToggleMaterials');
  const btnToggleTaxRegime = document.getElementById('btnToggleTaxRegime');

  const extraRowLabor = document.getElementById('extraRowLabor');
  const extraRowMaterials = document.getElementById('extraRowMaterials');

  const valTaxable = document.getElementById('valTaxable');
  const valVatRate = document.getElementById('valVatRate');
  const valVatAmount = document.getElementById('valVatAmount');
  const docGrandTotal = document.getElementById('docGrandTotal');

  let state = {
    hasLabor: false,
    hasMaterials: false,
    isForfettario: false,
    baseAmount: 720 // 480 + 240
  };

  function updateQuoteSimulation() {
    let currentTaxable = state.baseAmount;
    if (state.hasLabor) currentTaxable += 160;
    if (state.hasMaterials) currentTaxable += 190;

    const vatPercent = state.isForfettario ? 0 : 0.22;
    const vatTotal = currentTaxable * vatPercent;
    const grandTotal = currentTaxable + vatTotal;

    // Update DOM
    if (valTaxable) valTaxable.textContent = `€ ${currentTaxable.toFixed(2).replace('.', ',')}`;
    if (valVatRate) valVatRate.textContent = state.isForfettario ? '0% (Forfettario)' : '22%';
    if (valVatAmount) valVatAmount.textContent = `€ ${vatTotal.toFixed(2).replace('.', ',')}`;
    if (docGrandTotal) {
      docGrandTotal.textContent = `€ ${grandTotal.toFixed(2).replace('.', ',')}`;
      // Subtle glow flash effect on total update
      docGrandTotal.style.transform = 'scale(1.08)';
      docGrandTotal.style.transition = 'transform 0.2s ease';
      setTimeout(() => {
        docGrandTotal.style.transform = 'scale(1)';
      }, 200);
    }
  }

  // Toggle button labels come from data-label-on/off so the markup carries
  // the translation and this script needs no per-language branching.
  function bindToggle(btn, extraRow, stateKey, activeBg) {
    if (!btn) return;
    const span = btn.querySelector('span');
    btn.addEventListener('click', () => {
      state[stateKey] = !state[stateKey];
      if (extraRow) extraRow.style.display = state[stateKey] ? 'table-row' : 'none';
      btn.style.background = state[stateKey] ? activeBg : 'rgba(255, 255, 255, 0.04)';
      if (span) span.textContent = state[stateKey] ? btn.dataset.labelOn : btn.dataset.labelOff;
      updateQuoteSimulation();
    });
  }

  bindToggle(btnToggleLabor, extraRowLabor, 'hasLabor', 'rgba(0, 82, 255, 0.25)');
  bindToggle(btnToggleMaterials, extraRowMaterials, 'hasMaterials', 'rgba(0, 82, 255, 0.25)');
  bindToggle(btnToggleTaxRegime, null, 'isForfettario', 'rgba(16, 185, 129, 0.2)');
});
