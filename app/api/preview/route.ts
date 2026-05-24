import { createCompiler } from '@fumadocs/mdx-remote';

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

const compiler = createCompiler({
  preset: 'fumadocs',
});

export async function POST(request: Request) {
  if (!IS_DEVELOPMENT) {
    return new Response('Not available', { status: 403 });
  }

  const { content } = await request.json();
  if (typeof content !== 'string') {
    return new Response('Invalid content', { status: 400 });
  }

  try {
    const result = await compiler.compile({ source: content });
    return new Response(
      JSON.stringify({ compiled: result.compiled }),
      { headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Preview compilation failed';
    return new Response(JSON.stringify({ error: message }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
