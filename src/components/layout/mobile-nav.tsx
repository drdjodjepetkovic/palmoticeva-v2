"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/auth-context";
import { useContent } from "@/features/content/content-context";
import { Home, CreditCard, Stethoscope, Plus, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDialog } from "@/features/cycle/context/dialog-context";

export function MobileNav() {
    const { user } = useAuth();
    const { t, language } = useContent();
    const pathname = usePathname();
    const { openDialog } = useDialog();

    const isActive = (path: string) => pathname === `/${language}${path}` || pathname === `/${language}${path}/`;

    return (
        <div className="fixed bottom-6 left-4 right-4 z-50 md:hidden">
            <nav className="flex items-center justify-between bg-background/95 backdrop-blur-md border rounded-full shadow-xl px-2 h-16">
                <Link
                    href={`/${language}`}
                    className={cn(
                        "flex flex-col items-center justify-center gap-1 w-14 h-full transition-colors",
                        isActive("") ? "text-primary" : "text-muted-foreground"
                    )}
                >
                    <Home className="h-5 w-5" />
                    <span className="text-[9px] font-medium">{t.nav.home}</span>
                </Link>

                <Link
                    href={`/${language}/pricelist`}
                    className={cn(
                        "flex flex-col items-center justify-center gap-1 w-14 h-full transition-colors",
                        isActive("/pricelist") ? "text-primary" : "text-muted-foreground"
                    )}
                >
                    <CreditCard className="h-5 w-5" />
                    <span className="text-[9px] font-medium">{t.nav.pricelist || t.pricelist.title}</span>
                </Link>

                <div className="relative -top-5">
                    <button
                        onClick={() => openDialog()}
                        className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-transform active:scale-95 ring-4 ring-background"
                    >
                        <Plus className="h-8 w-8" />
                    </button>
                </div>

                <Link
                    href={`/${language}/appointments`}
                    className={cn(
                        "flex flex-col items-center justify-center gap-1 w-14 h-full transition-colors",
                        isActive("/appointments") ? "text-primary" : "text-muted-foreground"
                    )}
                >
                    <Stethoscope className="h-5 w-5" />
                    <span className="text-[9px] font-medium">{t.nav.appointments}</span>
                </Link>

                <a
                    href="tel:+381113340668"
                    className={cn(
                        "flex flex-col items-center justify-center gap-1 w-14 h-full transition-colors text-muted-foreground hover:text-primary"
                    )}
                >
                    <Phone className="h-5 w-5" />
                    <span className="text-[9px] font-medium">{language === 'sr' ? 'Pozovite' : 'Call Us'}</span>
                </a>
            </nav>
        </div>
    );
}
