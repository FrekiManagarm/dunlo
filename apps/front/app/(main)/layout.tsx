import type { Metadata } from "next";
import { Suspense } from "react";
import { AppNavbar } from "@/components/app-navbar";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-svh overflow-hidden bg-[#040404] dark">
      <Suspense fallback={null}>
        <AppNavbar />
      </Suspense>
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-8 py-10">{children}</div>
      </main>
    </div>
  );
}
