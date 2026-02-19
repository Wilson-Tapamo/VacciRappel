"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Trophy,
    Award,
    Star,
    Camera,
    Calendar,
    Weight,
    Ruler,
    Edit2,
    Plus,
    ChevronRight,
    ChevronLeft,
    ShieldCheck,
    CheckCircle2,
    Clock,
    Activity
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import ChildVaccinationModal from "@/components/dashboard/ChildVaccinationModal";


function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const profiles = [
    {
        id: 1,
        name: "Lucas Kamga",
        age: "14 mois",
        image: "https://images.unsplash.com/photo-1544126592-807daa2b567b?auto=format&fit=crop&q=80&w=200&h=200",
        color: "sky",
        stats: { weight: "10.5 kg", height: "78 cm", group: "O+" },
        badges: [
            { name: "Premier Pas", icon: Award, earned: true },
            { name: "P'tit Brave", icon: Star, earned: true }
        ],
        growth: [45, 60, 55, 75, 85, 80, 78]
    },
    {
        id: 2,
        name: "Sarah Kamga",
        age: "3 ans",
        image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=200&h=200",
        color: "rose",
        stats: { weight: "15.2 kg", height: "96 cm", group: "O+" },
        badges: [
            { name: "Super Défense", icon: Trophy, earned: true },
            { name: "Curiosité", icon: Star, earned: true }
        ],
        growth: [70, 75, 82, 88, 92, 95, 96]
    }
];

export default function ProfilePage() {
    const [children, setChildren] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const fetchChildren = () => {
        fetch("/api/children")
            .then(res => res.json())
            .then(data => {
                setChildren(data);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchChildren();
    }, []);

    const activeProfile = children[currentIndex];

    const handleNext = () => setCurrentIndex((prev) => (prev + 1) % children.length);
    const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + children.length) % children.length);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="w-12 h-12 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (children.length === 0) {
        return (
            <div className="max-w-2xl mx-auto py-20 text-center space-y-8">
                <div className="w-24 h-24 bg-sky-50 rounded-[2.5rem] flex items-center justify-center text-sky-500 mx-auto shadow-inner">
                    <Plus size={48} />
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-slate-900">Aucun enfant ajouté</h1>
                    <p className="text-slate-500">Commencez par créer le profil de votre premier enfant pour suivre son calendrier vaccinal.</p>
                </div>
                <Link href="/children/add" className="px-10 py-4 gradient-primary text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-sky-200 hover:scale-105 transition-all">
                    Ajouter un Profil
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Top Profile Switcher (Miniatures) */}
            <div className="flex justify-center gap-6 p-4 glass rounded-[2.5rem] bg-white/40 border-white/50 sticky top-4 z-30 shadow-xl shadow-sky-900/5 transition-all">
                {children.map((p, idx) => (
                    <button
                        key={p.id}
                        onClick={() => setCurrentIndex(idx)}
                        className="group relative"
                    >
                        <div className={cn(
                            "w-14 h-14 rounded-full border-2 transition-all duration-500 overflow-hidden flex items-center justify-center bg-white",
                            idx === currentIndex ? "border-sky-500 scale-110 shadow-lg shadow-sky-200" : "border-white/50 opacity-60 hover:opacity-100"
                        )}>
                            {p.image ? (
                                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                                <User className="text-slate-300" size={24} />
                            )}
                        </div>
                        {idx === currentIndex && (
                            <motion.div
                                layoutId="active-dot"
                                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-sky-500 rounded-full"
                            />
                        )}
                    </button>
                ))}
                <Link href="/children/add" className="w-14 h-14 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:border-sky-500 hover:text-sky-500 transition-all active:scale-95 bg-white/30">
                    <Plus size={24} />
                </Link>
            </div>

            {/* Swipeable Profile Content */}
            <div className="relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeProfile.id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="space-y-10"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-4xl font-black text-slate-900 leading-tight">
                                    Profil de <span className={`text-${activeProfile.color}-500`}>{activeProfile.name.split(' ')[0]}</span>
                                </h1>
                                <p className="text-slate-500 font-medium mt-1">Données santé & Réussites</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={handlePrev} className="p-4 glass rounded-2xl hover:bg-white transition-all"><ChevronLeft size={20} /></button>
                                <button onClick={handleNext} className="p-4 glass rounded-2xl hover:bg-white transition-all"><ChevronRight size={20} /></button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            {/* Sidebar Info */}
                            <div className="space-y-6">
                                <div className="glass-card p-10 text-center relative overflow-hidden group">
                                    <div className="relative inline-block mb-8">
                                        <div className="w-40 h-40 rounded-[3rem] border-4 border-white shadow-2xl overflow-hidden flex items-center justify-center bg-white/50">
                                            {activeProfile.image ? (
                                                <img src={activeProfile.image} alt={activeProfile.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="text-slate-300" size={64} />
                                            )}
                                        </div>
                                        <button className="absolute -bottom-2 -right-2 w-12 h-12 bg-sky-500 text-white rounded-2xl flex items-center justify-center border-4 border-white shadow-lg">
                                            <Camera size={20} />
                                        </button>
                                    </div>

                                    <h2 className="text-2xl font-bold text-slate-900">{activeProfile.name}</h2>
                                    <p className="text-slate-500 font-semibold">
                                        {new Date().getFullYear() - new Date(activeProfile.birthDate).getFullYear()} ans
                                    </p>

                                    <div className="grid grid-cols-3 gap-4 mt-10 border-t border-white/50 pt-10">
                                        <div>
                                            <Weight className="mx-auto text-sky-500 mb-2" size={24} />
                                            <p className="text-[10px] text-slate-400 font-black uppercase">Poids</p>
                                            <p className="text-sm font-bold text-slate-800">{activeProfile.weight || "--"} kg</p>
                                        </div>
                                        <div>
                                            <Ruler className="mx-auto text-emerald-500 mb-2" size={24} />
                                            <p className="text-[10px] text-slate-400 font-black uppercase">Taille</p>
                                            <p className="text-sm font-bold text-slate-800">{activeProfile.height || "--"} cm</p>
                                        </div>
                                        <div>
                                            <Calendar className="mx-auto text-amber-500 mb-2" size={24} />
                                            <p className="text-[10px] text-slate-400 font-black uppercase">Groupe</p>
                                            <p className="text-sm font-bold text-slate-800">{activeProfile.bloodGroup || "--"}</p>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full py-5 gradient-primary text-white rounded-3xl font-bold shadow-2xl shadow-sky-900/10 hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2">
                                    <Edit2 size={18} />
                                    Modifier Informations
                                </button>
                            </div>

                            {/* Main Column */}
                            <div className="lg:col-span-2 space-y-10">
                                <section className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                                            <Trophy className="text-amber-500" size={28} />
                                            Hauts Faits & Badges
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        {(activeProfile.badges || []).map((b: any, i: number) => (
                                            <motion.div
                                                key={i}
                                                whileHover={{ y: -8, scale: 1.05 }}
                                                className="p-8 glass rounded-[2.5rem] text-center border-white shadow-sm"
                                            >
                                                <div className="w-16 h-16 mx-auto bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600 mb-4 shadow-inner">
                                                    <b.icon size={32} />
                                                </div>
                                                <p className="text-xs font-black text-slate-700 leading-tight">{b.name}</p>
                                            </motion.div>
                                        ))}
                                        <div className="p-8 glass rounded-[2.5rem] border-dashed border-2 border-slate-200 flex flex-col items-center justify-center opacity-40">
                                            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
                                                <Plus size={32} />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="glass-card p-10 space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                                                <ShieldCheck className="text-sky-500" size={28} />
                                                Santé & Vaccinations
                                            </h3>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-10">Statut du calendrier vaccinal</p>
                                        </div>
                                        <button
                                            onClick={() => setIsCalendarOpen(true)}
                                            className="px-6 py-3 bg-sky-50 text-sky-600 rounded-2xl font-black uppercase tracking-widest text-[9px] hover:bg-sky-500 hover:text-white transition-all shadow-sm"
                                        >
                                            Gérer le Calendrier
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-6 bg-slate-50 rounded-3xl space-y-4">
                                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                                <span className="text-slate-400">Taux de Complétion</span>
                                                <span className="text-sky-600">
                                                    {Math.round(((activeProfile.vaccinations?.filter((v: any) => v.status === 'DONE').length || 0) / (activeProfile.vaccinations?.length || 1)) * 100)}%
                                                </span>
                                            </div>
                                            <div className="h-2.5 bg-white rounded-full overflow-hidden p-0.5 shadow-inner">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.round(((activeProfile.vaccinations?.filter((v: any) => v.status === 'DONE').length || 0) / (activeProfile.vaccinations?.length || 1)) * 100)}%` }}
                                                    className="h-full gradient-primary rounded-full"
                                                />
                                            </div>
                                        </div>

                                        <div className="p-6 bg-slate-50 rounded-3xl flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Prochain Rappel</p>
                                                <p className="text-sm font-bold text-slate-800">
                                                    {activeProfile.vaccinations?.find((v: any) => v.status === 'PENDING')
                                                        ? activeProfile.vaccinations.find((v: any) => v.status === 'PENDING').vaccine.name
                                                        : "Aucun"
                                                    }
                                                </p>
                                            </div>
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-sky-500 shadow-sm">
                                                <Clock size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="glass-card p-10">
                                    <div className="flex items-center justify-between mb-10">
                                        <h3 className="text-xl font-black text-slate-800">Croissance Mensuelle</h3>
                                        <div className="flex gap-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-sky-500 rounded-full" />
                                                <span className="text-[10px] font-bold text-slate-500 uppercase">Taille</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-64 flex items-end justify-between gap-6 px-4 relative">
                                        {(activeProfile.growth || [40, 50, 60, 70, 80]).map((h: number, i: number) => (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                                <div className="relative w-full flex items-end justify-center h-full">
                                                    <motion.div
                                                        initial={{ height: 0 }}
                                                        animate={{ height: `${h}%` }}
                                                        transition={{ duration: 1.5, ease: "circOut" }}
                                                        className="w-full max-w-[40px] gradient-primary rounded-2xl shadow-lg relative cursor-help"
                                                    >
                                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-110">
                                                            <div className="bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded-xl font-bold shadow-xl">
                                                                {h}cm
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                </div>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Mois {i + 1}</span>
                                            </div>
                                        ))}
                                        {/* Artistic grid lines */}
                                        {[0, 25, 50, 75].map(line => (
                                            <div key={line} className="absolute inset-x-0 border-t border-slate-200/50 pointer-events-none transition-all" style={{ bottom: `${line}%` }} />
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <ChildVaccinationModal
                child={activeProfile}
                isOpen={isCalendarOpen}
                onClose={() => setIsCalendarOpen(false)}
                onUpdate={() => {
                    fetchChildren();
                }}
            />
        </div>
    );
}
