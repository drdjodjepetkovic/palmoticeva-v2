"use client";

import { useContent } from "@/features/content/content-context";
import { Droplet, CircleDot, Sparkles, Clock } from "lucide-react";

export function CycleLegend() {
    const { t } = useContent();

    const items = [
        { color: 'bg-rose-400', label: t.calendar?.period || "Menstruacija", icon: Droplet, iconColor: "text-rose-500" },
        { color: 'bg-sky-600', label: t.calendar?.ovulation || "Ovulacija", icon: CircleDot, iconColor: "text-sky-600" },
        { color: 'bg-sky-300', label: t.calendar?.fertile || "Plodni dani", icon: Sparkles, iconColor: "text-sky-400" },
        { color: 'bg-rose-200', label: t.calendar?.predicted || "Predviđeno", icon: Clock, iconColor: "text-rose-300" },
    ];

    return (
        <div className="flex flex-wrap justify-center gap-4 mt-6 px-4">
            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-full shadow-sm border border-slate-100">
                    <item.icon className={`w-3.5 h-3.5 ${item.iconColor}`} />
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-[10px] text-slate-600 font-medium uppercase tracking-wide">{item.label}</span>
                </div>
            ))}
        </div>
    );
}
