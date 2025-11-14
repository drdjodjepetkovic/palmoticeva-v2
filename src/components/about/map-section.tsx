"use client";

import { useState } from "react";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import type { AboutPageContent } from "@/lib/data/content";
import { useContent } from "@/hooks/use-content";

type MapProps = {
  map: AboutPageContent['map'],
  contact: AboutPageContent['contact'],
  footer: AboutPageContent['footer']
}

export function MapSection({ map, contact, footer }: MapProps) {
    const { language } = useLanguage();
    const { content: t } = useContent(['about_directions_button']);
    const [isOverlayVisible, setIsOverlayVisible] = useState(true);
    
    if (!map || !contact || !footer) return null;

    const mapQuery = "Palmotićeva 33, 11000 Beograd, Srbija";
    const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=16&ie=UTF8&iwloc=B&output=embed`;
    const navigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery)}`;
    
    const handleOverlayClick = () => {
        setIsOverlayVisible(false);
    };

    const handleButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <section className="shadow-lg">
            <div className="relative rounded-t-lg overflow-hidden border-x border-t h-[500px]">
                 <iframe
                    src={mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lokacija Ordinacije"
                    className="grayscale-[60%] contrast-125"
                ></iframe>
            
                {isOverlayVisible && (
                     <div 
                        className="absolute inset-0 z-10 flex flex-col justify-end items-center text-center cursor-pointer"
                        onClick={handleOverlayClick}
                    >
                        <div className="pt-20 pb-6 px-4 bg-gradient-to-t from-background via-background/90 to-transparent w-full">
                            <div className="max-w-xl mx-auto">
                                <h2 className="text-4xl font-headline font-bold text-foreground drop-shadow-md">{map.title[language]}</h2>
                                <p className="mt-2 text-lg text-muted-foreground drop-shadow-sm">{contact.addressLine1?.[language]}, {contact.addressLine2?.[language]}</p>
                                <Button asChild size="lg" className="mt-6" onClick={handleButtonClick}>
                                    <a href={navigationUrl} target="_blank" rel="noopener noreferrer">
                                        {t['about_directions_button']} <ArrowRight className="h-4 w-4 ml-2"/>
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <footer className="py-4 px-4 bg-card text-center text-xs text-muted-foreground space-y-1 border rounded-b-lg border-t-0">
                <p>{footer.copyright[language].replace('{year}', new Date().getFullYear().toString())}</p>
                <p>{footer.address[language]}</p>
                <p>{footer.phones[language]}</p>
                <p>{footer.email[language]}</p>
            </footer>
        </section>
    )
}
