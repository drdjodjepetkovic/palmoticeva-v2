
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader2, Lock } from "lucide-react";
import { format, getDay, parseISO } from "date-fns";
import { useContent } from "@/hooks/use-content";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/context/language-context";
import { sr, ru, srLatn, enUS } from 'date-fns/locale';
import type { LanguageCode } from '@/types/content';
import type { Locale } from 'date-fns';
import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/hooks/use-auth";
import { auth, db, googleProvider, isConfigured, logAnalyticsEvent } from '@/lib/firebase/client';
import { signInWithPopup, updateEmail } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useEventBus } from "@/context/event-bus-context";
import { UserEventType } from "@/lib/events";
import { useSearchParams } from "next/navigation";


const contentIds = [
  "appointments_title",
  "appointments_inquiry_title",
  "appointments_tab_booking",
  "appointments_tab_contact",
  "appointments_fullname_label",
  "appointments_email_label",
  "appointments_phone_label",
  "appointments_date_label",
  "appointments_date_placeholder",
  "appointments_time_label",
  "appointments_time_morning",
  "appointments_time_midday",
  "appointments_time_afternoon",
  "appointments_message_label",
  "appointments_message_placeholder",
  "appointments_contact_message_placeholder",
  "appointments_submit_button",
  "appointments_contact_submit_button",
  "appointments_secure_text",
  "appointments_toast_success_title",
  "appointments_toast_success_desc",
  "appointments_toast_error_title",
  "appointments_toast_error_desc",
  "appointments_dialog_save_info_title",
  "appointments_dialog_save_info_desc",
  "appointments_dialog_save_info_confirm",
  "appointments_dialog_save_info_cancel",
  "appointments_dialog_update_profile_title",
  "appointments_dialog_update_profile_desc",
  "appointments_dialog_update_profile_confirm",
  "appointments_dialog_update_profile_cancel",
  "toast_profile_updated_title",
  "toast_profile_updated_desc",
  "toast_profile_update_error_title",
  "toast_profile_update_error_desc",
  "verification_request_sent_title",
  "verification_request_sent_desc",
  "verification_request_error_title",
];

const localeMap: Record<LanguageCode, Locale> = {
  "en": enUS,
  "se": sr,
  "ru": ru,
  "se-lat": srLatn,
};

const formSchema = z.object({
  fullName: z.string().min(2, "Ime i prezime su obavezni."),
  email: z.string().email("Unesite validnu email adresu."),
  phone: z.string().min(6, "Broj telefona je obavezan."),
  date: z.date({ required_error: "Datum je obavezan." }),
  time: z.enum(["morning", "midday", "afternoon"], { required_error: "Morate izabrati vreme." }),
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

type FormMode = 'appointment' | 'contact';
type PatientStatus = 'new' | 'existing';
type PostSubmitState = 'idle' | 'ask_status' | 'ask_save_new' | 'ask_login_existing' | 'ask_update_existing';

function AppointmentsPageContent() {
  const { content } = useContent(contentIds);
  const { toast } = useToast();
  const { language } = useLanguage();
  const { user, userProfile } = useAuth();
  const { emit } = useEventBus();
  const searchParams = useSearchParams();
  
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const [postSubmitState, setPostSubmitState] = useState<PostSubmitState>('idle');
  const [latestFormData, setLatestFormData] = useState<Partial<FormData> | null>(null);
  const [formMode, setFormMode] = useState<FormMode>('appointment');

  const T = (id: string, fallback?: string) => content[id] || fallback || id;
  const TS = (id: string) => content[id] ? content[id] : <Skeleton className="h-5 w-32" />;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      message: ""
    }
  });
  
  const handleTabChange = (value: string) => {
    const newMode = value as FormMode;
    setFormMode(newMode);
    if (newMode === 'contact') {
      form.setValue('date', new Date());
      form.setValue('time', 'morning');
      form.clearErrors(['date', 'time']);
    } else {
      // Correctly reset the date and time fields for the appointment tab
      form.resetField('date');
      form.resetField('time');
      form.clearErrors(['date', 'time']);
    }
  };

  useEffect(() => {
    const defaultValues: Partial<FormData> = {
        fullName: userProfile?.displayName || "",
        email: userProfile?.email || "",
        phone: userProfile?.phone || "",
        message: ""
    };

    const queryDate = searchParams.get('date');
    const queryTimeSlot = searchParams.get('timeSlot') as 'morning' | 'midday' | 'afternoon' | null;
    const queryMessage = searchParams.get('message');

    if (queryDate) {
        try {
            defaultValues.date = parseISO(queryDate);
        } catch (e) { console.error("Invalid date from query param", e); }
    }
    if (queryTimeSlot) {
        defaultValues.time = queryTimeSlot;
    }
    if (queryMessage) {
        defaultValues.message = queryMessage;
    }
    
    form.reset(defaultValues);

    if (formMode === 'contact') {
        form.setValue('date', new Date());
        form.setValue('time', 'morning');
    }
}, [userProfile, searchParams, form, formMode]);



  const handleSignIn = async (isExistingPatient: boolean = false) => {
    setPostSubmitState('idle');
    if (latestFormData) {
        localStorage.setItem('pending_user_data', JSON.stringify({
            displayName: latestFormData.fullName,
            phone: latestFormData.phone,
        }));
    }
    
    if (isExistingPatient) {
        localStorage.setItem('pending_verification_request', 'true');
    }

    try {
        await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
        if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
            console.error("Error signing in with Google: ", error);
        }
    }
  };

  const handleUpdateProfile = async () => {
    if (!user || !latestFormData) return;

    const updates: { displayName?: string, email?: string, phone?: string } = {};
    if (latestFormData.fullName && latestFormData.fullName !== userProfile?.displayName) {
        updates.displayName = latestFormData.fullName;
    }
    if (latestFormData.phone && latestFormData.phone !== userProfile?.phone) {
        updates.phone = latestFormData.phone;
    }
    if (latestFormData.email && latestFormData.email !== userProfile?.email) {
        updates.email = latestFormData.email;
    }

    if (Object.keys(updates).length > 0) {
        try {
            if (updates.email) {
                await updateEmail(user, updates.email);
            }
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, updates);
            toast({ title: T('toast_profile_updated_title'), description: T('toast_profile_updated_desc') });
        } catch (error: any) {
            console.error("Error updating profile:", error);
             if (error.code === 'auth/requires-recent-login') {
                toast({ variant: "destructive", title: T('toast_profile_update_error_title'), description: 'Promena email-a zahteva da ste se nedavno prijavili. Molimo, odjavite se pa prijavite ponovo.' });
            } else {
                toast({ variant: "destructive", title: T('toast_profile_update_error_title'), description: T('toast_profile_update_error_desc') });
            }
        }
    }
    setPostSubmitState('idle');
  };

  async function onSubmit(data: FormData) {
    const dataToSend = { ...data };

    try {
      const emailBody = {
        type: formMode,
        name: dataToSend.fullName,
        email: dataToSend.email,
        phone: dataToSend.phone,
        preferredDate: format(dataToSend.date, 'yyyy-MM-dd'),
        preferredTimeSlot: dataToSend.time,
        message: dataToSend.message || "",
      };

      const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setLatestFormData(dataToSend);

      emit(UserEventType.ToastShow, {
          title: T('appointments_toast_success_title'),
          description: T('appointments_toast_success_desc'),
      });
      
      logAnalyticsEvent(formMode === 'appointment' ? 'appointment_inquiry_sent' : 'contact_form_sent', {
        user_id: user?.uid || 'guest'
      });

      if (formMode === 'appointment' && user) {
        emit(UserEventType.BadgeUnlocked, { badgeKey: 'punctual' });
        const hasSentAppointment = sessionStorage.getItem('appointment_sent') === 'true';
        if (!hasSentAppointment) {
            emit(UserEventType.AppointmentInquirySent);
            sessionStorage.setItem('appointment_sent', 'true');
        }
      }
      
      if (!user) {
        setPostSubmitState('ask_status');
      } else {
         const hasChanged = dataToSend.fullName !== userProfile?.displayName || dataToSend.email !== userProfile?.email || dataToSend.phone !== userProfile?.phone;
         if (hasChanged) {
            setPostSubmitState('ask_update_existing');
         } else {
            form.reset({ fullName: userProfile?.displayName || "", email: userProfile?.email || "", phone: userProfile?.phone || "", message: "", date: formMode === 'contact' ? new Date() : undefined, time: formMode === 'contact' ? 'morning' : undefined });
         }
      }

    } catch (error) {
      console.error("Error submitting form:", error);
      emit(UserEventType.ToastShow, {
        title: T('appointments_toast_error_title'),
        description: T('appointments_toast_error_desc'),
        variant: "destructive",
      });
    }
  }
  
  const handleStatusSelect = (status: PatientStatus) => {
    if (status === 'new') {
        setPostSubmitState('ask_save_new');
    } else {
        setPostSubmitState('ask_login_existing');
    }
  }

  return (
    <>
    <div className="container mx-auto py-10 px-4 md:px-6 flex justify-center">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-primary">
            {formMode === 'appointment' ? T('appointments_title') : T('appointments_inquiry_title', 'Kontakt i Pitanja')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={formMode} onValueChange={handleTabChange} className="w-full mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="appointment">{T('appointments_tab_booking', 'Zakazivanje')}</TabsTrigger>
              <TabsTrigger value="contact">{T('appointments_tab_contact', 'Kontakt')}</TabsTrigger>
            </TabsList>
          </Tabs>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{TS('appointments_fullname_label')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{TS('appointments_email_label')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{TS('appointments_phone_label')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {formMode === 'appointment' && (
                <>
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>{TS('appointments_date_label')}</FormLabel>
                        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value as Date, "PPP", { locale: localeMap[language] })
                                ) : (
                                  <span>{T('appointments_date_placeholder')}</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value as Date}
                              onSelect={(date) => {
                                field.onChange(date);
                                setIsCalendarOpen(false);
                              }}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                                getDay(date) === 0 // 0 is Sunday
                              }
                              locale={localeMap[language]}
                              weekStartsOn={1} // 1 is Monday
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>{TS('appointments_time_label')}</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value as string}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4"
                          >
                            <FormItem>
                              <RadioGroupItem value="morning" id="morning" className="peer sr-only" />
                              <FormLabel
                                htmlFor="morning"
                                className="flex justify-center items-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                              >
                                {TS('appointments_time_morning')}
                              </FormLabel>
                            </FormItem>
                            <FormItem>
                              <RadioGroupItem value="midday" id="midday" className="peer sr-only" />
                              <FormLabel
                                htmlFor="midday"
                                className="flex justify-center items-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                              >
                                {TS('appointments_time_midday')}
                              </FormLabel>
                            </FormItem>
                            <FormItem>
                              <RadioGroupItem value="afternoon" id="afternoon" className="peer sr-only" />
                              <FormLabel
                                htmlFor="afternoon"
                                className="flex justify-center items-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                              >
                                {TS('appointments_time_afternoon')}
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {formMode === 'appointment'
                        ? T('appointments_message_label')
                        : T('appointments_inquiry_title', 'Kontakt i Pitanja')}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={formMode === 'appointment'
                          ? T('appointments_message_placeholder')
                          : T('appointments_contact_message_placeholder', 'Ukoliko imate bilo kakvih pitanja, nedoumica, ili su Vam potrebne dodatne informacije, napisite u ovom polju, rado cemo Vam odgovoriti na sva pitanja.')
                        }
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full text-lg py-6 bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/30 active:scale-95" disabled={form.formState.isSubmitting}>
                 {form.formState.isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                 {T('appointments_submit_button')}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                <Lock size={14} />
                <span>{TS('appointments_secure_text')}</span>
            </div>
        </CardContent>
      </Card>
    </div>
      <AlertDialog open={postSubmitState !== 'idle'} onOpenChange={() => setPostSubmitState('idle')}>
        <AlertDialogContent>
            {postSubmitState === 'ask_status' && (
                <>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Da li ste prvi put kod nas?</AlertDialogTitle>
                        <AlertDialogDescription>Izaberite jednu od opcija da nastavite.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-center gap-2">
                        <Button onClick={() => handleStatusSelect('new')}>Prvi put sam ovde</Button>
                        <Button onClick={() => handleStatusSelect('existing')} variant="outline">Već sam Vaš pacijent</Button>
                    </AlertDialogFooter>
                </>
            )}
            {postSubmitState === 'ask_save_new' && (
                <>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Drago nam je!</AlertDialogTitle>
                        <AlertDialogDescription>Da li želite da kreiramo nalog i sačuvamo Vaše podatke za ubuduće?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setPostSubmitState('idle')}>Ne, hvala</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleSignIn(false)} disabled={!isConfigured}>Da, sačuvaj podatke</AlertDialogAction>
                    </AlertDialogFooter>
                </>
            )}
            {postSubmitState === 'ask_login_existing' && (
                 <>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Prijavite se</AlertDialogTitle>
                        <AlertDialogDescription>Prijavite se na svoj nalog da biste postali verifikovani pacijent i ostvarili pun pristup aplikaciji.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setPostSubmitState('idle')}>Odustani</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleSignIn(true)} disabled={!isConfigured}>Prijavi se i verifikuj</AlertDialogAction>
                    </AlertDialogFooter>
                </>
            )}
            {postSubmitState === 'ask_update_existing' && (
                <>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{T('appointments_dialog_update_profile_title')}</AlertDialogTitle>
                        <AlertDialogDescription>{T('appointments_dialog_update_profile_desc')}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setPostSubmitState('idle')}>{T('appointments_dialog_update_profile_cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleUpdateProfile}>{T('appointments_dialog_update_profile_confirm')}</AlertDialogAction>
                    </AlertDialogFooter>
                </>
            )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function AppointmentsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppointmentsPageContent />
    </Suspense>
  )
}

    