import { buildGraph } from '@/lib/build-graph';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(await buildGraph());
}
