import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Shield, Zap, Clock } from "lucide-react";

export const Route = createFileRoute("/_app/onboarding")({
  component: OnboardingPage,
});

function OnboardingPage() {
  return (
    <div className="flex min-h-[calc(100svh-8rem)] items-center justify-center">
      <div className="mx-auto w-full max-w-lg text-center">
        <div
          className="mx-auto mb-10 flex size-16 items-center justify-center border border-primary/20 bg-primary/5"
          style={{ animation: "onb-glow 4s ease-in-out infinite" }}
        >
          <span className="font-display text-3xl text-primary">d</span>
        </div>

        <h1 className="font-display text-3xl text-foreground">
          Connect your Stripe account
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Dunlo needs read access to your Stripe data to detect failed payments
          and recover them automatically.
        </p>

        <button
          type="button"
          className="group mt-8 inline-flex items-center gap-3 bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,232,123,0.2)]"
        >
          Connect with Stripe
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </button>

        <p className="mt-4 text-xs text-muted-foreground">
          Takes 2 minutes. No credit card required.
        </p>

        <div className="mx-auto mt-12 grid max-w-md grid-cols-3 gap-6">
          {[
            {
              icon: Shield,
              title: "Secure",
              desc: "OAuth 2.0, read-only access",
            },
            {
              icon: Zap,
              title: "Instant",
              desc: "Recovery starts immediately",
            },
            {
              icon: Clock,
              title: "2 minutes",
              desc: "Quick and painless setup",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center">
              <div className="mx-auto mb-2 flex size-8 items-center justify-center border border-border">
                <Icon className="size-3.5 text-muted-foreground" />
              </div>
              <p className="text-xs font-medium text-foreground">{title}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
