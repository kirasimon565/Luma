import { NextRequest, NextResponse } from "next/server";
import { pb } from "@/lib/pocketbase";
import { useAuthStore } from "@/stores/authStore";

export async function POST(req: NextRequest) {
  try {
    const { characterId, userId, action } = await req.json();

    if (!characterId || !userId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await pb.collection('nsfw_logs').create({
      characterId,
      userId,
      action,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ message: "Consent logged successfully" }, { status: 201 });

  } catch (error: any) {
    console.error("Error logging NSFW consent:", error);
    return NextResponse.json({ error: error.message || "An internal server error occurred" }, { status: 500 });
  }
}
