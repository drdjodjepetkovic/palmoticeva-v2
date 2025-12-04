"use client";

import { useContent } from "@/features/content/content-context";
import { Button } from "@/components/ui/button";
import { Phone, CalendarDays } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileStickyBar() {
    const { t, language } = useContent();
    const pathname = usePathname();

    // Don't show on login/register pages or if user is in admin panel
    if (pathname?.includes('/login') || pathname?.includes('/register') || pathname?.includes('/admin')) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 p-4 pb-safe md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" size="lg" className="w-full rounded-xl border-2 border-green-600 text-green-700 hover:bg-green-50" asChild>
                    <a href="tel:0113226040">
                        <Phone className="mr-2 h-5 w-5" />
                        Pozovi
                    </a>
                </Button>
                <Button size="lg" className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200" asChild>
                    <Link href={`/${language}/appointments`}>
                        <CalendarDays className="mr-2 h-5 w-5" />
                        Zakaži
                    </Link>
                </Button>
            </div>
        </div>
    );
}
