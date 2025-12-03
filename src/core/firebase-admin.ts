import "server-only";
import { initializeApp, getApps, getApp, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

// Note: In production (Firebase Functions/App Hosting), the SDK auto-initializes.
// For local dev, we might need a service account if not using the emulator.

let adminApp: App;

if (getApps().length > 0) {
    adminApp = getApp();
} else {
    // If we have a service account key in env (for local dev)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        adminApp = initializeApp({
            credential: cert(serviceAccount),
        });
    } else {
        // Default initialization (works on GCP/Firebase Hosting)
        adminApp = initializeApp();
    }
}

const adminDb: Firestore = getFirestore(adminApp);
const adminAuth: Auth = getAuth(adminApp);

export { adminApp, adminDb, adminAuth };
