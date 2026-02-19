"use client";

import { motion } from "framer-motion";
import {
    LogIn,
    Smartphone,
    Lock,
    ChevronRight,
    ShieldCheck,
    ShieldAlert
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { signIn } from "next-auth/react";

export default function LoginPage() {
    const [formData, setFormData] = useState({
        phone: "",
        password: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        const result = await signIn("credentials", {
            redirect: false,
            phone: formData.phone,
            password: formData.password,
        });

        if (result?.error) {
            setError("Numéro ou mot de passe incorrect");
            setIsSubmitting(false);
        } else {
            router.push("/");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/30 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="bg-blob bg-sky-100 top-[-100px] right-[-100px] opacity-15" />
            <div className="bg-blob bg-indigo-100 bottom-[-100px] left-[-100px] opacity-15" />

            <div className="max-w-md w-full relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-10 border-white/60 shadow-2xl shadow-sky-900/5"
                >
                    <div className="flex flex-col items-center text-center mb-10">
                        <div className="w-16 h-16 bg-sky-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-sky-400/40 text-white">
                            <LogIn size={32} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">
                            Bon retour !
                        </h1>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">
                            Veuillez vous authentifier pour accéder à votre espace VacciCare.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-xs font-bold"
                            >
                                <ShieldAlert size={16} />
                                {error}
                            </motion.div>
                        )}
                        <div className="space-y-4">
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors">
                                    <Smartphone size={20} />
                                </div>
                                <input
                                    type="tel"
                                    placeholder="Numéro de téléphone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full bg-white/40 border border-white/60 rounded-2xl py-4 pl-14 pr-6 text-slate-800 font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 outline-none transition-all shadow-sm"
                                    required
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="password"
                                    placeholder="Mot de passe"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-white/40 border border-white/60 rounded-2xl py-4 pl-14 pr-6 text-slate-800 font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 outline-none transition-all shadow-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button type="button" className="text-[10px] font-black uppercase tracking-widest text-sky-600 hover:text-sky-700">
                                Mot de passe oublié ?
                            </button>
                        </div>

                        <button
                            disabled={isSubmitting}
                            className="w-full gradient-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-sky-200 hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3 mt-4"
                        >
                            {isSubmitting ? "Authentification..." : "Se Connecter"}
                            {!isSubmitting && <ChevronRight size={18} />}
                        </button>
                    </form>

                    <div className="mt-10 pt-10 border-t border-slate-200/50 text-center">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                            Nouveau sur VacciRappel ?
                        </p>
                        <Link
                            href="/auth/register"
                            className="text-sky-600 font-black uppercase tracking-widest text-[10px] hover:text-sky-700 transition-colors bg-sky-50 px-4 py-2 rounded-xl border border-sky-100"
                        >
                            Créer mon espace
                        </Link>
                    </div>
                </motion.div>

                {/* Security Badge */}
                <div className="mt-8 flex items-center justify-center gap-2 text-slate-400">
                    <ShieldCheck size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Accès sécurisé VacciCert</span>
                </div>
            </div>
        </div>
    );
}
