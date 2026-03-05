import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

export default function Loader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex min-h-[200px] flex-1 items-center justify-center",
        className,
      )}
    >
      <Loader2 className="size-6 animate-spin text-landing-accent" />
    </div>
  );
}
