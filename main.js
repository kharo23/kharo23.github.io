// ==========================================================================
// PREVENTIVI FACILI — INTERACTIVE SCRIPTS
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Current Year in Footer
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close all
        faqItems.forEach(otherItem => otherItem.classList.remove('active'));
        // Toggle current
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // 3. Interactive Savings Calculator
  const slider = document.getElementById('quoteSlider');
  const countDisplay = document.getElementById('quoteCountDisplay');
  const hoursDisplay = document.getElementById('hoursSavedDisplay');
  const stressDisplay = document.getElementById('stressSavedDisplay');

  function updateSavings(count) {
    if (countDisplay) countDisplay.textContent = `${count} preventivi`;
    
    // Average time to create a quote manually in Word/Excel/Paper = ~45 mins (0.75 hours)
    // With Preventivi Facili = ~3 mins (0.05 hours)
    // Saved per quote = ~0.70 hours
    const hoursSavedMonth = Math.round(count * 0.70);
    const hoursSavedYear = hoursSavedMonth * 12;

    if (hoursDisplay) {
      hoursDisplay.textContent = `~${hoursSavedMonth} ore / mese`;
    }

    if (stressDisplay) {
      if (count <= 5) {
        stressDisplay.textContent = 'Meno fogli sparsi e clienti più felici';
      } else if (count <= 15) {
        stressDisplay.textContent = 'Recuperi un intero weekend ogni mese';
      } else {
        stressDisplay.textContent = `Equivalente a oltre ${hoursSavedYear} ore l\'anno dedicate a te o ai tuoi cantieri`;
      }
    }
  }

  if (slider) {
    slider.addEventListener('input', (e) => {
      updateSavings(parseInt(e.target.value, 10));
    });
    // Init
    updateSavings(parseInt(slider.value, 10));
  }
});
