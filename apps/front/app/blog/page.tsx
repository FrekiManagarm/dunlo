import Link from "next/link";

export default function BlogPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-landing-bg">
      <div className="text-center">
        <h1 className="font-display text-3xl text-landing-text">Blog</h1>
        <p className="mt-4 font-body text-landing-text-secondary">
          Coming soon.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block font-body text-sm text-landing-accent hover:underline"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
