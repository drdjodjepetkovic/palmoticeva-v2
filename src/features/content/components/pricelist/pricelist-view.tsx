"use client";

import React, { useState, useMemo } from 'react';
import { useLanguage } from "@/features/content/context/language-context";
import { useContent } from "@/features/content/content-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { pricelistData } from '@/features/content/data/pricelist';
import * as LucideIcons from 'lucide-react';
import Link from 'next/link';
import { cn } from "@/lib/utils";

const PDF_URL = "https://firebasestorage.googleapis.com/v0/b/beta-39fae.firebasestorage.app/o/docs%2Fcenovnik-usluga-ginekologija-palmoticeva.pdf?alt=media&token=7c90e489-ffa3-49fa-93b8-77f0b3749e5f";

const getIcon = (name: string): React.ElementType => {
    const IconComponent = (LucideIcons as any)[name];
    return IconComponent || LucideIcons.HelpCircle;
};

export function PricelistView() {
    const { language } = useLanguage();
    const { t } = useContent();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCategories = useMemo(() => {
        return pricelistData.categories
            .map(category => ({
                ...category,
                services: category.services.filter(service =>
                    (service.name[language] || service.name['sr'])?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (category.category_name[language] || category.category_name['sr'])?.toLowerCase().includes(searchTerm.toLowerCase())
                ),
            }))
            .filter(category => category.services.length > 0);
    }, [searchTerm, language]);

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-b from-primary/10 to-background pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-6 animate-fade-in-up">
                        <LucideIcons.CreditCard className="w-5 h-5 text-primary mr-2" />
                        <span className="text-sm font-medium text-primary">Cenovnik usluga</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-foreground mb-6 animate-fade-in-up delay-100">
                        {t.pricelist.title}
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200">
                        Transparentne cene za vrhunsku medicinsku uslugu.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto relative animate-fade-in-up delay-300">
                        <div className="relative">
                            <LucideIcons.Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                            <Input
                                type="text"
                                placeholder={t.pricelist.search}
                                className="pl-12 py-6 text-lg rounded-full shadow-lg border-primary/20 focus-visible:ring-primary/50 bg-background/80 backdrop-blur-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mt-8 animate-fade-in-up delay-400">
                        <Button asChild variant="outline" size="lg" className="rounded-full shadow-sm hover:shadow-md transition-all">
                            <a href={PDF_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                <LucideIcons.Download className="h-4 w-4" />
                                <span>{t.pricelist.download}</span>
                            </a>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-4xl px-4 py-12">
                {filteredCategories.length > 0 ? (
                    <div className="space-y-8 animate-fade-in-up delay-500">
                        <TooltipProvider>
                            {filteredCategories.map((category) => {
                                const Icon = getIcon(category.icon);
                                return (
                                    <Card key={category.category_key} className="shadow-lg border-none bg-card/50 backdrop-blur-sm overflow-hidden">
                                        <CardHeader className="bg-primary/5 border-b border-primary/10 pb-4">
                                            <CardTitle className="flex items-center gap-3 text-xl md:text-2xl text-primary">
                                                <div className="p-2 bg-background rounded-lg shadow-sm">
                                                    <Icon className="h-6 w-6" />
                                                </div>
                                                {category.category_name[language] || category.category_name['sr']}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <ul className="divide-y divide-border/50">
                                                {category.services.map((service, index) => (
                                                    <li key={index} className="p-4 md:p-6 flex justify-between items-center gap-4 hover:bg-primary/5 transition-colors group">
                                                        <div className="flex-1 flex items-center gap-2 min-w-0">
                                                            <span className="text-foreground font-medium min-w-0 break-words text-base">
                                                                {service.name[language] || service.name['sr']}
                                                            </span>
                                                            {service.slug && (
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Link href={`/${language}/articles/${service.slug}`} passHref>
                                                                            <LucideIcons.Newspaper className="h-4 w-4 text-primary/70 hover:text-primary cursor-pointer flex-shrink-0 transition-colors" />
                                                                        </Link>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>Pročitaj više o ovoj usluzi</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            )}
                                                            {(service.description?.[language] || service.description?.['sr']) && (
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <button>
                                                                            <LucideIcons.Info className="h-4 w-4 text-muted-foreground/70 hover:text-primary cursor-pointer flex-shrink-0 transition-colors" />
                                                                        </button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p className="max-w-xs">{service.description[language] || service.description['sr']}</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            )}
                                                        </div>
                                                        <span className="font-bold text-primary whitespace-nowrap text-right flex-shrink-0 text-lg">
                                                            {service.price}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </TooltipProvider>
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="bg-muted/30 rounded-full p-6 inline-block mb-4">
                            <LucideIcons.Search className="h-12 w-12 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                            {t.pricelist.no_results}
                        </h3>
                        <Button
                            variant="link"
                            onClick={() => setSearchTerm("")}
                            className="mt-4"
                        >
                            {language === 'sr' ? "Prikaži sve usluge" : "Show all services"}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
