// js/ui/results.js
import { round } from '../format.js';

function metric(label, value, unit) {
  const wrap = document.createElement('div');
  wrap.className = 'metric';
  const l = document.createElement('div');
  l.className = 'label';
  l.textContent = label;
  const v = document.createElement('div');
  v.className = 'value';
  v.textContent = String(value);
  if (unit) {
    const u = document.createElement('span');
    u.className = 'unit';
    u.textContent = unit;
    v.appendChild(u);
  }
  wrap.append(l, v);
  return wrap;
}

function section(title, metrics) {
  const sec = document.createElement('div');
  sec.className = 'result-section';
  const h = document.createElement('h3');
  h.textContent = title;
  const grid = document.createElement('div');
  grid.className = 'metrics';
  grid.append(...metrics);
  sec.append(h, grid);
  return sec;
}

function note(text, warn) {
  const p = document.createElement('p');
  p.className = warn ? 'note warn' : 'note';
  p.textContent = text;
  return p;
}

const AIRLINE_TEXT = {
  ok: 'Energy ≤ 100 Wh — generally OK for carry-on.',
  approval: 'Energy 100–160 Wh — usually requires airline approval.',
  prohibited: 'Energy > 160 Wh — generally prohibited on aircraft.',
};

export function renderResults(container, r) {
  const sections = [];

  sections.push(section('Pack', [
    metric('Nominal', round(r.pack.nominalV, 2), 'V'),
    metric('Full charge', round(r.pack.fullV, 2), 'V'),
    metric('Storage', round(r.pack.storageV, 2), 'V'),
    metric('Cutoff (min)', round(r.pack.cutoffV, 2), 'V'),
    metric('Energy', round(r.pack.energyWh, 1), 'Wh'),
  ]));

  const dischargeSec = section('Discharge & run time', [
    metric('Max continuous', round(r.discharge.maxCurrentA, 1), 'A'),
    metric('Run time (usable)', round(r.discharge.runUsableMin, 1), 'min'),
    metric('Run time (100%)', round(r.discharge.runFullMin, 1), 'min'),
  ]);
  if (r.discharge.exceedsMax) {
    dischargeSec.appendChild(note('Average draw exceeds the pack\'s max continuous current.', true));
  }
  sections.push(dischargeSec);

  sections.push(section('Charging', [
    metric('Charge current/pack', round(r.charging.chargeCurrentA, 2), 'A'),
    metric('Charge time', round(r.charging.chargeTimeMin, 0), 'min'),
    metric('Total charge current', round(r.charging.totalChargeCurrentA, 2), 'A'),
    metric('Required charger', round(r.charging.chargerWattsW, 0), 'W'),
  ]));

  if (r.sizing) {
    sections.push(section('Sizing (for target current)', [
      metric('Min C-rating', round(r.sizing.minC, 1), 'C'),
      metric('Min capacity', round(r.sizing.minCapacityMah, 0), 'mAh'),
    ]));
  }

  const planningSec = section('Planning / storage', [
    metric('Storage voltage', round(r.planning.storageV, 2), 'V'),
    metric('Never below', round(r.planning.cutoffV, 2), 'V'),
  ]);
  planningSec.appendChild(note(AIRLINE_TEXT[r.planning.airline]));
  sections.push(planningSec);

  container.replaceChildren(...sections);
}
