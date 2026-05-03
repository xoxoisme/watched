"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FolderOpen, KeyRound } from "lucide-react";
import Header from "@/components/Header";
import { getPublicCollections } from "@/lib/collection";
import { TMDB_IMAGE, type Collection } from "@/lib/types";
import { useAuthStore } from "@/stores/authStore";

type Period = "today" | "month" | "year" | "all";

const PERIODS: { label: string; value: Period }[] = [
  { label: "오늘", value: "today" },
  { label: "이달", value: "month" },
  { label: "올해", value: "year" },
  { label: "전체", value: "all" },
];

export default function ExploreCollectionsPage() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const isAuthed = !!accessToken;

  const [period, setPeriod] = useState<Period>("all");
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthed) return;
    setLoading(true);
    getPublicCollections(period)
      .then(setCollections)
      .finally(() => setLoading(false));
  }, [period, isAuthed]);

  return (
    <main className="min-h-screen">
      <Header />
      <div className="px-4 md:px-12 pt-24 pb-16">
        <h1 className="text-2xl font-bold mb-1">컬렉션</h1>
        <p className="text-sm text-white/40 mb-6">다른 사람들의 공개된 컬렉션을 조회 순으로 탐색해보세요</p>

        {!isAuthed ? (
          <div className="rounded-xl border border-white/10 bg-transparent px-6 py-16 text-center backdrop-blur-sm">
            <FolderOpen size={40} className="mx-auto mb-4 text-white/20" />
            <p className="text-sm text-white/60 mb-1">회원가입 후 왓치드 회원들의 컬렉션을 구경해보세요!</p>
            <p className="text-sm text-white/40 mb-6">다양한 취향의 컬렉션이 기다리고 있어요.</p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded border border-white/20 bg-transparent px-5 py-2 text-sm font-semibold transition hover:bg-white/10"
            >
              <KeyRound size={15} />
              회원가입
            </Link>
          </div>
        ) : (
          <>
            <div className="inline-flex rounded-lg bg-white/10 p-1 mb-8">
              {PERIODS.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setPeriod(value)}
                  className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
                    period === value
                      ? "bg-white text-black shadow"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-[3/2] rounded-xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : collections.length === 0 ? (
              <div className="py-20 text-center">
                <FolderOpen size={40} className="mx-auto mb-3 text-white/20" />
                <p className="text-sm text-white/40">공개 컬렉션이 없습니다</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {collections.map((c) => (
                  <Link
                    key={c.id}
                    href={`/collections/${c.id}`}
                    className="group rounded-xl border border-white/10 bg-surface hover:border-white/30 transition overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-0.5 aspect-[4/3] bg-white/5 overflow-hidden">
                      {c.items.slice(0, 4).map((item) => (
                        <img
                          key={item.id}
                          src={TMDB_IMAGE(item.posterPath, "w500")}
                          alt={item.contentTitle}
                          className="w-full h-full object-cover"
                        />
                      ))}
                      {c.items.length === 0 && (
                        <div className="col-span-2 row-span-2 flex items-center justify-center text-white/20">
                          <FolderOpen size={32} />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="flex items-start justify-between gap-2 mb-0.5">
                        <p className="font-semibold text-sm truncate group-hover:text-accent transition">{c.name}</p>
                        <p className="text-xs text-white/50 shrink-0">{c.ownerNickname}</p>
                      </div>
                      {c.description && (
                        <p className="text-xs text-white/40 mt-1 line-clamp-2">{c.description}</p>
                      )}
                      <div className="mt-2 text-xs text-white/40">
                        조회 수 {c.viewCount.toLocaleString()}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
