const xlsx = require('xlsx');
const fs = require('fs');

const brandMapping = {
  "Aston Martin India": "Aston Martin",
  "Audi India": "Audi",
  "BMW India": "BMW",
  "BYD India": "BYD",
  "Bentley Motors India": "Bentley",
  "Citroën India": "Citroen",
  "Citroen India": "Citroen",
  "Daewoo Motors India": "Daewoo",
  "Datsun India": "Datsun",
  "Ferrari India": "Ferrari",
  "Fiat India Automobiles": "Fiat",
  "Force Motors Cars": "Force Motors",
  "Ford India": "Ford",
  "General Motors India (Chevrolet)": "Chevrolet",
  "Hindustan Motors": "Hindustan Motors",
  "Honda Cars India": "Honda",
  "Hummer India (AM General / GM)": "Hummer",
  "Hyundai Motors India": "Hyundai",
  "Hyundai": "Hyundai",
  "Isuzu Motors India": "Isuzu",
  "Jaguar Land Rover India": "Land Rover",
  "Jeep India": "Jeep",
  "Kia India": "Kia",
  "Lamborghini India": "Lamborghini",
  "Lexus India": "Lexus",
  "MG Motor India": "MG",
  "MINI India": "MINI",
  "Mahindra & Mahindra": "Mahindra",
  "Maruti Suzuki India": "Maruti Suzuki",
  "Maruti Suzuki": "Maruti Suzuki",
  "Maserati India": "Maserati",
  "Mercedes-Benz India": "Mercedes-Benz",
  "Mitsubishi Motors India": "Mitsubishi",
  "Nissan Motor India": "Nissan",
  "Porsche India": "Porsche",
  "Renault India": "Renault",
  "Rolls-Royce Motor Cars India": "Rolls-Royce",
  "Rolls-Royce Motor Cars": "Rolls-Royce",
  "Tata Motors India": "Tata", // Map to Tata to match QUICK_BRANDS
  "Tata Motors": "Tata",
  "Tesla India": "Tesla",
  "Toyota Kirloskar Motor": "Toyota",
  "VinFast India": "VinFast",
  "Volkswagen India": "Volkswagen",
  "Volvo Cars India": "Volvo",
  "Volvo Auto India": "Volvo",
  "Škoda Auto India": "Skoda",
  "Skoda Auto India": "Skoda",
};

function normalizeBrand(brand) {
  if (brandMapping[brand]) return brandMapping[brand];
  
  let cleaned = brand.replace(/ India$| Motors India$| Motors Cars$| Kirloskar Motor$| Motor India$| Motor Cars$| Auto India$| Cars India$| Group India$| PVT LTD| Limited/gi, "").trim();
  
  if (cleaned === "Tata Motors") return "Tata"; // For consistency
  return cleaned;
}

function extractData(file) {
  const wb = xlsx.readFile(file);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, {header: 1});
  
  const data = {};
  
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || !row[1]) continue;
    
    let originalBrand = String(row[1]).trim();
    if (originalBrand === 'Company' || originalBrand === 'Source / Reference' || originalBrand.startsWith('India Car Database')) continue;
    
    const brand = normalizeBrand(originalBrand);
    
    const model = row[2] ? String(row[2]).trim() : 'Unknown';
    const variant = row[3] ? String(row[3]).trim() : 'Base';
    
    if (!data[brand]) data[brand] = {};
    if (!data[brand][model]) data[brand][model] = [];
    if (!data[brand][model].includes(variant)) data[brand][model].push(variant);
  }
  return data;
}

const premium = extractData('src/assets/PREMIUM.xlsx');
const nonPremium = extractData('src/assets/NON_PREMIUM.xlsx');

const tsCode = 'export const PREMIUM_CARS: Record<string, Record<string, string[]>> = ' + JSON.stringify(premium, null, 2) + ';\n\n' +
'export const NON_PREMIUM_CARS: Record<string, Record<string, string[]>> = ' + JSON.stringify(nonPremium, null, 2) + ';\n\n' +
'export const ALL_CUSTOMER_CARS: Record<string, Record<string, string[]>> = {\n' +
'  ...PREMIUM_CARS,\n' +
'  ...NON_PREMIUM_CARS,\n' +
'};\n\n' +
'export const CUSTOMER_CAR_BRANDS = Object.keys(ALL_CUSTOMER_CARS).sort();\n' +
'export const PREMIUM_CUSTOMER_CAR_BRANDS = Object.keys(PREMIUM_CARS).sort();\n' +
'export const NON_PREMIUM_CUSTOMER_CAR_BRANDS = Object.keys(NON_PREMIUM_CARS).sort();\n\n' +
'export type CarFilterType = "premium" | "non-premium" | "all";\n\n' +
'export function getCustomerBrands(filterType: CarFilterType = "all") {\n' +
'  if (filterType === "premium") return PREMIUM_CUSTOMER_CAR_BRANDS;\n' +
'  if (filterType === "non-premium") return NON_PREMIUM_CUSTOMER_CAR_BRANDS;\n' +
'  return CUSTOMER_CAR_BRANDS;\n' +
'}\n\n' +
'export function getCustomerModels(brand: string, filterType: CarFilterType = "all") {\n' +
'  let db = ALL_CUSTOMER_CARS;\n' +
'  if (filterType === "premium") db = PREMIUM_CARS;\n' +
'  if (filterType === "non-premium") db = NON_PREMIUM_CARS;\n' +
'  if (!brand || !db[brand]) return [];\n' +
'  return Object.keys(db[brand]).sort();\n' +
'}\n\n' +
'export function getCustomerVariants(brand: string, model: string, filterType: CarFilterType = "all") {\n' +
'  let db = ALL_CUSTOMER_CARS;\n' +
'  if (filterType === "premium") db = PREMIUM_CARS;\n' +
'  if (filterType === "non-premium") db = NON_PREMIUM_CARS;\n' +
'  if (!brand || !model || !db[brand] || !db[brand][model]) return [];\n' +
'  return [...db[brand][model]].sort();\n' +
'}\n';

fs.writeFileSync('src/data/customerCarDatabase.ts', tsCode);
console.log('Successfully generated src/data/customerCarDatabase.ts');
