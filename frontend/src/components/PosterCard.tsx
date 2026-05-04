"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { createFavorite, deleteFavorite } from "@/lib/interaction";
import { fetchContentByTmdbId } from "@/lib/content";
import type { ContentType } from "@/lib/types";

export type PosterItem = {
  id: number;
  href: string;
  title: string;
  posterUrl: string;
  year?: string;
  rating?: number;
  rank?: number;
  tmdbId?: number;
  contentType?: ContentType;
  contentId?: number;
  favoriteId?: number;
  isFavorited?: boolean;
};

export default function PosterCard({ content }: { content: PosterItem }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const isAuthed = !!accessToken;

  const [favorited, setFavorited] = useState(content.isFavorited ?? false);
  const [favId, setFavId] = useState<number | undefined>(content.favoriteId);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFavorited(content.isFavorited ?? false);
    setFavId(content.favoriteId);
  }, [content.isFavorited, content.favoriteId]);

  const canFavorite = isAuthed && (content.contentId != null || content.tmdbId != null);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canFavorite || loading) return;
    setLoading(true);
    try {
      if (favorited && favId != null) {
        await deleteFavorite(favId);
        setFavorited(false);
        setFavId(undefined);
      } else {
        let contentId = content.contentId;
        if (contentId == null && content.tmdbId != null && content.contentType != null) {
          const c = await fetchContentByTmdbId(content.tmdbId, content.contentType);
          contentId = c.id;
        }
        if (contentId != null) {
          const created = await createFavorite(contentId);
          setFavorited(true);
          setFavId(created.id);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`shrink-0 ${content.rank != null ? "flex items-end" : ""}`}>
      {/* 순위 번호 */}
      {content.rank != null && (
        <span className="relative z-30 mr-2 shrink-0 select-none font-brand leading-none text-[5rem] text-white md:text-[6rem]"
          style={{ WebkitTextStroke: "1px rgba(0,0,0,0.5)" }}
        >
          {content.rank}
        </span>
      )}

      {/* 포스터 */}
      <div className="group/card relative z-10 block w-44 shrink-0 md:w-52">
        <Link
          href={content.href}
          className="relative block overflow-hidden rounded-md bg-surface transition-transform duration-200 ease-out group-hover/card:scale-105 group-hover/card:shadow-2xl group-hover/card:z-10"
        >
          <div className="aspect-[2/3] w-full overflow-hidden">
            <img
              src={content.posterUrl}
              alt={content.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 transition-opacity duration-200 group-hover/card:opacity-100" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 px-3 pb-3 opacity-0 transition-all duration-200 group-hover/card:translate-y-0 group-hover/card:opacity-100">
            <p className="truncate text-sm font-semibold">{content.title}</p>
            {(content.rating !== undefined || content.year) && (
              <div className="mt-1 flex items-center gap-2 text-xs text-white/80">
                {content.rating !== undefined && (
                  <span className="flex items-center gap-1 text-yellow-400">
                    <Star size={12} fill="currentColor" />
                    {content.rating.toFixed(1)}
                  </span>
                )}
                {content.year && <span>{content.year}</span>}
              </div>
            )}
          </div>
        </Link>

        {/* 하트 버튼 */}
        {canFavorite && (
          <button
            onClick={handleFavorite}
            disabled={loading}
            className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-black/20 backdrop-blur-sm opacity-0 transition-all duration-200 group-hover/card:pointer-events-auto group-hover/card:opacity-100 hover:bg-black/35 disabled:opacity-50"
          >
            <Heart
              size={22}
              fill={favorited ? "currentColor" : "none"}
              className={favorited ? "text-red-400" : "text-white/70"}
            />
          </button>
        )}
      </div>
    </div>
  );
}
