"use client";

import { useContent } from "@/features/content/content-context";

export function CycleLegend() {
    const { t } = useContent();

    const items = [
        { color: 'bg-rose-400', label: t.calendar?.period || "Menstruacija" },
        { color: 'bg-sky-600', label: t.calendar?.ovulation || "Ovulacija" },
        { color: 'bg-sky-300', label: t.calendar?.fertile || "Plodni dani" },
        { color: 'bg-rose-200', label: t.calendar?.predicted || "Predviđeno" },
    ];

    return (
        <div className="flex flex-wrap justify-center gap-4 mt-4 px-4">
            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-xs text-muted-foreground font-medium">{item.label}</span>
                </div>
            ))}
        </div>
    );
}
