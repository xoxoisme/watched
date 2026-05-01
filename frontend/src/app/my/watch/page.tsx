"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import { getMyWatches, updateWatch, deleteWatch } from "@/lib/interaction";
import { TMDB_IMAGE, WATCH_LABELS, type WatchRecord, type WatchStatus } from "@/lib/types";
import { useAuthStore } from "@/stores/authStore";

const TABS: { label: string; value: WatchStatus | "ALL" }[] = [
  { label: "전체", value: "ALL" },
  { label: "시청 중", value: "WATCHING" },
  { label: "완료", value: "COMPLETED" },
  { label: "볼 예정", value: "PLAN_TO_WATCH" },
];

export default function MyWatchPage() {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const [watches, setWatches] = useState<WatchRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<WatchStatus | "ALL">("ALL");
  const [actionId, setActionId] = useState<number | null>(null);

  useEffect(() => {
    if (!accessToken) { router.push("/login"); return; }
    getMyWatches().then(setWatches).finally(() => setLoading(false));
  }, [accessToken, router]);

  const handleDelete = async (w: WatchRecord) => {
    setActionId(w.id);
    try {
      await deleteWatch(w.id);
      setWatches((prev) => prev.filter((x) => x.id !== w.id));
    } finally {
      setActionId(null);
    }
  };

  const handleStatus = async (w: WatchRecord, status: WatchStatus) => {
    setActionId(w.id);
    try {
      const updated = await updateWatch(w.id, status);
      setWatches((prev) => prev.map((x) => (x.id === w.id ? updated : x)));
    } finally {
      setActionId(null);
    }
  };

  const filtered = activeTab === "ALL" ? watches : watches.filter((w) => w.status === activeTab);

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="px-4 pt-28 pb-16 md:px-12">
        <h1 className="mb-6 text-center text-2xl font-black">내 시청 기록</h1>

        <div className="mb-6 flex justify-center gap-1 border-b border-white/10">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setActiveTab(t.value)}
              className={`px-4 py-2 text-sm transition ${
                activeTab === t.value
                  ? "border-b-2 border-accent font-semibold text-white"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {t.label}
              {t.value !== "ALL" && (
                <span className="ml-1.5 text-xs text-white/40">
                  ({watches.filter((w) => w.status === t.value).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-white/40" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-20 text-center text-sm text-white/40">
            {activeTab === "ALL" ? "아직 시청 기록이 없습니다." : "해당 상태의 기록이 없습니다."}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {filtered.map((w) => (
              <div key={w.id} className="group relative">
                <Link href={`/contents/c/${w.contentId}`}>
                  <div className="overflow-hidden rounded-md bg-white/5 aspect-[2/3]">
                    {w.posterPath ? (
                      <img
                        src={TMDB_IMAGE(w.posterPath, "w500")}
                        alt={w.contentTitle}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-white/20 text-xs text-center p-2">
                        {w.contentTitle}
                      </div>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs text-white/80 line-clamp-1">{w.contentTitle}</p>
                </Link>

                <div className="mt-1 flex items-center justify-between gap-1">
                  <select
                    value={w.status}
                    disabled={actionId === w.id}
                    onChange={(e) => handleStatus(w, e.target.value as WatchStatus)}
                    className="flex-1 rounded bg-white/10 px-1.5 py-0.5 text-xs text-white/80 outline-none disabled:opacity-50"
                  >
                    {(Object.keys(WATCH_LABELS) as WatchStatus[]).map((s) => (
                      <option key={s} value={s} className="bg-zinc-900">
                        {WATCH_LABELS[s]}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleDelete(w)}
                    disabled={actionId === w.id}
                    className="rounded p-1 text-white/30 hover:text-red-400 disabled:opacity-40"
                  >
                    {actionId === w.id ? (
                      <Loader2 size={11} className="animate-spin" />
                    ) : (
                      <Trash2 size={11} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
