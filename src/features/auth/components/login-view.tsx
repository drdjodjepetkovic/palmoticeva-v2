"use client";

import { Button } from "@/components/ui/button";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/client";
import Image from "next/image";
import { useContent } from "@/features/content/content-context";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/features/content/context/language-context";
import { useEffect } from "react";
import { useAuth } from "@/features/auth/auth-context";

export function LoginView() {
    const { t } = useContent();
    const { language } = useLanguage();
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            router.push(`/${language}/profile`);
        }
    }, [user, language, router]);

    const handleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            // Redirect is handled by useEffect when user state updates
        } catch (error: any) {
            console.error("Error signing in with Google: ", error);
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col md:flex-row">
            {/* Left/Top: Nature Image */}
            <div className="relative h-[40vh] w-full md:h-full md:w-1/2 lg:w-3/5 bg-muted">
                <Image
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop"
                    alt="Medical clean abstract background"
                    fill
                    className="object-cover"
                    priority
                    style={{ objectPosition: 'center' }}
                />
                <div className="absolute inset-0 bg-teal-900/20 mix-blend-multiply" />

                <div className="absolute bottom-8 left-8 text-white p-4 md:hidden">
                    <h1 className="font-headline text-3xl font-bold">{t.common.brand}</h1>
                    <p className="text-lg opacity-90">{t.common.portal_subtitle}</p>
                </div>
            </div>

            {/* Right/Bottom: Login Form */}
            <div className="flex flex-1 flex-col justify-center px-8 py-12 md:px-12 lg:px-24 bg-background">
                <div className="mx-auto w-full max-w-sm space-y-8">
                    <div className="space-y-2 text-center md:text-left">
                        <h1 className="hidden md:block text-4xl text-primary">
                            <span className="font-headline font-bold block">{t.common.brand.split(' ')[0]}</span>
                            <span className="font-headline italic font-light text-3xl">{t.common.brand.split(' ').slice(1).join(' ')}</span>
                        </h1>
                        <p className="hidden md:block text-xl text-muted-foreground mt-2">
                            {t.common.portal_subtitle}
                        </p>

                        <div className="md:hidden text-2xl text-foreground mb-8">
                            <h2 className="text-2xl font-bold">{t.auth.welcome_title}</h2>
                            <p className="text-muted-foreground text-base">{t.auth.welcome_subtitle}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Button
                            variant="default"
                            size="lg"
                            className="w-full gap-2 text-base py-6"
                            onClick={handleSignIn}
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#FFFFFF"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#FFFFFF"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FFFFFF"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#FFFFFF"
                                />
                            </svg>
                            {t.auth.login_google}
                        </Button>

                        <p className="text-center text-sm text-muted-foreground">
                            {t.auth.terms}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
