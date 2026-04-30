"use client";

import { useState } from "react";
import { Star } from "lucide-react";

type Props = {
  value: number | null;
  onSubmit: (score: number) => void;
  onDelete?: () => void;
  loading?: boolean;
};

export default function RatingInput({ value, onSubmit, onDelete, loading }: Props) {
  const [hover, setHover] = useState<number | null>(null);

  const display = hover ?? value;

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex items-center gap-1">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((score) => (
          <button
            key={score}
            disabled={loading}
            onMouseEnter={() => setHover(score)}
            onMouseLeave={() => setHover(null)}
            onClick={() => onSubmit(score)}
            aria-label={`${score}점`}
            className="p-0.5 transition disabled:opacity-50"
          >
            <Star
              size={20}
              className={`transition-colors ${
                display !== null && score <= display
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-white/30"
              }`}
            />
          </button>
        ))}
        {value !== null && (
          <span className="ml-2 text-sm font-semibold text-yellow-400">{value}/10</span>
        )}
      </div>

      {value !== null && onDelete && (
        <button
          onClick={onDelete}
          disabled={loading}
          className="text-xs text-white/40 underline hover:text-white/70 disabled:opacity-50"
        >
          평점 삭제
        </button>
      )}
    </div>
  );
}
