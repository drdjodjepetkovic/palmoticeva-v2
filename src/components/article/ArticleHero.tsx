"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getAllCategoriesForSlug } from '@/lib/categories';
import type { LanguageCode } from '@/types/content';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface ArticleHeroProps {
  title: string;
  headerImage: string;
  slug: string;
  language: LanguageCode;
  breadcrumbs: Breadcrumb[];
  excerpt?: string;
}

export function ArticleHero({
  title,
  headerImage,
  slug,
  language,
  breadcrumbs,
  excerpt,
}: ArticleHeroProps) {
  const allCategories = getAllCategoriesForSlug(slug);
  // categories.ts expects 'sr' | 'en' | 'ru' — map PWA's se/se-lat → sr
  const lang: 'sr' | 'en' | 'ru' =
    language === 'en' || language === 'ru' ? language : 'sr';

  return (
    <section className="relative min-h-[360px] lg:min-h-[480px] flex items-end overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={headerImage}
          alt={title}
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
        {/* Clinical Atelier navy gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#001a33]/95 via-[#002C51]/70 to-[#002C51]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#001a33]/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full pb-8 lg:pb-12 pt-20 lg:pt-28">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <nav
              className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[3px] mb-5"
              aria-label="Breadcrumb"
            >
              {breadcrumbs.map((bc, idx) => (
                <span key={idx} className="flex items-center gap-2">
                  {bc.href ? (
                    <Link
                      href={bc.href}
                      className="text-white/60 hover:text-white transition-colors no-underline"
                      prefetch={false}
                    >
                      {bc.label}
                    </Link>
                  ) : (
                    <span className="text-white/90">{bc.label}</span>
                  )}
                  {idx < breadcrumbs.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-white/30 stroke-[3]" />
                  )}
                </span>
              ))}
            </nav>
          )}

          {/* Title */}
          <h1 className="font-headline text-white text-[2rem] md:text-[2.6rem] lg:text-[3.2rem] font-bold leading-[1.08] tracking-tight max-w-[800px] drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
            {title}
          </h1>

          {/* Category badge(s) */}
          {allCategories.length > 0 && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              {allCategories.map((cat) => (
                <span
                  key={cat.key}
                  className="text-white text-[12px] font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm border border-white/10"
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

          {/* Excerpt */}
          {excerpt && (
            <p className="mt-4 text-white/80 text-[15px] lg:text-[16px] leading-relaxed max-w-[600px]">
              {excerpt}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
