import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:8000";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const channel = searchParams.get("channel");
  const uid = searchParams.get("uid");

  const res = await fetch(
    `${BACKEND}/token?channel=${encodeURIComponent(channel ?? "")}&uid=${uid}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Token fetch failed" }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
