"use client";

import { useState, useEffect } from "react";
import {
    Search, ShieldCheck, Calendar, ChevronRight, Info,
    Loader2, Filter, Syringe, BookOpen, Sparkles, ArrowUpRight,
    CheckCircle, Clock, AlertCircle, X, Heart, Baby, Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import VaccineDetailModal from "@/components/vaccines/VaccineDetailModal";

const categories = [
    { id: "all", label: "Tous", color: "bg-slate-100 text-slate-700", activeColor: "bg-slate-800 text-white" },
    { id: "Obligatoire", label: "Obligatoire", color: "bg-red-50 text-rose-700", activeColor: "bg-rose-500 text-white" },
    { id: "Recommandé", label: "Recommandé", color: "bg-sky-50 text-sky-700", activeColor: "bg-sky-500 text-white" },
    { id: "Optionnel", label: "Optionnel", color: "bg-teal-50 text-teal-700", activeColor: "bg-teal-500 text-white" },
];

const vaccineColors = [
    { gradient: "from-sky-400 to-cyan-500", bg: "bg-sky-50", text: "text-sky-600", badge: "bg-sky-100 text-sky-700" },
    { gradient: "from-violet-400 to-purple-500", bg: "bg-violet-50", text: "text-violet-600", badge: "bg-violet-100 text-violet-700" },
    { gradient: "from-teal-400 to-emerald-500", bg: "bg-teal-50", text: "text-teal-600", badge: "bg-teal-100 text-teal-700" },
    { gradient: "from-rose-400 to-pink-500", bg: "bg-rose-50", text: "text-rose-600", badge: "bg-rose-100 text-rose-700" },
    { gradient: "from-amber-400 to-orange-500", bg: "bg-amber-50", text: "text-amber-600", badge: "bg-amber-100 text-amber-700" },
    { gradient: "from-indigo-400 to-blue-500", bg: "bg-indigo-50", text: "text-indigo-600", badge: "bg-indigo-100 text-indigo-700" },
];

export default function VaccineLibraryPage() {
    const [vaccines, setVaccines] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedVaccine, setSelectedVaccine] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetch("/api/vaccines")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setVaccines(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filtered = vaccines.filter(v => {
        const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.protection?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "all" || v.importance === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-8 pb-20 max-w-7xl mx-auto">
            {/* Hero Header with Illustrations */}
            <div className="relative rounded-[2.5rem] overflow-hidden p-8 md:p-12 gradient-hero border border-white/80 shadow-xl">
                {/* Background blobs */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-violet-200/30 rounded-full -mr-24 -mt-24 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-sky-200/30 rounded-full -mb-20 blur-3xl pointer-events-none" />
                <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-teal-100/40 rounded-full blur-2xl pointer-events-none" />

                {/* Floating decorations */}
                <div className="absolute top-6 right-8 w-20 h-20 bg-white/70 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-xl animate-float hidden md:flex">
                    <Syringe className="text-violet-500" size={32} />
                </div>
                <div className="absolute top-20 right-32 w-12 h-12 bg-sky-100/90 rounded-2xl flex items-center justify-center animate-float-reverse hidden md:flex" style={{ animationDelay: '1.5s' }}>
                    <ShieldCheck className="text-sky-500" size={20} />
                </div>
                <div className="absolute bottom-8 right-16 w-14 h-14 bg-teal-100/90 rounded-2xl flex items-center justify-center animate-float hidden md:flex" style={{ animationDelay: '3s' }}>
                    <Heart className="text-rose-400" size={22} />
                </div>
                <div className="absolute bottom-12 right-48 w-10 h-10 bg-amber-100/90 rounded-2xl flex items-center justify-center animate-float-reverse hidden md:flex" style={{ animationDelay: '0.5s' }}>
                    <Baby className="text-amber-500" size={18} />
                </div>

                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full shadow-sm mb-6 border border-white/80">
                        <BookOpen className="text-violet-500" size={16} />
                        <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Bibliothèque Vaccinale</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                        Tous les <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-sky-500">Vaccins</span> en un clin d'œil
                    </h1>
                    <p className="text-slate-500 font-medium text-lg leading-relaxed">
                        Informations détaillées sur chaque vaccin du programme national de vaccination du Cameroun.
                    </p>
                </div>

                {/* Stats */}
                <div className="relative z-10 mt-8 flex flex-wrap gap-4">
                    {[
                        { label: "Vaccins référencés", value: `${vaccines.length || 18}`, icon: Syringe, color: "text-violet-600", bg: "bg-white/70" },
                        { label: "Maladies couvertes", value: "14+", icon: ShieldCheck, color: "text-sky-600", bg: "bg-white/70" },
                        { label: "Mis à jour", value: "2026", icon: Activity, color: "text-teal-600", bg: "bg-white/70" },
                    ].map(stat => (
                        <div key={stat.label} className={`${stat.bg} backdrop-blur-sm rounded-2xl px-5 py-3 flex items-center gap-3 shadow-sm border border-white/80`}>
                            <stat.icon className={stat.color} size={18} />
                            <div>
                                <p className="text-xl font-black text-slate-800">{stat.value}</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Search + Filter Row */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="relative flex-1 max-w-xl group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Rechercher par nom ou maladie protégée..."
                        className="w-full bg-white border-2 border-slate-100 rounded-[1.75rem] py-5 pl-14 pr-6 text-sm font-medium shadow-sm focus:ring-8 focus:ring-violet-500/10 focus:border-violet-400 outline-none transition-all placeholder:text-slate-400"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery("")} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            <X size={18} />
                        </button>
                    )}
                </div>

                {/* Category Filters */}
                <div className="flex gap-2 flex-wrap">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${selectedCategory === cat.id ? cat.activeColor + ' shadow-lg' : cat.color + ' hover:scale-105'}`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results count */}
            {!loading && (
                <p className="text-xs text-slate-400 font-black uppercase tracking-widest">
                    {filtered.length} vaccin{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
                </p>
            )}

            {/* Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-5">
                    <div className="w-20 h-20 bg-gradient-to-br from-violet-400 to-sky-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-violet-200 animate-pulse">
                        <Syringe className="text-white" size={36} />
                    </div>
                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Chargement de la bibliothèque...</p>
                </div>
            ) : filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((v, i) => {
                        const vc = vaccineColors[i % vaccineColors.length];
                        return (
                            <motion.div
                                key={v.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                                whileHover={{ y: -6 }}
                                className="cursor-pointer group"
                                onClick={() => { setSelectedVaccine(v); setIsModalOpen(true); }}
                            >
                                <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-sky-900/8 transition-all duration-300 border border-slate-50 flex flex-col h-full">
                                    {/* Colorful top strip */}
                                    <div className={`h-2 bg-gradient-to-r ${vc.gradient}`} />

                                    <div className="p-7 flex flex-col flex-1">
                                        <div className="flex items-start justify-between mb-5">
                                            <div className={`w-14 h-14 bg-gradient-to-br ${vc.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                                <ShieldCheck size={26} />
                                            </div>
                                            <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${vc.badge}`}>
                                                {v.recommendedAge === 0 ? "Naissance" : `${v.recommendedAge} mois`}
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-3 mb-5">
                                            <h3 className="text-lg font-black text-slate-800 line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-sky-600 group-hover:to-violet-600 transition-all">
                                                {v.name}
                                            </h3>
                                            <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                                                Protège contre : <span className="text-slate-700 font-semibold">{v.protection}</span>
                                            </p>
                                        </div>

                                        {/* Mini stats */}
                                        <div className="flex items-center gap-3 mb-5">
                                            <div className={`flex items-center gap-1.5 px-3 py-1.5 ${vc.bg} rounded-xl`}>
                                                <Clock size={12} className={vc.text} />
                                                <span className={`text-[10px] font-black ${vc.text} uppercase tracking-wider`}>
                                                    {v.doses || '1'} dose{(v.doses || 1) > 1 ? 's' : ''}
                                                </span>
                                            </div>
                                            {v.importance && (
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-xl">
                                                    {v.importance === 'Obligatoire' ? (
                                                        <AlertCircle size={12} className="text-rose-500" />
                                                    ) : (
                                                        <CheckCircle size={12} className="text-emerald-500" />
                                                    )}
                                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider">{v.importance}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-5 border-t border-slate-50 flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600">
                                                <Info size={13} /> {v.importance || "Recommandé"}
                                            </div>
                                            <div className={`p-2.5 bg-gradient-to-br ${vc.gradient} rounded-xl text-white shadow-lg opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-300`}>
                                                <ArrowUpRight size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center">
                        <Search className="text-slate-300" size={44} />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-slate-800">Aucun résultat</h3>
                        <p className="text-slate-500 max-w-xs mx-auto text-sm">
                            Aucun vaccin trouvé pour "{searchQuery}". Essayez avec un autre terme.
                        </p>
                    </div>
                    <button
                        onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                        className="px-6 py-3 bg-gradient-to-r from-violet-500 to-sky-500 text-white rounded-2xl font-black text-sm shadow-xl hover:scale-105 transition-transform"
                    >
                        Réinitialiser la recherche
                    </button>
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
