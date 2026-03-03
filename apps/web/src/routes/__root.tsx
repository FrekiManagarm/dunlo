import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { RootProvider } from "fumadocs-ui/provider/tanstack";

import { Toaster } from "@/components/ui/sonner";
import {
  SEO_DEFAULTS,
  SITE_URL,
  getOpenGraphMeta,
  getSoftwareApplicationSchema,
  getTwitterMeta,
} from "@/lib/seo";

import appCss from "../index.css?url";

export interface RouterAppContext {}

const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap";

export const Route = createRootRouteWithContext<RouterAppContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: SEO_DEFAULTS.title },
      { name: "description", content: SEO_DEFAULTS.description },
      { name: "keywords", content: SEO_DEFAULTS.keywords },
      { name: "robots", content: "index, follow" },
      { name: "theme-color", content: "#0a0a0a" },
      ...getOpenGraphMeta({
        title: SEO_DEFAULTS.title,
        description: SEO_DEFAULTS.description,
        url: SITE_URL,
      }),
      ...getTwitterMeta({
        title: SEO_DEFAULTS.title,
        description: SEO_DEFAULTS.description,
      }),
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
    ],
    links: [
      { rel: "canonical", href: SITE_URL },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous" as const,
      },
      { rel: "stylesheet", href: GOOGLE_FONTS_URL },
      { rel: "stylesheet", href: appCss },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(getSoftwareApplicationSchema()),
      },
    ],
  }),

  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="min-h-svh">
          <RootProvider>
            <Outlet />
          </RootProvider>
        </div>
        <Toaster richColors />
        <TanStackRouterDevtools position="bottom-left" />
        <Scripts />
      </body>
    </html>
  );
}
