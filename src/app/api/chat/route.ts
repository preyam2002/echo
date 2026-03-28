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

  try {
    const { text, worldData } = await chat(messages);

    return NextResponse.json({
      message: {
        id: crypto.randomUUID(),
        role: "assistant" as const,
        content: text,
        timestamp: Date.now(),
      },
      worldData,
    });
  } catch (e) {
    console.error("Chat error:", e);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
