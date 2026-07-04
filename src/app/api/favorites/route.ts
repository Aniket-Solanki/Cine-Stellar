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
      .collection("favorites")
      .orderBy("createdAt", "desc")
      .get();
    const favorites = querySnapshot.docs.map((docSnap: any) => docSnap.data());

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

    const docId = `${mediaType}_${mediaId}`;
    const docRef = db.collection("users").doc(user.id).collection("favorites").doc(docId);

    const favoriteItem = {
      userId: user.id,
      mediaId: String(mediaId),
      mediaType,
      title,
      posterPath: posterPath || "",
      backdropPath: backdropPath || "",
      createdAt: new Date().toISOString(),
    };

    await docRef.set(favoriteItem);

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

    const docId = `${mediaType}_${mediaId}`;
    const docRef = db.collection("users").doc(user.id).collection("favorites").doc(docId);
    await docRef.delete();

    return NextResponse.json({ message: "Removed from favorites" });
  } catch (error) {
    console.error("Favorites delete error:", error);
    return NextResponse.json({ error: "Failed to remove from favorites" }, { status: 500 });
  }
}
