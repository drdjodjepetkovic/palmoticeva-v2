
"use client";

import './globals.css';
import { LanguageProvider, useLanguage } from '@/context/language-context';
import { AuthProvider } from '@/context/auth-context';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import Script from 'next/script';
import { Inter, Press_Start_2P } from 'next/font/google';
import { AppStateSynchronizer } from '@/components/app-state-synchronizer';
import { TourHandler } from '@/components/tour-handler';
import { Suspense } from 'react';
import SplashScreen from '@/components/layout/splash-screen';
import { EventBusProvider } from '@/context/event-bus-context';
import { UserInteractionHub } from '@/components/user-interaction-hub';
import { PwaInstallToast } from '@/components/pwa-install-toast';


const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-body',
  display: 'swap',
});

const headlineFont = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-headline',
  display: 'swap',
});

const pressStart2P = Press_Start_2P({
  subsets: ['latin', 'cyrillic'],
  weight: '400',
  variable: '--font-pixel',
  display: 'swap',
});


const APP_NAME = "Ginekologija Palmotićeva";
const APP_DESCRIPTION = "Ginekološka ordinacija Palmotićeva u centru Beograda: pregledi, vođenje trudnoće, histeroskopija, laparoskopija i estetska ginekologija uz savremenu tehnologiju.";
const APP_URL = "https://ginekologija.palmoticeva.com";
const OG_IMAGE_URL = "https://firebasestorage.googleapis.com/v0/b/palmoticeva-portal.firebasestorage.app/o/images%2Fog-image.jpg?alt=media&token=d309944a-579c-44a3-9562-b915606e3009";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  "name": "Ginekološka ordinacija Palmotićeva",
  "description": APP_DESCRIPTION,
  "url": APP_URL,
  "logo": "https://firebasestorage.googleapis.com/v0/b/palmoticeva-portal.firebasestorage.app/o/pwa%2Ficon-512x512.png?alt=media",
  "image": OG_IMAGE_URL,
  "telephone": "+381113226040",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Palmotićeva 33",
    "addressLocality": "Beograd",
    "postalCode": "11000",
    "addressCountry": "RS"
  },
  "founder": {
    "@type": "Person",
    "name": "Mr sci. med. Slobodanka Petković"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "08:00",
      "closes": "20:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "08:00",
      "closes": "15:00"
    }
  ],
  "priceRange": "$$$",
  "medicalSpecialty": ["Gynecology", "Obstetrics", "Infertility"],
  "availableService": [
    { "@type": "MedicalProcedure", "name": "Histeroskopija" },
    { "@type": "MedicalProcedure", "name": "Laparoskopija" },
    { "@type": "MedicalProcedure", "name": "Labioplastika" },
    { "@type": "MedicalProcedure", "name": "Eksplorativna kiretaža" },
    { "@type": "MedicalProcedure", "name": "Biopsija grlića materice" },
    { "@type": "MedicalTest", "name": "PAPA test" },
    { "@type": "MedicalTest", "name": "Kolposkopija" },
    { "@type": "MedicalTest", "name": "Ultrazvučni pregled" }
  ],
  "isAcceptingNewPatients": true,
  "paymentAccepted": ["Cash", "Credit Card"],
  "currenciesAccepted": "RSD",
  "knowsAbout": ["Women's Health", "Pregnancy", "Menopause", "Infertility"]
};

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const iconUrl = "https://firebasestorage.googleapis.com/v0/b/palmoticeva-portal.firebasestorage.app/o/images%2Fflavicon.ico?alt=media&token=91f4d2eb-869f-48d3-a5fc-c0fc7188753f";

  return (
    <html lang={language} suppressHydrationWarning>
      <head>
        {/* --- CORE METADATA --- */}
        <title>{`Ginekologija Palmotićeva | 27 godina poverenja i savremene nege`}</title>
        <meta name="description" content={APP_DESCRIPTION} />
        <link rel="canonical" href={APP_URL} />

        {/* --- PWA & APP METADATA --- */}
        <meta name="application-name" content={APP_NAME} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content={APP_NAME} />
        <meta name="format-detection" content="telephone=no" />
        <link rel="manifest" href="/manifest.json" />

        {/* --- FAVICONS & APPLE SPECIFIC ICONS --- */}
        <link rel="icon" type="image/x-icon" href={iconUrl} />
        <link rel="apple-touch-icon" href="/pwa/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/pwa/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/pwa/icon-167x167.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/pwa/icon-180x180.png" />

        {/* --- SPLASH SCREENS --- */}
        <link rel="apple-touch-startup-image" media="screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="/pwa/splash/apple-splash-2048-2732.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="/pwa/splash/apple-splash-1668-2388.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="/pwa/splash/apple-splash-1536-2048.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="/pwa/splash/apple-splash-1290-2796.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="/pwa/splash/apple-splash-1179-2556.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="/pwa/splash/apple-splash-1284-2778.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="/pwa/splash/apple-splash-1170-2532.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="/pwa/splash/apple-splash-1125-2436.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="/pwa/splash/apple-splash-1242-2688.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="/pwa/splash/apple-splash-828-1792.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="/pwa/splash/apple-splash-750-1334.png" />

        {/* --- THEME & VIEWPORT --- */}
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="viewport" content="initial-scale=1, viewport-fit=cover, width=device-width" />

        {/* --- SOCIAL MEDIA & SEO (OPEN GRAPH / TWITTER CARDS) --- */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={APP_URL} />
        <meta property="og:title" content={`Ginekologija Palmotićeva | 27 godina poverenja i savremene nege`} />
        <meta property="og:description" content={APP_DESCRIPTION} />
        <meta property="og:image" content={OG_IMAGE_URL} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Ginekologija Palmotićeva | 27 godina poverenja i savremene nege`} />
        <meta name="twitter:description" content={APP_DESCRIPTION} />
        <meta name="twitter:image" content={OG_IMAGE_URL} />

        {/* --- JSON-LD STRUCTURED DATA --- */}
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={cn(
        "min-h-screen bg-background text-foreground antialiased",
        inter.variable,
        headlineFont.variable,
        pressStart2P.variable
      )}>
        {/* Temporarily disabled - causing blank logo */}
        {/* <Suspense fallback={<SplashScreen />}> */}
        <UserInteractionHub />
        <PwaInstallToast />
        <Suspense fallback={null}>
          <TourHandler />
        </Suspense>
        <AppStateSynchronizer />
        {children}
        {/* </Suspense> */}
        <Toaster />
      </body>
    </html>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <EventBusProvider>
      <AuthProvider>
        <LanguageProvider>
          <RootLayoutContent>{children}</RootLayoutContent>
        </LanguageProvider>
      </AuthProvider>
    </EventBusProvider>
  );
}
