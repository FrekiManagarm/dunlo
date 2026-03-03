import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AppNavbar } from "@/components/app-navbar";
import { getUser } from "@/functions/get-user";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  beforeLoad: async () => {
    const session = await getUser();
    if (!session) {
      throw redirect({ to: "/login", search: { mode: "sign-in" } });
    }
    return { session };
  },
});

function AppLayout() {
  return (
    <div className="dark grid min-h-svh grid-rows-[auto_1fr] bg-background">
      <AppNavbar />
      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
