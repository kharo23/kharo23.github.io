(() => {
  const parseNumber = (value) => {
    const normalized = String(value).trim().replace(/\s/g, '').replace(',', '.');
    const number = Number(normalized);
    return Number.isFinite(number) ? number : NaN;
  };

  document.querySelectorAll('.food-cost-calculator').forEach((calculator) => {
    const locale = calculator.dataset.locale || document.documentElement.lang || 'it-IT';
    const cost = calculator.querySelector('[data-food-cost]');
    const price = calculator.querySelector('[data-food-price]');
    const target = calculator.querySelector('[data-food-target]');
    const result = calculator.querySelector('[data-food-result]');
    const suggested = calculator.querySelector('[data-food-suggested]');
    const percentFormat = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
    const moneyFormat = new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const update = () => {
      const ingredientCost = parseNumber(cost.value);
      const sellingPrice = parseNumber(price.value);
      const targetPercent = parseNumber(target.value);
      const foodCost = ingredientCost > 0 && sellingPrice > 0 ? ingredientCost / sellingPrice * 100 : NaN;
      const targetPrice = ingredientCost > 0 && targetPercent > 0 ? ingredientCost / (targetPercent / 100) : NaN;
      result.textContent = Number.isFinite(foodCost) ? `${percentFormat.format(foodCost)}%` : '—';
      suggested.textContent = Number.isFinite(targetPrice) ? `${moneyFormat.format(targetPrice)} EUR` : '—';
    };

    [cost, price, target].forEach((input) => input.addEventListener('input', update));
    update();
  });
})();
