import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import "./globals.css";
import Provider from "./Provider";
import { GoogleAnalytics } from '../../node_modules/@next/third-parties/dist/google/ga';
import { PWAEventHandler } from "@/components/layout/PwaEventHandler";


export const metadata: Metadata = {
  title: 'My Next.js PWA',
  description: 'My Progressive Web App using Next.js 14',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'My Next.js PWA',
  },
  formatDetection: {
    telephone: false
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false&libraries=services`}
          strategy="beforeInteractive"
        />
        <GoogleAnalytics gaId={`${process.env.NEXT_PUBLIC_GA_ID}`} />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.j" />
        <title>길따라</title>
      </head>
      <body className="font-pretendard">
        <Suspense
          fallback={
            <div className="animate-fade-in min-h-screen " />
          }
        >
          <PWAEventHandler />
          <Provider>
            {children}
            <Toaster />
          </Provider>
        </Suspense>
      </body>
    </html>
  );
}
