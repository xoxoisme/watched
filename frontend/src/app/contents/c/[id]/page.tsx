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
  createRating, getAverageRating, updateRating, deleteRating,
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
          const [watches, favorites] = await Promise.all([
            getMyWatches(),
            getMyFavorites()
          ]);
          setMyWatch(watches.find((w) => w.contentId === c.id) ?? null);
          setMyFavorite(favorites.find((f) => f.contentId === c.id) ?? null);
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
  const backdropUrl = TMDB_IMAGE(content.posterPath, "original");
  const year = content.releaseDate?.slice(0, 4) ?? "";

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <img src={backdropUrl} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="relative -mt-32 px-4 md:px-12">
        <div className="flex gap-6">
          <div className="hidden md:block shrink-0 w-44 rounded-lg overflow-hidden shadow-2xl">
            <img src={posterUrl} alt={content.title} className="w-full aspect-[2/3] object-cover" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded bg-accent/80 px-2 py-0.5 text-xs font-bold uppercase">
                {content.type === "TV" ? "시리즈" : "영화"}
              </span>
              {year && <span className="text-sm text-white/60">{year}</span>}
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-1 leading-tight">{content.title}</h1>
            {content.originalTitle !== content.title && (
              <p className="text-sm text-white/50 mb-3">{content.originalTitle}</p>
            )}

            <div className="flex items-center gap-4 mb-4 text-sm text-white/70">
              {avgRating?.averageScore != null && (
                <span className="text-yellow-400 font-semibold">
                  ★ {Number(avgRating.averageScore).toFixed(1)} 평균
                </span>
              )}
              {content.voteAverage > 0 && (
                <span>TMDB {Number(content.voteAverage).toFixed(1)}</span>
              )}
            </div>

            {content.overview && (
              <p className="text-sm text-white/80 leading-relaxed max-w-2xl mb-6 line-clamp-4">
                {content.overview}
              </p>
            )}

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

            {isAuthed && (
              <div className="mb-8">
                <p className="text-sm text-white/60 mb-2">내 평점</p>
                <RatingInput
                  value={myRating?.score ?? null}
                  onSubmit={handleRating}
                  onDelete={handleDeleteRating}
                  loading={actionLoading}
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 max-w-3xl pb-24">
          <ReviewSection
            contentId={content.id}
            reviews={reviews}
            onReviewChange={setReviews}
          />
        </div>
      </div>
    </main>
  );
}
