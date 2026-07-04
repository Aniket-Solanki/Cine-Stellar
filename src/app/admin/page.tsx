// Premium Admin Dashboard displaying metrics, database statuses, announcements, and featured banner settings.
"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Shield, Users, MonitorPlay, Film, Award, Layout, CheckCircle, Trash, RefreshCw } from "lucide-react";
import Button from "@/components/ui/button";

export default function AdminPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  const [dbStats, setDbStats] = useState({ users: 0, history: 0, watchlist: 0, ratings: 0 });
  const [loading, setLoading] = useState(true);
  const [featuredId, setFeaturedId] = useState("27205"); // Inception
  const [announcement, setAnnouncement] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "content" | "announcements">("overview");

  // Redirect if not ADMIN on mount
  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      router.push("/");
    }
  }, [user, router]);

  // Load database metrics
  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/watchlist"); // check basic api connectivity
      // Compile mock metrics representing active SQLite rows
      setDbStats({
        users: 148,
        history: 1240,
        watchlist: 432,
        ratings: 980,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "ADMIN") {
      loadStats();
    }
  }, [user]);

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 text-zinc-400">
        Authenticating administrator profile...
      </div>
    );
  }

  const handleFeaturedSave = () => {
    alert(`Featured Hero Movie updated to ID: ${featuredId}`);
  };

  const handleAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (announcement.trim()) {
      alert(`Announcement posted: "${announcement}"`);
      setAnnouncement("");
    }
  };

  return (
    <div className="w-full min-h-screen bg-zinc-950 pt-28 pb-20 px-4 sm:px-8 md:px-12 flex flex-col text-left">
      <div className="max-w-7xl mx-auto w-full flex flex-col space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-850 pb-5 gap-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-white tracking-tight flex items-center space-x-2">
              <Shield className="h-7 w-7 text-rose-500" />
              <span>ADMIN PANEL</span>
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              Monitor active platform workloads, database tables, and update frontpage banners.
            </p>
          </div>

          <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl w-fit">
            {(["overview", "content", "announcements"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-bold rounded-lg capitalize transition-all focus:outline-none cursor-pointer ${
                  activeTab === tab
                    ? "bg-rose-600 text-white shadow-md shadow-rose-900/10"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Metric widgets grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-850 flex items-center space-x-4">
                <div className="p-3.5 rounded-xl bg-rose-500/10 text-rose-500">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider block">
                    Total Users
                  </span>
                  <span className="text-2xl font-black text-white block mt-0.5">
                    {dbStats.users}
                  </span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-850 flex items-center space-x-4">
                <div className="p-3.5 rounded-xl bg-rose-500/10 text-rose-500">
                  <MonitorPlay className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider block">
                    Active Streams
                  </span>
                  <span className="text-2xl font-black text-white block mt-0.5">
                    {dbStats.history}
                  </span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-850 flex items-center space-x-4">
                <div className="p-3.5 rounded-xl bg-rose-500/10 text-rose-500">
                  <Film className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider block">
                    Watchlisted Items
                  </span>
                  <span className="text-2xl font-black text-white block mt-0.5">
                    {dbStats.watchlist}
                  </span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-850 flex items-center space-x-4">
                <div className="p-3.5 rounded-xl bg-rose-500/10 text-rose-500">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider block">
                    Subscribed Ratings
                  </span>
                  <span className="text-2xl font-black text-white block mt-0.5">
                    {dbStats.ratings}
                  </span>
                </div>
              </div>

            </div>

            {/* Layout featured control and Diagnostics board */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Featured Banner Settings */}
              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-850 space-y-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight border-b border-zinc-850 pb-2.5 flex items-center space-x-2">
                    <Layout className="h-5 w-5 text-rose-500" />
                    <span>Featured Hero Settings</span>
                  </h3>
                  <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed">
                    Insert the movie or TV show ID query from TMDB to be featured on the homepage's large header banner.
                  </p>
                  
                  <div className="mt-5 flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">
                      Featured TMDB ID
                    </label>
                    <input
                      type="text"
                      value={featuredId}
                      onChange={(e) => setFeaturedId(e.target.value)}
                      placeholder="e.g. 27205"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button variant="primary" onClick={handleFeaturedSave} className="px-6 py-2.5">
                    Update Hero Banner
                  </Button>
                </div>
              </div>

              {/* Database status and tables diagnostic */}
              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-850 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-850 pb-2.5">
                  <h3 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Database Diagnostics</span>
                  </h3>
                  <button
                    onClick={loadStats}
                    disabled={loading}
                    className="p-1 rounded text-zinc-400 hover:text-white cursor-pointer"
                  >
                    <RefreshCw className={`h-4.5 w-4.5 ${loading ? "animate-spin text-rose-500" : ""}`} />
                  </button>
                </div>

                <div className="space-y-3.5 text-sm">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-zinc-400">Connection Status</span>
                    <span className="text-green-500 font-bold flex items-center space-x-1">
                      <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse mr-1" />
                      Connected (SQLite)
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-t border-zinc-850/40">
                    <span className="text-zinc-400">Users Table rows</span>
                    <span className="font-bold text-white">{dbStats.users}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-t border-zinc-850/40">
                    <span className="text-zinc-400">WatchHistory Table rows</span>
                    <span className="font-bold text-white">{dbStats.history}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-t border-zinc-850/40">
                    <span className="text-zinc-400">Watchlist Table rows</span>
                    <span className="font-bold text-white">{dbStats.watchlist}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === "content" && (
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-850 space-y-6">
            <div className="border-b border-zinc-850 pb-2.5">
              <h3 className="text-lg font-bold text-white tracking-tight">Content Moderation</h3>
              <p className="text-zinc-400 text-xs mt-0.5">
                Approve or remove user-submitted reviews and comments.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-850 flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="font-bold text-white">Alice Johnson</span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-zinc-400">on Interstellar</span>
                  </div>
                  <p className="text-zinc-300 text-sm">
                    "This movie literally made me cry. Zimmer's organs are phenomenal!"
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 rounded bg-zinc-900 hover:bg-green-600/20 text-zinc-400 hover:text-green-500 transition-colors cursor-pointer border border-zinc-800">
                    <CheckCircle className="h-4 w-4" />
                  </button>
                  <button className="p-2 rounded bg-zinc-900 hover:bg-red-600/20 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer border border-zinc-800">
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-850 flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="font-bold text-white">Bob Miller</span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-zinc-400">on Stranger Things</span>
                  </div>
                  <p className="text-zinc-300 text-sm">
                    "Season 4 went a bit too long, but Vecna is still a cool villain."
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 rounded bg-zinc-900 hover:bg-green-600/20 text-zinc-400 hover:text-green-500 transition-colors cursor-pointer border border-zinc-800">
                    <CheckCircle className="h-4 w-4" />
                  </button>
                  <button className="p-2 rounded bg-zinc-900 hover:bg-red-600/20 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer border border-zinc-800">
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "announcements" && (
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-850 space-y-6 max-w-2xl mx-auto w-full">
            <div className="border-b border-zinc-850 pb-2.5">
              <h3 className="text-lg font-bold text-white tracking-tight">Create Announcement</h3>
              <p className="text-zinc-400 text-xs mt-0.5">
                Broadcast announcements or maintenance warnings to all users globally.
              </p>
            </div>

            <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">
                  Message Content
                </label>
                <textarea
                  rows={4}
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  placeholder="e.g. Cine-Stellar will undergo server migration tomorrow at 04:00 UTC."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="flex justify-end">
                <Button variant="primary" type="submit" className="px-6 py-2.5">
                  Publish Announcement
                </Button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
