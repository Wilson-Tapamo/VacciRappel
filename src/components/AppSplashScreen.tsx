"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Heart, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function AppSplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 1750);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-label="Ouverture de VacciRappel"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.42, ease: "easeOut" }}
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_38%,#ffffff_0%,#e0f2fe_42%,#ede9fe_100%)]"
        >
          <motion.div
            aria-hidden="true"
            animate={{ rotate: 360 }}
            transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
            className="absolute h-64 w-64 rounded-full border border-dashed border-sky-300/70 sm:h-72 sm:w-72"
          >
            <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-2.5 text-rose-400 shadow-lg shadow-sky-200/60">
              <Heart size={19} fill="currentColor" />
            </span>
            <span className="absolute bottom-4 left-3 rounded-2xl bg-white p-2.5 text-emerald-500 shadow-lg shadow-sky-200/60">
              <ShieldCheck size={20} />
            </span>
            <span className="absolute bottom-5 right-2 rounded-2xl bg-white p-2.5 text-amber-400 shadow-lg shadow-sky-200/60">
              <Sparkles size={19} fill="currentColor" />
            </span>
          </motion.div>

          <div className="relative flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.72, rotate: -8 }}
              animate={{ scale: [0.72, 1.08, 1], rotate: [-8, 3, 0] }}
              transition={{ duration: 0.8, ease: [0.2, 0.9, 0.25, 1] }}
              className="relative flex h-36 w-36 items-center justify-center rounded-[2.4rem] border border-white/90 bg-white/80 shadow-[0_24px_70px_rgba(56,189,248,0.28)] backdrop-blur-xl"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1.25, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src="/brand/logo-mark.png"
                  alt="VacciRappel"
                  width={112}
                  height={112}
                  priority
                  className="h-28 w-28 object-contain"
                />
              </motion.div>
              <motion.span
                animate={{ scale: [0.8, 1.35], opacity: [0.45, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-3 rounded-[1.8rem] border-2 border-sky-300"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.45 }}
              className="mt-7 text-center"
            >
              <Image
                src="/brand/logo-wordmark.png"
                alt="VacciRappel"
                width={230}
                height={64}
                priority
                className="h-auto w-48 object-contain sm:w-56"
              />
              <p className="mt-2 text-xs font-black uppercase tracking-[0.22em] text-sky-700/70">
                Chaque dose est un super-pouvoir
              </p>
            </motion.div>

            <div className="mt-7 flex gap-2">
              {[0, 1, 2].map((index) => (
                <motion.span
                  key={index}
                  animate={{ y: [0, -7, 0], opacity: [0.35, 1, 0.35] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: index * 0.14,
                  }}
                  className="h-2 w-2 rounded-full bg-sky-500"
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
