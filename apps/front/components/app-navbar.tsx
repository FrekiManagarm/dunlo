"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  AlertTriangle,
  Settings,
  LogOut,
  HelpCircle,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { DunloLogo } from "@/components/dunlo-logo";
import { UserGuideSheet } from "@/components/user-guide-sheet";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/escalations", label: "Escalations", icon: AlertTriangle },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppNavbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [guideOpen, setGuideOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("guide") === "1") {
      setGuideOpen(true);
      const params = new URLSearchParams(searchParams.toString());
      params.delete("guide");
      const newUrl = pathname + (params.size > 0 ? `?${params}` : "");
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  return (
    <>
    <UserGuideSheet open={guideOpen} onOpenChange={setGuideOpen} />
    <aside className="flex w-52 shrink-0 flex-col border-r border-border bg-background">
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-border px-5">
        <Link href="/dashboard">
          <DunloLogo sizeClassName="text-lg" wordmarkClassName="text-foreground" />
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex flex-1 flex-col gap-0.5 p-3 pt-4">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive =
            pathname === to ||
            (to === "/dashboard" && pathname.startsWith("/payment/"));

          return (
            <Link
              key={to}
              href={to}
              className={cn(
                "group flex items-center gap-3 rounded-none px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon
                className={cn(
                  "size-4 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground/60 group-hover:text-foreground",
                )}
              />
              {label}
              {isActive && (
                <span className="ml-auto size-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-border p-3">
        {session ? (
          <div className="flex flex-col gap-2 px-3 py-2">
            <p className="truncate text-[11px] text-muted-foreground">
              {session.user.email}
            </p>
            <div className="flex items-center justify-between">
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
                className="flex items-center gap-2 text-xs text-muted-foreground/60 transition-colors hover:text-destructive"
              >
                <LogOut className="size-3.5" />
                Sign out
              </button>
              <button
                type="button"
                onClick={() => setGuideOpen(true)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground/60 transition-colors hover:text-foreground"
              >
                <HelpCircle className="size-3.5" />
                Help
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </aside>
    </>
  );
}
