"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useContent } from '@/hooks/use-content';
import { MyProfileSidebarNav } from '@/components/layout/my-profile-sidebar-nav';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc, writeBatch, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';
import ThemeSwitcher from '@/components/theme-switcher';
import { requestVerification } from '@/lib/actions/admin-actions';

// ⬇️ DODATO: Firebase Auth za update email-a i verifikaciju
import { getAuth, updateEmail, sendEmailVerification } from 'firebase/auth';

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
  const { content, loading: contentLoading } = useContent(contentIds);

  const T = (id: string) => content[id] || "";

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
      toast({ variant: "destructive", title: T('profile_toast_update_error_title'), description: "You are not logged in." });
      return;
    }

    const auth = getAuth();
    const curEmail = user.email?.trim() || "";
    const newEmail = data.email.trim();
    const emailChanged = newEmail && newEmail !== curEmail;

    try {
      // 1) Ako je email promenjen — prvo Firebase Auth
      if (emailChanged && auth.currentUser) {
        await updateEmail(auth.currentUser, newEmail);
        // (opciono ali preporučeno) pošalji verifikacioni email
        try { await sendEmailVerification(auth.currentUser); } catch {}

        // upiši i u profil dokument (ako ga vodiš)
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          email: newEmail,
          displayName: data.displayName,
          phone: data.phone || null,
        });
      } else {
        // 2) Ako email nije menjan — samo profil polja
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          displayName: data.displayName,
          phone: data.phone || null,
        });
      }

      toast({
        title: T('profile_toast_update_success_title') || 'Sačuvano',
        description: emailChanged
          ? (T('profile_toast_update_success_desc') || 'Podaci su ažurirani. Poslali smo verifikacioni mejl na novu adresu.')
          : (T('profile_toast_update_success_desc') || 'Podaci su ažurirani.'),
      });

      // osveži UI da povuče nove podatke
      window.location.reload();
    } catch (error: any) {
      // specifična poruka za reauth scenarij
      if (error?.code === 'auth/requires-recent-login') {
        toast({
          variant: "destructive",
          title: T('profile_toast_update_error_title') || 'Greška',
          description: "Zbog bezbednosti, prijavi se ponovo pa pokušaj promenu email-a.",
        });
      } else {
        console.error("Error updating profile:", error);
        toast({
          variant: "destructive",
          title: T('profile_toast_update_error_title') || 'Greška',
          description: T('profile_toast_update_error_desc') || 'Ažuriranje nije uspelo.',
        });
      }
    }
  }

  if (loading || contentLoading) {
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
                  <FormLabel>{T('profile_form_name_label') || 'Full Name'}</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* ⬇️ Email je SADA OTKLJUČAN (može da se menja) */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{T('profile_form_email_label') || 'Email Address'}</FormLabel>
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
                  <FormLabel>{T('profile_form_phone_label') || 'Phone Number'}</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {T('profile_form_save_button') || 'Save Changes'}
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
  const { user, userProfile, role, loading } = useAuth();
  const router = useRouter();
  const { content } = useContent(contentIds);
  const { language } = useLanguage();
  const { toast } = useToast();

  const T = (id: string, fallback?: string) => content[id] || fallback || id;
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (!loading && role === 'unauthenticated') {
      router.push('/');
    }
  }, [role, loading, router]);

  const handleRequestVerification = async () => {
    if (!user) return;
    setIsVerifying(true);
    const result = await requestVerification(user.uid);
    setIsVerifying(false);

    if (result.success) {
      toast({
        title: T('verification_request_sent_title', 'Zahtev poslat'),
        description: T('verification_request_sent_desc', 'Vaš zahtev za verifikaciju je uspešno poslat. Dobićete obaveštenje kada bude odobren.'),
      });
      window.location.reload();
    } else {
      toast({
        variant: 'destructive',
        title: T('verification_request_error_title', 'Greška'),
        description: result.error || 'Došlo je do greške prilikom slanja zahteva.',
      });
    }
  };

  const handleDeleteAllData = async () => {
    if (!user) return;
    try {
      const batch = writeBatch(db);

      const cycleDocRef = doc(db, 'users', user.uid, 'cycleData', 'main');
      batch.delete(cycleDocRef);

      const eventsRef = collection(db, 'users', user.uid, 'dailyEvents');
      const eventsSnapshot = await getDocs(eventsRef);
      eventsSnapshot.forEach(d => batch.delete(d.ref));

      const userDocRef = doc(db, 'users', user.uid);
      batch.update(userDocRef, { hasCompletedOnboarding: false });

      await batch.commit();

      setIsDeleteAlertOpen(false);
      toast({ title: T('dataDeletedTitle'), description: T('dataDeletedDesc') });
      window.location.reload();
    } catch (error) {
      console.error("Error deleting all data:", error);
      toast({ variant: 'destructive', title: 'Error', description: T('dataDeletedError') });
    }
  };

  if (loading || role === 'unauthenticated') {
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
        <h2 className="text-2xl font-bold tracking-tight">{T('profile_title') || 'My Profile'}</h2>
        <p className="text-muted-foreground">{T('profile_description') || 'These are your profile details as they appear in our system.'}</p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5"><MyProfileSidebarNav /></aside>
        <div className="flex-1 lg:max-w-2xl space-y-6">
          <ProfileForm />
          {/* Verifikacija naloga */}
          {role === 'authenticated' && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {userProfile?.verificationRequested
                    ? T('verification_request_pending_title', 'Zahtev je na čekanju')
                    : T('profile_verify_cta_title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {userProfile?.verificationRequested
                    ? T('verification_request_pending_desc', 'Poslali ste zahtev za verifikaciju. Naš tim će ga obraditi u najkraćem roku.')
                    : T('profile_verify_cta_desc')}
                </p>
                {userProfile?.verificationRequested ? (
                  <Button disabled className="bg-muted text-muted-foreground">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {T('verification_request_sent_title', 'Zahtev poslat')}
                  </Button>
                ) : (
                  <Button onClick={handleRequestVerification} disabled={isVerifying}>
                    {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {T('profile_verify_cta_button')}
                    <ArrowRight className="ml-2 h-4 w-4"/>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Tema */}
          <Card>
            <CardHeader><CardTitle>Izgled Aplikacije</CardTitle></CardHeader>
            <CardContent><ThemeSwitcher /></CardContent>
          </Card>

          {/* Upravljanje podacima */}
          <Card className="border-destructive">
            <CardHeader><CardTitle className="text-destructive">{T('data_management') || 'Upravljanje podacima'}</CardTitle></CardHeader>
            <CardContent>
              <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                <AlertDialogTrigger asChild>
                  <Button className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    {T('deleteAllData') || 'Delete All My Data'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{T('deleteAllDataConfirmTitle') || 'Are you sure?'}</AlertDialogTitle>
                    <AlertDialogDescription>{T('deleteAllDataConfirmDesc') || 'This will permanently delete all your data.'}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{T('cancel') || 'Cancel'}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAllData}>{T('continue') || 'Continue'}</AlertDialogAction>
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
