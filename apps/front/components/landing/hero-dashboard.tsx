import { TrendingUp, Zap } from "lucide-react";

type Status = "emailing" | "recovering" | "escalated";

const PAYMENTS: {
  company: string;
  amount: string;
  reason: string;
  status: Status;
  step: string;
}[] = [
  {
    company: "Proxima SaaS",
    amount: "€240",
    reason: "card_expired",
    status: "emailing",
    step: "J+0",
  },
  {
    company: "Orbital Labs",
    amount: "€490",
    reason: "insufficient_funds",
    status: "recovering",
    step: "J+3",
  },
  {
    company: "Meridian HQ",
    amount: "€1,200",
    reason: "auth_required",
    status: "escalated",
    step: "J+7",
  },
];

const STATUS_CFG: Record<
  Status,
  { label: string; dotCls: string; textCls: string; bgCls: string }
> = {
  emailing: {
    label: "Emailing",
    dotCls: "bg-sky-400",
    textCls: "text-sky-400",
    bgCls: "bg-sky-400/10",
  },
  recovering: {
    label: "Recovering",
    dotCls: "bg-landing-accent",
    textCls: "text-landing-accent",
    bgCls: "bg-landing-accent/10",
  },
  escalated: {
    label: "Escalated",
    dotCls: "bg-orange-400",
    textCls: "text-orange-400",
    bgCls: "bg-orange-400/10",
  },
};

const STATS = [
  { label: "Recovery rate", value: "73.4%", cls: "text-landing-text" },
  { label: "Pending", value: "4", cls: "text-landing-text" },
  { label: "Escalated", value: "1", cls: "text-orange-400" },
] as const;

export function HeroDashboard() {
  return (
    <div className="hero-dashboard-float relative">
      {/* Ambient glow under card */}
      <div
        className="pointer-events-none absolute -bottom-12 left-1/2 h-48 w-4/5 -translate-x-1/2 rounded-full bg-landing-accent/5 blur-3xl"
        aria-hidden
      />

      <div className="relative overflow-hidden border border-white/[0.07] bg-landing-surface/40 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl">
        {/* Browser chrome */}
        <div className="flex items-center gap-3 border-b border-white/[0.06] bg-landing-bg/50 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="size-[9px] rounded-full bg-[#ff5f57]" />
            <div className="size-[9px] rounded-full bg-[#febc2e]" />
            <div className="size-[9px] rounded-full bg-[#28c840]" />
          </div>
          <div className="flex flex-1 justify-center">
            <div className="flex items-center gap-1.5 rounded-sm bg-white/[0.05] px-3 py-1 font-mono text-[11px] text-landing-text-muted">
              <span className="size-1.5 rounded-full bg-landing-accent opacity-70" />
              dunlo.io/dashboard
            </div>
          </div>
          <div className="flex items-center gap-1.5 font-body text-[11px] text-landing-accent">
            <span className="size-1.5 animate-pulse rounded-full bg-landing-accent" />
            Live
          </div>
        </div>

        {/* KPI row + sparkline */}
        <div className="border-b border-white/[0.06] px-5 py-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="mb-1 font-body text-[11px] uppercase tracking-[0.15em] text-landing-text-muted">
                Recovered today
              </p>
              <p className="hero-metric-shimmer font-display text-[2.25rem] leading-none tabular-nums text-landing-accent">
                €1,247
              </p>
            </div>
            <div className="flex items-center gap-1.5 rounded-sm bg-landing-accent/10 px-2.5 py-1.5">
              <TrendingUp className="size-3 text-landing-accent" />
              <span className="font-body text-[11px] font-semibold text-landing-accent">
                +3 payments
              </span>
            </div>
          </div>

          {/* SVG sparkline */}
          <div className="mt-4 h-12">
            <svg
              viewBox="0 0 240 48"
              fill="none"
              preserveAspectRatio="none"
              className="h-full w-full"
              aria-hidden
            >
              <defs>
                <linearGradient
                  id="hero-area-grad"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#00e87b" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#00e87b" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Area fill */}
              <path
                d="M 0 42 C 20 42 20 30 40 30 C 60 30 60 36 80 36 C 100 36 100 20 120 20 C 140 20 140 26 160 26 C 180 26 180 12 200 12 C 220 12 220 5 240 5 L 240 48 L 0 48 Z"
                fill="url(#hero-area-grad)"
              />
              {/* Stroke line with draw animation */}
              <path
                d="M 0 42 C 20 42 20 30 40 30 C 60 30 60 36 80 36 C 100 36 100 20 120 20 C 140 20 140 26 160 26 C 180 26 180 12 200 12 C 220 12 220 5 240 5"
                stroke="#00e87b"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="chart-line-draw"
              />
            </svg>
          </div>

          <div className="mt-1 flex justify-between">
            <span className="font-mono text-[9px] text-landing-text-muted/40">
              −6d
            </span>
            <span className="font-mono text-[9px] text-landing-text-muted/40">
              today
            </span>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 divide-x divide-white/[0.06] border-b border-white/[0.06]">
          {STATS.map((s) => (
            <div key={s.label} className="px-5 py-3">
              <p className="mb-0.5 font-body text-[10px] uppercase tracking-[0.12em] text-landing-text-muted">
                {s.label}
              </p>
              <p
                className={`font-body text-sm font-semibold tabular-nums ${s.cls}`}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Payment rows */}
        <div className="divide-y divide-white/[0.04] px-5 py-0.5">
          {PAYMENTS.map((p, i) => {
            const s = STATUS_CFG[p.status];
            return (
              <div
                key={p.company}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-body text-[13px] font-medium text-landing-text">
                    {p.company}
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] text-landing-text-muted">
                    {p.reason} · {p.step}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2.5">
                  <span className="font-body text-sm font-semibold tabular-nums text-landing-text">
                    {p.amount}
                  </span>
                  <div className={`flex items-center gap-1.5 px-2 py-0.5 ${s.bgCls}`}>
                    <span
                      className={`size-1.5 animate-pulse rounded-full ${s.dotCls}`}
                      style={{ animationDelay: `${i * 320}ms` }}
                    />
                    <span
                      className={`font-body text-[10px] font-semibold uppercase tracking-wide ${s.textCls}`}
                    >
                      {s.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer bar */}
        <div className="flex items-center gap-2 border-t border-white/[0.06] bg-landing-bg/30 px-5 py-2.5">
          <Zap className="size-3 shrink-0 text-landing-accent" />
          <p className="font-body text-[11px] text-landing-text-muted">
            J+3 sequence triggered · Proxima SaaS · card update link sent
          </p>
        </div>

        {/* Subtle bottom integration fade */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-landing-bg/20 to-transparent"
          aria-hidden
        />
      </div>
    </div>
  );
}
