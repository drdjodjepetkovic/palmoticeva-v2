
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MyProfileSidebarNav } from "@/components/layout/my-profile-sidebar-nav";
import { useLanguage } from "@/context/language-context";
import { useAuth } from "@/hooks/use-auth";
import { useRouter, useParams, notFound } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, formatISO, parseISO } from "date-fns";
import { updateArticle } from "@/lib/actions/admin-actions";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, useCallback } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Article, ArticlesContent } from "@/lib/data/content/articles";
import { Skeleton } from "@/components/ui/skeleton";

const articleSchema = z.object({
  slug: z.string().min(3, "Slug mora imati bar 3 karaktera.").regex(/^[a-z0-9-]+$/, "Slug može sadržati samo mala slova, brojeve i crtice."),
  title: z.string().min(1, "Naslov je obavezan."),
  summary: z.string().min(1, "Sažetak je obavezan."),
  content: z.string().min(1, "Sadržaj je obavezan."),
  image: z.string().url("Mora biti validan URL.").min(1, "URL slike je obavezan."),
  date: z.date({ required_error: "Datum je obavezan." }),
});

type ArticleFormData = z.infer<typeof articleSchema>;

function EditArticlePageSkeleton() {
    return (
        <div className="space-y-8">
             <Card>
                <CardHeader>
                  <CardTitle><Skeleton className="h-6 w-1/2"/></CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle><Skeleton className="h-6 w-1/3"/></CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-40 w-full" />
                </CardContent>
              </Card>
        </div>
    )
}

export default function EditArticlePage() {
  const { language } = useLanguage();
  const { role, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  
  const originalSlug = params.slug as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      slug: "",
      title: "",
      summary: "",
      content: "",
      image: "",
      date: new Date(),
    },
  });

  const fetchArticle = useCallback(async () => {
    setIsLoading(true);
    try {
      const docRef = doc(db, 'page_content', 'articles');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as ArticlesContent;
        const foundArticle = data.articles.find(a => a.slug === originalSlug);
        if (foundArticle) {
          setArticle(foundArticle);
          form.reset({
            slug: foundArticle.slug,
            title: foundArticle.title['se-lat'],
            summary: foundArticle.summary['se-lat'],
            content: foundArticle.content['se-lat'],
            image: foundArticle.image,
            date: parseISO(foundArticle.date),
          });
        } else {
          notFound();
        }
      }
    } catch (error) {
      console.error("Error fetching article:", error);
    } finally {
      setIsLoading(false);
    }
  }, [originalSlug, form]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);


  const onSubmit = async (data: ArticleFormData) => {
    const result = await updateArticle(
      originalSlug,
      { title: data.title, summary: data.summary, content: data.content },
      data.slug,
      data.image,
      formatISO(data.date)
    );

    if (result.success) {
      toast({ title: "Uspeh!", description: "Članak je uspešno ažuriran i preveden." });
      router.push(`/${language}/admin/articles`);
    } else {
      toast({ variant: "destructive", title: "Greška", description: `Ažuriranje nije uspelo: ${result.error}` });
    }
  };

  if (authLoading || role !== 'admin') {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Izmena Članka</h2>
        <p className="text-muted-foreground">Izmenite polja na srpskom (latinica). Sadržaj će biti automatski ponovo preveden.</p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <MyProfileSidebarNav />
        </aside>
        <div className="flex-1 lg:max-w-4xl">
          {isLoading ? <EditArticlePageSkeleton /> : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Osnovne Informacije</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField control={form.control} name="slug" render={({ field }) => (<FormItem><FormLabel>Slug (deo URL-a)</FormLabel><FormControl><Input placeholder="npr-moj-novi-clanak" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="image" render={({ field }) => (<FormItem><FormLabel>URL Slike</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormDescription>Otpremite sliku u Storage Manager i kopirajte URL ovde.</FormDescription><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="date" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Datum objavljivanja</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Izaberi datum</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sadržaj (Srpski Latinica)</CardTitle>
                    <CardDescription>Unesite tekst. AI će ga automatski formatirati u HTML i prevesti na ostale jezike.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Naslov</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="summary" render={({ field }) => (<FormItem><FormLabel>Sažetak</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="content" render={({ field }) => (<FormItem><FormLabel>Sadržaj (kopirajte tekst iz Word-a)</FormLabel><FormControl><Textarea {...field} rows={15} /></FormControl><FormMessage /></FormItem>)} />
                  </CardContent>
                </Card>

                <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Ažuriraj Članak
                </Button>
              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}
