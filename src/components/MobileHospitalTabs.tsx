"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileHospitalTabsProps {
    mapContent: React.ReactNode;
    hospitalsContent: React.ReactNode;
}

export default function MobileHospitalTabs({ mapContent, hospitalsContent }: MobileHospitalTabsProps) {
    const [activeTab, setActiveTab] = useState<"map" | "hospitals">("map");

    const tabs = [
        { id: "map" as const, label: "Carte", icon: MapPin },
        { id: "hospitals" as const, label: "Hôpitaux", icon: Building2 },
    ];

    return (
        <div className="lg:hidden flex flex-col h-[calc(100vh-8rem)]">
            {/* Uber-style floating tab bar */}
            <div className="relative z-30 flex items-center gap-2 p-1.5 bg-white/80 backdrop-blur-2xl rounded-2xl shadow-xl shadow-sky-900/10 border border-white/60 mb-4">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "relative flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300",
                                isActive ? "text-white" : "text-slate-400"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="hospital-tab-bg"
                                    className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl shadow-lg"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                <tab.icon size={16} />
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-hidden rounded-2xl">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: activeTab === "map" ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                    className="h-full overflow-y-auto no-scrollbar"
                >
                    {activeTab === "map" ? mapContent : hospitalsContent}
                </motion.div>
            </div>
        </div>
    );
}
