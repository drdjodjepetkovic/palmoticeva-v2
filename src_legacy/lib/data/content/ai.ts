import type { ContentItem } from '@/types/content';

const CURRENT_CONTENT_VERSION = 2;

export const aiContent: { [key: string]: ContentItem & { version: number } } = {
  aiGreeting: { en: 'Hello, {name}! How can I help you today?', 'sr': 'Zdravo, {name}! Kako Vam mogu pomoći danas?', se: 'Здраво, {name}! Како Вам могу помоћи данас?', ru: 'Здравствуйте, {name}! Чем я могу Вам помочь сегодня?', version: CURRENT_CONTENT_VERSION },
  aiGreetingGeneric: { en: 'Hello! How can I help you today?', 'sr': 'Zdravo! Kako Vam mogu pomoći danas?', se: 'Здраво! Како Вам могу помоћи данас?', ru: 'Здравствуйте! Чем я могу Вам помочь сегодня?', version: CURRENT_CONTENT_VERSION },
  aiFollowUpCycle1: { en: "What are the examination prices?", "sr": "Koje su cene pregleda?", se: "Које су цене прегледа?", ru: "Какие цены на осмотры?", version: CURRENT_CONTENT_VERSION },
  aiFollowUpCycle2: { en: "How can I book an appointment?", "sr": "Kako da zakažem termin?", se: "Како да закажем термин?", ru: "Как я могу записаться на прием?", version: CURRENT_CONTENT_VERSION },
  aiFollowUpGeneral1: { en: "What are your working hours?", "sr": "Koje je vaše radno vreme?", se: "Које је ваше радно време?", ru: "Какие у вас часы работы?", version: CURRENT_CONTENT_VERSION },
  aiError: { en: 'I am sorry, there seems to be a problem. Please try again later or call our clinic.', 'sr': 'Žao mi je, došlo je do problema. Molimo vas pokušajte kasnije ili pozovite našu ordinaciju.', se: 'Жао ми је, дошло је до проблема. Молимо вас покушајте касније или позовите нашу ординацију.', ru: 'Извините, произошла проблема. Пожалуйста, попробуйте позже или позвоните в нашу клинику.', version: CURRENT_CONTENT_VERSION },
  aiPlaceholder: { en: 'Ask a question...', 'sr': 'Postavite pitanje...', se: 'Поставите питање...', ru: 'Задайте вопрос...', version: CURRENT_CONTENT_VERSION },
};
