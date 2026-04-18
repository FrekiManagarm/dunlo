"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import posthog from "posthog-js";

import { Button } from "@/components/ui/button";

export function PaymentDetailClient({
  paymentId,
  isEscalated,
  markPaymentResolved,
  escalatePayment,
}: {
  paymentId: string;
  isEscalated: boolean;
  markPaymentResolved: (paymentId: string) => Promise<unknown>;
  escalatePayment: (paymentId: string) => Promise<unknown>;
}) {
  const router = useRouter();

  async function handleResolve() {
    await markPaymentResolved(paymentId);
    posthog.capture("payment_marked_resolved", { payment_id: paymentId });
    router.refresh();
  }

  async function handleEscalate() {
    await escalatePayment(paymentId);
    posthog.capture("payment_escalated_manually", { payment_id: paymentId });
    router.refresh();
  }

  return (
    <div className="flex gap-3">
      <Button
        variant="default"
        size="lg"
        className="gap-2"
        onClick={handleResolve}
      >
        <CheckCircle2 className="size-3.5" />
        Mark as resolved
      </Button>
      {!isEscalated && (
        <Button
          variant="outline"
          size="lg"
          className="gap-2"
          onClick={handleEscalate}
        >
          <AlertTriangle className="size-3.5" />
          Escalate manually
        </Button>
      )}
    </div>
  );
}
