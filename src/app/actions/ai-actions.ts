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
            teamDataForAgent
        } = getAgentContextData(input.language);

        console.log('Agent context retrieved successfully');

        // Build system instruction
        const systemInstructionText = `You are a friendly and helpful AI assistant for a gynecological clinic in Belgrade, Serbia. You are NOT a doctor.

**LANGUAGE RULE:** You MUST answer in ${input.language === 'se' ? 'Serbian Cyrillic' : input.language === 'se-lat' ? 'Serbian Latin' : input.language === 'en' ? 'English' : 'Russian'}.

**CRITICAL RULES:**
1. NEVER provide medical advice. If asked, say you cannot give medical advice and recommend booking an appointment.
2. Answer ONLY based on the information below. If info is not available, say so and suggest calling the clinic.
3. When recommending booking, use this link: [zakažite termin](/appointments)

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

${input.menstrualData && !input.menstrualData.error ? `**USER'S MENSTRUAL DATA:**
${JSON.stringify(input.menstrualData, null, 2)}

Use this data to answer personal cycle questions like "When is my ovulation?" or "Am I fertile?"` : ''}

**YOUR TASK:**
Answer the user's question below. After your answer, suggest 2-3 follow-up questions they might have (that you can answer from the context).

**SPECIAL ACTION - LOGGING PERIOD:**
If the user explicitly says their period started (e.g., "Danas mi je počela menstruacija", "Got my period today", "Period started yesterday"), you MUST include an "action" field in your JSON response.
- Set "type" to "LOG_PERIOD".
- Set "date" to the specific date mentioned (YYYY-MM-DD). If they say "today", use the current date. If "yesterday", calculate it.
- In your "answer", confirm that you are logging it (e.g., "U redu, beležim početak menstruacije za danas.").

Format your response as JSON:
{
  "answer": "your answer here in markdown format",
  "followUpQuestions": ["question 1", "question 2", "question 3"],
  "action": { "type": "LOG_PERIOD", "date": "YYYY-MM-DD" } // OPTIONAL, only if applicable
}`;

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
                parsedResponse = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No JSON object found in response');
            }

            // SERVER-SIDE ACTION HANDLING
            if (parsedResponse.action && parsedResponse.action.type === 'LOG_PERIOD' && input.userId) {
                console.log('Executing server-side action: LOG_PERIOD', parsedResponse.action);
                try {
                    const actionDate = new Date(parsedResponse.action.date);
                    const today = new Date();

                    // Prevent logging future dates
                    if (actionDate > today) {
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
