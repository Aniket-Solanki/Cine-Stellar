// Premium Glassmorphic Credentials Login & Signup Dialog overlay.
"use client";

import React, { useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import Button from "../ui/button";
import { useAuthModalStore, useAuthStore } from "@/lib/store";

export default function AuthModal() {
  const { isOpen, view, closeAuthModal, setAuthView } = useAuthModalStore();
  const { setUser } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const endpoint = view === "login" ? "/api/auth/login" : "/api/auth/signup";
    const body = view === "login" ? { email, password } : { email, password, name };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An error occurred");
      }

      // Successful Auth
      setUser(data.user);
      closeAuthModal();
      
      // Clear inputs
      setEmail("");
      setPassword("");
      setName("");
      
      // Reload page to reflect user details
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Failed to submit request.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    // Standard mock authentication using Google OAuth styling as per plan.txt
    try {
      const emailMock = "google_user@gmail.com";
      const nameMock = "Google User";
      
      // Call signup API which creates/logs in the user
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailMock, password: "mock_google_oauth_pass_2026", name: nameMock }),
      });
      
      let data = await response.json();
      
      // If user exists, log in
      if (!response.ok && response.status === 409) {
        const loginResponse = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailMock, password: "mock_google_oauth_pass_2026" }),
        });
        data = await loginResponse.json();
      }

      setUser(data.user);
      closeAuthModal();
      window.location.reload();
    } catch (err) {
      setError("Google Sign-In simulation failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={closeAuthModal}>
      <DialogContent className="max-w-md bg-zinc-950/95 border border-zinc-800">
        <div className="flex flex-col space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              CINE<span className="text-rose-600">STELLAR</span>
            </h2>
            <p className="text-sm text-zinc-400 mt-2">
              {view === "login"
                ? "Sign in to resume your cinematic journeys"
                : "Create an account to start streaming"}
            </p>
          </div>

          {error && (
            <div className="p-3 text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            {view === "signup" && (
              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
              />
            </div>

            <Button variant="primary" type="submit" isLoading={isLoading} className="w-full py-3 mt-2">
              {view === "login" ? "Sign In" : "Sign Up"}
            </Button>
          </form>

          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-850" />
            </div>
            <span className="relative px-3 bg-zinc-950 text-xs text-zinc-500 uppercase font-semibold">
              Or continue with
            </span>
          </div>

          <Button
            variant="glass"
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-3 py-3 border border-zinc-800 bg-zinc-900/40"
          >
            <svg className="h-5 w-5 text-rose-500 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Sign In with Google</span>
          </Button>

          <div className="text-center text-sm">
            {view === "login" ? (
              <p className="text-zinc-400">
                New to Cine-Stellar?{" "}
                <button
                  onClick={() => setAuthView("signup")}
                  className="text-rose-500 hover:underline font-semibold focus:outline-none"
                >
                  Sign up now.
                </button>
              </p>
            ) : (
              <p className="text-zinc-400">
                Already have an account?{" "}
                <button
                  onClick={() => setAuthView("login")}
                  className="text-rose-500 hover:underline font-semibold focus:outline-none"
                >
                  Sign in here.
                </button>
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
