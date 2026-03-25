"use server";

import { db } from "@dunlo/db";
import { betaSignup, NewBetaSignup } from "@dunlo/db/schema/beta-signup";
import { revalidatePath } from "next/cache";

export type BetaSignupState =
  | { success: false; error?: string }
  | { success: true };

export async function submitBetaSignup(
  _prev: BetaSignupState | null,
  formData: NewBetaSignup,
): Promise<BetaSignupState> {
  const { email, company, message } = formData;

  const [newBetaSignup] = await db.insert(betaSignup).values({ email, company, message }).returning();
  if (!newBetaSignup) {
    return { success: false, error: "Failed to sign up." };
  }

  revalidatePath("/beta");

  return { success: true };
}
