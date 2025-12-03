"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth/auth-context";
import { useContent } from "@/features/content/content-context";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeCheck, LogOut, User, Menu } from "lucide-react";
import { auth } from "@/lib/firebase/client";

export function Header() {
    const { user, userProfile } = useAuth();
    const { t, language } = useContent();

    const handleLogout = async () => {
        try {
            await auth.signOut();
            window.location.href = `/${language}/login`;
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href={`/${language}`} className="flex items-center space-x-2">
                        <span className="font-serif text-lg md:text-xl font-bold text-primary">{t.common.brand}</span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href={`/${language}`} className="transition-colors hover:text-primary">
                        {t.nav.home}
                    </Link>
                    <Link href={`/${language}/about`} className="transition-colors hover:text-primary">
                        {t.nav.about}
                    </Link>
                    <Link href={`/${language}/pricelist`} className="transition-colors hover:text-primary">
                        {t.nav.pricelist}
                    </Link>
                    {user && (
                        <Link href={`/${language}/calendar`} className="transition-colors hover:text-primary">
                            {t.nav.calendar}
                        </Link>
                    )}
                </nav>

                <div className="flex items-center gap-4">
                    <LanguageSwitcher />

                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                    <Avatar className="h-10 w-10 border border-border">
                                        <AvatarImage src={userProfile?.photoURL || user.photoURL || ""} alt={userProfile?.displayName || "User"} />
                                        <AvatarFallback>{userProfile?.displayName?.charAt(0) || user.email?.charAt(0) || "U"}</AvatarFallback>
                                    </Avatar>
                                    {userProfile?.verificationStatus === 'verified' && (
                                        <BadgeCheck className="absolute -bottom-1 -right-1 h-4 w-4 text-primary bg-background rounded-full" />
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{userProfile?.displayName || "User"}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href={`/${language}/profile`} className="cursor-pointer w-full">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>{t.nav.profile}</span>
                                    </Link>
                                </DropdownMenuItem>
                                {userProfile?.role === 'admin' && (
                                    <DropdownMenuItem asChild>
                                        <Link href={`/${language}/admin`} className="cursor-pointer w-full">
                                            <BadgeCheck className="mr-2 h-4 w-4" />
                                            <span>Admin Panel</span>
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>{t.profile.logout}</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href={`/${language}/login`}>
                            <Button size="sm" className="hidden md:inline-flex">{t.auth.login}</Button>
                            <Button size="icon" className="md:hidden">
                                <User className="h-5 w-5" />
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </header >
    );
}
