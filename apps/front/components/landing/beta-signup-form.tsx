"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useState } from "react";
import z from "zod";

import { submitBetaSignup, type BetaSignupState } from "@/app/beta/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const inputClassName =
  "h-11 border-landing-border bg-landing-surface/50 text-landing-text placeholder:text-landing-text-muted focus-visible:border-landing-accent focus-visible:ring-landing-accent/20 font-body";

const betaSignupSchema = z.object({
  email: z.email("Please enter a valid email address"),
  company: z.string().max(200, "Company name is too long"),
  message: z.string().max(4000, "Message is too long"),
});

export function BetaSignupForm() {
  const [serverState, setServerState] = useState<BetaSignupState | null>(null);

  const form = useForm({
    defaultValues: {
      email: "",
      company: "",
      message: "",
    },
    validators: {
      onSubmit: betaSignupSchema,
    },
    onSubmit: async ({ value }) => {
      setServerState(null);
      const result = await submitBetaSignup(null, {
        email: value.email.trim(),
        company: value.company.trim() || undefined,
        message: value.message.trim() || undefined,
      });
      setServerState(result);
    },
  });

  if (serverState?.success) {
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
      className="l-stagger flex flex-col gap-6 rounded-sm border border-landing-border bg-landing-surface/40 px-8 py-10 backdrop-blur-sm sm:px-10 sm:py-12"
      style={{ animationDelay: "200ms" }}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
    >
      {serverState?.success === false && serverState.error ? (
        <Alert
          variant="destructive"
          className="rounded-sm border-red-500/20 bg-red-500/10 text-red-400 **:data-[slot=alert-description]:text-red-300/90"
        >
          <AlertDescription>{serverState.error}</AlertDescription>
        </Alert>
      ) : null}

      <FieldGroup className="gap-6">
        <form.Field name="email">
          {(field) => (
            <Field data-invalid={field.state.meta.errors.length > 0}>
              <FieldLabel
                htmlFor={field.name}
                className="font-body text-xs font-medium uppercase tracking-wider text-landing-text-secondary"
              >
                Email <span className="text-landing-accent">*</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={cn(inputClassName)}
                  disabled={form.state.isSubmitting}
                />
                <FieldError
                  errors={field.state.meta.errors}
                  className="text-red-400"
                />
              </FieldContent>
            </Field>
          )}
        </form.Field>

        <form.Field name="company">
          {(field) => (
            <Field data-invalid={field.state.meta.errors.length > 0}>
              <FieldLabel
                htmlFor={field.name}
                className="font-body text-xs font-medium uppercase tracking-wider text-landing-text-secondary"
              >
                Company or product (optional)
              </FieldLabel>
              <FieldContent>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  autoComplete="organization"
                  placeholder="Acme SaaS"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={cn(inputClassName)}
                  disabled={form.state.isSubmitting}
                />
                <FieldError
                  errors={field.state.meta.errors}
                  className="text-red-400"
                />
              </FieldContent>
            </Field>
          )}
        </form.Field>

        <form.Field name="message">
          {(field) => (
            <Field data-invalid={field.state.meta.errors.length > 0}>
              <FieldLabel
                htmlFor={field.name}
                className="font-body text-xs font-medium uppercase tracking-wider text-landing-text-secondary"
              >
                Tell us about your SaaS (optional)
              </FieldLabel>
              <FieldContent>
                <Textarea
                  id={field.name}
                  name={field.name}
                  placeholder="MRR, stack, what you'd like to recover..."
                  rows={3}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={cn(
                    inputClassName,
                    "min-h-[88px] resize-y py-3",
                  )}
                  disabled={form.state.isSubmitting}
                />
                <FieldError
                  errors={field.state.meta.errors}
                  className="text-red-400"
                />
              </FieldContent>
            </Field>
          )}
        </form.Field>
      </FieldGroup>

      <form.Subscribe>
        {(state) => (
          <Button
            type="submit"
            disabled={!state.canSubmit || state.isSubmitting}
            className="mt-2 h-12 w-full bg-landing-accent px-6 font-body text-sm font-semibold text-landing-bg transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,232,123,0.2)] disabled:opacity-60"
          >
            {state.isSubmitting ? "Joining…" : "Join the beta"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
