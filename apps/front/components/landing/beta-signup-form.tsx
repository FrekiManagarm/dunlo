"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

import { submitBetaSignup, type BetaSignupState } from "@/app/beta/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const inputClassName =
  "h-11 border-landing-border bg-landing-surface/50 text-landing-text placeholder:text-landing-text-muted focus-visible:border-landing-accent focus-visible:ring-landing-accent/20 font-body";

export function BetaSignupForm() {
  const [state, formAction, isPending] = useFormState<
    BetaSignupState | null,
    FormData
  >(submitBetaSignup, null);

  if (state?.success) {
    return (
      <div
        className="l-stagger flex flex-col items-center rounded-sm border border-landing-border bg-landing-surface/40 px-8 py-14 text-center backdrop-blur-sm"
        style={{ animationDelay: "100ms" }}
      >
        <div className="flex size-14 items-center justify-center rounded-full border border-landing-accent/30 bg-landing-accent/10">
          <CheckCircle className="size-7 text-landing-accent" />
        </div>
        <h2 className="mt-6 font-display text-2xl text-landing-text">
          You&apos;re on the list
        </h2>
        <p className="mt-3 max-w-sm font-body text-sm text-landing-text-secondary">
          We&apos;ll email you when we open the beta. In the meantime, feel free
          to explore the product.
        </p>
        <Link
          href="/"
          className="group mt-8 inline-flex items-center gap-2 font-body text-sm font-medium text-landing-accent transition-colors hover:text-landing-accent/90"
        >
          Back to home
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="l-stagger flex flex-col gap-6 rounded-sm border border-landing-border bg-landing-surface/40 px-8 py-10 backdrop-blur-sm sm:px-10 sm:py-12"
      style={{ animationDelay: "200ms" }}
    >
      {state?.success === false && state.error && (
        <p
          className="rounded-sm border border-red-500/20 bg-red-500/10 px-3 py-2 font-body text-sm text-red-400"
          role="alert"
        >
          {state.error}
        </p>
      )}

      <div className="space-y-2">
        <Label
          htmlFor="beta-email"
          className="font-body text-xs font-medium uppercase tracking-wider text-landing-text-secondary"
        >
          Email <span className="text-landing-accent">*</span>
        </Label>
        <Input
          id="beta-email"
          name="email"
          type="email"
          required
          placeholder="you@company.com"
          className={cn(inputClassName)}
          disabled={isPending}
          autoComplete="email"
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="beta-company"
          className="font-body text-xs font-medium uppercase tracking-wider text-landing-text-secondary"
        >
          Company or product (optional)
        </Label>
        <Input
          id="beta-company"
          name="company"
          type="text"
          placeholder="Acme SaaS"
          className={cn(inputClassName)}
          disabled={isPending}
          autoComplete="organization"
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="beta-message"
          className="font-body text-xs font-medium uppercase tracking-wider text-landing-text-secondary"
        >
          Tell us about your SaaS (optional)
        </Label>
        <Textarea
          id="beta-message"
          name="message"
          placeholder="MRR, stack, what you'd like to recover..."
          rows={3}
          className={cn(inputClassName, "min-h-[88px] resize-y py-3")}
          disabled={isPending}
        />
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="mt-2 h-12 w-full bg-landing-accent px-6 font-body text-sm font-semibold text-landing-bg transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,232,123,0.2)] disabled:opacity-60"
      >
        {isPending ? "Joining…" : "Join the beta"}
      </Button>
    </form>
  );
}
