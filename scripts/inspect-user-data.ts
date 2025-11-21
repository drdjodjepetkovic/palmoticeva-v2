
export { };
const fs = require('fs');
const path = require('path');

const exportPath = path.resolve('./database_export.json');
const userId = '1pKW0ZPUcchuyYBQZ2yzkWx64ux1';

try {
    const data = JSON.parse(fs.readFileSync(exportPath, 'utf8'));
    const user = data.users[userId];

    if (user) {
        console.log('User found:', userId);
        if (user.__subcollections__ && user.__subcollections__.cycleData) {
            console.log('Cycle Data:', JSON.stringify(user.__subcollections__.cycleData, null, 2));
        } else {
            console.log('No cycleData found for this user.');
        }
    } else {
        console.log('User not found in export.');
    }
} catch (error) {
    console.error('Error reading or parsing export file:', error);
}
