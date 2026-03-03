import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Reveal } from "./reveal";

export function FooterSection() {
  return (
    <footer className="relative px-6 pb-16 pt-32 md:pt-44">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <h2 className="font-display text-4xl leading-[1.1] text-landing-text md:text-6xl lg:text-7xl">
              Stop losing revenue.
              <br />
              <span className="italic text-landing-accent">
                Start recovering it.
              </span>
            </h2>

            <Link
              to="/login"
              search={{ mode: "sign-up" }}
              className="group mt-12 inline-flex items-center gap-3 bg-landing-accent px-8 py-4 font-body text-base font-semibold text-landing-bg transition-all duration-300 hover:shadow-[0_0_50px_rgba(0,232,123,0.25)]"
            >
              Join the beta
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-32 flex flex-col items-center gap-6 border-t border-landing-border pt-10 md:flex-row md:justify-between">
          <div className="flex items-center gap-8">
            <span className="font-display text-xl text-landing-text">dunlo</span>
            <Link
              to="/blog"
              className="text-xs text-landing-text-muted transition-colors hover:text-landing-text"
            >
              Blog
            </Link>
          </div>
          <span className="font-body text-xs text-landing-text-muted">
            © {new Date().getFullYear()} Dunlo. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
