"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Phone,
    Lock,
    ChevronRight,
    ArrowLeft,
    ShieldCheck,
    Smartphone,
    CheckCircle2,
    ShieldAlert
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { signIn } from "next-auth/react";

const steps = [
    {
        id: "name",
        title: "Comment vous appelez-vous ?",
        subtitle: "Pour personnaliser votre expérience.",
        icon: User,
        field: "name",
        placeholder: "Ex: Sarah Martin",
        type: "text"
    },
    {
        id: "phone",
        title: "Quel est votre numéro ?",
        subtitle: "Votre identifiant unique pour sécuriser le compte.",
        icon: Smartphone,
        field: "phone",
        placeholder: "06 00 00 00 00",
        type: "tel"
    },
    {
        id: "password",
        title: "Choisissez un mot de passe",
        subtitle: "Utilisez au moins 8 caractères pour plus de sécurité.",
        icon: Lock,
        field: "password",
        placeholder: "••••••••",
        type: "password"
    }
];

export default function RegisterPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        password: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Une erreur est survenue");
            }

            // Automatically sign in
            const result = await signIn("credentials", {
                redirect: false,
                phone: formData.phone,
                password: formData.password,
            });

            if (result?.error) {
                throw new Error("Erreur de connexion automatique");
            }

            router.push("/");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const step = steps[currentStep];
    const Icon = step.icon;
    const progress = ((currentStep + 1) / steps.length) * 100;

    return (
        <div className="min-h-screen bg-slate-50/30 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="bg-blob bg-sky-100 -top-20 -right-20 opacity-20" />
            <div className="bg-blob bg-indigo-100 -bottom-20 -left-20 opacity-20" />

            <div className="max-w-md w-full relative z-10">
                {/* Progress Bar */}
                <div className="mb-10 space-y-2">
                    <div className="flex justify-between items-end">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Étape {currentStep + 1} sur {steps.length}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-sky-600">{Math.round(progress)}%</p>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full gradient-primary"
                        />
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: 20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                        className="glass-card p-8 md:p-10 border-white/60 shadow-2xl shadow-sky-900/5"
                    >
                        <div className="flex flex-col items-center text-center mb-10">
                            <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-white/40">
                                <Icon size={32} />
                            </div>
                            <h1 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
                                {step.title}
                            </h1>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                {step.subtitle}
                            </p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-xs font-bold"
                            >
                                <ShieldAlert size={16} />
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-6">
                            <div className="relative">
                                <input
                                    type={step.type}
                                    placeholder={step.placeholder}
                                    value={formData[step.field as keyof typeof formData]}
                                    onChange={(e) => setFormData({ ...formData, [step.field]: e.target.value })}
                                    className="w-full bg-white/40 border border-white/60 rounded-2xl py-4 px-6 text-slate-800 font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 outline-none transition-all shadow-sm"
                                    autoFocus
                                />
                            </div>

                            <div className="pt-4 flex gap-4">
                                {currentStep > 0 && (
                                    <button
                                        onClick={handlePrev}
                                        className="p-4 glass rounded-2xl text-slate-400 hover:text-slate-600 transition-all shadow-sm"
                                    >
                                        <ArrowLeft size={24} />
                                    </button>
                                )}
                                <button
                                    onClick={handleNext}
                                    disabled={!formData[step.field as keyof typeof formData] || isSubmitting}
                                    className="flex-1 gradient-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-sky-200 hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-3"
                                >
                                    {isSubmitting ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                        />
                                    ) : (
                                        <>
                                            {currentStep === steps.length - 1 ? "Terminer" : "Suivant"}
                                            <ChevronRight size={18} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className="mt-8 text-center pt-8 border-t border-slate-200/50">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                        Déjà inscrit ?
                    </p>
                    <Link
                        href="/auth/login"
                        className="text-sky-600 font-black uppercase tracking-widest text-[10px] hover:text-sky-700 transition-colors bg-sky-50 px-4 py-2 rounded-xl border border-sky-100"
                    >
                        Se Connecter
                    </Link>
                </div>

                {/* Security Badge */}
                <div className="mt-12 flex items-center justify-center gap-2 text-slate-400">
                    <ShieldCheck size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Données chiffrées de bout en bout</span>
                </div>
            </div>
        </div>
    );
}
