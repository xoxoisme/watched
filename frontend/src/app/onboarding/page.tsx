"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Check, Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { searchContent, fetchTrending } from "@/lib/content";
import { fetchContentByTmdbId } from "@/lib/content";
import { createFavorite } from "@/lib/interaction";
import type { TmdbContent, ContentType } from "@/lib/types";

const MAX = 3;

export default function OnboardingPage() {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);

  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<ContentType | "ALL">("ALL");
  const [results, setResults] = useState<TmdbContent[]>([]);
  const [selected, setSelected] = useState<TmdbContent[]>([]);
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!accessToken) router.push("/login?next=/onboarding");
  }, [accessToken, router]);

  useEffect(() => {
    fetchTrending().then(setResults);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      fetchTrending().then(setResults);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const types: ContentType[] = typeFilter === "ALL" ? ["MOVIE", "TV"] : [typeFilter];
        const all = await Promise.all(types.map((t) => searchContent(query, t)));
        setResults(all.flat().filter((c) => c.posterUrl));
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query, typeFilter]);

  const toggle = (item: TmdbContent) => {
    setSelected((prev) => {
      const exists = prev.find((s) => s.tmdbId === item.tmdbId);
      if (exists) return prev.filter((s) => s.tmdbId !== item.tmdbId);
      if (prev.length >= MAX) return prev;
      return [...prev, item];
    });
  };

  const handleSubmit = async () => {
    if (selected.length < MAX || submitting) return;
    setSubmitting(true);
    try {
      await Promise.all(
        selected.map(async (item) => {
          const content = await fetchContentByTmdbId(item.tmdbId, item.type);
          await createFavorite(content.id);
        })
      );
      router.push("/");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-white/10 px-4 md:px-12 py-5">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-black mb-1">관심 있는 콘텐츠를 3개 골라주세요.</h1>
          <p className="text-sm text-white/50">
            {selected.length < MAX
              ? `${MAX - selected.length}개 더 선택해주세요`
              : "선택 완료! 아래 버튼을 눌러 시작하세요"}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-12 py-6">
        {/* 검색 + 필터 */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="콘텐츠 검색..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-md bg-transparent border border-white/15 pl-9 pr-4 py-2.5 text-sm outline-none placeholder:text-white/30 focus:border-white/30 transition"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as ContentType | "ALL")}
            className="rounded-md bg-transparent border border-white/15 px-3 py-2.5 text-sm outline-none text-white/80 focus:border-white/30 transition"
          >
            <option value="ALL">전체</option>
            <option value="MOVIE">영화</option>
            <option value="TV">시리즈</option>
          </select>
        </div>

        {/* 선택된 항목 */}
        {selected.length > 0 && (
          <div className="flex gap-3 mb-5 flex-wrap">
            {selected.map((item) => (
              <button
                key={item.tmdbId}
                onClick={() => toggle(item)}
                className="flex items-center gap-2 rounded-full border border-accent/50 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent"
              >
                <Check size={12} />
                {item.title}
              </button>
            ))}
          </div>
        )}

        {/* 결과 그리드 */}
        {searching ? (
          <div className="flex justify-center py-16">
            <Loader2 size={28} className="animate-spin text-white/30" />
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {results.map((item) => {
              const isSelected = !!selected.find((s) => s.tmdbId === item.tmdbId);
              const isDisabled = !isSelected && selected.length >= MAX;
              return (
                <button
                  key={item.tmdbId}
                  onClick={() => toggle(item)}
                  disabled={isDisabled}
                  className={`relative rounded-lg overflow-hidden aspect-[2/3] transition-all duration-150 ${
                    isDisabled ? "opacity-30 cursor-not-allowed" : "hover:scale-105"
                  } ${isSelected ? "ring-2 ring-accent ring-offset-2 ring-offset-background" : ""}`}
                >
                  <img
                    src={item.posterUrl}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                      <div className="rounded-full bg-accent p-1.5">
                        <Check size={16} className="text-black" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 pb-2 pt-4">
                    <p className="text-xs font-semibold leading-tight line-clamp-2">{item.title}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 inset-x-0 bg-background/95 backdrop-blur border-t border-white/10 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="flex gap-1.5">
            {Array.from({ length: MAX }).map((_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i < selected.length ? "bg-accent" : "bg-white/20"
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleSubmit}
            disabled={selected.length < MAX || submitting}
            className="flex items-center gap-2 rounded-lg bg-accent px-8 py-2.5 text-sm font-semibold transition hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting && <Loader2 size={15} className="animate-spin" />}
            시작하기
          </button>
        </div>
      </div>
    </main>
  );
}
