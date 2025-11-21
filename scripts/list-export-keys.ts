
export { };
const fs = require('fs');
const path = require('path');

const exportPath = path.resolve('./database_export.json');

try {
    const data = JSON.parse(fs.readFileSync(exportPath, 'utf8'));
    console.log('Top-level keys:', Object.keys(data));

    if (data.articles) {
        console.log('Articles count:', Object.keys(data.articles).length);
        // Print first article to see schema
        const firstArticleId = Object.keys(data.articles)[0];
        if (firstArticleId) {
            console.log('Sample Article:', JSON.stringify(data.articles[firstArticleId], null, 2));
        }
    }

    if (data.services) {
        console.log('Services count:', Object.keys(data.services).length);
        // Print first service to see schema
        const firstServiceId = Object.keys(data.services)[0];
        if (firstServiceId) {
            console.log('Sample Service:', JSON.stringify(data.services[firstServiceId], null, 2));
        }
    }

} catch (error) {
    console.error('Error reading export file:', error);
}
