
"use client";

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MyProfileSidebarNav } from '@/components/layout/my-profile-sidebar-nav';
import { Separator } from '@/components/ui/separator';

function MigrationPageSkeleton() {
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
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminMigrationPage() {
  const { role, loading } = useAuth();
  
  if (loading || role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <MyProfileSidebarNav />
          </aside>
          <div className="flex-1 lg:max-w-4xl">
            <MigrationPageSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Migracija Podataka</h2>
        <p className="text-muted-foreground">Ova stranica je uklonjena.</p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <MyProfileSidebarNav />
        </aside>
        <div className="flex-1 lg:max-w-2xl space-y-8">
         <Card>
            <CardHeader>
                <CardTitle>Migracija završena</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Ova funkcionalnost je iskorišćena i uklonjena.</p>
            </CardContent>
         </Card>
        </div>
      </div>
    </div>
  );
}
