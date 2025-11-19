"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { DailyEvent } from '@/types/user';
import { dbAdmin } from '@/lib/firebase/admin'; 

// NUCLEAR FIX: Hardcoded API Key because Secret Manager is unreliable in this environment
const API_KEY = "AIzaSyDIjcQPkzSIrpxqeegRAmV_Ev60WQR1JGc";

let genAI: GoogleGenerativeAI | null = null;
if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
} else {
    console.warn("Gemini API ključ nije pronađen. AI funkcije će biti onemogućene.");
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
    const text = response.text();
    
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonString = text.substring(jsonStart, jsonEnd + 1);
        try {
            const parsedResult = JSON.parse(jsonString);
            return parsedResult.insights as Insight[];
        } catch (e) {
            console.error("Failed to parse insights JSON:", e);
        }
    }
    return [];
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

// --- CHAT & RAG FUNCTIONALITY ---

interface ChatContext {
    question: string;
    language: string;
}

async function fetchRelevantContext(question: string, language: string): Promise<string> {
    const keywords = question.toLowerCase().split(' ').filter(w => w.length > 3);
    let context = "";

    try {
        const servicesSnapshot = await dbAdmin.collection('services').get();
        const relevantServices: any[] = [];
        
        servicesSnapshot.forEach(doc => {
            const data = doc.data();
            const name = (data.name?.[language as keyof typeof data.name] || data.name?.['se-lat'] || data.name?.['en'] || '').toLowerCase();
            if (keywords.some(k => name.includes(k))) {
                relevantServices.push(data);
            }
        });

        if (relevantServices.length > 0) {
            context += "CENOVNIK USLUGA (PRICELIST):\n";
            relevantServices.forEach(s => {
                const name = s.name?.[language as keyof typeof s.name] || s.name?.['se-lat'];
                const desc = s.description?.[language as keyof typeof s.description] || s.description?.['se-lat'] || '';
                context += `- Service: ${name}, Price: ${s.price}. Description: ${desc}\n`;
            });
            context += "\n";
        }

        const kbSnapshot = await dbAdmin.collection('knowledge_base').get();
        const relevantKB: any[] = [];

        kbSnapshot.forEach(doc => {
            const data = doc.data();
            const q = (data.question || '').toLowerCase();
            const tags = (data.tags || []).map((t: string) => t.toLowerCase());
            
            if (keywords.some(k => q.includes(k) || tags.includes(k))) {
                relevantKB.push(data);
            }
        });

        if (relevantKB.length > 0) {
            context += "BAZA ZNANJA (FAQ):\n";
            relevantKB.forEach(item => {
                context += `- Q: ${item.question}\n  A: ${item.answer}\n`;
            });
             context += "\n";
        }

        const articlesSnapshot = await dbAdmin.collection('articles').get();
        const relevantArticles: any[] = [];
        
        articlesSnapshot.forEach(doc => {
            const data = doc.data();
            const title = (data.title?.[language as keyof typeof data.title] || data.title?.['se-lat'] || '').toLowerCase();
             if (keywords.some(k => title.includes(k))) {
                relevantArticles.push(data);
            }
        });

         if (relevantArticles.length > 0) {
            context += "BLOG ČLANCI (ARTICLES):\n";
            relevantArticles.forEach(a => {
                const title = a.title?.[language as keyof typeof a.title] || a.title?.['se-lat'];
                const summary = a.summary?.[language as keyof typeof a.summary] || a.summary?.['se-lat'];
                const slug = a.slug;
                context += `- Title: ${title} (Link: /articles/${slug})\n  Summary: ${summary}\n`;
            });
        }

    } catch (error: any) {
        console.error("Error fetching context from Firebase Admin:", error);
        // Return empty context on error instead of crashing
        return "";
    }

    return context;
}

export interface ChatResponse {
    answer: string;
    followUpQuestions?: string[];
    navigation?: string;
}

export const generateChatResponse = async (
    question: string, 
    language: string = 'se-lat',
    menstrualData?: any
): Promise<ChatResponse> => {
    if (!genAI) return { answer: "AI servis trenutno nije dostupan (API Key missing)." };

    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash", 
        generationConfig: { responseMimeType: "application/json" }
    });
    
    const dbContext = await fetchRelevantContext(question, language);

    const menstrualContext = menstrualData 
        ? `PODACI O CIKLUSU KORISNICE:\n${JSON.stringify(menstrualData, null, 2)}\nKoristi ove podatke ako pitanje ima veze sa ciklusom, plodnim danima ili trudnoćom.` 
        : "";

    const systemPrompt = `
        You are the AI Assistant for "Ginekološka ordinacija Palmotićeva" (Dr. Đorđe Petković).
        
        YOUR TASK:
        1. Answer the user's question based ONLY on the AVAILABLE CONTEXT (Pricelist, FAQ, Articles).
        2. If the question is about cycle health, use "PODACI O CIKLUSU KORISNICE".
        3. Be polite, professional, and concise.
        4. If scheduling is mentioned, offer navigation to "/appointments".
        5. LANGUAGE: Respond in the same language as the user's question (or default to ${language}).
        
        IMPORTANT:
        - If information is missing in context, say you don't know and refer to phone 011 322 60 40.
        - DO NOT MAKE UP PRICES.
        
        AVAILABLE CONTEXT:
        ------------------------------------------------
        ${dbContext || "No specific data found in database for this query."}
        ------------------------------------------------
        ${menstrualContext}
        ------------------------------------------------
        General Info: Palmotićeva 33, Belgrade. 08-20h (Sat 09-14h).

        OUTPUT FORMAT (JSON):
        {
            "answer": "Your text response here...",
            "followUpQuestions": ["Question 1?", "Question 2?"],
            "navigation": "/optional-path-or-null"
        }
        
        User Question: ${question}
    `;

    try {
        const result = await model.generateContent(systemPrompt);
        const responseText = result.response.text();
        
        let cleanJson = responseText;
        const jsonStart = responseText.indexOf('{');
        const jsonEnd = responseText.lastIndexOf('}');
        
        if (jsonStart !== -1 && jsonEnd !== -1) {
            cleanJson = responseText.substring(jsonStart, jsonEnd + 1);
        }

        try {
            return JSON.parse(cleanJson) as ChatResponse;
        } catch (jsonError: any) {
            console.error("JSON Parse Error:", jsonError, "Response:", responseText);
            return {
                answer: responseText.replace(/```json/g, '').replace(/```/g, '') + ` (JSON Error: ${jsonError.message})`,
                followUpQuestions: []
            };
        }

    } catch (e: any) {
        console.error("Chat generation error:", e);
        return { 
            answer: `SYSTEM ERROR: ${e.message}. Please screenshot this and send to developer.`,
            followUpQuestions: []
        };
    }
}

export const generateArticleSummary = async (
    content: string,
    title: string
): Promise<{ summary: string, tags: string[] }> => {
    if (!genAI) return { summary: "Summary generation unavailable.", tags: [] };

    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
        Analyze the following medical article content.
        
        Task:
        1. Generate a short, engaging summary (max 2 sentences) suitable for a card preview.
        2. Extract 3-5 relevant tags/keywords.
        
        Article Title: ${title}
        Content: ${content.substring(0, 3000)}...
        
        Output Format (JSON):
        {
            "summary": "...",
            "tags": ["tag1", "tag2"]
        }
    `;

    try {
        const result = await model.generateContent(prompt);
        const cleanJson = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanJson) as { summary: string, tags: string[] };
    } catch (error) {
        console.error("Error generating summary:", error);
        return { summary: content.substring(0, 150) + "...", tags: [] };
    }
}
