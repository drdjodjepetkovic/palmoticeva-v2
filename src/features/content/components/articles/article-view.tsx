"use client";

import { notFound } from 'next/navigation';
import Image from "next/image";
import { Calendar, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/features/content/context/language-context";
import { useContent } from "@/features/content/content-context";
import { articlesData } from '@/features/content/data/articles';
import { format, type Locale } from 'date-fns';
import { sr, ru, srLatn, enUS } from 'date-fns/locale';
import type { LanguageCode } from '@/core/types';

const localeMap: Record<LanguageCode, Locale> = {
    "en": enUS,
    "sr": srLatn,
    "ru": ru,
};

type ArticleViewProps = {
    slug: string;
};

export function ArticleView({ slug }: ArticleViewProps) {
    const { language } = useLanguage();
    const { t } = useContent();

    const article = articlesData.find(a => a.slug === slug);

    if (!article) {
        notFound();
    }

    const title = article.title[language] || article.title['sr'];
    const content = article.content[language] || article.content['sr'];
    const author = article.author?.[language] || article.author?.['sr'] || "Dr. Đorđe Petković";

    return (
        <div className="bg-muted/30">
            <div className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
                <article>
                    <div className="mb-8">
                        <Button asChild variant="outline">
                            <Link href={`/${language}/articles`}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                {t.articles.back_button}
                            </Link>
                        </Button>
                    </div>
                    <header className="mb-8 text-center">
                        <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight text-primary mb-4">
                            {title}
                        </h1>
                        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>{author}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{format(new Date(article.publishedAt), 'd. MMMM yyyy.', { locale: localeMap[language] })}</span>
                            </div>
                        </div>
                    </header>

                    <div className="relative aspect-video rounded-lg overflow-hidden mb-8 shadow-xl">
                        <Image
                            src={article.coverImage}
                            alt={title}
                            fill
                            className="object-cover w-full h-auto"
                            priority
                        />
                    </div>

                    <div
                        className="prose prose-lg dark:prose-invert max-w-none mx-auto prose-p:leading-relaxed prose-headings:text-primary prose-a:text-primary hover:prose-a:underline"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />

                </article>
            </div>
        </div>
    );
}
