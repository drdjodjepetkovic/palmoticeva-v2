import { db } from "@/core/firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import type { UserProfile, UserRole } from "@/core/types";

export const UserService = {
    async getUserProfile(uid: string): Promise<UserProfile | null> {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as UserProfile;
        }
        return null;
    },

    async createUserProfile(uid: string, email: string, displayName: string): Promise<UserProfile> {
        const newUser: UserProfile = {
            uid,
            email,
            displayName,
            role: 'user', // Default role
            verificationStatus: 'unverified',
            updatedAt: serverTimestamp() as any,
        };

        await setDoc(doc(db, "users", uid), newUser);
        return newUser;
    },

    async updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
        const docRef = doc(db, "users", uid);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp(),
        });
    }
};
