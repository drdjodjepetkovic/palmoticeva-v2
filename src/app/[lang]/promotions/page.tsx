"use client";

// 2026-04-18 — Clinical Atelier brand-pass: cyan/blue/green/gray paleta uklonjena.
// Sve kartice = bela (bg-card) sa shadow-atelier, cene i naslovi navy (text-primary),
// check ikonice teal (text-accent), CTA default Button (navy bg-primary). Featured kartica
// ima teal top-border (3px) + blagi scale da se razlikuje. Akcije su hard-kodirane —
// u budućnosti razmisliti o CMS integraciji (Firestore page_content/promotions).

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from 'next/link';
import { useLanguage } from "@/context/language-context";

const promotions = [
  {
    title: "Dijagnostička histeroskopija",
    price: "39000",
    subtitle: "mogućnost biopsije endometrijuma",
    features: ["NK ćelije", "Konsultacija", "Priprema za VTO", "Endometrial Scratching"],
    buttonText: "Zakažite sada",
    buttonLink: "/appointments",
  },
  {
    title: "Operativna histeroskopija",
    price: "53000",
    subtitle: "+ HP nalaz 5500",
    features: ["Ambulantno lečenje", "HP u roku od 4 dana", "Besplatna konsulatacija", "Postoperativno lečenje"],
    buttonText: "Zakažite sada",
    buttonLink: "/appointments",
    featured: true,
  },
  {
    title: "Labioplastika",
    price: "69000",
    subtitle: "Besplatna konsultacija",
    features: ["Opstoperativna nega", "Potpuna saradnja", "Brz oporavak", "Bez bola u analgosedaciji", "Besplatne kontrole", "Zadovoljne pacijentkinje"],
    buttonText: "Zakažite besplatan pregled",
    buttonLink: "/appointments",
  },
];

const PromotionCard = ({ promotion, lang }: { promotion: typeof promotions[0], lang: string }) => (
  <Card className={`flex flex-col transition-all duration-300 ${promotion.featured ? 'border-t-[3px] border-t-accent lg:scale-105 lg:z-10' : 'hover:shadow-md'}`}>
    <CardContent className="p-8 flex-grow flex flex-col">
      <h3 className="text-2xl font-headline font-bold text-center text-foreground">{promotion.title}</h3>
      <p className="text-5xl font-extrabold text-center my-4 text-primary">{promotion.price}</p>
      <p className="text-center text-sm mb-8 text-muted-foreground">{promotion.subtitle}</p>
      <ul className="space-y-3 mb-8 flex-grow">
        {promotion.features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            <Check className="h-5 w-5 text-accent flex-shrink-0" />
            <span className="text-foreground">{feature}</span>
          </li>
        ))}
      </ul>
      <Button asChild size="lg" className="w-full text-lg py-6 shadow-atelier hover:shadow-md transition-all duration-200 active:scale-[0.98]">
        <Link href={`/${lang}${promotion.buttonLink}`}>{promotion.buttonText}</Link>
      </Button>
    </CardContent>
  </Card>
);

export default function PromotionsPage() {
  const { language } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {promotions.map((promo, index) => (
          <PromotionCard key={index} promotion={promo} lang={language} />
        ))}
      </div>
    </div>
  );
}
