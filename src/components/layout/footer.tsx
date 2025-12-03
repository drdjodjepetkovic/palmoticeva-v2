"use client";

import { useContent } from "@/features/content/content-context";
import { defaultAboutPageContent } from "@/features/content/data/default-content";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Footer() {
    const { t, language } = useContent();
    const footerData = defaultAboutPageContent.footer;

    const year = new Date().getFullYear();

    return (
        <footer className="bg-muted/30 border-t mt-auto hidden md:block">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand & Description */}
                    <div className="md:col-span-1">
                        <h3 className="font-serif font-bold text-xl mb-4 text-primary">
                            {t.common.brand}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {t.dashboard.hero_subtitle_guest}
                        </p>
                    </div>

                    {/* Contact Info */}
                    <div className="md:col-span-1">
                        <h3 className="font-semibold mb-4 text-foreground">{t.appointments.title_contact}</h3>
                        <div className="space-y-3 text-sm text-muted-foreground">
                            <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 mt-1 shrink-0 text-primary" />
                                <span>{footerData.address[language]}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 shrink-0 text-primary" />
                                <span>{footerData.phones[language].replace('Phones: ', '').replace('Telefoni: ', '').replace('Телефони: ', '').replace('Телефоны: ', '')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 shrink-0 text-primary" />
                                <a href={`mailto:${footerData.email[language].replace('Email: ', '')}`} className="hover:text-primary transition-colors">
                                    {footerData.email[language].replace('Email: ', '')}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-1">
                        <h3 className="font-semibold mb-4 text-foreground">{t.nav.about}</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href={`/${language}/about`} className="hover:text-primary transition-colors">
                                    {t.nav.about}
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${language}/pricelist`} className="hover:text-primary transition-colors">
                                    {t.nav.pricelist}
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${language}/faq`} className="hover:text-primary transition-colors">
                                    {t.nav.faq_action || "FAQ"}
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${language}/articles`} className="hover:text-primary transition-colors">
                                    {t.articles.title}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social / Legal */}
                    <div className="md:col-span-1">
                        <h3 className="font-semibold mb-4 text-foreground">Social</h3>
                        <div className="flex gap-4 mb-6">
                            <Link href="#" className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors">
                                <Instagram className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors">
                                <Facebook className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
                    <p>{footerData.copyright[language].replace('{year}', year.toString())}</p>
                </div>
            </div>
        </footer>
    );
}
