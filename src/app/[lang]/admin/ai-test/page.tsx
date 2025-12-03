"use client";

import { MyProfileSidebarNav } from "@/components/layout/my-profile-sidebar-nav";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AiTestPage() {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">AI Test</h2>
                <p className="text-muted-foreground">Testiranje AI modela.</p>
            </div>
            <Separator className="my-6" />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="lg:w-1/5">
                    <MyProfileSidebarNav />
                </aside>
                <div className="flex-1 lg:max-w-5xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>AI Test</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Funkcionalnost u izradi.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
