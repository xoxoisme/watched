"use client";

import { Heart } from "lucide-react";

type Props = {
  active: boolean;
  onClick: () => void;
  loading?: boolean;
};

export default function FavoriteButton({ active, onClick, loading }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      aria-label={active ? "즐겨찾기 해제" : "즐겨찾기 추가"}
      className={`flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50 ${
        active
          ? "bg-pink-600/80 text-white hover:bg-pink-600"
          : "bg-white/15 text-white hover:bg-white/25"
      }`}
    >
      <Heart size={15} className={active ? "fill-white" : ""} />
    </button>
  );
}
