"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  ChevronRight,
  Clock,
  Layers3,
  MapPin,
  Navigation,
  Phone,
  Search,
  Star,
  X,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

const MapComponent = dynamic(() => import("@/components/MapComponent"), { ssr: false });

type MapHospital = {
  id: number;
  name: string;
  shortName: string;
  type: string;
  distance: string;
  rating: number;
  reviews: number;
  open: string;
  openStatus: boolean;
  address: string;
  phone: string;
  tags: string[];
  gradient: string;
  badge: string;
  pinColor: string;
  waitTime: string;
};

const hospitals: MapHospital[] = [
  {
    id: 1,
    name: "Hôpital Gynéco-Obstétrique",
    shortName: "HGO",
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
    waitTime: "~25 min",
  },
  {
    id: 2,
    name: "Clinique de l'Espoir",
    shortName: "CE",
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
    waitTime: "~15 min",
  },
  {
    id: 3,
    name: "Centre de Santé d'Ebolowa",
    shortName: "CSE",
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
    waitTime: "~40 min",
  },
  {
    id: 4,
    name: "Polyclinique Sainte-Famille",
    shortName: "PSF",
    type: "Privé",
    distance: "3.2 km",
    rating: 4.9,
    reviews: 201,
    open: "Lun-Sam 07h-19h",
    openStatus: true,
    address: "Biyem-Assi, Yaoundé",
    phone: "+237 222 30 15 70",
    tags: ["Vaccination", "Urgence", "Pédiatrie"],
    gradient: "from-rose-400 to-pink-500",
    badge: "bg-rose-100 text-rose-700",
    pinColor: "bg-rose-500",
    waitTime: "~10 min",
  },
];

type MapPageProps = {
  onOpenHospitals?: () => void;
  onOpenHospital?: (hospitalId: number) => void;
};

export default function MapPage({ onOpenHospitals, onOpenHospital }: MapPageProps = {}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHospital, setSelectedHospital] = useState<MapHospital | null>(null);
  const [activeFilter, setActiveFilter] = useState("Tous");

  const filters = ["Tous", "Public", "Privé"];
  const filtered = hospitals.filter((hospital) => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "Tous" || hospital.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const openHospitalList = (
    className: string,
    content: React.ReactNode,
  ) =>
    onOpenHospitals ? (
      <button type="button" onClick={onOpenHospitals} className={className}>
        {content}
      </button>
    ) : (
      <Link href="/hospitals" className={className}>
        {content}
      </Link>
    );

  const openHospitalProfile = (hospital: MapHospital) => {
    if (onOpenHospital) {
      onOpenHospital(hospital.id);
      return;
    }
  };

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-slate-100 lg:h-[calc(100vh-2rem)] lg:rounded-[2.5rem] lg:shadow-2xl">
      <div className="absolute inset-0 z-0">
        <MapComponent
          hospitals={filtered}
          selectedHospital={selectedHospital}
          onSelectHospital={setSelectedHospital}
        />
      </div>

      <div className="pointer-events-none absolute left-3 right-3 top-[5.25rem] z-20 flex flex-col gap-2.5 lg:left-1/2 lg:right-auto lg:top-6 lg:w-[620px] lg:-translate-x-1/2">
        <div className="pointer-events-auto flex items-center gap-2 rounded-[1.6rem] border border-white/80 bg-white/90 p-1.5 shadow-2xl shadow-slate-900/15 backdrop-blur-2xl">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[1.15rem] bg-sky-50 text-sky-500">
            <Search size={19} />
          </div>
          <input
            type="text"
            placeholder="Centre, quartier…"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-700 outline-none placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Effacer la recherche"
              className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-rose-500"
            >
              <X size={16} />
            </button>
          )}
          <button
            type="button"
            aria-label="Me localiser"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[1.15rem] bg-slate-900 text-white shadow-lg transition active:scale-95"
          >
            <Navigation size={17} />
          </button>
        </div>

        <div className="pointer-events-auto flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {filters.map((filter) => (
            <button
              type="button"
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`shrink-0 rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-wider shadow-sm backdrop-blur-xl transition ${
                activeFilter === filter
                  ? "border-sky-400 bg-sky-500 text-white shadow-sky-300/50"
                  : "border-white/80 bg-white/88 text-slate-600"
              }`}
            >
              {filter}
            </button>
          ))}
          {openHospitalList(
            "flex shrink-0 items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-white shadow-lg transition active:scale-95",
            <>
              <Layers3 size={13} />
              Fiches
            </>,
          )}
        </div>

        <div className="pointer-events-auto -mx-1 flex gap-3 overflow-x-auto px-1 pb-2 no-scrollbar">
          {filtered.map((hospital) => {
            const isSelected = selectedHospital?.id === hospital.id;
            return (
              <button
                type="button"
                key={hospital.id}
                onClick={() => setSelectedHospital(hospital)}
                aria-label={`Afficher ${hospital.name} sur la carte`}
                aria-pressed={isSelected}
                className="group w-[4.35rem] shrink-0 text-center"
              >
                <span
                  className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full border-[3px] bg-white p-0.5 shadow-lg transition ${
                    isSelected
                      ? "scale-105 border-sky-500"
                      : "border-white group-active:scale-95"
                  }`}
                >
                  <span
                    className={`flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br ${hospital.gradient} text-[10px] font-black text-white`}
                  >
                    {hospital.shortName}
                  </span>
                </span>
                <span className="mt-1.5 block truncate text-[9px] font-extrabold text-slate-800 drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
                  {hospital.shortName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedHospital && (
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.96 }}
            transition={{ type: "spring", damping: 27, stiffness: 260 }}
            className="absolute bottom-[7.1rem] left-3 right-3 z-30 lg:bottom-6 lg:left-6 lg:right-auto lg:w-[400px]"
          >
            <div className="flex flex-col gap-3 rounded-[1.8rem] border border-white/85 bg-white/94 p-4 shadow-2xl shadow-slate-900/20 backdrop-blur-2xl lg:gap-5 lg:rounded-[2.5rem] lg:p-6">
              <div className="flex items-start gap-3">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${selectedHospital.gradient} text-white shadow-lg`}>
                  <Building2 size={21} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-base font-black text-slate-800">
                    {selectedHospital.name}
                  </h4>
                  <p className="mt-1 flex items-center gap-1 truncate text-[11px] font-medium text-slate-500">
                    <MapPin size={11} className="shrink-0 text-sky-500" />
                    {selectedHospital.address}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[10px] font-black text-amber-500">
                      <Star size={11} fill="currentColor" /> {selectedHospital.rating}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                      <Clock size={11} /> {selectedHospital.waitTime}
                    </span>
                    <span className="text-[10px] font-black text-sky-600">
                      {selectedHospital.distance}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedHospital(null)}
                  aria-label="Fermer la fiche"
                  className="rounded-full bg-slate-100 p-2 text-slate-400"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="grid grid-cols-[0.85fr_1.15fr] gap-2">
                <a
                  href={`tel:${selectedHospital.phone}`}
                  className={`flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r ${selectedHospital.gradient} py-3 text-[11px] font-black text-white shadow-lg transition active:scale-95`}
                >
                  <Phone size={14} /> Appeler
                </a>
                {onOpenHospital ? (
                  <button
                    type="button"
                    onClick={() => openHospitalProfile(selectedHospital)}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3 text-[11px] font-black text-white shadow-lg transition active:scale-95"
                  >
                    Voir la fiche <ChevronRight size={14} />
                  </button>
                ) : (
                  <Link
                    href="/hospitals"
                    className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3 text-[11px] font-black text-white shadow-lg transition active:scale-95"
                  >
                    Voir la fiche <ChevronRight size={14} />
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!selectedHospital && (
        <button
          type="button"
          aria-label="Recentrer la carte"
          className="absolute bottom-[7.1rem] right-4 z-20 flex h-12 w-12 items-center justify-center rounded-2xl border border-white bg-white/92 text-slate-700 shadow-xl backdrop-blur-xl transition active:scale-95 lg:bottom-6 lg:h-14 lg:w-14"
        >
          <Navigation size={20} className="rotate-45" />
        </button>
      )}
    </div>
  );
}
