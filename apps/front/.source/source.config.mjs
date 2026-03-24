// source.config.ts
import { defineCollections, defineConfig } from "fumadocs-mdx/config";
import { z } from "zod";
var blog = defineCollections({
  dir: "content/blog",
  type: "doc",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    author: z.string(),
    tags: z.array(z.string())
  })
});
var source_config_default = defineConfig();
export {
  blog,
  source_config_default as default
};
