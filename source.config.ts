import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { remarkWikilinks } from './lib/remark-wikilinks';
import path from 'node:path';

// Convert a filename like "ideas-flowing-big" to "Ideas Flowing Big"
function filenameToTitle(filePath: string): string {
  const name = path.basename(filePath, path.extname(filePath));
  return name
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Schema function: receives { path, source } context from fumadocs-mdx.
// Derives a default title from the filename so files need neither
// a frontmatter `title` nor an H1 heading.
const frontmatterSchema = (ctx: { path: string; source: string }) =>
  pageSchema.extend({
    title: pageSchema.shape.title.default(filenameToTitle(ctx.path)),
  });

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: frontmatterSchema,
    postprocess: {
      includeProcessedMarkdown: true,
      extractLinkReferences: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkWikilinks],
  },
});
