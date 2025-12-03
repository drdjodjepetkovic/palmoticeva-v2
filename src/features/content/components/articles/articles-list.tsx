"use client";

import React, { useState, useMemo } from 'react';
import { useLanguage } from "@/features/content/context/language-context";
import { useContent } from "@/features/content/content-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Calendar, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { articlesData } from '@/features/content/data/articles';
import { cn } from "@/lib/utils";

export function ArticlesList() {
    const { language } = useLanguage();
    const { t } = useContent();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = useMemo(() => {
        const cats = Array.from(new Set(articlesData.map(item => item.category?.[language]).filter(Boolean)));
        return cats as string[];
    }, [language]);

    const filteredArticles = useMemo(() => {
        return articlesData.filter(article => {
            if (!selectedCategory) return true;
            return article.category?.[language] === selectedCategory;
        });
    }, [selectedCategory, language]);

    // Reset selected category when language changes to avoid mismatch
    React.useEffect(() => {
        setSelectedCategory(null);
    }, [language]);

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-b from-primary/10 to-background pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-6 animate-fade-in-up">
                        <BookOpen className="w-5 h-5 text-primary mr-2" />
                        <span className="text-sm font-medium text-primary">Edukativni centar</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-foreground mb-6 animate-fade-in-up delay-100">
                        {t.articles.title}
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200">
                        {t.articles.subtitle}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-12">
                {/* Categories */}
                {categories.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 mb-12 animate-fade-in-up delay-300">
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

                <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up delay-400">
                    {filteredArticles.map((article) => (
                        <Link key={article.slug} href={`/${language}/articles/${article.slug}`} className="group block h-full">
                            <Card className="h-full flex flex-col overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-none bg-card/50 backdrop-blur-sm">
                                <CardHeader className="p-0 relative overflow-hidden">
                                    <div className="aspect-video relative">
                                        <Image
                                            src={article.coverImage}
                                            alt={article.title[language] || article.title['sr']}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                    {article.category?.[language] && (
                                        <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-md text-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-sm flex items-center gap-1">
                                            <Tag className="w-3 h-3" />
                                            {article.category[language]}
                                        </div>
                                    )}
                                </CardHeader>
                                <CardContent className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center text-xs text-muted-foreground mb-3">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {new Date(article.publishedAt).toLocaleDateString(language === 'sr' ? 'sr-RS' : 'en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors mb-3 line-clamp-2">
                                        {article.title[language] || article.title['sr']}
                                    </CardTitle>
                                    <CardDescription className="text-base text-muted-foreground flex-grow line-clamp-3 mb-4">
                                        {article.excerpt[language] || article.excerpt['sr']}
                                    </CardDescription>
                                    <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
                                        <span className="text-sm font-semibold text-primary flex items-center">
                                            {t.articles.read_more} <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </main>

                {filteredArticles.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-xl text-muted-foreground">
                            {language === 'sr' ? "Nema članaka u ovoj kategoriji." : "No articles found in this category."}
                        </p>
                        <Button
                            variant="link"
                            onClick={() => setSelectedCategory(null)}
                            className="mt-4"
                        >
                            {language === 'sr' ? "Prikaži sve članke" : "Show all articles"}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
