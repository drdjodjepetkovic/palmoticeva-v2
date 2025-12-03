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

export default function HomePage() {
    const { user, userProfile } = useAuth();
    const { t, language } = useContent();

    // Get latest 2 articles
    const latestArticles = articlesData.slice(0, 2);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-primary/5 to-background pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
                <div className="container px-4 md:px-6 relative z-10">
                    <div className="max-w-3xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-foreground">
                            {userProfile?.displayName ? (
                                <>
                                    {t.dashboard.greeting}, <span className="text-primary">{userProfile.displayName}</span>
                                </>
                            ) : (
                                <>
                                    {t.dashboard.brand_prefix} <span className="text-primary italic">{t.dashboard.brand_suffix}</span>
                                </>
                            )}
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                            {user
                                ? t.dashboard.hero_subtitle_user
                                : t.dashboard.hero_subtitle_guest}
                        </p>

                        {!user && (
                            <div className="flex flex-wrap gap-4 pt-4">
                                <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all" asChild>
                                    <Link href={`/${language}/login`}>{t.auth.login}</Link>
                                </Button>
                                <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
                                    <Link href={`/${language}/appointments`}>{t.about.booking_button}</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[300px] h-[300px] bg-accent/10 rounded-full blur-3xl -z-10" />
            </section>

            {/* Dashboard Grid */}
            <section className="container px-4 md:px-6 -mt-12 relative z-20 pb-16">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <FeatureCard
                        title={t.nav.calendar}
                        description={user ? t.dashboard.features.calendar_desc_user : t.dashboard.features.calendar_desc_guest}
                        icon={Calendar}
                        href={`/${language}/calendar`}
                        variant="highlight"
                        actionText={user ? t.dashboard.features.calendar_action_user : t.dashboard.features.calendar_action_guest}
                    />
                    <FeatureCard
                        title={t.nav.appointments}
                        description={t.dashboard.features.appointments_desc}
                        icon={CalendarDays}
                        href={`/${language}/appointments`}
                        actionText={t.dashboard.features.appointments_action}
                    />
                    <FeatureCard
                        title={t.pricelist.title}
                        description={t.dashboard.features.pricelist_desc}
                        icon={FileText}
                        href={`/${language}/pricelist`}
                        actionText={t.dashboard.features.pricelist_action}
                    />
                    <FeatureCard
                        title={t.faq.title}
                        description={t.dashboard.features.faq_desc}
                        icon={HelpCircle}
                        href={`/${language}/faq`}
                        actionText={t.dashboard.features.faq_action}
                    />
                </div>
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
