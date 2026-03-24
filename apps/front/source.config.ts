import { defineCollections, defineConfig } from "fumadocs-mdx/config";
import { z } from "zod";

export const blog = defineCollections({
  dir: "content/blog",
  type: "doc",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    author: z.string(),
    tags: z.array(z.string()),
  }),
})

export default defineConfig();