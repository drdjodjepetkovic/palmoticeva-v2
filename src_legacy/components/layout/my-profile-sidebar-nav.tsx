"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useContent } from "@/hooks/use-content";
import { useLanguage } from "@/context/language-context";
import { User, FileText, Calendar, MessageSquare, BarChart3, BrainCircuit, FolderKanban, FlaskConical, DatabaseZap, PieChart, Bell, Newspaper, Users, BookOpen } from 'lucide-react';
import { Skeleton } from "../ui/skeleton";
import { useAuth } from "@/hooks/use-auth";

const contentIds = [
  'profile_nav_profile',
  'profile_nav_results',
  'profile_nav_appointments',
  'profile_nav_messages',
  'profile_nav_ai_feedback',
  'profile_nav_notifications'
];

const WHATSAPP_URL = "https://wa.me/381693226040";

export function MyProfileSidebarNav() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const { content, loading } = useContent(contentIds);
  const { role, userProfile } = useAuth();
  
  const T = (id: string, fallback?: string) => content[id] || fallback || id;

  const items = [
    { titleKey: 'profile_nav_profile', href: `/${language}/my-profile`, icon: User, disabled: false, isExternal: false, roles: ['authenticated', 'verified', 'admin'] },
    { titleKey: 'profile_nav_notifications', href: `/${language}/my-profile/notifications`, icon: Bell, disabled: false, isExternal: false, roles: ['authenticated', 'verified', 'admin'], badge: userProfile?.unreadNotifications },
    { titleKey: 'profile_nav_results', href: `/${language}/my-profile/results`, icon: FileText, disabled: false, isExternal: false, roles: ['verified', 'admin'] },
    { titleKey: 'profile_nav_admin_users', title: 'Korisnici', href: `/${language}/admin`, icon: Users, disabled: false, isExternal: false, roles: ['admin'] },
    { titleKey: 'admin_nav_articles', title: 'Članci', href: `/${language}/admin/articles`, icon: Newspaper, disabled: false, isExternal: false, roles: ['admin'] },
    { titleKey: 'profile_nav_analytics', href: `/${language}/admin/analytics`, title: 'Analitika', icon: BarChart3, disabled: false, isExternal: false, roles: ['admin'] },
    { titleKey: 'profile_nav_reports', href: `/${language}/admin/reports`, title: 'Izveštaji', icon: PieChart, disabled: false, isExternal: false, roles: ['admin'] },
    { titleKey: 'profile_nav_ai_feedback', href: `/${language}/admin/ai-feedback`, icon: BrainCircuit, disabled: false, isExternal: false, roles: ['admin'] },
    { titleKey: 'ai_test_page', href: `/${language}/admin/ai-test`, title: 'AI Test', icon: FlaskConical, disabled: false, isExternal: false, roles: ['admin'] },
    { titleKey: 'storage_manager', href: `/${language}/admin/storage-manager`, title: 'Storage Manager', icon: FolderKanban, disabled: false, isExternal: false, roles: ['admin'] },
    { titleKey: 'profile_nav_messages', href: WHATSAPP_URL, icon: MessageSquare, disabled: false, isExternal: true, roles: ['authenticated', 'verified', 'admin'] },
  ];

  return (
    <nav className="grid grid-cols-2 gap-2 md:flex md:flex-col md:space-y-1">
      {items.map((item) => {
        if (!item.roles.includes(role)) {
          return null;
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
                {loading ? <Skeleton className="h-4 w-24" /> : (item.title || T(item.titleKey))}
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
