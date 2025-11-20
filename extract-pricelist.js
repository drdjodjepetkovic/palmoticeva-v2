// Extract pricelist data to JSON
const fs = require('fs');
const path = require('path');

// Read the TypeScript file
const tsContent = fs.readFileSync(path.join(__dirname, 'src/lib/data/pricelist.ts'), 'utf8');

// Extract the data object (starts after "= {" and ends with "};" before the end)
const dataStart = tsContent.indexOf('export const defaultPricelistData');
const dataObjStart = tsContent.indexOf('= {', dataStart) + 2;
const dataObjEnd = tsContent.lastIndexOf('};');
const dataString = tsContent.substring(dataObjStart, dataObjEnd + 1);

// Write to JSON file
const outputPath = path.join(__dirname, 'public/data/pricelist.json');
fs.writeFileSync(outputPath, dataString.trim());

console.log('Pricelist data extracted to:', outputPath);
