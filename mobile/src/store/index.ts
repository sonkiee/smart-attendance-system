import Storage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
export type UserRole = "student" | "lecturer";

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setToken: (token: string | null) => void;
  isLoggedIn: boolean;
  login: (id: string, role: UserRole, token: string, name?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      setToken: (token) => set({ token, isLoggedIn: !!token }),
      login: (id, role, token, name = "Kennedy") =>
        set({
          user: { id, name, role },
          token,
          isLoggedIn: true,
        }),
      logout: () => set({ user: null, token: null, isLoggedIn: false }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => Storage),
    },
  ),
);
