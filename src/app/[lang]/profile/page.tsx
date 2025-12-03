"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useContent } from '@/features/content/content-context';
import { MyProfileSidebarNav } from '@/components/layout/my-profile-sidebar-nav';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/features/content/context/language-context';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { doc, updateDoc, writeBatch, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';
import ThemeSwitcher from '@/components/theme-switcher';
import { requestVerification, deleteUser } from '@/lib/actions/admin-actions';
import { getAuth, updateEmail, sendEmailVerification } from 'firebase/auth';
import { CycleService } from '@/features/cycle/cycle-service';

const contentIds = [
    'profile_title',
    'profile_description',
    'profile_verify_cta_title',
    'profile_verify_cta_desc',
    'profile_verify_cta_button',
    'profile_form_name_label',
    'profile_form_email_label',
    'profile_form_phone_label',
    'profile_form_save_button',
    'profile_toast_update_success_title',
    'profile_toast_update_success_desc',
    'profile_toast_update_error_title',
    'profile_toast_update_error_desc',
    'data_management',
    'deleteAllData',
    'deleteAllDataConfirmTitle',
    'deleteAllDataConfirmDesc',
    'cancel',
    'continue',
    'dataDeletedTitle',
    'dataDeletedDesc',
    'dataDeletedError',
    'verification_request_sent_title',
    'verification_request_sent_desc',
    'verification_request_error_title',
    'verification_request_pending_title',
    'verification_request_pending_desc'
];

const ProfileFormSchema = z.object({
    displayName: z.string().min(2, "Ime i prezime su obavezni."),
    email: z.string().email(),
    phone: z.string().optional(),
});
type ProfileFormData = z.infer<typeof ProfileFormSchema>;

function ProfileForm() {
    const { user, userProfile, loading } = useAuth();
    const { toast } = useToast();
    const { t } = useContent(); // Using t directly as fallback for missing contentIds logic in useContent hook if needed

    // Helper to get content or fallback
    const T = (id: string) => {
        // @ts-ignore
        return t[id] || "";
    };

    const form = useForm<ProfileFormData>({
        resolver: zodResolver(ProfileFormSchema),
        defaultValues: {
            displayName: "",
            email: "",
            phone: "",
        },
    });

    useEffect(() => {
        if (userProfile) {
            form.reset({
                displayName: userProfile.displayName || "",
                email: userProfile.email || user?.email || "",
                phone: userProfile.phone || "",
            });
        }
    }, [userProfile, user, form]);

    async function onSubmit(data: ProfileFormData) {
        if (!user) {
            toast({ variant: "destructive", title: "Greška", description: "Niste prijavljeni." });
            return;
        }

        const auth = getAuth();
        const curEmail = user.email?.trim() || "";
        const newEmail = data.email.trim();
        const emailChanged = newEmail && newEmail !== curEmail;

        try {
            if (emailChanged && auth.currentUser) {
                await updateEmail(auth.currentUser, newEmail);
                try { await sendEmailVerification(auth.currentUser); } catch { }

                const userDocRef = doc(db, 'users', user.uid);
                await updateDoc(userDocRef, {
                    email: newEmail,
                    displayName: data.displayName,
                    phone: data.phone || null,
                });
            } else {
                const userDocRef = doc(db, 'users', user.uid);
                await updateDoc(userDocRef, {
                    displayName: data.displayName,
                    phone: data.phone || null,
                });
            }

            toast({
                title: 'Sačuvano',
                description: emailChanged
                    ? 'Podaci su ažurirani. Poslali smo verifikacioni mejl na novu adresu.'
                    : 'Podaci su ažurirani.',
            });

            window.location.reload();
        } catch (error: any) {
            if (error?.code === 'auth/requires-recent-login') {
                toast({
                    variant: "destructive",
                    title: 'Greška',
                    description: "Zbog bezbednosti, prijavi se ponovo pa pokušaj promenu email-a.",
                });
            } else {
                console.error("Error updating profile:", error);
                toast({
                    variant: "destructive",
                    title: 'Greška',
                    description: 'Ažuriranje nije uspelo.',
                });
            }
        }
    }

    if (loading) {
        return (
            <Card>
                <CardContent className="pt-6 space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-1/3" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="pt-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="displayName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ime i Prezime</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Adresa</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Broj Telefona</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Sačuvaj Izmene
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

function ProfilePageSkeleton() {
    return (
        <div className="flex-1 space-y-8 p-8 pt-6 md:p-0">
            <div className="flex items-center justify-between space-y-2">
                <Skeleton className="h-8 w-1/4" />
            </div>
            <div className="space-y-4">
                <Card><CardContent className="pt-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
                <Card>
                    <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
                    <CardContent>
                        <Skeleton className="h-5 w-full mb-4" />
                        <Skeleton className="h-10 w-48" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function MyProfilePage() {
    const { user, userProfile, loading } = useAuth();
    const router = useRouter();
    const { language } = useLanguage();
    const { toast } = useToast();
    const [cycleStats, setCycleStats] = useState<any>(null);

    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push(`/${language}/login`);
        }
    }, [user, loading, router, language]);

    useEffect(() => {
        if (user) {
            CycleService.getMenstrualDataForAI(user.uid).then(data => {
                if (!data.error) {
                    setCycleStats(data);
                }
            });
        }
    }, [user]);

    const handleRequestVerification = async () => {
        if (!user) return;
        setIsVerifying(true);
        const result = await requestVerification(user.uid);
        setIsVerifying(false);

        if (result.success) {
            toast({
                title: 'Zahtev poslat',
                description: 'Vaš zahtev za verifikaciju je uspešno poslat. Dobićete obaveštenje kada bude odobren.',
            });
            window.location.reload();
        } else {
            toast({
                variant: 'destructive',
                title: 'Greška',
                description: result.error || 'Došlo je do greške prilikom slanja zahteva.',
            });
        }
    };

    const handleDeleteAllData = async () => {
        if (!user) return;
        try {
            const result = await deleteUser(user.uid);
            if (result.success) {
                setIsDeleteAlertOpen(false);
                toast({ title: 'Podaci obrisani', description: 'Svi vaši podaci su trajno obrisani.' });
                router.push(`/${language}`);
            } else {
                toast({ variant: 'destructive', title: 'Greška', description: result.error });
            }
        } catch (error) {
            console.error("Error deleting all data:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Došlo je do greške.' });
        }
    };

    if (loading || !user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                    <aside className="lg:w-1/5"><MyProfileSidebarNav /></aside>
                    <ProfilePageSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">Moj Profil</h2>
                <p className="text-muted-foreground">Upravljajte svojim podacima i podešavanjima.</p>
            </div>
            <Separator className="my-6" />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="lg:w-1/5"><MyProfileSidebarNav /></aside>
                <div className="flex-1 lg:max-w-2xl space-y-6">
                    <ProfileForm />

                    {/* Cycle Stats Summary */}
                    {cycleStats && (
                        <Card>
                            <CardHeader><CardTitle>Status Ciklusa</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Prosečna dužina ciklusa</p>
                                    <p className="text-xl font-bold">{cycleStats.avgCycleLength} dana</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Prosečna dužina menstruacije</p>
                                    <p className="text-xl font-bold">{cycleStats.avgPeriodLength} dana</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Sledeća menstruacija</p>
                                    <p className="text-lg font-semibold">{cycleStats.nextPredictedPeriodStartDate || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Ovulacija</p>
                                    <p className="text-lg font-semibold">{cycleStats.ovulationDate || 'N/A'}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Verifikacija naloga */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {userProfile?.verificationRequested
                                    ? 'Zahtev je na čekanju'
                                    : 'Verifikacija Naloga'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">
                                {userProfile?.verificationRequested
                                    ? 'Poslali ste zahtev za verifikaciju. Naš tim će ga obraditi u najkraćem roku.'
                                    : 'Verifikujte svoj nalog da biste dobili pristup naprednim funkcijama i rezultatima.'}
                            </p>
                            {userProfile?.role === 'verified' ? (
                                <Button disabled className="bg-green-600 text-white">
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Verifikovan
                                </Button>
                            ) : userProfile?.verificationRequested ? (
                                <Button disabled className="bg-muted text-muted-foreground">
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Zahtev poslat
                                </Button>
                            ) : (
                                <Button onClick={handleRequestVerification} disabled={isVerifying}>
                                    {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Zatraži Verifikaciju
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Tema */}
                    <Card>
                        <CardHeader><CardTitle>Izgled Aplikacije</CardTitle></CardHeader>
                        <CardContent><ThemeSwitcher /></CardContent>
                    </Card>

                    {/* Upravljanje podacima */}
                    <Card className="border-destructive">
                        <CardHeader><CardTitle className="text-destructive">Upravljanje podacima</CardTitle></CardHeader>
                        <CardContent>
                            <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                                <AlertDialogTrigger asChild>
                                    <Button className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                        Obriši sve moje podatke
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Da li ste sigurni?</AlertDialogTitle>
                                        <AlertDialogDescription>Ova akcija je nepovratna. Svi vaši podaci će biti trajno obrisani.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Otkaži</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDeleteAllData}>Obriši</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
