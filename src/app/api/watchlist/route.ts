import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/auth-utils";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const querySnapshot = await db
      .collection("users")
      .doc(user.id)
      .collection("watchlist")
      .orderBy("createdAt", "desc")
      .get();
    const watchlist = querySnapshot.docs.map((docSnap: any) => docSnap.data());

    return NextResponse.json({ watchlist });
  } catch (error) {
    console.error("Watchlist fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch watchlist" }, { status: 500 });
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

    const docId = `${mediaType}_${mediaId}`;
    const docRef = db.collection("users").doc(user.id).collection("watchlist").doc(docId);

    const watchlistItem = {
      userId: user.id,
      mediaId: String(mediaId),
      mediaType,
      title,
      posterPath: posterPath || "",
      backdropPath: backdropPath || "",
      createdAt: new Date().toISOString(),
    };

    await docRef.set(watchlistItem);

    return NextResponse.json({ message: "Added to watchlist", item: watchlistItem });
  } catch (error) {
    console.error("Watchlist post error:", error);
    return NextResponse.json({ error: "Failed to add to watchlist" }, { status: 500 });
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

    const docId = `${mediaType}_${mediaId}`;
    const docRef = db.collection("users").doc(user.id).collection("watchlist").doc(docId);
    await docRef.delete();

    return NextResponse.json({ message: "Removed from watchlist" });
  } catch (error) {
    console.error("Watchlist delete error:", error);
    return NextResponse.json({ error: "Failed to remove from watchlist" }, { status: 500 });
  }
}
