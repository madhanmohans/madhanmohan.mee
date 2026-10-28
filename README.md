# notes

Personal notes site built with Next.js and [Fumadocs](https://fumadocs.dev).

```bash
npm run dev       # http://localhost:3000
npm test          # vitest
npm run format    # prettier
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
