import { logger, schedules } from "@trigger.dev/sdk/v3";
import { eq, and } from "drizzle-orm";
import { db } from "@dunlo/db";
import { users, stripeConnection } from "@dunlo/db/schema";
import { generateAndSendBrief } from "@/lib/morning-brief";

export const morningBriefTask = schedules.task({
  id: "morning-brief",
  cron: "0 7 * * *", // Every day at 7 AM UTC
  run: async () => {
    const enabledUsers = await db.query.users.findMany({
      where: eq(users.morningBriefEnabled, true),
      columns: {
        id: true,
        name: true,
        email: true,
        notificationEmail: true,
        escalationThreshold: true,
        slackWebhookUrl: true,
        morningBriefTime: true,
      },
    });

    logger.info("Starting morning brief run", { userCount: enabledUsers.length });

    const results = await Promise.allSettled(
      enabledUsers.map(async (user) => {
        const connection = await db.query.stripeConnection.findFirst({
          where: and(
            eq(stripeConnection.userId, user.id),
            eq(stripeConnection.isActive, true),
          ),
          columns: { accessToken: true },
        });

        await generateAndSendBrief(user, connection?.accessToken ?? null);

        logger.info("Brief sent", { userId: user.id });
      }),
    );

    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    for (const result of results) {
      if (result.status === "rejected") {
        logger.error("Brief failed for a user", { error: result.reason });
      }
    }

    return { succeeded, failed };
  },
});
