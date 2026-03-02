import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

import Loader from "../loader";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function SignUpForm() {
  const navigate = useNavigate({
    from: "/",
  });
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
        },
        {
          onSuccess: () => {
            navigate({
              to: "/dashboard",
            });
            toast.success("Sign up successful");
          },
          onError: (error) => {
            toast.error(error.error.message ?? error.error.statusText);
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <>
      <h1
        className="auth-stagger mb-8 font-display text-2xl font-normal tracking-tight text-landing-text sm:text-3xl"
        style={{ animationDelay: "50ms" }}
      >
        Create your account
      </h1>
      <p
        className="auth-stagger mb-8 font-body text-sm text-landing-text-secondary"
        style={{ animationDelay: "100ms" }}
      >
        Join the beta — 10 minute setup, cancel anytime.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-5"
      >
        <div className="auth-stagger" style={{ animationDelay: "120ms" }}>
          <form.Field name="name">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="font-body text-xs font-medium text-landing-text-secondary">
                  Name
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  placeholder="Alex Chen"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="h-10 border-landing-border bg-landing-bg/50 font-body text-sm transition-colors placeholder:text-landing-text-muted focus-visible:border-landing-accent focus-visible:ring-landing-accent/30"
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-xs text-red-400">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div className="auth-stagger" style={{ animationDelay: "170ms" }}>
          <form.Field name="email">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="font-body text-xs font-medium text-landing-text-secondary">
                  Email
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  placeholder="you@example.com"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="h-10 border-landing-border bg-landing-bg/50 font-body text-sm transition-colors placeholder:text-landing-text-muted focus-visible:border-landing-accent focus-visible:ring-landing-accent/30"
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-xs text-red-400">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div className="auth-stagger" style={{ animationDelay: "220ms" }}>
          <form.Field name="password">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="font-body text-xs font-medium text-landing-text-secondary">
                  Password
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  placeholder="••••••••"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="h-10 border-landing-border bg-landing-bg/50 font-body text-sm transition-colors placeholder:text-landing-text-muted focus-visible:border-landing-accent focus-visible:ring-landing-accent/30"
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-xs text-red-400">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <form.Subscribe>
          {(state) => (
            <div className="auth-stagger pt-2" style={{ animationDelay: "270ms" }}>
              <Button
                type="submit"
                className="h-11 w-full font-body text-sm font-semibold bg-landing-accent text-landing-bg transition-all hover:shadow-[0_0_30px_rgba(0,232,123,0.2)] disabled:opacity-50"
                disabled={!state.canSubmit || state.isSubmitting}
              >
                {state.isSubmitting ? "Creating account…" : "Create account"}
              </Button>
            </div>
          )}
        </form.Subscribe>
      </form>
    </>
  );
}
