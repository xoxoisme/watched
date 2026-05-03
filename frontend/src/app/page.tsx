"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import ContentRow from "@/components/ContentRow";
import { type PosterItem } from "@/components/PosterCard";
import { getMyWatches, getMyFavorites } from "@/lib/interaction";
import { fetchTrending, fetchRecommendations, fetchTopMovies, fetchTopTv } from "@/lib/content";
import { TMDB_IMAGE, type TmdbContent } from "@/lib/types";
import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";
import { Info, Plus, KeyRound } from "lucide-react";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function HomePage() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const isAuthed = !!accessToken;

  const [watchItems, setWatchItems] = useState<PosterItem[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<PosterItem[]>([]);
  const [favoritesMap, setFavoritesMap] = useState<Map<number, number>>(new Map());
  const [heroList, setHeroList] = useState<TmdbContent[]>([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [rawRecommended, setRawRecommended] = useState<TmdbContent[]>([]);
  const [rawTopMovies, setRawTopMovies] = useState<TmdbContent[]>([]);
  const [rawTopTv, setRawTopTv] = useState<TmdbContent[]>([]);

  const withFav = useCallback((c: TmdbContent, i?: number): PosterItem => {
    const favId = favoritesMap.get(c.tmdbId);
    return {
      id: c.tmdbId,
      href: `/contents/${c.tmdbId}?type=${c.type}`,
      title: c.title,
      posterUrl: c.posterUrl,
      tmdbId: c.tmdbId,
      contentType: c.type,
      ...(i != null && { rank: i + 1 }),
      isFavorited: favId != null,
      favoriteId: favId,
    };
  }, [favoritesMap]);

  const topMovies = useMemo(() => rawTopMovies.map((c, i) => withFav(c, i)), [rawTopMovies, withFav]);
  const topTv = useMemo(() => rawTopTv.map((c, i) => withFav(c, i)), [rawTopTv, withFav]);
  const recommendedItems = useMemo(
    () => rawRecommended.filter((c) => c.posterUrl).slice(0, 20).map((c) => withFav(c)),
    [rawRecommended, withFav]
  );

  useEffect(() => {
    fetchTrending().then((items) => setHeroList(shuffle(items)));
    fetchTopMovies().then(setRawTopMovies);
    fetchTopTv().then(setRawTopTv);
  }, []);

  useEffect(() => {
    fetchRecommendations().then(setRawRecommended).catch(() => {});
  }, [isAuthed]);

  useEffect(() => {
    if (heroList.length === 0) return;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setHeroIndex((i) => (i + 1) % heroList.length);
        setVisible(true);
      }, 600);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroList]);

  useEffect(() => {
    if (!isAuthed) {
      setWatchItems([]);
      setFavoriteItems([]);
      return;
    }
    getMyWatches().then((watches) => {
      setWatchItems(
        watches
          .filter((w) => w.status === "WATCHING")
          .map((w) => ({
            id: w.id,
            href: `/contents/c/${w.contentId}`,
            title: w.contentTitle,
            posterUrl: TMDB_IMAGE(w.posterPath, "w500"),
          }))
      );
    });
    getMyFavorites().then((favorites) => {
      const map = new Map<number, number>();
      favorites.forEach((f) => map.set(f.tmdbId, f.id));
      setFavoritesMap(map);
      setFavoriteItems(
        favorites.map((f) => ({
          id: f.id,
          href: `/contents/c/${f.contentId}`,
          title: f.contentTitle,
          posterUrl: TMDB_IMAGE(f.posterPath, "w500"),
          contentId: f.contentId,
          favoriteId: f.id,
          isFavorited: true,
        }))
      );
    });
  }, [isAuthed]);

  const hero = heroList[heroIndex];

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <div className="transition-opacity duration-500" style={{ opacity: visible ? 1 : 0 }}>
        {hero ? (
          <section className="relative h-[85vh] min-h-[560px] w-full overflow-hidden">
            <img
              src={hero.backdropUrl ?? hero.posterUrl}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
            <div className="relative z-10 flex h-full max-w-2xl flex-col justify-end px-4 pb-24 md:px-12">
              <span className="mb-3 inline-block w-fit rounded bg-accent/90 px-2 py-0.5 text-xs font-bold uppercase tracking-wider">
                {hero.type === "TV" ? "시리즈" : "영화"}
              </span>
              <h1 className="mb-4 text-4xl font-black leading-tight md:text-6xl">{hero.title}</h1>
              <div className="mb-4 flex items-center gap-3 text-sm text-white/80">
                <span>{hero.releaseDate?.slice(0, 4)}</span>
              </div>
              <p className="mb-6 line-clamp-3 text-base text-white/90 md:text-lg">{hero.overview}</p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={`/contents/${hero.tmdbId}?type=${hero.type}`}
                  className="flex items-center gap-2 rounded bg-white px-6 py-2.5 font-semibold text-black transition hover:bg-white/85"
                >
                  <Info size={18} />
                  상세 보기
                </Link>
                <Link
                  href="/collections/me"
                  className="flex items-center gap-2 rounded bg-white/20 px-6 py-2.5 font-semibold text-white backdrop-blur transition hover:bg-white/30"
                >
                  <Plus size={18} />
                  컬렉션 추가
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <div className="h-[85vh] min-h-[560px] bg-black" />
        )}
      </div>

      <div className="mt-8 space-y-2 pb-24">
        {isAuthed && watchItems.length > 0 && (
          <ContentRow title="내가 시청 중" items={watchItems} />
        )}
        {isAuthed && favoriteItems.length > 0 && (
          <ContentRow title="내 즐겨찾기" items={favoriteItems} />
        )}
        {topMovies.length > 0 && (
          <ContentRow title="주간 영화 TOP 10" items={topMovies} />
        )}
        {topTv.length > 0 && (
          <ContentRow title="주간 시리즈 TOP 10" items={topTv} />
        )}
        {isAuthed ? (
          favoriteItems.length === 0 ? (
            <div className="px-4 md:px-12 py-6">
              <p className="text-sm font-semibold text-white/70 mb-3">당신을 위한 추천</p>
              <div className="rounded-xl border border-white/10 bg-transparent px-6 py-8 text-center backdrop-blur-sm">
                <p className="text-sm text-white/60">
                  지금 당신의 관심사를 즐겨찾기 해주세요.
                </p>
                <p className="text-sm text-white/40 mt-1">
                  Watched가 관심사를 기반으로 추천해드릴게요!
                </p>
              </div>
            </div>
          ) : recommendedItems.length > 0 ? (
            <ContentRow title="당신을 위한 추천" items={recommendedItems} />
          ) : null
        ) : (
          <div className="px-4 md:px-12 py-6">
            <p className="text-sm font-semibold text-white/70 mb-3">당신을 위한 추천</p>
            <div className="rounded-xl border border-white/10 bg-transparent px-6 py-8 text-center backdrop-blur-sm">
              <p className="text-sm text-white/60 mb-4">
                회원가입 후 당신의 관심사를 기반으로 추천받아보세요!
              </p>
              <a
                href="/signup"
                className="inline-flex items-center gap-2 rounded border border-white/20 bg-transparent px-5 py-2 text-sm font-semibold transition hover:bg-white/10"
              >
                <KeyRound size={15} />
                회원가입
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
