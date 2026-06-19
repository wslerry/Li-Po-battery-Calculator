// js/validate.js
const NUMERIC_FIELDS = ['nominal', 'charge', 'storage', 'cutoff'];

export function validateChemistry(c) {
  const errors = [];
  if (typeof c.id !== 'string' || c.id === '') errors.push('id');
  if (typeof c.name !== 'string' || c.name === '') errors.push('name');
  for (const key of NUMERIC_FIELDS) {
    if (typeof c[key] !== 'number' || !(c[key] > 0)) errors.push(key);
  }
  return errors;
}
