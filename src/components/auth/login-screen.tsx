"use client";

import { Button } from "@/components/ui/button";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/client";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";

export function LoginScreen() {
    const { language } = useLanguage();

    const handleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error: any) {
            console.error("Error signing in with Google: ", error);
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col md:flex-row">
            {/* Left/Top: Nature Image */}
            <div className="relative h-[40vh] w-full md:h-full md:w-1/2 lg:w-3/5 bg-muted">
                <Image
                    src="https://firebasestorage.googleapis.com/v0/b/palmoticeva-portal.firebasestorage.app/o/images%2Fnature-macro.jpg?alt=media&token=placeholder" // Placeholder, need a real image or use a solid color/gradient for now if image missing
                    alt="Nature texture"
                    fill
                    className="object-cover"
                    priority
                    style={{ objectPosition: 'center' }}
                />
                {/* Overlay for text readability if needed, or just aesthetic tint */}
                <div className="absolute inset-0 bg-teal-900/20 mix-blend-multiply" />

                <div className="absolute bottom-8 left-8 text-white p-4 md:hidden">
                    <h1 className="font-headline text-3xl font-bold">Ginekologija Palmotićeva</h1>
                    <p className="text-lg opacity-90">Portal za pacijentkinje</p>
                </div>
            </div>

            {/* Right/Bottom: Login Form */}
            <div className="flex flex-1 flex-col justify-center px-8 py-12 md:px-12 lg:px-24 bg-background">
                <div className="mx-auto w-full max-w-sm space-y-8">
                    <div className="space-y-2 text-center md:text-left">
                        <h1 className="hidden md:block text-4xl text-primary">
                            <span className="font-headline font-bold block">Ginekologija</span>
                            <span className="font-body italic font-light text-3xl">Palmotićeva</span>
                        </h1>
                        <p className="hidden md:block text-xl text-muted-foreground mt-2">
                            Portal za pacijentkinje
                        </p>
                        <div className="md:hidden text-2xl text-foreground">
                            <span className="font-headline font-bold block">Ginekologija</span>
                            <span className="font-body italic font-light">Palmotićeva</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Button
                            variant="default"
                            size="lg"
                            className="w-full gap-2 text-base"
                            onClick={handleSignIn}
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Prijavite se sa Google-om
                        </Button>

                        <p className="text-center text-sm text-muted-foreground">
                            Pristupom portalu prihvatate naše uslove korišćenja i politiku privatnosti.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
