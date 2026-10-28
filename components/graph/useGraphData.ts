'use client';

import { useEffect, useState } from 'react';
import { GRAPH_API_URL } from './constants';
import type { Graph } from './types';

// Shared across mounts so navigating between graph views reuses the last
// response instead of waiting on a fresh fetch
let cachedGraph: Graph | null = null;
let pendingRequest: Promise<Graph> | null = null;

function requestGraph(): Promise<Graph> {
  pendingRequest ??= fetch(GRAPH_API_URL)
    .then((response) => response.json())
    .then((data: Graph) => {
      // Keep the old reference when nothing changed so the graph doesn't
      // re-run its layout simulation
      if (cachedGraph && JSON.stringify(data) === JSON.stringify(cachedGraph)) {
        return cachedGraph;
      }
      cachedGraph = data;
      return data;
    })
    .finally(() => {
      pendingRequest = null;
    });
  return pendingRequest;
}

export function resetGraphDataCache() {
  cachedGraph = null;
  pendingRequest = null;
}

// Uses the given graph when present, otherwise serves the cached graph and
// revalidates it against the API (notes can change between visits).
export function useGraphData(initialGraph?: Graph): Graph | null {
  const [fetchedGraph, setFetchedGraph] = useState<Graph | null>(cachedGraph);

  useEffect(() => {
    if (initialGraph) return;
    let isActive = true;
    requestGraph()
      .then((data) => {
        if (isActive) setFetchedGraph(data);
      })
      .catch(() => {});
    return () => {
      isActive = false;
    };
  }, [initialGraph]);

  return initialGraph ?? fetchedGraph;
}
