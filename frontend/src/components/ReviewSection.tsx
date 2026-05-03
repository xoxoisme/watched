"use client";

import { useState } from "react";
import { Heart, Loader2, Pencil, Trash2, User } from "lucide-react";
import type { ReviewRecord } from "@/lib/types";
import { createReview, updateReview, deleteReview, toggleReviewLike } from "@/lib/interaction";
import { useAuthStore } from "@/stores/authStore";

type Props = {
  contentId: number;
  reviews: ReviewRecord[];
  onReviewChange: (reviews: ReviewRecord[]) => void;
};

export default function ReviewSection({ contentId, reviews, onReviewChange }: Props) {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const isAuthed = !!accessToken;

  const myReview = reviews.find((r) => r.userId === user?.id);

  const [text, setText] = useState("");
  const [editText, setEditText] = useState("");
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const created = await createReview(contentId, text.trim());
      onReviewChange([created, ...reviews]);
      setText("");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!myReview || !editText.trim()) return;
    setSubmitting(true);
    try {
      const updated = await updateReview(myReview.id, editText.trim());
      onReviewChange(reviews.map((r) => (r.id === myReview.id ? updated : r)));
      setEditing(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: number) => {
    setSubmitting(true);
    try {
      await deleteReview(reviewId);
      onReviewChange(reviews.filter((r) => r.id !== reviewId));
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (reviewId: number) => {
    if (!isAuthed) return;
    const result = await toggleReviewLike(reviewId);
    onReviewChange(
      reviews.map((r) =>
        r.id === reviewId ? { ...r, likeCount: result.likeCount, likedByMe: result.likedByMe } : r
      )
    );
  };

  return (
    <div>
      <h3 className="mb-4 text-lg font-bold">리뷰 ({reviews.length})</h3>

      {isAuthed && !myReview && (
        <div className="mb-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="이 콘텐츠에 대한 리뷰를 남겨보세요..."
            rows={3}
            maxLength={1000}
            className="w-full rounded-md bg-transparent border border-white/15 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/30 resize-none backdrop-blur-sm"
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-white/40">{text.length}/1000</span>
            <button
              onClick={handleCreate}
              disabled={!text.trim() || submitting}
              className="flex items-center gap-1.5 rounded bg-accent px-4 py-1.5 text-sm font-semibold disabled:opacity-50"
            >
              {submitting && <Loader2 size={13} className="animate-spin" />}
              리뷰 작성
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-md border border-white/10 bg-transparent px-4 py-3 backdrop-blur-sm">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {r.userProfileImageUrl ? (
                  <img
                    src={r.userProfileImageUrl}
                    alt={r.userNickname}
                    className="h-7 w-7 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/15">
                    <User size={14} className="text-white/50" />
                  </span>
                )}
                <span className="text-sm font-semibold text-white/90">{r.userNickname}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-white/40">{r.updatedAt.slice(0, 10)}</span>
                {r.userId === user?.id && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditing(true); setEditText(r.reviewContent); }}
                      className="text-white/40 hover:text-white"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      disabled={submitting}
                      className="text-white/40 hover:text-red-400 disabled:opacity-50"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {editing && r.userId === user?.id ? (
              <>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={3}
                  maxLength={1000}
                  className="w-full rounded bg-transparent border border-white/15 px-3 py-2 text-sm text-white outline-none transition focus:border-white/30 resize-none"
                />
                <div className="mt-2 flex gap-2 justify-end">
                  <button onClick={() => setEditing(false)} className="text-xs text-white/50 hover:text-white">
                    취소
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={!editText.trim() || submitting}
                    className="flex items-center gap-1 rounded bg-accent px-3 py-1 text-xs font-semibold disabled:opacity-50"
                  >
                    {submitting && <Loader2 size={11} className="animate-spin" />}
                    수정
                  </button>
                </div>
              </>
            ) : (
              <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap mb-3">
                {r.reviewContent}
              </p>
            )}

            {/* 좋아요 */}
            {r.userId !== user?.id && (
              <button
                onClick={() => handleLike(r.id)}
                disabled={!isAuthed}
                className={`flex items-center gap-1.5 text-xs transition ${
                  r.likedByMe
                    ? "text-red-400"
                    : "text-white/30 hover:text-white/60 disabled:cursor-default"
                }`}
              >
                <Heart size={13} fill={r.likedByMe ? "currentColor" : "none"} />
                <span>{r.likeCount > 0 ? r.likeCount : ""}</span>
              </button>
            )}
            {r.userId === user?.id && r.likeCount > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-white/30 mt-1">
                <Heart size={13} fill="currentColor" className="text-red-400/60" />
                <span>{r.likeCount}</span>
              </div>
            )}
          </div>
        ))}

        {reviews.length === 0 && (
          <p className="text-sm text-white/40 text-center py-6">
            아직 리뷰가 없습니다. 첫 번째 리뷰를 남겨보세요!
          </p>
        )}
      </div>
    </div>
  );
}
