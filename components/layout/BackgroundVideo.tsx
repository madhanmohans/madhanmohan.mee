'use client';

import { usePathname } from 'next/navigation';

// Matches the .background breakpoint in global.css: phones never load the video
const VIDEO_MEDIA = '(min-width: 641px)';

export function BackgroundVideo({ videoSource }: { videoSource: string }) {
  const isHomePage = usePathname() === '/';

  return (
    isHomePage && (
      <video autoPlay loop muted playsInline className="background">
        <source src={videoSource} type="video/mp4" media={VIDEO_MEDIA} />
      </video>
    )
  );
}
