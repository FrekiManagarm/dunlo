// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  blog: create.doc("blog", {"recover-mrr-failed-payments.mdx": () => import("../content/blog/recover-mrr-failed-payments.mdx?collection=blog"), "welcome.mdx": () => import("../content/blog/welcome.mdx?collection=blog"), }),
};
export default browserCollections;