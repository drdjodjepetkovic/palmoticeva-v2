
export type UserRole = 'unauthenticated' | 'authenticated' | 'verified' | 'admin';
export type LanguageCode = 'en' | 'se' | 'ru' | 'se-lat';
export type TrackingMode = 'cycling' | 'menopause' | 'pregnancy';

export interface ReminderSettings {
  nextPeriod: {
    enabled: boolean;
    daysBefore: number;
  };
  fertileWindow: {
    enabled: boolean;
    daysBefore: number;
  };
  ovulation: {
    enabled: boolean;
    daysBefore: number;
  };
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phone?: string | null;
  role: UserRole;
  createdAt: any; 
  hasCompletedOnboarding?: boolean;
  preferredTheme?: string;
  preferredLanguage?: LanguageCode;
  trackingMode?: TrackingMode;
  lastPeriodDate?: any;
  fcmToken?: string | null;
  unreadNotifications?: number;
  reminderSettings?: ReminderSettings;
  verificationRequested?: boolean;
  unlockedBadges?: string[];
}

export type Cycle = {
  id: string;
  startDate: Date;
  endDate: Date | null;
  type: 'regular' | 'irregular';
};

export type DailyEvent = {
  id: string;
  date: string; // YYYY-MM-DD
  intercourse?: boolean;
  pain?: boolean;
  spotting?: boolean;
  mood?: boolean;
  hotFlashes?: boolean;
  insomnia?: boolean;
  routineCheckup?: boolean;
  problemCheckup?: boolean;
};

export type NotificationType = 'new_result' | 'cycle_late' | 'welcome' | 'appointment_reminder';

export type Notification = {
    id: string;
    userId: string;
    type: NotificationType;
    text: string;
    link: string;
    createdAt: string; // ISO string
    read: boolean;
};
