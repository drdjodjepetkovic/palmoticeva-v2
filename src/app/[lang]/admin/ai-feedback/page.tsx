"use client";

import { MyProfileSidebarNav } from "@/components/layout/my-profile-sidebar-nav";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUnansweredQuestions } from "@/lib/actions/admin-actions";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function AiFeedbackPage() {
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUnansweredQuestions().then(res => {
            if (res.questions) setQuestions(res.questions);
            setLoading(false);
        });
    }, []);

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">AI Feedback</h2>
                <p className="text-muted-foreground">Pitanja na koja AI nije znao odgovor.</p>
            </div>
            <Separator className="my-6" />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="lg:w-1/5">
                    <MyProfileSidebarNav />
                </aside>
                <div className="flex-1 lg:max-w-5xl">
                    {loading ? <Skeleton className="h-60 w-full" /> : questions.length === 0 ? (
                        <Card><CardContent className="pt-6">Nema zabeleženih neodgovorenih pitanja.</CardContent></Card>
                    ) : (
                        <div className="space-y-4">
                            {questions.map((q, i) => (
                                <Card key={i}>
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between">
                                            <CardTitle className="text-sm font-medium">Korisnik: {q.userName}</CardTitle>
                                            <Badge variant="outline">{new Date(q.createdAt).toLocaleDateString()}</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div>
                                                <span className="font-semibold text-xs text-muted-foreground">Pitanje:</span>
                                                <p>{q.userQuestion}</p>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-xs text-muted-foreground">Odgovor:</span>
                                                <p className="text-sm text-muted-foreground bg-muted p-2 rounded">{q.modelAnswer}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
