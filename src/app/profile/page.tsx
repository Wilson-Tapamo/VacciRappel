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
            <div className="max-w-2xl mx-auto py-20 text-center space-y-8 relative overflow-hidden">
                {/* Decorative blobs */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-200/20 rounded-full blur-3xl animate-pulse-slow" />
                
                <div className="relative z-10 w-32 h-32 bg-gradient-to-br from-sky-400 to-blue-600 rounded-[3rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-sky-200">
                    <Plus size={54} strokeWidth={3} />
                </div>
                <div className="space-y-3 relative z-10">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Aucun Petit Héros !</h1>
                    <p className="text-slate-500 text-lg font-medium max-w-md mx-auto">Commencez par créer le profil de votre enfant pour suivre ses aventures et ses vaccins.</p>
                </div>
                <Link href="/children/add" className="inline-flex px-12 py-5 gradient-primary text-white rounded-[2.5rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-sky-200 hover:scale-105 active:scale-95 transition-all relative z-10">
                    Ajouter mon premier enfant
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20 relative">
            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[10%] -left-[5%] w-[40%] h-[40%] bg-sky-100/40 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[10%] -right-[5%] w-[35%] h-[35%] bg-violet-100/30 rounded-full blur-[100px]" />
            </div>

            {/* Header with Switcher */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-4">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
                        Fiche <span className="text-sky-500">Santé</span>
                    </h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Espace de suivi personnalisé</p>
                </div>

                <div className="flex items-center gap-4 p-2.5 glass-card bg-white/60 rounded-[2.5rem] border-white/80 shadow-xl shadow-sky-900/5">
                    <div className="flex -space-x-4 items-center pl-2">
                        {children.map((p, idx) => (
                            <button
                                key={p.id}
                                onClick={() => setCurrentIndex(idx)}
                                className={cn(
                                    "relative w-14 h-14 rounded-full border-4 border-white transition-all duration-500 overflow-hidden shadow-md",
                                    idx === currentIndex ? "z-20 scale-110 ring-4 ring-sky-100 ring-offset-0" : "z-10 opacity-70 hover:opacity-100 grayscale-[0.3]"
                                )}
                            >
                                {p.image ? (
                                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                                        <User size={24} />
                                    </div>
                                )}
                                {idx === currentIndex && (
                                    <div className="absolute inset-0 bg-sky-500/10" />
                                )}
                            </button>
                        ))}
                        <Link href="/children/add" className="z-10 w-14 h-14 rounded-full border-4 border-white border-dashed bg-slate-50 flex items-center justify-center text-slate-400 hover:text-sky-500 transition-all active:scale-95 shadow-md">
                            <Plus size={24} />
                        </Link>
                    </div>
                    <div className="pr-4 pl-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Actif</p>
                        <p className="text-sm font-black text-slate-800 leading-tight mt-1 truncate max-w-[100px]">{activeProfile.name.split(' ')[0]}</p>
                    </div>
                </div>
            </div>

            {/* Profile Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeProfile.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-10"
                >
                    {/* LEFT PANEL: Identity */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="glass-card p-10 text-center relative overflow-hidden group border-white/80 bg-white/40 backdrop-blur-xl shadow-2xl shadow-sky-900/5">
                            {/* Decorative background circle */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-100/30 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-sky-200/40 transition-colors" />
                            
                            <div className="relative inline-block mb-10">
                                <div className="w-48 h-48 rounded-[4rem] border-8 border-white shadow-2xl overflow-hidden flex items-center justify-center bg-white group-hover:rotate-2 transition-transform duration-500">
                                    {activeProfile.image ? (
                                        <img src={activeProfile.image} alt={activeProfile.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="text-slate-200" size={80} strokeWidth={1} />
                                    )}
                                </div>
                                <label className="absolute -bottom-2 -right-2 w-14 h-14 bg-gradient-to-tr from-sky-400 to-blue-600 text-white rounded-[1.5rem] flex items-center justify-center border-4 border-white shadow-xl cursor-pointer hover:scale-110 active:scale-90 transition-all">
                                    <Camera size={24} />
                                    <input type="file" className="hidden" />
                                </label>
                            </div>

                            <div className="space-y-1">
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">{activeProfile.name}</h2>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest pt-2">
                                    Né le {new Date(activeProfile.birthDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mt-12 pt-10 border-t border-slate-100">
                                <div className="space-y-1">
                                    <div className="w-10 h-10 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-500 mx-auto shadow-sm">
                                        <Weight size={20} />
                                    </div>
                                    <p className="text-[9px] text-slate-400 font-black uppercase">Poids</p>
                                    <p className="text-sm font-black text-slate-800">{activeProfile.weight || "--"} kg</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mx-auto shadow-sm">
                                        <Ruler size={20} />
                                    </div>
                                    <p className="text-[9px] text-slate-400 font-black uppercase">Taille</p>
                                    <p className="text-sm font-black text-slate-800">{activeProfile.height || "--"} cm</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mx-auto shadow-sm">
                                        <Activity size={20} />
                                    </div>
                                    <p className="text-[9px] text-slate-400 font-black uppercase">Groupe</p>
                                    <p className="text-sm font-black text-slate-800">{activeProfile.bloodGroup || "--"}</p>
                                </div>
                            </div>
                        </div>

                        <button className="w-full py-6 px-8 rounded-[2.5rem] bg-white border border-slate-200 text-slate-700 font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 shadow-xl shadow-slate-200/50 hover:bg-slate-50 hover:-translate-y-1 active:translate-y-0 transition-all group">
                            <Edit2 size={18} className="text-sky-500" />
                            Modifier les informations
                        </button>
                    </div>

                    {/* RIGHT PANEL: Stats & Badges */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="glass-card p-8 bg-gradient-to-br from-sky-400 to-blue-600 border-none shadow-2xl shadow-sky-200 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                                    <ShieldCheck size={120} strokeWidth={1} />
                                </div>
                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white backdrop-blur-md">
                                            <ShieldCheck size={24} />
                                        </div>
                                        <span className="px-4 py-1.5 bg-white/20 text-white rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                                            Protection Santé
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-white/80 text-xs font-bold uppercase tracking-widest">Immunisation</p>
                                        <div className="flex items-end gap-3">
                                            <h4 className="text-5xl font-black text-white leading-none">
                                                {Math.round(((activeProfile.vaccinations?.filter((v: any) => v.status === 'DONE').length || 0) / (activeProfile.vaccinations?.length || 1)) * 100)}%
                                            </h4>
                                            <p className="text-white/60 text-sm font-bold mb-1">du parcours complété</p>
                                        </div>
                                    </div>
                                    <div className="h-2.5 bg-white/20 rounded-full overflow-hidden p-0.5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.round(((activeProfile.vaccinations?.filter((v: any) => v.status === 'DONE').length || 0) / (activeProfile.vaccinations?.length || 1)) * 100)}%` }}
                                            transition={{ duration: 1.5, ease: "circOut" }}
                                            className="h-full bg-white rounded-full shadow-lg"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card p-8 bg-white border-white/80 shadow-2xl shadow-sky-900/5 flex flex-col justify-between">
                                <div className="flex items-center justify-between">
                                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                                        <Clock size={24} />
                                    </div>
                                    <button 
                                        onClick={() => setIsCalendarOpen(true)}
                                        className="text-[10px] font-black text-sky-500 uppercase tracking-widest hover:text-sky-600 transition-colors"
                                    >
                                        Gérer
                                    </button>
                                </div>
                                <div className="space-y-1 mt-6">
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Prochain Rendez-vous</p>
                                    <h4 className="text-2xl font-black text-slate-800 tracking-tight">
                                        {activeProfile.vaccinations?.find((v: any) => v.status === 'PENDING')
                                            ? activeProfile.vaccinations.find((v: any) => v.status === 'PENDING').vaccine.name
                                            : "À jour pour le moment"
                                        }
                                    </h4>
                                    <p className="text-slate-500 text-sm font-medium">Recommandé à 18 mois</p>
                                </div>
                                <div className="mt-8">
                                    <button onClick={() => setIsCalendarOpen(true)} className="w-full py-3 bg-sky-50 text-sky-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-sky-500 hover:text-white transition-all">
                                        Voir les détails
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Badges Section */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                    <Trophy className="text-amber-500" size={32} />
                                    Hauts Faits
                                </h3>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase rounded-lg border border-amber-100">
                                        {(activeProfile.badges || []).length} Débloqués
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                {(activeProfile.badges || []).map((b: any, i: number) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ y: -5, scale: 1.05 }}
                                        className="p-8 glass-card bg-white border-white/80 text-center shadow-xl shadow-sky-900/5 group"
                                    >
                                        <div className="relative w-20 h-20 mx-auto mb-6">
                                            <div className="absolute inset-0 bg-sky-100 rounded-[2rem] rotate-6 group-hover:rotate-12 transition-transform opacity-30" />
                                            <div className="absolute inset-0 bg-sky-50 rounded-[2rem] flex items-center justify-center text-sky-500 shadow-inner group-hover:bg-sky-100 transition-colors">
                                                <Trophy size={40} strokeWidth={1.5} />
                                            </div>
                                        </div>
                                        <p className="text-sm font-black text-slate-800 leading-tight">{b.name}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Explorateur</p>
                                    </motion.div>
                                ))}
                                
                                <button className="p-8 glass bg-white/30 border-dashed border-4 border-slate-200 flex flex-col items-center justify-center gap-3 opacity-60 hover:opacity-100 hover:border-sky-300 hover:bg-sky-50/50 transition-all rounded-[2.5rem] group">
                                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-sky-500 group-hover:bg-white transition-all shadow-sm">
                                        <Plus size={24} />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nouveau</span>
                                </button>
                            </div>
                        </div>

                        {/* Growth Chart Preview */}
                        <div className="glass-card p-10 border-white/80 bg-white/40 backdrop-blur-xl shadow-2xl shadow-sky-900/5 relative overflow-hidden group">
                            {/* Decorative element */}
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 via-violet-500 to-amber-500" />
                            
                            <div className="flex items-center justify-between mb-12">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                        <Activity className="text-violet-500" size={32} />
                                        Suivi de Croissance
                                    </h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-10">Évolution de la taille (cm)</p>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                                    <Ruler size={16} className="text-slate-400" />
                                    <span className="text-sm font-black text-slate-700">Taille</span>
                                </div>
                            </div>

                            <div className="h-64 flex items-end justify-between gap-6 px-4 relative">
                                {(activeProfile.growth || [45, 60, 55, 75, 85, 80]).map((h: number, i: number) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar">
                                        <div className="relative w-full flex items-end justify-center h-full">
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${h}%` }}
                                                transition={{ duration: 1.5, delay: i * 0.1, ease: "circOut" }}
                                                className="w-full max-w-[45px] bg-gradient-to-b from-sky-400 to-sky-600 rounded-2xl shadow-lg relative cursor-help group-hover/bar:from-sky-500 group-hover/bar:to-sky-700"
                                            >
                                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all duration-300 scale-90 group-hover/bar:scale-100 pointer-events-none">
                                                    <div className="bg-slate-900 text-white text-[11px] px-3 py-2 rounded-2xl font-black shadow-2xl flex items-center gap-1.5 min-w-max">
                                                        {h} cm <span className="text-sky-400">↑</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase">Mois {i + 1}</span>
                                    </div>
                                ))}
                                {/* Artistic background grid */}
                                {[0, 33, 66, 100].map(line => (
                                    <div key={line} className="absolute inset-x-0 border-t border-slate-100 pointer-events-none" style={{ bottom: `${line}%` }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Modals */}
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
