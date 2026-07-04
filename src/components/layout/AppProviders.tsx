// Global client providers wrapper injecting state management modals and scroll navigation shells.
"use client";

import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "./Navbar";
import AuthModal from "../auth/AuthModal";
import DetailsModal from "../media/DetailsModal";
import { useAuthStore } from "@/lib/store";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const { setUser } = useAuthStore();

  useEffect(() => {
    // Verify user login status immediately on client startup
    async function loadSession() {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Failed to load user session", err);
      }
    }
    loadSession();
  }, [setUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-[#060608] text-zinc-100 flex flex-col relative select-none">
        {/* Floating navbar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 w-full flex flex-col pt-0">
          {children}
        </main>

        {/* Global Modal dialogs */}
        <AuthModal />
        <DetailsModal />
      </div>
    </QueryClientProvider>
  );
}
