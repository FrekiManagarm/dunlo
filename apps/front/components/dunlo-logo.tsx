import { cn } from "@/lib/utils";

interface DunloLogoProps {
  className?: string;
  /** Pass Tailwind text-size classes (e.g. "text-xl", "text-2xl") */
  sizeClassName?: string;
  /** Color for the "unlo" part of the wordmark */
  wordmarkClassName?: string;
}

/**
 * Split wordmark: the "d" lives inside a vivid green box (sharp corners),
 * "unlo" follows in the regular text color.
 *
 * The green box is small, precise, and typographic — not an app icon.
 * It creates an instant visual anchor without ambiguity.
 */
export function DunloLogo({
  className,
  sizeClassName = "text-xl",
  wordmarkClassName,
}: DunloLogoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-0 font-display leading-none",
        sizeClassName,
        className,
      )}
    >
      {/* The "d" — green box, italic, tight padding */}
      <span className="inline-flex items-center bg-[#00e87b] px-[0.22em] py-[0.08em] font-display italic text-[#040404]">
        d
      </span>
      {/* "unlo" — immediately follows, no gap */}
      <span className={cn("font-display", wordmarkClassName)}>unlo</span>
    </span>
  );
}
