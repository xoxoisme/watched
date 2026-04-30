"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ContentRow from "@/components/ContentRow";
import { type PosterItem } from "@/components/PosterCard";
import {
  heroContent,
  recommended,
  trending,
  toPosterItem,
} from "@/lib/mockData";
import { getMyWatches, getMyFavorites } from "@/lib/interaction";
import { TMDB_IMAGE } from "@/lib/types";
import { useAuthStore } from "@/stores/authStore";

export default function HomePage() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const isAuthed = !!accessToken;

  const [watchItems, setWatchItems] = useState<PosterItem[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<PosterItem[]>([]);

  useEffect(() => {
    if (!isAuthed) {
      setWatchItems([]);
      setFavoriteItems([]);
      return;
    }

    getMyWatches().then((watches) => {
      const watching = watches
        .filter((w) => w.status === "WATCHING")
        .map((w) => ({
          id: w.id,
          href: `/contents/c/${w.contentId}`,
          title: w.contentTitle,
          posterUrl: TMDB_IMAGE(w.posterPath, "w500"),
        }));
      setWatchItems(watching);
    });

    getMyFavorites().then((favorites) => {
      const items = favorites.map((f) => ({
        id: f.id,
        href: `/contents/c/${f.contentId}`,
        title: f.contentTitle,
        posterUrl: TMDB_IMAGE(f.posterPath, "w500"),
      }));
      setFavoriteItems(items);
    });
  }, [isAuthed]);

  return (
    <main className="min-h-screen">
      <Header />
      <Hero content={heroContent} />

      <div className="-mt-24 space-y-2 pb-24">
        {isAuthed && watchItems.length > 0 && (
          <ContentRow title="내가 시청 중" items={watchItems} />
        )}
        {isAuthed && favoriteItems.length > 0 && (
          <ContentRow title="내 즐겨찾기" items={favoriteItems} />
        )}
        <ContentRow title="지금 뜨는 콘텐츠" items={trending.map(toPosterItem)} />
        <ContentRow title="당신을 위한 추천" items={recommended.map(toPosterItem)} />
      </div>
    </main>
  );
}
