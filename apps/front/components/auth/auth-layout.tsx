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
      {/* Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,232,123,0.06)_0%,transparent_65%)]" />

      {/* Top-left logo */}
      <Link
        href="/"
        className="auth-stagger absolute left-8 top-7 z-20 transition-opacity hover:opacity-70 md:left-10"
      >
        <DunloLogo sizeClassName="text-xl" wordmarkClassName="text-landing-text" />
      </Link>

      {/* Card */}
      <div
        className="auth-stagger relative z-10 w-full max-w-[440px] px-5"
        style={{ animationDelay: "80ms" }}
      >
        <div className="border border-white/[0.07] bg-[#0e0e0e]/80 px-8 py-9 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_24px_80px_-12px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
          {children}

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40">
              or
            </span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          <GoogleSignInButton callbackURL={showSignIn ? "/dashboard" : "/onboarding"} />
        </div>

        <p
          className="auth-stagger mt-5 text-center font-mono text-[11px] text-landing-text-muted"
          style={{ animationDelay: "300ms" }}
        >
          {showSignIn ? (
            <>
              No account?{" "}
              <Link
                href="/register"
                className="text-landing-accent transition-colors hover:underline"
              >
                Create one
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-landing-accent transition-colors hover:underline"
              >
                Sign in
              </Link>
            </>
          )}
        </p>
      </div>

      {/* Back link */}
      <div
        className="auth-stagger absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
        style={{ animationDelay: "450ms" }}
      >
        <Link
          href="/"
          className="font-mono text-[10px] uppercase tracking-widest text-landing-text-muted/50 transition-colors hover:text-landing-text-muted"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
