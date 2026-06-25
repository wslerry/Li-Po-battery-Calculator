// js/calc.js — pure battery engine, no DOM access
export function packVoltages(cells, chem) {
  return {
    nominalV: cells * chem.nominal,
    fullV: cells * chem.charge,
    storageV: cells * chem.storage,
    cutoffV: cells * chem.cutoff,
  };
}

export function energyWh(cells, chem, capacityMah) {
  return cells * chem.nominal * (capacityMah / 1000);
}

export function maxContinuousCurrent(capacityMah, dischargeC) {
  return (capacityMah / 1000) * dischargeC;
}

export function runTime(capacityMah, avgCurrent, dod) {
  const ah = capacityMah / 1000;
  return {
    usableMin: (ah * dod) / avgCurrent * 60,
    fullMin: (ah / avgCurrent) * 60,
  };
}

export function chargeCurrent(capacityMah, chargeC) {
  return (capacityMah / 1000) * chargeC;
}

export function chargeTime(capacityMah, chargeC, taper = 1.15) {
  const i = chargeCurrent(capacityMah, chargeC);
  return (capacityMah / 1000) / i * 60 * taper;
}

export function chargerWatts(cells, chem, capacityMah, chargeC, packs, headroom = 1.15) {
  const fullV = cells * chem.charge;
  const total = packs * chargeCurrent(capacityMah, chargeC);
  return fullV * total * headroom;
}

export function reverseSizing(targetCurrent, capacityMah, dischargeC) {
  return {
    minC: targetCurrent / (capacityMah / 1000),
    minCapacityMah: (targetCurrent / dischargeC) * 1000,
  };
}

export function airlineClass(wh) {
  if (wh <= 100) return 'ok';
  if (wh <= 160) return 'approval';
  return 'prohibited';
}

export function chargeSafety(chargeC, chemId) {
  const safeLimit = chemId === 'lifepo4' ? 2 : 1;
  if (chargeC > safeLimit) {
    return {
      unsafe: true,
      safeLimit,
      message: `Charge rate ${chargeC}C exceeds the ${safeLimit}C safe maximum for this chemistry. Higher rates risk overheating, cell puffing, and thermal runaway.`,
    };
  }
  if (chargeC > 0.8 * safeLimit) {
    return {
      unsafe: false,
      safeLimit,
      message: `Charge rate ${chargeC}C is within the ${safeLimit}C limit but near the edge. For longest pack life, charge at 0.5–0.7C when time allows.`,
    };
  }
  return { unsafe: false, safeLimit, message: null };
}

// Composes all outputs into grouped object for the UI.
export function computeBattery(pack, inputs) {
  const { chem, cells, capacityMah } = pack;
  const { dischargeC, chargeC, avgCurrent, dod, packs, targetCurrent } = inputs;

  const v = packVoltages(cells, chem);
  const wh = energyWh(cells, chem, capacityMah);
  const maxCurrentA = maxContinuousCurrent(capacityMah, dischargeC);
  const run = runTime(capacityMah, avgCurrent, dod);
  const chargeCurrentA = chargeCurrent(capacityMah, chargeC);
  const chargeTimeMin = chargeTime(capacityMah, chargeC);
  const totalChargeCurrentA = packs * chargeCurrentA;
  const chargerWattsW = chargerWatts(cells, chem, capacityMah, chargeC, packs);
  const sizing = targetCurrent != null
    ? reverseSizing(targetCurrent, capacityMah, dischargeC)
    : null;

  return {
    pack: { ...v, energyWh: wh },
    discharge: {
      maxCurrentA,
      runUsableMin: run.usableMin,
      runFullMin: run.fullMin,
      exceedsMax: avgCurrent > maxCurrentA,
    },
    charging: {
      chargeCurrentA, chargeTimeMin, totalChargeCurrentA, chargerWattsW,
      chargeSafety: chargeSafety(chargeC, chem.id),
    },
    sizing,
    planning: { storageV: v.storageV, cutoffV: v.cutoffV, airline: airlineClass(wh) },
  };
}
