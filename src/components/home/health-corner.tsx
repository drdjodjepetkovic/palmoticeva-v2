"use client";

import React, { useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, ArrowRight } from 'lucide-react';
import Link from "next/link";

interface HealthCornerProps {
    t: (id: string, fallback?: string) => React.ReactNode;
    language: string;
}

export function HealthCorner({ t, language }: HealthCornerProps) {
    const facts = useMemo(() => ['fact_1', 'fact_2', 'fact_3', 'fact_4', 'fact_5'], []);
    const [randomFactId, setRandomFactId] = React.useState('');

    useEffect(() => {
        setRandomFactId(facts[Math.floor(Math.random() * facts.length)]);
    }, [facts]);

    if (!randomFactId) return null;

    return (
        <Card className="bg-blue-500/10 border-blue-500/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-headline">
                    <Lightbulb className="h-6 w-6" />
                    {t('health_corner_title', 'Kutak Zdravlja')}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-sm text-blue-800 dark:text-blue-300">{t(randomFactId)}</div>
                <Button asChild variant="secondary" className="bg-white/80 text-blue-600 hover:bg-white">
                    <Link href={`/${language}/articles`}>
                        {t('health_corner_read_more', 'Pročitajte sve članke...')} <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
