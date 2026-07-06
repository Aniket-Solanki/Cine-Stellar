// Watch page resolving parameters and rendering the fullscreen video player.
import React from "react";
import VideoPlayer from "@/components/player/VideoPlayer";
import { tmdbService } from "@/lib/services/tmdb";
import { notFound } from "next/navigation";

interface WatchPageProps {
  params: Promise<{
    type: string;
    id: string;
  }>;
  searchParams: Promise<{
    s?: string;
    e?: string;
  }>;
}

export default async function WatchPage({ params, searchParams }: WatchPageProps) {
  const { type, id } = await params;
  const { s, e } = await searchParams;

  if (type !== "movie" && type !== "tv") {
    notFound();
  }

  const parsedSeason = s ? parseInt(s, 10) : 1;
  const parsedEpisode = e ? parseInt(e, 10) : 1;

  // Load basic details for title metadata
  let title = "Streaming Media";
  let backdropPath = null;

  try {
    const details = await tmdbService.getDetails(id, type);
    title = details.title || details.name || "Streaming Media";
    backdropPath = details.backdrop_path;
  } catch (err) {
    console.error("Failed to load watch page details:", err);
  }

  return (
    <div className="w-screen h-screen bg-black">
      <VideoPlayer
        mediaId={id}
        mediaType={type}
        title={title}
        backdropPath={backdropPath}
        season={type === "tv" ? parsedSeason : undefined}
        episode={type === "tv" ? parsedEpisode : undefined}
        episodesCount={type === "tv" ? 24 : undefined} // will be dynamically loaded inside player as well
      />
    </div>
  );
}
