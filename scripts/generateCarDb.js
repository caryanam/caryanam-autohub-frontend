const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

function processSheet(filePath) {
    const wb = xlsx.readFile(filePath);
    const data = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    const db = {};
    data.forEach(row => {
        const brand = row.Brand?.toString().trim();
        const model = row.Model?.toString().trim();
        const variant = row.Variant?.toString().trim();
        if (!brand || !model || !variant) return;

        if (!db[brand]) db[brand] = {};
        if (!db[brand][model]) db[brand][model] = new Set();
        db[brand][model].add(variant);
    });

    const finalDb = {};
    Object.keys(db).sort().forEach(brand => {
        finalDb[brand] = {};
        Object.keys(db[brand]).sort().forEach(model => {
            finalDb[brand][model] = Array.from(db[brand][model]).sort();
        });
    });
    return finalDb;
}

const masterDb = processSheet(path.join(__dirname, '../src/assets/Master_Indian_Car_Database.xlsx'));
const premiumDb = processSheet(path.join(__dirname, '../src/assets/PREMIUM.xlsx'));
const nonPremiumDb = processSheet(path.join(__dirname, '../src/assets/NON PREMIUM.xlsx'));

const template = `// Auto-generated car database
export const MASTER_DATABASE: Record<string, Record<string, string[]>> = ${JSON.stringify(masterDb, null, 2)};
export const PREMIUM_DATABASE: Record<string, Record<string, string[]>> = ${JSON.stringify(premiumDb, null, 2)};
export const NON_PREMIUM_DATABASE: Record<string, Record<string, string[]>> = ${JSON.stringify(nonPremiumDb, null, 2)};

export function getCarBrands(type: 'MASTER' | 'PREMIUM' | 'NON_PREMIUM' = 'MASTER'): string[] {
  if (type === 'PREMIUM') return Object.keys(PREMIUM_DATABASE).sort();
  if (type === 'NON_PREMIUM') return Object.keys(NON_PREMIUM_DATABASE).sort();
  return Object.keys(MASTER_DATABASE).sort();
}

export function getModels(brand: string, type: 'MASTER' | 'PREMIUM' | 'NON_PREMIUM' = 'MASTER'): string[] {
  if (!brand) return [];
  if (type === 'PREMIUM') return Object.keys(PREMIUM_DATABASE[brand] || {}).sort();
  if (type === 'NON_PREMIUM') return Object.keys(NON_PREMIUM_DATABASE[brand] || {}).sort();
  return Object.keys(MASTER_DATABASE[brand] || {}).sort();
}

export function getVariants(brand: string, model: string, type: 'MASTER' | 'PREMIUM' | 'NON_PREMIUM' = 'MASTER'): string[] {
  if (!brand || !model) return [];
  if (type === 'PREMIUM') return (PREMIUM_DATABASE[brand] || {})[model] || [];
  if (type === 'NON_PREMIUM') return (NON_PREMIUM_DATABASE[brand] || {})[model] || [];
  return (MASTER_DATABASE[brand] || {})[model] || [];
}

export const CAR_BRANDS = getCarBrands('MASTER');
`;

fs.writeFileSync(path.join(__dirname, '../src/data/carDatabase.ts'), template);
console.log('carDatabase.ts generated successfully.');
