"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ShieldCheck, Sparkles, Star } from "lucide-react";
import { useEffect } from "react";

const confetti = Array.from({ length: 24 }, (_, index) => ({
  id: index,
  x: ((index * 47) % 100) - 50,
  y: -80 - ((index * 31) % 120),
  rotate: (index * 67) % 360,
  color: ["#38bdf8", "#a78bfa", "#fbbf24", "#fb7185", "#34d399"][
    index % 5
  ],
}));

type Props = {
  show: boolean;
  childName?: string;
  vaccineName?: string;
  queued?: boolean;
  onDone: () => void;
};

export default function VaccinationCelebration({
  show,
  childName,
  vaccineName,
  queued,
  onDone,
}: Props) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!show) return;
    const timer = window.setTimeout(onDone, reduceMotion ? 1400 : 3200);
    return () => window.clearTimeout(timer);
  }, [onDone, reduceMotion, show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onDone}
          className="fixed inset-0 z-[160] flex cursor-pointer items-center justify-center overflow-hidden bg-slate-950/75 p-5 backdrop-blur-xl"
        >
          {!reduceMotion &&
            confetti.map((piece) => (
              <motion.span
                key={piece.id}
                initial={{ x: 0, y: 0, scale: 0, rotate: 0, opacity: 1 }}
                animate={{
                  x: piece.x * 7,
                  y: piece.y * 3,
                  scale: [0, 1.2, 0.8],
                  rotate: piece.rotate,
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 2.2,
                  delay: (piece.id % 8) * 0.045,
                  ease: "easeOut",
                }}
                style={{ backgroundColor: piece.color }}
                className="absolute left-1/2 top-1/2 h-3 w-2 rounded-sm"
              />
            ))}

          <motion.div
            initial={{ scale: 0.65, y: 35, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 220 }}
            className="relative w-full max-w-md text-center text-white"
          >
            {!reduceMotion && (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="absolute left-1/2 top-8 h-64 w-64 -translate-x-1/2 rounded-full border border-dashed border-white/20"
                />
                <motion.div
                  animate={{ scale: [1, 1.35, 1], opacity: [0.25, 0, 0.25] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  className="absolute left-1/2 top-8 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-400/25 blur-3xl"
                />
              </>
            )}

            <div className="relative mx-auto h-72 w-72">
              <motion.div
                initial={{ rotate: -18, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.12, type: "spring", damping: 12 }}
                className="absolute inset-8 flex items-center justify-center rounded-[4rem] bg-gradient-to-br from-emerald-400 via-teal-400 to-sky-500 shadow-[0_30px_90px_rgba(52,211,153,.45)]"
              >
                <ShieldCheck size={104} strokeWidth={1.7} />
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.55, type: "spring" }}
                  className="absolute bottom-6 right-5 flex h-16 w-16 items-center justify-center rounded-full border-4 border-emerald-400 bg-white text-emerald-500"
                >
                  <Check size={34} strokeWidth={4} />
                </motion.span>
              </motion.div>
              <motion.span
                animate={reduceMotion ? {} : { y: [-4, -18, -4], rotate: [-8, 8, -8] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute left-2 top-12 text-amber-300"
              >
                <Star size={34} fill="currentColor" />
              </motion.span>
              <motion.span
                animate={reduceMotion ? {} : { y: [0, 14, 0], rotate: [8, -8, 8] }}
                transition={{ duration: 2.4, repeat: Infinity }}
                className="absolute bottom-10 right-0 text-violet-300"
              >
                <Sparkles size={38} />
              </motion.span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-emerald-300">
                Super-pouvoir débloqué
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight">
                Bravo {childName?.split(" ")[0] || "champion"} !
              </h2>
              <p className="mx-auto mt-3 max-w-sm text-sm font-semibold leading-6 text-slate-200">
                {vaccineName || "Ce vaccin"} est maintenant marqué comme effectué.
                Une protection de plus, ça se célèbre !
              </p>
              {queued && (
                <p className="mx-auto mt-4 w-fit rounded-full bg-white/10 px-4 py-2 text-[10px] font-bold text-sky-200">
                  Enregistré hors ligne · synchronisation automatique à venir
                </p>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
