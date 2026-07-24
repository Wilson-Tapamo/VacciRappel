"use client";

import { HeartPulse, ShieldCheck, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageJourneyLoader() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      key={pathname}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-sky-50/35 backdrop-blur-[2px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: reduceMotion ? [0, 0] : [0, 1, 1, 0] }}
      transition={{
        duration: reduceMotion ? 0.01 : 0.78,
        times: [0, 0.16, 0.72, 1],
        ease: "easeInOut",
      }}
    >
      <motion.div
        className="relative flex min-w-52 items-center gap-3 overflow-hidden rounded-[1.75rem] border border-white/90 bg-white/88 px-5 py-4 shadow-2xl shadow-sky-900/15"
        initial={{ y: 14, scale: 0.94 }}
        animate={{ y: [14, 0, 0, -8], scale: [0.94, 1, 1, 0.98] }}
        transition={{ duration: reduceMotion ? 0.01 : 0.78, times: [0, 0.2, 0.72, 1] }}
      >
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-cyan-400 to-teal-400 text-white shadow-lg shadow-sky-200">
          <ShieldCheck size={22} />
          <motion.span
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-rose-500 shadow-md"
            animate={reduceMotion ? undefined : { scale: [0.8, 1.2, 0.9], rotate: [-8, 8, -4] }}
            transition={{ duration: 0.55, repeat: 1 }}
          >
            <HeartPulse size={11} />
          </motion.span>
        </div>

        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-600">
            VacciRappel
          </p>
          <p className="mt-0.5 text-sm font-extrabold text-slate-800">
            On prépare la suite…
          </p>
        </div>

        <motion.div
          className="absolute bottom-0 left-0 h-1 rounded-full bg-gradient-to-r from-sky-400 via-violet-400 to-rose-400"
          initial={{ width: "8%" }}
          animate={{ width: "100%" }}
          transition={{ duration: reduceMotion ? 0.01 : 0.68, ease: "easeOut" }}
        />
        <Sparkles className="absolute right-3 top-2 text-amber-400" size={12} />
      </motion.div>
    </motion.div>
  );
}
