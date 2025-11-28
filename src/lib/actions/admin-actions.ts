
'use server';

import { collection, getDocs, query, where, Timestamp, doc, getDoc, orderBy, startAt, endAt, writeBatch, updateDoc, arrayUnion, arrayRemove, increment, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { UserProfile, Cycle, DailyEvent, Notification } from '@/types/user';
import type { LanguageCode } from '@/types/content';
import { type Article, type ArticlesContent } from '@/lib/data/content/articles';
import { revalidatePath } from 'next/cache';
import { processArticleContent } from '@/ai/flows/process-article-flow';


// +--------------------------------+
// |   NOTIFICATION SENDER          |
// +--------------------------------+

export async function sendNotificationToUser(
  userId: string,
  text: string,
  link: string = '/my-profile/notifications'
): Promise<{ success: boolean; error?: string }> {
  try {
    const userDocRef = doc(db, 'users', userId);
    const notificationsRef = collection(db, 'users', userId, 'notifications');

    // Add the new notification
    const batch = writeBatch(db);
    const newNotifRef = doc(notificationsRef);
    batch.set(newNotifRef, {
      userId,
      type: 'welcome', // Using 'welcome' as a generic admin message type
      text: text,
      link: link,
      createdAt: new Date().toISOString(),
      read: false,
    });
    
    // Increment unread notifications count
    batch.update(userDocRef, {
      unreadNotifications: increment(1),
    });
    
    await batch.commit();

    return { success: true };
  } catch (error: any) {
    console.error('Error sending notification:', error);
    return { success: false, error: `Greška na serveru: ${error.message}` };
  }
}


// +--------------------------------+
// |   ARTICLE MANAGEMENT           |
// +--------------------------------+
export async function addArticle(
    articleContent: { title: string; summary: string; content: string },
    slug: string,
    image: string,
    date: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, 'page_content', 'articles');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const existingData = docSnap.data() as ArticlesContent;
        if (existingData.articles.some(a => a.slug === slug)) {
            return { success: false, error: 'Članak sa ovim slug-om već postoji.' };
        }
    }

    const processedData = await processArticleContent(articleContent);

    const newArticle: Article = {
      slug,
      image,
      date,
      title: processedData.title,
      summary: processedData.summary,
      content: processedData.content,
      author: {
        "sr": "Ginekološka ordinacija Palmotićeva",
        en: "Palmotićeva Gynecology Clinic",
        se: "Гинеколошка ординација Палмотићева",
        ru: "Гинекологическая клиника «Палмотичева»"
      }
    };

    if (docSnap.exists()) {
        await updateDoc(docRef, {
            articles: arrayUnion(newArticle)
        });
    } else {
        await setDoc(docRef, { articles: [newArticle], version: 1 });
    }
    
    revalidatePath('/[lang]/articles', 'page');
    revalidatePath(`/[lang]/articles/${slug}`, 'page');

    return { success: true };
  } catch (error: any) {
    console.error('Error adding article:', error);
    return { success: false, error: `Greška na serveru: ${error.message}` };
  }
}

export async function updateArticle(
    originalSlug: string,
    articleContent: { title: string; summary: string; content: string },
    newSlug: string,
    image: string,
    date: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const docRef = doc(db, 'page_content', 'articles');
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return { success: false, error: "Dokument sa člancima nije pronađen." };
        }

        const data = docSnap.data() as ArticlesContent;
        const articles = data.articles || [];
        
        const articleIndex = articles.findIndex(a => a.slug === originalSlug);
        if (articleIndex === -1) {
            return { success: false, error: "Članak za izmenu nije pronađen." };
        }

        if (originalSlug !== newSlug && articles.some((a, i) => i !== articleIndex && a.slug === newSlug)) {
             return { success: false, error: "Novi slug se već koristi za drugi članak." };
        }

        const processedData = await processArticleContent(articleContent);
        
        const updatedArticle: Article = {
            ...articles[articleIndex],
            slug: newSlug,
            image,
            date,
            title: processedData.title,
            summary: processedData.summary,
            content: processedData.content,
        };
        
        articles[articleIndex] = updatedArticle;

        await updateDoc(docRef, { articles: articles });

        revalidatePath('/[lang]/articles', 'page');
        revalidatePath(`/[lang]/articles/${newSlug}`, 'page');
        if (originalSlug !== newSlug) {
            revalidatePath(`/[lang]/articles/${originalSlug}`, 'page');
        }

        return { success: true };

    } catch (error: any) {
        console.error('Error updating article:', error);
        return { success: false, error: `Greška na serveru: ${error.message}` };
    }
}


export async function deleteArticle(slug: string): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, 'page_content', 'articles');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as ArticlesContent;
      const articles = data.articles || [];
      const updatedArticles = articles.filter((a: Article) => a.slug !== slug);
      
      if (articles.length !== updatedArticles.length) {
        await updateDoc(docRef, {
          articles: updatedArticles
        });
        revalidatePath('/[lang]/articles', 'page');
        revalidatePath(`/[lang]/articles/${slug}`, 'page');
        return { success: true };
      }
    }
    return { success: false, error: "Članak nije pronađen." };
  } catch (error: any) {
    console.error('Error deleting article:', error);
    return { success: false, error: `Greška na serveru: ${error.message}` };
  }
}


// +--------------------------------+
// |   USER MANAGEMENT              |
// +--------------------------------+
export async function searchUsers(searchTerm: string): Promise<{ users?: UserProfile[], error?: string }> {
    if (!searchTerm) {
        return { users: [] };
    }
    try {
        const usersRef = collection(db, 'users');
        
        const nameQuery = query(usersRef, 
            orderBy('displayName'), 
            startAt(searchTerm), 
            endAt(searchTerm + '\uf8ff')
        );
        const emailQuery = query(usersRef, 
            orderBy('email'), 
            startAt(searchTerm), 
            endAt(searchTerm + '\uf8ff')
        );

        const [nameSnapshot, emailSnapshot] = await Promise.all([getDocs(nameQuery), getDocs(emailQuery)]);
        
        const usersMap = new Map<string, UserProfile>();

        const processDoc = (doc: any) => {
            const data = doc.data() as UserProfile;
            const profile: UserProfile = {
                ...data,
                createdAt: (data.createdAt as Timestamp)?.toDate ? (data.createdAt as Timestamp).toDate().toISOString() : 'N/A',
                lastPeriodDate: (data.lastPeriodDate as Timestamp)?.toDate ? (data.lastPeriodDate as Timestamp).toDate().toISOString() : null,
            };
            usersMap.set(doc.id, profile);
        };
        
        nameSnapshot.forEach(processDoc);
        emailSnapshot.forEach(processDoc);

        return { users: Array.from(usersMap.values()) };

    } catch (error: any) {
        console.error('Error searching users:', error);
        return { error: `Greška na serveru: ${error.message}` };
    }
}

export async function verifyUser(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const userDocRef = doc(db, 'users', userId);
    
    const batch = writeBatch(db);
    
    batch.update(userDocRef, {
      role: 'verified',
      verificationRequested: false, // Reset this flag
      unreadNotifications: increment(1),
    });

    const userNotificationsRef = collection(userDocRef, 'notifications');
    const newNotifRef = doc(userNotificationsRef);
    const notification: Omit<Notification, 'id'> = {
      userId: userId,
      type: 'welcome', // Consider a 'verified' type
      text: 'Vaš nalog je uspešno verifikovan! Otključali ste sve funkcije portala.',
      link: '/my-profile',
      createdAt: new Date().toISOString(),
      read: false,
    };
    batch.set(newNotifRef, notification);

    await batch.commit();

    return { success: true };
  } catch (error: any) {
    console.error('Error verifying user:', error);
    return { success: false, error: `Greška na serveru: ${error.message}` };
  }
}


export async function requestVerification(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      return { success: false, error: 'Korisnik nije pronađen.' };
    }
    const userProfile = userDocSnap.data() as UserProfile;

    const adminUsersRef = collection(db, 'users');
    const adminQuery = query(adminUsersRef, where('role', '==', 'admin'), where('email', '==', 'ginekologijapalmoticeva@gmail.com'));
    const adminSnapshot = await getDocs(adminQuery);

    if (adminSnapshot.empty) {
      return { success: false, error: 'Administrator nije pronađen.' };
    }
    const adminId = adminSnapshot.docs[0].id;
    const adminDocRef = doc(adminUsersRef, adminId);
    
    const batch = writeBatch(db);

    const adminNotificationsRef = collection(adminDocRef, 'notifications');
    const newNotifRef = doc(adminNotificationsRef);
    const notificationText = `Novi zahtev za verifikaciju od: ${userProfile.displayName || userProfile.email}. Email: ${userProfile.email}, Telefon: ${userProfile.phone || 'N/A'}`;
    
    batch.set(newNotifRef, {
      userId: adminId,
      type: 'new_result',
      text: notificationText,
      link: `/admin/users/${userId}`,
      createdAt: new Date().toISOString(),
      read: false,
    });
    
    batch.update(adminDocRef, {
      unreadNotifications: increment(1),
    });

    batch.update(userDocRef, { verificationRequested: true });

    await batch.commit();

    return { success: true };
  } catch (error: any) {
    console.error('Error requesting verification:', error);
    return { success: false, error: `Greška na serveru: ${error.message}` };
  }
}


export async function deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
        const batch = writeBatch(db);

        const collectionsToDelete = ['cycleData', 'dailyEvents', 'notifications'];
        for (const subcollection of collectionsToDelete) {
            const subcollectionRef = collection(db, 'users', userId, subcollection);
            const snapshot = await getDocs(subcollectionRef);
            snapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });
        }

        const userDocRef = doc(db, 'users', userId);
        batch.delete(userDocRef);

        await batch.commit();
        
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting user and their data:', error);
        return { success: false, error: `Greška na serveru: ${error.message}` };
    }
}


// +--------------------------------+
// |   CSV REPORT GENERATORS        |
// +--------------------------------+

interface ReportInput {
  startDate: Date;
  endDate: Date;
}

interface ReportOutput {
  csvData?: string;
  error?: string;
}

const escapeCsvField = (field: any): string => {
  if (field === null || field === undefined) {
    return '';
  }
  const stringField = String(field);
  if (/[",\n\r]/.test(stringField)) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  return stringField;
};

const getUserDisplayName = async (userId: string): Promise<string> => {
    if (userId === 'anonymous') {
        return 'Anonymous';
    }
    try {
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
            const profile = userDocSnap.data() as UserProfile;
            return profile.displayName || userId;
        }
        return userId;
    } catch (error) {
        console.error(`Error fetching user profile for ${userId}:`, error);
        return userId;
    }
}

export async function generateAiConversationsReport(input: ReportInput): Promise<ReportOutput> {
  try {
    const { startDate, endDate } = input;
    const startTimestamp = Timestamp.fromDate(new Date(startDate));
    const endOfDayEndDate = new Date(endDate);
    endOfDayEndDate.setHours(23, 59, 59, 999);
    const endTimestamp = Timestamp.fromDate(endOfDayEndDate);

    const conversationsRef = collection(db, 'ai_conversations');
    const q = query(conversationsRef,
      where('createdAt', '>=', startTimestamp),
      where('createdAt', '<=', endTimestamp)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { csvData: "No data for selected period." };
    }

    const headers = [
      'Conversation ID', 'User ID', 'User Name', 'Language', 
      'User Question', 'Model Answer', 'Follow-Up Questions', 'Timestamp',
    ];

    const dataRows = await Promise.all(querySnapshot.docs.map(async (d) => {
        const data = d.data();
        const userName = await getUserDisplayName(data.userId);
        const createdAt = (data.createdAt as Timestamp)?.toDate ? (data.createdAt as Timestamp).toDate().toISOString() : 'Invalid Date';
        const followUp = Array.isArray(data.followUpQuestions) ? data.followUpQuestions.join('; ') : '';
        
        return [
            escapeCsvField(data.conversationId), escapeCsvField(data.userId), escapeCsvField(userName),
            escapeCsvField(data.language), escapeCsvField(data.userQuestion), escapeCsvField(data.modelAnswer),
            escapeCsvField(followUp), escapeCsvField(createdAt),
        ];
    }));

    const csvContent = [headers.join(','), ...dataRows.map(row => row.join(','))].join('\n');
    return { csvData: csvContent };

  } catch (error: any) {
    console.error('Error generating AI conversations report:', error);
    return { error: `Greška na serveru: ${error.message}` };
  }
}


export async function generateUsersReport(input: ReportInput): Promise<ReportOutput> {
  try {
    const { startDate, endDate } = input;
    const startTimestamp = Timestamp.fromDate(new Date(startDate));
    const endOfDayEndDate = new Date(endDate);
    endOfDayEndDate.setHours(23, 59, 59, 999);
    const endTimestamp = Timestamp.fromDate(endOfDayEndDate);

    const usersRef = collection(db, 'users');
    const q = query(usersRef,
      where('createdAt', '>=', startTimestamp),
      where('createdAt', '<=', endTimestamp)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { csvData: "No users found for selected period." };
    }

    const headers = ['UID', 'Display Name', 'Email', 'Role', 'Created At'];

    const dataRows = querySnapshot.docs.map((doc) => {
      const data = doc.data() as UserProfile;
      const createdAt = (data.createdAt as Timestamp)?.toDate ? (data.createdAt as Timestamp).toDate().toISOString() : 'Invalid Date';
      
      return [
        escapeCsvField(data.uid),
        escapeCsvField(data.displayName),
        escapeCsvField(data.email),
        escapeCsvField(data.role),
        escapeCsvField(createdAt),
      ];
    });

    const csvContent = [headers.join(','), ...dataRows.map(row => row.join(','))].join('\n');
    return { csvData: csvContent };

  } catch (error: any)    {
    console.error('Error generating users report:', error);
    return { error: `Greška na serveru: ${error.message}` };
  }
}


// +--------------------------------+
// |   UNANSWERED QUESTIONS FETCHER |
// +--------------------------------+

export type UnansweredQuestion = {
    id: string;
    userQuestion: string;
    modelAnswer: string;
    userId: string;
    createdAt: string;
    language: LanguageCode;
    userName: string;
};

const UNANSWERED_KEYWORDS = [
    "nemam tu informaciju", "nisam uspeo", "nisam uspela", "nemam pristup",
    "nemam informaciju", "do not have that information", "cannot provide medical advice",
    "ne mogu da pružim medicinski savet", "pozovite kliniku", "call our clinic",
    "žao mi je, nemam", "i do not have access"
];

export async function getUnansweredQuestions(): Promise<{ questions: UnansweredQuestion[], error?: string }> {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const thirtyDaysAgoTimestamp = Timestamp.fromDate(thirtyDaysAgo);

        const conversationsRef = collection(db, 'ai_conversations');
        const q = query(conversationsRef,
            where('createdAt', '>=', thirtyDaysAgoTimestamp),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);

        const allConversations = await Promise.all(
            querySnapshot.docs.map(async (d) => {
                const data = d.data();
                const userName = await getUserDisplayName(data.userId || 'anonymous');
                return {
                    id: d.id,
                    userQuestion: data.userQuestion || '',
                    modelAnswer: data.modelAnswer || '',
                    userId: data.userId || 'anonymous',
                    createdAt: (data.createdAt as Timestamp)?.toDate ? (data.createdAt as Timestamp).toDate().toISOString() : new Date().toISOString(),
                    language: data.language || 'en',
                    userName: userName,
                };
            })
        );
        
        const filteredQuestions = allConversations.filter(convo => {
            const answer = convo.modelAnswer.toLowerCase();
            return UNANSWERED_KEYWORDS.some(keyword => answer.includes(keyword));
        });
        
        return { questions: filteredQuestions };

    } catch (error: any) {
        console.error('Error fetching unanswered questions:', error);
        return { questions: [], error: `Server Error: ${error.message}` };
    }
}


// +--------------------------------+
// |   ANALYTICS DASHBOARD FETCHER  |
// +--------------------------------+

export type AnalyticsData = {
    totalUsers: number;
    newUsers: number;
    activeUsers: number;
    totalAiConversations: number;
    totalCycles: number;
    totalEvents: number;
};

export type AnalyticsResult =
  | { data: AnalyticsData; error?: undefined }
  | { data?: undefined; error: string };

export async function getAnalyticsDashboardData(): Promise<AnalyticsResult> {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const thirtyDaysAgoTimestamp = Timestamp.fromDate(thirtyDaysAgo);

        const usersSnapshot = await getDocs(collection(db, 'users'));
        const totalUsers = usersSnapshot.size;

        const newUsersQuery = query(collection(db, 'users'), where('createdAt', '>=', thirtyDaysAgoTimestamp));
        const newUsersSnapshot = await getDocs(newUsersQuery);
        const newUsers = newUsersSnapshot.size;

        const aiConversationsRef = collection(db, 'ai_conversations');
        const activeUsersQuery = query(aiConversationsRef, where('createdAt', '>=', thirtyDaysAgoTimestamp));
        const activeUsersSnapshot = await getDocs(activeUsersQuery);
        const activeUserIds = new Set(activeUsersSnapshot.docs.map(d => d.data().userId));
        const activeUsers = activeUserIds.size;
        
        const totalAiConversations = activeUsersSnapshot.size;

        let totalCycles = 0;
        let totalEvents = 0;

        for (const userDoc of usersSnapshot.docs) {
            const cycleDataRef = doc(db, 'users', userDoc.id, 'cycleData', 'main');
            const cycleDataSnap = await getDoc(cycleDataRef);
            if (cycleDataSnap.exists()) {
                totalCycles += cycleDataSnap.data()?.cycles?.length || 0;
            }

            const eventsSnapshot = await getDocs(collection(db, 'users', userDoc.id, 'dailyEvents'));
            totalEvents += eventsSnapshot.size;
        }

        const data: AnalyticsData = {
            totalUsers,
            newUsers,
            activeUsers,
            totalAiConversations,
            totalCycles,
            totalEvents,
        };
        
        return { data };

    } catch (error: any) {
        console.error('Error fetching analytics dashboard data:', error);
        return { error: `Greška na serveru: ${error.message}` };
    }
}

// +--------------------------------+
// |   USER DETAILS FETCHER         |
// +--------------------------------+
export type UserDetails = {
    profile: UserProfile;
    cycles: Cycle[];
    events: DailyEvent[];
}

export async function getUserDetails(uid: string): Promise<{ data?: UserDetails, error?: string }> {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      return { error: 'Korisnik nije pronađen.' };
    }

    const profileData = userDocSnap.data();
    const profile: UserProfile = {
      ...profileData,
      uid: userDocSnap.id,
      createdAt: (profileData.createdAt as Timestamp)?.toDate ? (profileData.createdAt as Timestamp).toDate().toISOString() : 'N/A',
      lastPeriodDate: (profileData.lastPeriodDate as Timestamp)?.toDate ? (profileData.lastPeriodDate as Timestamp).toDate().toISOString() : null,
    } as UserProfile;

    const cycleDataRef = doc(db, 'users', uid, 'cycleData', 'main');
    const cycleDataSnap = await getDoc(cycleDataRef);
    let cycles: Cycle[] = [];
    if (cycleDataSnap.exists()) {
      const cycleData = cycleDataSnap.data();
      cycles = cycleData?.cycles?.map((c: any) => ({
        id: c.id,
        startDate: (c.startDate as Timestamp).toDate(),
        endDate: c.endDate ? (c.endDate as Timestamp).toDate() : null,
        type: c.type || 'regular'
      })) || [];
    }

    const eventsRef = collection(db, 'users', uid, 'dailyEvents');
    const eventsQuery = query(eventsRef, orderBy('date', 'desc'));
    const eventsSnapshot = await getDocs(eventsQuery);
    const events = eventsSnapshot.docs.map(doc => doc.data() as DailyEvent);

    return { data: { profile, cycles, events } };
  } catch (error: any) {
    console.error('Error fetching user details:', error);
    return { error: `Greška na serveru: ${error.message}` };
  }
}

    
