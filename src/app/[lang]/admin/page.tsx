
"use client";

import { useEffect, useState, useTransition, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Search, User, Upload, Loader2, FileUp } from 'lucide-react';
import { useContent } from '@/hooks/use-content';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { searchUsers } from '@/lib/actions/admin-actions';
import { type UserProfile } from '@/types/user';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/lib/firebase/client';
import { MyProfileSidebarNav } from '@/components/layout/my-profile-sidebar-nav';
import { useLanguage } from '@/context/language-context';
import Link from 'next/link';


const contentIds = [
  'admin_title',
  'admin_description',
  'admin_alert_title',
  'admin_alert_desc',
  'admin_body_text'
];

export default function AdminPage() {
  const { role, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { language } = useLanguage();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, startSearchTransition] = useTransition();
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  
  const handleSearch = (term: string) => {
    startSearchTransition(async () => {
      if (term.length > 2) {
        const result = await searchUsers(term);
        if (result.users) {
          setSearchResults(result.users);
        }
      } else {
        setSearchResults([]);
      }
    });
  };

  useEffect(() => {
    if (!loading && role !== 'admin') {
      router.push('/');
    }
  }, [role, loading, router]);

  if (loading || role !== 'admin') {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6">
        <Card>
          <CardHeader>
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
             <Skeleton className="h-12 w-full" />
             <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Admin Panel</h2>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
            <MyProfileSidebarNav />
        </aside>
        <div className="flex-1 lg:max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Pretraga Korisnika</CardTitle>
              <CardDescription>Pronađite korisnika po imenu ili email adresi da vidite njihove unose.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                  <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                          placeholder="Pretraži pacijente po imenu ili email-u..."
                          className="pl-10"
                          value={searchTerm}
                          onChange={(e) => {
                              setSearchTerm(e.target.value);
                              handleSearch(e.target.value);
                          }}
                      />
                  </div>
                  {isSearching && <Loader2 className="animate-spin mx-auto" />}
                  {searchResults.length > 0 && (
                      <div className="border rounded-md max-h-60 overflow-y-auto">
                          {searchResults.map(user => (
                              <Link href={`/${language}/admin/users/${user.uid}`} key={user.uid} className="block">
                                <div className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer border-b">
                                    <img src={user.photoURL || ''} alt="" className="h-8 w-8 rounded-full" />
                                    <div>
                                        <div className="font-semibold">{user.displayName}</div>
                                        <div className="text-xs text-muted-foreground">{user.email}</div>
                                    </div>
                                </div>
                              </Link>
                          ))}
                      </div>
                  )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
