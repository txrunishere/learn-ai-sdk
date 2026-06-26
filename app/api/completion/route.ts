import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    const { text } = await generateText({
      model: google("gemini-2.0-flash"),
      prompt,
    });

    return NextResponse.json({
      success: true,
      text,
    });
  } catch (error) {
    console.error("Error generating text:", error);
    return NextResponse.json(
      {
        error: "Failed to Generate text",
      },
      { status: 500 },
    );
  }
}
