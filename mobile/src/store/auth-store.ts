// src/store/auth-store.ts
import { secureStorage } from "@/utils/storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface User {
  role: "admin" | "student";
}

interface AuthState {
  user: User | null;
  token: string | null; // Token is stored securely here
  securityPin: string | null; // PIN is stored securely here
  isLoggedIn: boolean;
  setAuth: (token: string | null, user: User | null) => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setSecurityPin: (pin: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      securityPin: null,
      isLoggedIn: false,
      setAuth: (token, user) => set({ token, user, isLoggedIn: !!token && !!user }),
      setUser: (user) => set((state) => ({ user, isLoggedIn: !!user && !!state.token })),
      setToken: (token) => set((state) => ({ token, isLoggedIn: !!state.user && !!token })),
      setSecurityPin: (pin) => set({ securityPin: pin }),
      logout: () =>
        set({ user: null, token: null, securityPin: null, isLoggedIn: false }),
    }),
    {
      name: "auth-secure-storage",
      storage: createJSONStorage(() => secureStorage), // Backed by OS Keychain
    },
  ),
);
