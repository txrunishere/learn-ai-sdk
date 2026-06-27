import { mistral } from "@ai-sdk/mistral";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  UIMessage,
} from "ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const response = streamText({
      model: mistral("mistral-large-2512"),
      messages: await convertToModelMessages(messages),
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({
        stream: response.stream,
      }),
    });
  } catch (error) {
    console.error("Error streaming text:", error);
    return NextResponse.json(
      {
        error: "Failed to streaming chat text",
      },
      { status: 500 },
    );
  }
}
