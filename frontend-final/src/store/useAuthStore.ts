// frontend-final/src/store/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  email: string | null;
  setAuth: (auth: {
    isLoggedIn: boolean;
    token: string | null;
    email: string | null;
  }) => void;
  clearAuth: () => void;
  rehydrated: boolean; // <- flag untuk menandai state sudah dimuat dari storage
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      token: null,
      email: null,
      rehydrated: false,
      setAuth: ({ isLoggedIn, token, email }) =>
        set({ isLoggedIn, token, email }),
      clearAuth: () => set({ isLoggedIn: false, token: null, email: null }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state, error) => {
        if (!error && state) {
          setTimeout(() => {
            // tandai state sudah selesai dihydrate
            state.rehydrated = true;
          }, 0);
        }
      },
    }
  )
);
