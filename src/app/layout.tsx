import type { Metadata, Viewport } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils"; // We need to create this util or inline it
// import { Toaster } from "@/components/ui/toaster"; // Will add later

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });
const lora = Lora({ subsets: ["latin", "cyrillic"], variable: "--font-lora" });

export const metadata: Metadata = {
    title: "Ginekologija Palmotićeva",
    description: "Ginekološka ordinacija Palmotićeva - 27 godina poverenja.",
    manifest: "/manifest.json",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: "#FFFFFF",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="sr" suppressHydrationWarning>
            <body
                className={cn(
                    "min-h-screen bg-background font-sans antialiased",
                    inter.variable,
                    lora.variable
                )}
            >
                {children}
                {/* <Toaster /> */}
            </body>
        </html>
    );
}
