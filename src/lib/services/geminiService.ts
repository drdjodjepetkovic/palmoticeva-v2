
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { DailyEvent } from '@/types/user';

// Čitamo API ključ direktno iz process.env
// Next.js će automatski ubaciti vrednost iz .env.local fajla ovde
const API_KEY = process.env.GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;
if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
} else {
    console.warn("Gemini API ključ nije pronađen u .env.local. AI funkcije će biti onemogućene.");
}

export interface Insight {
  title: string;
  explanation: string;
  suggestion: string;
}

interface CycleInsightsData {
    avgCycleLength: number;
    avgPeriodLength: number;
    dailyEvents: Record<string, DailyEvent>;
    language: string;
}

export const generateCycleInsightsService = async (
  data: CycleInsightsData
): Promise<Insight[]> => {
  if (!genAI) {
    return [
      {
        title: "AI Asistent nije dostupan",
        explanation: "Google Gemini API ključ nije podešen na serveru.",
        suggestion: "Molimo kontaktirajte administratora sistema da bi se ova funkcija omogućila."
      }
    ];
  }

  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
  });

  const dataSummary = `
    Prosečna dužina ciklusa: ${data.avgCycleLength} dana.
    Prosečna dužina menstruacije: ${data.avgPeriodLength} dana.
    Zabeleženi simptomi (poslednjih 90 dana):
    ${Object.values(data.dailyEvents)
      .slice(-90)
      .map((log) => {
          const date = log.date;
          const symptoms = Object.keys(log).filter(key => key !== 'date' && key !== 'id' && (log as any)[key]);
          if (symptoms.length > 0) {
            return `- ${date}: Simptomi: ${symptoms.join(', ')}`;
          }
          return null;
      })
      .filter(Boolean)
      .join('\\n') || 'Nema zabeleženih simptoma.'}
  `;

  const prompt = `
    Ti si empatični AI asistent za žensko zdravlje. Tvoj zadatak je da analiziraš podatke o menstrualnom ciklusu.
    Na osnovu podataka, identifikuj 2 do 3 ključna obrasca ili zapažanja.
    Za svaki obrazac, pruži kratko objašnjenje i jedan praktičan, podržavajući savet za dobrobit korisnice.
    Strogo je zabranjeno davati medicinske savete. Fokusiraj se na životni stil, ishranu, vežbanje i tehnike opuštanja.
    Odgovori moraju biti isključivo u JSON formatu, na ${data.language} jeziku, i moraju pratiti zadatu šemu.

    Podaci za analizu:
    ${dataSummary}

    JSON Šema koju moraš pratiti:
    {
        "insights": [
            {
                "title": "string (naslov)",
                "explanation": "string (objašnjenje)",
                "suggestion": "string (savet)"
            }
        ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const jsonString = response.text ? response.text() : '{}'; 
    const parsedResult = JSON.parse(jsonString);
    return parsedResult.insights as Insight[];
  } catch (error) {
    console.error("Greška prilikom generisanja uvida (Gemini):", error);
    return [
        {
            title: "Greška pri analizi",
            explanation: "Došlo je do greške prilikom komunikacije sa AI modelom. Molimo pokušajte ponovo kasnije.",
            suggestion: "U međuvremenu, nastavite da redovno unosite svoje podatke kako bi buduće analize bile što preciznije."
        }
    ];
  }
};
