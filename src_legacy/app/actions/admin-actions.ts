'use server';

import { dbAdmin } from '@/lib/firebase/admin';

export interface AiLog {
    id: string;
    timestamp: Date | null;
    question: string;
    answer: string;
    action?: any;
    language: string;
    model?: string;
}

export async function getAiLogs(limitCount: number = 50): Promise<AiLog[]> {
    try {
        const snapshot = await dbAdmin.collection('ai_logs')
            .orderBy('timestamp', 'desc')
            .limit(limitCount)
            .get();

        const logs: AiLog[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                timestamp: data.timestamp ? data.timestamp.toDate() : null,
                question: data.question || '',
                answer: data.answer || '',
                action: data.action || null,
                language: data.language || 'unknown',
                model: data.model
            };
        });

        return logs;
    } catch (error) {
        console.error('Error fetching AI logs:', error);
        return [];
    }
}
