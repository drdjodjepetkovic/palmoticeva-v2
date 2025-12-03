
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useContent } from '@/hooks/use-content';
import { MyProfileSidebarNav } from '@/components/layout/my-profile-sidebar-nav';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText, Loader2, Download, HardDriveDownload } from 'lucide-react';
import { getUserFiles } from '@/lib/actions/user-actions';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const contentIds = [
  'results_title',
  'results_description',
  'results_no_results_title',
  'results_no_results_desc',
  'profile_nav_results' // Re-using for the title
];

type UserFile = {
  name: string;
  url: string;
  size: number;
  updatedAt: string;
};

function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}


function ResultsPageSkeleton() {
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
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </CardContent>
        </Card>
    </div>
  );
}

export default function MyResultsPage() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const { content, loading: contentLoading } = useContent(contentIds);
  const [files, setFiles] = useState<UserFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const T = (id: string, fallback?: string) => content[id] || fallback || id;

  useEffect(() => {
    if (loading) return; // Wait for auth state to be resolved

    if (role !== 'verified' && role !== 'admin') {
      router.push('/my-profile');
      return; // Stop execution if user is not authorized
    }
    
    if (user) {
        setIsLoadingFiles(true);
        getUserFiles(user.uid)
            .then(result => {
                if (result.error) {
                    setError(result.error);
                } else {
                    setFiles(result.files || []);
                }
            })
            .finally(() => setIsLoadingFiles(false));
    }
  }, [role, loading, router, user]);

  if (loading || contentLoading || (role !== 'verified' && role !== 'admin')) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <MyProfileSidebarNav />
          </aside>
          <div className="flex-1 lg:max-w-4xl">
             <ResultsPageSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="-mx-4 lg:w-1/5">
                 <MyProfileSidebarNav />
            </aside>
            <div className="flex-1 lg:max-w-4xl">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">{T('results_title')}</h2>
                        <p className="text-muted-foreground">{T('results_description')}</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>{T('profile_nav_results')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                           {isLoadingFiles ? (
                                <div className="flex items-center justify-center p-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                           ) : error ? (
                                <Alert variant="destructive">
                                    <AlertTitle>Greška</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                           ) : files.length === 0 ? (
                                <Alert>
                                    <FileText className="h-4 w-4" />
                                    <AlertTitle>{T('results_no_results_title')}</AlertTitle>
                                    <AlertDescription>
                                        {T('results_no_results_desc')}
                                    </AlertDescription>
                                </Alert>
                           ) : (
                               <div className="space-y-3">
                                   {files.map(file => (
                                       <a key={file.name} href={file.url} download={file.name} className="block">
                                           <Card className="hover:border-primary/50 hover:bg-muted/50 transition-colors">
                                               <CardContent className="p-4 flex items-center justify-between gap-4">
                                                   <div className="flex items-center gap-4">
                                                       <HardDriveDownload className="h-8 w-8 text-primary flex-shrink-0" />
                                                       <div className="flex flex-col">
                                                            <span className="font-semibold break-all">{file.name}</span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {format(new Date(file.updatedAt), 'dd.MM.yyyy')} - {formatBytes(file.size)}
                                                            </span>
                                                       </div>
                                                   </div>
                                                   <Button variant="ghost" size="icon" asChild>
                                                      <div>
                                                         <Download className="h-5 w-5"/>
                                                      </div>
                                                   </Button>
                                               </CardContent>
                                           </Card>
                                       </a>
                                   ))}
                               </div>
                           )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </div>
  );
}
