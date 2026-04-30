"use client";

import { useState } from "react";
import { ChevronDown, Eye, CheckCircle, Clock, X, Trash2 } from "lucide-react";
import type { WatchStatus } from "@/lib/types";
import { WATCH_LABELS } from "@/lib/types";

const STATUS_ICONS: Record<WatchStatus, React.ReactNode> = {
  WATCHING: <Eye size={15} />,
  COMPLETED: <CheckCircle size={15} />,
  PLAN_TO_WATCH: <Clock size={15} />,
  DROPPED: <X size={15} />
};

const STATUSES = Object.keys(WATCH_LABELS) as WatchStatus[];

type Props = {
  current: WatchStatus | null;
  onChange: (status: WatchStatus | null) => void;
  loading?: boolean;
};

export default function WatchStatusButton({ current, onChange, loading }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={loading}
        className={`flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50 ${
          current
            ? "bg-accent/90 text-white hover:bg-accent"
            : "bg-white/15 text-white hover:bg-white/25"
        }`}
      >
        {current ? (
          <>
            {STATUS_ICONS[current]}
            {WATCH_LABELS[current]}
          </>
        ) : (
          <>
            <Eye size={15} />
            시청 기록 추가
          </>
        )}
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-20 w-44 rounded-md border border-white/10 bg-black/95 py-1 shadow-xl backdrop-blur">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => { onChange(s); setOpen(false); }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition hover:bg-white/10 ${
                current === s ? "text-accent" : "text-white/80"
              }`}
            >
              {STATUS_ICONS[s]}
              {WATCH_LABELS[s]}
            </button>
          ))}
          {current && (
            <>
              <div className="my-1 border-t border-white/10" />
              <button
                onClick={() => { onChange(null); setOpen(false); }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 transition hover:bg-white/10"
              >
                <Trash2 size={14} />
                기록 삭제
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
