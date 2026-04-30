import { api } from "./api";
import type {
  ApiResponse,
  FavoriteRecord,
  RatingAverage,
  RatingRecord,
  ReviewRecord,
  WatchRecord,
  WatchStatus
} from "./types";

// ── Watch ─────────────────────────────────────────
export async function createWatch(contentId: number, status: WatchStatus, watchedAt?: string): Promise<WatchRecord> {
  const { data } = await api.post<ApiResponse<WatchRecord>>("/api/watch", {
    contentId,
    status,
    watchedAt: watchedAt ?? null
  });
  return data.data;
}

export async function getMyWatches(): Promise<WatchRecord[]> {
  const { data } = await api.get<ApiResponse<WatchRecord[]>>("/api/watch/me");
  return data.data;
}

export async function updateWatch(watchId: number, status: WatchStatus, watchedAt?: string): Promise<WatchRecord> {
  const { data } = await api.put<ApiResponse<WatchRecord>>(`/api/watch/${watchId}`, {
    status,
    watchedAt: watchedAt ?? null
  });
  return data.data;
}

export async function deleteWatch(watchId: number): Promise<void> {
  await api.delete(`/api/watch/${watchId}`);
}

// ── Rating ────────────────────────────────────────
export async function createRating(contentId: number, score: number): Promise<RatingRecord> {
  const { data } = await api.post<ApiResponse<RatingRecord>>("/api/ratings", {
    contentId,
    score
  });
  return data.data;
}

export async function getAverageRating(contentId: number): Promise<RatingAverage> {
  const { data } = await api.get<ApiResponse<RatingAverage>>(
    `/api/ratings/contents/${contentId}`
  );
  return data.data;
}

export async function updateRating(ratingId: number, score: number): Promise<RatingRecord> {
  const { data } = await api.put<ApiResponse<RatingRecord>>(`/api/ratings/${ratingId}`, {
    score
  });
  return data.data;
}

export async function deleteRating(ratingId: number): Promise<void> {
  await api.delete(`/api/ratings/${ratingId}`);
}

// ── Favorite ──────────────────────────────────────
export async function createFavorite(contentId: number): Promise<FavoriteRecord> {
  const { data } = await api.post<ApiResponse<FavoriteRecord>>("/api/favorites", {
    contentId
  });
  return data.data;
}

export async function getMyFavorites(): Promise<FavoriteRecord[]> {
  const { data } = await api.get<ApiResponse<FavoriteRecord[]>>("/api/favorites/me");
  return data.data;
}

export async function deleteFavorite(favoriteId: number): Promise<void> {
  await api.delete(`/api/favorites/${favoriteId}`);
}

// ── Review ────────────────────────────────────────
export async function createReview(contentId: number, reviewContent: string): Promise<ReviewRecord> {
  const { data } = await api.post<ApiResponse<ReviewRecord>>("/api/reviews", {
    contentId,
    reviewContent
  });
  return data.data;
}

export async function getReviewsByContent(contentId: number): Promise<ReviewRecord[]> {
  const { data } = await api.get<ApiResponse<ReviewRecord[]>>(
    `/api/reviews/contents/${contentId}`
  );
  return data.data;
}

export async function getMyReviews(): Promise<ReviewRecord[]> {
  const { data } = await api.get<ApiResponse<ReviewRecord[]>>("/api/reviews/me");
  return data.data;
}

export async function updateReview(reviewId: number, reviewContent: string): Promise<ReviewRecord> {
  const { data } = await api.put<ApiResponse<ReviewRecord>>(`/api/reviews/${reviewId}`, {
    reviewContent
  });
  return data.data;
}

export async function deleteReview(reviewId: number): Promise<void> {
  await api.delete(`/api/reviews/${reviewId}`);
}
