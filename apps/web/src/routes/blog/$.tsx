import "@/styles/blog-article.css";

import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { createServerFn } from "@tanstack/react-start";
import { source } from "@/lib/docs/source";
import { SEO_DEFAULTS, SITE_URL } from "@/lib/seo";
import browserCollections from "fumadocs-mdx:collections/browser";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import { Suspense } from "react";

export const Route = createFileRoute("/blog/$")({
  component: Page,
  loader: async ({ params }) => {
    const slugs = params._splat?.split("/") ?? [];
    const data = await serverLoader({ data: slugs });
    await clientLoader.preload(data.path);
    return data;
  },
  head: ({ loaderData }) => {
    const title = loaderData?.title;
    const description = loaderData?.description;
    const url = loaderData?.url;
    if (!title || !description || !url) return {};
    return {
      meta: [
        { title: `${title} — ${SEO_DEFAULTS.siteName}` },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
});

const serverLoader = createServerFn({
  method: "GET",
})
  .inputValidator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }) => {
    const page = source.getPage(slugs);
    if (!page) throw notFound();

    const data = page.data as { title?: string; description?: string };
    const fullPath = slugs.length > 0 ? `/blog/${slugs.join("/")}` : "/blog";
    return {
      path: page.path,
      title: data.title ?? "Blog — Dunlo",
      description: data.description ?? SEO_DEFAULTS.description,
      url: `${SITE_URL}${fullPath}`,
    };
  });

const clientLoader = browserCollections.docs.createClientLoader({
  component(
    { frontmatter, default: MDX },
    _props: undefined,
  ) {
    return (
      <article className="blog-article">
        <header className="mb-12">
          <h1 className="font-display text-4xl leading-tight text-landing-text md:text-5xl">
            {frontmatter.title}
          </h1>
          {frontmatter.description && (
            <p className="mt-4 font-body text-lg text-landing-text-secondary">
              {frontmatter.description}
            </p>
          )}
        </header>
        <div className="blog-article-body">
          <MDX
            components={{
              ...defaultMdxComponents,
            }}
          />
        </div>
      </article>
    );
  },
});

function Page() {
  const data = useFumadocsLoader(Route.useLoaderData());

  return (
    <div className="landing-grain relative min-h-svh bg-landing-bg landing-grid-bg">
      <nav className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between border-b border-landing-border/50 bg-landing-bg/80 px-6 py-4 font-body backdrop-blur-xl md:px-10">
        <Link to="/" className="font-display text-xl text-landing-text">
          dunlo
        </Link>
        <div className="flex items-center gap-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-landing-text-secondary transition-colors hover:text-landing-text"
          >
            <ArrowLeft className="size-4" />
            Blog
          </Link>
          <Link
            to="/"
            className="text-sm text-landing-text-secondary transition-colors hover:text-landing-text"
          >
            Home
          </Link>
          <Link
            to="/login"
            search={{ mode: "sign-up" }}
            className="group inline-flex items-center gap-2 bg-landing-accent px-4 py-2 text-sm font-semibold text-landing-bg transition-all hover:shadow-[0_0_30px_rgba(0,232,123,0.2)]"
          >
            Get started
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-6 pt-32 pb-24">
        <Suspense>{clientLoader.useContent(data.path)}</Suspense>
      </main>
    </div>
  );
}
