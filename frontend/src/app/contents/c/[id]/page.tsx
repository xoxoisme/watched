"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import WatchStatusButton from "@/components/WatchStatusButton";
import RatingInput from "@/components/RatingInput";
import FavoriteButton from "@/components/FavoriteButton";
import ReviewSection from "@/components/ReviewSection";
import { fetchContentById } from "@/lib/content";
import {
  createWatch, getMyWatches, updateWatch, deleteWatch,
  createRating, getAverageRating, getMyRatingForContent, updateRating, deleteRating,
  createFavorite, getMyFavorites, deleteFavorite,
  getReviewsByContent
} from "@/lib/interaction";
import { TMDB_IMAGE } from "@/lib/types";
import type {
  Content, WatchRecord, WatchStatus,
  RatingRecord, RatingAverage, FavoriteRecord, ReviewRecord
} from "@/lib/types";
import { useAuthStore } from "@/stores/authStore";

export default function ContentDetailByIdPage() {
  const { id } = useParams<{ id: string }>();
  const accessToken = useAuthStore((s) => s.accessToken);
  const isAuthed = !!accessToken;

  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [myWatch, setMyWatch] = useState<WatchRecord | null>(null);
  const [myRating, setMyRating] = useState<RatingRecord | null>(null);
  const [avgRating, setAvgRating] = useState<RatingAverage | null>(null);
  const [myFavorite, setMyFavorite] = useState<FavoriteRecord | null>(null);
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const c = await fetchContentById(Number(id));
        setContent(c);

        const [reviewList, avg] = await Promise.all([
          getReviewsByContent(c.id),
          getAverageRating(c.id)
        ]);
        setReviews(reviewList);
        setAvgRating(avg);

        if (isAuthed) {
          const [watches, favorites, rating] = await Promise.all([
            getMyWatches(),
            getMyFavorites(),
            getMyRatingForContent(c.id)
          ]);
          setMyWatch(watches.find((w) => w.contentId === c.id) ?? null);
          setMyFavorite(favorites.find((f) => f.contentId === c.id) ?? null);
          setMyRating(rating);
        }
      } catch {
        setError("콘텐츠를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isAuthed]);

  const handleWatchChange = async (status: WatchStatus | null) => {
    if (!content) return;
    setActionLoading(true);
    try {
      if (status === null && myWatch) {
        await deleteWatch(myWatch.id);
        setMyWatch(null);
      } else if (status && myWatch) {
        const updated = await updateWatch(myWatch.id, status);
        setMyWatch(updated);
      } else if (status) {
        const created = await createWatch(content.id, status);
        setMyWatch(created);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleRating = async (score: number) => {
    if (!content) return;
    setActionLoading(true);
    try {
      if (myRating) {
        const updated = await updateRating(myRating.id, score);
        setMyRating(updated);
      } else {
        const created = await createRating(content.id, score);
        setMyRating(created);
      }
      const avg = await getAverageRating(content.id);
      setAvgRating(avg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRating = async () => {
    if (!myRating) return;
    setActionLoading(true);
    try {
      await deleteRating(myRating.id);
      setMyRating(null);
      const avg = await getAverageRating(content!.id);
      setAvgRating(avg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!content) return;
    setActionLoading(true);
    try {
      if (myFavorite) {
        await deleteFavorite(myFavorite.id);
        setMyFavorite(null);
      } else {
        const created = await createFavorite(content.id);
        setMyFavorite(created);
      }
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 size={36} className="animate-spin text-white/50" />
      </main>
    );
  }

  if (error || !content) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-white/60">{error ?? "콘텐츠를 찾을 수 없습니다."}</p>
      </main>
    );
  }

  const posterUrl = TMDB_IMAGE(content.posterPath, "w500");
  const year = content.releaseDate?.slice(0, 4) ?? "";

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero — backdrop with content overlaid */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: "92vh" }}>
        {/* Blurred poster as backdrop */}
        <img
          src={posterUrl}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover scale-110 blur-2xl"
        />
        {/* Dark base overlay */}
        <div className="absolute inset-0 bg-background/75" />
        {/* Left → right gradient: dark left, fade right */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        {/* Bottom gradient into page */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

        {/* Content overlay */}
        <div className="relative flex items-end min-h-[92vh] px-8 md:px-36 pb-16 pt-28">
          <div className="flex items-end justify-between w-full gap-10">

            {/* LEFT: Info */}
            <div className="flex-1 min-w-0 max-w-2xl">
              {/* Badges */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="rounded-full border border-accent/50 bg-accent/10 px-3 py-0.5 text-xs font-semibold text-accent uppercase tracking-wide">
                  {content.type === "TV" ? "시리즈" : "영화"}
                </span>
                {year && (
                  <span className="rounded-full border border-white/20 px-3 py-0.5 text-xs text-white/60">
                    {year}
                  </span>
                )}
                {avgRating?.averageScore != null && (
                  <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-0.5 text-xs font-semibold text-yellow-400">
                    ★ {Number(avgRating.averageScore).toFixed(1)}
                  </span>
                )}
                {content.voteAverage > 0 && (
                  <span className="rounded-full border border-white/20 px-3 py-0.5 text-xs text-white/50">
                    TMDB {Number(content.voteAverage).toFixed(1)}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-6xl font-black leading-none mb-2 drop-shadow-lg">
                {content.title}
              </h1>
              {content.originalTitle !== content.title && (
                <p className="text-sm text-white/40 mb-5">{content.originalTitle}</p>
              )}

              {/* Overview */}
              {content.overview && (
                <p className="text-sm text-white/70 leading-relaxed max-w-xl mb-6 line-clamp-3">
                  {content.overview}
                </p>
              )}

              {/* Action buttons */}
              {isAuthed ? (
                <div className="flex flex-wrap gap-3 mb-6">
                  <WatchStatusButton
                    current={myWatch?.status ?? null}
                    onChange={handleWatchChange}
                    loading={actionLoading}
                  />
                  <FavoriteButton
                    active={!!myFavorite}
                    onClick={handleFavorite}
                    loading={actionLoading}
                  />
                </div>
              ) : (
                <p className="mb-6 text-sm text-white/50">
                  <a href="/login" className="text-accent underline">로그인</a>하면 시청 기록, 평점, 즐겨찾기를 저장할 수 있습니다.
                </p>
              )}

              {/* Rating */}
              {isAuthed && (
                <div>
                  <p className="text-xs text-white/50 mb-2 uppercase tracking-wide">내 평점</p>
                  <RatingInput
                    value={myRating?.score ?? null}
                    onSubmit={handleRating}
                    onDelete={handleDeleteRating}
                    loading={actionLoading}
                  />
                </div>
              )}
            </div>

            {/* RIGHT: Poster card */}
            <div className="hidden md:block shrink-0 w-72 rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.7)] ring-1 ring-white/10 mb-4 mr-16">
              <img
                src={posterUrl}
                alt={content.title}
                className="w-full aspect-[2/3] object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="px-8 md:px-36 pb-24 mt-4">
        <ReviewSection
          contentId={content.id}
          reviews={[...reviews].sort((a, b) => b.likeCount - a.likeCount)}
          onReviewChange={setReviews}
        />
      </div>
    </main>
  );
}
