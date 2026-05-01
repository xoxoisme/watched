import { api } from "./api";
import type {
  ApiResponse,
  LoginPayload,
  SignupPayload,
  TokenResponse,
  UserProfile
} from "./types";

export async function login(payload: LoginPayload): Promise<TokenResponse> {
  const { data } = await api.post<ApiResponse<TokenResponse>>(
    "/api/users/login",
    payload
  );
  return data.data;
}

export async function signup(payload: SignupPayload): Promise<void> {
  await api.post<ApiResponse<void>>("/api/users/signup", payload);
}

export async function logout(): Promise<void> {
  await api.post<ApiResponse<void>>("/api/users/logout");
}

export async function fetchMyProfile(): Promise<UserProfile> {
  const { data } = await api.get<ApiResponse<UserProfile>>("/api/users/me");
  return data.data;
}

export async function updateProfile(payload: { nickname: string; profileImageUrl: string | null }): Promise<UserProfile> {
  const { data } = await api.put<ApiResponse<UserProfile>>("/api/users/me", payload);
  return data.data;
}
