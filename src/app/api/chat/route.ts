import { NextResponse } from "next/server";
import { chat } from "@/lib/ai";

export async function POST(request: Request) {
  const { messages } = await request.json();

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json(
      { error: "messages array is required" },
      { status: 400 }
    );
  }

  const reply = await chat(messages);

  return NextResponse.json({
    message: {
      id: crypto.randomUUID(),
      role: "assistant" as const,
      content: reply,
      timestamp: Date.now(),
    },
  });
}
