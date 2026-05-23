import { buildGraph } from '@/lib/build-graph';
import { NextResponse } from 'next/server';

export async function GET() {
  const graph = await buildGraph();
  return NextResponse.json(graph);
}
