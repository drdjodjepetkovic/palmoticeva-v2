"use client";

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MyProfileSidebarNav } from '@/components/layout/my-profile-sidebar-nav';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/context/language-context';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { Article, ArticlesContent } from '@/lib/data/content/articles';
import { Loader2, PlusCircle, MoreHorizontal, FileText, Trash2, Pencil } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { deleteArticle } from '@/lib/actions/admin-actions';
import { revalidatePath } from 'next/cache';


function ArticlesAdminSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-1/3 mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function ArticlesAdminPage() {
  const { role, loading } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();

  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    try {
      const docRef = doc(db, 'page_content', 'articles');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as ArticlesContent;
        setArticles(data.articles || []);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (role === 'admin') {
      fetchArticles();
    }
  }, [role, fetchArticles]);

  const handleDelete = async (slug: string) => {
    const result = await deleteArticle(slug);
    if (result.success) {
        toast({ title: "Uspeh!", description: "Članak je uspešno obrisan." });
        // Optimistically update UI
        setArticles(prev => prev.filter(a => a.slug !== slug));
    } else {
        toast({ variant: "destructive", title: "Greška", description: `Brisanje nije uspelo: ${result.error}` });
    }
  }

  if (loading || (role !== 'admin' && !isLoading)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <MyProfileSidebarNav />
          </aside>
          <div className="flex-1 lg:max-w-4xl">
            <ArticlesAdminSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Administracija Članaka</h2>
        <p className="text-muted-foreground">Dodajte, menjajte i brišite članke na sajtu.</p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <MyProfileSidebarNav />
        </aside>
        <div className="flex-1 lg:max-w-4xl">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Svi članci</CardTitle>
                <CardDescription>Prikaz svih članaka koji su trenutno u bazi.</CardDescription>
              </div>
              <Button asChild>
                <Link href={`/${language}/admin/articles/new`}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Dodaj novi članak
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : articles.length === 0 ? (
                <div className="text-center text-muted-foreground p-8">
                  <FileText className="mx-auto h-12 w-12" />
                  <h3 className="mt-4 text-lg font-semibold">Nema članaka</h3>
                  <p className="mt-1 text-sm">Još uvek nema unetih članaka. Kliknite na "Dodaj novi članak" da započnete.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Naslov</TableHead>
                      <TableHead>Autor</TableHead>
                      <TableHead className="text-right">Akcije</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {articles.map((article) => (
                      <TableRow key={article.slug}>
                        <TableCell className="font-medium">{article.title[language] || article.title['se-lat']}</TableCell>
                        <TableCell>{article.author[language] || article.author['se-lat']}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/${language}/admin/articles/edit/${article.slug}`}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Izmeni
                                </Link>
                              </DropdownMenuItem>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                   <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Obriši
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Da li ste sigurni?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Ova akcija se ne može opozvati. Članak će biti trajno obrisan.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Otkaži</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(article.slug)}>Obriši</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
