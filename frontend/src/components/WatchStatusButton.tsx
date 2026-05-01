"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Eye, CheckCircle, Clock } from "lucide-react";
import type { WatchStatus } from "@/lib/types";
import { WATCH_LABELS } from "@/lib/types";

const STATUS_ICONS: Record<WatchStatus, React.ReactNode> = {
  WATCHING: <Eye size={15} />,
  COMPLETED: <CheckCircle size={15} />,
  PLAN_TO_WATCH: <Clock size={15} />,
};

const STATUSES = Object.keys(WATCH_LABELS) as WatchStatus[];

type Props = {
  current: WatchStatus | null;
  onChange: (status: WatchStatus | null) => void;
  loading?: boolean;
};

export default function WatchStatusButton({ current, onChange, loading }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (s: WatchStatus) => {
    if (s === current) {
      onChange(null);
    } else {
      onChange(s);
    }
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={loading}
        className={`flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50 backdrop-blur-sm ${
          current
            ? "border border-accent/60 bg-accent/10 text-accent hover:bg-accent/20"
            : "border border-white/20 bg-white/5 text-white hover:bg-white/10"
        }`}
      >
        {current ? STATUS_ICONS[current] : <Eye size={15} />}
        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <div
        className={`absolute left-0 top-full mt-1 z-20 w-48 rounded-md border border-white/10 bg-black/95 py-1 shadow-xl backdrop-blur transition-all duration-200 origin-top ${
          open ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-95 pointer-events-none"
        }`}
      >
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => handleSelect(s)}
            className={`flex w-full items-center gap-2 px-3 py-2.5 text-sm transition hover:bg-white/10 ${
              current === s ? "text-accent" : "text-white/80"
            }`}
          >
            {STATUS_ICONS[s]}
            <span className="flex-1 text-left">{WATCH_LABELS[s]}</span>
            {current === s && (
              <span className="text-xs text-white/40">탭하여 취소</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
