
"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MyProfileSidebarNav } from '@/components/layout/my-profile-sidebar-nav';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { conversationalAgent, type ConversationalAgentInput } from '@/ai/flows/conversational-agent';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';
import { v4 as uuidv4 } from 'uuid';
import { doc, getDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { type Cycle, type DailyEvent } from '@/types/user';
import { addDays, differenceInDays, formatISO, isSameDay, isWithinInterval, startOfDay } from 'date-fns';

type MenstrualData = NonNullable<ConversationalAgentInput['menstrualData']>;

function AiTestPageSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-1/3 mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function AiTestPage() {
  const { user, loading, role } = useAuth();
  const { toast } = useToast();
  const { language } = useLanguage();
  
  const [isTesting, setIsTesting] = useState(false);
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [debugData, setDebugData] = useState<string | null>(null);

  const getMenstrualDataForAgent = async (userId: string): Promise<MenstrualData> => {
     try {
            const cycleDocRef = doc(db, 'users', userId, 'cycleData', 'main');
            const cycleDocSnap = await getDoc(cycleDocRef);

            if (!cycleDocSnap.exists()) {
                return { error: "Korisnica još nije podesila kalendar.", isPeriod: false, isFertile: false, isOvulation: false };
            }

            const cycleData = cycleDocSnap.data();
            const cycles: Cycle[] = cycleData.cycles?.map((c: any) => ({
                id: c.id,
                startDate: c.startDate.toDate(),
                endDate: c.endDate ? c.endDate.toDate() : null,
            })) || [];
            
            const avgCycleLength = cycleData.avgCycleLength || 28;
            const avgPeriodLength = cycleData.avgPeriodLength || 5;

            if (cycles.length === 0) {
                 return { error: "Korisnica još nije unela nijedan ciklus.", isPeriod: false, isFertile: false, isOvulation: false };
            }
            
            const today = startOfDay(new Date());
            const lastCycle = cycles.slice().sort((a,b) => b.startDate.getTime() - a.startDate.getTime())[0];

            // Is period today?
            let isPeriod = false;
            if (lastCycle && !lastCycle.endDate) { // Active cycle
                const daysIn = differenceInDays(today, lastCycle.startDate);
                if (daysIn >= 0 && daysIn < avgPeriodLength) {
                    isPeriod = true;
                }
            } else if (lastCycle && lastCycle.endDate) { // Completed cycle
                 if (isWithinInterval(today, { start: lastCycle.startDate, end: lastCycle.endDate })) {
                    isPeriod = true;
                 }
            }


            // Predictions
            const nextPredictedPeriodStart = addDays(lastCycle.startDate, avgCycleLength);
            
            const ovulationDate = addDays(nextPredictedPeriodStart, -14);
            const fertileWindowStartDate = addDays(ovulationDate, -4);
            const fertileWindowEndDate = addDays(ovulationDate, 1);

            const isOvulation = isSameDay(today, ovulationDate);
            const isFertile = isWithinInterval(today, { start: fertileWindowStartDate, end: fertileWindowEndDate });
            const daysUntilNextPeriod = differenceInDays(nextPredictedPeriodStart, today);

            const currentActiveCycle = cycles.slice().sort((a,b) => b.startDate.getTime() - a.startDate.getTime()).find(c => today >= c.startDate);
            const currentCycleDay = currentActiveCycle ? differenceInDays(today, currentActiveCycle.startDate) + 1 : undefined;

            // Fetch last 10 events
            const eventsRef = collection(db, 'users', userId, 'dailyEvents');
            const eventsQuery = query(eventsRef, orderBy('date', 'desc'), limit(10));
            const eventsSnapshot = await getDocs(eventsQuery);
            const loggedEvents = eventsSnapshot.docs.map(doc => {
                const data = doc.data() as DailyEvent;
                const eventEntries = Object.entries(data).filter(([key, value]) => key !== 'date' && key !== 'id' && value === true);
                // Return an object for each event type found in the document
                return eventEntries.map(([type]) => ({ date: data.date, type: type as any }));
            }).flat();


            const completedCycles = cycles.filter(c => c.endDate).sort((a,b) => b.startDate.getTime() - a.startDate.getTime());
            const pastCycles = completedCycles.slice(0, 5).map((cycle, index) => {
                const previousCycle = completedCycles[index + 1];
                const cycleLength = previousCycle ? differenceInDays(cycle.startDate, previousCycle.startDate) : avgCycleLength;
                const periodLength = cycle.endDate ? differenceInDays(cycle.endDate, cycle.startDate) + 1 : avgPeriodLength;
                return {
                    startDate: formatISO(cycle.startDate, { representation: 'date'}),
                    endDate: formatISO(cycle.endDate!, { representation: 'date'}),
                    periodLength,
                    cycleLength
                }
            });


            return {
                isPeriod,
                isFertile,
                isOvulation,
                currentCycleDay,
                daysUntilNextPeriod: daysUntilNextPeriod >= 0 ? daysUntilNextPeriod : undefined,
                lastPeriodStartDate: lastCycle?.startDate ? formatISO(lastCycle.startDate, { representation: 'date' }) : undefined,
                fertileWindowStartDate: formatISO(fertileWindowStartDate, { representation: 'date' }),
                fertileWindowEndDate: formatISO(fertileWindowEndDate, { representation: 'date' }),
                ovulationDate: formatISO(ovulationDate, { representation: 'date' }),
                nextPredictedPeriodStartDate: formatISO(nextPredictedPeriodStart, { representation: 'date' }),
                avgCycleLength,
                avgPeriodLength,
                loggedEvents,
                pastCycles,
            };

        } catch (e: any) {
            console.error("Error fetching menstrual data for agent:", e);
            return { error: `Internal server error: ${e.message}`, isPeriod: false, isFertile: false, isOvulation: false };
        }
  }

  const handleShowData = async () => {
    if (!user) {
        toast({ variant: 'destructive', title: 'Greška', description: 'Morate biti ulogovani.'});
        return;
    }
    const menstrualData = await getMenstrualDataForAgent(user.uid);
    setDebugData(JSON.stringify(menstrualData, null, 2));
  }

  const handleTest = async () => {
    if (!question.trim()){
        toast({ variant: 'destructive', title: 'Greška', description: 'Unesite pitanje.'});
        return;
    }

    setIsTesting(true);
    setResult(null);

    try {
        const menstrualData = await getMenstrualDataForAgent(user!.uid);

        const response = await conversationalAgent({
            question: question,
            history: [],
            userId: user?.uid,
            isLoggedIn: role !== 'unauthenticated' && !!user,
            language: language,
            conversationId: uuidv4(),
            menstrualData: menstrualData,
        });
        
        setResult(JSON.stringify(response, null, 2));

    } catch (e: any) {
        setResult(`GREŠKA: ${e.message}\n\n${e.stack}`);
    } finally {
        setIsTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <MyProfileSidebarNav />
          </aside>
          <div className="flex-1 lg:max-w-4xl">
            <AiTestPageSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">AI Test Stranica</h2>
        <p className="text-muted-foreground">Testiranje AI konverzacionog agenta sa podacima o ciklusu.</p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <MyProfileSidebarNav />
        </aside>
        <div className="flex-1 lg:max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Test Konverzacije</CardTitle>
              <CardDescription>
                Unesite pitanje za AI. Podaci o vašem ciklusu će automatski biti prikupljeni i poslati zajedno sa pitanjem.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Input 
                    placeholder="Npr: Kada mi je ovulacija?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    disabled={isTesting}
                />
                <div className="flex gap-2">
                    <Button onClick={handleTest} disabled={isTesting}>
                        {isTesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isTesting ? 'Testiranje...' : 'Pošalji Pitanje AI-u'}
                    </Button>
                    <Button onClick={handleShowData} variant="outline">Prikaži Podatke</Button>
                </div>

                {debugData && (
                    <Card className="bg-muted">
                        <CardHeader>
                            <CardTitle>Podaci koji se šalju AI</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="text-sm whitespace-pre-wrap">{debugData}</pre>
                        </CardContent>
                    </Card>
                )}

                {result && (
                    <Card className="bg-muted">
                        <CardHeader>
                            <CardTitle>Rezultat</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="text-sm whitespace-pre-wrap">{result}</pre>
                        </CardContent>
                    </Card>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
