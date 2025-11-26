"use client";

import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { useContent } from "@/hooks/use-content";
import { BookOpen, CalendarPlus, Home, Phone, User, Plus } from 'lucide-react';
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const contentIds = ['header_nav_home', 'header_nav_pricelist', 'header_nav_appointments', 'callUs'];

export function MobileBottomNav() {
  const { language } = useLanguage();
  const { content } = useContent(contentIds);
  const pathname = usePathname();

  const T = (id: string) => content[id] || id;

  const navItems = [
    { href: "/", labelKey: "header_nav_home", icon: Home },
    { href: "/appointments", labelKey: "header_nav_appointments", icon: CalendarPlus },
    // FAB is handled separately
    { href: "/my-profile/results", labelKey: "header_nav_results", icon: BookOpen }, // Assuming 'header_nav_results' key exists or fallback
    { href: "/my-profile", labelKey: "header_nav_profile", icon: User },
  ];

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden pb-safe">
      <div className="flex items-center justify-between rounded-2xl bg-white/90 px-6 py-3 shadow-lg backdrop-blur-lg border border-white/20">
        {navItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const path = `/${language}${item.href}`;
          const isActive = pathname === path;

          return (
            <Link
              href={path}
              key={item.labelKey}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary/70"
              )}
            >
              <Icon className={cn("h-6 w-6", isActive && "fill-current")} />
              {/* <span className="text-[10px] font-medium">{T(item.labelKey)}</span> */}
            </Link>
          );
        })}

        {/* FAB - Book Appointment */}
        <div className="-mt-8">
          <Link href={`/${language}/appointments`} className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-xl transition-transform hover:scale-105 active:scale-95 ring-4 ring-background">
            <Plus className="h-8 w-8" />
            <span className="sr-only">Zakazi Pregled</span>
          </Link>
        </div>

        {navItems.slice(2).map((item) => {
          const Icon = item.icon;
          const path = `/${language}${item.href}`;
          const isActive = pathname === path;

          return (
            <Link
              href={path}
              key={item.labelKey}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary/70"
              )}
            >
              <Icon className={cn("h-6 w-6", isActive && "fill-current")} />
              {/* <span className="text-[10px] font-medium">{T(item.labelKey)}</span> */}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
