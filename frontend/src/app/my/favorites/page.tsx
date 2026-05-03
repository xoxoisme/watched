"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import { getMyFavorites, deleteFavorite } from "@/lib/interaction";
import { TMDB_IMAGE, type FavoriteRecord } from "@/lib/types";
import { useAuthStore } from "@/stores/authStore";

export default function MyFavoritesPage() {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const [favorites, setFavorites] = useState<FavoriteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);

  useEffect(() => {
    if (!accessToken) { router.push("/login"); return; }
    getMyFavorites().then(setFavorites).finally(() => setLoading(false));
  }, [accessToken, router]);

  const handleRemove = async (f: FavoriteRecord) => {
    setRemovingId(f.id);
    try {
      await deleteFavorite(f.id);
      setFavorites((prev) => prev.filter((x) => x.id !== f.id));
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="px-4 pt-28 pb-16 md:px-12">
        <h1 className="mb-6 text-2xl font-black text-center">즐겨찾기</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-white/40" />
          </div>
        ) : favorites.length === 0 ? (
          <p className="py-20 text-center text-sm text-white/40">
            즐겨찾기한 콘텐츠가 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {favorites.map((f) => (
              <div key={f.id} className="group relative">
                <Link href={`/contents/c/${f.contentId}`}>
                  <div className="overflow-hidden rounded-md bg-white/5 aspect-[2/3]">
                    {f.posterPath ? (
                      <img
                        src={TMDB_IMAGE(f.posterPath, "w500")}
                        alt={f.contentTitle}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-white/20 text-xs text-center p-2">
                        {f.contentTitle}
                      </div>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs text-white/80 line-clamp-1">{f.contentTitle}</p>
                </Link>

                <button
                  onClick={() => handleRemove(f)}
                  disabled={removingId === f.id}
                  className="mt-1 flex w-full items-center justify-center gap-1 rounded bg-white/5 py-1 text-xs text-rose-400 hover:bg-white/10 disabled:opacity-50"
                >
                  {removingId === f.id ? (
                    <Loader2 size={11} className="animate-spin" />
                  ) : (
                    <Heart size={11} fill="currentColor" />
                  )}
                  즐겨찾기 해제
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
