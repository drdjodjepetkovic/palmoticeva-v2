
"use client";

import Link from "next/link";
import React, { useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider, isConfigured } from "@/lib/firebase/client";
import { useAuth } from "@/hooks/use-auth";
import { useContent } from "@/hooks/use-content";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogIn, LogOut, User, BadgeCheck, CalendarDays } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";
import LanguageSwitcher from "./language-switcher";
import { useLanguage } from "@/context/language-context";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "./ui/tooltip";


// Define the content IDs for this component
const contentIds = [
  'header_brand',
  'header_nav_profile',
  'header_nav_admin',
  'header_button_signin',
  'header_menu_logout',
  'header_nav_about_us',
  'header_nav_pricelist',
  'header_nav_calendar',
];

const NavLink = ({ href, children }: { href: string; children: React.ReactNode; }) => {
  const { language } = useLanguage();
  const fullHref = `/${language}${href}`;

  return (
    <Link href={fullHref} className="transition-colors hover:text-primary text-sm font-medium">
      {children}
    </Link>
  );
};

export default function Header() {
  const { user, userProfile, role, loading: authLoading } = useAuth();
  const { content, loading: contentLoading } = useContent(contentIds);
  const { language } = useLanguage();

  const T = (id: string) => {
    if (contentLoading) return <Skeleton className="h-4 w-20 inline-block" />;
    return content[id] || `[${id}]`;
  };

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
        console.error("Error signing in with Google: ", error);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('');
  }

  return (
    <>
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-6">
            <Link href={`/${language}/`} className="flex items-center gap-2 font-bold text-lg">
              <span className="font-headline text-primary">{T('header_brand')}</span>
            </Link>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            {user && (
              <Button asChild variant="outline" className="text-primary border-primary/50 hover:bg-primary/10 hover:text-primary">
                <Link href={`/${language}/menstrual-calendar`} className="gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <span className="hidden sm:inline">{T('header_nav_calendar')}</span>
                </Link>
              </Button>
            )}
            <LanguageSwitcher />
            {authLoading ? (
              <Skeleton className="h-10 w-10 rounded-full" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={userProfile?.photoURL || ''} alt={userProfile?.displayName || ''} />
                      <AvatarFallback>{getInitials(userProfile?.displayName)}</AvatarFallback>
                    </Avatar>
                    {(role === 'verified' || role === 'admin') && (
                      <BadgeCheck className="absolute bottom-0 right-0 h-5 w-5 text-blue-500 bg-card rounded-full p-0.5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userProfile?.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{userProfile?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {(role === 'authenticated' || role === 'verified' || role === 'admin') && (
                    <DropdownMenuItem asChild>
                      <Link href={`/${language}/my-profile`} className="w-full">
                        <User className="mr-2 h-4 w-4" />
                        <span>{T('header_nav_profile')}</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link href={`/${language}/admin`} className="w-full">
                        <span>{T('header_nav_admin')}</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{T('header_menu_logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={handleSignIn} disabled={!isConfigured} variant="default" size="icon">
                      <LogIn />
                      <span className="sr-only">{T('header_button_signin')}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{T('header_button_signin')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
