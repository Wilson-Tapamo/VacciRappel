"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Scan,
    Upload,
    Camera,
    X,
    CheckCircle2,
    Loader2,
    FileText,
    ShieldAlert,
    Sparkles,
    Calendar,
} from "lucide-react";

export default function ScanPage() {
    const [isScanning, setIsScanning] = useState(false);
    const [scanComplete, setScanComplete] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const startScan = () => {
        setIsScanning(true);
        setTimeout(() => {
            setIsScanning(false);
            setScanComplete(true);
            setTimeout(() => {
                setShowResult(true);
            }, 500);
        }, 3000);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20 relative">
            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[10%] -left-[5%] w-[40%] h-[40%] bg-sky-100/20 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[10%] -right-[5%] w-[35%] h-[35%] bg-indigo-100/20 rounded-full blur-[120px]" />
            </div>

            {/* Header Section */}
            <div className="relative p-10 md:p-14 glass-card bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-800 border-none shadow-2xl overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl -mr-48 -mt-48 group-hover:bg-sky-500/20 transition-all duration-1000" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full backdrop-blur-md border border-white/10">
                            <Sparkles className="text-amber-400" size={14} />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Technologie IA 2026</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none">
                            Scanner IA de Carnet
                        </h1>
                        <p className="text-slate-400 font-medium text-lg max-w-xl">
                            Notre algorithme neuronal extrait instantanément les vaccins et dates depuis vos documents physiques.
                        </p>
                    </div>
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm hidden md:block">
                        <div className="flex items-center gap-4 text-white">
                            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 flex items-center justify-center">
                                <ShieldAlert size={24} className="text-sky-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-sky-400">Sécurisé</p>
                                <p className="text-sm font-bold">Chiffrement de bout en bout</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Scan Interface (LHS) */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="glass-card overflow-hidden flex flex-col min-h-[600px] border-white/80 shadow-2xl shadow-sky-900/5 relative">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white/40 sticky top-0 z-20 backdrop-blur-md">
                            <h2 className="font-black text-slate-800 flex items-center gap-3 uppercase tracking-widest text-[10px]">
                                <Camera size={18} className="text-sky-500" />
                                Viseur IA Actif
                            </h2>
                            <div className="flex gap-2">
                                <div className="px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                                    Full HD
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 bg-slate-950 relative flex items-center justify-center p-12 group overflow-hidden">
                            {/* Camera Grid Overlay */}
                            <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 pointer-events-none opacity-10">
                                {Array.from({ length: 36 }).map((_, i) => (
                                    <div key={i} className="border-[0.5px] border-white/20" />
                                ))}
                            </div>

                            <AnimatePresence mode="wait">
                                {!isScanning && !scanComplete ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.1 }}
                                        className="text-center space-y-10 relative z-10"
                                    >
                                        <div className="relative mx-auto">
                                            <div className="w-40 h-40 bg-white/5 rounded-[4rem] flex items-center justify-center text-white/20 border border-white/10 group-hover:border-sky-500/50 transition-all duration-700 relative">
                                                <Scan size={80} className="group-hover:text-sky-400 group-hover:scale-110 transition-all duration-700" />
                                            </div>
                                            <div className="absolute -top-4 -right-4 w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center text-white animate-bounce-subtle shadow-xl">
                                                <Sparkles size={20} />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <p className="text-white font-black text-2xl tracking-tight">Prêt pour l'analyse</p>
                                            <p className="text-white/40 text-[10px] max-w-[300px] mx-auto leading-relaxed font-black uppercase tracking-[0.2em]">
                                                Placez le carnet dans le cadre. <br/>L'IA détectera les bords automatiquement.
                                            </p>
                                        </div>
                                        <button
                                            onClick={startScan}
                                            className="gradient-primary text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-sky-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-4 mx-auto"
                                        >
                                            <Scan size={22} strokeWidth={2.5} />
                                            Lancer le Scan IA
                                        </button>
                                    </motion.div>
                                ) : isScanning ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 z-10 bg-sky-950/30 backdrop-blur-[4px]"
                                    >
                                        <div className="absolute inset-x-12 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_30px_rgba(56,189,248,1)] animate-[scanLine_2s_ease-in-out_infinite]" />
                                        <div className="flex flex-col items-center justify-center h-full text-white space-y-8">
                                            <div className="relative">
                                                <Loader2 className="animate-spin text-sky-400" size={80} strokeWidth={1.5} />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-4 h-4 bg-white rounded-full animate-ping" />
                                                </div>
                                            </div>
                                            <div className="text-center space-y-3">
                                                <p className="font-black tracking-[0.4em] uppercase text-xs text-sky-400">Analyse Génomique</p>
                                                <div className="flex gap-1 justify-center">
                                                    {[0, 1, 2].map(i => (
                                                        <div key={i} className="w-10 h-1 bg-white/20 rounded-full overflow-hidden">
                                                            <div className="h-full bg-sky-400 animate-shimmer" style={{ animationDelay: `${i * 0.5}s` }} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="text-center space-y-8 relative z-10"
                                    >
                                        <div className="w-32 h-32 bg-emerald-500 rounded-[3rem] flex items-center justify-center mx-auto text-white shadow-2xl shadow-emerald-400/50 border-8 border-white animate-float">
                                            <CheckCircle2 size={64} strokeWidth={2.5} />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-white font-black text-3xl tracking-tight leading-none text-glow-emerald">Données Extraites</p>
                                            <p className="text-emerald-400/80 text-[10px] font-black uppercase tracking-widest">Indexation terminée</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Corner Frame */}
                            <div className="absolute top-12 left-12 w-20 h-20 border-t-4 border-l-4 border-white/20 rounded-tl-[3rem] group-hover:border-sky-400/60 transition-all duration-700" />
                            <div className="absolute top-12 right-12 w-20 h-20 border-t-4 border-r-4 border-white/20 rounded-tr-[3rem] group-hover:border-sky-400/60 transition-all duration-700" />
                            <div className="absolute bottom-12 left-12 w-20 h-20 border-b-4 border-l-4 border-white/20 rounded-bl-[3rem] group-hover:border-sky-400/60 transition-all duration-700" />
                            <div className="absolute bottom-12 right-12 w-20 h-20 border-b-4 border-r-4 border-white/20 rounded-br-[3rem] group-hover:border-sky-400/60 transition-all duration-700" />
                        </div>

                        <div className="p-8 bg-white/40 border-t border-slate-100 backdrop-blur-md">
                            <button className="w-full py-5 rounded-2xl bg-white border border-slate-100 text-slate-500 font-black uppercase tracking-widest text-[10px] hover:text-sky-600 hover:border-sky-100 hover:shadow-xl transition-all flex items-center justify-center gap-4 group/upload">
                                <Upload size={22} className="group-hover/upload:-translate-y-1 transition-transform" />
                                Importer un document (PDF / JPG)
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column (Results/Instructions) */}
                <div className="lg:col-span-5 space-y-8">
                    <AnimatePresence mode="wait">
                        {showResult ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-card p-10 border-white/80 shadow-2xl shadow-sky-900/5 space-y-10 min-h-[600px] flex flex-col bg-white/60 backdrop-blur-xl"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                                                <FileText size={24} />
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Résultats Scan</h3>
                                        </div>
                                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase">98% Confiance</span>
                                    </div>
                                    <p className="text-slate-500 font-medium text-sm">Veuillez vérifier les informations extraites par l'IA avant validation.</p>
                                </div>

                                <div className="space-y-6 flex-1">
                                    {[
                                        { name: "Pentavalent 3", date: "12/02/2026", loc: "Hôpital Central", color: "sky" },
                                        { name: "Rota 2", date: "12/02/2026", loc: "Centre de Santé", color: "indigo" },
                                        { name: "VPO 3", date: "12/02/2026", loc: "Hôpital Central", color: "violet" }
                                    ].map((item, i) => (
                                        <div key={i} className="p-6 glass-card bg-white/80 border-slate-100 rounded-3xl group hover:scale-[1.02] transition-all hover:shadow-xl">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-10 rounded-full bg-${item.color}-500`} />
                                                    <div>
                                                        <h4 className="font-black text-slate-800 text-lg leading-none">{item.name}</h4>
                                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Antigène Validé</p>
                                                    </div>
                                                </div>
                                                <button className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                                                    <X size={18} />
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl text-slate-600 border border-slate-100">
                                                    <Calendar size={14} className="text-sky-500" />
                                                    <span className="text-[10px] font-black">{item.date}</span>
                                                </div>
                                                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl text-slate-600 border border-slate-100">
                                                    <ShieldAlert size={14} className="text-amber-500" />
                                                    <span className="text-[10px] font-black uppercase tracking-tight">{item.loc}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-8 border-t border-slate-100 space-y-4">
                                    <button className="w-full py-5 gradient-primary text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-sky-400/30 hover:shadow-sky-400/50 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                                        <CheckCircle2 size={20} />
                                        Inscrire au calendrier
                                    </button>
                                    <button
                                        onClick={() => {
                                            setScanComplete(false);
                                            setShowResult(false);
                                        }}
                                        className="w-full py-4 text-slate-400 hover:text-rose-500 font-black uppercase tracking-widest text-[10px] transition-all"
                                    >
                                        Recommencer l'analyse
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="glass-card p-10 border-white/80 shadow-2xl shadow-sky-900/5 space-y-12 flex-1 bg-white/40 backdrop-blur-xl"
                            >
                                <div className="space-y-4">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Conseils Experts</h3>
                                    <h4 className="text-3xl font-black text-slate-800 tracking-tight">Comment scanner ?</h4>
                                </div>
                                
                                <div className="space-y-8">
                                    {[
                                        { title: "Lumière Naturelle", desc: "Évitez les ombres portées et les reflets de flash pour une lecture précise.", icon: Sparkles, color: "amber" },
                                        { title: "Angle Parfait", desc: "Tenez votre téléphone parallèlement au carnet de santé.", icon: Scan, color: "sky" },
                                        { title: "Mise au Point", desc: "Attendez que le cadre IA devienne bleu pour capturer.", icon: Camera, color: "indigo" }
                                    ].map((tip, i) => (
                                        <div key={i} className="flex gap-6 group">
                                            <div className={`w-14 h-14 bg-${tip.color}-50 text-${tip.color}-500 rounded-2xl flex items-center justify-center shrink-0 shadow-xl group-hover:scale-110 transition-transform`}>
                                                <tip.icon size={28} />
                                            </div>
                                            <div className="space-y-1">
                                                <h5 className="font-black text-slate-800">{tip.title}</h5>
                                                <p className="text-sm text-slate-500 font-medium leading-relaxed">{tip.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] text-white space-y-4 relative overflow-hidden shadow-2xl">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/20 rounded-full blur-2xl -mr-16 -mt-16" />
                                    <div className="flex items-center gap-3 relative z-10">
                                        <ShieldAlert size={20} className="text-sky-400" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-sky-400">Privacy First</span>
                                    </div>
                                    <p className="text-slate-300 text-sm leading-relaxed relative z-10">
                                        Vos données sont traitées localement sur votre appareil. Rien n'est envoyé sur nos serveurs sans votre consentement explicite.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <style jsx global>{`
                @keyframes scanLine {
                    0%, 100% { top: 15%; }
                    50% { top: 85%; }
                }
                .text-glow-emerald {
                    text-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
                }
            `}</style>
        </div>
    );
}
