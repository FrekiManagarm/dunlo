import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AuthLayout } from "@/components/auth/auth-layout";
import SignInForm from "@/components/auth/sign-in-form";
import SignUpForm from "@/components/auth/sign-up-form";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <AuthLayout showSignIn={showSignIn} onSwitch={() => setShowSignIn(!showSignIn)}>
      {showSignIn ? <SignInForm /> : <SignUpForm />}
    </AuthLayout>
  );
}
