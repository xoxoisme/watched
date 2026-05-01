"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FolderOpen } from "lucide-react";
import Header from "@/components/Header";
import { getPublicCollections } from "@/lib/collection";
import { TMDB_IMAGE, type Collection } from "@/lib/types";

type Period = "today" | "month" | "year" | "all";

const PERIODS: { label: string; value: Period }[] = [
  { label: "오늘", value: "today" },
  { label: "이달", value: "month" },
  { label: "올해", value: "year" },
  { label: "전체", value: "all" },
];

export default function ExploreCollectionsPage() {
  const [period, setPeriod] = useState<Period>("all");
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPublicCollections(period)
      .then(setCollections)
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <main className="min-h-screen">
      <Header />
      <div className="px-4 md:px-12 pt-24 pb-16">
        <h1 className="text-2xl font-bold mb-1">컬렉션</h1>
        <p className="text-sm text-white/40 mb-6">다른 사람들의 공개된 컬렉션을 조회 순으로 탐색해보세요</p>

        <div className="flex gap-2 mb-8">
          {PERIODS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setPeriod(value)}
              className={`rounded px-4 py-1.5 text-sm font-medium transition ${
                period === value
                  ? "bg-accent text-black"
                  : "bg-white/10 hover:bg-white/20"
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
                  <p className="font-semibold text-sm truncate group-hover:text-accent transition">{c.name}</p>
                  <p className="text-xs text-white/50 mt-0.5">{c.ownerNickname}</p>
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
      </div>
    </main>
  );
}
