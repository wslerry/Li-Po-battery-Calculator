// tests/format.test.mjs
import assert from 'node:assert/strict';
import { round } from '../js/format.js';

assert.equal(round(2.740909, 2), 2.74, 'rounds down');
assert.equal(round(3.998, 2), 4, 'rounds up across integer');
assert.equal(round(144.90000000000003, 1), 144.9, 'float fuzz');
assert.equal(round(18, 2), 18, 'integer stays');

console.log('format.test passed');
