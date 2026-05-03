"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Globe, Lock, Loader2, Plus, Search, X } from "lucide-react";
import Header from "@/components/Header";
import { getMyCollections, createCollection, addItemToCollection } from "@/lib/collection";
import { searchContent, fetchContentByTmdbId } from "@/lib/content";
import { TMDB_IMAGE, type Collection, type TmdbContent, type ContentType } from "@/lib/types";
import { useAuthStore } from "@/stores/authStore";

export default function MyCollectionsPage() {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  // 생성 폼
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 콘텐츠 검색 (생성 폼 내)
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<ContentType>("MOVIE");
  const [searchResults, setSearchResults] = useState<TmdbContent[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<TmdbContent[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!accessToken) { router.push("/login"); return; }
    getMyCollections().then(setCollections).finally(() => setLoading(false));
  }, [accessToken, router]);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        setSearchResults(await searchContent(searchQuery, searchType));
      } finally {
        setSearching(false);
      }
    }, 500);
  }, [searchQuery, searchType]);

  const toggleSelect = (item: TmdbContent) => {
    setSelected((prev) =>
      prev.some((s) => s.tmdbId === item.tmdbId)
        ? prev.filter((s) => s.tmdbId !== item.tmdbId)
        : [...prev, item]
    );
  };

  const closeForm = () => {
    setShowForm(false);
    setName("");
    setDescription("");
    setIsPublic(false);
    setSearchQuery("");
    setSearchResults([]);
    setSelected([]);
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const created = await createCollection(name.trim(), description.trim(), isPublic);

      // 선택한 콘텐츠를 순서대로 추가
      for (const item of selected) {
        const content = await fetchContentByTmdbId(item.tmdbId, item.type);
        await addItemToCollection(created.id, content.id);
      }

      // 아이템이 있으면 상세 페이지로, 없으면 목록 갱신
      if (selected.length > 0) {
        router.push(`/collections/${created.id}`);
      } else {
        setCollections((prev) => [created, ...prev]);
        closeForm();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="px-4 pt-28 pb-16 md:px-12 max-w-7xl mx-auto">
        <h1 className="text-center text-2xl font-black">내 컬렉션</h1>
        <div className="mb-6 flex items-center justify-end">
          <button
            onClick={() => (showForm ? closeForm() : setShowForm(true))}
            className="flex items-center gap-1.5 rounded-md bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20 text-white"
          >
            {showForm ? <X size={15} /> : <Plus size={15} />}
            {showForm ? "취소" : "새 컬렉션"}
          </button>
        </div>

        {showForm && (
          <div className="mb-8 rounded-lg bg-white/5 p-5 space-y-4">
            {/* 기본 정보 */}
            <div className="space-y-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="컬렉션 이름 *"
                maxLength={100}
                className="w-full rounded bg-white/10 px-3 py-2 text-sm outline-none placeholder:text-white/40 focus:ring-1 focus:ring-white/30"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="설명 (선택)"
                maxLength={1000}
                rows={2}
                className="w-full rounded bg-white/10 px-3 py-2 text-sm outline-none placeholder:text-white/40 focus:ring-1 focus:ring-white/30 resize-none"
              />
              <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="accent-accent"
                />
                공개 컬렉션
              </label>
            </div>

            {/* 구분선 */}
            <div className="border-t border-white/10" />

            {/* 콘텐츠 검색 */}
            <div>
              <p className="mb-2 text-xs font-semibold text-white/50 uppercase tracking-wide">콘텐츠 추가 (선택)</p>
              <div className="flex gap-2 mb-3">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="제목으로 검색..."
                    className="w-full rounded bg-white/10 pl-8 pr-3 py-2 text-sm outline-none placeholder:text-white/40 focus:ring-1 focus:ring-white/30"
                  />
                </div>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value as ContentType)}
                  className="rounded bg-white/10 px-3 py-2 text-sm outline-none"
                >
                  <option value="MOVIE" className="bg-black">영화</option>
                  <option value="TV" className="bg-black">시리즈</option>
                </select>
              </div>

              {searching && (
                <div className="flex justify-center py-3">
                  <Loader2 size={18} className="animate-spin text-white/40" />
                </div>
              )}

              {!searching && searchResults.length > 0 && (
                <div className="space-y-1.5 max-h-56 overflow-y-auto rounded bg-white/5 p-2">
                  {searchResults.map((r) => {
                    const isSelected = selected.some((s) => s.tmdbId === r.tmdbId);
                    return (
                      <button
                        key={r.tmdbId}
                        onClick={() => toggleSelect(r)}
                        className={`flex w-full items-center gap-3 rounded px-3 py-2 text-left transition ${
                          isSelected ? "bg-accent/20 ring-1 ring-accent/50" : "hover:bg-white/10"
                        }`}
                      >
                        {r.posterUrl && (
                          <img src={r.posterUrl} alt={r.title} className="h-10 w-7 shrink-0 rounded object-cover" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{r.title}</p>
                          <p className="text-xs text-white/40">{r.releaseDate?.slice(0, 4)}</p>
                        </div>
                        <span className={`shrink-0 text-xs font-semibold ${isSelected ? "text-accent" : "text-white/30"}`}>
                          {isSelected ? "✓ 선택됨" : "+ 선택"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 선택된 콘텐츠 미리보기 */}
            {selected.length > 0 && (
              <div>
                <p className="mb-2 text-xs text-white/50">선택된 콘텐츠 {selected.length}개</p>
                <div className="flex flex-wrap gap-2">
                  {selected.map((s) => (
                    <div key={s.tmdbId} className="flex items-center gap-1.5 rounded bg-white/10 pl-1.5 pr-2 py-1">
                      {s.posterUrl && (
                        <img src={s.posterUrl} alt={s.title} className="h-6 w-4 rounded object-cover" />
                      )}
                      <span className="text-xs">{s.title}</span>
                      <button onClick={() => toggleSelect(s)} className="text-white/40 hover:text-white">
                        <X size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 생성 버튼 */}
            <div className="flex justify-end">
              <button
                onClick={handleCreate}
                disabled={!name.trim() || submitting}
                className="flex items-center gap-1.5 rounded bg-accent px-5 py-2 text-sm font-semibold disabled:opacity-50"
              >
                {submitting && <Loader2 size={13} className="animate-spin" />}
                {submitting
                  ? `생성 중... (${selected.length}개 추가)`
                  : selected.length > 0
                  ? `컬렉션 생성 + ${selected.length}개 추가`
                  : "컬렉션 생성"}
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-white/40" />
          </div>
        ) : collections.length === 0 ? (
          <p className="py-20 text-center text-sm text-white/40">
            아직 컬렉션이 없습니다. 새 컬렉션을 만들어보세요!
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((c) => (
              <Link
                key={c.id}
                href={`/collections/${c.id}`}
                className="group rounded-lg bg-white/5 p-4 transition hover:bg-white/10"
              >
                <div className="mb-3 grid grid-cols-4 gap-1 h-24 overflow-hidden rounded">
                  {c.items.slice(0, 4).map((item) => (
                    <div key={item.id} className="overflow-hidden rounded bg-white/10">
                      {item.posterPath ? (
                        <img
                          src={TMDB_IMAGE(item.posterPath, "w500")}
                          alt={item.contentTitle}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full bg-white/5" />
                      )}
                    </div>
                  ))}
                  {Array.from({ length: Math.max(0, 4 - c.items.length) }).map((_, i) => (
                    <div key={`empty-${i}`} className="rounded bg-white/5" />
                  ))}
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{c.name}</p>
                    {c.description && (
                      <p className="mt-0.5 text-xs text-white/50 line-clamp-2">{c.description}</p>
                    )}
                    <p className="mt-1 text-xs text-white/40">{c.items.length}개의 콘텐츠</p>
                  </div>
                  <span className="shrink-0 text-white/30">
                    {c.isPublic ? <Globe size={14} /> : <Lock size={14} />}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
