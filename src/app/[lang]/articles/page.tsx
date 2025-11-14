"use client";

import { useLanguage } from "@/context/language-context";
import { useContent } from "@/hooks/use-content";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { type Article, type ArticlesContent, defaultArticlesData } from '@/lib/data/content/articles';
import { Skeleton } from "@/components/ui/skeleton";

const contentIds = ['articles_title', 'articles_subtitle', 'articles_read_more'];

function ArticlesPageSkeleton() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
       <header className="text-center mb-12">
          <Skeleton className="h-10 w-1/3 mx-auto mb-4" />
          <Skeleton className="h-6 w-2/3 mx-auto" />
       </header>
       <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="h-full flex flex-col overflow-hidden">
            <CardHeader className="p-0">
              <Skeleton className="aspect-video w-full" />
            </CardHeader>
            <CardContent className="p-6 flex flex-col flex-grow">
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-4" />
              <Skeleton className="h-4 w-1/3" />
            </CardContent>
          </Card>
        ))}
       </main>
    </div>
  );
}

export default function ArticlesPage() {
  const { language } = useLanguage();
  const { content: t, loading: tLoading } = useContent(contentIds);

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'page_content', 'articles');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as ArticlesContent;
        // Check version mismatch to auto-update content
        if (!data.version || data.version < defaultArticlesData.version) {
           console.log("Articles data out of date, updating...");
           await setDoc(docRef, defaultArticlesData, { merge: true });
           setArticles(defaultArticlesData.articles);
        } else {
           setArticles(data.articles || []);
        }
      } else {
        // Document doesn't exist, so seed it with default data
        console.log("Articles document not found, seeding...");
        await setDoc(docRef, defaultArticlesData);
        setArticles(defaultArticlesData.articles);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      // Fallback to local data on error
      setArticles(defaultArticlesData.articles);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);


  if (loading || tLoading) {
    return <ArticlesPageSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold tracking-tight text-primary">
          {t['articles_title'] || 'Naši Članci'}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          {t['articles_subtitle'] || 'Saznajte više o ženskom zdravlju, prevenciji i najnovijim metodama lečenja.'}
        </p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <Link key={article.slug} href={`/${language}/articles/${article.slug}`} className="group block">
            <Card className="h-full flex flex-col overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <CardHeader className="p-0">
                <div className="aspect-video relative">
                  <Image
                    src={article.image}
                    alt={article.title[language] || article.title['se-lat']}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6 flex flex-col flex-grow">
                <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                    {article.title[language] || article.title['se-lat']}
                </CardTitle>
                <CardDescription className="mt-2 text-sm text-muted-foreground flex-grow">
                    {article.summary[language] || article.summary['se-lat']}
                </CardDescription>
                <div className="mt-4 flex items-center text-sm font-semibold text-primary">
                  {t['articles_read_more']} <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </main>
    </div>
  );
}
