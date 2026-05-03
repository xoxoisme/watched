"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import { getMyReviews, updateReview, deleteReview } from "@/lib/interaction";
import type { ReviewRecord } from "@/lib/types";
import { useAuthStore } from "@/stores/authStore";

export default function MyReviewsPage() {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!accessToken) { router.push("/login"); return; }
    getMyReviews().then(setReviews).finally(() => setLoading(false));
  }, [accessToken, router]);

  const startEdit = (r: ReviewRecord) => {
    setEditingId(r.id);
    setEditText(r.reviewContent);
  };

  const handleUpdate = async (reviewId: number) => {
    if (!editText.trim()) return;
    setSubmitting(true);
    try {
      const updated = await updateReview(reviewId, editText.trim());
      setReviews((prev) => prev.map((r) => (r.id === reviewId ? updated : r)));
      setEditingId(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: number) => {
    setSubmitting(true);
    try {
      await deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto w-full max-w-2xl pt-28 pb-16 px-4">
        <h1 className="mb-6 text-2xl font-black text-center">내 리뷰</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-white/40" />
          </div>
        ) : reviews.length === 0 ? (
          <p className="py-20 text-center text-sm text-white/40">
            작성한 리뷰가 없습니다.
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-lg bg-white/5 px-5 py-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <Link
                    href={`/contents/c/${r.contentId}`}
                    className="text-sm font-semibold text-accent hover:underline"
                  >
                    {r.contentTitle}
                  </Link>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-xs text-white/40">{r.updatedAt.slice(0, 10)}</span>
                    <button
                      onClick={() => startEdit(r)}
                      disabled={submitting}
                      className="text-white/40 hover:text-white disabled:opacity-40"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      disabled={submitting}
                      className="text-white/40 hover:text-red-400 disabled:opacity-40"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {editingId === r.id ? (
                  <>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={3}
                      maxLength={1000}
                      className="w-full rounded bg-white/10 px-3 py-2 text-sm outline-none resize-none"
                    />
                    <div className="mt-2 flex justify-end gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs text-white/50 hover:text-white"
                      >
                        취소
                      </button>
                      <button
                        onClick={() => handleUpdate(r.id)}
                        disabled={!editText.trim() || submitting}
                        className="flex items-center gap-1 rounded bg-accent px-3 py-1 text-xs font-semibold disabled:opacity-50"
                      >
                        {submitting && <Loader2 size={11} className="animate-spin" />}
                        수정
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                    {r.reviewContent}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
