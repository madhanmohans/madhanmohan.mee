
import { source } from '@/lib/source';
import { create, insert, search } from '@orama/orama';
import { NextResponse } from 'next/server';

let db: any = null;

async function getDB() {
  if (db) return db;
  
  db = await create({
    schema: {
      title: 'string',
      content: 'string',
      url: 'string',
    },
  });
  
  const pages = source.getPages();
  const seenIds = new Set<string>();
  
  for (const page of pages) {
    // Index the page itself
    if (!seenIds.has(page.url)) {
      seenIds.add(page.url);
      await insert(db, {
        id: page.url,
        title: String(page.data.title || 'Untitled'),
        content: String(page.data.description || ''),
        url: page.url,
      });
    }
    
    // Index headings
    const toc = page.data.toc || [];
    for (const item of toc) {
      const headingUrl = page.url + (item.url || '');
      if (!seenIds.has(headingUrl)) {
        seenIds.add(headingUrl);
        
        const extractText = (node: any): string => {
          if (typeof node === 'string') return node;
          if (Array.isArray(node)) return node.map(extractText).join('');
          if (node?.props?.children) return extractText(node.props.children);
          return '';
        };
        const titleText = extractText(item.title);
        
        await insert(db, {
          id: headingUrl,
          title: String(titleText || 'Heading'),
          content: '', 
          url: headingUrl,
        });
      }
    }
  }
  
  return db;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') ?? '';
  
    const database = await getDB();
    const results = await search(database, {
      term: query,
      limit: 10,
    });
  
    return NextResponse.json(
      results.hits.map(hit => {
        const doc = hit.document as any;
        return {
          id: hit.id,
          url: doc.url,
          type: hit.id.includes('#') ? 'heading' : 'page',
          content: doc.title,
        };
      })
    );
  } catch (error: any) {
    console.error('Search API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
