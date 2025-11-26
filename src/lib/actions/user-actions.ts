
'use server';

import { db } from '@/lib/firebase/client';
import { storageAdmin } from '@/lib/firebase/admin';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  writeBatch,
  where,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { type Cycle, type Notification, type UserProfile } from '@/types/user';
import { addDays, format } from 'date-fns';
import type { LanguageCode } from '@/types/content';

type UserFile = {
  name: string;
  url: string;
  size: number; // in bytes
  updatedAt: string;
};

export async function getUserFiles(userId: string): Promise<{ files?: UserFile[]; error?: string }> {
  try {
    const bucket = storageAdmin.bucket();
    const prefix = `files/${userId}/`;
    const [files] = await bucket.getFiles({ prefix });

    if (files.length === 0) {
      return { files: [] };
    }

    const filePromises = files.map(async (file) => {
      // Skip the folder itself if it's returned
      if (file.name === prefix) return null;

      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: '03-01-2500', // Long expiry
      });

      const [metadata] = await file.getMetadata();

      return {
        name: file.name.split('/').pop() || file.name,
        url: url,
        size: Number(metadata.size),
        updatedAt: metadata.updated || new Date().toISOString(),
      };
    });

    const results = await Promise.all(filePromises);
    const validFiles = results.filter((f): f is UserFile => f !== null);

    validFiles.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return { files: validFiles };
  } catch (error: any) {
    console.error('Error fetching user files:', error);
    return { error: `Greška prilikom preuzimanja fajlova: ${error.message}` };
  }
}

// --- CALENDAR EXPORT ACTIONS ---

type CalendarExportInput = {
  userId: string;
  lang: LanguageCode;
};

type CalendarExportOutput = {
  google?: {
    periodUrl?: string;
    fertileUrl?: string;
  };
  icsData?: {
    period?: string;
    fertile?: string;
  };
  error?: string;
};

// Helper to format date for different calendar types
const formatDate = (date: Date, type: 'google' | 'ics', isAllDay: boolean = true) => {
  if (type === 'google') {
    return format(date, 'yyyyMMdd');
  }
  // ICS format
  if (isAllDay) {
    return format(date, 'yyyyMMdd');
  }
  return format(date, "yyyyMMdd'T'HHmmss'Z'");
};

export async function generateCalendarLinks(input: CalendarExportInput): Promise<CalendarExportOutput> {
  try {
    const { userId, lang: rawLang } = input;
    const lang = rawLang === 'se' || rawLang === 'se-lat' ? 'sr' : rawLang;

    const dataRef = doc(db, 'users', userId, 'cycleData', 'main');
    const dataSnap = await getDoc(dataRef);

    if (!dataSnap.exists()) {
      return { error: 'No cycle data found for user.' };
    }

    const cycleData = dataSnap.data();
    const cycles: Cycle[] =
      cycleData.cycles?.map((c: any) => ({
        id: c.id,
        startDate: c.startDate.toDate(),
        endDate: c.endDate ? c.endDate.toDate() : null,
        type: c.type || 'regular',
      })) || [];

    const avgCycleLength = cycleData.avgCycleLength || 28;
    const avgPeriodLength = cycleData.avgPeriodLength || 5;

    const regularCycles = cycles.filter((c) => c.type === 'regular');
    if (regularCycles.length === 0) {
      return { error: 'Not enough data to make predictions.' };
    }

    const lastCycle = regularCycles
      .slice()
      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime())[0];

    const translations: Record<string, Record<'sr' | 'en' | 'ru', string>> = {
      predictedPeriod: {
        sr: 'Očekivani novi ciklus',
        en: 'Expected New Cycle',
        ru: 'Ожидаемый новый цикл',
      },
      fertileWindow: { sr: 'Plodni Dani', en: 'Fertile Window', ru: 'Фертильные дни' },
      gcalDescription: {
        sr: 'Predviđeno na osnovu podataka iz Palmotićeva aplikacije.',
        en: 'Predicted based on data from the Palmotićeva app.',
        ru: 'Прогноз на основе данных из приложения «Палмотичева».',
      },
    };

    const createGoogleLink = (summary: string, startDate: Date, endDate: Date) => {
      const url = new URL('https://www.google.com/calendar/render');
      url.searchParams.append('action', 'TEMPLATE');
      url.searchParams.append('text', summary);
      url.searchParams.append('dates', `${formatDate(startDate, 'google')}/${formatDate(addDays(endDate, 1), 'google')}`);
      url.searchParams.append('details', translations.gcalDescription[lang]);
      return url.toString();
    };

    const createIcsEvents = (summary: string, rule: 'period' | 'fertile') => {
      const icsRows = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Palmotićeva//Ciklus Kalendar//EN'];
      for (let i = 0; i <= 12; i++) {
        // Generate for current + next 12 "ciklusa"
        const cycleStart = addDays(lastCycle.startDate, avgCycleLength * i);
        let eventStart: Date, eventEnd: Date;

        if (rule === 'period') {
          eventStart = addDays(lastCycle.startDate, avgCycleLength * (i + 1));
          eventEnd = addDays(eventStart, avgPeriodLength);
        } else {
          // Ovulacija je ~14 dana pre sledeće menstruacije
          const nextPeriodStartPrediction = addDays(cycleStart, avgCycleLength);
          const ovulationDate = addDays(nextPeriodStartPrediction, -14);
          eventStart = addDays(ovulationDate, -4);
          eventEnd = addDays(ovulationDate, 2); // inclusive end
        }

        icsRows.push('BEGIN:VEVENT');
        icsRows.push(`DTSTART;VALUE=DATE:${formatDate(eventStart, 'ics')}`);
        icsRows.push(`DTEND;VALUE=DATE:${formatDate(eventEnd, 'ics')}`);
        icsRows.push(`SUMMARY:${summary}`);
        icsRows.push(`UID:${eventStart.toISOString()}-${summary.replace(/\s/g, '-')}@palmoticeva.com`);
        icsRows.push('END:VEVENT');
      }
      icsRows.push('END:VCALENDAR');
      return icsRows.join('\n');
    };

    // --- Generate for the NEXT cycle for Google Calendar ---
    const nextPeriodStart = addDays(lastCycle.startDate, avgCycleLength);
    const periodEndDate = addDays(nextPeriodStart, avgPeriodLength);
    const ovulationDate = addDays(nextPeriodStart, -14);
    const fertileStartDate = addDays(ovulationDate, -4);
    const fertileEndDate = addDays(ovulationDate, 1);

    const periodUrl = createGoogleLink(translations.predictedPeriod[lang], nextPeriodStart, periodEndDate);
    const fertileUrl = createGoogleLink(translations.fertileWindow[lang], fertileStartDate, fertileEndDate);

    // --- Generate for multiple future events for ICS ---
    const periodIcs = createIcsEvents(translations.predictedPeriod[lang], 'period');
    const fertileIcs = createIcsEvents(translations.fertileWindow[lang], 'fertile');

    return {
      google: { periodUrl, fertileUrl },
      icsData: { period: periodIcs, fertile: fertileIcs },
    };
  } catch (error: any) {
    console.error('Error generating calendar export:', error);
    return { error: `Server error: ${error.message}` };
  }
}

// --- NOTIFICATION ACTIONS ---

export type NotificationWithId = Notification & { id: string };

export async function getNotifications(userId: string): Promise<{ notifications?: NotificationWithId[]; error?: string }> {
  try {
    const notificationsRef = collection(db, 'users', userId, 'notifications');
    const q = query(notificationsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const notifications = querySnapshot.docs.map(
      (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as NotificationWithId),
    );

    return { notifications };
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    return { error: `Greška prilikom preuzimanja obaveštenja: ${error.message}` };
  }
}

export async function markNotificationsAsRead(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const userDocRef = doc(db, 'users', userId);
    const notificationsRef = collection(db, 'users', userId, 'notifications');

    // Check if there's anything to update first
    const userDocSnap = await getDoc(userDocRef);
    const hasUnread = userDocSnap.exists() && userDocSnap.data().unreadNotifications > 0;

    if (hasUnread) {
      const batch = writeBatch(db);
      const q = query(notificationsRef, where('read', '==', false));
      const unreadSnapshot = await getDocs(q);

      unreadSnapshot.forEach((doc) => {
        batch.update(doc.ref, { read: true });
      });

      batch.update(userDocRef, { unreadNotifications: 0 });

      await batch.commit();
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error marking notifications as read:', error);
    return { success: false, error: error.message };
  }
}
