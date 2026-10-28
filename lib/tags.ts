// Shared tag helpers. Kept free of server-only imports so both the
// frontmatter schema and client components can use them.

const MAX_TAG_LENGTH = 32;

// "#Machine Learning" → "machine-learning"
export function normalizeTag(rawTag: string): string {
  return rawTag
    .trim()
    .replace(/^#+/, '')
    .toLowerCase()
    .replace(/[^a-z0-9/]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, MAX_TAG_LENGTH);
}

// Accepts whatever Obsidian frontmatter holds (a list, a single string,
// or nothing) and returns unique, normalized tags
export function normalizeTags(rawTags: unknown): string[] {
  const tagList = Array.isArray(rawTags)
    ? rawTags
    : typeof rawTags === 'string'
      ? rawTags.split(/[,\s]+/)
      : [];

  const normalizedTags = tagList
    .filter((tag): tag is string => typeof tag === 'string')
    .map(normalizeTag)
    .filter(Boolean);

  return [...new Set(normalizedTags)];
}

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---(\r?\n|$)/;
// The `tags:` key plus its indented list items or inline value
const TAGS_BLOCK_PATTERN = /^tags:.*(?:\r?\n[ \t]+-.*)*/m;

function serializeTagsBlock(tags: string[]): string {
  if (tags.length === 0) return 'tags: []';
  return ['tags:', ...tags.map((tag) => `  - ${tag}`)].join('\n');
}

// Rewrites only the `tags` key so the rest of the frontmatter
// (Created Time, Parent, …) stays byte-for-byte untouched
export function setFrontmatterTags(markdown: string, tags: string[]): string {
  const tagsBlock = serializeTagsBlock(tags);
  const frontmatterMatch = markdown.match(FRONTMATTER_PATTERN);

  if (!frontmatterMatch) {
    if (tags.length === 0) return markdown;
    return `---\n${tagsBlock}\n---\n\n${markdown}`;
  }

  const frontmatterBody = frontmatterMatch[1];
  const updatedFrontmatterBody = TAGS_BLOCK_PATTERN.test(frontmatterBody)
    ? frontmatterBody.replace(TAGS_BLOCK_PATTERN, tagsBlock)
    : `${frontmatterBody}\n${tagsBlock}`;

  return markdown.replace(
    FRONTMATTER_PATTERN,
    `---\n${updatedFrontmatterBody}\n---${frontmatterMatch[2]}`,
  );
}

export interface TagGroupNote {
  url: string;
  title: string;
}

export interface TagGroup {
  tag: string;
  notes: TagGroupNote[];
}

// Largest groups first, ties broken alphabetically
export function groupNotesByTag(
  notes: (TagGroupNote & { tags: string[] })[],
): TagGroup[] {
  const notesByTag = new Map<string, TagGroupNote[]>();
  for (const { url, title, tags } of notes) {
    for (const tag of tags) {
      const groupNotes = notesByTag.get(tag) ?? [];
      groupNotes.push({ url, title });
      notesByTag.set(tag, groupNotes);
    }
  }

  return [...notesByTag]
    .map(([tag, groupNotes]) => ({
      tag,
      notes: groupNotes.sort((a, b) => a.title.localeCompare(b.title)),
    }))
    .sort(
      (a, b) => b.notes.length - a.notes.length || a.tag.localeCompare(b.tag),
    );
}
