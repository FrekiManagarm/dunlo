import type { Metadata } from "next";
import { CalculatorSection } from "@/components/landing/calculator";
import { FooterSection } from "@/components/landing/footer";
import { LandingNav } from "@/components/landing/landing-nav";

export const metadata: Metadata = {
  title: "Payment Recovery Calculator — Dunlo",
  description:
    "Calculate how much MRR you're losing to failed payments and how much Dunlo can recover for you automatically.",
  openGraph: {
    title: "Payment Recovery Calculator — Dunlo",
    description:
      "See exactly how much revenue failed payments are costing you — and how much Dunlo can get back.",
  },
};

export default function CalculatorPage() {
  return (
    <div className="landing-grain landing-grid-bg relative min-h-svh bg-landing-bg">
      <LandingNav />

      <div className="pt-16">
        <CalculatorSection />
      </div>

      <div className="mx-auto max-w-5xl px-6">
        <div className="h-px bg-linear-to-r from-transparent via-landing-border to-transparent" />
      </div>

      <FooterSection />
    </div>
  );
}
