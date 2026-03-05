"use server";

import { cookies } from "next/headers";
import { auth } from "@dunlo/auth";

export async function getSession() {
  const cookieStore = await cookies();
  const session = await auth.api.getSession({
    headers: new Headers({
      cookie: cookieStore.toString(),
    }),
  });
  return session;
}
