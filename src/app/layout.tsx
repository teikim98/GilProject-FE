import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import "./globals.css";
import Provider from "./Provider";


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

        <link rel="apple-touch-icon" href="/icons/icon-192x192.j" />

      </head>
      <body>
        <Suspense
          fallback={
            <div className="animate-fade-in min-h-screen " />
          }
        >

          <Provider>
            {children}
            <Toaster />
          </Provider>
        </Suspense>
      </body>
    </html>
  );
}
