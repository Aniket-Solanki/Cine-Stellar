// Real-time Search page tracking recent user query history and displaying instant matches.
"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search as SearchIcon, Trash2, Clock, Flame, Loader } from "lucide-react";
import MovieCard from "@/components/media/MovieCard";
import { tmdbService } from "@/lib/services/tmdb";
import { MediaItem } from "@/lib/services/mockData";
import Button from "@/components/ui/button";

const TRENDING_SEARCHES = ["Stranger Things", "Inception", "Dune", "Interstellar", "Breaking Bad"];

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryParam = searchParams.get("q") || "";

  const [inputVal, setInputVal] = useState(queryParam);
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  // Load Search History from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("cinestellar_search_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Run Search when query parameter changes
  useEffect(() => {
    setInputVal(queryParam);
    if (!queryParam.trim()) {
      setResults([]);
      return;
    }

    async function executeSearch() {
      setLoading(true);
      try {
        const data = await tmdbService.search(queryParam);
        setResults(data.results);
        
        // Save to History (max 5 items, avoid duplicates)
        setHistory((prev) => {
          const updated = [queryParam, ...prev.filter((q) => q !== queryParam)].slice(0, 5);
          localStorage.setItem("cinestellar_search_history", JSON.stringify(updated));
          return updated;
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    executeSearch();
  }, [queryParam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      router.push(`/search?q=${encodeURIComponent(inputVal.trim())}`);
    }
  };

  const handleHistoryClick = (q: string) => {
    setInputVal(q);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("cinestellar_search_history");
  };

  return (
    <div className="w-full min-h-screen bg-zinc-950 pt-28 pb-20 px-4 sm:px-8 md:px-12 flex flex-col text-left">
      <div className="max-w-7xl mx-auto w-full flex flex-col space-y-8">
        
        {/* Real-time search entry bar */}
        <form onSubmit={handleSubmit} className="relative w-full max-w-3xl mx-auto">
          <input
            type="text"
            placeholder="Search movies, TV shows, actors, or genres..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-full px-6 py-4 pl-14 bg-zinc-900 border border-zinc-800 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all shadow-xl text-base"
          />
          <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-zinc-500" />
          {inputVal.trim() && (
            <Button
              variant="primary"
              type="submit"
              size="sm"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 px-4 py-1.5"
            >
              Search
            </Button>
          )}
        </form>

        {/* Dynamic content rendering */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 space-y-4">
            <Loader className="h-10 w-10 animate-spin text-rose-600" />
            <p className="text-sm text-zinc-500 font-medium">Searching libraries...</p>
          </div>
        ) : queryParam.trim() ? (
          // Search Results Area
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Search Results for <span className="text-rose-500">"{queryParam}"</span>
            </h2>

            {results.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {results.map((item) => (
                  <div key={item.id} className="flex justify-center">
                    <MovieCard
                      id={String(item.id)}
                      title={item.title || item.name || ""}
                      posterPath={item.poster_path}
                      backdropPath={item.backdrop_path}
                      mediaType={item.media_type}
                      voteAverage={item.vote_average}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-28 space-y-2">
                <p className="text-lg font-bold text-zinc-300">No results found</p>
                <p className="text-sm text-zinc-500">
                  Try checking your spelling or search for popular terms.
                </p>
              </div>
            )}
          </div>
        ) : (
          // Suggestions Area (Search history & trending)
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto pt-4">
            {/* History Panel */}
            {history.length > 0 && (
              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-850 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
                  <h3 className="font-bold text-white flex items-center space-x-2">
                    <Clock className="h-4.5 w-4.5 text-zinc-400" />
                    <span>Recent Searches</span>
                  </h3>
                  <button
                    onClick={clearHistory}
                    className="p-1 rounded text-zinc-500 hover:text-red-500 hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Clear history"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex flex-col space-y-2">
                  {history.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleHistoryClick(q)}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-xl hover:bg-zinc-800 text-sm text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    >
                      <Clock className="h-3.5 w-3.5 text-zinc-550" />
                      <span className="truncate">{q}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Searches Panel */}
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-850 space-y-4">
              <div className="border-b border-zinc-850 pb-3">
                <h3 className="font-bold text-white flex items-center space-x-2">
                  <Flame className="h-4.5 w-4.5 text-rose-500" />
                  <span>Trending Searches</span>
                </h3>
              </div>

              <div className="flex flex-col space-y-2">
                {TRENDING_SEARCHES.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleHistoryClick(q)}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-xl hover:bg-zinc-800 text-sm text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <Flame className="h-3.5 w-3.5 text-rose-600/40" />
                    <span>{q}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen bg-zinc-950 flex flex-col items-center justify-center space-y-4 text-zinc-400">
        <Loader className="h-10 w-10 animate-spin text-rose-600" />
        <p className="text-sm font-medium">Loading search interface...</p>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
