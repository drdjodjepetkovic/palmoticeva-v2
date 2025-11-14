
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useContent } from '@/hooks/use-content';
import { MyProfileSidebarNav } from '@/components/layout/my-profile-sidebar-nav';
import { Separator } from '@/components/ui/separator';
import { getUnansweredQuestions, type UnansweredQuestion } from '@/lib/actions/admin-actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, Loader2 } from 'lucide-react';
import { format, type Locale } from 'date-fns';
import { useLanguage } from '@/context/language-context';
import { sr, ru, srLatn, enUS } from 'date-fns/locale';
import type { LanguageCode } from '@/types/content';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

const localeMap: Record<LanguageCode, Locale> = {
  "en": enUS,
  "se": sr,
  "ru": ru,
  "se-lat": srLatn,
};

const contentIds = [
  'ai_feedback_title',
  'ai_feedback_description',
  'ai_feedback_no_results',
  'ai_feedback_question_col',
  'ai_feedback_answer_col',
  'ai_feedback_user_col',
  'ai_feedback_date_col'
];

function AiFeedbackPageSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-1/3 mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function AiFeedbackPage() {
  const { role, loading } = useAuth();
  const { language } = useLanguage();
  const { content, loading: contentLoading } = useContent(contentIds);
  const [questions, setQuestions] = useState<UnansweredQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const T = (id: string, fallback?: string) => content[id] || fallback || id;

  useEffect(() => {
    if (role === 'admin') {
      const fetchQuestions = async () => {
        setIsLoading(true);
        const result = await getUnansweredQuestions();
        if (result.error) {
          setError(result.error);
        } else {
          setQuestions(result.questions);
        }
        setIsLoading(false);
      };
      fetchQuestions();
    }
  }, [role]);

  if (loading || contentLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <MyProfileSidebarNav />
          </aside>
          <div className="flex-1 lg:max-w-4xl">
            <AiFeedbackPageSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">{T('ai_feedback_title')}</h2>
        <p className="text-muted-foreground">{T('ai_feedback_description')}</p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <MyProfileSidebarNav />
        </aside>
        <div className="flex-1 lg:max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Neodgovorena Pitanja</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertTitle>Greška</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : questions.length === 0 ? (
                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertTitle>{T('ai_feedback_no_results')}</AlertTitle>
                </Alert>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{T('ai_feedback_question_col')}</TableHead>
                      <TableHead>{T('ai_feedback_answer_col')}</TableHead>
                      <TableHead className="text-right">{T('ai_feedback_user_col')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questions.map((q) => (
                      <TableRow key={q.id}>
                        <TableCell className="font-medium align-top">{q.userQuestion}</TableCell>
                        <TableCell className="text-muted-foreground align-top">{q.modelAnswer}</TableCell>
                        <TableCell className="text-right align-top">
                          <div className="flex flex-col items-end">
                            <div>{q.userName}</div>
                            <div className="text-xs text-muted-foreground">{format(new Date(q.createdAt), 'dd.MM.yyyy HH:mm', { locale: localeMap[language] })}</div>
                            <Badge variant="outline" className="mt-1">{q.language.toUpperCase()}</Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
