"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    Baby,
    Calendar,
    Camera,
    ChevronRight,
    ChevronLeft,
    Check,
    Stethoscope,
    ShieldAlert,
    ShieldCheck,
    Syringe,
    Sparkles,
    RotateCcw,
    Loader2,
    X,
    Plus
} from "lucide-react";
import Link from "next/link";
import { mutateWithOfflineQueue } from "@/lib/offlineQueue";
import { addCachedChild, loadChildren } from "@/lib/childrenStore";
import { formatVaccineAge } from "@/lib/vaccine-age";
import { getAgeInMonths, getCatchUpGroup } from "@/data/catchUpSchedule";

const steps = [
    { id: "identity", title: "Identité", icon: Baby },
    { id: "photo", title: "Photo", icon: Camera },
    { id: "vaccines", title: "Vaccins", icon: Syringe },
    { id: "medical", title: "Santé", icon: Stethoscope },
    { id: "success", title: "Terminé", icon: Check },
];

type VaccineChoice = {
    id: string;
    code?: string | null;
    seriesCode?: string | null;
    doseNumber?: number;
    name: string;
    protection?: string | null;
    recommendedAge?: number;
    recommendedAgeDays?: number | null;
    eligibilityRules?: {
        schedule?: "ROUTINE" | "TARGETED" | "ADOLESCENT";
    } | null;
};

export default function AddChildPage() {
    const router = useRouter();
    const [today] = useState(() => new Date());
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [vaccines, setVaccines] = useState<VaccineChoice[]>([]);
    const [vaccinesLoading, setVaccinesLoading] = useState(true);
    const [vaccinesError, setVaccinesError] = useState("");
    const [completedVaccineCodes, setCompletedVaccineCodes] = useState<string[]>([]);
    const [createdScheduleMode, setCreatedScheduleMode] = useState<"ROUTINE" | "CATCH_UP">("ROUTINE");
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

    const loadVaccineChoices = useCallback(() => {
        setVaccinesLoading(true);
        setVaccinesError("");
        fetch("/api/vaccines", { cache: "no-store" })
            .then(async (response) => {
                if (!response.ok) throw new Error("Impossible de charger le carnet vaccinal.");
                const data = await response.json();
                setVaccines(Array.isArray(data) ? data : []);
            })
            .catch((fetchError: unknown) => {
                setVaccinesError(
                    fetchError instanceof Error
                        ? fetchError.message
                        : "Impossible de charger le carnet vaccinal.",
                );
            })
            .finally(() => setVaccinesLoading(false));
    }, []);

    useEffect(() => {
        loadVaccineChoices();
    }, [loadVaccineChoices]);

    const ageInDays = useMemo(() => {
        if (!formData.birthDate) return null;
        const birthDate = new Date(formData.birthDate);
        if (Number.isNaN(birthDate.getTime())) return null;
        return Math.max(0, Math.floor((today.getTime() - birthDate.getTime()) / 86_400_000));
    }, [formData.birthDate, today]);
    const ageInMonths = useMemo(
        () => getAgeInMonths(formData.birthDate),
        [formData.birthDate],
    );
    const catchUpGroup = getCatchUpGroup(ageInMonths);
    const isCatchUpCandidate = completedVaccineCodes.length === 0 &&
        ageInMonths !== null &&
        ageInMonths >= 6 &&
        ageInMonths <= 59;
    const dueVaccines = useMemo(
        () => vaccines.filter((vaccine) => {
            const isRoutine = !vaccine.eligibilityRules?.schedule ||
                vaccine.eligibilityRules.schedule === "ROUTINE";
            return isRoutine &&
                Boolean(vaccine.code) &&
                ageInDays !== null &&
                (vaccine.recommendedAgeDays ?? (vaccine.recommendedAge || 0) * 30) <= ageInDays;
        }),
        [ageInDays, vaccines],
    );
    const vaccineGroups = useMemo(() => {
        const groups = new Map<number, VaccineChoice[]>();
        for (const vaccine of dueVaccines) {
            const age = vaccine.recommendedAgeDays ?? (vaccine.recommendedAge || 0) * 30;
            groups.set(age, [...(groups.get(age) || []), vaccine]);
        }
        return Array.from(groups.entries()).sort(([first], [second]) => first - second);
    }, [dueVaccines]);

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

    const toggleVaccine = (selected: VaccineChoice) => {
        if (!selected.code) return;
        const isSelected = completedVaccineCodes.includes(selected.code);
        const relatedCodes = dueVaccines
            .filter((candidate) => {
                if (!candidate.code || candidate.seriesCode !== selected.seriesCode) return false;
                if (!selected.seriesCode || selected.doseNumber === undefined) {
                    return candidate.code === selected.code;
                }
                const candidateDose = candidate.doseNumber ?? 1;
                return selected.doseNumber === 0
                    ? candidateDose === 0
                    : candidateDose >= 1 &&
                        (isSelected
                            ? candidateDose >= selected.doseNumber
                            : candidateDose <= selected.doseNumber);
            })
            .map((candidate) => candidate.code!)
            .concat(selected.code);

        setCompletedVaccineCodes((current) => isSelected
            ? current.filter((code) => !relatedCodes.includes(code))
            : Array.from(new Set([...current, ...relatedCodes])));
    };

    const handleFinish = async () => {
        setLoading(true);
        setError("");
        try {
            const result = await mutateWithOfflineQueue({
                url: "/api/children",
                method: "POST",
                body: {
                    ...formData,
                    completedVaccineCodes,
                },
            });

            if (result.ok || result.queued) {
                const responseMode = result.data &&
                    typeof result.data === "object" &&
                    "scheduleMode" in result.data
                    ? result.data.scheduleMode
                    : null;
                setCreatedScheduleMode(
                    responseMode === "CATCH_UP" || isCatchUpCandidate
                        ? "CATCH_UP"
                        : "ROUTINE",
                );
                if (result.queued) {
                    addCachedChild({
                        ...formData,
                        id: `local-${crypto.randomUUID()}`,
                        birthDate: new Date(formData.birthDate).toISOString(),
                        vaccinations: [],
                        growthRecords: [],
                        version: 0,
                        pendingSync: true,
                    });
                } else {
                    await loadChildren(true);
                }
                nextStep(); // Move to success step
                setTimeout(() => {
                    router.push("/");
                    router.refresh();
                }, 3000);
            } else {
                setError(result.error || "Impossible d’enregistrer l’enfant.");
            }
        } catch (error) {
            console.error("Failed to add child", error);
            setError("La connexion a échoué. Réessayez dans quelques instants.");
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
                                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">C’est un petit bout de chou ? 👶</h1>
                                    <p className="text-slate-500 font-medium">Commençons par les présentations.</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Le nom de l’enfant</label>
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
                                                max={today.toISOString().slice(0, 10)}
                                                className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-50 rounded-[2rem] focus:border-sky-500 outline-none transition-all shadow-sm focus:shadow-xl focus:shadow-sky-100 font-bold text-slate-700"
                                                value={formData.birthDate}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, birthDate: e.target.value });
                                                    setCompletedVaccineCodes([]);
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">C’est...</label>
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
                                                <Image
                                                    src={formData.image}
                                                    alt={`Photo de ${formData.name || "l’enfant"}`}
                                                    width={192}
                                                    height={192}
                                                    unoptimized
                                                    className="h-full w-full object-cover"
                                                />
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
                                        Ignorer pour l’instant
                                    </button>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-7">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-violet-600">
                                        <Sparkles size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Le carnet de {formData.name.split(" ")[0] || "votre enfant"}</span>
                                    </div>
                                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Quels tampons sont déjà dans son carnet ?</h1>
                                    <p className="text-sm font-medium leading-6 text-slate-500">Touchez chaque dose déjà reçue. Choisir une dose sélectionne automatiquement les doses précédentes de la même série.</p>
                                </div>

                                <motion.div
                                    layout
                                    className={`relative overflow-hidden rounded-[2rem] border p-5 ${
                                        isCatchUpCandidate
                                            ? "border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50"
                                            : "border-emerald-200 bg-gradient-to-br from-emerald-50 to-sky-50"
                                    }`}
                                >
                                    <div className="relative flex items-start gap-4">
                                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg ${
                                            isCatchUpCandidate ? "bg-amber-500 shadow-amber-200" : "bg-emerald-500 shadow-emerald-200"
                                        }`}>
                                            {isCatchUpCandidate ? <RotateCcw size={22} /> : <ShieldCheck size={22} />}
                                        </div>
                                        <div>
                                            <p className={`text-xs font-black uppercase tracking-widest ${
                                                isCatchUpCandidate ? "text-amber-800" : "text-emerald-800"
                                            }`}>
                                                {isCatchUpCandidate ? "Rattrapage zéro dose" : "Calendrier personnalisé"}
                                            </p>
                                            <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">
                                                {isCatchUpCandidate
                                                    ? `Aucune dose sélectionnée après 6 mois : les prochains contacts du groupe ${catchUpGroup?.id || "6–59"} mois partiront d’aujourd’hui.`
                                                    : completedVaccineCodes.length > 0
                                                        ? `${completedVaccineCodes.length} dose(s) déjà reçue(s). Les doses manquantes seront programmées à partir d’aujourd’hui en respectant les intervalles.`
                                                        : "Le calendrier de routine sera calculé depuis la date de naissance."}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>

                                <button
                                    type="button"
                                    onClick={() => setCompletedVaccineCodes([])}
                                    aria-pressed={completedVaccineCodes.length === 0}
                                    className={`flex w-full items-center justify-between rounded-2xl border-2 px-5 py-4 text-left transition-all ${
                                        completedVaccineCodes.length === 0
                                            ? "border-violet-300 bg-violet-50 text-violet-800 shadow-lg shadow-violet-100"
                                            : "border-slate-100 bg-white text-slate-500 hover:border-violet-200"
                                    }`}
                                >
                                    <span>
                                        <span className="block text-sm font-black">Aucun vaccin reçu</span>
                                        <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-wider opacity-65">Laisser le carnet vide</span>
                                    </span>
                                    <span className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                        completedVaccineCodes.length === 0 ? "bg-violet-500 text-white" : "bg-slate-100 text-slate-300"
                                    }`}>
                                        <Check size={16} strokeWidth={3} />
                                    </span>
                                </button>

                                {vaccinesLoading ? (
                                    <div className="flex items-center justify-center gap-3 rounded-3xl bg-white py-12 text-sm font-bold text-slate-400">
                                        <Loader2 size={20} className="animate-spin text-sky-500" />
                                        Préparation du carnet…
                                    </div>
                                ) : vaccinesError ? (
                                    <div className="rounded-3xl border border-rose-100 bg-rose-50 p-5 text-sm font-bold leading-6 text-rose-700">
                                        <p>{vaccinesError}</p>
                                        <button
                                            type="button"
                                            onClick={loadVaccineChoices}
                                            className="mt-3 rounded-xl bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-rose-600 shadow-sm"
                                        >
                                            Réessayer
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {vaccineGroups.map(([ageDays, groupVaccines]) => (
                                            <section key={ageDays} className="space-y-3">
                                                <div className="flex items-center gap-3 px-1">
                                                    <div className="h-px flex-1 bg-slate-200" />
                                                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                                                        {formatVaccineAge(groupVaccines[0])}
                                                    </p>
                                                    <div className="h-px flex-1 bg-slate-200" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {groupVaccines.map((vaccine) => {
                                                        const selected = Boolean(vaccine.code && completedVaccineCodes.includes(vaccine.code));
                                                        return (
                                                            <motion.button
                                                                layout
                                                                type="button"
                                                                key={vaccine.id}
                                                                onClick={() => toggleVaccine(vaccine)}
                                                                aria-pressed={selected}
                                                                whileTap={{ scale: 0.96 }}
                                                                className={`relative min-h-28 overflow-hidden rounded-3xl border-2 p-4 text-left transition-all ${
                                                                    selected
                                                                        ? "border-emerald-400 bg-emerald-50 shadow-lg shadow-emerald-100"
                                                                        : "border-slate-100 bg-white hover:border-sky-200 hover:shadow-md"
                                                                }`}
                                                            >
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <span className={`flex h-9 w-9 items-center justify-center rounded-2xl ${
                                                                        selected ? "bg-emerald-500 text-white" : "bg-sky-50 text-sky-500"
                                                                    }`}>
                                                                        {selected ? <Check size={18} strokeWidth={3} /> : <Syringe size={17} />}
                                                                    </span>
                                                                    {selected && (
                                                                        <span className="rounded-full bg-white px-2 py-1 text-[8px] font-black uppercase tracking-wider text-emerald-600">
                                                                            Reçu
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className={`mt-3 text-sm font-black leading-4 ${
                                                                    selected ? "text-emerald-900" : "text-slate-800"
                                                                }`}>
                                                                    {vaccine.name}
                                                                </p>
                                                                <p className="mt-1 line-clamp-2 text-[10px] font-medium leading-4 text-slate-400">
                                                                    {vaccine.protection}
                                                                </p>
                                                            </motion.button>
                                                        );
                                                    })}
                                                </div>
                                            </section>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {currentStep === 3 && (
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

                        {currentStep === 4 && (
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
                                        Le profil de <span className="text-sky-600 font-bold">{formData.name}</span> a été créé avec succès. Son calendrier {createdScheduleMode === "CATCH_UP" ? "de rattrapage" : "personnalisé"} est prêt.
                                    </p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {error && currentStep < steps.length - 1 && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-xs font-bold leading-5 text-rose-700"
                >
                    <ShieldAlert size={18} className="mt-0.5 shrink-0" />
                    {error}
                </motion.div>
            )}

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

                    {currentStep === 3 ? (
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
                            disabled={
                                (currentStep === 0 && (!formData.name || !formData.birthDate)) ||
                                (currentStep === 2 && (vaccinesLoading || Boolean(vaccinesError)))
                            }
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
