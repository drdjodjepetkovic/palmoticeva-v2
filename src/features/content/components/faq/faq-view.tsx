"use client";

import React, { useState, useMemo } from 'react';
import { useLanguage } from "@/features/content/context/language-context";
import { useContent } from "@/features/content/content-context";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { HelpCircle, ArrowRight, Search, MessageCircle } from "lucide-react";
import Link from "next/link";
import { faqData } from '@/features/content/data/faq';
import { cn } from "@/lib/utils";

export function FAQView() {
    const { language } = useLanguage();
    const { t } = useContent();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = useMemo(() => {
        const cats = Array.from(new Set(faqData.map(item => item.category?.[language]).filter(Boolean)));
        return cats as string[];
    }, [language]);

    const filteredFaqs = useMemo(() => {
        return faqData.filter(faq => {
            const question = (faq.question[language] || faq.question['sr']).toLowerCase();
            const answer = (faq.answer[language] || faq.answer['sr']).toLowerCase();
            const query = searchQuery.toLowerCase();
            const matchesSearch = question.includes(query) || answer.includes(query);
            const matchesCategory = selectedCategory ? faq.category?.[language] === selectedCategory : true;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory, language]);

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-b from-primary/10 to-background pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-6 animate-fade-in-up">
                        <HelpCircle className="w-5 h-5 text-primary mr-2" />
                        <span className="text-sm font-medium text-primary">Centar za podršku</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-foreground mb-6 animate-fade-in-up delay-100">
                        {t.faq.title}
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200">
                        {t.faq.subtitle}
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto relative animate-fade-in-up delay-300">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                            <Input
                                type="text"
                                placeholder={language === 'sr' ? "Pretražite pitanja..." : "Search questions..."}
                                className="pl-12 py-6 text-lg rounded-full shadow-lg border-primary/20 focus-visible:ring-primary/50 bg-background/80 backdrop-blur-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-4xl px-4 py-12">
                {/* Categories */}
                {categories.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 mb-12 animate-fade-in-up delay-400">
                        <Button
                            variant={selectedCategory === null ? "default" : "outline"}
                            onClick={() => setSelectedCategory(null)}
                            className="rounded-full"
                        >
                            {language === 'sr' ? "Sve" : "All"}
                        </Button>
                        {categories.map(cat => (
                            <Button
                                key={cat}
                                variant={selectedCategory === cat ? "default" : "outline"}
                                onClick={() => setSelectedCategory(cat)}
                                className="rounded-full"
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                )}

                <main className="animate-fade-in-up delay-500">
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "FAQPage",
                                "mainEntity": filteredFaqs.map(faq => ({
                                    "@type": "Question",
                                    "name": faq.question[language] || faq.question['sr'],
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": faq.answer[language] || faq.answer['sr']
                                    }
                                }))
                            })
                        }}
                    />

                    {filteredFaqs.length > 0 ? (
                        <Card className="shadow-xl border-none bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-6 md:p-8">
                                <Accordion type="single" collapsible className="w-full space-y-4">
                                    {filteredFaqs.map(faq => (
                                        <AccordionItem
                                            key={faq.id}
                                            value={faq.id}
                                            className="border rounded-xl px-4 data-[state=open]:bg-primary/5 transition-colors"
                                        >
                                            <AccordionTrigger className="text-left text-lg font-medium hover:no-underline py-4">
                                                {faq.question[language] || faq.question['sr']}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-base text-muted-foreground leading-relaxed whitespace-pre-line pb-4">
                                                {faq.answer[language] || faq.answer['sr']}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="text-center py-12">
                            <div className="bg-muted/30 rounded-full p-6 inline-block mb-4">
                                <Search className="h-12 w-12 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                {language === 'sr' ? "Nema rezultata" : "No results found"}
                            </h3>
                            <p className="text-muted-foreground">
                                {language === 'sr'
                                    ? "Pokušajte sa drugim terminom pretrage ili izaberite drugu kategoriju."
                                    : "Try a different search term or select another category."}
                            </p>
                            <Button
                                variant="link"
                                onClick={() => { setSearchQuery(""); setSelectedCategory(null); }}
                                className="mt-4"
                            >
                                {language === 'sr' ? "Prikaži sve" : "Show all"}
                            </Button>
                        </div>
                    )}

                    {/* CTA Section */}
                    <div className="mt-16 grid md:grid-cols-2 gap-6">
                        <Card className="bg-primary text-primary-foreground shadow-lg border-none overflow-hidden relative group">
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-2xl">
                                    <MessageCircle className="h-8 w-8" />
                                    <span>{language === 'sr' ? "Imate još pitanja?" : "Still have questions?"}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-6 text-primary-foreground/90 text-lg">
                                    {language === 'sr'
                                        ? "Naš AI asistent je tu da vam pomogne 24/7."
                                        : "Our AI assistant is here to help you 24/7."}
                                </p>
                                <Button variant="secondary" size="lg" className="w-full font-semibold shadow-md" asChild>
                                    <Link href={`/${language}/ai-test`}>
                                        {language === 'sr' ? "Pitajte AI asistenta" : "Ask AI Assistant"}
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-card shadow-lg border-primary/20 overflow-hidden relative group">
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-2xl text-primary">
                                    <HelpCircle className="h-8 w-8" />
                                    <span>{t.faq.cta_title}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-6 text-muted-foreground text-lg">
                                    {language === 'sr'
                                        ? "Zakažite pregled i razgovarajte sa našim stručnjacima."
                                        : "Book an appointment and talk to our experts."}
                                </p>
                                <Button asChild size="lg" className="w-full font-semibold shadow-md">
                                    <Link href={`/${language}/appointments`}>
                                        {t.faq.cta_button}
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}
