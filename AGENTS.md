# LiPo Battery Calculator — Agent Specification

## Project
- Static site (GitHub Pages), no bundler, no build step.
- Calculates pack voltages, energy, max current, run time, charge time, charger
  wattage, reverse sizing, and storage/planning info for lithium battery packs.

## Tech Stack
- Vanilla HTML5 / CSS3 / ES modules. No frameworks, no build.
- Zero-dependency `package.json` (`{"type":"module"}`) only so Node can run tests.

## File Tree
- `index.html` — structure only; no inline JS/CSS
- `data/chemistries.json` — per-cell voltages (LiPo, Li-ion, LiHV, LiFePO4)
- `data/chemistries.schema.json` — JSON Schema
- `css/tokens.css` — tokens + dark mode; `css/app.css` — layout/components
- `js/calc.js` — pure battery engine (no DOM); `js/format.js` — round()
- `js/data.js` — loadChemistries(); `js/validate.js` — validateChemistry()
- `js/ui/form.js` — readInputs(); `js/ui/results.js` — renderResults()
- `js/main.js` — entry, live recompute
- `tests/*.test.mjs` — plain Node tests (golden values)

## Architecture
Three layers, one-way flow: `chemistries.json → form → calc.js → results`.
`calc.js` is pure (no DOM) and the only place math lives.

## Key Formulas (corrected from the original)
- energy Wh = cells × nominal × (mAh/1000)
- max continuous current = (mAh/1000) × dischargeC
- run time (min) = (mAh/1000) × DoD ÷ avgCurrent × 60  (avgCurrent is an input)
- charge current = (mAh/1000) × chargeC
- charge time (min) = (mAh/1000) ÷ chargeCurrent × 60 × 1.15 (CV taper)
- charger watts = fullV × (packs × chargeCurrent) × 1.15 (headroom)
- reverse: minC = targetCurrent ÷ (mAh/1000)
Assumptions: DoD 80% default, CV taper ×1.15, charger headroom ×1.15.
Optional inputs: chargeC defaults to 1C (safe max); avgCurrent is omittable (it's a
load property, not on the label) — when blank, run time and the exceeds-max warning
are hidden and every other output still computes.

## Security
Strict CSP (no inline JS/CSS); no jQuery/AdSense/Analytics; no innerHTML from data.

## Tests
`node tests/format.test.mjs` · `calc` · `validate` · `data`. No parity (math was corrected).

## Out of Scope
npm/bundler/TypeScript, React, server-side, test framework, ads/analytics, internal-resistance modeling.
