import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { env } from "@/config/env";

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let googleProvider: GoogleAuthProvider;

try {
    if (getApps().length > 0) {
        app = getApp();
    } else {
        app = initializeApp(env.firebase);
    }
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    googleProvider = new GoogleAuthProvider();
} catch (error) {
    console.error("Firebase initialization failed:", error);
    app = {} as any;
    auth = null as any; // Set to null so we can check it
    db = {} as any;
    storage = {} as any;
    googleProvider = {} as any;
}

export { app, auth, db, storage, googleProvider };
