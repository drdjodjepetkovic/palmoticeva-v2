"use client";

import { MyProfileSidebarNav } from "@/components/layout/my-profile-sidebar-nav";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/features/auth/auth-context";
import { FileText } from "lucide-react";

export default function ResultsPage() {
    const { userProfile } = useAuth();

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">Moji Rezultati</h2>
                <p className="text-muted-foreground">Pregled vaših medicinskih nalaza i izveštaja.</p>
            </div>
            <Separator className="my-6" />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="lg:w-1/5">
                    <MyProfileSidebarNav />
                </aside>
                <div className="flex-1 lg:max-w-2xl">
                    {userProfile?.role === 'verified' || userProfile?.role === 'admin' ? (
                        <div className="grid gap-4">
                            {/* Placeholder for results list */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Nema novih rezultata</CardTitle>
                                    <CardDescription>Trenutno nemate novih medicinskih nalaza.</CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Pristup Ograničen
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Morate biti verifikovani pacijent da biste videli svoje rezultate.</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
