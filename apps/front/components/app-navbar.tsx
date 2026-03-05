"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  AlertTriangle,
  Settings,
  LogOut,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/escalations", label: "Escalations", icon: AlertTriangle },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppNavbar() {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  return (
    <nav className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-8">
        <Link href="/dashboard" className="font-display text-xl text-foreground">
          dunlo
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive =
              pathname === to ||
              (to === "/dashboard" && pathname.startsWith("/payment/"));

            return (
              <Link
                key={to}
                href={to}
                className={cn(
                  "inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-3.5" />
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isPending ? (
          <Skeleton className="h-5 w-24" />
        ) : session ? (
          <>
            <span className="text-xs text-muted-foreground">
              {session.user.email}
            </span>
            <button
              type="button"
              onClick={() => {
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      window.location.href = "/";
                    },
                  },
                });
              }}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-destructive"
            >
              <LogOut className="size-3" />
              Logout
            </button>
          </>
        ) : null}
      </div>
    </nav>
  );
}
