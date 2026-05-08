"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin, Search, Navigation, Star, Phone, Clock,
    ChevronRight, Filter, Maximize2, Building2, Shield,
    Stethoscope, Heart, Baby, CheckCircle, Activity, X
} from "lucide-react";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/MapComponent"), { ssr: false });

const hospitals = [
    {
        id: 1,
        name: "Hôpital Gynéco-Obstétrique",
        type: "Public",
        distance: "2.4 km",
        rating: 4.8,
        reviews: 124,
        open: "Ouvert 24h/24",
        openStatus: true,
        address: "Quartier Ngousso, Yaoundé",
        phone: "+237 222 21 48 64",
        tags: ["Vaccination", "Urgence", "Pédiatrie"],
        gradient: "from-sky-400 to-cyan-500",
        badge: "bg-sky-100 text-sky-700",
        pinColor: "bg-sky-500",
        waitTime: "~25 min"
    },
    {
        id: 2,
        name: "Clinique de l'Espoir",
        type: "Privé",
        distance: "4.1 km",
        rating: 4.5,
        reviews: 89,
        open: "Ferme à 20h00",
        openStatus: true,
        address: "Bastos, Yaoundé",
        phone: "+237 222 21 30 25",
        tags: ["Vaccination", "Check-up"],
        gradient: "from-violet-400 to-purple-500",
        badge: "bg-violet-100 text-violet-700",
        pinColor: "bg-violet-500",
        waitTime: "~15 min"
    },
    {
        id: 3,
        name: "Centre de Santé d'Ebolowa",
        type: "Public",
        distance: "5.7 km",
        rating: 4.2,
        reviews: 56,
        open: "Ouvert 24h/24",
        openStatus: true,
        address: "Zone Industrielle, Yaoundé",
        phone: "+237 222 28 14 90",
        tags: ["Vaccination", "Maternité"],
        gradient: "from-teal-400 to-emerald-500",
        badge: "bg-teal-100 text-teal-700",
        pinColor: "bg-teal-500",
        waitTime: "~40 min"
    }
];

export default function MapPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedHospital, setSelectedHospital] = useState<any>(null);
    const [activeFilter, setActiveFilter] = useState("Tous");

    const filters = ["Tous", "Public", "Privé"];

    const filtered = hospitals.filter(h => {
        const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === "Tous" || h.type === activeFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6 h-[calc(100vh-10rem)] flex flex-col">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-50 rounded-full mb-3 border border-sky-100">
                        <MapPin className="text-sky-500" size={14} />
                        <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest">Yaoundé, Cameroun</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Carte des <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-violet-500">Points de Santé</span>
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium text-sm">Trouvez le centre de vaccination le plus proche.</p>
                </div>

                {/* Live indicator */}
                <div className="flex items-center gap-3 px-5 py-3 glass rounded-2xl shadow-sm">
                    <div className="relative">
                        <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
                        <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-40" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-700">GPS Actif</p>
                        <p className="text-[10px] text-slate-400 font-medium">Localisation précise</p>
                    </div>
                </div>
            </div>

            {/* Stats Strip */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: "Centres proches", value: "24", icon: Building2, gradient: "from-sky-400 to-cyan-400" },
                    { label: "Ouverts maintenant", value: "18", icon: CheckCircle, gradient: "from-teal-400 to-emerald-400" },
                    { label: "Vaccinations/jour", value: "340+", icon: Activity, gradient: "from-violet-400 to-purple-400" },
                ].map(s => (
                    <div key={s.label} className="glass-card p-4 flex items-center gap-3 border-white/70">
                        <div className={`w-10 h-10 bg-gradient-to-br ${s.gradient} rounded-xl flex items-center justify-center text-white shadow-lg shrink-0`}>
                            <s.icon size={18} />
                        </div>
                        <div>
                            <p className="text-xl font-black text-slate-800">{s.value}</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
                {/* Map Area */}
                <div className="flex-[2] relative overflow-hidden rounded-[2.5rem] border border-white/60 shadow-2xl shadow-sky-900/10 group min-h-[300px]">
                    {/* Map background - gradient simulation */}
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-teal-50/60 to-blue-50">
                        {/* Grid pattern */}
                        <div className="absolute inset-0 opacity-20"
                            style={{
                                backgroundImage: 'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)',
                                backgroundSize: '40px 40px'
                            }}
                        />
                        {/* Road-like lines */}
                        <div className="absolute inset-0">
                            <div className="absolute top-1/4 left-0 right-0 h-1 bg-slate-200/60 rounded-full" />
                            <div className="absolute top-2/3 left-0 right-0 h-0.5 bg-slate-200/40 rounded-full" />
                            <div className="absolute left-1/3 top-0 bottom-0 w-0.5 bg-slate-200/40 rounded-full" />
                            <div className="absolute left-2/3 top-0 bottom-0 w-1 bg-slate-200/60 rounded-full" />
                        </div>
                    </div>

                    {/* Map Controls Overlay */}
                    <div className="absolute top-5 left-5 right-5 flex items-center gap-3 z-20">
                        <div className="flex-1 bg-white/80 backdrop-blur-2xl rounded-2xl border border-white/80 shadow-xl flex items-center px-4 py-1">
                            <Search className="text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Rechercher un hôpital..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full py-3.5 px-3 bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 placeholder:text-slate-400 outline-none"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery("")} className="text-slate-400">
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                        <button className="p-4 gradient-primary text-white rounded-2xl shadow-xl shadow-sky-400/40 hover:scale-105 transition-all">
                            <Navigation size={20} />
                        </button>
                    </div>

                    <div className="absolute top-24 left-5 flex gap-2 z-20">
                        {filters.map(f => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm ${activeFilter === f
                                    ? 'bg-white text-sky-600 shadow-md'
                                    : 'bg-white/60 backdrop-blur-sm text-slate-500'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* Interactive Leaflet Map */}
                    <div className="absolute inset-0 z-0">
                        <MapComponent 
                            hospitals={hospitals} 
                            selectedHospital={selectedHospital} 
                            onSelectHospital={setSelectedHospital} 
                        />
                    </div>

                    {/* Selected hospital popup */}
                    <AnimatePresence>
                        {selectedHospital && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl rounded-3xl p-5 shadow-2xl border border-white z-30"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-11 h-11 bg-gradient-to-br ${selectedHospital.gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                                            <Building2 size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-800 text-sm">{selectedHospital.name}</h4>
                                            <p className="text-[11px] text-slate-500 flex items-center gap-1"><MapPin size={10} /> {selectedHospital.address}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedHospital(null)} className="p-1.5 bg-slate-100 rounded-lg text-slate-500">
                                        <X size={16} />
                                    </button>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-2.5 py-1.5 rounded-xl text-xs font-black">
                                        <Star size={12} fill="currentColor" /> {selectedHospital.rating}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-xl text-xs font-bold">
                                        <Clock size={12} /> {selectedHospital.waitTime}
                                    </div>
                                    <a href={`tel:${selectedHospital.phone}`} className={`ml-auto flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${selectedHospital.gradient} text-white rounded-xl text-xs font-black shadow-md`}>
                                        <Phone size={13} /> Appeler
                                    </a>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button className="absolute bottom-6 right-6 p-3.5 glass rounded-2xl text-slate-600 hover:bg-white transition-all shadow-xl z-20">
                        <Maximize2 size={20} />
                    </button>
                </div>

                {/* Hospital List */}
                <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                    <div className="flex items-center justify-between px-1">
                        <div>
                            <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">À proximité</h3>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">{filtered.length} centre(s)</p>
                        </div>
                        <button className="p-2.5 glass rounded-xl text-slate-500 hover:text-sky-600 transition-all shadow-sm">
                            <Filter size={18} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar pb-10">
                        {filtered.map((h) => (
                            <motion.div
                                key={h.id}
                                whileHover={{ y: -3 }}
                                onClick={() => setSelectedHospital(selectedHospital?.id === h.id ? null : h)}
                                className={`p-5 rounded-2xl cursor-pointer transition-all border-2 ${selectedHospital?.id === h.id
                                    ? 'bg-white border-sky-200 shadow-xl shadow-sky-900/8'
                                    : 'glass-card border-white/70 hover:shadow-lg'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-11 h-11 bg-gradient-to-br ${h.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0`}>
                                            <Building2 size={18} />
                                        </div>
                                        <div>
                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${h.badge}`}>{h.type}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-2.5 py-1 rounded-xl">
                                        <Star size={12} fill="currentColor" />
                                        <span className="text-[11px] font-black">{h.rating}</span>
                                    </div>
                                </div>

                                <h4 className="font-bold text-slate-800 text-sm mb-1.5 hover:text-sky-600 transition-colors">{h.name}</h4>
                                <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mb-4">
                                    <MapPin size={12} className="text-sky-400" /> {h.address}
                                </p>

                                <div className="flex items-center gap-2 mb-4 flex-wrap">
                                    {h.tags.map(tag => (
                                        <span key={tag} className="text-[9px] font-black px-2 py-1 bg-slate-50 text-slate-500 rounded-lg uppercase tracking-wide">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="border-t border-slate-50 pt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <Clock size={13} className="text-slate-400" />
                                            {h.open}
                                        </span>
                                        <span className={`font-black text-transparent bg-clip-text bg-gradient-to-r ${h.gradient}`}>
                                            {h.distance}
                                        </span>
                                    </div>
                                    <div className={`p-2 bg-gradient-to-br ${h.gradient} rounded-xl text-white shadow-md`}>
                                        <ChevronRight size={16} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        <button className="w-full py-4 text-sm font-bold text-slate-500 rounded-2xl hover:bg-white transition-colors border-2 border-dashed border-slate-200 hover:border-sky-200 hover:text-sky-600">
                            Voir plus de résultats
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
