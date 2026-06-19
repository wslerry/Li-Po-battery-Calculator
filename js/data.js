// js/data.js
import { validateChemistry } from './validate.js';

export async function loadChemistries(url = 'data/chemistries.json') {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load chemistries (HTTP ${res.status})`);
  const chems = await res.json();
  if (!Array.isArray(chems)) throw new Error('chemistries.json must be an array');
  const invalid = chems.filter((c) => validateChemistry(c).length > 0);
  if (invalid.length) {
    const ids = invalid.map((c) => c.id || c.name || '?').join(', ');
    throw new Error(`Invalid chemistry entries: ${ids}`);
  }
  return chems;
}
