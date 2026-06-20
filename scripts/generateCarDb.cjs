const XLSX = require('xlsx');
const fs = require('fs');

const wb = XLSX.readFile('src/assets/India_Car_Database_Verified (2).xlsx');
const ws = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });

// Row 2 (index 2) = headers; data starts from row 3 (index 3)
const data = rows.slice(3).filter(r => r[1] && r[2]);

const map = {};
for (const r of data) {
  const brand = String(r[1] || '').trim();
  const model = String(r[2] || '').trim();
  const variant = String(r[3] || '').trim();
  if (!brand || !model) continue;
  if (!map[brand]) map[brand] = {};
  if (!map[brand][model]) map[brand][model] = [];
  if (variant && !map[brand][model].includes(variant)) {
    map[brand][model].push(variant);
  }
}

const brands = Object.keys(map).sort();
const result = {};
for (const brand of brands) {
  result[brand] = {};
  const models = Object.keys(map[brand]).sort();
  for (const model of models) {
    result[brand][model] = map[brand][model];
  }
}

const json = JSON.stringify(result, null, 2);

const tsContent = [
  '// Auto-generated from India_Car_Database_Verified.xlsx',
  '// Mapping: brand -> model -> variants[]',
  'export const CAR_DATABASE: Record<string, Record<string, string[]>> = ' + json + ';',
  '',
  'export const CAR_BRANDS: string[] = Object.keys(CAR_DATABASE).sort();',
  '',
  'export function getModels(brand: string): string[] {',
  '  return Object.keys(CAR_DATABASE[brand] || {}).sort();',
  '}',
  '',
  'export function getVariants(brand: string, model: string): string[] {',
  '  return (CAR_DATABASE[brand] || {})[model] || [];',
  '}',
].join('\n');

fs.writeFileSync('src/data/carDatabase.ts', tsContent, 'utf8');
console.log('Done! Brands:', brands.length);
console.log('File size:', fs.statSync('src/data/carDatabase.ts').size, 'bytes');
