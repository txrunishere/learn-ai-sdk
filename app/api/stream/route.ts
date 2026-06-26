import { google } from "@ai-sdk/google";
import {
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
} from "ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    const response = streamText({
      model: google("gemini-2.0-flash"),
      prompt,
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({
        stream: response.stream,
      }),
    });
  } catch (error) {
    console.error("Error streaming response:", error);
    return NextResponse.json(
      { error: "Failed to stream text" },
      { status: 500 },
    );
  }
}
