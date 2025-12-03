'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getAiLogs, type AiLog } from '@/lib/actions/admin-actions';
import { Loader2, MessageSquare, Activity, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from "@/features/content/context/language-context";
import { useContent } from "@/features/content/content-context";

export default function AiInsights() {
    const { language } = useLanguage();
    const { t } = useContent();
    const [logs, setLogs] = useState<AiLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, topTopic: '', actionCount: 0 });
    const [topTopics, setTopTopics] = useState<{ word: string, count: number }[]>([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const data = await getAiLogs(100);
                setLogs(data);
                calculateStats(data);
            } catch (error) {
                console.error('Failed to fetch AI logs', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    const calculateStats = (data: AiLog[]) => {
        const total = data.length;
        const actionCount = data.filter(l => l.action).length;

        // Simple word frequency analysis
        const stopWords = new Set(['je', 'da', 'u', 'i', 'se', 'na', 'za', 'od', 'ili', 'ali', 'pa', 'te', 'ni', 'ne', 'a', 'the', 'is', 'to', 'in', 'of', 'and', 'for', 'kakvo', 'kako', 'šta', 'kad', 'kada', 'gde', 'koji', 'koja', 'koje', 'imam', 'li', 'mi', 'me', 'moje', 'moj', 'moja', 'sam', 'si', 'su', 'bi', 'bih', 'bismo', 'biste', 'će', 'ću', 'ćemo', 'ćete', 'ćeš']);

        const wordCounts: Record<string, number> = {};

        data.forEach(log => {
            if (!log.question) return;
            const words = log.question.toLowerCase()
                .replace(/[.,?!;()"']/g, '')
                .split(/\s+/);

            words.forEach(word => {
                if (word.length > 2 && !stopWords.has(word)) {
                    wordCounts[word] = (wordCounts[word] || 0) + 1;
                }
            });
        });

        const sortedTopics = Object.entries(wordCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([word, count]) => ({ word, count }));

        setTopTopics(sortedTopics);
        setStats({
            total,
            actionCount,
            topTopic: sortedTopics[0]?.word || 'N/A'
        });
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t.admin.total_interactions}</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">{t.admin.last_100_queries}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t.admin.actions_performed}</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.actionCount}</div>
                        <p className="text-xs text-muted-foreground">{t.admin.actions_desc}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t.admin.top_topics}</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold capitalize">{stats.topTopic}</div>
                        <p className="text-xs text-muted-foreground">{t.admin.top_topic_desc}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>{t.admin.recent_interactions}</CardTitle>
                        <CardDescription>
                            {t.admin.recent_interactions_desc}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px] pr-4">
                            <div className="space-y-4">
                                {logs.map((log) => (
                                    <div key={log.id} className="flex flex-col space-y-2 border-b pb-4 last:border-0 last:pb-0">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-muted-foreground">
                                                {log.timestamp ? new Date(log.timestamp).toLocaleString(language === 'sr' ? 'sr-RS' : (language === 'ru' ? 'ru-RU' : 'en-US')) : 'N/A'}
                                            </span>
                                            {log.action && (
                                                <Badge variant="secondary" className="text-[10px]">
                                                    {log.action.type}
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="font-medium text-sm">
                                            Q: {log.question}
                                        </div>
                                        <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded-md">
                                            A: {log.answer.substring(0, 150)}{log.answer.length > 150 ? '...' : ''}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>{t.admin.popular_topics}</CardTitle>
                        <CardDescription>
                            {t.admin.popular_topics_desc}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {topTopics.map((topic) => (
                                <Badge key={topic.word} variant="outline" className="text-sm py-1 px-3">
                                    {topic.word} <span className="ml-1 text-xs text-muted-foreground opacity-70">({topic.count})</span>
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
