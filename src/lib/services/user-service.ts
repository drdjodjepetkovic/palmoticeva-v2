import { db, logAnalyticsEvent } from '@/lib/firebase/client';
import { doc, getDoc, setDoc, updateDoc, onSnapshot, collection, addDoc, Timestamp } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import type { UserProfile } from '@/types/user';

export const UserService = {
    getUserRef: (uid: string) => doc(db, 'users', uid),

    subscribeToUserProfile: (uid: string, callback: (profile: UserProfile | null) => void) => {
        const userRef = doc(db, 'users', uid);
        return onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                callback(docSnap.data() as UserProfile);
            } else {
                callback(null);
            }
        });
    },

    createUserProfile: async (user: User): Promise<UserProfile> => {
        const userRef = doc(db, 'users', user.uid);
        const newUserProfile: UserProfile = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: 'authenticated',
            createdAt: Timestamp.now(),
            hasCompletedOnboarding: false,
            unreadNotifications: 1,
        };

        await setDoc(userRef, newUserProfile);

        // Add welcome notification
        await UserService.addNotification(user.uid, {
            type: 'welcome',
            text: `Dobrodošli u Palmotićeva aplikaciju, ${user.displayName || 'korisniče'}! Istražite sve mogućnosti.`,
            link: '/my-profile',
            read: false,
        });

        logAnalyticsEvent('sign_up', { method: 'google' });
        return newUserProfile;
    },

    updateUserProfile: async (uid: string, data: Partial<UserProfile>) => {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, data);
    },

    addNotification: async (uid: string, notification: { type: string; text: string; link?: string; read: boolean }) => {
        const notificationsRef = collection(db, 'users', uid, 'notifications');
        await addDoc(notificationsRef, {
            userId: uid,
            ...notification,
            createdAt: new Date().toISOString(),
        });
    }
};
