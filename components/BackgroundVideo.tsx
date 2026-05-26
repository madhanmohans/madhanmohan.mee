'use client';

import { usePathname } from 'next/navigation';

export function GrainyBackground() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  if (isHome) {
    return (
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 z-0 w-full h-full object-cover pointer-events-none grainy-bg"
      >
        <source src="/bg.mp4" type="video/mp4" />
      </video>
    );
  }
}
