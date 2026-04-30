"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Globe, Lock, Loader2, Plus, X } from "lucide-react";
import Header from "@/components/Header";
import { getMyCollections, createCollection } from "@/lib/collection";
import { TMDB_IMAGE, type Collection } from "@/lib/types";
import { useAuthStore } from "@/stores/authStore";

export default function MyCollectionsPage() {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!accessToken) { router.push("/login"); return; }
    getMyCollections().then(setCollections).finally(() => setLoading(false));
  }, [accessToken, router]);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const created = await createCollection(name.trim(), description.trim(), isPublic);
      setCollections((prev) => [created, ...prev]);
      setName("");
      setDescription("");
      setIsPublic(false);
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="px-4 pt-28 pb-16 md:px-12 max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-black">내 컬렉션</h1>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-1.5 rounded bg-accent px-4 py-2 text-sm font-semibold transition hover:bg-accent/90"
          >
            {showForm ? <X size={15} /> : <Plus size={15} />}
            {showForm ? "취소" : "새 컬렉션"}
          </button>
        </div>

        {showForm && (
          <div className="mb-6 rounded-lg bg-white/5 p-5 space-y-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="컬렉션 이름"
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
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="accent-accent"
                />
                공개 컬렉션
              </label>
              <button
                onClick={handleCreate}
                disabled={!name.trim() || submitting}
                className="flex items-center gap-1.5 rounded bg-accent px-4 py-1.5 text-sm font-semibold disabled:opacity-50"
              >
                {submitting && <Loader2 size={13} className="animate-spin" />}
                생성
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
                {/* Preview: up to 4 posters */}
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
