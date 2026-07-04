// API Route handler for user watch history and video playback progress tracking.
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-utils";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const watchHistory = await prisma.watchHistory.findMany({
      where: { userId: user.id },
      orderBy: { lastWatched: "desc" },
    });
    return NextResponse.json({ watchHistory });
  } catch (error) {
    console.error("Watch history fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch watch history" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      mediaId,
      mediaType,
      title,
      backdropPath,
      progress,
      duration,
      season,
      episode,
    } = await request.json();

    if (!mediaId || !mediaType || !title || progress === undefined || !duration) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const historyItem = await prisma.watchHistory.upsert({
      where: {
        userId_mediaId_mediaType: {
          userId: user.id,
          mediaId: String(mediaId),
          mediaType,
        },
      },
      update: {
        progress,
        duration,
        season: season || null,
        episode: episode || null,
        lastWatched: new Date(),
      },
      create: {
        userId: user.id,
        mediaId: String(mediaId),
        mediaType,
        title,
        backdropPath,
        progress,
        duration,
        season: season || null,
        episode: episode || null,
      },
    });

    return NextResponse.json({ message: "Playback progress saved", item: historyItem });
  } catch (error) {
    console.error("Watch history post error:", error);
    return NextResponse.json({ error: "Failed to save playback progress" }, { status: 500 });
  }
}
