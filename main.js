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

  function calculateSavings(quotes) {
    if (quoteVisual) quoteVisual.textContent = `${quotes} preventivi`;
    // ~45 mins manual in Word/Excel vs ~3 mins in Preventivi Facili = ~0.70h saved per quote
    const hoursMonth = Math.round(quotes * 0.72);
    const hoursYear = hoursMonth * 12;

    if (hoursVisual) {
      hoursVisual.textContent = `~${hoursMonth} ore / mese`;
    }

    if (stressNarrative) {
      if (quotes <= 6) {
        stressNarrative.textContent = `Risparmi circa ${hoursYear} ore all'anno da dedicare al tuo tempo libero.`;
      } else if (quotes <= 18) {
        stressNarrative.textContent = `Equivalente a oltre ${hoursYear} ore all'anno liberate per la tua famiglia o per i tuoi cantieri.`;
      } else {
        stressNarrative.textContent = `Oltre ${hoursYear} ore all'anno risparmiate! Praticamente un intero mese di lavoro d'ufficio evitato.`;
      }
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

  if (btnToggleLabor && extraRowLabor) {
    btnToggleLabor.addEventListener('click', () => {
      state.hasLabor = !state.hasLabor;
      extraRowLabor.style.display = state.hasLabor ? 'table-row' : 'none';
      btnToggleLabor.style.background = state.hasLabor ? 'rgba(0, 82, 255, 0.25)' : 'rgba(255, 255, 255, 0.04)';
      btnToggleLabor.querySelector('span').textContent = state.hasLabor ? '✓ 4 ore Manodopera aggiunte (+€160)' : '+ Aggiungi 4 ore Manodopera (+€160)';
      updateQuoteSimulation();
    });
  }

  if (btnToggleMaterials && extraRowMaterials) {
    btnToggleMaterials.addEventListener('click', () => {
      state.hasMaterials = !state.hasMaterials;
      extraRowMaterials.style.display = state.hasMaterials ? 'table-row' : 'none';
      btnToggleMaterials.style.background = state.hasMaterials ? 'rgba(0, 82, 255, 0.25)' : 'rgba(255, 255, 255, 0.04)';
      btnToggleMaterials.querySelector('span').textContent = state.hasMaterials ? '✓ Cavi e Forniture aggiunti (+€190)' : '+ Aggiungi Cavi e Forniture (+€190)';
      updateQuoteSimulation();
    });
  }

  if (btnToggleTaxRegime) {
    btnToggleTaxRegime.addEventListener('click', () => {
      state.isForfettario = !state.isForfettario;
      btnToggleTaxRegime.style.background = state.isForfettario ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)';
      btnToggleTaxRegime.querySelector('span').textContent = state.isForfettario ? '✓ Regime Forfettario attivo (IVA 0%)' : 'Passa a Regime Forfettario (IVA 0%)';
      updateQuoteSimulation();
    });
  }
});
