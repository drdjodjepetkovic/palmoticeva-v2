"use client";

import { useLanguage } from "@/context/language-context";
import { useContent } from "@/hooks/use-content";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { CURATED_ARTICLES, getLiveUrl } from "@/lib/data/content/curated-articles";
import { getAllCategoriesForSlug } from "@/lib/categories";

const contentIds = ['articles_title', 'articles_subtitle', 'articles_read_more'];

export default function ArticlesPage() {
  const { language } = useLanguage();
  const { content: t } = useContent(contentIds);

  const lang: 'sr' | 'en' | 'ru' =
    language === 'en' || language === 'ru' ? language : 'sr';

  return (
    <div className="container mx-auto px-4 md:px-6 py-10 md:py-14">
      <header className="text-center mb-10 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-headline font-bold tracking-tight text-primary">
          {t['articles_title'] || 'Naši Članci'}
        </h1>
        <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          {t['articles_subtitle'] || 'Saznajte više o ženskom zdravlju, prevenciji i najnovijim metodama lečenja.'}
        </p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
        {CURATED_ARTICLES.map((article) => {
          const title = article.title[language] || article.title['se-lat'];
          const excerpt = article.excerpt[language] || article.excerpt['se-lat'];
          const categories = getAllCategoriesForSlug(article.slug);

          return (
            <a
              key={article.slug}
              href={getLiveUrl(article.slug, language)}
              target="_blank"
              rel="noopener noreferrer"
              className="group block relative overflow-hidden rounded-2xl shadow-atelier hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] md:aspect-[16/10]">
                {/* Hero image */}
                <Image
                  src={article.headerImage}
                  alt={title}
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Navy gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#001a33]/95 via-[#002C51]/70 to-[#002C51]/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#001a33]/30 to-transparent" />

                {/* Content overlaid on image */}
                <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
                  {/* Category badges */}
                  {categories.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      {categories.map((cat) => (
                        <span
                          key={cat.key}
                          className="text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm border border-white/10"
                          style={{ backgroundColor: `${cat.color}cc` }}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-3 h-3"
                          >
                            {cat.iconPaths.map((d, i) => (
                              <path key={i} d={d} />
                            ))}
                          </svg>
                          {cat.label[lang]}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Title */}
                  <h2 className="font-headline text-white text-2xl md:text-[1.75rem] font-bold leading-tight tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
                    {title}
                  </h2>

                  {/* Excerpt */}
                  <p className="mt-2 text-white/80 text-[13px] md:text-sm leading-relaxed line-clamp-2">
                    {excerpt}
                  </p>

                  {/* Read more — opens on www.palmoticeva.com */}
                  <div className="mt-3 inline-flex items-center gap-1 text-white/90 text-xs font-semibold uppercase tracking-[2px]">
                    <span>{t['articles_read_more'] || 'Pročitaj'}</span>
                    <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </main>
    </div>
  );
}
