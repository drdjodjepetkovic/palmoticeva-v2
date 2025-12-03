'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, Send, User, X, Loader2, Calendar, ChevronRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/features/auth/auth-context';
import { useLanguage } from '@/features/content/context/language-context';
import { useContent } from '@/features/content/hooks/use-content';
import { useEventBus } from '@/context/event-bus-context';
import { UserEventType } from '@/lib/events';
import { runConversationalAgentV2 } from '@/features/ai/actions/ai-actions';
import { VoiceInput } from '@/features/ai/components/voice-input';
import { CycleService } from '@/lib/services/cycle-service';
import Logo from '@/components/logo';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import type { HistoryItem, ConversationalAgentInput } from '@/features/ai/types';

interface Message extends HistoryItem {
    id: string;
    timestamp: Date;
}

export function AiWidget() {
    const { user, userProfile } = useAuth();
    const { language } = useLanguage();
    const { t } = useContent();
    const { emit } = useEventBus();
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [conversationId, setConversationId] = useState<string>('');
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Initialize conversation ID
    useEffect(() => {
        setConversationId(Math.random().toString(36).substring(7));
    }, []);

    // Scroll to bottom on new messages
    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages, isOpen]);

    // Initial greeting
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const greeting = userProfile?.displayName
                ? t.ai.greeting.replace('{name}', userProfile.displayName)
                : t.ai.greetingGeneric;

            setMessages([
                {
                    id: 'init-1',
                    role: 'model',
                    text: greeting,
                    timestamp: new Date()
                }
            ]);
        }
    }, [isOpen, messages.length, userProfile, t.ai]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        emit(UserEventType.AiQuestionAsked, {});

        try {
            // Prepare history for API
            const history: HistoryItem[] = messages.map(m => ({
                role: m.role,
                text: m.text
            }));

            // Fetch menstrual data if user is logged in
            let menstrualData = undefined;
            if (user) {
                try {
                    menstrualData = await CycleService.getMenstrualDataForAI(user.uid);
                } catch (err) {
                    console.error("Failed to fetch menstrual data", err);
                }
            }

            const agentInput: ConversationalAgentInput = {
                conversationId,
                history,
                question: userMessage.text,
                language: language as any, // Cast to match expected type if needed
                isLoggedIn: !!user,
                userId: user?.uid,
                userProfile: userProfile ? {
                    displayName: userProfile.displayName,
                    age: undefined // Add age if available in profile
                } : undefined,
                menstrualData
            };

            const response = await runConversationalAgentV2(agentInput);

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: response.answer,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);

            // Handle actions
            if (response.navigation) {
                router.push(response.navigation);
            }

            if (response.action?.type === 'LOG_PERIOD') {
                emit(UserEventType.CycleLogged, { date: response.action.date });
            }

        } catch (error) {
            console.error('Error sending message to AI:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: t.ai.error,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            // Focus input again for quick follow-up
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleVoiceTranscript = (transcript: string) => {
        setInput(transcript);
        // Optional: Auto-send? Let's let user confirm for now.
    };

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-20 right-4 z-50 h-14 w-14 rounded-full shadow-lg md:bottom-8 md:right-8 animate-in fade-in zoom-in duration-300"
                size="icon"
            >
                <Sparkles className="h-6 w-6" />
                <span className="sr-only">Open AI Assistant</span>
            </Button>
        );
    }

    return (
        <Card className="fixed bottom-20 right-4 z-50 flex h-[500px] w-[90vw] max-w-[400px] flex-col shadow-2xl md:bottom-8 md:right-8 animate-in slide-in-from-bottom-10 duration-300 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-primary/5 p-4">
                <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-background shadow-sm">
                        <Logo />
                    </div>
                    <div>
                        <CardTitle className="text-sm font-medium">Dr Palmotićeva AI</CardTitle>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            Online
                        </p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                </Button>
            </CardHeader>

            <CardContent className="flex-1 overflow-hidden p-0 relative bg-gradient-to-b from-background to-muted/20">
                <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                    <div className="flex flex-col gap-4 pb-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex w-max max-w-[85%] flex-col gap-1 rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                                    msg.role === 'user'
                                        ? "ml-auto bg-primary text-primary-foreground rounded-tr-none"
                                        : "bg-background border border-border rounded-tl-none"
                                )}
                            >
                                <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                                <span className={cn(
                                    "text-[10px] opacity-70",
                                    msg.role === 'user' ? "text-primary-foreground/80 self-end" : "text-muted-foreground"
                                )}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex w-max max-w-[85%] items-center gap-2 rounded-2xl rounded-tl-none border border-border bg-background px-4 py-3 shadow-sm">
                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                <span className="text-xs text-muted-foreground">AI razmišlja...</span>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>

            <div className="border-t bg-background p-3">
                <div className="flex items-end gap-2">
                    <div className="relative flex-1">
                        <Input
                            ref={inputRef}
                            placeholder={t.ai.placeholder}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="pr-10 min-h-[44px] py-3 rounded-full border-muted-foreground/20 focus-visible:ring-primary/20"
                            disabled={isLoading}
                            autoComplete="off"
                        />
                        <div className="absolute right-1 top-1">
                            <VoiceInput onTranscript={handleVoiceTranscript} disabled={isLoading} />
                        </div>
                    </div>
                    <Button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        size="icon"
                        className="h-11 w-11 rounded-full shrink-0 shadow-sm"
                    >
                        <Send className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </Card>
    );
}
