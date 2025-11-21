export { };
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
// NOTE: This requires GOOGLE_APPLICATION_CREDENTIALS environment variable or a service account key file
// For local dev, if you have the key, you can point to it.
// If running in an environment where you are already authenticated (like gcloud auth application-default login), it might work without key.

const serviceAccountKeyPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH || './service-account-key.json';

try {
    if (fs.existsSync(serviceAccountKeyPath)) {
        const serviceAccount = require(path.resolve(serviceAccountKeyPath));
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } else {
        console.log('Service account key not found at default path, trying default credentials...');
        admin.initializeApp();
    }
} catch (e) {
    console.error('Failed to initialize admin:', e);
    process.exit(1);
}

const db = admin.firestore();

async function exportDatabase() {
    console.log('Starting database export...');
    const exportData: any = {};

    try {
        const collections = await db.listCollections();

        for (const collection of collections) {
            console.log(`Exporting collection: ${collection.id}`);
            exportData[collection.id] = {};
            const snapshot = await collection.get();

            for (const doc of snapshot.docs) {
                const docData = doc.data();
                exportData[collection.id][doc.id] = docData;

                // Handle subcollections for users (specifically cycleData and dailyEvents)
                if (collection.id === 'users') {
                    const subcollections = await doc.ref.listCollections();
                    if (subcollections.length > 0) {
                        exportData[collection.id][doc.id]['__subcollections__'] = {};
                        for (const subcol of subcollections) {
                            console.log(`  Exporting subcollection: ${subcol.id} for user ${doc.id}`);
                            const subSnapshot = await subcol.get();
                            exportData[collection.id][doc.id]['__subcollections__'][subcol.id] = {};
                            subSnapshot.forEach((subDoc: any) => {
                                exportData[collection.id][doc.id]['__subcollections__'][subcol.id][subDoc.id] = subDoc.data();
                            });
                        }
                    }
                }
            }
        }

        const outputPath = path.resolve('./database_export.json');
        fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));
        console.log(`Database exported successfully to: ${outputPath}`);

    } catch (error) {
        console.error('Error exporting database:', error);
    }
}

exportDatabase();
