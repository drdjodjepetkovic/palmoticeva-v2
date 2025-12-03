
'use server';
/**
 * @fileoverview This file contains server-side actions that are meant to be
 * run on a schedule (cron jobs).
 */

import { Timestamp, FieldValue } from 'firebase-admin/firestore';
import { dbAdmin, messagingAdmin } from '@/lib/firebase/admin';
import type { UserProfile, Cycle, Notification } from '@/types/user';
import { differenceInDays, addDays } from 'date-fns';

const LATE_THRESHOLD_DAYS = 5; // Send notification if period is this many days late

type UserWithCycleData = {
    profile: UserProfile;
    cycles: Cycle[];
    avgCycleLength: number;
};

/**
 * Checks all users for late periods and sends push notifications.
 * This function is designed to be called by a cron job.
 */
export async function checkLateCyclesAndNotify() {
    console.log('Starting cron job: checkLateCyclesAndNotify');
    let notifiedUsersCount = 0;

    try {
        // 1. Get all users who have an FCM token and are in 'cycling' mode
        const usersRef = dbAdmin.collection('users');
        const q = usersRef.where('fcmToken', '!=', null).where('trackingMode', '==', 'cycling');
        const usersSnapshot = await q.get();

        if (usersSnapshot.empty) {
            console.log('No users with FCM tokens in cycling mode found. Exiting.');
            return { success: true, message: "No relevant users to notify." };
        }

        const usersWithTokens = usersSnapshot.docs.map(doc => doc.data() as UserProfile);

        // 2. For each user, get their cycle data
        const cycleDataPromises = usersWithTokens.map(async (user) => {
            const cycleDocRef = dbAdmin.collection('users').doc(user.uid).collection('cycleData').doc('main');
            const cycleDocSnap = await cycleDocRef.get();
            if (!cycleDocSnap.exists) return null;

            const cycleData = cycleDocSnap.data();
            // Critical check: Ensure cycle data exists and is not empty
            if (!cycleData || !cycleData.cycles || cycleData.cycles.length === 0) {
                 return null;
            }

            const cycles: Cycle[] = cycleData.cycles.map((c: any) => ({
                id: c.id,
                startDate: (c.startDate as Timestamp).toDate(),
                endDate: c.endDate ? (c.endDate as Timestamp).toDate() : null,
                type: c.type || 'regular',
            }));

            return {
                profile: user,
                cycles: cycles,
                avgCycleLength: cycleData.avgCycleLength || 28,
            };
        });

        const allUsersData = (await Promise.all(cycleDataPromises)).filter(Boolean) as UserWithCycleData[];

        // 3. Determine who is late and needs a notification
        const notificationsToCreate: { userId: string, notification: Omit<Notification, 'id'> }[] = [];
        const today = new Date();

        for (const userData of allUsersData) {
            // Skip users who have no regular cycles logged.
            const regularCycles = userData.cycles.filter(c => c.type === 'regular').sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
            if (regularCycles.length === 0) continue;

            const lastCycle = regularCycles[0];
            const expectedNextPeriodStart = addDays(lastCycle.startDate, userData.avgCycleLength);
            const daysLate = differenceInDays(today, expectedNextPeriodStart);

            if (daysLate > LATE_THRESHOLD_DAYS) {
                 const notification: Omit<Notification, 'id'> = {
                    userId: userData.profile.uid,
                    type: 'cycle_late',
                    text: `Primetili smo da vam ciklus kasni. Da li ste zaboravili da unesete početak menstruacije?`,
                    link: '/menstrual-calendar',
                    createdAt: Timestamp.now().toDate().toISOString(),
                    read: false,
                };
                notificationsToCreate.push({ userId: userData.profile.uid, notification });
            }
        }

        // 4. Batch write notifications to Firestore
        if (notificationsToCreate.length > 0) {
            const batch = dbAdmin.batch();
            for (const { userId, notification } of notificationsToCreate) {
                const userRef = dbAdmin.collection('users').doc(userId);
                const notificationRef = userRef.collection('notifications').doc();
                batch.set(notificationRef, notification);
                // Also increment the unread count on the user's profile
                batch.update(userRef, { unreadNotifications: FieldValue.increment(1) });
            }
            await batch.commit();
        }
        
        // 5. Send push notifications
        const usersToNotify = allUsersData.filter(ud => notificationsToCreate.some(n => n.userId === ud.profile.uid));
        
        if (usersToNotify.length > 0) {
            const messages = usersToNotify.map(({ profile }) => ({
                notification: {
                    title: 'Podsetnik iz Palmotićeve',
                    body: 'Primetili smo da vam ciklus kasni. Da li ste zaboravili da unesete početak menstruacije?',
                },
                token: profile.fcmToken!,
                webpush: {
                    fcmOptions: {
                      link: '/menstrual-calendar'
                    }
                }
            })).filter(m => m.token); // Ensure token exists
            
            if (messages.length > 0) {
                const response = await messagingAdmin.sendEach(messages);
                notifiedUsersCount = response.successCount;
                if (response.failureCount > 0) {
                    response.responses.forEach(resp => {
                        if (!resp.success) {
                            console.error(`Failed to send notification: ${resp.error}`);
                        }
                    });
                }
            }
        }
        
        console.log(`Cron job finished. Created ${notificationsToCreate.length} notifications. Sent ${notifiedUsersCount} push notifications.`);
        return { success: true, message: `Successfully notified ${notifiedUsersCount} users.` };

    } catch (error: any) {
        console.error('Error in checkLateCyclesAndNotify cron job:', error);
        return { success: false, error: error.message };
    }
}
