"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useContent } from "@/features/content/content-context";
import { useLanguage } from "@/features/content/context/language-context";
import { User, FileText, Calendar, MessageSquare, BarChart3, BrainCircuit, FolderKanban, FlaskConical, DatabaseZap, PieChart, Bell, Newspaper, Users, BookOpen } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/auth-context";

const WHATSAPP_URL = "https://wa.me/381693226040";

export function MyProfileSidebarNav() {
    const pathname = usePathname();
    const { language } = useLanguage();
    const { t } = useContent();
    const { userProfile, loading } = useAuth();

    // Helper to safely access nested translation keys if needed, or use direct t object
    // Assuming t structure matches what's needed or we map it

    const items = [
        { title: t.nav.profile || 'Profil', href: `/${language}/profile`, icon: User, disabled: false, isExternal: false, roles: ['authenticated', 'verified', 'admin'] },
        { title: 'Obaveštenja', href: `/${language}/profile/notifications`, icon: Bell, disabled: false, isExternal: false, roles: ['authenticated', 'verified', 'admin'], badge: userProfile?.unreadNotifications },
        { title: t.nav.results || 'Rezultati', href: `/${language}/profile/results`, icon: FileText, disabled: false, isExternal: false, roles: ['verified', 'admin'] },
        { title: 'Korisnici', href: `/${language}/admin`, icon: Users, disabled: false, isExternal: false, roles: ['admin'] },
        { title: 'Članci', href: `/${language}/admin/articles`, icon: Newspaper, disabled: false, isExternal: false, roles: ['admin'] },
        { title: 'Analitika', href: `/${language}/admin/analytics`, icon: BarChart3, disabled: false, isExternal: false, roles: ['admin'] },
        { title: 'Izveštaji', href: `/${language}/admin/reports`, icon: PieChart, disabled: false, isExternal: false, roles: ['admin'] },
        { title: 'AI Feedback', href: `/${language}/admin/ai-feedback`, icon: BrainCircuit, disabled: false, isExternal: false, roles: ['admin'] },
        { title: 'AI Test', href: `/${language}/admin/ai-test`, icon: FlaskConical, disabled: false, isExternal: false, roles: ['admin'] },
        { title: 'Storage Manager', href: `/${language}/admin/storage-manager`, icon: FolderKanban, disabled: false, isExternal: false, roles: ['admin'] },
        { title: 'WhatsApp', href: WHATSAPP_URL, icon: MessageSquare, disabled: false, isExternal: true, roles: ['authenticated', 'verified', 'admin'] },
    ];

    if (loading) return <Skeleton className="h-full w-full" />;

    return (
        <nav className="grid grid-cols-2 gap-2 md:flex md:flex-col md:space-y-1">
            {items.map((item) => {
                if (!userProfile || !item.roles.includes(userProfile.role)) {
                    // For now, show all if admin just to be safe during debug, or strictly follow role
                    if (userProfile?.role !== 'admin' && !item.roles.includes('authenticated')) return null;
                }

                const Icon = item.icon;

                const commonProps = {
                    className: cn(
                        buttonVariants({ variant: "ghost" }),
                        !item.isExternal && pathname === item.href
                            ? "bg-muted hover:bg-muted"
                            : "hover:bg-transparent hover:underline",
                        "justify-start gap-2 relative",
                        item.disabled && "cursor-not-allowed opacity-50"
                    ),
                    "aria-disabled": item.disabled,
                };

                const content = (
                    <>
                        <Icon className="h-4 w-4" />
                        {item.title}
                        {typeof item.badge === 'number' && item.badge > 0 && (
                            <span className={cn(
                                "ml-auto text-xs font-bold",
                                "flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground"
                            )}>
                                {item.badge}
                            </span>
                        )}
                    </>
                );

                if (item.isExternal) {
                    return (
                        <a
                            key={item.href}
                            href={item.disabled ? '#' : item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            {...commonProps}
                        >
                            {content}
                        </a>
                    );
                }

                return (
                    <Link
                        key={item.href}
                        href={item.disabled ? '#' : item.href}
                        {...commonProps}
                    >
                        {content}
                    </Link>
                )
            })}
        </nav>
    );
}
