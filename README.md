# notes

Personal notes site built with Next.js and [Fumadocs](https://fumadocs.dev).

```bash
pnpm dev         # http://localhost:3000
pnpm test        # vitest
pnpm format      # prettier
```

## Layout

| Path               | Description                                             |
| ------------------ | ------------------------------------------------------- |
| `content/docs`     | Markdown/MDX notes (Obsidian-style)                     |
| `source.config.ts` | Fumadocs MDX config: frontmatter schema, remark plugins |
| `lib/source.ts`    | Content source adapter                                  |
| `app/(home)`       | Landing page                                            |
| `app/note`         | Note pages                                              |
| `app/graph`        | Graph view                                              |
| `components/`      | UI components                                           |

## Bundle audit

Run `pnpm analyze` (webpack build with `@next/bundle-analyzer`). Reports are written to `.next/analyze/{client,nodejs,edge}.html`.

Findings (client, parsed size):

| Chunk contents              | Size (gzip)                        | Loaded                       |
| --------------------------- | ---------------------------------- | ---------------------------- |
| `three` (3D graph, several) | ~540 KB (149 KB), ~340 KB, ~310 KB | on demand via `next/dynamic` |
| `next` runtime / framework  | ~235 KB, ~200 KB, ~185 KB          | always                       |

Guidelines:

- Load heavy components and libraries with `next/dynamic` (graph views, tour, markdown editor).
- Import explicit named exports (`import { Mesh } from 'three'`), not `import * as`.
