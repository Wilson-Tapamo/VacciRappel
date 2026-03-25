import { LucideIcon } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface StatCardProps {
    title: string;
    value: string;
    description?: string;
    change?: string;
    icon: LucideIcon;
    color: "sky" | "amber" | "emerald" | "rose" | "indigo";
    progress?: number;
    isUrgent?: boolean;
}

const colorMap = {
    sky: "bg-sky-50 text-sky-600 border-sky-100 bg-gradient-to-br from-sky-50 to-white",
    amber: "bg-amber-50 text-amber-600 border-amber-100 bg-gradient-to-br from-amber-50 to-white",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100 bg-gradient-to-br from-emerald-50 to-white",
    rose: "bg-rose-50 text-rose-600 border-rose-100 bg-gradient-to-br from-rose-50 to-white",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100 bg-gradient-to-br from-indigo-50 to-white",
};

export default function StatCard({ title, value, description, change, icon: Icon, color, isUrgent, progress }: StatCardProps) {
    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            className="p-8 glass-card border-white/80 shadow-2xl shadow-sky-900/5 transition-all duration-500 group relative overflow-hidden"
        >
            {/* Background Accent */}
            <div className={cn("absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity", 
                color === 'sky' ? 'bg-sky-400' : 
                color === 'amber' ? 'bg-amber-400' : 
                color === 'emerald' ? 'bg-emerald-400' : 
                color === 'rose' ? 'bg-rose-400' : 'bg-indigo-400'
            )} />

            <div className="relative z-10 flex items-start justify-between mb-6">
                <div className={cn("p-4 rounded-[1.5rem] border shadow-sm transition-transform group-hover:scale-110 duration-500", colorMap[color])}>
                    <Icon size={26} strokeWidth={2.5} />
                </div>
                {change && (
                    <span className="px-3 py-1.5 bg-emerald-50/80 backdrop-blur-sm text-emerald-600 text-[10px] font-black rounded-xl border border-emerald-100 shadow-sm">
                        {change}
                    </span>
                )}
                {isUrgent && (
                    <span className="px-3 py-1.5 bg-rose-50/80 backdrop-blur-sm text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2 border border-rose-100 shadow-sm animate-pulse">
                        <span className="w-2 h-2 bg-rose-500 rounded-full" />
                        Urgent
                    </span>
                )}
            </div>
            <div className="relative z-10">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
                    {progress !== undefined && (
                        <span className="text-[10px] font-black text-sky-600 bg-sky-50 px-2 py-0.5 rounded-lg">
                            +{progress}%
                        </span>
                    )}
                </div>

                {progress !== undefined && (
                    <div className="h-2.5 bg-slate-100/50 rounded-full mt-5 overflow-hidden p-0.5 border border-slate-100/50 shadow-inner">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
                            className="h-full gradient-primary rounded-full shadow-lg shadow-sky-400/20"
                        />
                    </div>
                )}

                {description && (
                    <p className="text-xs text-slate-500 mt-4 font-medium flex items-center gap-2">
                        <span className={cn("w-1.5 h-1.5 rounded-full", color === 'sky' ? 'bg-sky-400' : 'bg-slate-300')} />
                        {description}
                    </p>
                )}
            </div>
        </motion.div>
    );
}
