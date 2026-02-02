
import type { ReactNode } from 'react';
import type { LanguageCode } from '@/types/content';
import AppLayoutContent from '@/components/layout/app-layout-content';

type Params = { lang: string };
type Props = Readonly<{
  children: ReactNode;
  params: Promise<Params>; // KLJUČNO: u Next 15 je Promise
}>;

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params; // KLJUČNO

  // This is a dummy return because the real content is in the RootLayout in app/layout.tsx
  // But we need to await the params here. The child is what matters.
  return (
    <AppLayoutContent>{children}</AppLayoutContent>
  );
}

