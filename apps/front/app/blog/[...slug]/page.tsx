import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format, parseISO } from "date-fns";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { InlineTOC } from "fumadocs-ui/components/inline-toc";
import { blogSource } from "@/lib/blog/source";
import { SITE_URL } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export function generateStaticParams() {
  return blogSource.generateParams();
}

export async function generateMetadata(
  props: PageProps,
): Promise<Metadata> {
  const params = await props.params;
  const page = blogSource.getPage(params.slug);

  if (!page) {
    return { title: "Article introuvable" };
  }

  return {
    title: `${page.data.title} — Dunlo`,
    description: page.data.description,
    alternates: { canonical: `${SITE_URL}${page.url}` },
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      url: `${SITE_URL}${page.url}`,
      type: "article",
      publishedTime: String(page.data.date),
      authors: [page.data.author],
      images: [`${SITE_URL}/api/og/blog/${params.slug.join("/")}`],
    },
    twitter: {
      card: "summary_large_image",
      title: page.data.title,
      description: page.data.description,
      images: [`${SITE_URL}/api/og/blog/${params.slug.join("/")}`],
    },
  };
}

export default async function BlogArticlePage(props: PageProps) {
  const params = await props.params;
  const page = blogSource.getPage(params.slug);

  if (!page) notFound();

  const Mdx = page.data.body;
  const date = parseISO(String(page.data.date));

  return (
    <div className="min-h-svh bg-landing-bg">
      <article className="mx-auto w-full max-w-6xl px-6 py-12 md:py-16">
        <header className="border-b border-landing-border pb-8">
          <Link
            href="/blog"
            className="font-body text-sm text-landing-accent hover:underline"
          >
            ← Tous les articles
          </Link>
          <time
            dateTime={String(page.data.date)}
            className="mt-6 block font-body text-sm text-landing-text-muted"
          >
            {format(date, "PPP")}
          </time>
          <h1 className="mt-3 font-display text-3xl text-landing-text md:text-4xl">
            {page.data.title}
          </h1>
          <p className="mt-4 font-body text-lg text-landing-text-secondary">
            {page.data.description}
          </p>
          <p className="mt-6 font-body text-sm text-landing-text-muted">
            Par <span className="text-landing-text">{page.data.author}</span>
          </p>
          {page.data.tags.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {page.data.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-landing-border bg-landing-surface/60 px-2.5 py-0.5 font-body text-xs text-landing-text-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </header>

        <div className="mt-10 flex flex-col gap-10 md:flex-row md:items-start">
          {page.data.toc.length > 0 ? (
            <aside className="shrink-0 md:w-56">
              <p className="mb-2 font-body text-xs font-medium uppercase tracking-wide text-landing-text-muted">
                Sur cette page
              </p>
              <InlineTOC
                items={page.data.toc}
                className="rounded-lg border border-landing-border bg-landing-surface/40 p-3"
              />
            </aside>
          ) : null}
          <div className="prose min-w-0 flex-1 dark:prose-invert prose-headings:font-display prose-headings:text-landing-text prose-p:text-landing-text-secondary prose-a:text-landing-accent prose-strong:text-landing-text prose-code:text-landing-accent prose-pre:bg-landing-surface">
            <Mdx components={defaultMdxComponents} />
          </div>
        </div>
      </article>
    </div>
  );
}
