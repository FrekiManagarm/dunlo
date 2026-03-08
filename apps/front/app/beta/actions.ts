"use server";

export type BetaSignupState =
  | { success: false; error?: string }
  | { success: true };

export async function submitBetaSignup(
  _prev: BetaSignupState | null,
  formData: FormData,
): Promise<BetaSignupState> {
  const email = formData.get("email")?.toString()?.trim();
  const company = formData.get("company")?.toString()?.trim() ?? null;
  const message = formData.get("message")?.toString()?.trim() ?? null;

  if (!email) {
    return { success: false, error: "Email is required." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  // TODO: persist to DB (e.g. beta_signups table) or send to Resend/Airtable
  // Example: await db.insert(betaSignups).values({ email, company, message });
  console.info("[Beta signup]", { email, company, message });

  return { success: true };
}
