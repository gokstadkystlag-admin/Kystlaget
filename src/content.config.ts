import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const artikler = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/artikler" }),
  schema: z.object({
    tittel: z.string(),
    beskrivelse: z.string(),
    dato: z.date(),
    bilde: z.string().optional(),
    forfatter: z.string().optional(),
  }),
});

const arrangementer = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/arrangementer" }),
  schema: z.object({
    tittel: z.string(),
    beskrivelse: z.string(),
    dato: z.date(),
    sted: z.string().optional(),
    tid: z.string().optional(),
    bilde: z.string().optional(),
  }),
});

export const collections = { artikler, arrangementer };
