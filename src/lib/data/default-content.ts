
import type { ContentItem } from '@/types/content';
import { commonContent } from './content/common';
import { headerContent } from './content/header';
import { homepageContent } from './content/homepage';
import { calendarContent } from './content/calendar';
import { appointmentsContent } from './content/appointments';
import { profileContent } from './content/profile';
import { adminContent } from './content/admin';
import { faqContent } from './content/faq';
import { aiContent } from './content/ai';
import { onboardingContent } from './content/onboarding';
import { tipsContent } from './content/tips';
import { articlesContent } from './content/articles';
import { pwaContent } from './content/pwa';

export const defaultContent: { [key: string]: ContentItem & { version: number } } = {
  ...commonContent,
  ...headerContent,
  ...homepageContent,
  ...calendarContent,
  ...appointmentsContent,
  ...profileContent,
  ...adminContent,
  ...faqContent,
  ...aiContent,
  ...onboardingContent,
  ...tipsContent,
  ...articlesContent,
  ...pwaContent,
};
