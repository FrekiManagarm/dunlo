// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  blog: create.doc("blog", {"complete-guide-involuntary-churn-saas-2026.mdx": () => import("../content/blog/complete-guide-involuntary-churn-saas-2026.mdx?collection=blog"), "dunning-strategy-recovers-7-percent-mrr.mdx": () => import("../content/blog/dunning-strategy-recovers-7-percent-mrr.mdx?collection=blog"), "stripe-smart-retries-honest-review.mdx": () => import("../content/blog/stripe-smart-retries-honest-review.mdx?collection=blog"), }),
};
export default browserCollections;