// tests/validate.test.mjs
import assert from 'node:assert/strict';
import { validateChemistry } from '../js/validate.js';

const good = { id: 'lipo', name: 'LiPo', nominal: 3.7, charge: 4.2, storage: 3.8, cutoff: 3.0 };
assert.deepEqual(validateChemistry(good), []);

assert.ok(validateChemistry({ ...good, id: '' }).includes('id'));
assert.ok(validateChemistry({ ...good, nominal: 0 }).includes('nominal'));
assert.ok(validateChemistry({ ...good, charge: 'x' }).includes('charge'));
assert.ok(validateChemistry({}).length >= 5);

console.log('validate.test passed');
