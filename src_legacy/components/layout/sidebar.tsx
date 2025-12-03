"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import { useAuth } from "@/hooks/use-auth";
import { useContent } from "@/hooks/use-content";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, CalendarPlus, BookOpen, User, LogOut, ShieldCheck, Plus } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import LanguageSwitcher from "@/components/language-switcher";

const contentIds = ['header_nav_home', 'header_nav_appointments', 'header_nav_results', 'header_nav_profile', 'header_nav_admin', 'header_menu_logout', 'header_brand'];

export function Sidebar() {
    const { language } = useLanguage();
    const pathname = usePathname();
    const { user, role } = useAuth();
    const { content } = useContent(contentIds);

    const T = (id: string) => content[id] || id;

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    const navItems = [
        { href: "/", labelKey: "header_nav_home", icon: Home },
        { href: "/appointments", labelKey: "header_nav_appointments", icon: CalendarPlus },
        { href: "/my-profile/results", labelKey: "header_nav_results", icon: BookOpen },
        // Profile icon removed
    ];

    if (role === 'admin') {
        navItems.push({ href: "/admin", labelKey: "header_nav_admin", icon: ShieldCheck });
    }

    return (
        <div className="hidden md:flex h-screen w-64 flex-col border-r bg-card text-card-foreground fixed left-0 top-0 z-40">
            {/* Logo Area */}
            <div className="flex h-16 items-center px-6 border-b">
                <Link href={`/${language}/`} className="flex flex-col justify-center">
                    <span className="font-headline font-bold text-lg text-primary leading-none">Ginekologija</span>
                    <span className="font-body italic font-light text-sm text-primary/80 leading-none">Palmotićeva</span>
                </Link>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                {/* FAB Equivalent for Desktop - Prominent Button */}
                <div className="px-3 mb-6">
                    <Button asChild className="w-full justify-start gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90" size="lg">
                        <Link href={`/${language}/appointments`}>
                            <Plus className="h-5 w-5" />
                            <span>Zakazi Pregled</span>
                        </Link>
                    </Button>
                </div>

                {navItems.map((item) => {
                    const Icon = item.icon;
                    const path = `/${language}${item.href}`;
                    const isActive = pathname === path;

                    return (
                        <Link
                            key={item.labelKey}
                            href={path}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {T(item.labelKey)}
                        </Link>
                    );
                })}
            </div>

            {/* Language Switcher */}
            <div className="px-4 py-2">
                <LanguageSwitcher />
            </div>

            {/* User / Logout Area */}
            <div className="border-t p-4">
                {user ? (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 px-2 py-1.5">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {user.displayName?.[0] || 'U'}
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="truncate text-sm font-medium">{user.displayName}</span>
                                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive" onClick={handleSignOut}>
                            <LogOut className="h-4 w-4" />
                            {T('header_menu_logout')}
                        </Button>
                    </div>
                ) : (
                    <div className="px-2">
                        <p className="text-xs text-muted-foreground mb-2">Niste prijavljeni</p>
                    </div>
                )}
            </div>
        </div>
    );
}
