"use client";

import { motion } from "framer-motion";
import {
    ShieldCheck,
    Clock,
    Info,
    Award,
    ChevronLeft,
    Share2,
    Syringe,
    AlertTriangle,
    Gift
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function VaccineDetailsPage() {
    const params = useParams();

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <Link
                    href="/"
                    className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-slate-900 transition-all shadow-sm flex items-center gap-2 font-bold text-sm"
                >
                    <ChevronLeft size={18} />
                    Retour
                </Link>
                <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-slate-900 transition-all shadow-sm">
                    <Share2 size={18} />
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-br from-sky-500 to-indigo-600 p-10 text-white relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                <ShieldCheck size={40} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold">DTP - Rappel</h1>
                                <p className="text-white/80 font-medium">Diphtérie, Tétanos, Poliomyélite</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-sm font-bold flex items-center gap-2">
                                <Clock size={16} />
                                Prévu le 12 Mars 2026
                            </div>
                        </div>
                    </div>
                    <Syringe className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10 rotate-12" />
                </div>

                <div className="p-10 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="space-y-2">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Âge Recommandé</p>
                            <p className="text-xl font-bold text-slate-800">14 Mois</p>
                        </div>
                        <div className="space-y-2 border-x border-slate-50">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Type</p>
                            <p className="text-xl font-bold text-slate-800">Obligatoire</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Dose</p>
                            <p className="text-xl font-bold text-slate-800">Rappel n°1</p>
                        </div>
                    </div>

                    <section className="space-y-4">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Info className="text-sky-500" size={24} />
                            À propos de ce vaccin
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                            Ce rappel est crucial pour maintenir l'immunité contre trois maladies graves. La diphtérie peut causer des problèmes respiratoires, le tétanos affecte le système nerveux, et la polio peut entraîner des paralysies. Une dose unique suffit pour relancer la protection à long terme.
                        </p>
                    </section>

                    <div className="p-8 bg-amber-50 rounded-3xl border border-amber-100 flex gap-6 items-start">
                        <AlertTriangle className="text-amber-500 shrink-0" size={32} />
                        <div className="space-y-2">
                            <h4 className="font-bold text-amber-900">Effet Secondaires Possibles</h4>
                            <p className="text-sm text-amber-800">Une légère fièvre ou une rougeur au point d'injection peut apparaître. C'est le signe que le système immunitaire réagit correctement.</p>
                        </div>
                    </div>

                    <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-100 flex flex-col md:flex-row items-center gap-8">
                        <div className="p-4 bg-white/20 rounded-3xl backdrop-blur-md">
                            <Gift size={48} className="animate-bounce" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-xl font-bold mb-2">Récompense de Courage</h3>
                            <p className="text-indigo-100 text-sm mb-4">Plus que ce vaccin pour débloquer la peluche interactive "Super Vacci" !</p>
                            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "90%" }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                />
                            </div>
                        </div>
                        <div className="px-4 py-2 bg-indigo-500 border border-white/20 rounded-2xl text-[10px] font-bold uppercase">
                            90% Complété
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
