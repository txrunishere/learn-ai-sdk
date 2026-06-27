import { pokemonSchema } from "@/lib/schemas";
import { mistral } from "@ai-sdk/mistral";
import { Output, streamText } from "ai";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { type } = await req.json();

    const response = streamText({
      model: mistral("mistral-large-2512"),
      output: Output.array({ element: pokemonSchema }),
      prompt: `Generate a list of 5 ${type} type pokemons`,
    });

    return response.toTextStreamResponse();
  } catch (error) {
    console.error("Error generating pokemon:", error);
    return new Response("Failed to generate pokemon", { status: 500 });
  }
}
