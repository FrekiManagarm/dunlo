<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Dunlo. Here is a summary of all changes made:

**New files created:**
- `instrumentation-client.ts` — Initializes PostHog client-side via Next.js 15.3+ instrumentation hook, with exception capture and proxy routing enabled.
- `lib/posthog-server.ts` — Singleton server-side PostHog client (`posthog-node`) for tracking events in API routes and Server Actions.

**Modified files:**
- `next.config.ts` — Added PostHog proxy rewrites (`/ingest/*`) and `skipTrailingSlashRedirect: true` to route analytics through the app domain (avoids ad blockers).
- `package.json` — Added `posthog-js` and `posthog-node` dependencies.
- `apps/front/.env.local` — Added `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`.

**Event tracking added to 7 files** — see table below.

| Event name | Description | File |
|---|---|---|
| `beta_signup_submitted` | User submitted the beta waitlist form successfully | `components/landing/beta-signup-form.tsx` |
| `user_signed_up` | New account created; also calls `posthog.identify()` | `components/auth/sign-up-form.tsx` |
| `user_signed_in` | User signed in; also calls `posthog.identify()` | `components/auth/sign-in-form.tsx` |
| `stripe_oauth_connect_initiated` | User clicked "Connect with Stripe" on onboarding | `app/(main)/onboarding/onboarding-client.tsx` |
| `stripe_api_key_connected` | User connected Stripe via API key | `app/(main)/onboarding/onboarding-client.tsx` |
| `onboarding_completed` | User finished onboarding config and started monitoring | `app/(main)/onboarding/onboarding-client.tsx` |
| `payment_marked_resolved` | Founder manually marked a payment as resolved | `app/(main)/payment/[id]/payment-detail-client.tsx` |
| `payment_escalated_manually` | Founder manually escalated a payment | `app/(main)/payment/[id]/payment-detail-client.tsx` |
| `escalation_resolved` | Founder marked an escalation as resolved | `app/(main)/escalations/escalations-client.tsx` |
| `settings_saved` | User saved their account settings | `app/(main)/settings/settings-client.tsx` |
| `stripe_disconnected` | User disconnected their Stripe account | `app/(main)/settings/settings-client.tsx` |
| `stripe_oauth_connected` | Server-side: Stripe OAuth flow completed successfully | `app/api/stripe/connect/fallback/route.ts` |
| `payment_failed_received` | Server-side: Stripe webhook received a payment failure | `app/api/webhooks/stripe/route.ts` |
| `payment_recovered_received` | Server-side: Stripe webhook received a payment recovery | `app/api/webhooks/stripe/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/387795/dashboard/1483820
- **Signup conversion funnel** (beta signup → account created → onboarding completed): https://us.posthog.com/project/387795/insights/lF78ykFj
- **New signups over time** (daily trend): https://us.posthog.com/project/387795/insights/LkiubhAy
- **Stripe connection funnel** (signup → Stripe initiated → connected → onboarding done): https://us.posthog.com/project/387795/insights/7wyCc3sy
- **Payment failures vs recoveries** (daily trend comparison): https://us.posthog.com/project/387795/insights/rG4Le5QX
- **Escalations resolved by founders** (weekly trend): https://us.posthog.com/project/387795/insights/dOVDDLWB

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
