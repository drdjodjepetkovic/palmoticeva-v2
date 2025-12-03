export { };
const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require(path.resolve('./service-account-key.json'));

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();
const userId = 'zrqbZOVVNIbJXApVYZNZ45d7uSq1'; // User from conversation logs

async function fetchCycles() {
    try {
        console.log(`Fetching data for user: ${userId}`);

        // Check cycleData/main
        const mainDoc = await db.collection('users').doc(userId).collection('cycleData').doc('main').get();
        if (mainDoc.exists) {
            console.log('--- cycleData/main ---');
            console.log(JSON.stringify(mainDoc.data(), null, 2));
        } else {
            console.log('cycleData/main does not exist.');
        }

        // Check for other documents in cycleData
        const cycleDataSnapshot = await db.collection('users').doc(userId).collection('cycleData').get();
        console.log(`\n--- cycleData collection (${cycleDataSnapshot.size} docs) ---`);
        cycleDataSnapshot.forEach((doc: any) => {
            if (doc.id !== 'main') {
                console.log(`Doc ID: ${doc.id}`);
                console.log(JSON.stringify(doc.data(), null, 2));
            }
        });

        // Check for 'dailyEvents' collection under user
        const dailyEventsSnapshot = await db.collection('users').doc(userId).collection('dailyEvents').get();
        console.log(`\n--- dailyEvents collection (${dailyEventsSnapshot.size} docs) ---`);
        if (!dailyEventsSnapshot.empty) {
            dailyEventsSnapshot.forEach((doc: any) => {
                console.log(`Event: ${doc.id}`, doc.data());
            });
        }

        // Check for 'cycles' collection under user (as per current use-cycle.ts)
        const cyclesSnapshot = await db.collection('users').doc(userId).collection('cycles').get();
        console.log(`\n--- cycles collection (${cyclesSnapshot.size} docs) ---`);
        if (!cyclesSnapshot.empty) {
            cyclesSnapshot.forEach((doc: any) => {
                console.log(`Cycle: ${doc.id}`, doc.data());
            });
        }

    } catch (error) {
        console.error('Error fetching cycles:', error);
    }
}

fetchCycles();
