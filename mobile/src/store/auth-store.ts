// src/store/auth-store.ts
import { secureStorage } from "@/utils/storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  securityPin: string | null; // PIN is stored securely here
  isLoggedIn: boolean;
  setToken: (token: string | null) => void;
  setSecurityPin: (pin: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      securityPin: null,
      isLoggedIn: false,
      setToken: (token) => set({ token, isLoggedIn: !!token }),
      setSecurityPin: (pin) => set({ securityPin: pin }),
      logout: () => set({ token: null, securityPin: null, isLoggedIn: false }),
    }),
    {
      name: "auth-secure-storage",
      storage: createJSONStorage(() => secureStorage), // Backed by OS Keychain
    },
  ),
);
