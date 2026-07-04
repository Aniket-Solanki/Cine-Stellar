// API Route handler to log out the user and clear session cookies.
import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth-utils";

export async function POST() {
  await clearSessionCookie();
  return NextResponse.json({ message: "Logout successful" });
}
