
// src/lib/firebase/client.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore, doc, updateDoc } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getAnalytics, logEvent, type Analytics } from "firebase/analytics";
import type { Messaging } from "firebase/messaging";
import type { User } from 'firebase/auth';

// HARDCODED FIREBASE CONFIG - To ensure stability
const firebaseConfig = {
  apiKey: "AIzaSyAJ4uOND3fqcB_tk5kQOsRlJhwYQPn69AE",
  authDomain: "palmoticeva-portal.firebaseapp.com",
  projectId: "palmoticeva-portal",
  storageBucket: "palmoticeva-portal.firebasestorage.app",
  messagingSenderId: "103093476920",
  appId: "1:103093476920:web:26dc1dcc28a049b56d90cd",
  measurementId: "G-KQXYJHTF90"
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

// Function to check if the browser supports service workers
function isSupported() {
    return typeof window !== 'undefined' && 'serviceWorker' in navigator && navigator.onLine;
}

// Use a function to dynamically initialize messaging
async function initializeMessaging() {
    if (isSupported() && isFirebaseConfigured(firebaseConfig) && firebaseConfig.messagingSenderId) {
        try {
            const { getMessaging } = await import("firebase/messaging");
            messaging = getMessaging(app);
        } catch (error) {
            console.error("Firebase Messaging not supported or offline:", error);
        }
    }
}

// Use a function to dynamically initialize analytics
async function initializeAnalytics() {
    if (typeof window !== 'undefined' && navigator.onLine && isFirebaseConfigured(firebaseConfig) && firebaseConfig.measurementId) {
        try {
            analytics = getAnalytics(app);
        } catch (error) {
            console.error("Firebase Analytics failed to initialize (possibly offline):", error);
        }
    }
}

// Call the functions to initialize services on the client side
initializeMessaging();
initializeAnalytics();

const isConfigured = () => isFirebaseConfigured(firebaseConfig);

const getFCMToken = async () => {
    if (!messaging) return null;
    try {
        const { getToken } = await import("firebase/messaging");
        const vapidKey = "BNLqFBE5eG05oNCQDFJ4n-1y4Kk9GfJq5lQW4g0p4X6h1s3Y1Z7x6d2m9N8w1t2n2t8Y9c0j0k8J7i6H5g4f3E2d1";
        const status = await Notification.requestPermission();
        if(status === 'granted') {
            const token = await getToken(messaging, { vapidKey });
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
  }
};

export const setupNotifications = async (user: User) => {
  if (!isSupported() || !isConfigured() || !messaging) return;

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
