// @ts-nocheck
import * as __fd_glob_1 from "../content/blog/welcome.mdx?collection=blog"
import * as __fd_glob_0 from "../content/blog/recover-mrr-failed-payments.mdx?collection=blog"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const blog = await create.doc("blog", "content/blog", {"recover-mrr-failed-payments.mdx": __fd_glob_0, "welcome.mdx": __fd_glob_1, });