import { NextRequest, NextResponse } from "next/server";

const WORLD_API_URL =
  process.env.NEXT_PUBLIC_WORLD_API_URL ??
  "https://world-api-stillness.live.tech.evefrontier.com/v2";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path") ?? "systems";

  const res = await fetch(`${WORLD_API_URL}/${path}`);
  if (!res.ok) {
    return NextResponse.json(
      { error: `World API returned ${res.status}` },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
