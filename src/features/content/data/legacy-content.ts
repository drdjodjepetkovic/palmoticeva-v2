import type { ContentItem } from '@/types/content';
import { appointmentsContent } from './content/appointments';
import { commonContent } from './content/common';

export const defaultContent: { [key: string]: ContentItem & { version: number } } = {
    ...commonContent,
    ...appointmentsContent,
};
