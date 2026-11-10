'use client';

import dynamic from 'next/dynamic';

// The editor pulls in the MDX preview pipeline, which is only needed once
// someone starts editing, so keep it out of the initial note bundle
export const LazyMarkdownEditor = dynamic(
  () => import('./MarkdownEditor').then((module) => module.MarkdownEditor),
  {
    ssr: false,
    loading: () => <div className="min-h-[70vh]" aria-busy="true" />,
  },
);
