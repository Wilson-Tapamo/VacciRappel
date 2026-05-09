"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    Baby,
    Calendar,
    Camera,
    ChevronRight,
    ChevronLeft,
    Check,
    Stethoscope,
    FileText,
    X,
    Plus
} from "lucide-react";
import Link from "next/link";

const steps = [
    { id: "identity", title: "Identité", icon: Baby },
    { id: "photo", title: "Photo", icon: Camera },
    { id: "medical", title: "Santé", icon: Stethoscope },
    { id: "success", title: "Terminé", icon: Check },
];

export default function AddChildPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        birthDate: "",
        gender: "M",
        image: "",
        bloodGroup: "",
        allergies: "",
        conditions: "",
        medicalInfo: "",
        medicalBookletScan: ""
    });

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

    const handleFinish = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/children", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                nextStep(); // Move to success step
                setTimeout(() => {
                    router.push("/");
                    router.refresh();
                }, 3000);
            }
        } catch (error) {
            console.error("Failed to add child", error);
        } finally {
            setLoading(false);
        }
    };

    const stepVariants = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
    };

    return (
        <div className="max-w-xl mx-auto py-10 px-4 min-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
                <Link href="/" className="p-3 glass rounded-2xl text-slate-400 hover:text-slate-600 transition-all">
                    <X size={20} />
                </Link>
                <div className="flex gap-2">
                    {steps.map((step, idx) => (
                        <div
                            key={step.id}
                            className={`h-1.5 rounded-full transition-all duration-500 ${idx <= currentStep ? "w-8 bg-sky-500 shadow-lg shadow-sky-200" : "w-4 bg-slate-100"
                                }`}
                        />
                    ))}
                </div>
                <div className="w-10" /> {/* Spacer */}
            </div>

            <div className="flex-1 relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        variants={stepVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="space-y-8"
                    >
                        {currentStep === 0 && (
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">C'est un petit bout de chou ? 👶</h1>
                                    <p className="text-slate-500 font-medium">Commençons par les présentations.</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Le nom de l'enfant</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-5 flex items-center text-slate-400 group-focus-within:text-sky-500 transition-colors">
                                                <Baby size={20} />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Ex: Lucas Kamga"
                                                className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-50 rounded-[2rem] focus:border-sky-500 outline-none transition-all shadow-sm focus:shadow-xl focus:shadow-sky-100 font-bold text-slate-700"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Date de naissance</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-5 flex items-center text-slate-400 group-focus-within:text-sky-500 transition-colors">
                                                <Calendar size={20} />
                                            </div>
                                            <input
                                                type="date"
                                                className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-50 rounded-[2rem] focus:border-sky-500 outline-none transition-all shadow-sm focus:shadow-xl focus:shadow-sky-100 font-bold text-slate-700"
                                                value={formData.birthDate}
                                                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">C'est...</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                onClick={() => setFormData({ ...formData, gender: "M" })}
                                                className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 ${formData.gender === "M" ? "border-sky-500 bg-sky-50 text-sky-600 scale-105 shadow-xl shadow-sky-100" : "border-slate-50 bg-white text-slate-400"
                                                    }`}
                                            >
                                                <span className="text-2xl">👦</span>
                                                <span className="font-black text-[10px] uppercase tracking-widest">Un Garçon</span>
                                            </button>
                                            <button
                                                onClick={() => setFormData({ ...formData, gender: "F" })}
                                                className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 ${formData.gender === "F" ? "border-rose-500 bg-rose-50 text-rose-600 scale-105 shadow-xl shadow-rose-100" : "border-slate-50 bg-white text-slate-400"
                                                    }`}
                                            >
                                                <span className="text-2xl">👧</span>
                                                <span className="font-black text-[10px] uppercase tracking-widest">Une Fille</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 1 && (
                            <div className="space-y-8">
                                <div className="space-y-2 text-center">
                                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Une petite photo ? 📸</h1>
                                    <p className="text-slate-500 font-medium max-w-[280px] mx-auto text-sm">Ajoutez une photo pour personnaliser le profil de votre enfant.</p>
                                </div>

                                <div className="flex flex-col items-center">
                                    <label className="relative group cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setFormData({ ...formData, image: reader.result as string });
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                        <div className="w-48 h-48 rounded-[4rem] bg-sky-50 border-4 border-white shadow-2xl flex items-center justify-center text-sky-500 transition-transform group-hover:scale-110 duration-500 overflow-hidden">
                                            {formData.image ? (
                                                <img src={formData.image} className="w-full h-full object-cover" />
                                            ) : (
                                                <Plus size={48} />
                                            )}
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 w-14 h-14 gradient-primary text-white rounded-2xl flex items-center justify-center border-4 border-white shadow-xl">
                                            <Camera size={24} />
                                        </div>
                                    </label>
                                    <button
                                        onClick={nextStep}
                                        className="mt-10 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-slate-600 transition-colors"
                                    >
                                        Ignorer pour l'instant
                                    </button>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dossier Médical 🩺</h1>
                                    <p className="text-slate-500 font-medium text-sm">Ces informations sont essentielles pour la sécurité de votre enfant.</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Groupe Sanguin</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            {[
                                                { id: "A+", info: "Peut donner à A+, AB+" },
                                                { id: "A-", info: "Peut donner à A±, AB±" },
                                                { id: "B+", info: "Peut donner à B+, AB+" },
                                                { id: "B-", info: "Peut donner à B±, AB±" },
                                                { id: "AB+", info: "Receveur universel" },
                                                { id: "AB-", info: "Peut donner à AB±" },
                                                { id: "O+", info: "Donneur à tous les RH+" },
                                                { id: "O-", info: "Donneur universel 🌟" }
                                            ].map((group) => (
                                                <button
                                                    key={group.id}
                                                    onClick={() => setFormData({ ...formData, bloodGroup: group.id })}
                                                    className={`p-4 rounded-3xl border-2 transition-all text-left flex flex-col gap-1 relative overflow-hidden group ${formData.bloodGroup === group.id
                                                        ? "border-sky-500 bg-sky-50 shadow-lg shadow-sky-100"
                                                        : "border-slate-50 bg-white hover:border-slate-200"
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className={`text-lg font-black ${formData.bloodGroup === group.id ? "text-sky-600" : "text-slate-800"}`}>
                                                            {group.id}
                                                        </span>
                                                        {formData.bloodGroup === group.id && (
                                                            <div className="w-5 h-5 bg-sky-500 rounded-full flex items-center justify-center text-white">
                                                                <Check size={12} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className={`text-[9px] font-bold uppercase tracking-tight ${formData.bloodGroup === group.id ? "text-sky-400" : "text-slate-400"}`}>
                                                        {group.info}
                                                    </p>
                                                    {formData.bloodGroup === group.id && (
                                                        <motion.div
                                                            layoutId="activeBlood"
                                                            className="absolute inset-0 bg-sky-500/5 pointer-events-none"
                                                        />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Allergies connues</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: Pénicilline, Arachides..."
                                            className="w-full px-6 py-4 bg-white border-2 border-slate-50 rounded-2xl focus:border-sky-500 outline-none transition-all font-bold text-slate-700"
                                            value={formData.allergies}
                                            onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Maladies chroniques</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: Asthme, Diabète..."
                                            className="w-full px-6 py-4 bg-white border-2 border-slate-50 rounded-2xl focus:border-sky-500 outline-none transition-all font-bold text-slate-700"
                                            value={formData.conditions}
                                            onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Notes Spéciales</label>
                                        <textarea
                                            placeholder="Autres informations importantes..."
                                            className="w-full px-6 py-4 bg-white border-2 border-slate-50 rounded-2xl focus:border-sky-500 outline-none transition-all font-medium text-slate-700 min-h-[100px] resize-none"
                                            value={formData.medicalInfo}
                                            onChange={(e) => setFormData({ ...formData, medicalInfo: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="flex flex-col items-center justify-center space-y-8 py-10">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                    className="w-32 h-32 bg-emerald-100 rounded-[3rem] flex items-center justify-center text-emerald-500 shadow-2xl shadow-emerald-200"
                                >
                                    <Check size={64} />
                                </motion.div>
                                <div className="text-center space-y-3">
                                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Félicitations ! 🎉</h1>
                                    <p className="text-slate-500 font-medium max-w-[300px] mx-auto text-sm leading-relaxed">
                                        Le profil de <span className="text-sky-600 font-bold">{formData.name}</span> a été créé avec succès. Bienvenue dans l'aventure VacciCare !
                                    </p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer Navigation */}
            {currentStep < steps.length - 1 && (
                <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-50">
                    <button
                        disabled={currentStep === 0}
                        onClick={prevStep}
                        className={`flex items-center gap-2 font-black uppercase tracking-widest text-[10px] transition-all ${currentStep === 0 ? "opacity-0 invisible" : "text-slate-400 hover:text-slate-600"
                            }`}
                    >
                        <ChevronLeft size={16} />
                        Retour
                    </button>

                    {currentStep === 2 ? (
                        <button
                            onClick={handleFinish}
                            disabled={loading}
                            className="px-10 py-5 gradient-primary text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-sky-200 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
                        >
                            {loading ? "Chargement..." : "Créer le Profil"}
                            <Check size={18} />
                        </button>
                    ) : (
                        <button
                            onClick={nextStep}
                            disabled={currentStep === 0 && !formData.name}
                            className="px-10 py-5 gradient-primary text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-sky-200 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100"
                        >
                            Continuer
                            <ChevronRight size={18} />
                        </button>
                    )}
                </div>
            )}

            {/* Background decoration */}
            <div className="fixed -bottom-40 -left-40 w-80 h-80 bg-sky-100 rounded-full blur-[100px] opacity-40 pointer-events-none" />
            <div className="fixed -top-40 -right-40 w-80 h-80 bg-indigo-100 rounded-full blur-[100px] opacity-40 pointer-events-none" />
        </div>
    );
}
