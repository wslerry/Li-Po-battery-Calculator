// js/ui/form.js
const num = (el) => (el.value.trim() === '' ? NaN : Number(el.value));
const numOr = (el, fallback) => (el.value.trim() === '' ? fallback : Number(el.value));
const optNum = (el) => (el.value.trim() === '' ? null : Number(el.value));

export function readInputs(els) {
  const chemId = els.chemistry.value;
  const cells = num(els.cells);
  const capacityMah = num(els.capacity);
  const dischargeC = num(els.dischargeC);
  const chargeC = numOr(els.chargeC, 1); // not always printed; 1C is the safe default
  const avgCurrent = optNum(els.avgCurrent); // a load property, not on the label — optional
  const dodPercent = numOr(els.dod, 80);
  const packs = numOr(els.packs, 1);
  const targetCurrent = optNum(els.targetCurrent);

  if (!chemId) return { ok: false, message: 'Select a battery chemistry.' };
  if (Number.isNaN(cells)) return { ok: false, message: 'Select a cell count.' };
  if ([capacityMah, dischargeC].some(Number.isNaN)) {
    return { ok: false, message: 'Fill in capacity and discharge C (both are on the battery label).' };
  }
  if (capacityMah <= 0 || dischargeC <= 0) {
    return { ok: false, message: 'Capacity and discharge C must be greater than 0.' };
  }
  if (Number.isNaN(chargeC) || chargeC <= 0) {
    return { ok: false, message: 'Charge rate must be greater than 0 (leave blank for the 1C default).' };
  }
  if (avgCurrent !== null && (Number.isNaN(avgCurrent) || avgCurrent <= 0)) {
    return { ok: false, message: 'Average current draw must be greater than 0, or leave it blank.' };
  }
  if (!(dodPercent > 0 && dodPercent <= 100)) {
    return { ok: false, message: 'Usable capacity must be between 1 and 100%.' };
  }
  if (!(packs >= 1)) return { ok: false, message: 'Packs charged at once must be at least 1.' };
  if (targetCurrent !== null && (Number.isNaN(targetCurrent) || targetCurrent <= 0)) {
    return { ok: false, message: 'Target current must be greater than 0.' };
  }

  return {
    ok: true,
    values: {
      chemId, cells, capacityMah, dischargeC, chargeC, avgCurrent,
      dod: dodPercent / 100, packs, targetCurrent,
    },
  };
}

export function onInput(elements, handler) {
  for (const el of elements) el.addEventListener('input', handler);
}
