import { z } from "zod";

export const recipeSchema = z.object({
  recipe: z.object({
    name: z.string(),
    ingredients: z.array(
      z.object({
        name: z.string(),
        amount: z.string(),
      }),
    ),
    steps: z.array(z.string()),
  }),
});

export const pokemonSchema = z.object({
  name: z.string(),
  abilities: z.array(z.string()),
});

export const pokemonUISchema = z.object({ elements: z.array(pokemonSchema) });
