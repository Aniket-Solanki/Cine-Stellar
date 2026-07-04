// Zustand global state management for the active detail modal, search overlay, auth modal, and user session context.
import { create } from "zustand";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string;
  preferredLanguage: string;
  theme: string;
}

interface DetailModalState {
  isOpen: boolean;
  mediaId: string | null;
  mediaType: "movie" | "tv" | null;
  openDetailModal: (id: string, type: "movie" | "tv") => void;
  closeDetailModal: () => void;
}

interface AuthModalState {
  isOpen: boolean;
  view: "login" | "signup";
  openAuthModal: (view?: "login" | "signup") => void;
  closeAuthModal: () => void;
  setAuthView: (view: "login" | "signup") => void;
}

interface AuthState {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  logout: () => void;
}

export const useDetailModalStore = create<DetailModalState>((set) => ({
  isOpen: false,
  mediaId: null,
  mediaType: null,
  openDetailModal: (id, type) => set({ isOpen: true, mediaId: id, mediaType: type }),
  closeDetailModal: () => set({ isOpen: false, mediaId: null, mediaType: null }),
}));

export const useAuthModalStore = create<AuthModalState>((set) => ({
  isOpen: false,
  view: "login",
  openAuthModal: (view = "login") => set({ isOpen: true, view }),
  closeAuthModal: () => set({ isOpen: false }),
  setAuthView: (view) => set({ view }),
}));

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      set({ user: null });
      window.location.reload();
    } catch (e) {
      console.error("Failed to log out", e);
    }
  },
}));
