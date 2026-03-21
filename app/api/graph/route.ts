import { buildGraph } from '@/lib/build-graph';
import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json(buildGraph());
}
