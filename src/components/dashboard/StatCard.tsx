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
    sky: "bg-sky-50 text-sky-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
    indigo: "bg-indigo-50 text-indigo-600",
};

export default function StatCard({ title, value, description, change, icon: Icon, color, isUrgent }: StatCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="p-6 glass-card border-white/60 shadow-xl shadow-sky-900/5 transition-all duration-300"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={cn("p-3 rounded-2xl", colorMap[color])}>
                    <Icon size={24} />
                </div>
                {change && (
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg">
                        {change}
                    </span>
                )}
                {isUrgent && (
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1 animate-pulse">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                        Urgent
                    </span>
                )}
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <div className="flex items-end justify-between mt-1">
                    <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
                    {progress !== undefined && (
                        <span className="text-[10px] font-black text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md mb-1">
                            {progress}%
                        </span>
                    )}
                </div>

                {progress !== undefined && (
                    <div className="h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden p-0">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full gradient-primary rounded-full shadow-sm"
                        />
                    </div>
                )}

                <p className="text-xs text-slate-400 mt-2">{description}</p>
            </div>
        </motion.div>
    );
}
