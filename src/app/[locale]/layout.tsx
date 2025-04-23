import type { Metadata } from "next";
import 'react-tooltip/dist/react-tooltip.css'
import "./globals.css";

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

import { SessionProvider } from "@/provider/SessionProvider";
import { getServerSession } from "next-auth";
import { auth } from "@/auth";

import { Toaster } from "@/components/ui/sonner";

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
}

export default async function RootLayout({ children, params }: RootLayoutProps) {

  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "es")) {
    return notFound();
  }
  const messages = await getMessages()
  const session = await auth();

  return (
    <html lang={locale}>
      <body className='bg-gray-100 dark:bg-gray-900'>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SessionProvider session={session}>
            {children}
          </SessionProvider>
          <Toaster theme="system" closeButton={true} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
