"use client";

import { MyProfileSidebarNav } from "@/components/layout/my-profile-sidebar-nav";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateUsersReport, generateAiConversationsReport } from "@/lib/actions/admin-actions";
import { useState } from "react";
import { Loader2, Download } from "lucide-react";

export default function ReportsPage() {
    const [loading, setLoading] = useState<string | null>(null);

    const handleDownload = (csvData: string, filename: string) => {
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const runReport = async (type: 'users' | 'ai') => {
        setLoading(type);
        const input = { startDate: new Date(0), endDate: new Date() }; // All time
        let result;

        if (type === 'users') {
            result = await generateUsersReport(input);
        } else {
            result = await generateAiConversationsReport(input);
        }

        if (result.csvData) {
            handleDownload(result.csvData, `${type}_report_${new Date().toISOString().split('T')[0]}.csv`);
        } else {
            alert("Greška ili nema podataka: " + result.error);
        }
        setLoading(null);
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">Izveštaji</h2>
                <p className="text-muted-foreground">Generisanje CSV izveštaja.</p>
            </div>
            <Separator className="my-6" />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="lg:w-1/5">
                    <MyProfileSidebarNav />
                </aside>
                <div className="flex-1 lg:max-w-5xl space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Korisnici</CardTitle>
                            <CardDescription>Izveštaj o svim registrovanim korisnicima.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={() => runReport('users')} disabled={!!loading}>
                                {loading === 'users' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                                Preuzmi CSV
                            </Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>AI Konverzacije</CardTitle>
                            <CardDescription>Izveštaj o svim AI pitanjima i odgovorima.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={() => runReport('ai')} disabled={!!loading}>
                                {loading === 'ai' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                                Preuzmi CSV
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
