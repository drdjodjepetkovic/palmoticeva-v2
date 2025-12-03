import { dbAdmin } from '@/lib/firebase/admin';
import type { AppLanguage } from '@/core/types';
import { pricelistData } from '@/features/content/data/pricelist';
import { aboutPageContent } from '@/features/content/data/about';
import { articlesData } from '@/features/content/data/articles';
import { faqData } from '@/features/content/data/faq';

export async function getAgentContextData(lang: AppLanguage) {
    let pricelistDataForAgent = '';
    let faqDataForAgent = '';
    let teamDataForAgent = '';
    let promotionsDataForAgent = '';
    let articlesDataForAgent = '';

    try {
        // 1. PRICELIST
        // Use the new pricelistData structure
        const pricelist = (pricelistData as any)[lang];
        if (pricelist) {
            pricelistDataForAgent = pricelist.categories.map((cat: any) => {
                const services = cat.services.map((s: any) => `- ${s.name}: ${s.price}${s.description ? ` (${s.description})` : ''}`).join('\n');
                return `\n### ${cat.title}\n${services}`;
            }).join('');
        }

        // 2. FAQ
        const faqs = (faqData as any)[lang];
        if (faqs) {
            faqDataForAgent = faqs.map((f: any) => `Pitanje: ${f.question}\nOdgovor: ${f.answer}`).join('\n\n');
        }

        // 3. TEAM
        const about = (aboutPageContent as any)[lang];
        if (about && about.team) {
            teamDataForAgent = `### TIM LEKARA\n` + about.team.members.map((m: any) => `Ime: ${m.name}\nSpecijalizacija: ${m.role}\nBiografija: ${m.bio}`).join('\n\n');
        }

        // 4. ARTICLES
        const articles = (articlesData as any)[lang];
        if (articles) {
            articlesDataForAgent = articles.map((a: any) => `Naslov: ${a.title}\nSlug: ${a.slug}\nOpis: ${a.excerpt}`).join('\n\n');
        }

        // 5. PROMOTIONS (Static for now, same as legacy)
        const promotions = [
            {
                title: 'Dijagnostička histeroskopija',
                price: '39000',
                subtitle: 'mogućnost biopsije endometrijuma',
                features: [
                    'NK ćelije',
                    'Konsultacija',
                    'Priprema za VTO',
                    'Endometrial Scratching',
                ],
            },
            {
                title: 'Operativna histeroskopija',
                price: '53000',
                subtitle: '+ HP nalaz 5500',
                features: [
                    'Ambulantno lečenje',
                    'HP u roku od 4 dana',
                    'Besplatna konsultacija',
                    'Postoperativno lečenje',
                ],
            },
            {
                title: 'Labioplastika',
                price: '69000',
                subtitle: 'Besplatna konsultacija',
                features: [
                    'Postoperativna nega',
                    'Potpuna saradnja',
                    'Brz oporavak',
                    'Bez bola u analgosedaciji',
                    'Besplatne kontrole',
                    'Zadovoljne pacijentkinje',
                ],
            },
        ];

        promotionsDataForAgent = promotions
            .map(
                (p) => `Akcija: ${p.title}
    Cena: ${p.price} RSD
    Detalji: ${p.subtitle}
    Uključuje: ${p.features.join(', ')}`
            )
            .join('\n\n');

    } catch (error) {
        console.error('Error fetching agent data:', error);
    }

    return {
        pricelistDataForAgent,
        promotionsDataForAgent,
        faqDataForAgent,
        teamDataForAgent,
        articlesDataForAgent,
    };
}
