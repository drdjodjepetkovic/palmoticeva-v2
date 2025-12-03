import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { AuthProvider } from "@/features/auth/auth-context";
import { LanguageProvider } from "@/features/content/context/language-context";
import type { AppLanguage } from "@/core/types";

import { EventBusProvider } from "@/context/event-bus-context";
import { AiWidget } from "@/features/ai/components/ai-widget";
import { DialogProvider } from "@/features/cycle/context/dialog-context";
import { GlobalCycleDialog } from "@/features/cycle/components/global-cycle-dialog";
import { ThemeProvider } from "@/components/theme-provider";

export default function Layout({
    children,
    params: { lang },
}: {
    children: React.ReactNode;
    params: { lang: AppLanguage };
}) {
    return (
        <LanguageProvider>
            <AuthProvider>
                <DialogProvider>
                    <EventBusProvider>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="system"
                            enableSystem
                            disableTransitionOnChange
                        >
                            <div className="flex min-h-screen flex-col">
                                <Header />
                                <main className="flex-1 pb-20 md:pb-0">
                                    {children}
                                </main>
                                <Footer />
                                <AiWidget />
                                <MobileNav />
                                <GlobalCycleDialog />
                            </div>
                        </ThemeProvider>
                    </EventBusProvider>
                </DialogProvider>
            </AuthProvider>
        </LanguageProvider>
    );
}
