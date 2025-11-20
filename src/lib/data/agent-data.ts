
/**
 * @fileoverview
 * Prepares data (pricelist, promos, FAQ, team) in a compact text form
 * for the AI agent, localized by language.
 */

import {
  defaultPricelistData,
  type ServiceCategory,
  type Service,
} from './pricelist';
import { defaultAboutPageContent } from './content';
import { defaultContent } from './default-content';
import type { LanguageCode } from '@/types/content';

export function getAgentContextData(lang: LanguageCode) {
  /* ---------- TEAM ---------- */
  const teamData = defaultAboutPageContent.team.members
    .map((member) => {
      const name =
        member.name[lang] ?? member.name['se-lat'];
      const spec =
        member.specialization[lang] ?? member.specialization['se-lat'];
      const bio = (member.bio[lang] ?? member.bio['se-lat'])
        .replace(/\n/g, ' ')
        .replace(/\*/g, '-');

      return `Ime: ${name}
Specijalizacija: ${spec}
Biografija: ${bio}`;
    })
    .join('\n\n');

  const teamDataForAgent = `### TIM LEKARA\n${teamData}`;

  /* ---------- PRICELIST ---------- */
  const formatService = (s: Service): string => {
    const name = s.name[lang] ?? s.name['se-lat'];
    const desc = s.description?.[lang] ?? s.description?.['se-lat'] ?? '';
    return `- ${name}: ${s.price}${desc ? ` (${desc})` : ''}`;
  };

  const formatCategory = (cat: ServiceCategory): string => {
    const catName = cat.category_name[lang] ?? cat.category_name['se-lat'];
    const services = cat.services.map(formatService).join('\n');
    return `\n### ${catName}\n${services}`;
  };

  const pricelistDataForAgent = defaultPricelistData.categories
    .map(formatCategory)
    .join('');

  /* ---------- FAQ (AUTOMATIC) ---------- */
  const faqKeys = Object.keys(defaultContent)
    .filter(key => key.startsWith('faq') && key.endsWith('_q'))
    .map(key => key.replace('_q', ''));

  const faqDataForAgent = faqKeys
    .map((key) => {
      const q =
        defaultContent[`${key}_q`]?.[lang] ??
        defaultContent[`${key}_q`]?.['se-lat'] ??
        '';
      const a =
        defaultContent[`${key}_a`]?.[lang] ??
        defaultContent[`${key}_a`]?.['se-lat'] ??
        '';
      return q && a ? `Pitanje: ${q}\nOdgovor: ${a}` : '';
    })
    .filter(Boolean)
    .join('\n\n');

  /* ---------- PROMOTIONS ---------- */
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

  const promotionsDataForAgent = promotions
    .map(
      (p) => `Akcija: ${p.title}
Cena: ${p.price} RSD
Detalji: ${p.subtitle}
Uključuje: ${p.features.join(', ')}`
    )
    .join('\n\n');

  /* ---------- RETURN ---------- */
  return {
    pricelistDataForAgent,
    promotionsDataForAgent,
    faqDataForAgent,
    teamDataForAgent,
  };
}
