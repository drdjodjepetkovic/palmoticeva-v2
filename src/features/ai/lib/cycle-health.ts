import { Cycle, DailyEvent } from '@/core/types';
import { differenceInDays } from 'date-fns';

export interface CycleHealthReport {
    averageCycleLength: number;
    averagePeriodLength: number;
    regularity: 'Regular' | 'Irregular' | 'Unknown';
    commonSymptoms: string[];
    textSummary: string;
}

export function analyzeCycleHealth(cycles: Cycle[], events: DailyEvent[]): CycleHealthReport {
    if (!cycles || cycles.length === 0) {
        return {
            averageCycleLength: 0,
            averagePeriodLength: 0,
            regularity: 'Unknown',
            commonSymptoms: [],
            textSummary: 'Nema dovoljno podataka za analizu ciklusa.'
        };
    }

    // 1. Calculate Average Cycle Length
    const sortedCycles = [...cycles].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    const cycleLengths: number[] = [];

    for (let i = 0; i < sortedCycles.length - 1; i++) {
        const currentStart = new Date(sortedCycles[i].startDate);
        const nextStart = new Date(sortedCycles[i + 1].startDate);
        const length = differenceInDays(nextStart, currentStart);
        if (length > 15 && length < 100) {
            cycleLengths.push(length);
        }
    }

    const averageCycleLength = cycleLengths.length > 0
        ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
        : 0;

    // 2. Calculate Average Period Length (Bleeding duration)
    const periodLengths: number[] = [];
    sortedCycles.forEach(cycle => {
        if (cycle.endDate) {
            const start = new Date(cycle.startDate);
            const end = new Date(cycle.endDate);
            const length = differenceInDays(end, start) + 1; // inclusive
            if (length > 0 && length < 15) {
                periodLengths.push(length);
            }
        }
    });

    const averagePeriodLength = periodLengths.length > 0
        ? Math.round(periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length)
        : 0;

    // 3. Determine Regularity
    let regularity: 'Regular' | 'Irregular' | 'Unknown' = 'Unknown';
    if (cycleLengths.length >= 2) {
        const minLen = Math.min(...cycleLengths);
        const maxLen = Math.max(...cycleLengths);
        if (maxLen - minLen <= 4) {
            regularity = 'Regular';
        } else {
            regularity = 'Irregular';
        }
    }

    // 4. Analyze Symptoms
    const symptomCounts: Record<string, number> = {};
    events.forEach(event => {
        if (event.pain) symptomCounts['Bolovi'] = (symptomCounts['Bolovi'] || 0) + 1;
        if (event.mood) symptomCounts['Promene raspoloženja'] = (symptomCounts['Promene raspoloženja'] || 0) + 1;
        if (event.spotting) symptomCounts['Tačkasto krvarenje'] = (symptomCounts['Tačkasto krvarenje'] || 0) + 1;
        if (event.hotFlashes) symptomCounts['Valunzi'] = (symptomCounts['Valunzi'] || 0) + 1;
        if (event.insomnia) symptomCounts['Nesanica'] = (symptomCounts['Nesanica'] || 0) + 1;
    });

    // Get top 3 symptoms
    const commonSymptoms = Object.entries(symptomCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([name]) => name);

    // 5. Generate Text Summary
    let textSummary = `**IZVEŠTAJ O CIKLUSIMA:**\n`;
    textSummary += `- Ukupan broj zabeleženih ciklusa: ${cycles.length}\n`;

    if (averageCycleLength > 0) {
        textSummary += `- Prosečna dužina ciklusa: ${averageCycleLength} dana (${regularity === 'Regular' ? 'Redovni' : 'Neredovni'})\n`;
    } else {
        textSummary += `- Prosečna dužina ciklusa: Nema dovoljno podataka (potrebna bar 2 ciklusa)\n`;
    }

    if (averagePeriodLength > 0) {
        textSummary += `- Prosečno trajanje menstruacije: ${averagePeriodLength} dana\n`;
    }

    if (commonSymptoms.length > 0) {
        textSummary += `- Najčešći simptomi: ${commonSymptoms.join(', ')}\n`;
    } else {
        textSummary += `- Nema zabeleženih simptoma.\n`;
    }

    // Add warnings
    if (averageCycleLength > 0 && (averageCycleLength < 21 || averageCycleLength > 35)) {
        textSummary += `\n⚠️ **NAPOMENA:** Vaši ciklusi su ${averageCycleLength < 21 ? 'kraći' : 'duži'} od proseka (21-35 dana). Preporučuje se konsultacija sa ginekologom.\n`;
    }
    if (averagePeriodLength > 7) {
        textSummary += `\n⚠️ **NAPOMENA:** Vaše menstruacije traju duže od 7 dana, što može ukazivati na obilnija krvarenja.\n`;
    }

    return {
        averageCycleLength,
        averagePeriodLength,
        regularity,
        commonSymptoms,
        textSummary
    };
}
