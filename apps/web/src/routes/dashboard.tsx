import { createFileRoute, redirect } from "@tanstack/react-router";

import Header from "@/components/header";
import { getUser } from "@/functions/get-user";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await getUser();
    return { session };
  },
  loader: async ({ context }) => {
    if (!context.session) {
      throw redirect({
        to: "/login",
      });
    }
  },
});

function RouteComponent() {
  const { session } = Route.useRouteContext();

  return (
    <div className="grid h-svh grid-rows-[auto_1fr]">
      <Header />
      <div className="p-4">
        <h1>Dashboard</h1>
        <p>Welcome {session?.user.name}</p>
      </div>
    </div>
  );
}
