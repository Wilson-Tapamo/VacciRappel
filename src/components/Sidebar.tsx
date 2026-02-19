"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Calendar,
    User,
    Bell,
    MapPin,
    ScanLine,
    ShieldCheck,
    Menu,
    X,
    HelpCircle,
    Settings,
    PlusCircle
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const navItems = [
    { name: "Tableau de Bord", href: "/", icon: Home },
    { name: "Scanner Carnet", href: "/scan", icon: ScanLine },
    { name: "Carte Santé", href: "/map", icon: MapPin },
    { name: "Profil Enfant", href: "/profile", icon: User },
    { name: "Alertes", href: "/alerts", icon: Bell },
    { name: "Support IA", href: "/support", icon: HelpCircle },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Menu Button - Hidden transition handled by layout */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-lg border border-slate-200 opacity-0 pointer-events-none"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-40"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Content */}
            <motion.aside
                className={cn(
                    "fixed top-0 left-0 bottom-0 w-64 glass border-r z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 hidden lg:block",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full p-6">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-200">
                            <ShieldCheck size={24} />
                        </div>
                        <h1 className="font-bold text-xl tracking-tight text-slate-800">VacciRappel</h1>
                    </div>

                    <nav className="flex-1 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                        isActive
                                            ? "bg-white/50 text-sky-600 font-bold shadow-sm"
                                            : "text-slate-500 hover:bg-white/30 hover:text-slate-900"
                                    )}
                                >
                                    <item.icon size={20} className={cn(
                                        "transition-colors",
                                        isActive ? "text-sky-600" : "text-slate-400 group-hover:text-slate-600"
                                    )} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="pt-6 border-t border-slate-200/50">
                        <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 hover:text-slate-900 transition-colors mb-2">
                            <Settings size={20} />
                            <span className="text-sm font-medium">Paramètres</span>
                        </button>
                        <div className="p-5 gradient-primary rounded-[2rem] text-white shadow-xl shadow-sky-900/10 relative overflow-hidden group">
                            <div className="relative z-10">
                                <p className="text-[10px] font-bold opacity-80 mb-0.5 uppercase tracking-wider">Passer à</p>
                                <p className="font-bold text-lg mb-4 leading-tight">VacciCare Pro</p>
                                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-xl text-[11px] font-bold transition-all">
                                    Découvrir
                                </button>
                            </div>
                            <PlusCircle className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                    </div>
                </div>
            </motion.aside>
        </>
    );
}
