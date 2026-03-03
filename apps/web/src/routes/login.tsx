import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AuthLayout } from "@/components/auth/auth-layout";
import SignInForm from "@/components/auth/sign-in-form";
import SignUpForm from "@/components/auth/sign-up-form";
import { SEO_DEFAULTS, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/login")({
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
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <AuthLayout showSignIn={showSignIn} onSwitch={() => setShowSignIn(!showSignIn)}>
      {showSignIn ? <SignInForm /> : <SignUpForm />}
    </AuthLayout>
  );
}
