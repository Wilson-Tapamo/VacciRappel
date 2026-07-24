import Image from "next/image";
import { HeartPulse, ShieldCheck, Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div
      className="flex min-h-[55vh] items-center justify-center"
      role="status"
      aria-label="Chargement de la page"
    >
      <div className="relative flex flex-col items-center">
        <div className="absolute h-36 w-36 animate-ping rounded-full bg-sky-200/25" />
        <div className="relative flex h-24 w-24 animate-float items-center justify-center rounded-[2rem] border border-white bg-white/85 shadow-2xl shadow-sky-200/60 backdrop-blur-xl">
          <Image src="/icons/icon-192.png" alt="" width={64} height={64} priority />
          <HeartPulse className="absolute -right-2 top-2 text-rose-500" size={20} />
          <ShieldCheck className="absolute -left-2 bottom-2 text-emerald-500" size={19} />
          <Sparkles className="absolute -top-3 left-2 text-amber-400" size={18} />
        </div>
        <p className="mt-7 text-xs font-black uppercase tracking-[0.22em] text-sky-600">
          VacciRappel
        </p>
        <p className="mt-2 text-sm font-bold text-slate-500">
          Votre espace prend soin de se préparer…
        </p>
        <div className="mt-5 h-1.5 w-40 overflow-hidden rounded-full bg-white shadow-inner">
          <div className="h-full w-1/2 animate-shimmer rounded-full bg-gradient-to-r from-sky-400 via-violet-400 to-rose-400" />
        </div>
      </div>
    </div>
  );
}
