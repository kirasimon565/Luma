import { NextRequest, NextResponse } from "next/server";
import { pb } from "@/lib/pocketbase";
import PocketBase from 'pocketbase';

export async function POST(req: NextRequest) {
  try {
    const { characterId, action } = await req.json();
    const authHeader = req.headers.get('Authorization');

    if (!authHeader) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Initialize a new PocketBase instance and set the auth store from the header
    const tempPb = new PocketBase(process.env.POCKETBASE_URL);
    tempPb.authStore.loadFromCookie(`pb_auth=${authHeader}`);

    const user = tempPb.authStore.model;

    if (!user) {
        return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
    }

    if (!characterId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await pb.collection('nsfw_logs').create({
      characterId,
      userId: user.id,
      action,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ message: "Consent logged successfully" }, { status: 201 });

  } catch (error: any) {
    console.error("Error logging NSFW consent:", error);
    return NextResponse.json({ error: error.message || "An internal server error occurred" }, { status: 500 });
  }
}
