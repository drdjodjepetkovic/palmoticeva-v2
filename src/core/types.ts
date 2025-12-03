import { Timestamp } from 'firebase/firestore';

// --- USER & AUTH ---
export type UserRole = 'user' | 'patient' | 'admin' | 'doctor' | 'verified' | 'authenticated' | 'unauthenticated';
export type VerificationStatus = 'unverified' | 'verified' | 'pending' | 'rejected' | 'none';
export type AppLanguage = 'sr' | 'en' | 'ru';
export type LanguageCode = AppLanguage;

export interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL?: string | null;
    role: UserRole;
    verificationStatus?: VerificationStatus;
    verificationRequested?: boolean;
    phone?: string | null;
    createdAt?: any; // Can be Timestamp or string
    updatedAt?: any;
    lastPeriodDate?: any;

    // Preferences
    preferences?: {
        theme: 'light' | 'dark' | 'system';
        language: AppLanguage;
        notifications: boolean;
    };
    schemaVersion?: number;
    unreadNotifications?: number;

    // Gamification
    stats?: {
        points: number;
        level: number;
        streak: number;
    };
    unlockedBadges?: string[];
}

export interface Notification {
    id: string;
    userId: string;
    type: string;
    text: string;
    link: string;
    createdAt: string;
    read: boolean;
}

// --- CYCLE TRACKING ---

export interface Cycle {
    id: string;
    userId: string;
    startDate: Date;
    endDate?: Date;
    periodLength: number; // Observed or predicted
    cycleLength?: number; // Observed or predicted
    isActive: boolean; // True if current cycle
    type?: 'regular' | 'pregnancy' | 'miscarriage';
    notes?: string;
    symptoms?: string[]; // IDs of symptoms
}

export interface DailyEvent {
    id: string;
    date: string; // ISO YYYY-MM-DD
    // Boolean flags for symptoms/events
    intercourse?: boolean;
    pain?: boolean;
    spotting?: boolean;
    mood?: boolean;
    hotFlashes?: boolean;
    insomnia?: boolean;
    routineCheckup?: boolean;
    problemCheckup?: boolean;
    note?: string;
}

// --- PATIENT PORTAL (Level 2) ---
export interface MedicalResult {
    id: string;
    userId: string;
    title: string;
    date: Timestamp;
    type: 'lab' | 'report' | 'prescription';
    fileUrl: string; // Firebase Storage URL
    doctorName?: string;
}

export interface DoctorMessage {
    id: string;
    userId: string; // Patient ID
    senderId: string; // Doctor/Admin ID
    content: string;
    read: boolean;
    createdAt: Timestamp;
}

// --- CONTENT & I18N ---
export interface LocalizedString {
    sr: string;
    en: string;
    ru: string;
    se?: string; // Kept for legacy compatibility
}

export interface Article {
    id: string;
    slug: string;
    title: LocalizedString;
    excerpt: LocalizedString;
    content: LocalizedString; // Markdown or HTML
    coverImage: string;
    publishedAt: string; // ISO string for static data
    author?: LocalizedString;
    tags?: string[];
    category?: LocalizedString;
}

export interface FAQItem {
    id: string;
    question: LocalizedString;
    answer: LocalizedString;
    category?: LocalizedString;
}

export interface TipItem {
    id: string;
    content: LocalizedString;
    category?: LocalizedString; // 'period', 'fertile', 'pms', 'default', 'fact'
}

export type HomeCard = {
    key: string;
    icon: string;
    title: LocalizedString;
    description: LocalizedString;
    link: string;
    external: boolean;
};

export type GamificationBadge = {
    key: string;
    titleKey: string;
    descKey: string;
    icon: any; // Using any for React.ElementType to avoid import issues for now
    unlocked: boolean;
    colorClass: string;
    progress?: {
        current: number;
        target: number;
        label?: string;
    };
};

export type TeamMember = {
    avatar: string;
    name: LocalizedString;
    specialization: LocalizedString;
    bio: LocalizedString;
};

export type Testimonial = {
    author: string;
    meta: LocalizedString;
    rating: number;
    quote: LocalizedString;
};

export type AboutPageContent = {
    version: number;
    title: LocalizedString;
    story: {
        title: LocalizedString;
        content: LocalizedString;
        imageUrl: string;
    };
    contact: {
        addressTitle: LocalizedString;
        addressLine1: LocalizedString;
        addressLine2: LocalizedString;
        email: LocalizedString;
        phone1: LocalizedString;
        phone2: LocalizedString;
        hoursTitle: LocalizedString;
        weekdays: LocalizedString;
        weekdaysHours: LocalizedString;
        saturday: LocalizedString;
        saturdayHours: LocalizedString;
    };
    team: {
        title: LocalizedString;
        subtitle: LocalizedString;
        members: TeamMember[];
    };
    testimonialsPage: {
        title: LocalizedString;
        averageRating: number;
        basedOn: LocalizedString;
        items: Testimonial[];
    };
    map: {
        title: LocalizedString;
    };
    footer: {
        copyright: LocalizedString;
        address: LocalizedString;
        phones: LocalizedString;
        email: LocalizedString;
    };
    home_cards: HomeCard[];
};
