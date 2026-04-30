"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import { searchContent } from "@/lib/content";
import type { ContentType, TmdbContent } from "@/lib/types";

const TABS: { label: string; value: ContentType }[] = [
  { label: "영화", value: "MOVIE" },
  { label: "TV 시리즈", value: "TV" }
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<ContentType>("MOVIE");
  const [results, setResults] = useState<TmdbContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchContent(query.trim(), type);
        setResults(data);
        setSearched(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, type]);

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 px-4 md:px-12">
        {/* Search input */}
        <div className="relative max-w-2xl mx-auto mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
          <input
            type="text"
            placeholder="제목을 입력하세요..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full rounded-lg bg-white/10 pl-12 pr-4 py-4 text-lg outline-none ring-1 ring-transparent transition placeholder:text-white/40 focus:bg-white/15 focus:ring-white/30"
          />
          {loading && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-white/60" size={20} />
          )}
        </div>

        {/* Type tabs */}
        <div className="flex gap-2 mb-8 max-w-2xl mx-auto">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setType(tab.value)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                type === tab.value
                  ? "bg-accent text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results */}
        {searched && results.length === 0 && !loading && (
          <p className="text-center text-white/50 mt-16">검색 결과가 없습니다.</p>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
            {results.map((item) => (
              <SearchCard key={item.tmdbId} item={item} />
            ))}
          </div>
        )}

        {!searched && !loading && (
          <p className="text-center text-white/30 mt-24 text-sm">
            영화나 TV 시리즈를 검색해보세요
          </p>
        )}
      </div>
    </main>
  );
}

function SearchCard({ item }: { item: TmdbContent }) {
  const year = item.releaseDate?.slice(0, 4) ?? "";
  return (
    <Link
      href={`/contents/${item.tmdbId}?type=${item.type}`}
      className="group block"
    >
      <div className="relative overflow-hidden rounded-md bg-surface aspect-[2/3]">
        {item.posterUrl ? (
          <img
            src={item.posterUrl}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-white/5 text-white/30 text-xs text-center p-2">
            {item.title}
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
          <p className="text-xs font-semibold leading-tight">{item.title}</p>
          {year && <p className="text-[10px] text-white/60 mt-0.5">{year}</p>}
        </div>
      </div>
      <p className="mt-1.5 text-xs text-white/70 truncate">{item.title}</p>
    </Link>
  );
}
