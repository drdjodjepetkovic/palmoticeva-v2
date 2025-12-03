"use client";

import { useEffect, useState, useTransition, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Terminal, Search, User, Upload, Loader2, FileUp, Users, Newspaper, BarChart3, PieChart, BrainCircuit, FlaskConical, FolderKanban } from 'lucide-react';
import { useContent } from '@/features/content/content-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { searchUsers } from '@/lib/actions/admin-actions';
import { type UserProfile } from '@/core/types';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/lib/firebase/client';
import { MyProfileSidebarNav } from '@/components/layout/my-profile-sidebar-nav';
import { useLanguage } from '@/features/content/context/language-context';
import Link from 'next/link';
import AiInsights from '@/components/admin/ai-insights';


export default function AdminPage() {
    const { userProfile, loading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const { language } = useLanguage();

    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, startSearchTransition] = useTransition();
    const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
    const [showConflictDialog, setShowConflictDialog] = useState(false);

    const handleSyncAbout = async (force: boolean = false) => {
        try {
            const { defaultAboutPageContent } = await import('@/features/content/data/default-content');
            const { updateAboutPage } = await import('@/lib/actions/admin-actions');

            const result = await updateAboutPage(defaultAboutPageContent, force);

            if (result.status === 'conflict') {
                setShowConflictDialog(true);
                return;
            }

            if (result.success) {
                toast({
                    title: "Sinhronizacija O Nama završena",
                    description: "Uspešno ažurirano",
                    variant: "default",
                });
                setShowConflictDialog(false);
            } else {
                toast({
                    title: "Greška pri sinhronizaciji",
                    description: result.error || "Nepoznata greška",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Greška",
                description: "Došlo je do greške prilikom sinhronizacije.",
                variant: "destructive",
            });
        }
    };

    const handleSearch = (term: string) => {
        startSearchTransition(async () => {
            if (term.length > 2) {
                const result = await searchUsers(term);
                if (result.users) {
                    setSearchResults(result.users);
                }
            } else {
                setSearchResults([]);
            }
        });
    };

    useEffect(() => {
        if (!loading && userProfile?.role !== 'admin') {
            // router.push('/'); // Temporarily disabled for testing
        }
    }, [userProfile, loading, router]);

    if (loading) {
        return (
            <div className="container mx-auto py-10 px-4 md:px-6">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-1/4" />
                        <Skeleton className="h-4 w-1/2 mt-2" />
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">Admin Panel</h2>
            </div>
            <Separator className="my-6" />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="lg:w-1/5">
                    <MyProfileSidebarNav />
                </aside>
                <div className="flex-1 lg:max-w-5xl">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                        <Link href={`/${language}/admin`}>
                            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Korisnici</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">Upravljanje</div>
                                    <p className="text-xs text-muted-foreground">Pretraga i izmena korisnika</p>
                                </CardContent>
                            </Card>
                        </Link>
                        <Link href={`/${language}/admin/articles`}>
                            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Članci</CardTitle>
                                    <Newspaper className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">Sadržaj</div>
                                    <p className="text-xs text-muted-foreground">Uređivanje članaka i vesti</p>
                                </CardContent>
                            </Card>
                        </Link>
                        <Link href={`/${language}/admin/analytics`}>
                            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Analitika</CardTitle>
                                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">Pregled</div>
                                    <p className="text-xs text-muted-foreground">Statistika aplikacije</p>
                                </CardContent>
                            </Card>
                        </Link>
                        <Link href={`/${language}/admin/reports`}>
                            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Izveštaji</CardTitle>
                                    <PieChart className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">CSV</div>
                                    <p className="text-xs text-muted-foreground">Generisanje izveštaja</p>
                                </CardContent>
                            </Card>
                        </Link>
                        <Link href={`/${language}/admin/ai-feedback`}>
                            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">AI Feedback</CardTitle>
                                    <BrainCircuit className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">Učenje</div>
                                    <p className="text-xs text-muted-foreground">Analiza AI odgovora</p>
                                </CardContent>
                            </Card>
                        </Link>
                        <Link href={`/${language}/admin/ai-test`}>
                            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">AI Test</CardTitle>
                                    <FlaskConical className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">Testiranje</div>
                                    <p className="text-xs text-muted-foreground">Direktan test AI modela</p>
                                </CardContent>
                            </Card>
                        </Link>
                        <Link href={`/${language}/admin/storage-manager`}>
                            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Storage</CardTitle>
                                    <FolderKanban className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">Fajlovi</div>
                                    <p className="text-xs text-muted-foreground">Upravljanje fajlovima</p>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>

                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Pretraga Korisnika</CardTitle>
                            <CardDescription>Pronađite korisnika po imenu ili email adresi da vidite njihove unose.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        placeholder="Pretraži pacijente po imenu ili email-u..."
                                        className="pl-10"
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            handleSearch(e.target.value);
                                        }}
                                    />
                                </div>
                                {isSearching && <Loader2 className="animate-spin mx-auto" />}
                                {searchResults.length > 0 && (
                                    <div className="border rounded-md max-h-60 overflow-y-auto">
                                        {searchResults.map(user => (
                                            <Link href={`/${language}/admin/users/${user.uid}`} key={user.uid} className="block">
                                                <div className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer border-b">
                                                    <img src={user.photoURL || ''} alt="" className="h-8 w-8 rounded-full" />
                                                    <div>
                                                        <div className="font-semibold">{user.displayName}</div>
                                                        <div className="text-xs text-muted-foreground">{user.email}</div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Separator className="my-8" />

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">AI Statistika & Pitanja</h3>
                        <AiInsights />
                    </div>

                    <Separator className="my-8" />

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Upravljanje Sadržajem</h3>
                        <Card>
                            <CardHeader>
                                <CardTitle>Sinhronizacija Sadržaja</CardTitle>
                                <CardDescription>Otpremite statički sadržaj u bazu podataka.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Button
                                    onClick={async () => {
                                        const { articlesData } = await import('@/features/content/data/articles');
                                        const { addArticle } = await import('@/lib/actions/admin-actions');
                                        let successCount = 0;
                                        let errorCount = 0;
                                        for (const article of articlesData) {
                                            const content = {
                                                title: article.title.sr,
                                                summary: article.excerpt.sr,
                                                content: article.content.sr,
                                                category: article.category?.sr
                                            };
                                            const result = await addArticle(content, article.slug, article.coverImage, article.publishedAt);
                                            if (result.success) successCount++;
                                            else errorCount++;
                                        }
                                        toast({
                                            title: "Sinhronizacija članaka završena",
                                            description: `Uspešno: ${successCount}, Grešaka: ${errorCount}`,
                                            variant: errorCount > 0 ? "destructive" : "default",
                                        });
                                    }}
                                >
                                    <FileUp className="mr-2 h-4 w-4" />
                                    Sinhronizuj Članke
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={async () => {
                                        const { faqData } = await import('@/features/content/data/faq');
                                        const { addFAQ } = await import('@/lib/actions/admin-actions');
                                        let successCount = 0;
                                        let errorCount = 0;
                                        for (const item of faqData) {
                                            const result = await addFAQ(item);
                                            if (result.success) successCount++;
                                            else errorCount++;
                                        }
                                        toast({
                                            title: "Sinhronizacija FAQ završena",
                                            description: `Uspešno: ${successCount}, Grešaka: ${errorCount}`,
                                            variant: errorCount > 0 ? "destructive" : "default",
                                        });
                                    }}
                                >
                                    <FileUp className="mr-2 h-4 w-4" />
                                    Sinhronizuj FAQ
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={async () => {
                                        const { tipsData } = await import('@/features/content/data/tips');
                                        const { addTip } = await import('@/lib/actions/admin-actions');
                                        let successCount = 0;
                                        let errorCount = 0;
                                        for (const item of tipsData) {
                                            const result = await addTip(item);
                                            if (result.success) successCount++;
                                            else errorCount++;
                                        }
                                        toast({
                                            title: "Sinhronizacija Saveta završena",
                                            description: `Uspešno: ${successCount}, Grešaka: ${errorCount}`,
                                            variant: errorCount > 0 ? "destructive" : "default",
                                        });
                                    }}
                                >
                                    <FileUp className="mr-2 h-4 w-4" />
                                    Sinhronizuj Savete
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={() => handleSyncAbout(false)}
                                >
                                    <FileUp className="mr-2 h-4 w-4" />
                                    Sinhronizuj O Nama
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={async () => {
                                        const { defaultAboutPageContent } = await import('@/features/content/data/default-content');
                                        const { addHomeCard } = await import('@/lib/actions/admin-actions');
                                        let successCount = 0;
                                        let errorCount = 0;
                                        // @ts-ignore - home_cards exists in defaultAboutPageContent but might not be in the type definition explicitly if not updated, but it is in the file
                                        const cards = defaultAboutPageContent.home_cards || [];
                                        for (const card of cards) {
                                            const result = await addHomeCard(card);
                                            if (result.success) successCount++;
                                            else errorCount++;
                                        }
                                        toast({
                                            title: "Sinhronizacija Kartica završena",
                                            description: `Uspešno: ${successCount}, Grešaka: ${errorCount}`,
                                            variant: errorCount > 0 ? "destructive" : "default",
                                        });
                                    }}
                                >
                                    <FileUp className="mr-2 h-4 w-4" />
                                    Sinhronizuj Kartice
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={async () => {
                                        const { defaultAboutPageContent } = await import('@/features/content/data/default-content');
                                        const { addTestimonial } = await import('@/lib/actions/admin-actions');
                                        let successCount = 0;
                                        let errorCount = 0;
                                        // @ts-ignore
                                        const testimonials = defaultAboutPageContent.testimonialsPage?.items || [];
                                        for (const item of testimonials) {
                                            const result = await addTestimonial(item);
                                            if (result.success) successCount++;
                                            else errorCount++;
                                        }
                                        toast({
                                            title: "Sinhronizacija Iskustava završena",
                                            description: `Uspešno: ${successCount}, Grešaka: ${errorCount}`,
                                            variant: errorCount > 0 ? "destructive" : "default",
                                        });
                                    }}
                                >
                                    <FileUp className="mr-2 h-4 w-4" />
                                    Sinhronizuj Iskustva
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <AlertDialog open={showConflictDialog} onOpenChange={setShowConflictDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Konflikt u podacima</AlertDialogTitle>
                        <AlertDialogDescription>
                            Podaci u bazi se razlikuju od podataka u kodu. Ako nastavite, podaci u bazi će biti pregaženi verzijom iz koda.
                            <br /><br />
                            Da li ste sigurni da želite da nastavite?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Odustani (Zadrži Bazu)</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleSyncAbout(true)}>
                            Pregazi (Koristi Kod)
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
