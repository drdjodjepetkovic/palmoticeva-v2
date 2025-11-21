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
const userId = 'zrqbZOVVNIbJXApVYZNZ45d7uSq1';

async function cleanupCycles() {
    try {
        const cycleRef = db.collection('users').doc(userId).collection('cycleData').doc('main');
        const userDoc = await cycleRef.get();

        if (userDoc.exists) {
            const data = userDoc.data();
            if (data.cycles) {
                const now = new Date();
                const validCycles = data.cycles.filter((c: any) => {
                    const date = c.startDate.toDate ? c.startDate.toDate() : new Date(c.startDate);
                    if (date > now) {
                        console.log(`Removing future cycle: ${date.toISOString()} (Type: ${c.type})`);
                        return false;
                    }
                    return true;
                });

                if (validCycles.length < data.cycles.length) {
                    await cycleRef.update({ cycles: validCycles });
                    console.log(`Successfully removed ${data.cycles.length - validCycles.length} future cycles.`);
                } else {
                    console.log('No future cycles found to remove.');
                }
            }
        } else {
            console.log('No cycle data found.');
        }
    } catch (error) {
        console.error('Error cleaning up cycles:', error);
    }
}

cleanupCycles();
