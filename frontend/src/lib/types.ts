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
