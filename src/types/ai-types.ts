
export interface HistoryItem {
    role: 'user' | 'model';
    text: string;
}

export interface LoggedEvent {
    date: string;
    type: 'intercourse' | 'pain' | 'spotting' | 'mood' | 'hotFlashes' | 'insomnia' | 'routineCheckup' | 'problemCheckup';
}

export interface PastCycle {
    startDate: string;
    endDate: string;
    periodLength: number;
    cycleLength: number;
}

export interface MenstrualData {
    isPeriod: boolean;
    isFertile: boolean;
    isOvulation: boolean;
    currentCycleDay?: number;
    daysUntilNextPeriod?: number;
    lastPeriodStartDate?: string;
    fertileWindowStartDate?: string;
    fertileWindowEndDate?: string;
    ovulationDate?: string;
    nextPredictedPeriodStartDate?: string;
    avgCycleLength?: number;
    avgPeriodLength?: number;
    pastCycles?: PastCycle[];
    loggedEvents?: LoggedEvent[];
    error?: string;
}

export interface ConversationalAgentInput {
    conversationId: string;
    history: HistoryItem[];
    question: string;
    language: 'en' | 'ru' | 'se' | 'se-lat';
    isLoggedIn: boolean;
    userId?: string;
    userProfile?: {
        displayName: string | null;
        age?: number;
    };
    menstrualData?: MenstrualData;
}

export interface ConversationalAgentOutput {
    answer: string;
    followUpQuestions?: string[];
    navigation?: string;
    appointmentData?: {
        date?: string;
        timeSlot?: string;
        message?: string;
    };
    recommendations?: {
        title: string;
        slug: string;
        reason: string;
    }[];
    action?: {
        type: 'LOG_PERIOD';
        date: string;
    } | {
        type: 'PREFILL_BOOKING';
        date?: string;
        timeSlot?: string;
        message?: string;
    };
}
