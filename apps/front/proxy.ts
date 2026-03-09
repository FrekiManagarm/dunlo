import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { eq, and } from "drizzle-orm";
import { auth } from "@dunlo/auth";
import { db } from "@dunlo/db";
import { stripeConnection } from "@dunlo/db/schema";

const PROTECTED_PATHS = [
  "/dashboard",
  "/settings",
  "/escalations",
  "/onboarding",
  "/payment",
];

const REQUIRES_STRIPE = ["/dashboard", "/settings", "/escalations", "/payment"];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

function pathRequiresStripe(pathname: string): boolean {
  return REQUIRES_STRIPE.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

export default async function authProxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathRequiresStripe(pathname)) {
    const connection = await db.query.stripeConnection.findFirst({
      where: and(
        eq(stripeConnection.userId, session.user.id),
        eq(stripeConnection.isActive, true),
      ),
    });
    if (!connection) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
