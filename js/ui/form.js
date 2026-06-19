// js/ui/form.js
const num = (el) => (el.value.trim() === '' ? NaN : Number(el.value));
const numOr = (el, fallback) => (el.value.trim() === '' ? fallback : Number(el.value));

export function readInputs(els) {
  const chemId = els.chemistry.value;
  const cells = num(els.cells);
  const capacityMah = num(els.capacity);
  const dischargeC = num(els.dischargeC);
  const chargeC = num(els.chargeC);
  const avgCurrent = num(els.avgCurrent);
  const dodPercent = numOr(els.dod, 80);
  const packs = numOr(els.packs, 1);
  const targetRaw = els.targetCurrent.value.trim();
  const targetCurrent = targetRaw === '' ? null : Number(targetRaw);

  if (!chemId) return { ok: false, message: 'Select a battery chemistry.' };
  if (Number.isNaN(cells)) return { ok: false, message: 'Select a cell count.' };
  if ([capacityMah, dischargeC, chargeC, avgCurrent].some(Number.isNaN)) {
    return { ok: false, message: 'Fill in capacity, discharge C, charge C and average current.' };
  }
  if (capacityMah <= 0 || dischargeC <= 0 || chargeC <= 0 || avgCurrent <= 0) {
    return { ok: false, message: 'Capacity, C-rates and average current must be greater than 0.' };
  }
  if (!(dodPercent > 0 && dodPercent <= 100)) {
    return { ok: false, message: 'Usable capacity must be between 1 and 100%.' };
  }
  if (!(packs >= 1)) return { ok: false, message: 'Packs charged at once must be at least 1.' };
  if (targetCurrent !== null && targetCurrent <= 0) {
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
