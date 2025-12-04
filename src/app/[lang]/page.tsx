"use client";

import { useAuth } from "@/features/auth/auth-context";
import { useContent } from "@/features/content/content-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FeatureCard } from "@/components/ui/feature-card";
import { Calendar, CalendarDays, FileText, HelpCircle, Stethoscope, ArrowRight } from "lucide-react";
import { articlesData } from "@/features/content/data/articles";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { TeamSection } from "@/features/content/components/about/team-section";
import { aboutPageContent } from "@/features/content/data/about";

export default function HomePage() {
    const { user, userProfile } = useAuth();
    const { t, language } = useContent();

    // Get latest 2 articles
    const latestArticles = articlesData.slice(0, 2);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-blue-50 to-white pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">
                <div className="container px-4 md:px-6 relative z-10 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex-1">
                            <div className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800 mb-2">
                                27 Godina Poverenja
                            </div>
                            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-slate-900 leading-tight">
                                Ginekološka ordinacija <br />
                                <span className="text-blue-600 italic">Palmotićeva</span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed">
                                Vrhunska stručnost, savremena dijagnostika i posvećenost Vašem zdravlju.
                                Vaše poverenje je naša najveća preporuka.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
                                <Button size="lg" className="rounded-full px-8 py-6 text-lg shadow-xl shadow-blue-200 bg-blue-600 hover:bg-blue-700 transition-all" asChild>
                                    <Link href={`/${language}/appointments`}>
                                        {t.about.booking_button || "Zakaži termin"}
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-lg border-2" asChild>
                                    <Link href={`/${language}/contact`}>
                                        Pozovite nas
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Hero Image / Illustration Placeholder until we place Doctors below */}
                        <div className="hidden md:block flex-1 relative">
                            {/* We will place Doctors here in Phase 2, for now keep it clean or add a subtle graphic */}
                        </div>
                    </div>
                </div>

                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] bg-indigo-50/50 rounded-full blur-3xl -z-10" />
            </section>

            {/* Services Quick Links (Replacing Dashboard Grid) */}
            <section className="container px-4 md:px-6 -mt-12 relative z-20 pb-16">
                {/* This space is reserved for the Team Section in Phase 2 */}
            </section>

            {/* Latest Articles Section */}
            <section className="bg-muted/30 py-16 md:py-24">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-10 gap-4">
                        <div>
                            <h2 className="text-3xl font-serif font-bold text-primary mb-2">{t.articles.title}</h2>
                            <p className="text-muted-foreground">{t.articles.subtitle}</p>
                        </div>
                        <Button variant="ghost" className="group" asChild>
                            <Link href={`/${language}/articles`}>
                                {t.articles.back_button.replace('Nazad na', 'Vidi').replace('Back to', 'See').replace('Назад ко', 'Смотреть')}
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2">
                        {latestArticles.map((article) => (
                            <Link key={article.slug} href={`/${language}/articles/${article.slug}`} className="group block h-full">
                                <Card className="h-full overflow-hidden border-none shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-background">
                                    <div className="flex flex-col md:flex-row h-full">
                                        <div className="relative w-full md:w-2/5 aspect-video md:aspect-auto bg-muted">
                                            <Image
                                                src={article.coverImage}
                                                alt={article.title[language] || article.title['sr']}
                                                fill
                                                className="object-contain transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                        <CardContent className="flex-1 p-6 flex flex-col justify-center">
                                            <div className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider">
                                                {article.category?.[language] || "Ginekologija"}
                                            </div>
                                            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                                {article.title[language] || article.title['sr']}
                                            </h3>
                                            <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                                                {article.excerpt[language] || article.excerpt['sr']}
                                            </p>
                                            <div className="flex items-center text-sm font-medium text-primary mt-auto">
                                                {t.articles.read_more}
                                            </div>
                                        </CardContent>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-24 bg-primary text-primary-foreground relative overflow-hidden">
                <div className="container px-4 md:px-6 relative z-10 text-center">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">{t.dashboard.cta_title}</h2>
                    <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-8">
                        {t.dashboard.cta_subtitle}
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button size="lg" variant="secondary" className="rounded-full px-8 text-primary font-bold shadow-lg" asChild>
                            <Link href={`/${language}/appointments`}>{t.about.booking_button}</Link>
                        </Button>
                        <Button size="lg" variant="outline" className="rounded-full px-8 border-primary-foreground/30 hover:bg-primary-foreground/10 text-primary-foreground" asChild>
                            <Link href={`/${language}/faq`}>{t.faq.cta_button}</Link>
                        </Button>
                    </div>
                </div>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
            </section>
        </div>
    );
}
