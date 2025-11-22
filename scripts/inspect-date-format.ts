
import * as fs from 'fs';
import * as path from 'path';

const exportPath = path.join(process.cwd(), 'database_export.json');

try {
    const data = fs.readFileSync(exportPath, 'utf8');
    const json = JSON.parse(data);

    // Find users collection
    const users = json.users || {};

    for (const userId in users) {
        const user = users[userId];
        if (user.cycleData && user.cycleData.main) {
            const cycles = user.cycleData.main.cycles || [];
            if (cycles.length > 0) {
                console.log(`Found cycles for user ${userId}:`);
                cycles.slice(0, 3).forEach((cycle: any, index: number) => {
                    console.log(`Cycle ${index}:`);
                    console.log(`  startDate:`, cycle.startDate);
                    console.log(`  endDate:`, cycle.endDate);
                    console.log(`  Type of startDate:`, typeof cycle.startDate);
                });
                break; // Just show one user's data
            }
        }
    }
} catch (error) {
    console.error('Error reading database export:', error);
}
