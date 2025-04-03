import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'react-tooltip/dist/react-tooltip.css'

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";


import { Toaster } from "@/components/ui/sonner";

import { SessionProvider } from "next-auth/react"
import { Session } from "next-auth";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Futbolisimos - Web",
  description: "Web de futboleros, crea tu equipo y juega contra tus amigos",
  authors: [{ name: "CrIsTiAnPvP", url: "https://cristianac.live" }],
  icons: {
    icon: "/images/icono.ico",
  }
};

type RootLayoutProps = {
  children: React.ReactNode;  
  params: Promise<{ locale: string }>;
  session: Session | null;
}

export default async function RootLayout({
  children, params, session
}: RootLayoutProps) {

  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "es")) {
    return notFound();
  }

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={await getMessages()}>
          <SessionProvider session={session}>
            {children}
            <Toaster theme="system" closeButton={true} />
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
