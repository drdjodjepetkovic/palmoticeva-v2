
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from "@/context/language-context";
import { StorySection } from "@/components/about/story-section";
import { ContactSection } from "@/components/about/contact-section";
import { TeamSection } from "@/components/about/team-section";
import { MapSection } from "@/components/about/map-section";
import { Skeleton } from '@/components/ui/skeleton';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from "@/lib/firebase/client";
import { type AboutPageContent, defaultAboutPageContent } from '@/lib/data/content';

function AboutPageSkeleton() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 space-y-12">
      <header className="text-center">
        <Skeleton className="h-10 w-3/4 mx-auto" />
      </header>
      <main className="grid grid-cols-1 gap-12 md:gap-16">
        <Skeleton className="h-96 w-full" />
        <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
        </div>
        <Skeleton className="h-96 w-full" />
      </main>
    </div>
  )
}

export default function AboutPage() {
  const { language } = useLanguage();
  const [content, setContent] = useState<AboutPageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchContent = useCallback(async () => {
    setIsLoading(true);
    try {
      const docRef = doc(db, 'page_content', 'about');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as AboutPageContent;
        // Check if home_cards exists, if not, seed it.
        if (!data.home_cards || data.home_cards.length === 0) {
          console.log("'home_cards' not found in 'about' document, seeding...");
          const updatedContent = { ...data, home_cards: defaultAboutPageContent.home_cards };
          await setDoc(docRef, updatedContent, { merge: true });
          setContent(updatedContent);
        } else {
          setContent(data);
        }
      } else {
        console.log("About document not found, seeding from default data...");
        await setDoc(docRef, defaultAboutPageContent, { merge: true });
        setContent(defaultAboutPageContent);
      }
    } catch (error) {
      console.error("Error fetching about page content: ", error);
      // Fallback to default content on error
      setContent(defaultAboutPageContent);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  if (isLoading || !content) {
    return <AboutPageSkeleton />;
  }

  return (
    <div className="bg-muted/40 py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6 space-y-12">
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
            {content.title?.[language]}
          </h1>
        </header>

        <main className="grid grid-cols-1 gap-12 md:gap-16">
          <StorySection story={content.story} />
          <ContactSection contact={content.contact} />
          <TeamSection team={content.team} />
          <MapSection map={content.map} contact={content.contact} footer={content.footer} />
        </main>
      </div>
    </div>
  );
}
