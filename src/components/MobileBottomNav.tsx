"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    MapPin,
    ScanLine,
    User,
    HeartPulse
} from "lucide-react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const navItems = [
    { name: "Accueil", href: "/", icon: Home },
    { name: "Scanner", href: "/scan", icon: ScanLine },
    { name: "Support", href: "/support", icon: HeartPulse, isPrimary: true },
    { name: "Carte", href: "/map", icon: MapPin },
    { name: "Profil", href: "/profile", icon: User },
];

export default function MobileBottomNav() {
    const pathname = usePathname();

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
            <div className="bg-white/70 backdrop-blur-2xl border border-white/40 rounded-[2.5rem] shadow-2xl shadow-sky-900/10 flex items-center justify-around p-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;

                    if (item.isPrimary) {
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative -top-6"
                            >
                                <div className={cn(
                                    "w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 active:scale-90",
                                    isActive
                                        ? "bg-sky-500 text-white shadow-sky-300"
                                        : "bg-slate-900 text-white shadow-slate-400"
                                )}>
                                    <item.icon size={28} className={cn(isActive && "animate-pulse")} />
                                </div>
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-active-dot"
                                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-sky-500 rounded-full"
                                    />
                                )}
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative p-3 group"
                        >
                            <item.icon
                                size={22}
                                className={cn(
                                    "transition-all duration-300 group-active:scale-90",
                                    isActive ? "text-sky-500" : "text-slate-400"
                                )}
                            />
                            {isActive && (
                                <motion.div
                                    layoutId="nav-active-dot"
                                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-sky-500 rounded-full"
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
