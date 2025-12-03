
"use client";

import { useLanguage } from "@/context/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hospital } from 'lucide-react';
import type { AboutPageContent } from "@/lib/data/content";

type StoryProps = {
  story: AboutPageContent['story']
}

export function StorySection({ story }: StoryProps) {
    const { language } = useLanguage();

    if (!story) return null;

    return (
        <section>
            <Card className="shadow-lg overflow-hidden bg-card/80 backdrop-blur-sm border-border/80">
                <CardHeader className="flex-row items-center gap-3">
                    <Hospital className="h-8 w-8 text-primary"/>
                    <CardTitle className="text-2xl">{story.title?.[language]}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                        {story.content?.[language]}
                    </p>
                    {story.imageUrl && (
                        <div className="aspect-video bg-muted rounded-lg overflow-hidden shadow-inner relative">
                            <img 
                                src={story.imageUrl}
                                alt={story.title?.[language] || "Čekaonica u ordinaciji Palmotićeva"}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>
    )
}
