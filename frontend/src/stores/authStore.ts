import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile } from "@/lib/types";

type AuthState = {
  accessToken: string | null;
  user: UserProfile | null;
  setToken: (token: string) => void;
  setUser: (user: UserProfile) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      setToken: (accessToken) => set({ accessToken }),
      setUser: (user) => set({ user }),
      clear: () => set({ accessToken: null, user: null })
    }),
    { name: "watched-auth" }
  )
);
