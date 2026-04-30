export type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export type TokenResponse = {
  accessToken: string;
};

export type UserProfile = {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  birthDate: string;
};

export type SignupPayload = {
  email: string;
  password: string;
  nickname: string;
  birthDate: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

// ── Content ──────────────────────────────────────
export type ContentType = "MOVIE" | "TV";

export type TmdbContent = {
  tmdbId: number;
  title: string;
  originalTitle: string;
  posterUrl: string;
  releaseDate: string | null;
  overview: string;
  voteAverage: number;
  type: ContentType;
};

export type Content = {
  id: number;
  tmdbId: number;
  title: string;
  originalTitle: string;
  posterPath: string;
  releaseDate: string | null;
  overview: string;
  voteAverage: number;
  type: ContentType;
};

export const TMDB_IMAGE = (path: string, size: "w500" | "original" = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : "";

// ── Watch ─────────────────────────────────────────
export type WatchStatus = "WATCHING" | "COMPLETED" | "PLAN_TO_WATCH" | "DROPPED";

export const WATCH_LABELS: Record<WatchStatus, string> = {
  WATCHING: "시청 중",
  COMPLETED: "완료",
  PLAN_TO_WATCH: "볼 예정",
  DROPPED: "하차",
};

export type WatchRecord = {
  id: number;
  contentId: number;
  contentTitle: string;
  posterPath: string;
  status: WatchStatus;
  watchedAt: string | null;
};

// ── Rating ────────────────────────────────────────
export type RatingRecord = {
  id: number;
  contentId: number;
  contentTitle: string;
  userId: number;
  score: number;
};

export type RatingAverage = {
  contentId: number;
  averageScore: number | null;
};

// ── Favorite ──────────────────────────────────────
export type FavoriteRecord = {
  id: number;
  contentId: number;
  contentTitle: string;
  posterPath: string;
};

// ── Collection ────────────────────────────────────
export type CollectionItem = {
  id: number;
  contentId: number;
  contentTitle: string;
  posterPath: string;
};

export type Collection = {
  id: number;
  userId: number;
  name: string;
  description: string;
  isPublic: boolean;
  items: CollectionItem[];
};

// ── Review ────────────────────────────────────────
export type ReviewRecord = {
  id: number;
  contentId: number;
  contentTitle: string;
  userId: number;
  userNickname: string;
  reviewContent: string;
  createdAt: string;
  updatedAt: string;
};
