const STATS = [
  { value: "€800+", label: "avg monthly recovery" },
  { value: "5 min", label: "Stripe setup" },
  { value: "3-step", label: "email sequences" },
  { value: "Real-time", label: "failure detection" },
  { value: "0%", label: "of MRR taken" },
  { value: "J+0, J+3, J+7", label: "automated timeline" },
];

export function StatsBar() {
  return (
    <div className="l-ticker-wrapper relative overflow-hidden border-y border-landing-border">
      <div className="l-ticker-track">
        {[...STATS, ...STATS].map((stat, i) => (
          <div
            key={i}
            className="flex shrink-0 items-center gap-4 border-r border-landing-border px-10 py-5"
          >
            <span className="font-display text-2xl text-landing-text">
              {stat.value}
            </span>
            <span className="font-body text-xs uppercase tracking-[0.15em] text-landing-text-muted">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
