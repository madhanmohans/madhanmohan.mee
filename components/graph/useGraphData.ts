'use client';

import { useEffect, useState } from 'react';
import { GRAPH_API_URL } from './constants';
import type { Graph } from './types';

// Uses the given graph when present, otherwise fetches it from the API.
export function useGraphData(initialGraph?: Graph): Graph | null {
  const [fetchedGraph, setFetchedGraph] = useState<Graph | null>(null);

  useEffect(() => {
    if (initialGraph) return;
    fetch(GRAPH_API_URL)
      .then((response) => response.json())
      .then((data: Graph) => setFetchedGraph(data))
      .catch(() => {});
  }, [initialGraph]);

  return initialGraph ?? fetchedGraph;
}
