"use client";

import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { useContent } from "@/hooks/use-content";
import { BookOpen, CalendarPlus, Home, Phone } from 'lucide-react';
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
    { href: "/pricelist", labelKey: "header_nav_pricelist", icon: BookOpen },
    { href: "/appointments", labelKey: "header_nav_appointments", icon: CalendarPlus },
    { href: "tel:0113226040", labelKey: "callUs", icon: Phone },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 border-t bg-card text-card-foreground shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50">
      <div className="grid h-full grid-cols-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isExternal = item.href.startsWith("tel:");
          const path = isExternal ? item.href : `/${language}${item.href}`;
          const isActive = !isExternal && pathname === path;
          
          return (
            <Link 
                href={path} 
                key={item.labelKey} 
                className={cn(
                    "flex flex-col items-center justify-center text-center text-xs font-medium transition-colors hover:bg-accent",
                    isActive ? "text-primary" : "text-muted-foreground"
                )}
                target={isExternal ? '_self' : undefined}
            >
              <Icon className={cn("h-6 w-6 mb-0.5" )} />
              <span>{T(item.labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
