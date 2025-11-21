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
        const userDoc = await db.collection('users').doc(userId).collection('cycleData').doc('main').get();
        if (userDoc.exists) {
            const data = userDoc.data();
            console.log('Cycle Data:', JSON.stringify(data, null, 2));

            if (data.cycles) {
                data.cycles.forEach((c: any, i: number) => {
                    const date = c.startDate.toDate ? c.startDate.toDate() : new Date(c.startDate);
                    console.log(`Cycle ${i}: ${date.toISOString()} (Type: ${c.type})`);
                });
            }
        } else {
            console.log('No cycle data found.');
        }
    } catch (error) {
        console.error('Error fetching cycles:', error);
    }
}

fetchCycles();
