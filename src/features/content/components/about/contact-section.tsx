"use client";

import { useLanguage } from "@/features/content/context/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapPin, Mail, Phone, Clock, ArrowRight } from 'lucide-react';
import type { AboutPageContent } from "@/features/content/data/about";
import { useContent } from "@/features/content/content-context";

type ContactProps = {
    contact: AboutPageContent['contact']
}

export function ContactSection({ contact }: ContactProps) {
    const { language } = useLanguage();
    const { t } = useContent();

    if (!contact) return null;

    const mapQuery = "ginekološka ordinacija palmotićeva";
    const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}`;
    const navigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery)}`;

    const formatPhoneLink = (phone: string | undefined) => {
        if (!phone) return '#';
        return `tel:${phone.replace(/\s/g, '')}`;
    };

    return (
        <section className="grid md:grid-cols-2 gap-8 items-stretch">
            <Card className="shadow-lg flex flex-col">
                <CardHeader>
                    <CardTitle className="text-primary">{contact.addressTitle?.[language]}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm flex-grow">
                    {contact.addressLine1?.[language] && contact.addressLine2?.[language] && (
                        <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 hover:underline">
                            <MapPin className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                            <span>{contact.addressLine1[language]}<br />{contact.addressLine2[language]}</span>
                        </a>
                    )}
                    {contact.email?.[language] && (
                        <a href={`mailto:${contact.email[language]}`} className="flex items-start gap-4 hover:underline">
                            <Mail className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                            <span className="break-all">{contact.email[language]}</span>
                        </a>
                    )}
                    {(contact.phone1?.[language] || contact.phone2?.[language]) && (
                        <div className="flex items-start gap-4">
                            <Phone className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                            <div>
                                {contact.phone1?.[language] && <a href={formatPhoneLink(contact.phone1[language])} className="hover:underline block">{contact.phone1[language]}</a>}
                                {contact.phone2?.[language] && <a href={formatPhoneLink(contact.phone2[language])} className="hover:underline block">{contact.phone2[language]}</a>}
                            </div>
                        </div>
                    )}
                </CardContent>
                <div className="p-6 pt-0">
                    <Button asChild variant="outline" className="w-full">
                        <a
                            href={navigationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {t.about.directions_button} <ArrowRight className="h-4 w-4 ml-2" />
                        </a>
                    </Button>
                </div>
            </Card>

            <Card className="shadow-lg flex flex-col">
                <CardHeader>
                    <CardTitle className="text-primary">{contact.hoursTitle?.[language]}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm flex-grow">
                    {contact.weekdays?.[language] && (
                        <div className="flex items-start gap-4">
                            <Clock className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                            <div>
                                <strong>{contact.weekdays[language]}</strong> {contact.weekdaysHours?.[language]}
                            </div>
                        </div>
                    )}
                    {contact.saturday?.[language] && (
                        <div className="flex items-start gap-4">
                            <Clock className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                            <div>
                                <strong>{contact.saturday[language]}</strong> {contact.saturdayHours?.[language]}
                            </div>
                        </div>
                    )}
                </CardContent>
                <div className="p-6 pt-0">
                    <Button asChild className="w-full" size="lg">
                        <Link href={`/${language}/appointments`}>{t.about.booking_button} <ArrowRight className="h-4 w-4 ml-2" /></Link>
                    </Button>
                </div>
            </Card>
        </section>
    )
}
