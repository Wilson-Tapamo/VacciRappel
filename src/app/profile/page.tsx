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
    Activity,
    ScanLine,
    Stethoscope,
    X,
    Save
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import ChildVaccinationModal from "@/components/dashboard/ChildVaccinationModal";


function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function ProfilePage() {
    const [children, setChildren] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editData, setEditData] = useState({
        name: "",
        image: "",
        medicalInfo: "",
        birthDate: "",
        bloodGroup: "",
        allergies: "",
        conditions: ""
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isGrowthModalOpen, setIsGrowthModalOpen] = useState(false);
    const [growthData, setGrowthData] = useState({
        weight: "",
        height: "",
        date: new Date().toISOString().split('T')[0]
    });

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

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && activeProfile) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64 = reader.result as string;
                try {
                    const res = await fetch(`/api/children/${activeProfile.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ image: base64 }),
                    });
                    if (res.ok) fetchChildren();
                } catch (error) {
                    console.error("Failed to update image", error);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateChild = async () => {
        if (!activeProfile) return;
        setIsSaving(true);
        try {
            const res = await fetch(`/api/children/${activeProfile.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editData),
            });
            if (res.ok) {
                fetchChildren();
                setIsEditModalOpen(false);
            }
        } catch (error) {
            console.error("Failed to update child", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddGrowth = async () => {
        if (!activeProfile) return;
        setIsSaving(true);
        try {
            const res = await fetch(`/api/children/${activeProfile.id}/growth`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(growthData),
            });
            if (res.ok) {
                fetchChildren();
                setIsGrowthModalOpen(false);
                setGrowthData({
                    weight: "",
                    height: "",
                    date: new Date().toISOString().split('T')[0]
                });
            }
        } catch (error) {
            console.error("Failed to add growth record", error);
        } finally {
            setIsSaving(false);
        }
    };

    const openEditModal = () => {
        if (!activeProfile) return;
        setEditData({
            name: activeProfile.name,
            image: activeProfile.image || "",
            medicalInfo: activeProfile.medicalInfo || "",
            birthDate: new Date(activeProfile.birthDate).toISOString().split('T')[0],
            bloodGroup: activeProfile.bloodGroup || "",
            allergies: activeProfile.allergies || "",
            conditions: activeProfile.conditions || ""
        });
        setIsEditModalOpen(true);
    };

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
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[10%] -left-[5%] w-[40%] h-[40%] bg-sky-100/40 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[10%] -right-[5%] w-[35%] h-[35%] bg-violet-100/30 rounded-full blur-[100px]" />
            </div>

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

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeProfile.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-10"
                >
                    <div className="lg:col-span-4 space-y-8">
                        <div className="glass-card p-10 text-center relative overflow-hidden group border-white/80 bg-white/40 backdrop-blur-xl shadow-2xl shadow-sky-900/5">
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
                                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                                </label>
                            </div>

                            <div className="space-y-1">
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">{activeProfile.name}</h2>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest pt-2">
                                    Né le {new Date(activeProfile.birthDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                            <div className="grid grid-cols-3 gap-3 mt-10 p-5 bg-slate-50/50 rounded-3xl border border-white">
                                <div className="space-y-1 text-center">
                                    <div className="w-10 h-10 bg-sky-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-sky-200">
                                        <Weight size={18} />
                                    </div>
                                    <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mt-2">Poids Actuel</p>
                                    <p className="text-sm font-black text-slate-900">
                                        {activeProfile.growthRecords?.length > 0 
                                            ? `${activeProfile.growthRecords[activeProfile.growthRecords.length-1].weight} kg` 
                                            : "--"
                                        }
                                    </p>
                                </div>
                                <div className="space-y-1 text-center border-x border-slate-200/50">
                                    <div className="w-10 h-10 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-200">
                                        <Ruler size={18} />
                                    </div>
                                    <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mt-2">Taille Actuelle</p>
                                    <p className="text-sm font-black text-slate-900">
                                        {activeProfile.growthRecords?.length > 0 
                                            ? `${activeProfile.growthRecords[activeProfile.growthRecords.length-1].height} cm` 
                                            : "--"
                                        }
                                    </p>
                                </div>
                                <div className="space-y-1 text-center">
                                    <div className="w-10 h-10 bg-rose-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-rose-200">
                                        <Activity size={18} />
                                    </div>
                                    <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mt-2">Groupe Sanguin</p>
                                    <p className="text-sm font-black text-slate-900">{activeProfile.bloodGroup || "--"}</p>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={openEditModal}
                            className="w-full py-6 px-8 rounded-[2.5rem] bg-white border border-slate-200 text-slate-700 font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 shadow-xl shadow-slate-200/50 hover:bg-slate-50 hover:-translate-y-1 active:translate-y-0 transition-all group"
                        >
                            <Edit2 size={18} className="text-sky-500" />
                            Modifier les informations
                        </button>

                        <Link href="/scan" className="w-full py-6 px-8 rounded-[2.5rem] bg-gradient-to-r from-sky-500 to-blue-600 text-white font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 shadow-xl shadow-sky-500/30 hover:shadow-sky-500/50 hover:-translate-y-1 active:translate-y-0 transition-all group">
                            <ScanLine size={18} className="animate-pulse" />
                            Scanner le carnet de santé
                        </Link>
                    </div>

                    <div className="lg:col-span-8 space-y-10">
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
                                    <p className="text-slate-500 text-sm font-medium">
                                        {activeProfile.vaccinations?.find((v: any) => v.status === 'PENDING')
                                            ? `Prévu à ${activeProfile.vaccinations.find((v: any) => v.status === 'PENDING').vaccine.recommendedAge} mois`
                                            : "Aucun vaccin prévu"
                                        }
                                    </p>
                                </div>
                                <div className="mt-8">
                                    <button onClick={() => setIsCalendarOpen(true)} className="w-full py-3 bg-sky-50 text-sky-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-sky-500 hover:text-white transition-all">
                                        Voir les détails
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="glass-card p-10 border-white/80 bg-white/40 backdrop-blur-xl shadow-2xl shadow-sky-900/5 relative overflow-hidden group col-span-1 md:col-span-2">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <Stethoscope size={100} />
                                </div>
                                <div className="space-y-8 relative z-10">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                            <Stethoscope className="text-rose-500" size={32} />
                                            Dossier Médical
                                        </h3>
                                        <button 
                                            onClick={openEditModal}
                                            className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-sky-500 transition-colors"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-white/60 rounded-3xl p-6 border border-white/80 shadow-sm">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Allergies</p>
                                            <p className={cn("text-sm font-bold", activeProfile.allergies ? "text-rose-600" : "text-slate-400")}>
                                                {activeProfile.allergies || "Aucune allergie connue"}
                                            </p>
                                        </div>
                                        <div className="bg-white/60 rounded-3xl p-6 border border-white/80 shadow-sm">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Conditions</p>
                                            <p className={cn("text-sm font-bold", activeProfile.conditions ? "text-amber-600" : "text-slate-400")}>
                                                {activeProfile.conditions || "Aucune condition chronique"}
                                            </p>
                                        </div>
                                        <div className="bg-white/60 rounded-3xl p-6 border border-white/80 shadow-sm">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Notes spéciales</p>
                                            <p className="text-sm font-medium text-slate-600 line-clamp-3">
                                                {activeProfile.medicalInfo || "Pas de notes supplémentaires"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-10 border-white/80 bg-white/40 backdrop-blur-xl shadow-2xl shadow-sky-900/5 relative overflow-hidden group">
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 via-violet-500 to-amber-500" />
                            
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                        <Activity className="text-violet-500" size={32} />
                                        Suivi de Croissance
                                    </h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-10">Évolution de la taille (cm) et du poids (kg)</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                                        <Ruler size={16} className="text-sky-500" />
                                        <span className="text-sm font-black text-slate-700">Taille</span>
                                    </div>
                                    <button 
                                        onClick={() => setIsGrowthModalOpen(true)}
                                        className="p-3 bg-sky-50 text-sky-500 rounded-xl hover:bg-sky-500 hover:text-white transition-all shadow-sm active:scale-95"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>

                            {activeProfile.growthRecords && activeProfile.growthRecords.length > 0 ? (
                                <div className="h-64 flex items-end justify-between gap-6 px-4 relative mt-10">
                                    {activeProfile.growthRecords.slice(-6).map((record: any, i: number) => {
                                        const h = record.height || 0;
                                        // Simple normalization for height (assuming 100cm is max for display)
                                        const heightPercent = Math.min((h / 100) * 100, 100);
                                        return (
                                            <div key={record.id} className="flex-1 flex flex-col items-center gap-4 group/bar">
                                                <div className="relative w-full flex items-end justify-center h-full">
                                                    <motion.div
                                                        initial={{ height: 0 }}
                                                        animate={{ height: `${heightPercent}%` }}
                                                        transition={{ duration: 1.5, delay: i * 0.1, ease: "circOut" }}
                                                        className="w-full max-w-[45px] bg-gradient-to-b from-sky-400 to-sky-600 rounded-2xl shadow-lg relative cursor-help group-hover/bar:from-sky-500 group-hover/bar:to-sky-700"
                                                    >
                                                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all duration-300 scale-90 group-hover/bar:scale-100 pointer-events-none">
                                                            <div className="bg-slate-900 text-white text-[11px] px-3 py-2 rounded-2xl font-black shadow-2xl flex flex-col items-center gap-1 min-w-max">
                                                                <span>{record.height} cm 📏</span>
                                                                <span>{record.weight} kg ⚖️</span>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                </div>
                                                <span className="text-[9px] font-black text-slate-400 uppercase">
                                                    {new Date(record.date).toLocaleDateString('fr-FR', { month: 'short' })}
                                                </span>
                                            </div>
                                        );
                                    })}
                                    {[0, 33, 66, 100].map(line => (
                                        <div key={line} className="absolute inset-x-0 border-t border-slate-100 pointer-events-none" style={{ bottom: `${line}%` }} />
                                    ))}
                                </div>
                            ) : (
                                <div className="h-64 flex flex-col items-center justify-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 mt-10">
                                    <Activity className="text-slate-300 mb-4" size={48} />
                                    <p className="text-slate-400 font-bold text-sm">Aucune donnée de croissance enregistrée.</p>
                                    <button 
                                        onClick={() => setIsGrowthModalOpen(true)}
                                        className="mt-4 text-sky-500 font-black uppercase tracking-widest text-[10px] hover:underline"
                                    >
                                        Ajouter la première mesure
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-50 shrink-0">
                                <h2 className="text-xl md:text-2xl font-black text-slate-900">Modifier le profil</h2>
                                <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                    <X size={24} className="text-slate-400" />
                                </button>
                            </div>

                            <div className="p-6 md:p-8 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Nom de l'enfant</label>
                                        <input
                                            type="text"
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-sky-500 rounded-2xl outline-none transition-all font-bold text-slate-700"
                                            value={editData.name}
                                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Naissance</label>
                                            <input
                                                type="date"
                                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-sky-500 rounded-2xl outline-none transition-all font-bold text-slate-700"
                                                value={editData.birthDate}
                                                onChange={(e) => setEditData({ ...editData, birthDate: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Groupe Sanguin</label>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                                {[
                                                    { id: "A+", info: "A+, AB+" },
                                                    { id: "A-", info: "A±, AB±" },
                                                    { id: "B+", info: "B+, AB+" },
                                                    { id: "B-", info: "B±, AB±" },
                                                    { id: "AB+", info: "Rec. Univ." },
                                                    { id: "AB-", info: "AB±" },
                                                    { id: "O+", info: "RH+" },
                                                    { id: "O-", info: "Univ. 🌟" }
                                                ].map(g => (
                                                    <button 
                                                        key={g.id}
                                                        onClick={() => setEditData({ ...editData, bloodGroup: g.id })}
                                                        className={cn(
                                                            "p-3 rounded-2xl border-2 transition-all text-center flex flex-col gap-0.5",
                                                            editData.bloodGroup === g.id 
                                                                ? "border-sky-500 bg-sky-50 text-sky-600 shadow-md shadow-sky-100" 
                                                                : "border-slate-50 bg-slate-50/50 text-slate-400 hover:border-slate-200"
                                                        )}
                                                    >
                                                        <span className="text-sm font-black">{g.id}</span>
                                                        <span className="text-[7px] font-bold uppercase tracking-tight opacity-70">{g.info}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Allergies</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: Pénicilline..."
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-sky-500 rounded-2xl outline-none transition-all font-bold text-slate-700"
                                            value={editData.allergies}
                                            onChange={(e) => setEditData({ ...editData, allergies: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Conditions Chroniques</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: Asthme..."
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-sky-500 rounded-2xl outline-none transition-all font-bold text-slate-700"
                                            value={editData.conditions}
                                            onChange={(e) => setEditData({ ...editData, conditions: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Notes Spéciales</label>
                                        <textarea
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-sky-500 rounded-2xl outline-none transition-all font-medium text-slate-700 min-h-[100px] resize-none"
                                            value={editData.medicalInfo}
                                            onChange={(e) => setEditData({ ...editData, medicalInfo: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 md:p-8 flex gap-4 border-t border-slate-50 shrink-0">
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleUpdateChild}
                                    disabled={isSaving}
                                    className="flex-1 py-4 gradient-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-sky-200 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
                                >
                                    {isSaving ? "Enregistrement..." : (
                                        <>
                                            <Save size={18} />
                                            Enregistrer
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isGrowthModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsGrowthModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-50 shrink-0">
                                <h2 className="text-xl md:text-2xl font-black text-slate-900">Nouvelle Mesure</h2>
                                <button onClick={() => setIsGrowthModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                    <X size={24} className="text-slate-400" />
                                </button>
                            </div>

                            <div className="p-6 md:p-8 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Poids (kg)</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-sky-500 rounded-2xl outline-none transition-all font-bold text-slate-700"
                                                value={growthData.weight}
                                                onChange={(e) => setGrowthData({ ...growthData, weight: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Taille (cm)</label>
                                            <input
                                                type="number"
                                                step="0.5"
                                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-sky-500 rounded-2xl outline-none transition-all font-bold text-slate-700"
                                                value={growthData.height}
                                                onChange={(e) => setGrowthData({ ...growthData, height: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Date de la mesure</label>
                                        <input
                                            type="date"
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-sky-500 rounded-2xl outline-none transition-all font-bold text-slate-700"
                                            value={growthData.date}
                                            onChange={(e) => setGrowthData({ ...growthData, date: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 md:p-8 border-t border-slate-50 shrink-0">
                                <button
                                    onClick={handleAddGrowth}
                                    disabled={isSaving || !growthData.weight || !growthData.height}
                                    className="w-full py-5 gradient-primary text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-sky-200 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {isSaving ? "Enregistrement..." : "Ajouter la mesure"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

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
