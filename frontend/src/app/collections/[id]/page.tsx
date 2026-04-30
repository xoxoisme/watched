"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Globe, Lock, Loader2, Pencil, Trash2, Plus, X, Search } from "lucide-react";
import Header from "@/components/Header";
import {
  getCollectionById,
  updateCollection,
  deleteCollection,
  addItemToCollection,
  removeItemFromCollection,
} from "@/lib/collection";
import { searchContent, fetchContentByTmdbId } from "@/lib/content";
import { TMDB_IMAGE, type Collection, type TmdbContent, type ContentType } from "@/lib/types";
import { useAuthStore } from "@/stores/authStore";

export default function CollectionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);

  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editPublic, setEditPublic] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<ContentType>("MOVIE");
  const [searchResults, setSearchResults] = useState<TmdbContent[]>([]);
  const [searching, setSearching] = useState(false);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [addedTmdbIds, setAddedTmdbIds] = useState<Set<number>>(new Set());
  const [removingId, setRemovingId] = useState<number | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isOwner = !!user && collection?.userId === user.id;

  useEffect(() => {
    if (!accessToken) { router.push("/login"); return; }
    getCollectionById(Number(id))
      .then(setCollection)
      .catch(() => setError("컬렉션을 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, [id, accessToken, router]);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await searchContent(searchQuery, searchType);
        setSearchResults(results);
      } finally {
        setSearching(false);
      }
    }, 500);
  }, [searchQuery, searchType]);

  const startEdit = () => {
    if (!collection) return;
    setEditName(collection.name);
    setEditDesc(collection.description ?? "");
    setEditPublic(collection.isPublic);
    setEditing(true);
  };

  const handleUpdate = async () => {
    if (!collection || !editName.trim()) return;
    setSaving(true);
    try {
      const updated = await updateCollection(collection.id, editName.trim(), editDesc.trim(), editPublic);
      setCollection(updated);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!collection || !confirm(`"${collection.name}" 컬렉션을 삭제할까요?`)) return;
    setSaving(true);
    try {
      await deleteCollection(collection.id);
      router.push("/collections/me");
    } finally {
      setSaving(false);
    }
  };

  const handleAddItem = async (tmdbContent: TmdbContent) => {
    if (!collection) return;
    setAddingId(tmdbContent.tmdbId);
    try {
      const content = await fetchContentByTmdbId(tmdbContent.tmdbId, tmdbContent.type);
      const item = await addItemToCollection(collection.id, content.id);
      setCollection((prev) =>
        prev ? { ...prev, items: [...prev.items, item] } : prev
      );
      setAddedTmdbIds((prev) => new Set(prev).add(tmdbContent.tmdbId));
    } finally {
      setAddingId(null);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    if (!collection) return;
    setRemovingId(itemId);
    try {
      await removeItemFromCollection(collection.id, itemId);
      setCollection((prev) =>
        prev ? { ...prev, items: prev.items.filter((i) => i.id !== itemId) } : prev
      );
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-white/40" />
      </main>
    );
  }

  if (error || !collection) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-white/60">{error ?? "컬렉션을 찾을 수 없습니다."}</p>
      </main>
    );
  }

  const alreadyAdded = (tmdbId: number) => addedTmdbIds.has(tmdbId);

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="px-4 pt-28 pb-16 md:px-12 max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          {editing ? (
            <div className="space-y-3 max-w-lg">
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                maxLength={100}
                className="w-full rounded bg-white/10 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-white/30"
              />
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                maxLength={1000}
                rows={2}
                className="w-full rounded bg-white/10 px-3 py-2 text-sm outline-none resize-none focus:ring-1 focus:ring-white/30"
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editPublic}
                    onChange={(e) => setEditPublic(e.target.checked)}
                    className="accent-accent"
                  />
                  공개 컬렉션
                </label>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(false)} className="text-sm text-white/50 hover:text-white">
                    취소
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={!editName.trim() || saving}
                    className="flex items-center gap-1.5 rounded bg-accent px-4 py-1.5 text-sm font-semibold disabled:opacity-50"
                  >
                    {saving && <Loader2 size={13} className="animate-spin" />}
                    저장
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black">{collection.name}</h1>
                  {collection.isPublic
                    ? <Globe size={16} className="text-white/40" />
                    : <Lock size={16} className="text-white/40" />}
                </div>
                {collection.description && (
                  <p className="text-sm text-white/60 mb-1">{collection.description}</p>
                )}
                <p className="text-xs text-white/40">{collection.items.length}개의 콘텐츠</p>
              </div>
              {isOwner && (
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={startEdit}
                    className="flex items-center gap-1.5 rounded bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20"
                  >
                    <Pencil size={13} /> 수정
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={saving}
                    className="flex items-center gap-1.5 rounded bg-white/10 px-3 py-1.5 text-sm text-red-400 hover:bg-white/20 disabled:opacity-50"
                  >
                    <Trash2 size={13} /> 삭제
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Add content */}
        {isOwner && (
          <div className="mb-6">
            <button
              onClick={() => setShowSearch((v) => !v)}
              className="flex items-center gap-1.5 rounded bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20"
            >
              {showSearch ? <X size={14} /> : <Plus size={14} />}
              {showSearch ? "닫기" : "콘텐츠 추가"}
            </button>

            {showSearch && (
              <div className="mt-3 rounded-lg bg-white/5 p-4">
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
                    <option value="MOVIE" className="bg-zinc-900">영화</option>
                    <option value="TV" className="bg-zinc-900">시리즈</option>
                  </select>
                </div>

                {searching && (
                  <div className="flex justify-center py-4">
                    <Loader2 size={20} className="animate-spin text-white/40" />
                  </div>
                )}

                {!searching && searchResults.length > 0 && (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {searchResults.map((r) => {
                      const inCollection = alreadyAdded(r.tmdbId);
                      return (
                        <div key={r.tmdbId} className="flex items-center gap-3 rounded bg-white/5 px-3 py-2">
                          {r.posterUrl && (
                            <img
                              src={r.posterUrl}
                              alt={r.title}
                              className="h-10 w-7 shrink-0 rounded object-cover"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{r.title}</p>
                            <p className="text-xs text-white/40">{r.releaseDate?.slice(0, 4)}</p>
                          </div>
                          <button
                            onClick={() => handleAddItem(r)}
                            disabled={inCollection || addingId === r.tmdbId}
                            className="shrink-0 rounded bg-accent px-3 py-1 text-xs font-semibold disabled:opacity-40"
                          >
                            {addingId === r.tmdbId ? (
                              <Loader2 size={11} className="animate-spin" />
                            ) : inCollection ? "추가됨" : "추가"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Items grid */}
        {collection.items.length === 0 ? (
          <p className="py-20 text-center text-sm text-white/40">
            아직 콘텐츠가 없습니다.{isOwner && " 위에서 콘텐츠를 추가해보세요!"}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {collection.items.map((item) => (
              <div key={item.id} className="group relative">
                <Link href={`/contents/c/${item.contentId}`}>
                  <div className="overflow-hidden rounded-md bg-white/5 aspect-[2/3]">
                    {item.posterPath ? (
                      <img
                        src={TMDB_IMAGE(item.posterPath, "w500")}
                        alt={item.contentTitle}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-white/20 text-xs text-center p-2">
                        {item.contentTitle}
                      </div>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs text-white/80 line-clamp-1">{item.contentTitle}</p>
                </Link>

                {isOwner && (
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={removingId === item.id}
                    className="mt-1 flex w-full items-center justify-center gap-1 rounded bg-white/5 py-1 text-xs text-white/40 hover:bg-white/10 hover:text-red-400 disabled:opacity-40"
                  >
                    {removingId === item.id ? (
                      <Loader2 size={11} className="animate-spin" />
                    ) : (
                      <><Trash2 size={11} /> 제거</>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
