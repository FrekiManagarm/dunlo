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
  ArrowUpRight,
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

function UserInitials({ name, email }: { name?: string | null; email?: string | null }) {
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : email?.slice(0, 2).toUpperCase() ?? "??";
  return (
    <span className="flex size-7 shrink-0 items-center justify-center border border-primary/30 bg-primary/10 font-mono text-[10px] font-semibold text-primary">
      {initials}
    </span>
  );
}

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
      <aside className="flex w-52 shrink-0 flex-col border-r border-white/[0.05] bg-[#040404]">
        {/* Logo */}
        <div className="flex h-[3.5rem] items-center border-b border-white/[0.05] px-5">
          <Link href="/dashboard" className="transition-opacity hover:opacity-75">
            <DunloLogo sizeClassName="text-lg" wordmarkClassName="text-foreground" />
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-px p-2.5 pt-3">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive =
              pathname === to ||
              (to === "/dashboard" && pathname.startsWith("/payment/"));

            return (
              <Link
                key={to}
                href={to}
                className={cn(
                  "group relative flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium transition-all duration-200",
                  isActive
                    ? "bg-white/[0.04] text-foreground"
                    : "text-muted-foreground hover:bg-white/[0.025] hover:text-foreground",
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 bg-primary" />
                )}
                <Icon
                  className={cn(
                    "size-[15px] shrink-0 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground/50 group-hover:text-muted-foreground",
                  )}
                  strokeWidth={isActive ? 2 : 1.75}
                />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-white/[0.05] p-2.5">
          {session ? (
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2.5 px-2.5 py-2">
                <UserInitials name={session.user.name} email={session.user.email} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-medium text-foreground">
                    {session.user.name ?? "Account"}
                  </p>
                  <p className="truncate text-[10px] text-muted-foreground">
                    {session.user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-px">
                <button
                  type="button"
                  onClick={() => setGuideOpen(true)}
                  className="flex flex-1 items-center gap-1.5 px-2.5 py-1.5 text-[11px] text-muted-foreground/60 transition-colors hover:text-foreground"
                >
                  <HelpCircle className="size-3" strokeWidth={1.5} />
                  Help
                </button>
                <button
                  type="button"
                  onClick={() => {
                    authClient.signOut({
                      fetchOptions: {
                        onSuccess: () => { window.location.href = "/"; },
                      },
                    });
                  }}
                  className="flex flex-1 items-center justify-end gap-1.5 px-2.5 py-1.5 text-[11px] text-muted-foreground/60 transition-colors hover:text-destructive"
                >
                  <LogOut className="size-3" strokeWidth={1.5} />
                  Sign out
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </aside>
    </>
  );
}
