import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "./reveal";
import { DunloLogo } from "@/components/dunlo-logo";

export function FooterSection() {
  return (
    <footer className="relative px-6 pb-16 pt-32 md:px-10 md:pt-44">
      <div className="mx-auto max-w-7xl">

        {/* CTA block */}
        <Reveal>
          <div className="grid grid-cols-1 gap-10 border border-landing-border bg-landing-surface/20 p-10 md:grid-cols-[1fr_auto] md:items-center md:p-16">
            <div>
              <h2 className="font-display text-4xl leading-[1.08] text-landing-text md:text-5xl lg:text-6xl">
                Stop losing revenue.
                <br />
                <span className="italic text-landing-accent">
                  Start recovering it.
                </span>
              </h2>
              <p className="mt-5 max-w-lg font-body text-base leading-relaxed text-landing-text-secondary">
                Founders lose an average of €800/mo to failed payments. Dunlo
                pays for itself from day one — free during beta.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <Link
                href="/beta"
                className="group inline-flex items-center gap-3 bg-landing-accent px-8 py-4 font-body text-base font-semibold text-landing-bg transition-all duration-300 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] active:scale-[0.98]"
              >
                Join the beta — free
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <p className="font-body text-xs text-landing-text-muted">
                5 min setup · No credit card · Cancel anytime
              </p>
            </div>
          </div>
        </Reveal>

        {/* Footer bar */}
        <div className="mt-16 flex flex-col items-start gap-6 border-t border-landing-border pt-10 md:flex-row md:items-center md:justify-between">
          <DunloLogo
            sizeClassName="text-xl"
            wordmarkClassName="text-landing-text"
          />
          <nav className="flex flex-wrap items-center gap-6">
            <a
              href="#pricing"
              className="font-body text-xs text-landing-text-muted transition-colors hover:text-landing-text-secondary"
            >
              Pricing
            </a>
            <Link
              href="/blog"
              className="font-body text-xs text-landing-text-muted transition-colors hover:text-landing-text-secondary"
            >
              Blog
            </Link>
            <Link
              href="/cgu"
              className="font-body text-xs text-landing-text-muted transition-colors hover:text-landing-text-secondary"
            >
              Terms
            </Link>
            <span className="font-body text-xs text-landing-text-muted">
              © {new Date().getFullYear()} Dunlo. All rights reserved.
            </span>
          </nav>
        </div>
      </div>
    </footer>
  );
}
