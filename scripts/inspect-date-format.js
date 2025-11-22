const fs = require('fs');
const path = require('path');

const exportPath = path.join(process.cwd(), 'database_export.json');

try {
    const data = fs.readFileSync(exportPath, 'utf8');
    const json = JSON.parse(data);

    console.log('Top-level keys:', Object.keys(json));

    if (json.users) {
        console.log('Users found. Sample user keys:', Object.keys(json.users)[0]);
        const firstUser = json.users[Object.keys(json.users)[0]];
        console.log('First user keys:', Object.keys(firstUser));
        if (firstUser.cycleData) {
            console.log('cycleData found in user.');
            console.log('cycleData keys:', Object.keys(firstUser.cycleData));
        }
    }

    // Find users collection
    // The structure might be root -> users -> [userId] -> ...
    // Or it might be a flat export. Let's assume it mimics the Firestore structure.

    const users = json.__collections__?.users || json.users || {};

    console.log('Scanning users...');
    for (const userId in users) {
        const user = users[userId];

        // Check for cycleData in __subcollections__ or directly
        let cycleData = user.cycleData;
        if (!cycleData && user.__subcollections__) {
            cycleData = user.__subcollections__.cycleData;
        }

        if (cycleData) {
            // cycleData is a collection, so it might have documents like 'main'
            const mainDoc = cycleData.main || cycleData['main'];

            if (mainDoc) {
                const cycles = mainDoc.cycles || [];
                if (cycles.length > 0) {
                    console.log(`Found cycles for user ${userId}:`);
                    cycles.slice(0, 3).forEach((cycle, index) => {
                        console.log(`Cycle ${index}:`);
                        console.log(`  startDate:`, cycle.startDate);
                        console.log(`  endDate:`, cycle.endDate);
                        console.log(`  Type of startDate:`, typeof cycle.startDate);
                    });
                    return; // Found data, exit
                }
            }
        }
    }
    console.log('No cycle data found in export.');

} catch (error) {
    console.error('Error reading database export:', error);
}
