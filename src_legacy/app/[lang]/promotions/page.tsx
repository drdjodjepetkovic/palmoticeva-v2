"use client";

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
    bgColor: "bg-cyan-100/50",
    textColor: "text-cyan-900",
    buttonClass: "bg-white text-cyan-900 hover:bg-gray-100 border border-cyan-200",
  },
  {
    title: "Operativna histeroskopija",
    price: "53000",
    subtitle: "+ HP nalaz 5500",
    features: ["Ambulantno lečenje", "HP u roku od 4 dana", "Besplatna konsulatacija", "Postoperativno lečenje"],
    buttonText: "Zakažite sada",
    buttonLink: "/appointments",
    bgColor: "bg-white",
    textColor: "text-gray-800",
    buttonClass: "bg-blue-600 text-white hover:bg-blue-700",
    featured: true,
  },
  {
    title: "Labioplastika",
    price: "69000",
    subtitle: "Besplatna konsultacija",
    features: ["Opstoperativna nega", "Potpuna saradnja", "Brz oporavak", "Bez bola u analgosedaciji", "Besplatne kontrole", "Zadovoljne pacijentkinje"],
    buttonText: "Zakažite besplatan pregled",
    buttonLink: "/appointments",
    bgColor: "bg-cyan-100/50",
    textColor: "text-cyan-900",
    buttonClass: "bg-white text-cyan-900 hover:bg-gray-100 border border-cyan-200",
  },
];

const PromotionCard = ({ promotion, lang }: { promotion: typeof promotions[0], lang: string }) => (
  <Card className={`${promotion.bgColor} ${promotion.textColor} flex flex-col shadow-lg rounded-2xl transform transition-all duration-300 ${promotion.featured ? 'scale-105 shadow-2xl z-10' : 'hover:scale-105'}`}>
    <CardContent className="p-8 flex-grow flex flex-col">
      <h3 className="text-2xl font.bold text-center">{promotion.title}</h3>
      <p className="text-6xl font-extrabold text-center my-4">{promotion.price}</p>
      <p className="text-center text-sm mb-8">{promotion.subtitle}</p>
      <ul className="space-y-4 mb-8 flex-grow">
        {promotion.features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button asChild size="lg" className={`w-full text-lg py-6 rounded-full ${promotion.buttonClass}`}>
        <Link href={`/${lang}${promotion.buttonLink}`}>{promotion.buttonText}</Link>
      </Button>
    </CardContent>
  </Card>
);

export default function PromotionsPage() {
  const { language } = useLanguage();

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {promotions.map((promo, index) => (
            <PromotionCard key={index} promotion={promo} lang={language} />
          ))}
        </div>
      </div>
    </div>
  );
}
