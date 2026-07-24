"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import MobileBottomNav from "@/components/MobileBottomNav";
import PwaManager from "@/components/pwa/PwaManager";
import { cn } from "@/lib/utils";
import MobileHeader from "@/components/MobileHeader";
import AppSplashScreen from "@/components/AppSplashScreen";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");

  return (
    <>
      <AppSplashScreen />
      <PwaManager />

      <div className="bg-blob bg-sky-100 top-[-100px] right-[-100px] animate-pulse-slow" />
      <div
        className="bg-blob bg-indigo-100 bottom-[-100px] left-[-100px] animate-pulse-slow"
        style={{ animationDelay: "2s" }}
      />
      <div className="bg-blob bg-emerald-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10" />

      <div className="flex min-h-screen">
        {!isAuthPage && <Sidebar />}
        {!isAuthPage && <MobileHeader />}
        <main
          className={cn(
            "flex-1 min-h-screen pb-24 lg:pb-0",
            !isAuthPage && "lg:pl-64",
          )}
        >
          <div className="max-w-7xl mx-auto p-4 md:p-10 pt-24 lg:pt-10">
            {children}
          </div>
        </main>
      </div>

      {!isAuthPage && <MobileBottomNav />}
    </>
  );
}
