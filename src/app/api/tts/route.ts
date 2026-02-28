import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string" || text.length > 300) {
      return NextResponse.json({ error: "Invalid text" }, { status: 400 });
    }

    const ttsUrl = process.env.TTS_API_URL || "https://omtransactionflow.com/benji/speak/";

    const response = await fetch(ttsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.TTS_API_KEY ? { "Api-Key": process.env.TTS_API_KEY } : {}),
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "TTS unavailable" }, { status: 503 });
    }

    const audioBuffer = await response.arrayBuffer();
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "audio/mpeg",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "TTS error" }, { status: 500 });
  }
}
