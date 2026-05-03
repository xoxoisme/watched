import { api } from "./api";
import type { ApiResponse, Collection, CollectionItem, PageResponse } from "./types";

export async function createCollection(
  name: string,
  description: string,
  isPublic: boolean
): Promise<Collection> {
  const { data } = await api.post<ApiResponse<Collection>>("/api/collections", {
    name,
    description,
    isPublic,
  });
  return data.data;
}

export async function getMyCollections(page = 0, size = 12): Promise<PageResponse<Collection>> {
  const { data } = await api.get<ApiResponse<PageResponse<Collection>>>(
    `/api/collections/me?page=${page}&size=${size}`
  );
  return data.data;
}

export async function getCollectionById(id: number): Promise<Collection> {
  const { data } = await api.get<ApiResponse<Collection>>(`/api/collections/${id}`);
  return data.data;
}

export async function updateCollection(
  id: number,
  name: string,
  description: string,
  isPublic: boolean
): Promise<Collection> {
  const { data } = await api.put<ApiResponse<Collection>>(`/api/collections/${id}`, {
    name,
    description,
    isPublic,
  });
  return data.data;
}

export async function deleteCollection(id: number): Promise<void> {
  await api.delete(`/api/collections/${id}`);
}

export async function addItemToCollection(
  collectionId: number,
  contentId: number
): Promise<CollectionItem> {
  const { data } = await api.post<ApiResponse<CollectionItem>>(
    `/api/collections/${collectionId}/items`,
    { contentId }
  );
  return data.data;
}

export async function removeItemFromCollection(
  collectionId: number,
  itemId: number
): Promise<void> {
  await api.delete(`/api/collections/${collectionId}/items/${itemId}`);
}

export async function getPublicCollections(
  period: "today" | "month" | "year" | "all",
  page = 0,
  size = 12
): Promise<PageResponse<Collection>> {
  const { data } = await api.get<ApiResponse<PageResponse<Collection>>>(
    `/api/collections/public?period=${period}&page=${page}&size=${size}`
  );
  return data.data;
}
