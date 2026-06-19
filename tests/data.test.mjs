// tests/data.test.mjs
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateChemistry } from '../js/validate.js';

const chems = JSON.parse(await readFile(new URL('../data/chemistries.json', import.meta.url)));

assert.ok(Array.isArray(chems) && chems.length >= 4, 'has all chemistries');

const ids = new Set();
for (const c of chems) {
  assert.deepEqual(validateChemistry(c), [], `valid: ${c.id || c.name}`);
  assert.ok(!ids.has(c.id), `duplicate id: ${c.id}`);
  ids.add(c.id);
}

console.log(`data.test passed (${chems.length} chemistries)`);
