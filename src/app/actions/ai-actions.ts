'use server';

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import type { ConversationalAgentInput, ConversationalAgentOutput } from '@/types/ai-types';
import { getAgentContextData } from '@/lib/data/agent-data';

// Renamed function to force fresh execution and avoid caching issues
export async function runConversationalAgentV2(input: ConversationalAgentInput): Promise<ConversationalAgentOutput> {
    console.log('runConversationalAgentV2 STARTED');
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error('GEMINI_API_KEY is not configured');
            throw new Error('GEMINI_API_KEY is not configured');
        }

        if (!input.question) {
            throw new Error('User question is missing');
        }

        // Get context data
        const {
            pricelistDataForAgent,
            promotionsDataForAgent,
            faqDataForAgent,
            teamDataForAgent,
            articlesDataForAgent
        } = await getAgentContextData(input.language);

        console.log('Agent context retrieved successfully');

        // Get current date for the AI in Belgrade Timezone
        const now = new Date();
        const belgradeDateStr = now.toLocaleDateString('en-CA', { timeZone: 'Europe/Belgrade' }); // YYYY-MM-DD
        const [year, month, day] = belgradeDateStr.split('-').map(Number);

        const todayISO = belgradeDateStr;
        const todaySerbian = `${day}.${month}.${year}.`;

        // Build system instruction
        const systemInstructionText = `You are a friendly and helpful AI assistant for a gynecological clinic in Belgrade, Serbia. You are NOT a doctor.

**CURRENT DATE (Belgrade):** ${todaySerbian} (YYYY-MM-DD: ${todayISO})

**LANGUAGE RULE:** You MUST answer in ${input.language === 'se' ? 'Serbian Cyrillic' : input.language === 'se-lat' ? 'Serbian Latin' : input.language === 'en' ? 'English' : 'Russian'}.

**CRITICAL RULES:**
1. NEVER provide medical advice. If asked, say you cannot give medical advice and recommend booking an appointment.
2. Answer ONLY based on the information below. If info is not available, say so and suggest calling the clinic.
3. When recommending booking, use this link: [zakažite termin](/appointments)
4. **DATE FORMAT:** When mentioning dates in your text answer, ALWAYS use the format **DD.MM.YYYY.** (e.g., 23.11.2025.). Do NOT use YYYY-MM-DD in the text answer.

**CLINIC INFO:**
- Working Hours: Mon-Fri 08:00-20:00, Sat 08:00-15:00
- Location: Palmotićeva 33, Belgrade, Serbia
- Phone: 011 322 60 40, 011 322 69 45

**PRICELIST:**
${pricelistDataForAgent}

**PROMOTIONS:**
${promotionsDataForAgent}

**FAQ:**
${faqDataForAgent}

**TEAM:**
${teamDataForAgent}

**ARTICLES:**
${articlesDataForAgent}

${input.menstrualData && !input.menstrualData.error ? `**USER'S MENSTRUAL DATA:**
${JSON.stringify(input.menstrualData, null, 2)}

Use this data to answer personal cycle questions like "When is my ovulation?" or "Am I fertile?"` : ''}

**YOUR TASK:**
Answer the user's question below. After your answer, suggest 2-3 follow-up questions they might have (that you can answer from the context).

**SPECIAL ACTION - LOGGING PERIOD:**
If the user explicitly says their period started (e.g., "Danas mi je počela menstruacija", "Got my period today", "Period started yesterday"), you MUST include an "action" field in your JSON response.
- Set "type" to "LOG_PERIOD".
- Set "date" to the specific date mentioned (YYYY-MM-DD). If they say "today", use the **CURRENT DATE** provided above.
- In your "answer", confirm that you are logging it (e.g., "U redu, beležim početak menstruacije za danas, 23.11.2025.").

**SPECIAL ACTION - BOOKING APPOINTMENT:**
If the user expresses intent to book an appointment (e.g., "Zakaži mi pregled", "Book an appointment", "I want to see a doctor"), you MUST include an "action" field in your JSON response.
- Set "type" to "PREFILL_BOOKING".
- Extract the following fields if available (or leave undefined):
    - "date": YYYY-MM-DD (Calculate based on "next Friday", "tomorrow", etc. relative to CURRENT DATE).
    - "timeSlot": "morning" (08-12), "midday" (12-16), or "afternoon" (16-20).
    - "message": A brief summary of their reason (e.g., "Bol u stomaku", "Redovna kontrola").
- In your "answer", say something like: "U redu, prebacujem vas na stranicu za zakazivanje sa popunjenim podacima."

**RECOMMENDATIONS:**
If the user's question is related to one of the articles in the **ARTICLES** section, you MUST include a "recommendations" field in your JSON response.
  "action": { "type": "LOG_PERIOD", "date": "YYYY-MM-DD" } OR { "type": "PREFILL_BOOKING", "date": "YYYY-MM-DD", "timeSlot": "morning", "message": "..." }
}
`;

        const genAI = new GoogleGenerativeAI(apiKey);

        const model = genAI.getGenerativeModel({
            model: 'gemini-flash-latest',
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1000,
            },
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
            ],
        });

        // Build the user message by combining system instruction and the question
        const userMessage = `${systemInstructionText}\n\nUser's question: ${input.question}`;

        console.log('Calling Gemini API...');

        // Generate response
        const result = await model.generateContent(userMessage);

        const response = result.response;

        // Check if we have a valid response
        if (!response.candidates || response.candidates.length === 0) {
            throw new Error('No candidates returned from Gemini');
        }

        const candidate = response.candidates[0];

        console.log('Gemini finished with reason:', candidate.finishReason);

        if (candidate.finishReason !== 'STOP') {
            if (candidate.finishReason === 'SAFETY') {
                throw new Error(`Blocked by safety filters. Ratings: ${JSON.stringify(candidate.safetyRatings)}`);
            }
        }

        let text = '';
        try {
            text = response.text();
        } catch (e: any) {
            throw new Error(`Failed to get text from response. Finish reason: ${candidate.finishReason}. Error: ${e.message}`);
        }

        console.log('Gemini API response received:', text.substring(0, 200));

        // Try to parse JSON response
        let parsedResponse: ConversationalAgentOutput;

        try {
            // More robust JSON extraction: find the first '{' and the last '}'
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                let jsonString = jsonMatch[0];
                // Remove trailing commas before closing braces/brackets (common AI error)
                jsonString = jsonString.replace(/,(\s*[}\]])/g, '$1');
                // Remove comments (// ...)
                jsonString = jsonString.replace(/\/\/.*$/gm, '');

                // Attempt to fix unescaped newlines in string values
                // This is risky but necessary if AI ignores instructions
                // We look for newlines that are NOT followed by a quote or whitespace+quote (likely end of string)
                // and NOT preceded by a quote (likely start of string)
                // Actually, a safer way is to rely on the prompt, but let's try to parse.

                try {
                    parsedResponse = JSON.parse(jsonString);
                } catch (parseError) {
                    console.warn('JSON parse failed, attempting to sanitize newlines:', parseError);
                    // Replace actual newlines with \n inside the string
                    // This is a naive approach: replace all \n with \\n, then fix the structure? No.
                    // Let's try to just use the fallback if strict parse fails.
                    throw parseError;
                }
            } else {
                throw new Error('No JSON object found in response');
            }

            // SERVER-SIDE ACTION HANDLING
            if (parsedResponse.action && parsedResponse.action.type === 'LOG_PERIOD' && input.userId) {
                console.log('Executing server-side action: LOG_PERIOD', parsedResponse.action);
                try {
                    let actionDate: Date;
                    const dateStr = parsedResponse.action.date;

                    // Try standard ISO format (YYYY-MM-DD)
                    const isoDate = new Date(dateStr);
                    if (!isNaN(isoDate.getTime()) && dateStr.includes('-')) {
                        actionDate = isoDate;
                    } else {
                        // Try Serbian/European format (DD.MM.YYYY or DD/MM/YYYY)
                        // Split by dot, slash, or dash if it looks like DD-MM-YYYY
                        const parts = dateStr.split(/[./-]/);
                        if (parts.length === 3) {
                            // Assume DD.MM.YYYY
                            const day = parseInt(parts[0], 10);
                            const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
                            const year = parseInt(parts[2], 10);
                            const serbianDate = new Date(year, month, day);

                            if (!isNaN(serbianDate.getTime())) {
                                actionDate = serbianDate;
                            } else {
                                throw new Error(`Invalid date format: ${dateStr}`);
                            }
                        } else {
                            throw new Error(`Unrecognized date format: ${dateStr}`);
                        }
                    }
                    // Prevent logging dates too far in the future (allow 2 days buffer for timezones)
                    const maxAllowedDate = new Date();
                    maxAllowedDate.setDate(maxAllowedDate.getDate() + 2);

                    if (actionDate > maxAllowedDate) {
                        console.warn(`Attempted to log future date: ${actionDate.toISOString()}. Blocking action.`);
                        // Optional: We could modify the response text to inform the user, but for now we just block the write.
                    } else {
                        const { logPeriodToFirestoreServer } = await import('@/lib/firebase/cycle-server');
                        await logPeriodToFirestoreServer(input.userId, actionDate);
                        console.log('Server-side period logging successful');
                    }
                } catch (err) {
                    console.error('Error executing server-side action:', err);
                    // We don't throw here to allow the text response to still be sent
                }
            }


        } catch (e) {
            console.warn('Failed to parse JSON response, using fallback. Raw text:', text);
            // Fallback: use the text as answer, but try to clean it up if it looks like JSON
            let fallbackText = text;
            // If it starts with ```json, remove it for display
            fallbackText = fallbackText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

            // Try to extract just the "answer" field using regex if JSON parse failed
            const answerMatch = fallbackText.match(/"answer"\s*:\s*"([^"]*)"/);
            if (answerMatch && answerMatch[1]) {
                fallbackText = answerMatch[1]
                    .replace(/\\n/g, '\n')
                    .replace(/\\"/g, '"')
                    .replace(/\\\//g, '/'); // Unescape forward slashes for links
            } else {
                // If regex fails, try to strip the JSON braces if they exist at start/end
                if (fallbackText.startsWith('{') && fallbackText.endsWith('}')) {
                    // This is a desperate attempt to just show the content if it's a simple JSON
                    // But if it's complex, this might be ugly. 
                    // Better to leave it as is or try to find the answer property.
                }
            }

            parsedResponse = {
                answer: fallbackText,
                followUpQuestions: undefined,
            };
        }

        return parsedResponse;

    } catch (error: any) {
        console.error('Error in runConversationalAgentV2:', error);

        const errorMessage = error.message || 'Unknown error';
        const apiKeyDebug = process.env.GEMINI_API_KEY
            ? `Key present (Length: ${process.env.GEMINI_API_KEY.length}, Starts with: ${process.env.GEMINI_API_KEY.substring(0, 4)}...)`
            : 'Key missing';

        // Handle specific API key errors
        if (errorMessage.includes('API Key not found') || errorMessage.includes('API_KEY_INVALID') || !process.env.GEMINI_API_KEY) {
            return {
                answer: `⚠️ **Problem sa konfiguracijom AI Agenta**
                
Izgleda da API ključ za Google Gemini nije ispravno podešen.

**Status ključa:** ${apiKeyDebug}

**Kako rešiti:**
1. **Lokalno:** Proverite da li imate fajl \`.env.local\` i u njemu liniju \`GEMINI_API_KEY=vaš_ključ\`.
2. **Firebase:** Proverite da li je tajna \`gemini-api-key\` ispravno postavljena u Google Cloud konzoli.
3. **Validnost:** Proverite da li je ključ validan i da li imate omogućen "Generative Language API" u Google Cloud projektu.

Tehnička greška: ${errorMessage}`,
                followUpQuestions: undefined,
            };
        }

        return {
            answer: `DEBUG V2 ERROR: ${errorMessage}. \n\nAPI Key Status: ${apiKeyDebug}`,
            followUpQuestions: undefined,
        };
    }
}
