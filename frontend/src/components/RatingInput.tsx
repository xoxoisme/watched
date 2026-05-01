"use client";

import { useState } from "react";

type Props = {
  value: number | null;
  onSubmit: (score: number) => void;
  onDelete?: () => void;
  loading?: boolean;
};

function HalfStarIcon({ fill }: { fill: "empty" | "half" | "full" }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" className="shrink-0">
      <defs>
        <linearGradient id={`half-${fill}`}>
          <stop offset="50%" stopColor={fill === "empty" ? "transparent" : "#facc15"} />
          <stop offset="50%" stopColor={fill === "full" ? "#facc15" : "transparent"} />
        </linearGradient>
      </defs>
      <polygon
        points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
        fill={
          fill === "full"
            ? "#facc15"
            : fill === "half"
            ? "url(#half-half)"
            : "transparent"
        }
        stroke={fill === "empty" ? "rgba(255,255,255,0.25)" : "#facc15"}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {fill === "half" && (
        <polygon
          points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
          fill="#facc15"
          clipPath="inset(0 50% 0 0)"
        />
      )}
    </svg>
  );
}

function StarDisplay({ score, starIndex }: { score: number | null; starIndex: number }) {
  if (score === null) return <HalfStarIcon fill="empty" />;
  const full = starIndex * 2;
  const half = starIndex * 2 - 1;
  if (score >= full) return <HalfStarIcon fill="full" />;
  if (score >= half) return <HalfStarIcon fill="half" />;
  return <HalfStarIcon fill="empty" />;
}

export default function RatingInput({ value, onSubmit, onDelete, loading }: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => i + 1).map((starIndex) => (
          <div key={starIndex} className="relative flex cursor-pointer">
            {/* 왼쪽 반 = 반개 (score = starIndex*2-1) */}
            <button
              disabled={loading}
              onMouseEnter={() => setHover(starIndex * 2 - 1)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onSubmit(starIndex * 2 - 1)}
              aria-label={`${(starIndex - 0.5).toFixed(1)}점`}
              className="absolute left-0 top-0 h-full w-1/2 z-10 disabled:cursor-not-allowed"
            />
            {/* 오른쪽 반 = 꽉찬 별 (score = starIndex*2) */}
            <button
              disabled={loading}
              onMouseEnter={() => setHover(starIndex * 2)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onSubmit(starIndex * 2)}
              aria-label={`${starIndex}점`}
              className="absolute right-0 top-0 h-full w-1/2 z-10 disabled:cursor-not-allowed"
            />
            <StarDisplay score={display} starIndex={starIndex} />
          </div>
        ))}
        {display !== null && (
          <span className="ml-2 text-sm font-semibold text-yellow-400">{display}/10</span>
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
