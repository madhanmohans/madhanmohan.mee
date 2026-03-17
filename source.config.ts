import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { remarkWikilinks } from './lib/remark-wikilinks';
import { remarkStripHeadingLinks } from './lib/remark-strip-heading-links';
import { remarkMark } from 'remark-mark-highlight';
import path from 'node:path';
import rehypeRaw from 'rehype-raw';
import { visit } from 'unist-util-visit';

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
function remarkConvertMarkToHtml() {
  return function (tree: any) {
    visit(tree, 'mark', (node: any) => {
      const text = node.children?.[0]?.value || '';
      node.type = 'html';
      node.value = `<mark>${text}</mark>`;
      delete (node as any).children;
    });
  };
}

function remarkLowercaseCodeBlocks() {
  return function (tree: any) {
    visit(tree, 'code', (node: any) => {
      if (node.lang) {
        let lang = node.lang.toLowerCase();
        if (lang.startsWith('ad-')) {
          lang = 'text';
        }
        node.lang = lang;
      }
    });
  };
}

export default defineConfig({
  mdxOptions: {
    remarkImageOptions: false,
    remarkPlugins: [remarkWikilinks, remarkStripHeadingLinks, remarkMark, remarkConvertMarkToHtml, remarkLowercaseCodeBlocks],
    rehypePlugins: [
      [rehypeRaw, { passThrough: ['mdxjsEsm', 'mdxJsxFlowElement', 'mdxJsxTextElement', 'mdxFlowExpression', 'mdxTextExpression'] }]
    ]
  },
});
