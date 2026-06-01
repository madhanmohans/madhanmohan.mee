'use client';

import { usePathname } from 'next/navigation';

export function Background({ videoSource }: { videoSource: string }) {
  const isHomePage = usePathname() === '/';

  return (
    isHomePage && (
      <video autoPlay loop muted playsInline className="background">
        <source src={videoSource} type="video/mp4" />
      </video>
    )
  );
}
