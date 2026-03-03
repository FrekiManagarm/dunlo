import { createFileRoute } from "@tanstack/react-router";

import { AuthLayout } from "@/components/auth/auth-layout";
import SignUpForm from "@/components/auth/sign-up-form";
import { SEO_DEFAULTS, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/register")({
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
    links: [{ rel: "canonical", href: `${SITE_URL}/register` }],
  }),
});

function RouteComponent() {
  return (
    <AuthLayout showSignIn={false}>
      <SignUpForm />
    </AuthLayout>
  );
}
