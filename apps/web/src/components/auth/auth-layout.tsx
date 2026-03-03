import { Link } from "@tanstack/react-router";

export function AuthLayout({
  children,
  showSignIn,
}: {
  children: React.ReactNode;
  showSignIn: boolean;
}) {
  return (
    <div className="landing-grain relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-landing-bg landing-grid-bg">
      <div className="landing-hero-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <Link
        to="/"
        className="auth-stagger absolute left-6 top-6 z-20 font-display text-xl text-landing-text transition-colors hover:text-landing-accent md:left-10"
      >
        dunlo
      </Link>

      <div className="auth-stagger relative z-10 w-full max-w-[500px] px-6">
        <div className="rounded-sm border border-landing-border bg-landing-surface/70 px-8 py-10 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_24px_80px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          {children}
        </div>

        <p className="auth-stagger mt-6 text-center font-body text-sm text-landing-text-muted" style={{ animationDelay: "400ms" }}>
          {showSignIn ? (
            <Link
              to="/login"
              search={{ mode: "sign-up" }}
              className="text-landing-accent transition-colors hover:underline"
            >
              Create an account
            </Link>
          ) : (
            <Link
              to="/login"
              search={{ mode: "sign-in" }}
              className="text-landing-accent transition-colors hover:underline"
            >
              Already have an account?
            </Link>
          )}
        </p>
      </div>

      <div className="auth-stagger absolute bottom-8 left-1/2 -translate-x-1/2 z-10" style={{ animationDelay: "500ms" }}>
        <Link
          to="/"
          className="font-body text-xs text-landing-text-muted transition-colors hover:text-landing-text-secondary"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
