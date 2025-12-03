import {
  defaultPricelistData,
  type ServiceCategory,
  type Service,
} from './pricelist';
import { defaultAboutPageContent } from './content';
import { defaultContent } from './default-content';
import { defaultArticlesData } from './content/articles';
import type { LanguageCode } from '@/types/content';
import { dbAdmin } from '@/lib/firebase/admin';

export async function getAgentContextData(lang: LanguageCode) {
  let pricelistDataForAgent = '';
  let faqDataForAgent = '';
  let teamDataForAgent = '';
  let promotionsDataForAgent = '';

  try {
    // --- FETCH FROM FIRESTORE ---
    const [servicesSnap, faqSnap, kbSnap] = await Promise.all([
      dbAdmin.collection('services').get(),
      dbAdmin.collection('faq').get(),
      dbAdmin.collection('knowledge_base').get()
    ]);

    // 1. PRICELIST (Services)
    if (!servicesSnap.empty) {
      const categories: Record<string, string[]> = {};

      servicesSnap.forEach(doc => {
        const data = doc.data();
        const categoryKey = data.categoryKey || 'Ostalo';
        const name = data.name?.[lang] ?? data.name?.['sr'] ?? data.name?.['se'] ?? 'Usluga';
        const price = data.price;
        const desc = data.description?.[lang] ?? data.description?.['sr'] ?? '';

        if (name && price) {
          if (!categories[categoryKey]) categories[categoryKey] = [];
          categories[categoryKey].push(`- ${name}: ${price}${desc ? ` (${desc})` : ''}`);
        }
      });

      pricelistDataForAgent = Object.entries(categories).map(([cat, items]) => {
        return `\n### ${cat.toUpperCase()}\n${items.join('\n')}`;
      }).join('');
    }

    // 2. FAQ
    if (!faqSnap.empty) {
      faqDataForAgent = faqSnap.docs.map(doc => {
        const data = doc.data();
        const q = data.question?.[lang] ?? data.question?.['sr'] ?? '';
        const a = data.answer?.[lang] ?? data.answer?.['sr'] ?? '';
        return q && a ? `Pitanje: ${q}\nOdgovor: ${a}` : '';
      }).filter(Boolean).join('\n\n');
    }

    // 3. KNOWLEDGE BASE (Extra Info)
    if (!kbSnap.empty) {
      const kbInfo = kbSnap.docs.map(doc => {
        const data = doc.data();
        const content = data.content?.[lang] ?? data.content?.['sr'] ?? '';
        return content ? `[INFO]: ${content}` : '';
      }).filter(Boolean).join('\n');

      if (kbInfo) {
        faqDataForAgent += `\n\n### DODATNE INFORMACIJE\n${kbInfo}`;
      }
    }

  } catch (error) {
    console.error('Error fetching agent data from Firestore:', error);
    // Fallback to defaults will happen below if strings are empty
  }

  // --- FALLBACKS (If DB is empty or failed) ---

  /* ---------- TEAM (Static for now, or fetch if added to DB) ---------- */
  if (!teamDataForAgent) {
    const teamData = defaultAboutPageContent.team.members
      .map((member) => {
        const name =
          member.name[lang] ?? member.name['sr'];
        const spec =
          member.specialization[lang] ?? member.specialization['sr'];
        const bio = (member.bio[lang] ?? member.bio['sr'])
          .replace(/\n/g, ' ')
          .replace(/\*/g, '-');

        return `Ime: ${name}
Specijalizacija: ${spec}
Biografija: ${bio}`;
      })
      .join('\n\n');
    teamDataForAgent = `### TIM LEKARA\n${teamData}`;
  }

  /* ---------- PRICELIST FALLBACK ---------- */
  if (!pricelistDataForAgent) {
    const formatService = (s: Service): string => {
      const name = s.name[lang] ?? s.name['sr'];
      const desc = s.description?.[lang] ?? s.description?.['sr'] ?? '';
      return `- ${name}: ${s.price}${desc ? ` (${desc})` : ''}`;
    };

    const formatCategory = (cat: ServiceCategory): string => {
      const catName = cat.category_name[lang] ?? cat.category_name['sr'];
      const services = cat.services.map(formatService).join('\n');
      return `\n### ${catName}\n${services}`;
    };

    pricelistDataForAgent = defaultPricelistData.categories
      .map(formatCategory)
      .join('');
  }

  /* ---------- FAQ FALLBACK ---------- */
  if (!faqDataForAgent) {
    const faqKeys = Object.keys(defaultContent)
      .filter(key => key.startsWith('faq') && key.endsWith('_q'))
      .map(key => key.replace('_q', ''));

    faqDataForAgent = faqKeys
      .map((key) => {
        const q =
          defaultContent[`${key}_q`]?.[lang] ??
          defaultContent[`${key}_q`]?.['sr'] ??
          '';
        const a =
          defaultContent[`${key}_a`]?.[lang] ??
          defaultContent[`${key}_a`]?.['sr'] ??
          '';
        return q && a ? `Pitanje: ${q}\nOdgovor: ${a}` : '';
      })
      .filter(Boolean)
      .join('\n\n');
  }

  /* ---------- PROMOTIONS (Static for now) ---------- */
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

  /* ---------- ARTICLES ---------- */
  const articlesDataForAgent = defaultArticlesData.articles
    .map(article => {
      const title = article.title[lang] ?? article.title['sr'];
      const summary = article.summary[lang] ?? article.summary['sr'];
      return `Naslov: ${title}
Slug: ${article.slug}
Opis: ${summary}`;
    })
    .join('\n\n');

  /* ---------- RETURN ---------- */
  return {
    pricelistDataForAgent,
    promotionsDataForAgent,
    faqDataForAgent,
    teamDataForAgent,
    articlesDataForAgent,
  };
}
