import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import SignUpForm from "@/components/auth/sign-up-form";
import { SEO_DEFAULTS } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Get started — ${SEO_DEFAULTS.siteName}`,
  description:
    "Create your Dunlo account and start recovering failed payments in 10 minutes. Free during beta — no credit card required.",
  robots: "index, follow",
};

export default function RegisterPage() {
  return (
    <AuthLayout showSignIn={false}>
      <SignUpForm />
    </AuthLayout>
  );
}
