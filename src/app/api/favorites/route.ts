// API Route handler for user favorite media tracking.
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-utils";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ favorites });
  } catch (error) {
    console.error("Favorites fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { mediaId, mediaType, title, posterPath, backdropPath } = await request.json();

    if (!mediaId || !mediaType || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const favoriteItem = await prisma.favorite.upsert({
      where: {
        userId_mediaId_mediaType: {
          userId: user.id,
          mediaId: String(mediaId),
          mediaType,
        },
      },
      update: {},
      create: {
        userId: user.id,
        mediaId: String(mediaId),
        mediaType,
        title,
        posterPath,
        backdropPath,
      },
    });

    return NextResponse.json({ message: "Added to favorites", item: favoriteItem });
  } catch (error) {
    console.error("Favorites post error:", error);
    return NextResponse.json({ error: "Failed to add to favorites" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const mediaId = searchParams.get("mediaId");
    const mediaType = searchParams.get("mediaType");

    if (!mediaId || !mediaType) {
      return NextResponse.json({ error: "Missing mediaId or mediaType" }, { status: 400 });
    }

    await prisma.favorite.delete({
      where: {
        userId_mediaId_mediaType: {
          userId: user.id,
          mediaId: String(mediaId),
          mediaType,
        },
      },
    });

    return NextResponse.json({ message: "Removed from favorites" });
  } catch (error) {
    console.error("Favorites delete error:", error);
    return NextResponse.json({ error: "Failed to remove from favorites" }, { status: 500 });
  }
}
