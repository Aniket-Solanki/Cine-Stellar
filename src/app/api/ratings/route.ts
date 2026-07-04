// API Route handler for movie/show rating submissions.
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const mediaId = searchParams.get("mediaId");
  const mediaType = searchParams.get("mediaType");

  if (!mediaId || !mediaType) {
    return NextResponse.json({ error: "Missing mediaId or mediaType" }, { status: 400 });
  }

  try {
    const rating = await prisma.rating.findUnique({
      where: {
        userId_mediaId_mediaType: {
          userId: user.id,
          mediaId: String(mediaId),
          mediaType,
        },
      },
    });

    return NextResponse.json({ rating: rating ? rating.rating : null });
  } catch (error) {
    console.error("Fetch rating error:", error);
    return NextResponse.json({ error: "Failed to fetch rating" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { mediaId, mediaType, rating } = await request.json();

    if (!mediaId || !mediaType || rating === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const ratingItem = await prisma.rating.upsert({
      where: {
        userId_mediaId_mediaType: {
          userId: user.id,
          mediaId: String(mediaId),
          mediaType,
        },
      },
      update: {
        rating,
      },
      create: {
        userId: user.id,
        mediaId: String(mediaId),
        mediaType,
        rating,
      },
    });

    return NextResponse.json({ message: "Rating submitted successfully", rating: ratingItem });
  } catch (error) {
    console.error("Post rating error:", error);
    return NextResponse.json({ error: "Failed to submit rating" }, { status: 500 });
  }
}
