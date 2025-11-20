
"use client";

import { runConversationalAgentV2 } from '@/app/actions/ai-actions';
import type { ConversationalAgentInput, ConversationalAgentOutput, HistoryItem } from '@/types/ai-types';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';
import { Send, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { VoiceInput } from './voice-input';
import { Badge } from '../ui/badge';
import { useContent } from '@/hooks/use-content';
import Logo from '../logo';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { v4 as uuidv4 } from 'uuid';
import { doc, getDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db, logAnalyticsEvent } from '@/lib/firebase/client';
import { type Cycle, type DailyEvent } from '@/types/user';
import { addDays, differenceInDays, formatISO, isSameDay, isWithinInterval, startOfDay } from 'date-fns';


interface Message {
  role: 'user' | 'model';
  text: string;
  followUpQuestions?: string[];
  navigation?: string;
}

type MenstrualData = NonNullable<ConversationalAgentInput['menstrualData']>;

const contentIds = [
  'aiGreeting',
  'aiGreetingGeneric',
  'aiFollowUpCycle1',
  'aiFollowUpCycle2',
  'aiFollowUpGeneral1',
  'aiError',
  'aiPlaceholder'
];

// This function is now part of the component to fetch menstrual data when needed.
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
      type: c.type || 'regular'
    })) || [];

    const avgCycleLength = cycleData.avgCycleLength || 28;
    const avgPeriodLength = cycleData.avgPeriodLength || 5;

    if (cycles.length === 0) {
      return { error: "Korisnica još nije unela nijedan ciklus.", isPeriod: false, isFertile: false, isOvulation: false };
    }

    const today = startOfDay(new Date());
    const lastCycle = cycles.filter(c => c.type === 'regular').sort((a, b) => b.startDate.getTime() - a.startDate.getTime())[0];

    if (!lastCycle) {
      return { error: "Nema unetih regularnih ciklusa.", isPeriod: false, isFertile: false, isOvulation: false };
    }

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

    const nextPredictedPeriodStart = addDays(lastCycle.startDate, avgCycleLength);
    const ovulationDate = addDays(nextPredictedPeriodStart, -14);
    const fertileWindowStartDate = addDays(ovulationDate, -4);
    const fertileWindowEndDate = addDays(ovulationDate, 1);

    const isOvulation = isSameDay(today, ovulationDate);
    const isFertile = isWithinInterval(today, { start: fertileWindowStartDate, end: fertileWindowEndDate });
    const daysUntilNextPeriod = differenceInDays(nextPredictedPeriodStart, today);

    const currentActiveCycle = cycles.filter(c => c.type === 'regular').sort((a, b) => b.startDate.getTime() - a.startDate.getTime()).find(c => today >= c.startDate);
    const currentCycleDay = currentActiveCycle ? differenceInDays(today, currentActiveCycle.startDate) + 1 : undefined;

    const eventsRef = collection(db, 'users', userId, 'dailyEvents');
    const eventsQuery = query(eventsRef, orderBy('date', 'desc'), limit(10));
    const eventsSnapshot = await getDocs(eventsQuery);
    const loggedEvents = eventsSnapshot.docs.map(doc => {
      const data = doc.data() as DailyEvent;
      const eventEntries = Object.entries(data).filter(([key, value]) => key !== 'date' && key !== 'id' && value === true);
      return eventEntries.map(([type]) => ({ date: data.date, type: type as any }));
    }).flat();

    const completedCycles = cycles.filter(c => c.endDate && c.type === 'regular').sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
    const pastCycles = completedCycles.slice(0, 5).map((cycle, index) => {
      const previousCycle = completedCycles[index + 1];
      const cycleLength = previousCycle ? differenceInDays(cycle.startDate, previousCycle.startDate) : avgCycleLength;
      const periodLength = cycle.endDate ? differenceInDays(cycle.endDate, cycle.startDate) + 1 : avgPeriodLength;
      return {
        startDate: formatISO(cycle.startDate, { representation: 'date' }),
        endDate: formatISO(cycle.endDate!, { representation: 'date' }),
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


export default function AiAssistant() {
  const { language } = useLanguage();
  const { content, loading: contentLoading } = useContent(contentIds);
  const { user, userProfile, role } = useAuth();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setConversationId(uuidv4());
  }, []);

  const T = (id: string, fallback?: string) => content[id] || fallback || id;

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('');
  }

  const handleSend = useCallback(async (prompt: string) => {
    if (!prompt.trim()) return;

    const userMessage: Message = { role: 'user', text: prompt };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setIsLoading(true);
    setInput('');

    if (messages.length === 0) { // First message of the session
      logAnalyticsEvent('ai_conversation_started', { language });
    }

    try {
      const isLoggedIn = role !== 'unauthenticated' && !!user;
      let menstrualData: MenstrualData | undefined = undefined;

      // Fetch menstrual data only if the user is logged in
      if (isLoggedIn && user) {
        menstrualData = await getMenstrualDataForAgent(user.uid);
        if (response.appointmentData.timeSlot) params.set('timeSlot', response.appointmentData.timeSlot);
        if (response.appointmentData.message) params.set('message', response.appointmentData.message);
        router.push(`/${language}${response.navigation}?${params.toString()}`);
        return;
      } else if (response.navigation) {
        router.push(`/${language}${response.navigation}`);
        return;
      }

      const modelMessage: Message = {
        role: 'model',
        text: response.answer,
        followUpQuestions: response.followUpQuestions,
      };
      setMessages([...currentMessages, modelMessage]);

    } catch (error) {
      console.error("Agent failed:", error);
      const errorMessage: Message = {
        role: 'model',
        text: T('aiError')
      };
      setMessages([...currentMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, language, user, role, T, conversationId, router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSend(input);
  }

  const handleFollowUpClick = (question: string) => {
    handleSend(question);
  };

  const handleBookingClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'A' && target.hasAttribute('href')) {
      e.preventDefault();
      const url = (target as HTMLAnchorElement).href;
      const path = new URL(url).pathname;
      if (path) {
        router.push(path);
      }
    }
  };

  const getPersonalizedGreeting = () => {
    if (contentLoading) return "";

    if (userProfile?.displayName) {
      const firstName = userProfile.displayName.split(' ')[0];
      return T('aiGreeting').replace('{name}', firstName);
    }
    return T('aiGreetingGeneric');
  }

  const initialFollowUps = [content.aiFollowUpCycle1, content.aiFollowUpCycle2, content.aiFollowUpGeneral1].filter(Boolean);

  const convertMarkdownToHtml = (text: string) => {
    // Convert markdown links
    let html = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, url) => {
      // Don't modify external links or tel links
      if (url.startsWith('http') || url.startsWith('tel:')) {
        return `<a href="${url}" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
      }
      const fullUrl = `/${language}${url.startsWith('/') ? '' : '/'}${url}`;
      return `<a href="${fullUrl}" class="text-primary hover:underline">${linkText}</a>`;
    });

    // Convert bullet points (unordered lists)
    html = html.replace(/^\s*-\s+(.*)/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    html = html.replace(/<\/li>\n<ul><li>/g, '</li><li>'); // Join adjacent list items
    html = html.replace(/<\/ul>\n<ul>/g, ''); // Join adjacent lists

    return html;
  };

  return (
    <Card className="h-full flex flex-col shadow-lg border-primary/20">
      <CardContent className="p-4 flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1 pr-4 -mr-4" ref={scrollAreaRef as any}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-3",
                  message.role === 'user' && "justify-end"
                )}
              >
                {message.role === 'model' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Logo />
                  </div>
                )}

                <div className={cn(
                  "rounded-lg px-3 py-2 max-w-[85%]",
                  message.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted"
                )}
                >
                  <div
                    className="text-sm prose dark:prose-invert prose-p:my-0 prose-ul:my-2 prose-li:my-0"
                    dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(message.text) }}
                    onClick={handleBookingClick}
                  />
                  {message.role === 'model' && message.followUpQuestions && message.followUpQuestions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.followUpQuestions?.map((q, i) => (
                        q && <Badge key={i} variant="outline" className="cursor-pointer hover:bg-primary/20 bg-background/50 border-primary/30 text-primary" onClick={() => handleFollowUpClick(q)}>
                          {q}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {message.role === 'user' && (
                  userProfile ? (
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage src={userProfile.photoURL || ''} alt={userProfile.displayName || ''} />
                      <AvatarFallback>{getInitials(userProfile.displayName)}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Logo />
                </div>
                <div className="rounded-lg px-3 py-2 max-w-[85%] bg-muted">
                  <div className="flex items-center space-x-1">
                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}
            {messages.length === 0 && !isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Logo />
                </div>
                <div className="rounded-lg px-3 py-2 max-w-[85%] bg-muted">
                  <p className="text-sm">{getPersonalizedGreeting()}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {initialFollowUps.map((q, i) => (
                      q && <Badge key={i} variant="outline" className="cursor-pointer hover:bg-primary/20 bg-background/50 border-primary/30 text-primary" onClick={() => handleFollowUpClick(q)}>
                        {q}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
          <VoiceInput onTranscript={(t) => handleSend(t)} disabled={isLoading} />
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={T('aiPlaceholder')}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
