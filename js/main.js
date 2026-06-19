// js/main.js
import { loadChemistries } from './data.js';
import { computeBattery } from './calc.js';
import { readInputs, onInput } from './ui/form.js';
import { renderResults } from './ui/results.js';

const $ = (id) => document.getElementById(id);

const els = {
  chemistry: $('chemistry'),
  cells: $('cells'),
  capacity: $('capacity'),
  dischargeC: $('discharge-c'),
  chargeC: $('charge-c'),
  avgCurrent: $('avg-current'),
  dod: $('dod'),
  packs: $('packs'),
  targetCurrent: $('target-current'),
  results: $('results'),
  resultsHint: $('results-hint'),
  formError: $('form-error'),
  themeToggle: $('theme-toggle'),
};

let chemMap = new Map();

function showHint(text) {
  els.results.hidden = true;
  els.resultsHint.hidden = false;
  els.resultsHint.textContent = text;
}

function recompute() {
  els.formError.textContent = '';
  const res = readInputs(els);
  if (!res.ok) { els.formError.textContent = res.message; showHint('Enter your battery details to see results.'); return; }
  const chem = chemMap.get(res.values.chemId);
  if (!chem) { showHint('Select a battery chemistry.'); return; }

  const result = computeBattery(
    { chem, cells: res.values.cells, capacityMah: res.values.capacityMah },
    {
      dischargeC: res.values.dischargeC,
      chargeC: res.values.chargeC,
      avgCurrent: res.values.avgCurrent,
      dod: res.values.dod,
      packs: res.values.packs,
      targetCurrent: res.values.targetCurrent,
    },
  );

  renderResults(els.results, result);
  els.resultsHint.hidden = true;
  els.results.hidden = false;
}

function populateChemistries(chemistries) {
  for (const c of chemistries) {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.name;
    els.chemistry.appendChild(opt);
  }
}

async function init() {
  const yearEl = $('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  els.themeToggle.addEventListener('click', () => {
    const root = document.documentElement;
    const attr = root.getAttribute('data-theme');
    const isDark = attr === 'dark'
      || (attr === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
    root.setAttribute('data-theme', isDark ? 'light' : 'dark');
  });

  els.chemistry.addEventListener('change', recompute);
  els.cells.addEventListener('change', recompute);
  onInput([els.capacity, els.dischargeC, els.chargeC, els.avgCurrent, els.dod, els.packs, els.targetCurrent], recompute);

  try {
    const chemistries = await loadChemistries();
    chemMap = new Map(chemistries.map((c) => [c.id, c]));
    populateChemistries(chemistries);
  } catch (err) {
    els.formError.textContent = `Could not load chemistries: ${err.message}`;
  }
}

init();
