import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { createServerFn } from "@tanstack/react-start";

import { SEO_DEFAULTS, SITE_URL } from "@/lib/seo";

const getBlogPostsFn = createServerFn({ method: "GET" }).handler(async () => {
  const { getBlogPosts } = await import("@/lib/docs/get-posts");
  return getBlogPosts();
});

export const Route = createFileRoute("/blog/")({
  component: BlogIndexPage,
  loader: () => getBlogPostsFn(),
  head: () => ({
    meta: [
      { title: `Blog — ${SEO_DEFAULTS.siteName}` },
      {
        name: "description",
        content:
          "Articles on payment recovery, failed payments, and growing your SaaS revenue.",
      },
      { property: "og:title", content: `Blog — ${SEO_DEFAULTS.siteName}` },
      {
        property: "og:description",
        content:
          "Articles on payment recovery, failed payments, and growing your SaaS revenue.",
      },
      { property: "og:url", content: `${SITE_URL}/blog` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/blog` }],
  }),
});

function BlogIndexPage() {
  const posts = Route.useLoaderData();

  return (
    <div className="landing-grain relative min-h-svh bg-landing-bg landing-grid-bg">
      <nav className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between border-b border-landing-border/50 bg-landing-bg/80 px-6 py-4 font-body backdrop-blur-xl md:px-10">
        <Link to="/" className="font-display text-xl text-landing-text">
          dunlo
        </Link>
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-sm text-landing-text-secondary transition-colors hover:text-landing-text"
          >
            Home
          </Link>
          <Link
            to="/register"
            className="group inline-flex items-center gap-2 bg-landing-accent px-4 py-2 text-sm font-semibold text-landing-bg transition-all hover:shadow-[0_0_30px_rgba(0,232,123,0.2)]"
          >
            Get started
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-6 pt-32 pb-24">
        <h1 className="font-display text-4xl leading-tight text-landing-text md:text-5xl">
          Blog
        </h1>
        <p className="mt-4 font-body text-lg text-landing-text-secondary">
          Articles on payment recovery, failed payments, and growing your SaaS
          revenue.
        </p>

        <ul className="mt-16 flex flex-col gap-8">
          {posts.length === 0 ? (
            <li className="rounded-lg border border-landing-border bg-landing-surface/30 px-6 py-12 text-center font-body text-landing-text-secondary">
              No posts yet. Check back soon.
            </li>
          ) : (
            posts.map((post) => (
              <li key={post.url}>
                <Link
                  to={post.url}
                  className="group block rounded-lg border border-landing-border bg-landing-surface/30 p-6 transition-colors hover:border-landing-accent/20 hover:bg-landing-surface/50"
                >
                  <h2 className="font-display text-xl text-landing-text group-hover:text-landing-accent md:text-2xl">
                    {post.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 font-body text-sm text-landing-text-secondary">
                    {post.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 font-body text-xs font-medium text-landing-accent">
                    Read more
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))
          )}
        </ul>
      </main>
    </div>
  );
}
