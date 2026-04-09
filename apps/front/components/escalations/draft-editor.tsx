"use client";

import { useState, useCallback } from "react";
import { Check, Copy, ExternalLink, ChevronDown } from "lucide-react";
import type { DraftMessage } from "@/lib/escalations/draft-generator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  draft: DraftMessage;
  customerEmail: string;
};

export function DraftEditor({ draft, customerEmail }: Props) {
  const [subject, setSubject] = useState(draft.subject);
  const [body, setBody] = useState(draft.body);
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(true);

  const wordCount = body.trim().split(/\s+/).filter(Boolean).length;
  const isOverLimit = wordCount > 100;

  const currentMailtoLink = `mailto:${customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [subject, body]);

  return (
    <div className="mt-3 border border-border/60 bg-background/40">
      {/* Header collapsible */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-white/[0.02]"
      >
        <div className="flex items-center gap-2">
          <span className="inline-block size-1.5 rounded-full bg-primary" />
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Draft ready to send
          </span>
        </div>
        <ChevronDown
          className={cn(
            "size-3.5 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="border-t border-border/60 px-4 pb-4 pt-3 space-y-3">
          {/* Subject */}
          <div>
            <label className="mb-1 block text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-border/60 bg-background/60 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none"
            />
          </div>

          {/* Body */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Message
              </label>
              <span
                className={cn(
                  "text-[10px] tabular-nums",
                  isOverLimit ? "text-destructive" : "text-muted-foreground",
                )}
              >
                {wordCount} / 100 words
              </span>
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              className="w-full resize-y border border-border/60 bg-background/60 px-3 py-2 font-mono text-xs leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none"
            />
            <p className="mt-1 text-[10px] text-muted-foreground">
              <span className="font-medium text-primary/80">{"{{update_link}}"}</span> → the card update link will be included automatically.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="size-3 text-primary" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  Copy
                </>
              )}
            </Button>
            <a
              href={currentMailtoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-primary px-3 py-1.5 text-xs font-semibold text-background transition-all hover:shadow-[0_0_20px_rgba(0,232,123,0.2)]"
            >
              <ExternalLink className="size-3" />
              Send from Gmail
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
