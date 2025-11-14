
// src/lib/firebase/client.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore, doc, updateDoc } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getAnalytics, logEvent, type Analytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage, type Messaging } from "firebase/messaging";
import type { User } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

function isFirebaseConfigured(config: typeof firebaseConfig): boolean {
  return (
    !!config.apiKey &&
    !!config.authDomain &&
    !!config.projectId
  );
}

// Properly initialize Firebase and export instances
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

let analytics: Analytics | null = null;
let messaging: Messaging | null = null;

if (typeof window !== 'undefined' && isFirebaseConfigured(firebaseConfig)) {
  if (firebaseConfig.measurementId) {
    analytics = getAnalytics(app);
  }
  // Initialize messaging only if all required fields are present
  if (firebaseConfig.messagingSenderId) {
    messaging = getMessaging(app);
  }
}

// Renamed for clarity to avoid conflict with the check function name
const isConfigured = () => isFirebaseConfigured(firebaseConfig);


const getFCMToken = async () => {
    if (!messaging || !process.env.NEXT_PUBLIC_VAPID_KEY) return null;
    try {
        const status = await Notification.requestPermission();
        if(status === 'granted') {
            const token = await getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY });
            return token;
        }
    } catch (error) {
        console.error('An error occurred while retrieving token. ', error);
        return null;
    }
    return null;
};

// Custom event logger
const logAnalyticsEvent = (eventName: string, eventParams?: { [key: string]: any }) => {
  if (analytics) {
    logEvent(analytics, eventName, eventParams);
  } else {
    // console.log(`Analytics not initialized. Event not logged: ${eventName}`, eventParams);
  }
};

/**
 * Requests notification permission and saves the FCM token to the user's profile.
 * Should be called after a meaningful user interaction, not on page load.
 * @param user The Firebase user object.
 */
export const setupNotifications = async (user: User) => {
  if (typeof window === 'undefined' || !isConfigured() || !messaging) return;
  
  try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
          console.log('Notification permission granted.');
          const token = await getFCMToken();
          if (token) {
              const userDocRef = doc(db, 'users', user.uid);
              await updateDoc(userDocRef, { fcmToken: token });
              console.log('FCM token saved for user.');
          }
      } else {
          console.log('Notification permission denied.');
      }
  } catch (error) {
      console.error('Error during notification setup:', error);
  }
};

export { app, auth, db, storage, googleProvider, analytics, messaging, isConfigured, getFCMToken, logAnalyticsEvent };
