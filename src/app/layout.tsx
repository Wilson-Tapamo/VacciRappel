import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import MobileBottomNav from "@/components/MobileBottomNav";

import { Providers } from "@/providers/session-provider";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "VacciRappel - Votre compagnon de santé",
  description: "Suivez vos vaccinations et gérez la santé de votre famille en toute simplicité.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={plusJakarta.variable}>
      <body className="antialiased font-plus-jakarta bg-slate-50/30 text-slate-900">
        <Providers>
          {/* Artistic Background Blobs */}
          <div className="bg-blob bg-sky-100 top-[-100px] right-[-100px] animate-pulse-slow" />
          <div className="bg-blob bg-indigo-100 bottom-[-100px] left-[-100px] animate-pulse-slow font-plus-jakarta" style={{ animationDelay: '2s' }} />
          <div className="bg-blob bg-emerald-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10" />

          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 lg:pl-64 min-h-screen pb-24 lg:pb-0">
              <div className="max-w-7xl mx-auto p-4 md:p-10 pt-8 lg:pt-10">
                {children}
              </div>
            </main>
          </div>

          <MobileBottomNav />
        </Providers>
      </body>
    </html>
  );
}
