// src/lib/firebase/admin.ts
import admin from 'firebase-admin';
import { getMessaging } from 'firebase-admin/messaging';
import { getApp, getApps, initializeApp } from 'firebase-admin/app';
import { FieldValue } from 'firebase-admin/firestore';


// This is a safeguard to prevent re-initializing the app
if (!admin.apps.length) {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountKey) {
        try {
            admin.initializeApp({
                credential: admin.credential.cert(JSON.parse(serviceAccountKey))
            });
        } catch (error) {
            console.error("Error initializing Firebase Admin with service account:", error);
            // Fallback for environments where service account might not parse but ADC is available
            admin.initializeApp();
        }
    } else {
        // For local development using GOOGLE_APPLICATION_CREDENTIALS
        // or other default credential providers.
        admin.initializeApp();
    }
}


const app = getApps().length > 0 ? getApp() : initializeApp();

const authAdmin = admin.auth();
const dbAdmin = admin.firestore();
const messagingAdmin = getMessaging(app);

export { authAdmin, dbAdmin, messagingAdmin, FieldValue };
