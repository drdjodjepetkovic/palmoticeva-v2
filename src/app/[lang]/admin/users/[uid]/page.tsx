
"use client";

import { useEffect, useState, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { getUserDetails, verifyUser, deleteUser, type UserDetails, sendNotificationToUser } from '@/lib/actions/admin-actions';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MyProfileSidebarNav } from '@/components/layout/my-profile-sidebar-nav';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, User, Calendar, Droplet, Heart, Frown, Smile, Sun, Moon, UserCheck, ShieldAlert, BadgeCheck, Trash2, Languages, Palette, Bell, Info, Send, Award } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, differenceInDays } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import type { DailyEvent, Cycle } from '@/types/user';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Textarea } from '@/components/ui/textarea';
import { getAllBadges } from '@/lib/data/content';
import { useContent } from '@/hooks/use-content';
import { cn } from '@/lib/utils';

const badgeContentIds = [
    'badge_our_patient_title', 'badge_our_patient_desc',
    'badge_explorer_title', 'badge_explorer_desc',
    'badge_routine_queen_title', 'badge_routine_queen_desc',
    'badge_punctual_title', 'badge_punctual_desc',
    'badge_ambassador_title', 'badge_ambassador_desc',
    'badge_golden_recommendation_title', 'badge_golden_recommendation_desc',
    'badge_installer_title', 'badge_installer_desc',
];

function SendNotificationCard({ userId }: { userId: string }) {
    const [message, setMessage] = useState('');
    const [isSending, startSendingTransition] = useTransition();
    const { toast } = useToast();

    const handleSend = () => {
        if (!message.trim()) return;
        startSendingTransition(async () => {
            const result = await sendNotificationToUser(userId, message);
            if (result.success) {
                toast({ title: "Poslato!", description: "Notifikacija je uspešno poslata korisniku." });
                setMessage('');
            } else {
                toast({ variant: 'destructive', title: "Greška", description: result.error });
            }
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pošalji Notifikaciju</CardTitle>
                <CardDescription>Pošaljite direktnu poruku/obaveštenje ovom korisniku.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Unesite tekst poruke..."
                    disabled={isSending}
                />
                <Button onClick={handleSend} disabled={isSending || !message.trim()}>
                    {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Send className="mr-2 h-4 w-4" />
                    Pošalji
                </Button>
            </CardContent>
        </Card>
    );
}


function UserDetailsPageSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                <Card><CardHeader><Skeleton className="h-5 w-24" /></CardHeader><CardContent><Skeleton className="h-20 w-full" /></CardContent></Card>
                <Card><CardHeader><Skeleton className="h-5 w-24" /></CardHeader><CardContent><Skeleton className="h-20 w-full" /></CardContent></Card>
            </div>
            <Card><CardHeader><Skeleton className="h-5 w-32" /></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>
        </div>
    );
}

const eventIcons: { [key in keyof Omit<DailyEvent, 'id' | 'date'>]: React.ElementType } = {
    intercourse: Heart,
    pain: Frown,
    spotting: Droplet,
    mood: Smile,
    hotFlashes: Sun,
    insomnia: Moon,
    routineCheckup: UserCheck,
    problemCheckup: ShieldAlert
};

export default function UserDetailsPage() {
    const { role, loading: authLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const { uid } = params as { uid: string };

    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { content, loading: tLoading } = useContent(badgeContentIds);

    useEffect(() => {
        if (authLoading) return;
        if (role !== 'admin') {
            router.push('/');
            return;
        }

        const fetchDetails = async () => {
            setIsLoading(true);
            const result = await getUserDetails(uid);
            if (result.error) {
                setError(result.error);
            } else if (result.data) {
                setUserDetails(result.data);
            }
            setIsLoading(false);
        };
        fetchDetails();
    }, [uid, role, authLoading, router]);
    
    const handleVerify = async () => {
        setIsVerifying(true);
        const result = await verifyUser(uid);
        if (result.success) {
            toast({ title: 'Uspeh!', description: 'Korisnik je uspešno verifikovan.' });
            // Optimistically update the UI
            setUserDetails(prev => prev ? ({ ...prev, profile: { ...prev.profile, role: 'verified' } }) : null);
        } else {
            toast({ variant: 'destructive', title: 'Greška', description: result.error || 'Verifikacija nije uspela.' });
        }
        setIsVerifying(false);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await deleteUser(uid);
        if (result.success) {
            toast({ title: 'Uspeh!', description: 'Korisnik je obrisan.' });
            router.push('/admin');
        } else {
            toast({ variant: 'destructive', title: 'Greška', description: result.error || 'Brisanje nije uspelo.' });
            setIsDeleting(false);
        }
    };

    const getInitials = (name?: string | null) => {
        if (!name) return 'K';
        return name.split(' ').map(n => n[0]).join('');
    };

    const renderEventBadges = (event: DailyEvent) => {
        return Object.entries(event)
            .filter(([key, value]) => key !== 'id' && key !== 'date' && value === true)
            .map(([key]) => {
                const Icon = eventIcons[key as keyof typeof eventIcons];
                return Icon ? <Icon key={key} className="h-4 w-4 text-muted-foreground" /> : null;
            });
    };

    const badges = userDetails ? getAllBadges(userDetails.profile, userDetails.cycles.length) : [];

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">Detalji Korisnika</h2>
                <p className="text-muted-foreground">Pregled svih podataka za izabranog korisnika.</p>
            </div>
            <Separator className="my-6" />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="lg:w-1/5">
                    <MyProfileSidebarNav />
                </aside>
                <div className="flex-1 lg:max-w-4xl">
                    {isLoading || tLoading ? (
                        <UserDetailsPageSkeleton />
                    ) : error ? (
                        <Alert variant="destructive">
                            <AlertTitle>Greška</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    ) : userDetails ? (
                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={userDetails.profile.photoURL || undefined} />
                                    <AvatarFallback>{getInitials(userDetails.profile.displayName)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-grow">
                                    <h3 className="text-2xl font-bold">{userDetails.profile.displayName}</h3>
                                    <p className="text-muted-foreground">{userDetails.profile.email}</p>
                                    <p className="text-sm text-muted-foreground">Telefon: {userDetails.profile.phone || 'N/A'}</p>
                                    <Badge variant={userDetails.profile.role === 'verified' ? 'default' : 'outline'} className="mt-2">
                                        {userDetails.profile.role}
                                    </Badge>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    {userDetails.profile.role === 'authenticated' && userDetails.profile.verificationRequested && (
                                        <Button onClick={handleVerify} disabled={isVerifying}>
                                            {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            <BadgeCheck className="mr-2 h-4 w-4" />
                                            Verifikuj
                                        </Button>
                                    )}
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                             <Button variant="destructive" disabled={isDeleting}>
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Obriši
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Da li ste sigurni?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Ova akcija će trajno obrisati korisnika i sve njegove podatke.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Otkaži</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                                                    {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                                    Obriši
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>

                            <Card>
                                <CardHeader><CardTitle className="flex items-center gap-2"><Info className="h-5 w-5 text-primary"/> Info</CardTitle></CardHeader>
                                <CardContent>
                                    <ul className="text-sm text-muted-foreground space-y-2">
                                        <li className="flex items-center gap-2"><Calendar className="h-4 w-4" /> <strong>Registrovan:</strong> {format(new Date(userDetails.profile.createdAt), 'dd.MM.yyyy HH:mm')}</li>
                                        <li className="flex items-center gap-2"><Languages className="h-4 w-4" /> <strong>Jezik:</strong> {userDetails.profile.preferredLanguage || 'N/A'}</li>
                                        <li className="flex items-center gap-2"><Palette className="h-4 w-4" /> <strong>Tema:</strong> {userDetails.profile.preferredTheme || 'theme-default'}</li>
                                        <li className="flex items-center gap-2"><Bell className="h-4 w-4" /> <strong>Nepročitanih notifikacija:</strong> {userDetails.profile.unreadNotifications || 0}</li>
                                        <li className="flex items-center gap-2"><UserCheck className="h-4 w-4" /> <strong>Zatražena verifikacija:</strong> {userDetails.profile.verificationRequested ? 'Da' : 'Ne'}</li>
                                        <li className="flex items-center gap-2"><Calendar className="h-4 w-4" /> <strong>Mod praćenja:</strong> {userDetails.profile.trackingMode || 'cycling'}</li>
                                        {userDetails.profile.lastPeriodDate && <li className="flex items-center gap-2"><Calendar className="h-4 w-4" /> <strong>Poslednja menstruacija:</strong> {format(new Date(userDetails.profile.lastPeriodDate), 'dd.MM.yyyy')}</li>}
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader><CardTitle className="flex items-center gap-2"><Award className="h-5 w-5 text-primary"/> Osvojeni Bedževi</CardTitle></CardHeader>
                                <CardContent className="space-y-3">
                                    {badges.map((badge) => {
                                        const Icon = badge.icon;
                                        return (
                                        <div key={badge.key} className={cn("flex items-center gap-4 transition-opacity", !badge.unlocked && "opacity-40")}>
                                            <div className={cn("flex-shrink-0 rounded-full h-10 w-10 flex items-center justify-center", badge.unlocked ? `${badge.colorClass} bg-opacity-10` : 'bg-muted')}>
                                            <Icon className={cn("h-5 w-5", badge.unlocked ? badge.colorClass : 'text-muted-foreground')} />
                                            </div>
                                            <div>
                                            <h3 className="font-semibold">{content[badge.titleKey]}</h3>
                                            <p className="text-sm text-muted-foreground">{content[badge.descKey]}</p>
                                            </div>
                                        </div>
                                        );
                                    })}
                                </CardContent>
                            </Card>
                            
                            <SendNotificationCard userId={uid} />

                            <Card>
                                <CardHeader><CardTitle>Ciklusi</CardTitle></CardHeader>
                                <CardContent>
                                    {userDetails.cycles.length > 0 ? (
                                        <div className="space-y-2">
                                            {userDetails.cycles.slice().reverse().map(cycle => (
                                                <div key={cycle.id} className="flex justify-between items-center p-2 rounded-md border">
                                                    <div>
                                                        <span className="font-semibold">
                                                            {format(cycle.startDate, 'dd.MM.yyyy')} - {cycle.endDate ? format(cycle.endDate, 'dd.MM.yyyy') : '...'}
                                                        </span>
                                                    </div>
                                                    <Badge variant={cycle.type === 'irregular' ? 'destructive' : 'outline'}>{cycle.type}</Badge>
                                                    <span className="text-sm text-muted-foreground">
                                                        {cycle.endDate ? `${differenceInDays(cycle.endDate, cycle.startDate) + 1} dana` : 'Aktivan'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : <p className="text-muted-foreground text-sm">Nema unetih ciklusa.</p>}
                                </CardContent>
                            </Card>

                             <Card>
                                <CardHeader><CardTitle>Dnevni Unosi</CardTitle></CardHeader>
                                <CardContent>
                                    {userDetails.events.length > 0 ? (
                                        <div className="space-y-2">
                                            {userDetails.events.map(event => (
                                                <div key={event.id} className="flex justify-between items-center p-2 rounded-md border">
                                                    <span className="font-semibold">{format(new Date(event.date), 'dd.MM.yyyy')}</span>
                                                    <div className="flex gap-2">
                                                        {renderEventBadges(event)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : <p className="text-muted-foreground text-sm">Nema dnevnih unosa.</p>}
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <p>Nema podataka za ovog korisnika.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

    