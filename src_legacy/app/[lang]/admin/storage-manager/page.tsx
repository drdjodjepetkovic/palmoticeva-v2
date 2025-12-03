
"use client";

import { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ref, uploadBytes, listAll, getDownloadURL, deleteObject, type StorageReference } from 'firebase/storage';
import { storage, db } from '@/lib/firebase/client';
import { doc, getDoc } from 'firebase/firestore';
import { MyProfileSidebarNav } from '@/components/layout/my-profile-sidebar-nav';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Upload, Trash2, Download, Copy, Loader2, File as FileIcon, AlertTriangle, Folder, FolderUp } from 'lucide-react';
import { format } from 'date-fns';
import type { UserProfile } from '@/types/user';

type FileMetadata = {
  ref: StorageReference;
  name: string;
  url: string;
  isImage: boolean;
};

type FolderMetadata = {
    ref: StorageReference;
    name: string; // This will now be displayName
    uid: string; // We'll store the UID separately
};

export default function StorageManagerPage() {
  const { role, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [folders, setFolders] = useState<FolderMetadata[]>([]);
  const [currentPath, setCurrentPath] = useState('files');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async (path: string) => {
    setIsLoading(true);
    setError(null);
    setFiles([]);
    setFolders([]);
    try {
      const storageRef = ref(storage, path);
      const res = await listAll(storageRef);
      
      const folderPromises = res.prefixes.map(async (folderRef) => {
        const uid = folderRef.name;
        try {
            const userDocRef = doc(db, 'users', uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                const profile = userDocSnap.data() as UserProfile;
                return { ref: folderRef, name: profile.displayName || `Korisnik bez imena (${uid.substring(0,5)}...)`, uid: uid };
            }
        } catch (e) {
            console.error(`Failed to fetch user for UID ${uid}`, e);
        }
        // Fallback if user not found
        return { ref: folderRef, name: `Nepoznat korisnik (${uid.substring(0,5)}...)`, uid: uid };
      });

      const filePromises = res.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        const name = itemRef.name.toLowerCase();
        const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].some(ext => name.endsWith(ext));
        return { ref: itemRef, name: itemRef.name, url, isImage };
      });
      
      const [fetchedFolders, fetchedFiles] = await Promise.all([
          Promise.all(folderPromises),
          Promise.all(filePromises)
      ]);
      
      // Sort folders by name
      fetchedFolders.sort((a, b) => a.name.localeCompare(b.name));

      setFolders(fetchedFolders);
      setFiles(fetchedFiles);
    } catch (err: any) {
      console.error("Error fetching items:", err);
      if (err.code === 'storage/object-not-found' || err.code === 'storage/unauthorized') {
          setError("Došlo je do greške sa dozvolama. Proverite da li ste podesili CORS pravila za Vaš Storage bucket.");
      } else {
          setError(`Došlo je do greške: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (role === 'admin') {
      fetchItems(currentPath);
    }
  }, [role, currentPath, fetchItems]);


  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const filePath = `${currentPath}/${file.name}`;
      const storageRef = ref(storage, filePath);
      await uploadBytes(storageRef, file);
      toast({ title: 'Fajl uspešno otpremljen!', description: filePath });
      fetchItems(currentPath); 
    } catch (err: any) {
      console.error("Error uploading file:", err);
      toast({ variant: 'destructive', title: 'Greška pri otpremanju', description: err.message });
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  const handleDelete = async (fileRef: StorageReference) => {
    try {
      await deleteObject(fileRef);
      toast({ title: 'Fajl uspešno obrisan!' });
      fetchItems(currentPath);
    } catch (err: any) {
      console.error("Error deleting file:", err);
      toast({ variant: 'destructive', title: 'Greška pri brisanju', description: err.message });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'URL kopiran!' });
  };

  const handleFolderClick = (path: string) => {
      setCurrentPath(path);
  }

  const handleNavigateUp = () => {
      const pathSegments = currentPath.split('/').filter(Boolean);
      if (pathSegments.length > 1) {
          pathSegments.pop();
          setCurrentPath(pathSegments.join('/'));
      } else {
          setCurrentPath('files'); // Vraćamo se u `files` folder, ne u root
      }
  }
  
  if (authLoading) return <Skeleton className="w-full h-96" />;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Storage Manager</h2>
        <p className="text-muted-foreground">Trenutna putanja: <code className="bg-muted px-1.5 py-0.5 rounded">{currentPath}</code></p>
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
                <CardTitle>Fajlovi i Folderi</CardTitle>
                <CardDescription>Sadržaj unutar trenutne putanje.</CardDescription>
              </div>
              <Button asChild>
                <label htmlFor="file-upload">
                  {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                  {isUploading ? 'Slanje...' : 'Pošalji Fajl'}
                  <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} disabled={isUploading} />
                </label>
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : error ? (
                <div className="text-destructive p-4 border border-destructive/50 rounded-md flex items-start gap-4">
                  <AlertTriangle className="h-5 w-5 mt-0.5"/>
                  <div>
                    <h4 className="font-semibold">Greška pri učitavanju</h4>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tip</TableHead>
                        <TableHead>Naziv</TableHead>
                        <TableHead className="text-right">Akcije</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentPath !== 'files' && (
                        <TableRow key="navigate-up" onClick={handleNavigateUp} className="cursor-pointer hover:bg-muted/50">
                            <TableCell><FolderUp className="h-8 w-8 text-muted-foreground"/></TableCell>
                            <TableCell colSpan={2} className="font-medium">... (Nazad)</TableCell>
                        </TableRow>
                      )}
                      {folders.map((folder) => (
                        <TableRow key={folder.uid} onClick={() => handleFolderClick(folder.ref.fullPath)} className="cursor-pointer hover:bg-muted/50">
                          <TableCell>
                            <Folder className="h-8 w-8 text-muted-foreground"/>
                          </TableCell>
                          <TableCell className="font-medium">{folder.name}</TableCell>
                          <TableCell className="text-right space-x-2"></TableCell>
                        </TableRow>
                      ))}
                      {files.map((file) => (
                        <TableRow key={file.name}>
                          <TableCell>
                            {file.isImage ? <img src={file.url} alt={file.name} className="h-10 w-10 object-cover rounded-md" /> : <FileIcon className="h-8 w-8 text-muted-foreground"/>}
                          </TableCell>
                          <TableCell className="font-medium">{file.name}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(file.url)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                            <a href={file.url} target="_blank" rel="noopener noreferrer">
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                              </Button>
                            </a>
                             <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Da li ste sigurni?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Ova akcija se ne može opozvati. Fajl će biti trajno obrisan.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Otkaži</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(file.ref)}>Obriši</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                       {folders.length === 0 && files.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                              Ovaj folder je prazan.
                            </TableCell>
                          </TableRow>
                        )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
