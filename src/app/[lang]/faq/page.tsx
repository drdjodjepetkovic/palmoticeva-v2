"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useContent } from "@/hooks/use-content";
import { useLanguage } from "@/context/language-context";
import { HelpCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const contentIds = [
  'faq_page_title', 'faq_page_subtitle',
  'faq1_q', 'faq1_a',
  'faq2_q', 'faq2_a',
  'faq3_q', 'faq3_a',
  'faq4_q', 'faq4_a',
  'faq6_q', 'faq6_a',
  'faq7_q', 'faq7_a',
  'faq8_q', 'faq8_a',
  'faq9_q', 'faq9_a',
  'faq10_q', 'faq10_a',
  'faq11_q', 'faq11_a',
  'faq12_q', 'faq12_a',
  'faq13_q', 'faq13_a',
  'faq14_q', 'faq14_a',
  'faq20_q', 'faq20_a',
  'faq21_q', 'faq21_a',
  'faq22_q', 'faq22_a',
  'faq23_q', 'faq23_a',
  'faq_cta_title', 'faq_cta_button'
];

export default function FAQPage() {
  const { content, loading } = useContent(contentIds);
  const { language } = useLanguage();

  const T = (id: string) => content[id] || <Skeleton className="h-5 w-3/4" />;

  const faqs = [
    { id: 'faq1', q: 'faq1_q', a: 'faq1_a' },
    { id: 'faq2', q: 'faq2_q', a: 'faq2_a' },
    { id: 'faq3', q: 'faq3_q', a: 'faq3_a' },
    { id: 'faq4', q: 'faq4_q', a: 'faq4_a' },
    { id: 'faq6', q: 'faq6_q', a: 'faq6_a' },
    { id: 'faq7', q: 'faq7_q', a: 'faq7_a' },
    { id: 'faq8', q: 'faq8_q', a: 'faq8_a' },
    { id: 'faq9', q: 'faq9_q', a: 'faq9_a' },
    { id: 'faq10', q: 'faq10_q', a: 'faq10_a' },
    { id: 'faq11', q: 'faq11_q', a: 'faq11_a' },
    { id: 'faq12', q: 'faq12_q', a: 'faq12_a' },
    { id: 'faq13', q: 'faq13_q', a: 'faq13_a' },
    { id: 'faq14', q: 'faq14_q', a: 'faq14_a' },
    { id: 'faq20', q: 'faq20_q', a: 'faq20_a' },
    { id: 'faq21', q: 'faq21_q', a: 'faq21_a' },
    { id: 'faq22', q: 'faq22_q', a: 'faq22_a' },
    { id: 'faq23', q: 'faq23_q', a: 'faq23_a' },
  ];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold tracking-tight text-primary">
          {loading ? <Skeleton className="h-10 w-2/3 mx-auto" /> : T('faq_page_title')}
        </h1>
        <div className="mt-4 text-lg text-muted-foreground">
          {loading ? <Skeleton className="h-6 w-1/2 mx-auto" /> : T('faq_page_subtitle')}
        </div>
      </header>

      <main>
        {!loading && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": faqs.map(faq => ({
                  "@type": "Question",
                  "name": content[faq.q] || '',
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": content[faq.a] || ''
                  }
                })).filter(item => item.name && item.acceptedAnswer.text)
              })
            }}
          />
        )}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="w-full">
              {loading ? (
                Array.from({ length: faqs.length }).map((_, i) => (
                  <div key={i} className="border-b py-4">
                    <Skeleton className="h-6 w-full" />
                  </div>
                ))
              ) : (
                faqs.map(faq => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="text-left text-lg hover:no-underline">
                      {T(faq.q)}
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                      {T(faq.a)}
                    </AccordionContent>
                  </AccordionItem>
                ))
              )}
            </Accordion>
          </CardContent>
        </Card>

        <Card className="mt-12 bg-muted/50 shadow-lg border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-primary">
              <HelpCircle />
              <span>{loading ? <Skeleton className="h-6 w-48" /> : T('faq_cta_title')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild size="lg">
              <Link href={`/${language}/appointments`}>
                {loading ? <Skeleton className="h-6 w-32" /> : T('faq_cta_button')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

