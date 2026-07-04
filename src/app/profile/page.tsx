// Immersive profile settings page to customize user name, preferred languages, and selected avatars.
"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store";
import Button from "@/components/ui/button";
import { User, Languages, Palette, Lock, UserCheck, Shield } from "lucide-react";

const AVATAR_PRESETS = ["premium", "retro", "custom", "cine", "stellar", "neon"];
const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
];

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();

  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("premium");
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("dark");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Populate data when user object is loaded
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setAvatar(user.avatar || "premium");
      setLanguage(user.preferredLanguage || "en");
      setTheme(user.theme || "dark");
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 text-zinc-400">
        Sign in to access your profile settings.
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          avatar,
          preferredLanguage: language,
          theme,
          newPassword: password || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      setUser(data.user);
      setMessage("Profile settings updated successfully!");
      setPassword("");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-zinc-950 pt-28 pb-20 px-4 sm:px-8 md:px-12 flex flex-col text-left">
      <div className="max-w-4xl mx-auto w-full flex flex-col space-y-8">
        
        <div className="border-b border-zinc-850 pb-5">
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center space-x-2">
            <User className="h-7 w-7 text-rose-500" />
            <span>PROFILE SETTINGS</span>
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            Customize your Cine-Stellar workspace preferences and avatar styles.
          </p>
        </div>

        {message && (
          <div className="p-4 text-sm font-semibold text-green-500 bg-green-500/10 border border-green-500/20 rounded-2xl">
            {message}
          </div>
        )}

        {error && (
          <div className="p-4 text-sm font-semibold text-red-500 bg-red-500/10 border border-red-500/20 rounded-2xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Avatar Selector Panel */}
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-850 flex flex-col items-center space-y-6">
            <h3 className="font-bold text-white tracking-tight self-start border-b border-zinc-850 w-full pb-2">
              Select Avatar
            </h3>
            
            <img
              src={`https://api.dicebear.com/7.x/bottts/svg?seed=${avatar}`}
              alt="selected avatar"
              className="h-28 w-28 rounded-full border-4 border-rose-600 bg-zinc-950 p-1 object-cover shadow-xl"
            />

            <div className="grid grid-cols-3 gap-3 w-full">
              {AVATAR_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAvatar(preset)}
                  className={`p-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 border transition-all cursor-pointer flex justify-center ${
                    avatar === preset ? "border-rose-600 ring-1 ring-rose-600" : "border-zinc-800"
                  }`}
                >
                  <img
                    src={`https://api.dicebear.com/7.x/bottts/svg?seed=${preset}`}
                    alt={preset}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Form Options Panel */}
          <div className="md:col-span-2 p-6 rounded-2xl bg-zinc-900/40 border border-zinc-850 space-y-6">
            <h3 className="font-bold text-white tracking-tight border-b border-zinc-850 pb-2 flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-rose-500" />
              <span>Details & Preferences</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Name */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              {/* Email (Disabled) */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest pl-1">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full bg-zinc-950/40 border border-zinc-850/60 rounded-xl px-4 py-3 text-sm text-zinc-500 cursor-not-allowed"
                />
              </div>

              {/* Language */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1 flex items-center space-x-1.5">
                  <Languages className="h-3 w-3" />
                  <span>Preferred Language</span>
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Theme */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1 flex items-center space-x-1.5">
                  <Palette className="h-3 w-3" />
                  <span>Display Theme</span>
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
                >
                  <option value="dark">Cinematic Dark</option>
                  <option value="violet">Violet Aurora</option>
                </select>
              </div>

              {/* Reset Password */}
              <div className="flex flex-col space-y-1.5 sm:col-span-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1 flex items-center space-x-1.5">
                  <Lock className="h-3 w-3" />
                  <span>New Password (Leave blank to keep current)</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Role indicator */}
            <div className="flex items-center space-x-2 text-xs text-zinc-550 border-t border-zinc-850 pt-4">
              <Shield className="h-4 w-4" />
              <span>Role: <span className="text-rose-500 font-bold uppercase">{user.role}</span></span>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="primary" type="submit" isLoading={loading} className="px-6 py-3">
                Save Changes
              </Button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
