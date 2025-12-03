import { useState, useEffect } from "react";
import { db } from "@/core/firebase";
import { collection, onSnapshot, doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth } from "@/features/auth/auth-context";
import type { DailyEvent } from "@/core/types";

export function useDailyEvents() {
    const { user } = useAuth();
    const [events, setEvents] = useState<Record<string, DailyEvent>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const eventsRef = collection(db, "users", user.uid, "dailyEvents");

        const unsubscribe = onSnapshot(eventsRef, (snapshot) => {
            const newEvents: Record<string, DailyEvent> = {};
            snapshot.forEach((doc) => {
                const data = doc.data();
                newEvents[doc.id] = {
                    id: doc.id,
                    date: doc.id, // ID is the date YYYY-MM-DD
                    ...data
                } as DailyEvent;
            });
            setEvents(newEvents);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching daily events:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const saveEvent = async (date: string, eventData: Partial<DailyEvent>) => {
        if (!user) return;
        const eventRef = doc(db, "users", user.uid, "dailyEvents", date);

        // Merge with existing data
        await setDoc(eventRef, {
            ...eventData,
            date: date,
            updatedAt: new Date()
        }, { merge: true });
    };

    return { events, loading, saveEvent };
}
