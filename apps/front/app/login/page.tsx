import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import SignInForm from "@/components/auth/sign-in-form";
import { SEO_DEFAULTS } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Sign in — ${SEO_DEFAULTS.siteName}`,
  description:
    "Sign in to your Dunlo account and manage your payment recovery.",
  robots: "index, follow",
};

export default function LoginPage() {
  return (
    <AuthLayout showSignIn>
      <SignInForm />
    </AuthLayout>
  );
}
