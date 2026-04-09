import type { Metadata } from "next";
import { AppNavbar } from "@/components/app-navbar";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-svh overflow-hidden bg-background dark">
      <AppNavbar />
      <main className="flex-1 overflow-y-auto px-8 py-10">{children}</main>
    </div>
  );
}
