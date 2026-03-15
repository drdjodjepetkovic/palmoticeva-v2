
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from "@/context/language-context";
import { useContent } from "@/hooks/use-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { ServiceCategory } from '@/lib/data/pricelist';
import Link from 'next/link';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import * as LucideIcons from 'lucide-react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { defaultPricelistData } from '@/lib/data/pricelist';

const PDF_URL = "https://firebasestorage.googleapis.com/v0/b/beta-39fae.firebasestorage.app/o/docs%2Fcenovnik-usluga-ginekologija-palmoticeva.pdf?alt=media&token=7c90e489-ffa3-49fa-93b8-77f0b3749e5f";

const contentIds = [
  'pricelistTitle',
  'downloadPricelist',
  'searchServices',
  'noServicesFound'
];

const getIcon = (name: string): React.ElementType => {
  const IconComponent = (LucideIcons as any)[name];
  return IconComponent || LucideIcons.HelpCircle;
};

const CATEGORIES_PER_PAGE = 5;

export default function PricelistPage() {
  const { language } = useLanguage();
  const { content } = useContent(contentIds);
  const [searchTerm, setSearchTerm] = useState('');
  const [allCategories, setAllCategories] = useState<ServiceCategory[]>([]);
  const [visibleCategories, setVisibleCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver>();
  const lastElementRef = useCallback((node: any) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  const T = (id: string, fallback?: string) => content[id] || fallback || id;

  const fetchContent = useCallback(async () => {
    setIsLoading(true);
    try {
      const docRef = doc(db, 'page_content', 'pricelist');
      const docSnap = await getDoc(docRef);
      let dataToSet: ServiceCategory[] = [];
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Force update if version mismatch
        if (!data.version || data.version < defaultPricelistData.version) {
          await setDoc(docRef, defaultPricelistData, { merge: true });
          dataToSet = defaultPricelistData.categories;
        } else {
          dataToSet = data.categories;
        }
      } else {
        await setDoc(docRef, defaultPricelistData, { merge: true });
        dataToSet = defaultPricelistData.categories;
      }
      setAllCategories(dataToSet);
      setVisibleCategories(dataToSet.slice(0, CATEGORIES_PER_PAGE));
      setHasMore(dataToSet.length > CATEGORIES_PER_PAGE);
    } catch (error) {
      console.error("Error fetching pricelist content: ", error);
      setAllCategories(defaultPricelistData.categories);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  useEffect(() => {
    if (page > 1) {
      const nextPageCategories = allCategories.slice(0, page * CATEGORIES_PER_PAGE);
      setVisibleCategories(nextPageCategories);
      setHasMore(allCategories.length > nextPageCategories.length);
    }
  }, [page, allCategories]);

  const filteredCategories = (searchTerm ? allCategories : visibleCategories)
    .map(category => ({
      ...category,
      services: category.services.filter(service =>
        (service.name[language] || service.name['se-lat'])?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.category_name[language] || category.category_name['se-lat'])?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter(category => category.services.length > 0);

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <header className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
        <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4">{T('pricelistTitle')}</h1>
        <div className="w-24 h-1 bg-primary mx-auto rounded-full opacity-50" />
      </header>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
          <Button asChild variant="outline" size="lg" className="rounded-full px-8 hover:bg-primary/5 border-primary/20 transition-all duration-300">
            <a href={PDF_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <LucideIcons.Download className="h-5 w-5" />
              <span>{T('downloadPricelist')}</span>
            </a>
          </Button>
        </div>

        {/* Quick Links Navigation */}
        {!isLoading && allCategories.length > 0 && (
          <div className="mb-8 animate-in fade-in delay-300 fill-mode-both">
            <ScrollArea className="w-full whitespace-nowrap pb-4">
              <div className="flex w-max space-x-4 px-1">
                {allCategories.map((cat) => {
                  const Icon = getIcon(cat.icon);
                  return (
                    <button
                      key={cat.category_key}
                      onClick={() => {
                        const element = document.getElementById(cat.category_key);
                        if (element) {
                          const offset = 140; // sticky header + slack
                          const elementPosition = element.getBoundingClientRect().top;
                          const offsetPosition = elementPosition + window.pageYOffset - offset;
                          window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                          });
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/10 bg-background/40 backdrop-blur-sm hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 text-sm font-medium"
                    >
                      <Icon className="h-4 w-4 text-primary" />
                      {cat.category_name[language] || cat.category_name['se-lat']}
                    </button>
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" className="hidden" />
            </ScrollArea>
          </div>
        )}

        <div className="sticky top-[65px] z-10 py-4 mb-12 bg-background/80 backdrop-blur-xl border-b border-primary/5 -mx-4 px-4 transition-all duration-300">
          <div className="relative max-w-2xl mx-auto">
            <LucideIcons.Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/40" />
            <Input
              type="text"
              placeholder={T('searchServices')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-lg h-14 pr-12 rounded-2xl border-primary/10 bg-background/50 focus:bg-background/80 shadow-inner transition-all duration-300"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-6">{Array.from({ length: 4 }).map((_, i) => (<Card key={i} className="shadow-lg"><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /></CardContent></Card>))}</div>
        ) : filteredCategories.length > 0 ? (
          <div className="space-y-6">
            <TooltipProvider>
              {filteredCategories.map((category, catIndex) => {
                const Icon = getIcon(category.icon);
                const isLastCategory = catIndex === filteredCategories.length - 1;
                return (
                  <Card
                    key={category.category_key}
                    id={category.category_key}
                    ref={isLastCategory ? lastElementRef : null}
                    className="shadow-premium hover:shadow-premium-xl transition-all duration-500 border-primary/10 bg-background/60 backdrop-blur-xl group overflow-hidden animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
                    style={{ animationDelay: `${(catIndex % CATEGORIES_PER_PAGE) * 150}ms` }}
                  >
                    <CardHeader className="relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <CardTitle className="flex items-center gap-3 text-primary text-xl relative z-10">
                        <div className="p-2 rounded-xl bg-primary/5 text-primary">
                          <Icon className="h-6 w-6" />
                        </div>
                        {category.category_name[language] || category.category_name['se-lat']}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <ul className="divide-y divide-primary/5">
                        {category.services.map((service, index) => (
                          <li key={index} className="py-4 flex justify-between items-center gap-6 hover:bg-primary/[0.02] -mx-4 px-4 transition-colors duration-200">
                            <div className="flex-1 flex items-center gap-2 min-w-0">
                              <span className="text-foreground min-w-0 break-words text-sm">{service.name[language] || service.name['se-lat']}</span>
                              {service.slug && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Link href={`/${language}/articles/${service.slug}`} passHref>
                                      <LucideIcons.Newspaper className="h-4 w-4 text-primary hover:text-primary/80 cursor-pointer flex-shrink-0" />
                                    </Link>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Pročitaj više o ovoj usluzi</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                              {(service.description?.[language] || service.description?.['se-lat']) && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button>
                                      <LucideIcons.Info className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent><p className="max-w-xs">{service.description[language] || service.description['se-lat']}</p></TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                            <span className="font-semibold text-muted-foreground whitespace-nowrap text-right flex-shrink-0 text-sm">{service.price}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )
              })}
            </TooltipProvider>
            {hasMore && !searchTerm && <div className="text-center p-4"><Skeleton className="h-6 w-24 mx-auto" /></div>}
          </div>
        ) : (
          <p className="text-center text-muted-foreground mt-10">{T('noServicesFound')}</p>
        )}
      </div>
    </div>
  );
}
