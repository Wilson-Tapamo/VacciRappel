"use client";

import { useState, useEffect } from "react";
import {
    Search,
    ChevronLeft,
    Info,
    ShieldCheck,
    Calendar,
    ChevronRight,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import VaccineDetailModal from "@/components/vaccines/VaccineDetailModal";

export default function VaccinesPage() {
    const [vaccines, setVaccines] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedVaccine, setSelectedVaccine] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetch("/api/vaccines")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setVaccines(data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const filteredVaccines = vaccines.filter(v =>
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.protection?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenModal = (vaccine: any) => {
        setSelectedVaccine(vaccine);
        setIsModalOpen(true);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-slate-500 hover:text-sky-600 transition-colors font-black uppercase tracking-widest text-[10px]"
                    >
                        <ChevronLeft size={16} />
                        Retour au Dashboard
                    </Link>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                        Bibliothèque des <span className="text-sky-600">Vaccins</span> 📖
                    </h1>
                    <p className="text-slate-500 font-medium max-w-xl">
                        Consultez les informations détaillées sur chaque vaccin du programme national de vaccination du Cameroun.
                    </p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative group max-w-2xl">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-500 transition-colors">
                    <Search size={22} />
                </div>
                <input
                    type="text"
                    placeholder="Rechercher par nom ou maladie (ex: Polio, Tuberculose...)"
                    className="w-full bg-white border-2 border-slate-100 rounded-[2rem] py-6 pl-16 pr-8 text-base font-medium shadow-sm focus:ring-8 focus:ring-sky-500/5 focus:border-sky-500/50 outline-none transition-all placeholder:text-slate-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Chargement de la bibliothèque...</p>
                </div>
            ) : filteredVaccines.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredVaccines.map((v, i) => (
                        <motion.div
                            key={v.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ y: -5 }}
                            className="glass-card p-1 items-stretch flex"
                        >
                            <button
                                onClick={() => handleOpenModal(v)}
                                className="w-full text-left bg-white rounded-[2rem] p-8 space-y-6 flex flex-col justify-between hover:shadow-xl hover:shadow-sky-900/5 transition-all group"
                            >
                                <div className="space-y-6">
                                    <div className="flex items-start justify-between">
                                        <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-all">
                                            <ShieldCheck size={28} />
                                        </div>
                                        <div className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500">
                                            {v.recommendedAge === 0 ? "Nouveau-né" : `${v.recommendedAge} mois`}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-xl font-black text-slate-800 line-clamp-1 group-hover:text-sky-600 transition-colors">{v.name}</h3>
                                        <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                                            Protège contre : <span className="text-slate-700">{v.protection}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                                        <Info size={14} />
                                        {v.importance}
                                    </div>
                                    <div className="p-2 bg-slate-50 rounded-xl text-slate-400 group-hover:translate-x-1 transition-transform">
                                        <ChevronRight size={18} />
                                    </div>
                                </div>
                            </button>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300">
                        <Search size={40} />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-slate-800">Aucun résultat trouvé</h3>
                        <p className="text-slate-500 max-w-xs mx-auto">Nous n'avons trouvé aucun vaccin correspondant à "{searchQuery}". Essayez avec un autre mot-clé.</p>
                    </div>
                </div>
            )}

            <VaccineDetailModal
                vaccine={selectedVaccine}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
