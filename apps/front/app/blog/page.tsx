import type { Metadata } from "next";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { blogSource } from "@/lib/blog/source";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes sur la récupération des paiements, Stripe et le MRR pour les équipes SaaS.",
};

function sortByDateDesc(
  pages: ReturnType<typeof blogSource.getPages>,
): ReturnType<typeof blogSource.getPages> {
  return [...pages].sort((a, b) => {
    const da = parseISO(String(a.data.date)).getTime();
    const db = parseISO(String(b.data.date)).getTime();
    return db - da;
  });
}

export default function BlogIndexPage() {
  const posts = sortByDateDesc(blogSource.getPages());

  return (
    <div className="min-h-svh bg-landing-bg">
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <header className="mb-12 border-b border-landing-border pb-8">
          <p className="font-body text-xs uppercase tracking-[0.2em] text-landing-text-muted">
            Dunlo
          </p>
          <h1 className="mt-3 font-display text-4xl text-landing-text md:text-5xl">
            Blog
          </h1>
          <p className="mt-4 max-w-2xl font-body text-lg text-landing-text-secondary">
            Idées et mises à jour sur le payment recovery, les paiements échoués
            et la croissance SaaS.
          </p>
        </header>

        <ul className="flex flex-col gap-6">
          {posts.map((post) => (
            <li key={post.url}>
              <Link
                href={post.url}
                className="group block rounded-xl border border-landing-border bg-landing-surface/40 p-6 transition-colors hover:border-landing-accent/30 hover:bg-landing-surface/80"
              >
                <time
                  dateTime={String(post.data.date)}
                  className="font-body text-xs text-landing-text-muted"
                >
                  {format(parseISO(String(post.data.date)), "PPP")}
                </time>
                <h2 className="mt-2 font-display text-xl text-landing-text group-hover:text-landing-accent md:text-2xl">
                  {post.data.title}
                </h2>
                <p className="mt-2 font-body text-landing-text-secondary">
                  {post.data.description}
                </p>
                {post.data.tags.length > 0 ? (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {post.data.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-landing-border bg-landing-bg/60 px-2.5 py-0.5 font-body text-xs text-landing-text-muted"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-14 font-body text-sm text-landing-text-muted">
          <Link href="/" className="text-landing-accent hover:underline">
            ← Retour à l’accueil
          </Link>
        </p>
      </div>
    </div>
  );
}
