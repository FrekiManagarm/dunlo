import { createFileRoute } from "@tanstack/react-router";

import { AuthLayout } from "@/components/auth/auth-layout";
import SignInForm from "@/components/auth/sign-in-form";
import SignUpForm from "@/components/auth/sign-up-form";
import { SEO_DEFAULTS, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    mode: (search.mode as "sign-in" | "sign-up" | undefined) ?? "sign-up",
  }),
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: `Get started — ${SEO_DEFAULTS.siteName}`,
      },
      {
        name: "description",
        content:
          "Create your Dunlo account and start recovering failed payments in 10 minutes. Free during beta — no credit card required.",
      },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/login` }],
  }),
});

function RouteComponent() {
  const { mode } = Route.useSearch();
  const showSignIn = mode === "sign-in";

  return (
    <AuthLayout showSignIn={showSignIn}>
      {showSignIn ? <SignInForm /> : <SignUpForm />}
    </AuthLayout>
  );
}
