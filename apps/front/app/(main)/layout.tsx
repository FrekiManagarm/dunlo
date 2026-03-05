import type { Metadata } from "next";
import { AppNavbar } from "@/components/app-navbar";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-svh grid-rows-[auto_1fr] bg-background dark">
      <AppNavbar />
      <main className="mx-auto w-full max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
