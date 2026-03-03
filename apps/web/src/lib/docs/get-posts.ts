import { source } from "./source";
import { SEO_DEFAULTS } from "@/lib/seo";

type PageTreeNode = {
  type: string;
  name?: string;
  url?: string;
  children?: PageTreeNode[];
  index?: PageTreeNode;
};

function flattenPages(node: PageTreeNode, baseUrl: string): Array<{ name: string; url: string; slugs: string[] }> {
  const pages: Array<{ name: string; url: string; slugs: string[] }> = [];

  if (node.type === "page" && node.url && node.name) {
    const url = node.url.startsWith("/") ? node.url : `${baseUrl}/${node.url}`;
    const slugs = url
      .replace(new RegExp(`^${baseUrl}/?`), "")
      .split("/")
      .filter(Boolean);
    pages.push({ name: node.name, url, slugs });
  }

  if (node.index && node.index.type === "page" && node.index.url && node.index.name) {
    const url = node.index.url.startsWith("/") ? node.index.url : `${baseUrl}/${node.index.url}`;
    const slugs = url
      .replace(new RegExp(`^${baseUrl}/?`), "")
      .split("/")
      .filter(Boolean);
    pages.push({ name: node.index.name, url, slugs });
  }

  for (const child of node.children ?? []) {
    pages.push(...flattenPages(child, baseUrl));
  }

  return pages;
}

export type BlogPost = {
  title: string;
  description: string;
  url: string;
};

export async function getBlogPosts(): Promise<BlogPost[]> {
  const tree = source.getPageTree() as { children?: PageTreeNode[] } | PageTreeNode[];
  const baseUrl = "/blog";

  const roots = Array.isArray(tree) ? tree : tree.children ?? [];
  const rawPages = roots.flatMap((child) => flattenPages(child, baseUrl));

  const posts: BlogPost[] = [];

  for (const { name, url, slugs } of rawPages) {
    if (slugs.length === 0) continue;

    const page = source.getPage(slugs);
    if (!page) continue;

    const data = page.data as { title?: string; description?: string; date?: string } | undefined;
    posts.push({
      title: data?.title ?? name,
      description: data?.description ?? SEO_DEFAULTS.description,
      url,
    });
  }

  return posts;
}
