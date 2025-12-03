"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getUserDetails, verifyUser, deleteUser, type UserDetails } from "@/lib/actions/admin-actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { CheckCircle, Trash2, ArrowLeft, Calendar, Activity } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function AdminUserPage() {
    const params = useParams();
    const uid = params.uid as string;
    const [data, setData] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (uid) {
            loadUser();
        }
    }, [uid]);

    const loadUser = async () => {
        setLoading(true);
        const result = await getUserDetails(uid);
        if (result.data) {
            setData(result.data);
        }
        setLoading(false);
    };

    const handleVerify = async () => {
        if (!confirm("Da li ste sigurni da želite da verifikujete ovog korisnika?")) return;
        const result = await verifyUser(uid);
        if (result.success) {
            toast({ title: "Uspešno", description: "Korisnik je verifikovan." });
            loadUser();
        } else {
            toast({ variant: "destructive", title: "Greška", description: result.error });
        }
    };

    const handleDelete = async () => {
        if (!confirm("PAŽNJA: Ovo će trajno obrisati korisnika i sve njegove podatke. Da li ste sigurni?")) return;
        const result = await deleteUser(uid);
        if (result.success) {
            toast({ title: "Uspešno", description: "Korisnik je obrisan." });
            router.push('/sr/admin');
        } else {
            toast({ variant: "destructive", title: "Greška", description: result.error });
        }
    };

    if (loading) {
        return <div className="container mx-auto py-8"><Skeleton className="h-96 w-full" /></div>;
    }

    if (!data) {
        return <div className="container mx-auto py-8">Korisnik nije pronađen.</div>;
    }

    const { profile, cycles, events } = data;

    return (
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Link href="/sr/admin" className="flex items-center text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Nazad na Admin Panel
            </Link>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">{profile.displayName || 'Nepoznat Korisnik'}</h1>
                    <p className="text-muted-foreground">{profile.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge variant={profile.role === 'verified' ? 'default' : 'secondary'}>
                            {profile.role}
                        </Badge>
                        {profile.verificationRequested && (
                            <Badge variant="destructive">Zahteva Verifikaciju</Badge>
                        )}
                    </div>
                </div>
                <div className="flex gap-2">
                    {profile.role !== 'verified' && (
                        <Button onClick={handleVerify} className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Verifikuj
                        </Button>
                    )}
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Obriši
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                    <CardHeader><CardTitle>Informacije</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Telefon:</span>
                            <span>{profile.phone || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Kreiran:</span>
                            <span>{profile.createdAt ? format(new Date(profile.createdAt), 'dd.MM.yyyy') : '-'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">UID:</span>
                            <span className="text-xs font-mono">{profile.uid}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <Tabs defaultValue="cycles">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Podaci</CardTitle>
                                <TabsList>
                                    <TabsTrigger value="cycles">Ciklusi ({cycles.length})</TabsTrigger>
                                    <TabsTrigger value="events">Događaji ({events.length})</TabsTrigger>
                                </TabsList>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <TabsContent value="cycles" className="space-y-4">
                                {cycles.length === 0 ? <p className="text-muted-foreground">Nema podataka o ciklusima.</p> : (
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {cycles.map(cycle => (
                                            <div key={cycle.id} className="flex justify-between items-center p-2 border rounded">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <span>{format(cycle.startDate, 'dd.MM.yyyy')}</span>
                                                    {cycle.endDate && <span> - {format(cycle.endDate, 'dd.MM.yyyy')}</span>}
                                                </div>
                                                <Badge variant="outline">{cycle.type}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>
                            <TabsContent value="events" className="space-y-4">
                                {events.length === 0 ? <p className="text-muted-foreground">Nema zabeleženih događaja.</p> : (
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {events.map(event => (
                                            <div key={event.id} className="flex justify-between items-center p-2 border rounded">
                                                <div className="flex items-center gap-2">
                                                    <Activity className="h-4 w-4 text-muted-foreground" />
                                                    <span>{format(new Date(event.date), 'dd.MM.yyyy')}</span>
                                                </div>
                                                <div className="flex gap-1">
                                                    {/* Display some flags */}
                                                    {event.pain && <Badge variant="secondary" className="text-xs">Bol</Badge>}
                                                    {event.mood && <Badge variant="secondary" className="text-xs">Raspoloženje</Badge>}
                                                    {event.intercourse && <Badge variant="secondary" className="text-xs">Odnosi</Badge>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>
                        </CardContent>
                    </Tabs>
                </Card>
            </div>
        </div>
    );
}
