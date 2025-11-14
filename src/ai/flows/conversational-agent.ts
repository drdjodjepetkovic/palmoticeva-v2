
'use server';
/**
 * @fileOverview A conversational agent for the clinic's AI assistant.
 *
 * This flow is designed to answer user questions about the clinic's services,
 * pricing, and general information. It is explicitly designed to refuse
 * to provide medical advice and will instead guide the user to book an appointment.
 * It can also access the user's menstrual calendar data if they are logged in.
 */

import { ai } from '@/ai/index';
import { z } from 'zod';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { googleAI } from '@genkit-ai/googleai';
import type { ArticlesContent, Article } from '@/lib/data/content/articles';
import type { AboutPageContent } from '@/lib/data/content';
import type { Service, ServiceCategory } from '@/lib/data/pricelist';
import type { LanguageCode } from '@/types/content';
import { parse, getDay, format as formatDateFns, nextFriday, nextMonday, nextSaturday, nextThursday, nextTuesday, nextWednesday } from 'date-fns';

// +----------------------------+
// |   AGENT FLOW DEFINITION    |
// +----------------------------+

const HistoryItemSchema = z.object({
  role: z.enum(['user', 'model']),
  text: z.string(),
});
export type HistoryItem = z.infer<typeof HistoryItemSchema>;

const LoggedEventSchema = z.object({
    date: z.string().describe("The date of the event in 'YYYY-MM-DD' format."),
    type: z.enum(['intercourse', 'pain', 'spotting', 'mood', 'hotFlashes', 'insomnia', 'routineCheckup', 'problemCheckup']).describe("The type of event logged by the user."),
});

const PastCycleSchema = z.object({
    startDate: z.string().describe("The start date of the cycle in 'YYYY-MM-DD' format."),
    endDate: z.string().describe("The end date of the cycle in 'YYYY-MM-DD' format."),
    periodLength: z.number().describe("The duration of the period in days for that cycle."),
    cycleLength: z.number().describe("The total duration of the cycle in days."),
});

const AppointmentDataSchema = z.object({
    date: z.string().optional().describe("Date for the appointment in 'YYYY-MM-DD' format."),
    timeSlot: z.enum(["morning", "midday", "afternoon"]).optional().describe("The preferred time slot."),
    message: z.string().optional().describe("A short message or reason for the appointment."),
});

const ConversationalAgentInputSchema = z.object({
  conversationId: z.string().describe('The unique ID for the current conversation session.'),
  history: z.array(HistoryItemSchema).describe('The history of the conversation so far.'),
  question: z.string().describe('The latest question from the user.'),
  language: z.enum(['en', 'ru', 'se', 'se-lat']).describe('The language for the response. Supported languages are English (en), Russian (ru), Serbian Cyrillic (se), and Serbian Latin (se-lat).'),
  isLoggedIn: z.boolean().describe('Whether the user is logged in or not.'),
  userId: z.string().optional().describe('The UID of the logged-in user, if available.'),
  menstrualData: z.object({
    isPeriod: z.boolean().describe("True if the user is currently on their period."),
    isFertile: z.boolean().describe("True if today is within the user's fertile window."),
    isOvulation: z.boolean().describe("True if today is the predicted ovulation day."),
    currentCycleDay: z.number().optional().describe("The current day of the menstrual cycle (e.g., 1, 15, 28)."),
    daysUntilNextPeriod: z.number().optional().describe("Number of days until the next predicted period starts."),
    lastPeriodStartDate: z.string().optional().describe("The start date of the user's last recorded period in 'YYYY-MM-DD' format."),
    fertileWindowStartDate: z.string().optional().describe("The predicted start date of the next fertile window in 'YYYY-MM-DD' format."),
    fertileWindowEndDate: z.string().optional().describe("The predicted end date of the next fertile window in 'YYYY-MM-DD' format."),
    ovulationDate: z.string().optional().describe("The predicted date of the next ovulation in 'YYYY-MM-DD' format."),
    nextPredictedPeriodStartDate: z.string().optional().describe("The predicted start date of the next period in 'YYYY-MM-DD' format."),
    avgCycleLength: z.number().optional().describe("The user's average cycle length in days."),
    avgPeriodLength: z.number().optional().describe("The user's average period length in days."),
    pastCycles: z.array(PastCycleSchema).optional().describe("A list of the user's most recent completed cycles."),
    loggedEvents: z.array(LoggedEventSchema).optional().describe("A list of recent symptoms or events logged by the user."),
    error: z.string().optional().describe("An error message if data could not be retrieved, e.g., 'User has not set up their calendar yet.'"),
  }).optional().describe("The user's current menstrual cycle data. Available only if the user is logged in and asks a relevant question.")
});
export type ConversationalAgentInput = z.infer<typeof ConversationalAgentInputSchema>;

const ConversationalAgentOutputSchema = z.object({
  answer: z.string().describe("The AI-generated answer to the user's question. The response should be in plain text, but you can use markdown for links, like [link text](url)."),
  navigation: z.string().optional().describe("If the user asks to navigate to a page, this field should contain the URL path (e.g., '/appointments', '/pricelist')."),
  appointmentData: AppointmentDataSchema.optional().describe("Structured data for pre-filling the appointment form."),
  followUpQuestions: z
    .array(z.string())
    .optional()
    .describe('A list of 2-3 relevant follow-up questions the user might have.'),
});
export type ConversationalAgentOutput = z.infer<typeof ConversationalAgentOutputSchema>;

// +--------------------------+
// |   APPOINTMENT PREP TOOL  |
// +--------------------------+
const prepareAppointmentTool = ai.defineTool(
  {
    name: 'prepareAppointment',
    description: 'Parses user requests for appointments to extract date, time, and a message. Use this when a user expresses intent to book an appointment and provides any details.',
    inputSchema: z.object({
        request: z.string().describe("The user's full request for an appointment, e.g., 'zakaži mi za sutra popodne kontrolu' or 'I need an appointment for October 25th around 11am'"),
    }),
    outputSchema: AppointmentDataSchema,
  },
  async ({ request }) => {
    const today = new Date();
    let date: Date | undefined;

    // Simple date parsing
    if (/\bsutra\b/i.test(request)) date = new Date(new Date().setDate(today.getDate() + 1));
    else if (/\bprekosutra\b/i.test(request)) date = new Date(new Date().setDate(today.getDate() + 2));
    else if (/\bsledeći ponedeljak\b|u ponedeljak/i.test(request)) date = nextMonday(today);
    else if (/\bsledeći utorak\b|u utorak/i.test(request)) date = nextTuesday(today);
    else if (/\bsledeću sredu\b|u sredu/i.test(request)) date = nextWednesday(today);
    else if (/\bsledeći četvrtak\b|u četvrtak/i.test(request)) date = nextThursday(today);
    else if (/\bsledeći petak\b|u petak/i.test(request)) date = nextFriday(today);
    else if (/\bsledeću subotu\b|u subotu/i.test(request)) date = nextSaturday(today);
    
    // Example: "25. oktobar", "oktobar 25"
    const dateMatch = request.match(/(\d{1,2})\.\s*(\w+)|(\w+)\s*(\d{1,2})/);
    if(dateMatch) {
      // This is a very naive implementation and would need a proper date parsing library for production
    }

    if (date && getDay(date) === 0) { // getDay() -> 0 for Sunday
      return { message: "Ordinacija ne radi nedeljom. Molimo izaberite drugi dan." } as any;
    }
    
    let timeSlot: 'morning' | 'midday' | 'afternoon' | undefined;
    if (/\bpre podne\b|ujutru|10|11|jutarnji\b/i.test(request)) timeSlot = 'morning';
    else if (/\b(sredina dana|oko 12|13|14|15)\b/i.test(request)) timeSlot = 'midday';
    else if (/\b(posle podne|popodne|16|17|18|19)\b/i.test(request)) timeSlot = 'afternoon';

    const messageKeywords = ['pregled', 'kontrola', 'problem', 'zbog', 'because', 'for', 'razlog'];
    let message = '';
    // Create a regex to find any of the keywords and capture what comes after.
    const keywordRegex = new RegExp(`\\b(${messageKeywords.join('|')})\\b\\s*(.*)`, 'i');
    const match = request.match(keywordRegex);
    if (match && match[2]) {
        // match[1] is the keyword, match[2] is the rest of the string
        message = match[2].trim();
    }
    
    return {
        date: date ? formatDateFns(date, 'yyyy-MM-dd') : undefined,
        timeSlot: timeSlot,
        message: message || undefined,
    };
  }
);


export async function conversationalAgent(input: ConversationalAgentInput): Promise<ConversationalAgentOutput> {
  return conversationalAgentFlow(input);
}


const systemInstruction = `You are a friendly and helpful AI for a gynecological clinic. You are NOT a doctor. You will respond as if you are the application itself, providing helpful information. You MUST NOT give yourself a name.
Your primary goal is to answer user questions based ONLY on the provided context information below.

**APPOINTMENT BOOKING FLOW:**
This is a special multi-step process. Your goal is to fill three slots: \`date\`, \`timeSlot\`, and \`message\`.
1.  **USER INTENT & INITIAL PARSING:**
    *   If the user expresses intent to book an appointment (e.g., "želim da zakažem", "treba mi termin", "hoću pregled"), engage the appointment booking flow.
    *   Use the \`prepareAppointment\` tool to parse their initial request. This tool will return any \`date\`, \`timeSlot\`, or \`message\` it finds. If the tool returns a message about the clinic being closed on Sundays, you must output that as the answer and stop the flow.
2.  **GATHER MISSING INFORMATION (ONE BY ONE):**
    *   After parsing, check which slots are still empty.
    *   **If the user is ambiguous** (e.g., "sreda ili četvrtak"), you MUST ask for clarification. For example: "Može, samo mi recite da li Vam više odgovara sreda ili četvrtak?"
    *   **If the \`date\` is missing:** Ask for it. Be helpful.
    *   **If the \`date\` is known but \`timeSlot\` is missing:** Ask for the time slot. You MUST provide the options as clickable follow-up questions: "pre podne (08-12h)", "sredina dana (12-16h)", "posle podne (16-20h)".
    *   **If \`date\` and \`timeSlot\` are known but \`message\` is missing:** Ask for the reason for the visit. You MUST provide these specific options as clickable follow-up questions: "Redovan pregled", "Ultrazvučni pregled", "Konsultacija", "Bez poruke". If the user selects "Bez poruke", treat the message as an empty string.
3.  **CONFIRM & REDIRECT (FINAL STEP):**
    *   Once you have gathered ALL THREE pieces of information (\`date\`, \`timeSlot\`, \`message\`), you MUST perform the final action.
    *   Generate a confirmation message, like "U redu, preusmeravam vas na stranicu za zakazivanje sa popunjenim podacima."
    *   Set the 'navigation' field to '/appointments'.
    *   Populate the 'appointmentData' field with all the collected data.
    *   **CRITICAL:** Do NOT navigate until all three pieces of information are collected. If the user provides all information in the first message, you can navigate immediately after the first step.

**GENERAL NAVIGATION (Not for appointments):**
*   If the user asks to go to, open, or see a specific page (and does NOT express intent to book an appointment), your primary goal is to facilitate that navigation.
*   You MUST set the 'navigation' field in your response to the corresponding path (e.g., '/pricelist'). Do NOT provide a text 'answer' in this case, only the navigation path.
*   Available pages: "/" (Home), "/pricelist", "/appointments", "/articles", "/about", "/faq", "/promotions", "/menstrual-calendar".
*   Example: "otvori cenovnik" -> {"navigation": "/pricelist"}.
*   If a user's request is purely navigational, prioritize the 'navigation' field.

**CONVERSATION HISTORY**:
You will be provided with the conversation history. Use it to understand the context of the current question. If the user says "what about X?", refer to the previous messages to understand what "it" refers to.

**LANGUAGE RULE:** You MUST answer in the specified language: {{language}}. You must strictly adhere to the specified language and dialect. For Serbian, if the user writes in Cyrillic ('se'), you MUST reply in Cyrillic. If they write in Latin ('se-lat'), you MUST reply in Latin. Do not mix scripts or use any other similar languages like Croatian or Bosnian. The only supported languages are Serbian (se, se-lat), English (en), and Russian (ru).

**CONTEXT INFORMATION:**
Your answers MUST be based *only* on the information provided in these sections.
- Working Hours: Monday-Friday 08:00-20:00, Saturday 08:00-15:00.
- Location: Palmotićeva 33, Belgrade, Serbia.
- Phone numbers: 011 322 60 40, 011 322 69 45.

**OPŠTE INFORMACIJE:**
- Šta poneti na pregled: Na pregled je potrebno poneti samo ličnu kartu. Ukoliko imate, ponesite i prethodnu medicinsku dokumentaciju.

**ARTICLES:**
{{{articlesContext}}}

**PRICELIST:**
{{{pricelistContext}}}

**PROMOTIONS:**
{{{promotionsContext}}}

**FREQUENTLY ASKED QUESTIONS (FAQ):**
{{{faqContext}}}

**DOCTORS / TEAM:**
{{{teamContext}}}

**RULES & PERSONALIZED DATA:**
1.  **NO MEDICAL ADVICE:** NEVER, under any circumstances, provide any medical advice, diagnoses, or interpretations of symptoms. If the user asks a question that is even remotely medical (e.g., "šta znači ovaj simptom?", "da li je ovo normalno?", "vrti mi se u glavi"), you MUST refuse to answer directly. Instead, you MUST first politely explain that you cannot provide medical advice. Then, you MUST advise them to consult their chosen general practitioner. After that, you should add that if they believe the issue is of a gynecological nature, they can book an appointment with a gynecologist. Finally, you MUST provide a direct Markdown link to the booking page.
2.  **USE ONLY PROVIDED INFO:** For ANY general question about prices, services, promotions, doctors, or FAQs, you MUST find the answer in the context above. Search the entire context for keywords from the user's question. If the information is not in the context, state that you do not have that specific information and suggest they call the clinic. DO NOT make up answers.
3.  **BOOKING & CALENDAR LINKS:**
    - If the user asks how to book an appointment, or if you recommend booking one, you MUST provide a direct Markdown link to the booking page. The URL is '/appointments'. For example, in Serbian, you MUST say "Možete [zakažete termin online](/appointments)."
    - If the user asks about the calendar or has a problem with it (e.g., "ne mogu da napravim kalendar"), and you mention the Calendar section, you MUST format the word "Kalendar" as a Markdown link. The URL is '/menstrual-calendar'. For example, in Serbian, you MUST say "To možete učiniti u odeljku [Kalendar](/menstrual-calendar)."
4.  **HANDLING COMPLAINTS:** If the user expresses a general complaint like "ne radi" or "loše je", do NOT use the word 'aplikacija'. Respond with understanding, e.g., "Žao mi je što nailazite na poteškoće." Then, suggest common solutions: "Najčešće pomaže osvežavanje stranice. Proverite i da li imate stabilnu internet konekciju." If that doesn't help, ask for more details so the problem can be forwarded to the technical team.
5.  **MENSTRUAL CALENDAR (Personalized Data):** IF the 'menstrualData' input object is provided AND the user asks a specific question about THEIR OWN cycle, you MUST use this data to answer their question.
    - **IF \`menstrualData.error\` exists:** The user's data could not be retrieved. Politely inform them about the error (e.g., "Izgleda da još niste podesili svoj kalendar. To možete učiniti u odeljku [Kalendar](/menstrual-calendar).").
    - **IF \`menstrualData\` exists and has no error:** Use the provided fields to give a specific and helpful answer.
        - Question: "When is my ovulation?" -> Answer based on \`ovulationDate\`.
        - Question: "Am I fertile?" -> Check \`isFertile\`. If true, say so and provide the date range from \`fertileWindowStartDate\` to \`fertileWindowEndDate\`. If false, use \`fertileWindowStartDate\` to tell them when the next one starts.
        - Question: "When is my next period?" -> Use \`daysUntilNextPeriod\` and \`nextPredictedPeriodStartDate\`.
        - Question: "What cycle day am I?" -> Use \`currentCycleDay\`.
        - Question: "When was my last period?" -> Use \`lastPeriodStartDate\`.
        - Question: "How long was my last period/cycle?" -> Find the most recent cycle in \`pastCycles\` and use \`periodLength\` or \`cycleLength\`.
        - Question: "When was I last at the doctor?" -> Look in \`loggedEvents\` for \`routineCheckup\` or \`problemCheckup\` and state the date of the most recent one.
    - **IMPORTANT:** Format all dates in a user-friendly way (e.g., '15. avgust 2024.'). Always mention the full date including the year.
6.  **MENSTRUAL CALENDAR (General Info):** IF the \`menstrualData\` field is NOT provided or the user is not logged in, and the user asks a question about their personal cycle, you MUST assume you don't have access. Politely inform them that this is a feature for registered users who have set up their calendar, and suggest they log in or create an account to use it.
7.  **FOLLOW-UP QUESTIONS:** After providing a non-navigational, non-booking-flow answer, also suggest 2-3 relevant follow-up questions. **CRITICAL:** These suggested questions MUST be answerable using ONLY the context information provided to you. Do not suggest questions if you don't know the answer. For questions about the user's cycle, ensure the data is available in the \`menstrualData\` object before suggesting them.`;


// Helper to strip HTML tags from article content
const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, '');

// Helper to get dynamically fetched content from Firestore and format for the agent
async function getAgentContext(lang: LanguageCode): Promise<{ articlesContext: string, pricelistContext: string, faqContext: string, teamContext: string, promotionsContext: string }> {
    try {
        const [articlesDoc, aboutDoc, pricelistDoc] = await Promise.all([
            getDoc(doc(db, 'page_content', 'articles')),
            getDoc(doc(db, 'page_content', 'about')),
            getDoc(doc(db, 'page_content', 'pricelist'))
        ]);

        // Articles
        const articlesData = articlesDoc.exists() ? (articlesDoc.data() as ArticlesContent) : null;
        const articlesContext = articlesData?.articles
            .map((article: Article) => `Članak: ${article.title[lang] ?? article.title['se-lat']}\nSadržaj: ${stripHtml(article.content[lang] ?? article.content['se-lat'])}`)
            .join('\n\n---\n\n') || "Nema dostupnih članaka.";
        
        // Team
        const aboutData = aboutDoc.exists() ? (aboutDoc.data() as AboutPageContent) : null;
        const teamContext = aboutData?.team?.members
            .map(member => `Ime: ${member.name[lang] ?? member.name['se-lat']}\nSpecijalizacija: ${member.specialization[lang] ?? member.specialization['se-lat']}\nBiografija: ${(member.bio[lang] ?? member.bio['se-lat']).replace(/\n|\*/g, ' ')}`)
            .join('\n\n') || "Nema dostupnih podataka o timu.";

        // Pricelist
        const pricelistData = pricelistDoc.exists() ? pricelistDoc.data() as { categories: ServiceCategory[] } : null;
        const pricelistContext = pricelistData?.categories
            .map(cat => `\n### ${cat.category_name[lang] ?? cat.category_name['se-lat']}\n${cat.services.map(s => `- ${s.name[lang] ?? s.name['se-lat']}: ${s.price}${s.description?.[lang] || s.description?.['se-lat'] ? ` (${s.description[lang] || s.description['se-lat']})` : ''}`).join('\n')}`)
            .join('') || "Nema dostupnog cenovnika.";

        // Promotions and FAQ are currently static, can be moved to DB later if needed
        const promotions = [{ title: 'Dijagnostička histeroskopija', price: '39000', subtitle: 'mogućnost biopsije endometrijuma', features: ['NK ćelije', 'Konsultacija', 'Priprema za VTO', 'Endometrial Scratching'] }, { title: 'Operativna histeroskopija', price: '53000', subtitle: '+ HP nalaz 5500', features: ['Ambulantno lečenje', 'HP u roku od 4 dana', 'Besplatna konsultacija', 'Postoperativno lečenje'] }, { title: 'Labioplastika', price: '69000', subtitle: 'Besplatna konsultacija', features: ['Postoperativna nega', 'Potpuna saradnja', 'Brz oporavak', 'Bez bola u analgosedaciji', 'Besplatne kontrole', 'Zadovoljne pacijentkinje'] }];
        const promotionsContext = promotions.map(p => `Akcija: ${p.title}\nCena: ${p.price} RSD\nDetalji: ${p.subtitle}\nUključuje: ${p.features.join(', ')}`).join('\n\n');

        // Simple FAQ example; can be expanded or moved to DB
        const faqContext = `Pitanje: Koliko često treba da radim ginekološki pregled?\nOdgovor: Preporučuje se preventivni ginekološki pregled jednom godišnje, čak i ako nemate tegobe.`;

        return { 
            articlesContext: `\n### ČLANCI SA BLOGA\n${articlesContext}`,
            pricelistContext,
            faqContext,
            teamContext: `### TIM LEKARA\n${teamContext}`,
            promotionsContext: `### PROMOCIJE\n${promotionsContext}`
        };
    } catch (error) {
        console.error("Error fetching dynamic agent context from Firestore:", error);
        return { articlesContext: "Greška pri učitavanju članaka.", pricelistContext: "Greška pri učitavanju cenovnika.", faqContext: "Greška pri učitavanju FAQ.", teamContext: "Greška pri učitavanju podataka o timu.", promotionsContext: "Greška pri učitavanju promocija." };
    }
}


const agentPrompt = ai.definePrompt({
  name: 'conversationalAgentPrompt',
  model: googleAI.model('gemini-flash-latest'),
  tools: [prepareAppointmentTool],
  input: { schema: ConversationalAgentInputSchema.extend({
      pricelistContext: z.string(),
      promotionsContext: z.string(),
      faqContext: z.string(),
      teamContext: z.string(),
      articlesContext: z.string(),
  })},
  output: { schema: ConversationalAgentOutputSchema },
  system: systemInstruction,
  prompt: `{{#if history}}
Conversation History:
{{#each history}}
- {{role}}: {{text}}
{{/each}}
{{/if}}

The user's latest question is: {{{question}}}

{{#if menstrualData}}
This is the user's personal menstrual data. Use it ONLY if their question is about their personal cycle. Otherwise, ignore it.
{{{json menstrualData}}}
{{/if}}
`,
});

const conversationalAgentFlow = ai.defineFlow(
  {
    name: 'conversationalAgentFlow',
    inputSchema: ConversationalAgentInputSchema,
    outputSchema: ConversationalAgentOutputSchema,
  },
  async (input) => {
    try {
        const { 
            articlesContext,
            pricelistContext,
            faqContext,
            teamContext,
            promotionsContext
        } = await getAgentContext(input.language);
        
        const llmResponse = await agentPrompt(
          {
            ...input,
            articlesContext,
            pricelistContext,
            faqContext,
            teamContext,
            promotionsContext,
          }
        );
        
        // This is the critical change. If the model returns a null/undefined response,
        // we construct a valid, graceful error message instead of letting it fail.
        if (!llmResponse.output) {
          console.log("LLM returned null. Fallback response initiated.");
          const fallbackResponse: ConversationalAgentOutput = {
            answer: "Žao mi je, došlo je do neočekivane greške. Možete li preformulisati pitanje?",
            followUpQuestions: ["Koje je radno vreme?", "Kako da zakažem termin?"],
          };
          
          try {
              addDoc(collection(db, 'ai_conversations'), {
                  conversationId: input.conversationId,
                  userId: input.userId || 'anonymous',
                  language: input.language,
                  userQuestion: input.question,
                  modelAnswer: fallbackResponse.answer,
                  followUpQuestions: fallbackResponse.followUpQuestions,
                  createdAt: serverTimestamp(),
                  error: "LLM returned null/undefined output",
                  history: input.history,
              });
          } catch (logError) {
              console.error("Failed to log fallback response to Firestore:", logError);
          }
          
          return fallbackResponse;
        }

        const output = llmResponse.output;
        
        try {
            const conversationLog = {
                conversationId: input.conversationId,
                userId: input.userId || 'anonymous',
                language: input.language,
                userQuestion: input.question,
                modelAnswer: output.answer,
                followUpQuestions: output.followUpQuestions || [],
                createdAt: serverTimestamp(),
            };
            addDoc(collection(db, 'ai_conversations'), conversationLog);
        } catch (error: any) {
            console.error("Failed to log conversation to Firestore:", error);
        }

        return output;

    } catch (e: any) {
        console.error("Error in conversationalAgentFlow:", e);
        // This handles more critical errors in the flow itself.
        return {
            answer: `Žao mi je, došlo je do problema. ${e.message}`,
            followUpQuestions: [],
        };
    }
  }
);
