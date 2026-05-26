import { source } from '@/lib/source';
import { create, insert, search, type AnyOrama } from '@orama/orama';
import { NextResponse } from 'next/server';

let searchDatabase: AnyOrama | null = null;

async function getSearchDatabase(): Promise<AnyOrama> {
  if (searchDatabase) return searchDatabase;

  searchDatabase = await create({
    schema: {
      title: 'string',
      content: 'string',
      url: 'string',
    },
  });

  const pages = source.getPages();
  const indexedDocumentIds = new Set<string>();

  for (const page of pages) {
    if (!indexedDocumentIds.has(page.url)) {
      indexedDocumentIds.add(page.url);
      await insert(searchDatabase, {
        id: page.url,
        title: String(page.data.title || 'Untitled'),
        content: String(page.data.description || ''),
        url: page.url,
      });
    }

    const tableOfContents = page.data.toc || [];
    for (const tocItem of tableOfContents) {
      const headingAnchorUrl = page.url + (tocItem.url || '');
      if (!indexedDocumentIds.has(headingAnchorUrl)) {
        indexedDocumentIds.add(headingAnchorUrl);

        const extractTextFromReactNode = (node: unknown): string => {
          if (typeof node === 'string') return node;
          if (Array.isArray(node))
            return node.map(extractTextFromReactNode).join('');
          if (node && typeof node === 'object' && 'props' in node) {
            const props = (node as Record<string, unknown>).props as Record<
              string,
              unknown
            >;
            if (props?.children)
              return extractTextFromReactNode(props.children);
          }
          return '';
        };
        const headingTitle = extractTextFromReactNode(tocItem.title);

        await insert(searchDatabase, {
          id: headingAnchorUrl,
          title: String(headingTitle || 'Heading'),
          content: '',
          url: headingAnchorUrl,
        });
      }
    }
  }

  return searchDatabase;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') ?? '';

    const database = await getSearchDatabase();
    const searchResults = await search(database, {
      term: query,
      limit: 10,
    });

    return NextResponse.json(
      searchResults.hits.map((hit) => {
        const document = hit.document;
        return {
          id: hit.id,
          url: String(document.url),
          type: hit.id.includes('#') ? 'heading' : 'page',
          content: String(document.title),
        };
      }),
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown search error';
    console.error('Search API Error:', errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
