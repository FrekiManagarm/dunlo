import Link from "next/link";
import { GoogleSignInButton } from "./google-sign-in-button";
import { DunloLogo } from "@/components/dunlo-logo";

export function AuthLayout({
  children,
  showSignIn,
}: {
  children: React.ReactNode;
  showSignIn: boolean;
}) {
  return (
    <div className="landing-grain landing-grid-bg relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-landing-bg">
      <div className="landing-hero-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <Link
        href="/"
        className="auth-stagger absolute left-6 top-6 z-20 transition-opacity hover:opacity-80 md:left-10"
      >
        <DunloLogo sizeClassName="text-xl" wordmarkClassName="text-landing-text" />
      </Link>

      <div className="auth-stagger relative z-10 w-full max-w-[500px] px-6">
        <div className="rounded-sm border border-landing-border bg-landing-surface/70 px-8 py-10 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_24px_80px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          {children}
          <GoogleSignInButton callbackURL={showSignIn ? "/dashboard" : "/onboarding"} />
        </div>

        <p
          className="auth-stagger mt-6 text-center font-body text-sm text-landing-text-muted"
          style={{ animationDelay: "400ms" }}
        >
          {showSignIn ? (
            <Link
              href="/register"
              className="text-landing-accent transition-colors hover:underline"
            >
              Create an account
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-landing-accent transition-colors hover:underline"
            >
              Already have an account?
            </Link>
          )}
        </p>
      </div>

      <div
        className="auth-stagger absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        style={{ animationDelay: "500ms" }}
      >
        <Link
          href="/"
          className="font-body text-xs text-landing-text-muted transition-colors hover:text-landing-text-secondary"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
