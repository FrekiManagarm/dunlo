import { Resend } from "resend";
import { env } from "@dunlo/env/server";

let _resendClient: Resend | null = null;

export function getResendClient(): Resend {
  if (!_resendClient) {
    _resendClient = new Resend(env.RESEND_API_KEY);
  }
  return _resendClient;
}
