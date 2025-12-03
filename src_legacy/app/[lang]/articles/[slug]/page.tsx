"use client";

import { notFound, useParams } from 'next/navigation';
import Image from "next/image";
import { Calendar, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import { useContent } from "@/hooks/use-content";
import { useEffect, useState, useCallback } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { type Article, type ArticlesContent, defaultArticlesData } from '@/lib/data/content/articles';
import { Skeleton } from '@/components/ui/skeleton';
import { format, type Locale } from 'date-fns';
import { sr, ru, srLatn, enUS } from 'date-fns/locale';
import type { LanguageCode } from '@/types/content';

const localeMap: Record<LanguageCode, Locale> = {
  "en": enUS,
  "se": sr,
  "ru": ru,
  "sr": srLatn,
};

function ArticlePageSkeleton() {
  return (
    <div className="bg-muted/30">
      <div className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
        <div className="mb-8">
          <Skeleton className="h-10 w-40" />
        </div>
        <header className="mb-8 text-center">
          <Skeleton className="h-12 w-full mx-auto mb-4" />
          <div className="flex items-center justify-center gap-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
          </div>
        </header>
        <Skeleton className="aspect-video w-full rounded-lg mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-4/6" />
        </div>
      </div>
    </div>
  )
}

export default function ArticlePage() {
  const params = useParams();
  const { language } = useLanguage();
  const { content: t, loading: tLoading } = useContent(['article_back_button']);

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  const slug = params.slug as string;

  const fetchArticle = useCallback(async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'articles', slug);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setArticle(docSnap.data() as Article);
      } else {
        console.log("Article not found in 'articles' collection, checking fallback...");
        // Fallback to local data if not found in DB (e.g. for static pages not yet in DB)
        const foundArticle = defaultArticlesData.articles.find(a => a.slug === slug);
        if (foundArticle) {
          setArticle(foundArticle);
        } else {
          setArticle(null);
        }
      }
    } catch (error) {
      console.error("Error fetching article:", error);
      setArticle(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);


  if (loading) {
    return <ArticlePageSkeleton />;
  }

  if (!article) {
    notFound();
  }

  const title = article.title[language] || article.title['sr'];
  const content = article.content[language] || article.content['sr'];
  const author = article.author[language] || article.author['sr'];

  return (
    <div className="bg-muted/30">
      <div className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
        <article>
          <div className="mb-8">
            <Button asChild variant="outline">
              <Link href={`/${language}/articles`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {tLoading ? '...' : t['article_back_button']}
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
                <span>{format(new Date(article.date), 'd. MMMM yyyy.', { locale: localeMap[language] })}</span>
              </div>
            </div>
          </header>

          <div className="relative aspect-video rounded-lg overflow-hidden mb-8 shadow-xl">
            <Image
              src={article.image}
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

export const revalidate = 3600; // Revalidate every hour by default
