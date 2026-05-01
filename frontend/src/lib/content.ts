import { api } from "./api";
import type { ApiResponse, Content, ContentType, TmdbContent } from "./types";

export async function searchContent(
  query: string,
  type: ContentType,
  page = 1
): Promise<TmdbContent[]> {
  const { data } = await api.get<ApiResponse<TmdbContent[]>>("/api/contents/search", {
    params: { query, type, page }
  });
  return data.data;
}

export async function fetchContentByTmdbId(
  tmdbId: number,
  type: ContentType
): Promise<Content> {
  const { data } = await api.get<ApiResponse<Content>>(
    `/api/contents/tmdb/${tmdbId}`,
    { params: { type } }
  );
  return data.data;
}

export async function fetchContentById(id: number): Promise<Content> {
  const { data } = await api.get<ApiResponse<Content>>(`/api/contents/${id}`);
  return data.data;
}

export async function fetchTrending(): Promise<TmdbContent[]> {
  const { data } = await api.get<ApiResponse<TmdbContent[]>>("/api/contents/trending");
  return data.data;
}

export async function fetchRecommendations(): Promise<TmdbContent[]> {
  const { data } = await api.get<ApiResponse<TmdbContent[]>>("/api/contents/recommendations");
  return data.data;
}

export async function fetchTopMovies(): Promise<TmdbContent[]> {
  const { data } = await api.get<ApiResponse<TmdbContent[]>>("/api/contents/top/movies");
  return data.data;
}

export async function fetchTopTv(): Promise<TmdbContent[]> {
  const { data } = await api.get<ApiResponse<TmdbContent[]>>("/api/contents/top/tv");
  return data.data;
}
