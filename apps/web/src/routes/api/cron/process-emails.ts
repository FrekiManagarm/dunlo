import { createFileRoute } from "@tanstack/react-router";
import { env } from "@dunlo/env/server";
import { processPendingEmails } from "@/lib/email/process-emails";

export const Route = createFileRoute("/api/cron/process-emails")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Simple auth via secret header (for Vercel Cron or external cron)
        const authHeader = request.headers.get("authorization");
        if (authHeader !== `Bearer ${env.BETTER_AUTH_SECRET}`) {
          return new Response("Unauthorized", { status: 401 });
        }

        try {
          const result = await processPendingEmails();

          return new Response(
            JSON.stringify({
              success: true,
              ...result,
              processedAt: new Date().toISOString(),
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        } catch (error) {
          console.error("❌ Cron process-emails failed:", error);
          return new Response(
            JSON.stringify({ success: false, error: "Internal error" }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      },
    },
  },
});
