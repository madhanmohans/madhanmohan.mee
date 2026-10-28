// Shared tag helpers. Kept free of server-only imports so both the
// frontmatter schema and client components can use them.

const MAX_TAG_LENGTH = 32;

// "#Machine Learning" / "#MachineLearning" → "machine-learning"
export function normalizeTag(rawTag: string): string {
  return rawTag
    .trim()
    .replace(/^#+/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
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

// Obsidian inline tags: "#ml-notes" preceded by whitespace or line start.
// Requiring a leading letter skips headings ("# Title") and issue refs ("#12").
const INLINE_TAG_PATTERN = /(?<=^|\s)#([A-Za-z][\w/-]+)/g;
// Regions where "#" is code, not a tag
const NON_PROSE_PATTERN =
  /```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]*`|<(script|style)\b[\s\S]*?<\/\1>/gi;

// Applies `transformProse` to everything except frontmatter and code
function mapProse(
  markdown: string,
  transformProse: (prose: string) => string,
): string {
  const frontmatter = markdown.match(FRONTMATTER_PATTERN)?.[0] ?? '';
  const body = markdown.slice(frontmatter.length);

  let result = frontmatter;
  let proseStart = 0;
  for (const codeMatch of body.matchAll(NON_PROSE_PATTERN)) {
    result += transformProse(body.slice(proseStart, codeMatch.index));
    result += codeMatch[0];
    proseStart = codeMatch.index + codeMatch[0].length;
  }
  return result + transformProse(body.slice(proseStart));
}

export function extractInlineTags(markdown: string): string[] {
  const inlineTags: string[] = [];
  mapProse(markdown, (prose) => {
    for (const tagMatch of prose.matchAll(INLINE_TAG_PATTERN)) {
      inlineTags.push(tagMatch[1]);
    }
    return prose;
  });
  return normalizeTags(inlineTags);
}

// Deletes inline "#tag"s for the given tags; a line left holding only
// "Tags:" (or nothing) is dropped with it
export function removeInlineTags(markdown: string, tags: string[]): string {
  if (tags.length === 0) return markdown;
  const tagsToRemove = new Set(tags);

  return mapProse(markdown, (prose) =>
    prose
      .split('\n')
      .map((line) => {
        const strippedLine = line.replace(
          INLINE_TAG_PATTERN,
          (fullMatch, tagName) =>
            tagsToRemove.has(normalizeTag(tagName)) ? '' : fullMatch,
        );
        if (strippedLine === line) return line;
        return /^\s*(tags:)?\s*$/i.test(strippedLine)
          ? null
          : strippedLine.replace(/(\S)[ \t]{2,}/g, '$1 ').trimEnd();
      })
      .filter((line) => line !== null)
      .join('\n'),
  );
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
