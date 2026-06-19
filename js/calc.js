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
    charging: { chargeCurrentA, chargeTimeMin, totalChargeCurrentA, chargerWattsW },
    sizing,
    planning: { storageV: v.storageV, cutoffV: v.cutoffV, airline: airlineClass(wh) },
  };
}
