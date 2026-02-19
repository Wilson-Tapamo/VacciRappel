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
    Sparkles
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
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Scanner le Carnet Santé</h1>
                    <p className="text-slate-500 mt-1">Utilisez l'IA pour extraire automatiquement les dates et vaccins.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Scan Interface */}
                <div className="glass-card overflow-hidden flex flex-col min-h-[550px] border-white/60 shadow-2xl shadow-sky-900/5">
                    <div className="p-8 border-b border-white/40 flex items-center justify-between bg-white/20">
                        <h2 className="font-black text-slate-800 flex items-center gap-3 uppercase tracking-widest text-xs">
                            <Camera size={22} className="text-sky-500" />
                            Interface IA Scanner
                        </h2>
                        <div className="flex gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                        </div>
                    </div>

                    <div className="flex-1 bg-slate-950 relative flex items-center justify-center p-10 group">
                        <AnimatePresence mode="wait">
                            {!isScanning && !scanComplete ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.1 }}
                                    className="text-center space-y-8"
                                >
                                    <div className="w-32 h-32 bg-white/5 rounded-[3rem] flex items-center justify-center mx-auto text-white/30 border border-white/10 group-hover:border-sky-500/50 transition-all duration-700">
                                        <Scan size={64} className="group-hover:text-sky-400 group-hover:scale-110 transition-all duration-700" />
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-white font-bold text-xl tracking-tight">Focus intelligent prêt</p>
                                        <p className="text-white/40 text-xs max-w-[240px] mx-auto leading-relaxed font-medium uppercase tracking-widest">Cadrez la page vaccinale du carnet pour analyse.</p>
                                    </div>
                                    <button
                                        onClick={startScan}
                                        className="gradient-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-sky-400/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto"
                                    >
                                        <Scan size={20} />
                                        Analyser Maintenant
                                    </button>
                                </motion.div>
                            ) : isScanning ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-10 bg-sky-950/20 backdrop-blur-[2px]"
                                >
                                    <div className="absolute inset-x-12 top-1/2 h-0.5 bg-sky-400 shadow-[0_0_25px_rgba(56,189,248,1)] animate-[scanLine_2s_ease-in-out_infinite]" />
                                    <div className="flex flex-col items-center justify-center h-full text-white space-y-6">
                                        <div className="relative">
                                            <Loader2 className="animate-spin text-sky-400" size={64} />
                                            <Sparkles className="absolute -top-2 -right-2 text-white animate-pulse" size={24} />
                                        </div>
                                        <div className="text-center">
                                            <p className="font-black tracking-[0.2em] uppercase text-xs">Extraction Neuronale</p>
                                            <p className="text-white/40 text-[10px] mt-2 font-bold italic">Identification des antigènes...</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-center space-y-6"
                                >
                                    <div className="w-24 h-24 bg-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto text-white shadow-2xl shadow-emerald-400/40 border-4 border-white">
                                        <CheckCircle2 size={48} />
                                    </div>
                                    <p className="text-white font-black text-2xl tracking-tight">Analyse Réussie</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Premium Viewfinder corners */}
                        <div className="absolute top-10 left-10 w-16 h-16 border-t-4 border-l-4 border-white/10 rounded-tl-[2rem] group-hover:border-sky-400/50 transition-all duration-700" />
                        <div className="absolute top-10 right-10 w-16 h-16 border-t-4 border-r-4 border-white/10 rounded-tr-[2rem] group-hover:border-sky-400/50 transition-all duration-700" />
                        <div className="absolute bottom-10 left-10 w-16 h-16 border-b-4 border-l-4 border-white/10 rounded-bl-[2rem] group-hover:border-sky-400/50 transition-all duration-700" />
                        <div className="absolute bottom-10 right-10 w-16 h-16 border-b-4 border-r-4 border-white/10 rounded-br-[2rem] group-hover:border-sky-400/50 transition-all duration-700" />
                    </div>

                    <div className="p-8 bg-white/20 border-t border-white/40">
                        <button className="w-full py-4 glass text-slate-600 font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all flex items-center justify-center gap-3">
                            <Upload size={20} />
                            Source externe (PDF / IMAGE)
                        </button>
                    </div>
                </div>

                {/* Results / Instructions */}
                <div className="flex flex-col">
                    <AnimatePresence mode="wait">
                        {showResult ? (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="glass-card p-10 border-white/60 shadow-2xl shadow-sky-900/5 space-y-10 flex-1"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                                        <FileText size={24} />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800">Résultats du Scan</h3>
                                </div>

                                <div className="space-y-6">
                                    <div className="p-6 glass border-white/80 rounded-3xl group hover:shadow-lg transition-all">
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Antigène Détecté</p>
                                        <p className="font-black text-xl text-slate-800">Pentavalent 3</p>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl font-black uppercase tracking-tight shadow-sm">12/02/2026</span>
                                            <span className="text-[10px] bg-sky-50 text-sky-700 px-3 py-1.5 rounded-xl font-black uppercase tracking-tight shadow-sm">Hôpital Central</span>
                                        </div>
                                    </div>
                                    <div className="p-6 glass border-white/80 rounded-3xl opacity-60">
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Antigène Détecté</p>
                                        <p className="font-black text-xl text-slate-800">Rota 2</p>
                                        <div className="mt-4 flex gap-2">
                                            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl font-black uppercase tracking-tight shadow-sm">12/02/2026</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 flex flex-col gap-4">
                                    <button className="w-full py-5 gradient-primary text-white rounded-3xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-sky-200 hover:opacity-90 transition-all">
                                        Valider les données
                                    </button>
                                    <button
                                        onClick={() => {
                                            setScanComplete(false);
                                            setShowResult(false);
                                        }}
                                        className="w-full py-4 glass text-slate-400 hover:text-rose-500 rounded-2xl text-xs font-bold transition-all"
                                    >
                                        Annuler et recommencer
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="glass-card p-10 border-white/60 shadow-2xl shadow-sky-900/5 space-y-10 flex-1"
                            >
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 mb-8 uppercase tracking-widest text-xs border-b border-slate-100 pb-4">Protocole de Scan</h3>
                                    <div className="space-y-6">
                                        {[
                                            "Luminosité optimale requise",
                                            "Support plan et stable",
                                            "Éviter les reflets saturants",
                                            "Alignement parallèle strict"
                                        ].map((tip, i) => (
                                            <div key={i} className="flex items-center gap-5 group">
                                                <div className="w-8 h-8 glass text-sky-500 rounded-xl flex items-center justify-center text-xs font-black shadow-sm group-hover:bg-sky-500 group-hover:text-white transition-all">
                                                    0{i + 1}
                                                </div>
                                                <p className="text-sm text-slate-600 font-bold">{tip}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100 flex gap-5">
                                    <ShieldAlert className="text-amber-600 shrink-0" size={32} />
                                    <div>
                                        <h4 className="text-xs font-black text-amber-800 uppercase tracking-widest">Confidentialité 2026</h4>
                                        <p className="text-[11px] text-amber-700/80 mt-2 font-medium leading-relaxed">Traitement neuronal local. Vos données biométriques restent privées et chiffrées de bout en bout.</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <style jsx global>{`
        @keyframes scanLine {
          0%, 100% { top: 10%; }
          50% { top: 90%; }
        }
      `}</style>
        </div>
    );
}
