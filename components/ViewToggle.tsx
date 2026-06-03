'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Waypoints, Notebook } from 'lucide-react';

export function ViewToggle() {
    const router = useRouter();
    const graphView = usePathname() === '/graph';
    const columnView = usePathname() === '/column';

    return (
        <div
            className="flex border border-fd-border rounded-l"
            data-tour="view-toggle"
        >
            <button
                className="view-toggle-btn"
                data-active={graphView}
                onClick={() => router.push('/graph')}
            >
                <Waypoints size={16} />
            </button>
            <button
                className="view-toggle-btn"
                data-active={columnView}
                onClick={() => router.push('/column')}
            >
                <Notebook size={16} />
            </button>
        </div>
    );
}