import { createFileRoute } from "@tanstack/react-router";

import { AuthLayout } from "@/components/auth/auth-layout";
import SignInForm from "@/components/auth/sign-in-form";
import { SEO_DEFAULTS, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: `Sign in — ${SEO_DEFAULTS.siteName}`,
      },
      {
        name: "description",
        content: "Sign in to your Dunlo account and manage your payment recovery.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/login` }],
  }),
});

function RouteComponent() {
  return (
    <AuthLayout showSignIn>
      <SignInForm />
    </AuthLayout>
  );
}
