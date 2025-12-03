"use client";

import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { useContent } from "@/hooks/use-content";
import { BookOpen, CalendarPlus, Home, Phone, User, Plus, Tag } from 'lucide-react';
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const contentIds = ['header_nav_home', 'header_nav_pricelist', 'header_nav_appointments', 'callUs', 'header_nav_results', 'header_nav_profile'];

export function MobileBottomNav() {
  const { language } = useLanguage();
  const { content } = useContent(contentIds);
  const pathname = usePathname();

  const T = (id: string) => content[id] || id;

  const navItems = [
    { href: "/", labelKey: "header_nav_home", icon: Home },
    { href: "/appointments", labelKey: "header_nav_appointments", icon: CalendarPlus },
    { href: "/pricelist", labelKey: "header_nav_pricelist", icon: Tag }, // Added Pricelist
    { href: "/my-profile/results", labelKey: "header_nav_results", icon: BookOpen },
  ];

  return (
    <div className="fixed bottom-6 left-6 right-6 z-50 md:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="relative flex items-center justify-between rounded-full bg-white shadow-xl shadow-blue-900/5 border border-blue-100 px-6 py-3">

        {/* Left Side Items */}
        <div className="flex items-center gap-6">
          {navItems.slice(0, 2).map((item) => {
            const Icon = item.icon;
            const path = `/${language}${item.href}`;
            const isActive = pathname === path;

            return (
              <Link
                href={path}
                key={item.labelKey}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 transition-all duration-300",
                  isActive ? "text-primary scale-110" : "text-slate-400 hover:text-primary/70"
                )}
              >
                <Icon className={cn("h-6 w-6", isActive && "fill-current")} />
              </Link>
            );
          })}
        </div>

        {/* FAB - Absolute Center */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -mt-6">
          <Link href={`/${language}/appointments`} className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-xl transition-transform hover:scale-105 active:scale-95 ring-4 ring-background border border-secondary-foreground/10">
            <Plus className="h-8 w-8" />
            <span className="sr-only">Zakazi Pregled</span>
          </Link>
        </div>

        {/* Right Side Items */}
        <div className="flex items-center gap-6">
          {navItems.slice(2, 4).map((item) => {
            const Icon = item.icon;
            const path = `/${language}${item.href}`;
            const isActive = pathname === path;

            return (
              <Link
                href={path}
                key={item.labelKey}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 transition-all duration-300",
                  isActive ? "text-primary scale-110" : "text-slate-400 hover:text-primary/70"
                )}
              >
                <Icon className={cn("h-6 w-6", isActive && "fill-current")} />
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}
