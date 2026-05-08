"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Star,
    Heart,
    ShieldCheck,
    Clock,
    Baby,
    Sparkles,
    CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Helper to format date
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
        day: date.getDate(),
        month: date.toLocaleDateString('fr-FR', { month: 'short' }),
        year: date.getFullYear(),
        full: date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    };
};

export default function CalendarPage() {
    const [children, setChildren] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/children")
            .then(res => res.json())
            .then(data => {
                setChildren(data);
                if (data.length > 0) setSelectedChildId(data[0].id);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="w-12 h-12 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (children.length === 0) {
        return (
            <div className="max-w-2xl mx-auto py-20 text-center space-y-8 relative overflow-hidden">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl animate-pulse-slow" />
                <div className="relative z-10 w-32 h-32 bg-gradient-to-br from-rose-400 to-pink-600 rounded-[3rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-rose-200">
                    <CalendarIcon size={54} strokeWidth={3} />
                </div>
                <div className="space-y-3 relative z-10">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Calendrier Vide</h1>
                    <p className="text-slate-500 text-lg font-medium max-w-md mx-auto">Ajoutez un enfant pour découvrir son programme de vaccination personnalisé.</p>
                </div>
                <Link href="/children/add" className="inline-flex px-12 py-5 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-[2.5rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-rose-200 hover:scale-105 active:scale-95 transition-all relative z-10">
                    Ajouter un enfant
                </Link>
            </div>
        );
    }

    const activeChild = children.find(c => c.id === selectedChildId) || children[0];

    // Sort vaccinations: pending first (by date), then done (by date)
    const sortedVaccinations = [...(activeChild.vaccinations || [])].sort((a, b) => {
        if (a.status !== b.status) {
            return a.status === 'PENDING' ? -1 : 1;
        }
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    const colors = [
        "from-sky-400 to-blue-500 text-sky-500 bg-sky-50 border-sky-200",
        "from-violet-400 to-purple-500 text-violet-500 bg-violet-50 border-violet-200",
        "from-teal-400 to-emerald-500 text-teal-500 bg-teal-50 border-teal-200",
        "from-rose-400 to-pink-500 text-rose-500 bg-rose-50 border-rose-200",
        "from-amber-400 to-orange-500 text-amber-500 bg-amber-50 border-amber-200",
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20 relative">
            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[5%] -left-[10%] w-[50%] h-[50%] bg-rose-100/40 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[20%] -right-[10%] w-[40%] h-[40%] bg-amber-100/30 rounded-full blur-[100px]" />
                <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-sky-100/30 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
            </div>

            {/* Header */}
            <div className="text-center space-y-4 pt-4 relative">
                {/* Floating playful icons */}
                <div className="absolute top-0 left-10 text-amber-400 animate-bounce-slow hidden md:block">
                    <Star size={32} fill="currentColor" />
                </div>
                <div className="absolute top-10 right-10 text-rose-400 animate-float hidden md:block" style={{ animationDelay: '1s' }}>
                    <Heart size={28} fill="currentColor" />
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
                    Le Calendrier <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-500">Magique</span>
                </h1>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px] max-w-lg mx-auto">
                    Suivez les super-pouvoirs (vaccins) de vos enfants pour les garder forts et en bonne santé !
                </p>
            </div>

            {/* Child Selector */}
            <div className="flex flex-wrap justify-center gap-4">
                {children.map((child) => (
                    <button
                        key={child.id}
                        onClick={() => setSelectedChildId(child.id)}
                        className={cn(
                            "flex items-center gap-3 px-6 py-3 rounded-[2rem] transition-all font-black text-sm border-2 shadow-sm",
                            selectedChildId === child.id 
                                ? "bg-white border-rose-200 text-rose-500 shadow-rose-200/50 scale-105" 
                                : "bg-white/60 border-transparent text-slate-500 hover:bg-white hover:border-slate-200"
                        )}
                    >
                        {child.image ? (
                            <img src={child.image} alt={child.name} className="w-8 h-8 rounded-full object-cover shadow-sm" />
                        ) : (
                            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shadow-sm text-white", selectedChildId === child.id ? "bg-rose-400" : "bg-slate-300")}>
                                <Baby size={16} />
                            </div>
                        )}
                        {child.name.split(' ')[0]}
                    </button>
                ))}
            </div>

            {/* Timeline */}
            <div className="relative mt-12">
                {/* Central Line */}
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-2 bg-gradient-to-b from-sky-100 via-rose-100 to-teal-100 rounded-full -translate-x-1/2" />

                <div className="space-y-12">
                    <AnimatePresence mode="popLayout">
                        {sortedVaccinations.map((v, i) => {
                            const isDone = v.status === "DONE";
                            const dateInfo = formatDate(v.date);
                            const colorClass = colors[i % colors.length];
                            // Extract color details safely
                            const gradient = colorClass.split(' ').find(c => c.startsWith('from-'));
                            const toGradient = colorClass.split(' ').find(c => c.startsWith('to-'));
                            const textCol = colorClass.split(' ').find(c => c.startsWith('text-'));
                            const bgCol = colorClass.split(' ').find(c => c.startsWith('bg-'));
                            const borderCol = colorClass.split(' ').find(c => c.startsWith('border-'));
                            const isLeft = i % 2 === 0;

                            return (
                                <motion.div
                                    key={v.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.5, delay: i * 0.1, type: "spring", stiffness: 100 }}
                                    className={`relative flex items-center gap-6 md:gap-0 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                                >
                                    {/* Date Circle */}
                                    <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center z-10">
                                        <div className={cn(
                                            "w-16 h-16 rounded-[2rem] border-4 flex flex-col items-center justify-center shadow-xl rotate-3 hover:rotate-0 transition-transform",
                                            isDone ? "bg-emerald-500 border-white text-white shadow-emerald-500/40" : `bg-white ${borderCol} ${textCol} shadow-slate-200/50`
                                        )}>
                                            {isDone ? (
                                                <CheckCircle2 size={28} strokeWidth={3} />
                                            ) : (
                                                <>
                                                    <span className="text-xl font-black leading-none">{dateInfo.day}</span>
                                                    <span className="text-[10px] font-black uppercase tracking-wider leading-none mt-1">{dateInfo.month}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content Card */}
                                    <div className={cn(
                                        "ml-24 md:ml-0 md:w-1/2 flex",
                                        isLeft ? "md:pr-16 md:justify-end" : "md:pl-16 md:justify-start"
                                    )}>
                                        <div className={cn(
                                            "w-full glass-card p-6 border-2 transition-all hover:-translate-y-2 relative overflow-hidden group",
                                            isDone 
                                                ? "bg-emerald-50/80 border-emerald-100 shadow-emerald-100 opacity-70 hover:opacity-100" 
                                                : `bg-white ${borderCol} shadow-xl hover:shadow-2xl`
                                        )}>
                                            {/* Decorative blob in card */}
                                            {!isDone && (
                                                <div className={cn(
                                                    "absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-20 transition-transform group-hover:scale-150",
                                                    bgCol?.replace('bg-', 'bg-') // Uses the base color for the blob
                                                )} />
                                            )}

                                            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className={cn(
                                                            "px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1",
                                                            isDone ? "bg-emerald-100 text-emerald-700" : `${bgCol} ${textCol}`
                                                        )}>
                                                            {isDone ? <ShieldCheck size={12} /> : <Sparkles size={12} />}
                                                            {isDone ? "Protégé" : "À venir"}
                                                        </span>
                                                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                                                            <Clock size={10} />
                                                            {dateInfo.year}
                                                        </span>
                                                    </div>
                                                    <h3 className={cn("text-xl font-black tracking-tight", isDone ? "text-emerald-900" : "text-slate-800")}>
                                                        {v.vaccine.name}
                                                    </h3>
                                                    <p className="text-slate-500 text-sm font-medium mt-1 line-clamp-2">
                                                        Contre : {v.vaccine.protection}
                                                    </p>
                                                </div>
                                                
                                                {!isDone && (
                                                    <div className={cn(
                                                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg text-white bg-gradient-to-br",
                                                        gradient, toGradient
                                                    )}>
                                                        <ShieldCheck size={20} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>

            {/* Add to Mobile Navigation helper */}
            <div className="text-center pt-8">
                <p className="text-slate-400 font-medium text-sm flex items-center justify-center gap-2">
                    <Sparkles size={16} className="text-amber-400" />
                    Chaque vaccin est un super-pouvoir débloqué !
                </p>
            </div>
        </div>
    );
}
