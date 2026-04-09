"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown, Zap } from "lucide-react";

const fmt = (n: number, currency = "EUR") =>
  new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

function Slider({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-xs font-medium text-landing-text-secondary">
          {label}
        </label>
        <span className="font-mono text-sm font-semibold text-landing-accent">
          {format(value)}
        </span>
      </div>
      <div className="relative h-1 w-full bg-landing-border/60">
        <div
          className="absolute left-0 top-0 h-full bg-landing-accent/40"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        <div
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 size-3 rounded-full border-2 border-landing-accent bg-landing-bg"
          style={{ left: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function ResultCard({
  label,
  value,
  sub,
  accent,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div
      className={`border p-6 ${accent ? "border-landing-accent/40 bg-landing-accent/5" : "border-landing-border bg-landing-surface/30"}`}
    >
      <div className="mb-1 flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-widest text-landing-text-secondary">
          {label}
        </p>
        {Icon && (
          <Icon
            className={`size-4 ${accent ? "text-landing-accent" : "text-landing-text-muted"}`}
          />
        )}
      </div>
      <p
        className={`font-display text-3xl font-semibold ${accent ? "text-landing-accent" : "text-landing-text"}`}
      >
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-landing-text-muted">{sub}</p>}
    </div>
  );
}

export function CalculatorSection() {
  const [mrr, setMrr] = useState(15_000);
  const [failureRate, setFailureRate] = useState(7);
  const [currentRecovery, setCurrentRecovery] = useState(30);

  const results = useMemo(() => {
    const failedRevenue = Math.round((mrr * failureRate) / 100);
    const currentlyRecovered = Math.round(
      (failedRevenue * currentRecovery) / 100,
    );
    const currentlyLost = failedRevenue - currentlyRecovered;
    const dunloRecovery = Math.round(failedRevenue * 0.75);
    const additionalRecovery = Math.max(0, dunloRecovery - currentlyRecovered);
    const paybackDays =
      additionalRecovery > 0
        ? Math.max(1, Math.round(49 / (additionalRecovery / 30)))
        : null;

    return {
      failedRevenue,
      currentlyLost,
      dunloRecovery,
      additionalRecovery,
      paybackDays,
    };
  }, [mrr, failureRate, currentRecovery]);

  return (
    <section className="relative px-6 py-32 md:py-44">
      <div className="mx-auto max-w-5xl">
        <span className="font-body text-xs font-medium uppercase tracking-[0.25em] text-landing-accent">
          Recovery calculator
        </span>

        <h2 className="mt-6 max-w-2xl font-display text-4xl leading-[1.1] text-landing-text md:text-6xl">
          How much are you{" "}
          <span className="italic text-landing-accent">leaving on the table?</span>
        </h2>

        <p className="mt-6 max-w-xl font-body text-lg text-landing-text-secondary">
          Adjust the sliders to your numbers and see exactly how much Dunlo
          could recover for you.
        </p>

        <div className="mt-16 grid gap-10 lg:grid-cols-2">
          {/* Inputs */}
          <div className="space-y-8 border border-landing-border bg-landing-surface/20 p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-landing-text-muted">
              Your numbers
            </p>

            <Slider
              label="Monthly Recurring Revenue"
              value={mrr}
              min={1_000}
              max={200_000}
              step={1_000}
              format={(v) => fmt(v)}
              onChange={setMrr}
            />

            <Slider
              label="Payment failure rate (industry avg: 7%)"
              value={failureRate}
              min={1}
              max={25}
              step={1}
              format={(v) => `${v}%`}
              onChange={setFailureRate}
            />

            <Slider
              label="Your current recovery rate"
              value={currentRecovery}
              min={0}
              max={90}
              step={5}
              format={(v) => `${v}%`}
              onChange={setCurrentRecovery}
            />

            <div className="border-t border-landing-border/50 pt-4">
              <p className="text-[11px] text-landing-text-muted">
                Based on Dunlo achieving a{" "}
                <span className="font-semibold text-landing-accent">75%</span>{" "}
                recovery rate across all failure types.
              </p>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-landing-text-muted">
              Your recovery potential
            </p>

            <ResultCard
              label="Currently failing each month"
              value={fmt(results.failedRevenue)}
              sub={`${failureRate}% of your MRR`}
              icon={TrendingDown}
            />

            <ResultCard
              label="You're currently losing"
              value={fmt(results.currentlyLost)}
              sub={`With a ${currentRecovery}% recovery rate`}
            />

            <ResultCard
              label="Dunlo could recover"
              value={`+${fmt(results.additionalRecovery)}`}
              sub={
                results.paybackDays != null
                  ? `Dunlo pays for itself in ${results.paybackDays} days`
                  : "Start recovering today"
              }
              accent
              icon={TrendingUp}
            />

            {results.paybackDays != null && (
              <div className="flex items-center gap-3 border border-landing-accent/20 bg-landing-accent/5 px-4 py-3">
                <Zap className="size-4 shrink-0 text-landing-accent" />
                <p className="text-sm text-landing-text-secondary">
                  At{" "}
                  <span className="font-semibold text-landing-text">€49/mo</span>
                  , Dunlo pays for itself in{" "}
                  <span className="font-semibold text-landing-accent">
                    {results.paybackDays} days.
                  </span>
                </p>
              </div>
            )}

            <Link
              href="/beta"
              className="group flex w-full items-center justify-center gap-3 bg-landing-accent px-6 py-4 font-body text-sm font-semibold text-landing-bg transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,232,123,0.2)]"
            >
              Start recovering — join the beta
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
