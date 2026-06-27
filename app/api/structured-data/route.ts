import { mistral } from "@ai-sdk/mistral";
import { createTextStreamResponse, Output, streamText, toTextStream } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { recipeSchema } from "@/lib/schemas";

export async function POST(req: NextRequest) {
  try {
    const { dish } = await req.json();

    const response = streamText({
      model: mistral("mistral-large-2512"),
      output: Output.object({
        schema: recipeSchema,
      }),
      prompt: `Generate a recipe for ${dish}`,
    });

    return createTextStreamResponse({
      stream: toTextStream({
        stream: response.stream,
      }),
    });
  } catch (error) {
    console.error("Error generating recipe:", error);
    return new Response("Failed to generate recipe", { status: 500 });
  }
}
