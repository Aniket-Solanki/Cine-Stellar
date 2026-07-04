import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { getCurrentUser, hashPassword } from "@/lib/auth-utils";

// Get current user details
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ user });
}

// Update user details
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, avatar, preferredLanguage, theme, newPassword } = await request.json();

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (preferredLanguage !== undefined) updateData.preferredLanguage = preferredLanguage;
    if (theme !== undefined) updateData.theme = theme;
    
    if (newPassword) {
      updateData.password = await hashPassword(newPassword);
    }

    const userRef = db.collection("users").doc(user.id);
    await userRef.set(updateData, { merge: true });

    // Fetch the updated user profile from Firestore to return
    const userSnap = await userRef.get();
    const updatedUser = userSnap.data();

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile settings" },
      { status: 500 }
    );
  }
}
