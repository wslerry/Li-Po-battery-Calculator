// tests/calc.test.mjs
import assert from 'node:assert/strict';
import { round } from '../js/format.js';
import {
  energyWh, maxContinuousCurrent, chargeTime, reverseSizing, airlineClass,
  computeBattery,
} from '../js/calc.js';

const lipo = { id: 'lipo', name: 'LiPo', nominal: 3.7, charge: 4.2, storage: 3.8, cutoff: 3.0 };

// helpers
assert.equal(round(energyWh(6, lipo, 5000), 2), 111);
assert.equal(maxContinuousCurrent(5000, 20), 100);
assert.equal(round(chargeTime(5000, 1), 1), 69);
assert.equal(reverseSizing(100, 5000, 20).minC, 20);
assert.equal(reverseSizing(100, 5000, 20).minCapacityMah, 5000);
assert.equal(airlineClass(100), 'ok');
assert.equal(airlineClass(160), 'approval');
assert.equal(airlineClass(161), 'prohibited');

// full pipeline golden case — LiPo 6S 5000mAh, 20C, 1C, 15A avg, 80% DoD
const r = computeBattery(
  { chem: lipo, cells: 6, capacityMah: 5000 },
  { dischargeC: 20, chargeC: 1, avgCurrent: 15, dod: 0.8, packs: 1, targetCurrent: 100 },
);
assert.equal(round(r.pack.nominalV, 2), 22.2);
assert.equal(round(r.pack.fullV, 2), 25.2);
assert.equal(round(r.pack.storageV, 2), 22.8);
assert.equal(round(r.pack.cutoffV, 2), 18);
assert.equal(round(r.pack.energyWh, 2), 111);
assert.equal(r.discharge.maxCurrentA, 100);
assert.equal(round(r.discharge.runUsableMin, 2), 16);
assert.equal(round(r.discharge.runFullMin, 2), 20);
assert.equal(r.discharge.exceedsMax, false);
assert.equal(r.charging.chargeCurrentA, 5);
assert.equal(round(r.charging.chargeTimeMin, 1), 69);
assert.equal(round(r.charging.totalChargeCurrentA, 1), 5);
assert.equal(round(r.charging.chargerWattsW, 1), 144.9);
assert.equal(r.sizing.minC, 20);
assert.equal(r.sizing.minCapacityMah, 5000);
assert.equal(r.planning.airline, 'approval');

// exceedsMax true (avg 120 > max 100); targetCurrent null → no sizing
const r2 = computeBattery(
  { chem: lipo, cells: 6, capacityMah: 5000 },
  { dischargeC: 20, chargeC: 1, avgCurrent: 120, dod: 0.8, packs: 1, targetCurrent: null },
);
assert.equal(r2.discharge.exceedsMax, true);
assert.equal(r2.sizing, null);

// avgCurrent omitted → no run time, exceedsMax false; label-derived outputs unaffected
const r3 = computeBattery(
  { chem: lipo, cells: 6, capacityMah: 5000 },
  { dischargeC: 20, chargeC: 1, avgCurrent: null, dod: 0.8, packs: 1, targetCurrent: null },
);
assert.equal(r3.discharge.runUsableMin, null);
assert.equal(r3.discharge.runFullMin, null);
assert.equal(r3.discharge.exceedsMax, false);
assert.equal(r3.discharge.maxCurrentA, 100);
assert.equal(r3.charging.chargeCurrentA, 5);

console.log('calc.test passed');
